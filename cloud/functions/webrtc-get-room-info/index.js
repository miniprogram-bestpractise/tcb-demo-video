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
    .then(res => {
      console.log(res)
      if (res.data.length > 0){
        res.roomInfo = res.data[0]
      }
      return res
    })
    .catch(err => {
      console.error(err)
      return err
    })

  return result
  
}