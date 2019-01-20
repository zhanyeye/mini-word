// miniprogram/pages/welcome/welcome.js
Page({
  data: {},

  onTap: function() {
    wx.switchTab({
      url: "../essays/essay"
    })
  }
})