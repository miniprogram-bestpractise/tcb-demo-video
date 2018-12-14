// webrtc 音视频
// eslint-disable-next-line no-unused-vars
const regeneratorRuntime = require('../../libs/runtime')
const app = getApp()

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    autoplay: true,
    enableCamera: true,
    roomID: '',
    userID: '',
    roomCreator: '',
    userSig: '',
    sdkAppID: '',
    accountType: '',
    privateMapKey: '',
    beauty: 5,
    muted: false,
    debug: false,

  },

  onLoad() {
    //this.onGetUserSig();
  },

  async onGetUserSig() {
    try {
      const {
        result
      } = await wx.cloud.callFunction({
        name: 'webrtc-sig-api',
        data: {
          roomID: '9527'
        }
      });

      console.log(result);
      this.setData({
        accountType: result.accountType,
        privateMapKey: result.privateMapKey,
        sdkAppID: result.sdkAppID,
        roomID: result.roomID,
        userID: result.userID,
        userSig: result.userSig
      }, () => {
        this.data.webrtcroomComponent = this.selectComponent('#webrtcroom')
        // this.data.webrtcroomComponent.start();
      })
    }
    catch (e) {
      console.log(e);
    }
  },

  async createRoom() {

    let roomName = Math.floor(Math.random() * 9527) // 用户输入房间名称， 房间ID由云函数随机生成
    try {
      const {
        result
      } = await wx.cloud.callFunction({
        name: 'webrtc-create-room',
        data: {
          roomName: roomName, // 房间名
        }
      })
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  },

  async enterRoom() {

    let roomName = Math.floor(Math.random() * 9527) // 用户输入房间名称， 房间ID由云函数随机生成
    try {
      const {
        result
      } = await wx.cloud.callFunction({
        name: 'webrtc-enter-room',
        data: {
          // userID: 'hehe',
          roomID: '89247493',
          roomName: roomName
        }
      })
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  },

  async getRoomList() {
    try {
      const {
        result
      } = await wx.cloud.callFunction({
        name: 'webrtc-get-room-list',
        data: {
          skip: 0,
          limit: 10
        }
      })
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  },

  async getRoomInfo() {
    try {
      const {
        result
      } = await wx.cloud.callFunction({
        name: 'webrtc-get-room-info',
        data: {
          roomID: '08327558'
        }
      })
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  },

  async quitRoom() {
    try {
      const {
        result
      } = await wx.cloud.callFunction({
        name: 'webrtc-quit-room',
        data: {
          roomID: '68428185',
          userID: 'o1YH64kvN1vVH4hvMOlgvHLZ7m02'
        }
      })
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  },

  onRoomEvent(e) {
    console.log(e)
  },

  onIMEvent() {

  }

})
