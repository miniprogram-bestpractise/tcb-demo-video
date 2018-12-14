const {
  genPrivateMapKey,
  gzcompressSync,
  genUserSig
} = require('./WebRTCSigApi')
// 云函数入口文件
const cloud = require('wx-server-sdk')
const config = require('./config')

cloud.init()

// 云函数入口函数
/**
   * event: {
   *  userID
   *  sdkAppID
   *  accountType
   *  roomID
   * } 
   */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  // private_key 不能被下载
  let privateKey = config.privateKey;
  console.log('privateKey: ' + privateKey)

  event.userID = (!event.userID) ? wxContext.OPENID : event.userID
  event.sdkAppID = (!event.sdkAppID) ? config.sdkAppID : event.sdkAppID
  event.accountType = (!event.accountType) ? config.accountType : event.accountType
  
  let res = {
    ...event
  }

  if (event.roomID) {
    let privateMapKey = genPrivateMapKey(event.userID, event.sdkAppID, event.accountType, event.roomID, privateKey)
    console.log('privateMapKey: ' + privateMapKey)
    res.privateMapKey = gzcompressSync(privateMapKey)
  }

  let userSig = genUserSig(event.userID, event.sdkAppID, event.accountType, privateKey)
  console.log('userSig: ' + userSig)
  res.userSig = gzcompressSync(userSig)
  console.log('res.userSig: ' + res.userSig)
  return res
}