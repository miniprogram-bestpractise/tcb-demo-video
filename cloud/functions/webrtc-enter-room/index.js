// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const roomsCollection = db.collection('webrtcRooms')
const _ = db.command

const config = {
  maxMembers: 2, // 单个房间最大人数
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let userID = event.userID || wxContext.OPENID
  let response = {
    data: {}
  }
  
  if (event.roomID && !/^[0-9]{1,11}$/.test(event.roomID)) {
    response.code = '10002'
    response.message = 'roomID数值必须是整数'
    return response
  }

  // 查询房间是否存在
  let { result: roomData } = await cloud.callFunction({
    name: 'webrtc-get-room-info',
    data: {
      roomID: event.roomID
    }
  })

  console.log(roomData, userID)

  if (roomData.data) {
    // enter 进入房间，增加房间成员
    let roomInfo = roomData.data
    
    if (roomInfo.members.length < config.maxMembers) {
      if (roomInfo.members.indexOf(userID) == -1){
        roomInfo.members.push(userID)
      }
      await roomsCollection.doc(roomInfo._id).update({
        data: {
          members: roomInfo.members
        }
      })
      response.data.roomInfo = roomInfo
      response.message = 'enter success'
    } else {
      // 房间已满 5001
      response.code = '10005'
      response.message = '超出房间人数上限'
      return response
    }
  }
  else {
    // create 当前用户成为创建者
    let { result: createRoomData } = await cloud.callFunction({
      name: 'webrtc-create-room',
      data: {
        userID: userID,
        roomID: event.roomID,
        roomName: event.roomName
      }
    });
    response.data.roomInfo = createRoomData.data
    response.message = 'create success'
  }

  // 计算凭证，返回到小程序端
  let { result: signInfo } = await cloud.callFunction({
    name: 'webrtc-sig-api',
    data: {
      userID: userID,
      roomID: response.data.roomInfo.roomID
    }
  })
  response.data.signInfo = signInfo.data || {}
  
  return response
}