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
  console.log(`privateKey: ${privateKey}`)

  event.userID = (!event.userID) ? wxContext.OPENID : event.userID
  event.sdkAppID = (!event.sdkAppID) ? config.sdkAppID : event.sdkAppID
  event.accountType = (!event.accountType) ? config.accountType : event.accountType
  
  let response = {
    code: 0,
    message: 'success',
    data: {
      ...event
    }
  }

  if (event.roomID) {
    let privateMapKey = genPrivateMapKey({
      userID: event.userID, 
      sdkAppID: event.sdkAppID, 
      accountType: event.accountType, 
      roomID: event.roomID, 
      priKey: privateKey
    })
  
    console.log(`privateMapKey: ${privateMapKey}`)
    response.data.privateMapKey = gzcompressSync(privateMapKey)
  }

  let userSig = genUserSig({
    userID: event.userID, 
    sdkAppID: event.sdkAppID, 
    accountType: event.accountType, 
    priKey: privateKey
  })
  console.log(`userSig: ${userSig}`)
  
  response.data.userSig = gzcompressSync(userSig)
  console.log(`response.userSig: ${response.userSig}`)

  return response
}