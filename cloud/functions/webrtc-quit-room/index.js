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

  let { result } = await cloud.callFunction({
    name: 'webrtc-get-room-info',
    data: {
      roomID: event.roomID
    }
  });
  console.log(result)
  let roomInfo = result.roomInfo
  let res
  if (!roomInfo) {
    return
  }

  // 删除成员
  deleteMember(roomInfo, event.userID)

  console.log(roomInfo.members)
  if (roomInfo.members.length === 0) {
    // 成员为0，删除房间
    res = await webrtcRoomsCollection.doc(roomInfo._id).remove()
      .then(res => {
        console.log(res)
        return res
      })
      .catch(err => {
        console.error(err)
        return err
      })
  } else {
    // 更新房间成员
    res = await webrtcRoomsCollection.doc(roomInfo._id).update({
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
  }
  return {
    roomInfo,
    res
  }
}