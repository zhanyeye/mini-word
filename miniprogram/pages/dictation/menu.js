var app = getApp()
Page({

  data: {
    open: false,
    open2: false,
    imgsrc: '/images/icon/dropdown.jpg',
    mode: 'aspectFit',
    userInfo: {}
  },

  showitem: function(options) {
    this.setData({
      open: !this.data.open
    })
  },

  showitem2: function(options) {
    this.setData({
      open2: !this.data.open2
    })
  },
  showWord: function(event) {
    wx.navigateTo({
      url: './listening/audio?book=' + event.currentTarget.dataset.book + '&&part=' + event.currentTarget.dataset.part,
      success: function(res) {
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }

})