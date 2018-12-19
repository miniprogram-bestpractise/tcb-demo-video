// 云函数入口文件
const cloud = require('wx-server-sdk')
const uuid = require('./uuid')

cloud.init()

const db = cloud.database()
const webrtcRoomsCollection = db.collection('webrtcRooms')
const _ = db.command
// 房间名称由用户输入
// 生成随机room id
function generateRoomID() {
  return uuid(8, 10);
}
// 需检查该 roomid 是否存在
async function isRoomExist(roomID) {
  let {data} = await webrtcRoomsCollection.where({
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
    roomName: event.roomName,
    members: [],
    createTime: new Date()
  }

  // 循环检查数据，避免 generateRoomID 生成重复的roomID
  while (await isRoomExist(roomInfo.roomID)) {
    roomInfo.roomID = generateRoomID()
  }

  // if (await isRoomExist(roomInfo.roomID)) {
  //   // 如果这时生成的roomID是重复，将会出现两个roomID一样的记录，需要再次查询所以上面的逻辑用循环查询
  //   roomInfo.roomID = generateRoomID()
  // }
  

  if (roomInfo.creator) {
    roomInfo.members.push(roomInfo.creator)
  }

  // 将房间信息写入数据库
  let result = await webrtcRoomsCollection.add({
    data: roomInfo
  })

  console.log('roomInfo', roomInfo, result)
  return roomInfo
}