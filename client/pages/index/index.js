// index.js
const app = getApp()

Page({
  data: {
    list: [
      {
        id: 'webrtc-room/join-room',
        name: '视频通话',
      },
      {
        id: 'webrtc-room/room-list',
        name: '房间列表',
      },
      // {
      //   id: 'webrtc-room-cloudfuns',
      //   name: '实时音视频云函数'
      // }
    ]
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '小程序·云开发体验',
      path: '/pages/index/index',
    }
  },

  jumpUrl(e) {
    const id = e.currentTarget.id
    const list = this.data.list

    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        console.log(list[i].id, id)
        wx.navigateTo({
          url: `/pages/${list[i].id}/index`
        })
        return
      }
    }
  }
})
