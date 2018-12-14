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
  let _res = []
  await webrtcRoomsCollection.where({
    roomID: roomID
  })
    .get()
    .then(res => {
      console.log('查询: ', res.data)
      _res = res.data
    })
  return _res.length > 0 ? true : false
}

// 房间信息
let _roomInfo = {
  creator: '', // 创建者ID
  roomID: '', // 房间id
  name: '', // 房间名
  type: '', // 房间类型
  privateMapKey: '', // 权限位
  members: []
}

// 云函数入口函数 
/**
 * 创建房间 返回privateMapKey 并启动webrtc-room 组件进入房间
 * @param event.name 房间名称
 * @description roomID 随机生成
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let roomInfo = {
    creator: event.userID || wxContext.OPENID,
    roomID: event.roomID || generateRoomID(),
    roomName: event.roomName,
    members: [],
    privateMapKey: '',
    createTime: new Date()
  }

  // 查询数据库 检查房间号是否存在，生成有效的roomID
  // await isRoomExist(roomInfo.roomID)
  while (await isRoomExist(roomInfo.roomID)) {
    roomInfo.roomID = generateRoomID()
  }

  // 获取凭证
  // const signInfo = await cloud.callFunction({
  //   name: 'webrtc-sig-api',
  //   data: {
  //     userID: roomInfo.creator,
  //     roomID: roomInfo.roomID
  //   }
  // });
  // console.log('signInfo', signInfo)
  // roomInfo.privateMapKey = signInfo.result.privateMapKey

  
  if (roomInfo.creator) {
    console.log('roomInfo.creator', roomInfo.creator)
    roomInfo.members.push(roomInfo.creator)
  }

  // 将房间信息写入数据库
  console.log('roomInfo', roomInfo)
  let result = await webrtcRoomsCollection.add({
    data: roomInfo
  })
    .then(res => {
      console.log(res)
      return res
    })
    .catch(err => {
      console.error(err)
      return err
    })

  return roomInfo

}