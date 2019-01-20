Page({
	/**
	 * 页面的初始数据
	 */
  data: {
    roomName: '',
    roomNo: '',
    tapTime: '',
    template: '1v1bigsmall',
  },

  // 绑定输房间号输入框
  bindRoomNo: function (e) {
    this.setData({
      roomNo: e.detail.value
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
  joinRoom() {
    // 防止两次点击操作间隔太快
    let nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    
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

    let url = `../room/index?roomID=${this.data.roomNo}&roomName=${this.data.roomName}&template=${this.data.template}`

    wx.navigateTo({
      url: url
    })

    this.setData({ 'tapTime': nowTime })
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad(options) {
    
  },

	/**
	 * 用户点击右上角分享
	 */
  onShareAppMessage: function () {
    return {
      title: '小程序·云开发音视频解决方案',
      path: '/pages/index/index',
    }
  },
})