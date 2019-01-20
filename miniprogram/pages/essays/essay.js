// miniprogram/pages/essays/essay.js
//var essaysData = require('../../data/essays-data.js')

Page({
  data: {
    //小程序总是会读取data对象来做数据绑定，这个事件是在onLoad事件执行之后发生的
  },

  onLoad: function(options) {
    const db = wx.cloud.database()
    db.collection('essay-data').get({
      success: res => {
        this.setData({
          essays_key: res.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })
  },

  onEssayTap: function(event) {
    var essayId = event.currentTarget.dataset.essayid;
    //event:事件对象
    //currentTarget:当前鼠标点击的组件
    //dataset:所有自定义数据的集合
    //essayid:标签中自定义属性 data-essayId 会被自动转换成 essayid。自定义标签中，除‘-’后的第一个字母，其他会自动转为小写
    console.log("on essay id is" + essayId);
    wx.navigateTo({
      url: 'essay-detail/essay-detail?id=' + essayId,
    })
  }
})