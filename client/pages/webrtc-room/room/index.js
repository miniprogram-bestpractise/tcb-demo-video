var webrtcroom = require('../../../utils/webrtcroom')
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: 'create', // enter
    template: 'float',
    webrtcroomComponent: null,
    roomID: '', // 房间id
    roomName: '', // 房间名称
    beauty: 5,
    muted: false,
    debug: false,
    frontCamera: true,
    userID: '',
    userSig: '',
    sdkAppID: '',
    roomCreator: '',
    comment: [],
    toview: null,
    isErrorModalShow: false,
    heartBeatFailCount: 0, //心跳失败次数
    autoplay: true,
    enableCamera: true,
    headerHeight: app.globalData.headerHeight,
    statusBarHeight: app.globalData.statusBarHeight,
  },

  /**
   * 监听房间事件
   */
  onRoomEvent: function (e) {
    var self = this;
    switch (e.detail.tag) {
      case 'error':
        if (this.data.isErrorModalShow) {
          return;
        }
        if (e.detail.code === -10) { // 进房失败，一般为网络切换的过程中
          this.data.isErrorModalShow = true;
          wx.showModal({
            title: '提示',
            content: e.detail.detail,
            confirmText: '重试',
            cancelText: '退出',
            success: function (res) {
              self.data.isErrorModalShow = false
              if (res.confirm) {
                self.joinRoom();
              } else if (res.cancel) { //
                self.goBack();
              }
            }
          });
        } else {
          // 在房间内部才显示提示
          console.error("error:", e.detail.detail);
          var pages = getCurrentPages();
          console.log(pages, pages.length, pages[pages.length - 1].__route__);
          if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/webrtc-room-demo/room/room')) {
            this.data.isErrorModalShow = true;
            wx.showModal({
              title: '提示',
              content: e.detail.detail,
              showCancel: false,
              complete: function () {
                self.data.isErrorModalShow = false
                pages = getCurrentPages();
                if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/webrtc-room-demo/room/room')) {
                  wx.showToast({
                    title: `code:${e.detail.code} content:${e.detail.detail}`
                  });
                  wx.navigateBack({
                    delta: 1
                  });
                }
              }
            });
          }
        }
        break;
    }
  },

  /**
   * 切换摄像头
   */
  changeCamera: function () {
    this.data.webrtcroomComponent.switchCamera();
    this.setData({
      frontCamera: !this.data.frontCamera
    })
  },
  onEnableCameraClick: function () {
    this.data.enableCamera = !this.data.enableCamera;
    this.setData({
      enableCamera: this.data.enableCamera
    });
  },
  /**
   * 设置美颜
   */
  setBeauty: function () {
    this.data.beauty = (this.data.beauty == 0 ? 5 : 0);
    this.setData({
      beauty: this.data.beauty
    });
  },

  /**
   * 切换是否静音
   */
  changeMute: function () {
    this.data.muted = !this.data.muted;
    this.setData({
      muted: this.data.muted
    });
  },

  /**
   * 是否显示日志
   */
  showLog: function () {
    this.data.debug = !this.data.debug;
    this.setData({
      debug: this.data.debug
    });
  },

  /**
   * 返回上一页
   */
  goBack() {
    var pages = getCurrentPages();
    if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/webrtc-room-demo/room/room')) {
      wx.navigateBack({
        delta: 1
      });
    }
  },

  /**
   * 进入房间
   */
  joinRoom() {
    console.log('room.js onLoad');
    var time = new Date();
    time = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
    console.log('*************开始多人音视频：' + time + '**************');

    // webrtcComponent
    this.data.webrtcroomComponent = this.selectComponent('#webrtcroom');
    var self = this;
    wx.showToast({
      icon: 'none',
      title: '获取登录信息中'
    });

    webrtcroom.enterRoom({
      userID: self.data.userID, 
      roomID: self.data.roomID,
      roomName: self.data.roomName
    },
    function (res) {
      // console.log('进入房间', res)
      self.setData({
        roomID: res.roomInfo.roomID,
        userID: res.signInfo.userID,
        userSig: res.signInfo.userSig,
        sdkAppID: res.signInfo.sdkAppID,
        privateMapKey: res.signInfo.privateMapKey
      }, function () {
        self.data.webrtcroomComponent.start();
      })
    },
    function (res) {
      console.error(self.data.ERROR_CREATE_ROOM, '进入房间失败')
      self.onRoomEvent({
        detail: {
          tag: 'error',
          code: -999,
          // detail: '进入房间失败[' + res.errCode + ';' + res.errMsg + ']'
          detail: '进入房间失败'
        }
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userID: wx.getStorageSync('webrtc_room_userid')
    });
    this.setData({
      username: options.userName || '',
      roomID: options.roomID || '',
      roomName: options.roomName,
      roomCreator: options.roomCreator || this.data.userID,
      template: options.template || this.data.template,
      type: options.type || this.data.type
    });
    this.joinRoom();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 设置房间标题
    wx.setNavigationBarTitle({
      title: this.data.roomName
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    console.log('room.js onShow');
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var self = this;
    console.log('room.js onHide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('room.js onUnload');
    webrtcroom.quitRoom(this.data.userID, this.data.roomID);
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
      // title: '',
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