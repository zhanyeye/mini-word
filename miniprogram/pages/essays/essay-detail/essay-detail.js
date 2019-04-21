// miniprogram/pages/essays/essay-detail/essay-detail.js

Page({
  data: {},

  onShareAppMessage: function() {
    return {
      title: '自定义转发标题',
      path: '/index/index?id=123'
    }
  },

  onShareTap: function(event) {
    console.log("hhhh");
    wx.showToast({
      title: "点赞成功",
      duration: 500,
      icon: "success"
    })
  },

  onCollectionTap: function(event) { //点击收藏按钮
    var essays_Collected = wx.getStorageSync('essays_collected')
    var essayCollected = essays_Collected[this.data.currentEssayId]
    essayCollected = !essayCollected
    essays_Collected[this.data.currentEssayId] = essayCollected

    wx.setStorageSync('essays_collected', essays_Collected) //更新文章的缓存值
    this.setData({ //跟新数据绑定变量
      collected: essayCollected
    })
    wx.showToast({
      title: essayCollected ? "收藏成功" : "取消成功",
      duration: 500,
      icon: "success"
    })
  },

  onLoad: function(options) {

    const db = wx.cloud.database() //数据库读取数据
    db.collection('essay-data').get({
      success: res => {
        var essayId = options.id;
        var eData = res.data[essayId];
        this.setData({
          essayData: eData
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })

    var essayId = options.id
    this.data.currentEssayId = essayId
    var essays_Collected = wx.getStorageSync('essays_Collected') //所有文章的缓存状态
    if (essays_Collected) {
      var essaycollected = essays_Collected[essayId]
      if (essaycollected) {
        this.setData({
          collected: essaycollected
        })
      }
    } else {
      var essays_Collected = {}
      essays_Collected[essayId] = false
      wx.setStorageSync('essays_collected', essays_Collected)
    }

    
  }
})