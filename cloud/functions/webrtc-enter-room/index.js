// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const webrtcRoomsCollection = db.collection('webrtcRooms')
const _ = db.command

const config = {
  maxMembers: 4,
  heartBeatTimeout: 20
}


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  /**
   * 进入房间
   * 查询 roomID
   * 存在则进入
   * 不存在则创建
   **/
  let userID = event.userID || wxContext.OPENID
  let roomInfo = {}
  let response = {}

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
    roomInfo = roomData.roomInfo
    if (roomInfo.members.length < config.maxMembers) {
      if (roomInfo.members.indexOf(userID) == -1){
        roomInfo.members.push(userID)
      }
      await webrtcRoomsCollection.doc(roomInfo._id).update({
        data: {
          members: roomInfo.members
        }
      })
        .then(res => {
          console.log(res)
          return res
        })
        .catch(err => {
          console.error(err)
          return err
        })
    } else {
      // 房间已满 5001
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
    console.log(createRoomData)
    roomInfo = createRoomData
    response.msg = 'create'
  }

  // 计算凭证，返回到小程序端
  let { result: signInfo } = await cloud.callFunction({
    name: 'webrtc-sig-api',
    data: {
      userID: userID,
      roomID: roomInfo.roomID
    }
  });
  console.log(signInfo)
  
  // 严格上需要通过webrtc-room组件进入房间成功后，才能写入房间信息
  
  return {
    roomInfo,
    signInfo
  }
}