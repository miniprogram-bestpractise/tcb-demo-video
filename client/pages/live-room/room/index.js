// client/pages/live-room/room/index.js
// eslint-disable-next-line no-unused-vars
const regeneratorRuntime = require('../../../libs/runtime')
let plugin = requirePlugin('liveRoomPlugin')
const liveroom = require('../../../libs/liveroom')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveAppID: '',
    roomID: '',
    roomName: '',
    userID: '',
    pushUrl: null,
    playUrl: null,
    orientation: 'vertical',
    muted: false,
    mode: 'SD',
    waitingImage: '',
    
    enableCamera: true,
    enableIM: false,
    beauty: 0,
    whiteness: 0,
    backgroundMute: false,
    debug: false,
    autoFocus: true,
    aspect: '9:16',
    minBitrate: 200,
    maxBitrate: 1000,
    zoom: false,
    devicePosition: 'front',
    isPushShow: false,
    isPlayShow: false,

    objectFit: 'contain',
    minCache: 1,
    maxCache: 3,

    waitingImage: 'https://main.qcloudimg.com/raw/4518d7dd552b3b3fdaff5dfcbb74a52d.gif',
  },

  /**
   * 切换摄像头
   */
  changeCamera: function () {
    let liveRoomPushComponent = plugin.instance.getLiveRoomPushInstance()
    liveRoomPushComponent.switchCamera()
    this.setData({
      devicePosition: (this.data.devicePosition === 'font') ? 'back' : 'font'
    })
  },

  onEnableCameraClick: function () {
    this.setData({
      enableCamera: !this.data.enableCamera
    });
  },

  /**
   * 设置美颜
   */
  setBeauty: function () {
    let beauty = (this.data.beauty == 0 ? 5 : 0);
    this.setData({
      beauty
    });
  },

  /**
   * 切换是否静音
   */
  changeMute: function () {
    this.setData({
      muted: !this.data.muted
    });
  },

  /**
   * 是否显示日志
   */
  showLog: function () {
    this.setData({
      debug: !this.data.debug
    });
  },

  async getRoomInfo(roomID) {
    try {
      let { result } = await wx.cloud.callFunction({
        name: 'liveroom-get-room-info',
        data: {
          roomID
        }
      })

      return result
    }
    catch(e) {
      return null
    }

    await liveroom.quitRoom(this.data.roomID)
  },

  async quitRoom() {
    let result = await liveroom.quitRoom(this.data.roomID)
    
    if (!result.code) {
      wx.showToast({
        title: '退出房间成功',
        icon: 'none'
      })
    }
  },

  bindPushEvent(e) {
    console.log(e)
  },

  bindPlayEvent(e) {
    console.log(e)
  },

  async joinRoom() {
    
    wx.showToast({
      icon: 'none',
      title: '房间初始化中'
    });

    let {
      roomID,
      roomName
    } = this.data

    try {
      let res = await liveroom.enterRoom({
        roomID,
        roomName,
      })

      if (!res || res.code) {
        console.log(res)
        throw new Error(res.errMsg)
      }

      console.log('进入房间', res)

      let {
        roomInfo = {}
      } = res.data

      console.log(roomInfo)

      let isCreator = roomInfo.userID === roomInfo.creator

      this.setData({
        roomID: roomInfo.roomID,
        roomName: roomInfo.roomName,
        userID: roomInfo.userID,
        liveAppID: roomInfo.liveAppID,
        pushUrl: isCreator ? roomInfo.pushUrl : null,
        playUrl: isCreator ? null : roomInfo.playUrl[0],
        isPushShow: isCreator ? true : false,
        isPlayShow: isCreator ? false : true
      }, () => {
        if (isCreator) {
          let liveRoomPushComponent = plugin.instance.getLiveRoomPushInstance();
          liveRoomPushComponent.start()
        }
        else {
          let liveRoomComponent = plugin.instance.getLiveRoomInstance();
          liveRoomComponent.start()
        }

        // 设置房间标题
        wx.setNavigationBarTitle({
          title: `${roomInfo.roomName}`
        })
      })
    }
    catch (e) {
      console.error(e, '进入房间失败')
      // this.bindRoomEvent({
      //   detail: {
      //     tag: 'error',
      //     code: 20001,
      //     detail: '进入房间失败'
      //   }
      // })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log(options)
    let {
      roomID,
      roomName,
      pureAudio,
    } = options

    pureAudio = pureAudio === 'false' ? false : true

    this.setData({
      roomID,
      roomName,
      enableCamera: !pureAudio
    }, async () => {
      await this.joinRoom()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.quitRoom()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '小程序·云开发音视频解决方案',
      path: '/pages/index/index',
    }
  }
})