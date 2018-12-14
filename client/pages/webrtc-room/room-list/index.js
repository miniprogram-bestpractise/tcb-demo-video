var webrtcroom = require('../../../utils/webrtcroom.js');

Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    roomName: '',
    roomList: [],
    userName: '',
    firstshow: true, // 第一次显示页面
    tapTime: '',
    tapJoinRoom: false
  },

  // 拉取房间列表
  getRoomList: function (callback) {
    var self = this;
    webrtcroom.getRoomList(0, 20, function (res) {
      console.log('拉取房间列表成功:', res);
      if (res.data) {
        self.setData({
          roomList: res.data
        });
      }
    }, function (res) { });
  },

  // 创建房间，进入创建页面
  create: function () {
    var self = this;
    // 防止两次点击操作间隔太快
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    var url = '../join-room/index?type=createByName&roomName=' + self.data.roomName + '&userName=' + self.data.userName;
    wx.navigateTo({
      url: url
    });
    self.setData({
      'tapTime': nowTime
    });
  },

  // 进入webrtcroom页面
  goRoom: function (e) {
    // 防止两次点击操作间隔太快
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }

    var url = '../room/index?type=enter&roomID=' + e.currentTarget.dataset.roomid + '&roomName=' + e.currentTarget.dataset.roomname + '&roomCreator=' + e.currentTarget.dataset.roomcreator;
    if (!this.data.tapJoinRoom) { // 如果没有点击进入房间
      this.data.tapJoinRoom = true;
      wx.navigateTo({
        url: url,
        complete: () => {
          this.data.tapJoinRoom = false; // 不管成功还是失败，重置tapJoinRoom
        }
      });
    }
    this.setData({
      'tapTime': nowTime
    });
  },


	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {
    this.getRoomList();
  },

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
  onReady: function () {
    var self = this;
    console.log(this.data);
    var systemInfo = wx.getSystemInfoSync();
    console.info('系统消息:', systemInfo);
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
  onUnload: function () { },

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
  onPullDownRefresh: function () {
    this.getRoomList(function () { });
    wx.stopPullDownRefresh();
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
      // title: '',
      // path: '/pages/multiroom/roomlist/roomlist',
      path: '/pages/main/main',
      imageUrl: 'https://mc.qcloudimg.com/static/img/dacf9205fe088ec2fef6f0b781c92510/share.png'
    }
  }
})