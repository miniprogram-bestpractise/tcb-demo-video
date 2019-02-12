// eslint-disable-next-line no-unused-vars
const regeneratorRuntime = require('../libs/runtime.js')

const webrtcroom = {

  // 获取房间列表
  async getRoomList(index, count) {
    let { result } = await wx.cloud.callFunction({
      name: 'webrtcroom-get-room-list',
      data: {
        skip: index,
        limit: count
      }
    })

    return result
  },

  /**
   * 进入房间，默认userID使用openID， roomID如果不存在则随机生成，存在则进入房间
   * @param {Object} params - 
   * @param {String=} params.userID - option, default openID
   * @param {String=} params.roomID - option
   * @param {String=} params.roomName - option
   */
  async enterRoom(params) {
    let { result } = await wx.cloud.callFunction({
      name: 'webrtcroom-enter-room',
      data: {
        ...params
      }
    })

    return result
  },

  // 退出房间
  async quitRoom(userID, roomID) {
    let { result } = await wx.cloud.callFunction({
      name: 'webrtcroom-quit-room',
      data: {
        roomID,
        userID
      }
    })

    return result
  }

}

module.exports = webrtcroom