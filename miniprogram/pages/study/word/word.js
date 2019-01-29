Page({

  data: {
    hidden: false,
    content: '',
    proficiency: 1,
    percent: 1,
  },

  onLoad: function (options) {
    that = this;
    let db = wx.cloud.database();
    let bookid = (options.book == '1') ? "wordlist1" : "wordlist2" //选择单词书
    db.collection(bookid).doc(parseInt(options.part)).field({
      section: true
    }).get().then(res => {
      arr = res.data.section
      wordsListLen = arr.length
      var idx = Math.floor(Math.random() * (wordsListLen - 1))
      that.setData({
        list: arr,
        content: arr[idx].content,
        pron: arr[idx].pron,
        definition: arr[idx].definition,
        hidden: !that.data.hidden
      })
      wx.setStorage({ //改单词
        key: that.data.content,
        data: 1,
      })
      wordSum = that.data.list.length * 2 //因为有2熟练度，实际上是要见三次面的
      wordPass = 0
      console.log(wordPass + ':' + wordSum)
      that.read()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
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
    
  }
})