// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const webrtcRoomsCollection = db.collection('webrtcRooms')
const _ = db.command

function deleteMember(roomInfo, userID) {
  let index = roomInfo.members.indexOf(userID)
  if (index > -1) {
    roomInfo.members.splice(index, 1)
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 退出房间，删除对应的members
  // event.userID
  // event.roomID
  let response = {}

  if (!event.userID || !event.roomID) {
    response.code = 2
    response.msg = '请求失败，缺少参数'
    return response
  }
  let { result } = await cloud.callFunction({
    name: 'webrtc-get-room-info',
    data: {
      roomID: event.roomID
    }
  });

  let roomInfo = result.roomInfo
  let res

  if (!roomInfo) {
    response.code = 3
    response.msg = '请求失败，房间不存在'
    return response
  }

  // 删除成员
  deleteMember(roomInfo, event.userID)
  
  if (roomInfo.members.length === 0) {
    // 成员为0，删除房间
    res = await webrtcRoomsCollection.doc(roomInfo._id).remove()
  } else {
    // 更新房间成员
    res = await webrtcRoomsCollection.doc(roomInfo._id).update({
      data: {
        members: roomInfo.members
      }
    })
  }
  response.roomInfo = roomInfo
  response.res = res

  console.log(response)
  return response
}