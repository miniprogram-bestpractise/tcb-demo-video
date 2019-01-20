// eslint-disable-next-line no-unused-vars
const regeneratorRuntime = require('../../../libs/runtime')
const liveroom = require('../../../libs/liveroom')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomList: []
  },

  /**
	 * 创建房间，进入创建页面
	 * @return {[type]} [description]
	 */
  create() {
    // 防止两次点击操作间隔太快
    let nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }

    let url = '../join-room/index'
    wx.navigateTo({
      url: url
    })
    
    this.setData({ 'tapTime': nowTime });
  },

  /**
   * 获取直播房间列表
   */
  async getRoomList() {
    try {
      let result = await liveroom.getRoomList()

      if (!result || result.code) {
        throw new Error(result.errMsg)
      }

      this.setData({
        roomList: result.data
      })

    }
    catch (e) {
      console.log(e)
      wx.showToast({
        title: '拉取列表失败，请重试',
        icon: 'none'
      })
    }
  },

  /**
   * 进入房间
   */
  goRoom(e) {
    let dataset = e.currentTarget.dataset
    console.log(dataset)
    let url = `../room/index?roomID=${dataset.roomid}&roomName=${dataset.roomname}`

    wx.navigateTo({
      url: url
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRoomList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    setTimeout(() => {
      this.getRoomList()
    }, 2000)
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