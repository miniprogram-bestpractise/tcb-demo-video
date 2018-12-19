// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const webrtcRoomsCollection = db.collection('webrtcRooms')
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
    // 从数据库拉取房间信息
  let result = await webrtcRoomsCollection
    .where({
      roomID: event.roomID
    })
    .get()

  if (result.data && result.data.length > 0) {
    result.roomInfo = result.data[0]
  }

  return result
  
}