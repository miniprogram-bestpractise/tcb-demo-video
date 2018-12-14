const app = getApp()
let webrtcroom = require('../../../utils/webrtcroom.js');

Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    roomName: '',
    roomNo: '',
    userName: '',
    tapTime: '',
    template: 'float',
    headerHeight: app.globalData.headerHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    lc: "◀︎",
    type: 'createByID' // createByName
  },
  // 绑定输房间号入框
  bindRoomNo: function (e) {
    this.setData({
      roomNo: e.detail.value
    });
  },
  bindRoomName: function (e) {
    this.setData({
      roomName: e.detail.value
    });
  },
  radioChange: function (e) {
    // this.data.template = e.detail.value;
    this.setData({
      template: e.detail.value
    })
    console.log('this.data.template', this.data.template)
  },
  // 进入rtcroom页面
  joinRoom: function () {

    // 防止两次点击操作间隔太快
    let nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    
    if (this.data.type === 'createByID'){
      if (!this.data.roomNo) {
        wx.showToast({
          title: '请输入房间号',
          icon: 'none',
          duration: 2000
        })
        return

      }
      if (/^\d\d+$/.test(this.data.roomNo) === false) {
        wx.showToast({
          title: '只能为数字',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
  
    if (this.data.type === 'createByName' && !this.data.roomName) {
      wx.showToast({
        title: '请输入房间名称',
        icon: 'none',
        duration: 2000
      })
      return
    }

    let url = '../room/index?type=create&roomID=' + this.data.roomNo + '&roomName=' + this.data.roomName + '&template=' + this.data.template + '&userName=' + this.data.userName;
    wx.navigateTo({
      url: url
    });
    wx.showToast({
      title: '进入房间',
      icon: 'success',
      duration: 1000
    })
    this.setData({ 'tapTime': nowTime });
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {
    this.setData({
      userName: options.userName || '',
      type: options.type || this.data.type
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
      path: '/pages/main/main',
      imageUrl: 'https://mc.qcloudimg.com/static/img/dacf9205fe088ec2fef6f0b781c92510/share.png'
    }
  },
  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },
})