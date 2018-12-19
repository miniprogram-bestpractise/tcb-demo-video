// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const webrtcRoomsCollection = db.collection('webrtcRooms')
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 从数据库拉取房间列表
  let result = await webrtcRoomsCollection
    .skip(event.skip || 0)
    .limit(event.limit || 10)
    .get()
    
  return result
}