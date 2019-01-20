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

      const {
        accountType,
        privateMapKey,
        sdkAppID,
        roomID,
        userID,
        userSig
      } = result.data

      console.log(result);
      this.setData({
        accountType,
        privateMapKey,
        sdkAppID,
        roomID,
        userID,
        userSig
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
          roomID: '92767245'
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
          roomID: '30068667',
          userID: 'o6CDX5TRWZ1SthpGX2FTLG_NWXFE'
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
