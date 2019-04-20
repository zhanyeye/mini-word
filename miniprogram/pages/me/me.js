var app = getApp()

Page({
  showMyWord: function () {
  },
  showClause: function () {
    wx.navigateTo({
      url: './clause/clause',
      success: function (res) {
      },
      fail: function () {
      },
      complete: function () {
      }
    })
  },
  showHelp: function () {
    wx.navigateTo({
      url: './help/help',
      success: function (res) {
      },
      fail: function () {
      },
      complete: function () {
      }
    })
  },
  showFeedback: function () {
    wx.showModal({
      title: '提示',
      content: '此功能暂未开放，敬请期待！',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定')
        }
      }
    })
  }
})