// eslint-disable-next-line no-unused-vars
const regeneratorRuntime = require('../libs/runtime.js')
var config = require('./config.js');

var webrtcroom = {
  serverDomain: config.webrtcServerUrl,
  requestNum: 0,
  heart: '', // 判断心跳变量
  heartBeatReq: null,
  requestSeq: 0, // 请求id
  requestTask: [], // 请求task

  /**
   * [request 封装request请求]
   * @param {options}
   *   url: 请求接口url
   *   data: 请求参数
   *   success: 成功回调
   *   fail: 失败回调
   *   complete: 完成回调
   */
  request: function (options) {
    var self = this;
    self.requestNum++;
    var req = wx.request({
      url: self.serverDomain + options.url,
      data: options.data || {},
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      // dataType: 'json',
      success: function (res) {
        if (res.data.code) {
          console.error('服务器请求失败' + ', url=' + options.url + ', params = ' + (options.data ? JSON.stringify(options.data) : '') + ', 错误信息=' + JSON.stringify(res));
          options.fail && options.fail({
            errCode: res.data.code,
            errMsg: res.data.message
          })
          return;
        }
        options.success && options.success(res);
      },
      fail: function (res) {
        console.error('请求失败' + ', url=' + options.url + ', 错误信息=' + JSON.stringify(res));
        options.fail && options.fail(res);
      },
      complete: options.complete || function () {
        self.requestNum--;
        // console.log('complete requestNum: ',requestNum);
      }
    });
    self.requestTask[self.requestSeq++] = req;
    return req;
  },

  /**
   * [clearRequest 中断请求]
   * @param {options}
   */
  clearRequest: function () {
    var self = this;
    for (var i = 0; i < self.requestSeq; i++) {
      self.requestTask[i].abort();
    }
    self.requestTask = [];
    self.requestSeq = 0;
  },


  async getLoginInfo (userID, success, fail) {
    try {
      let { result } = await wx.cloud.callFunction({
        name: 'webrtc-sig-api',
        data: {
          userID
        }
      });
      if (result && !result.code) {
        success && success(result);
      } else {
        fail && fail(result);
      }
    }
    catch (e) {
      fail(e);
    }
  },

  async getRoomList (index, count, success, fail) {
    try {
      let { result } = await wx.cloud.callFunction({
        name: 'webrtc-get-room-list',
        data: {
          skip: index,
          limit: count
        }
      });
      
      if (result && !result.code) {
        success && success(result);
      } else {
        fail && fail(result);
      }
    }
    catch (e) {
      fail(e);
    }

  },
  /**
   * 进入房间，默认userID使用openID， roomID如果不存在则随机生成，存在则进入房间
   * @param {object} params - 
   * @param {string=} params.userID - option, default openID
   * @param {string=} params.roomID - option
   * @param {string=} params.roomName - option
   * @param {funtion} success 
   * @param {funtion} fail 
   */
  async enterRoom(params, success, fail) {
    try {
      let { result } = await wx.cloud.callFunction({
        name: 'webrtc-enter-room',
        data: {
          ...params
        }
      });
      if (result && !result.code) {
        success && success(result);
      } else {
        fail && fail(result);
      }
    }
    catch (e) {
      fail && fail(e);
    }
  },

  async quitRoom (userID, roomID, success, fail) {
    try {
      let { result } = await wx.cloud.callFunction({
        name: 'webrtc-quit-room',
        data: {
          roomID,
          userID
        }
      });
      if (result && !result.code) {
        success && success(result);
      } else {
        fail && fail(result);
      }
    }
    catch (e) {
      fail && fail(e);
    }
  }

}

module.exports = webrtcroom