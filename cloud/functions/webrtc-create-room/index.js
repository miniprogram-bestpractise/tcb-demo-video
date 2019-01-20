// 云函数入口文件
const cloud = require('wx-server-sdk')
const uuid = require('./uuid')

cloud.init()

const db = cloud.database()
const roomsCollection = db.collection('webrtcRooms')
const _ = db.command

// 随机生成 roomID
function generateRoomID() {
  return uuid(8, 10);
}
// 需检查该 roomid 是否存在
async function isRoomExist(roomID) {
  let { data } = await roomsCollection.where({
      roomID: roomID
    })
    .get()
  console.log('查询', data)
  return data.length > 0 ? true : false
}

// 云函数入口函数 
/**
 * 创建房间 返回privateMapKey 并启动webrtc-room 组件进入房间
 * @param event.roomName 房间名称
 * @description roomID 可以随机生成
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let roomInfo = {
    creator: event.userID || wxContext.OPENID,
    roomID: event.roomID || generateRoomID(),
    members: [],
    createTime: new Date()
  }

  // 循环检查数据，避免 generateRoomID 生成重复的roomID
  while (await isRoomExist(roomInfo.roomID)) {
    roomInfo.roomID = generateRoomID()
  }

  roomInfo.roomName = event.roomName || `房间 ${roomInfo.roomID}`
  
  if (roomInfo.creator) {
    roomInfo.members.push(roomInfo.creator)
  }

  // 将房间信息写入数据库
  let result = await roomsCollection.add({
    data: roomInfo
  })

  console.log('roomInfo', roomInfo, result)

  let response = {
    code: 0,
    message: 'success',
    data: roomInfo
  }

  return response
}