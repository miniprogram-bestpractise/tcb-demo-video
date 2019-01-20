// eslint-disable-next-line no-unused-vars
const regeneratorRuntime = require('../../../libs/runtime')
const liveroom = require('../../../libs/liveroom')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomName: '',   // 房间名称
    userName: '',   // 用户名称
    pureAudio: false,
    tapTime: '',    // 防止两次点击操作间隔太快
  },

  // 绑定输入框
  bindRoomName(e) {
    this.setData({
      roomName: e.detail.value
    });
  },

  tapVideo() {
    this.setData({
      pureAudio: false
    });
  },

  tapAudio() {
    this.setData({
      pureAudio: true
    });
  },

  // 进入rtcroom页面
  async joinRoom() {
    // 防止两次点击操作间隔太快
    let nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }

    if (/[<>*{}()^%$#@!~&= ]/.test(this.data.roomName)
        || !this.data.roomName) {
      wx.showModal({
        title: '提示',
        content: '名称不能为空或包含特殊字符',
        showCancel: false
      })
      return
    }

    try {
      let result = await liveroom.createRoom(this.data.roomName)
      
      if (!result || result.code) {
        throw new Error(result.errMsg)
      }

      let {
        roomID,
        roomName,
        creator
      } = result.data

      let url = `../room/index?roomID=${roomID}&roomName=${roomName}&userName=${creator}&pureAudio=${this.data.pureAudio}`

      wx.redirectTo({
        url: url
      })
    
      this.setData({ 'tapTime': nowTime });
    }
    catch(e) {
      wx.showToast({
        title: '创建房间失败，请重试',
        icon: 'none',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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