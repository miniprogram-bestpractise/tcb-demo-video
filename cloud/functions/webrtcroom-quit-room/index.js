// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const webrtcRoomsCollection = db.collection('webrtcRooms')

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
  let response = {
    code: 0,
    message: 'success',
    data: {}
  }

  if (!event.userID || !event.roomID) {
    response.code = 10001
    response.message = '请求失败，缺少参数'
    return response
  }
  let { result } = await cloud.callFunction({
    name: 'webrtcroom-get-room-info',
    data: {
      roomID: event.roomID
    }
  });

  let roomInfo = result.data
  let status = null

  if (!roomInfo) {
    response.code = 10002
    response.message = '请求失败，房间不存在'
    return response
  }

  // 删除成员
  deleteMember(roomInfo, event.userID)
  
  if (roomInfo.members.length === 0) {
    // 成员为0，删除房间
    status = await webrtcRoomsCollection.doc(roomInfo._id).remove()
  } else {
    // 更新房间成员
    status = await webrtcRoomsCollection.doc(roomInfo._id).update({
      data: {
        members: roomInfo.members
      }
    })
  }
  response.data = roomInfo
  response.data.status = status

  console.log(response)
  return response
}