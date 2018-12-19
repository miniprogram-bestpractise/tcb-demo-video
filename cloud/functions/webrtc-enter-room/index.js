// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const webrtcRoomsCollection = db.collection('webrtcRooms')
const _ = db.command

const config = {
  maxMembers: 4, // 单个房间最大人数
  heartBeatTimeout: 20
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let userID = event.userID || wxContext.OPENID
  let response = {}
  if (event.roomID && !/^[0-9]{1,11}$/.test(event.roomID)) {
    response.code = '12'
    response.msg = 'roomID数值必须是int型'
    return response
  }
  // 查询房间是否存在
  let {result: roomData} = await cloud.callFunction({
    name: 'webrtc-get-room-info',
    data: {
      roomID: event.roomID
    }
  });
  console.log(roomData, userID)
  if (roomData.roomInfo) {
    // enter 进入房间，增加房间成员
    let roomInfo = roomData.roomInfo
    if (roomInfo.members.length < config.maxMembers) {
      if (roomInfo.members.indexOf(userID) == -1){
        roomInfo.members.push(userID)
      }
      await webrtcRoomsCollection.doc(roomInfo._id).update({
        data: {
          members: roomInfo.members
        }
      })
      response.roomInfo = roomInfo
      response.msg = 'enter'
    } else {
      // 房间已满 5001
      response.code = '5001'
      response.msg = '超出房间人数上限'
      return response
    }
  } else {
    // create 当前用户成为创建者
    let { result: createRoomData } = await cloud.callFunction({
      name: 'webrtc-create-room',
      data: {
        userID: userID,
        roomID: event.roomID,
        roomName: event.roomName
      }
    });
    response.roomInfo = createRoomData
    response.msg = 'create'
  }

  // 计算凭证，返回到小程序端
  let { result: signInfo } = await cloud.callFunction({
    name: 'webrtc-sig-api',
    data: {
      userID: userID,
      roomID: response.roomInfo.roomID
    }
  })
  response.signInfo = signInfo
  console.log(response)
  
  return response
}