var wordList = ""
var that
var wordPass
var wordSum
var flag

Page({

  data: {
    percent: 1, //进度
    content: null, //词汇
    pron: null, //音标
    definition: null, //定义
    audioUrl: null, //发音url
    hidden: false

  },

  onLoad: function(options) {
    that = this;
    let db = wx.cloud.database();
    let bookid = (options.book == '1') ? "wordlist1" : "wordlist2" //选择单词书
    db.collection(bookid).doc(parseInt(options.part)).field({
      section: true
    }).get().then(res => {
      wordList = res.data.section
      var worldListLen = wordSum = wordList.length
      wordPass = 0
      console.log(res.data)
      var idx = Math.floor(Math.random() * (worldListLen - 1))


      //绑定数据到页面
      that.setData({
        content: wordList[idx].content,
        pron: wordList[idx].pron,
        definition: wordList[idx].definition,
        audioUrl: null,
        hidden: !that.data.hidden,
        showNot: false
      })
      console.log(that.data)
      that.read()
    })

  },

  showAnswer: function() {
    this.setData({
      showNot: true
    })
  },

  stillSound: function() {
    this.read()
    flag = true
  },

  onShow: function() {

  },

  onHide: function() {

  },

  onUnload: function() {

  },

  nextSound: function() {
    if (wordList.length == 1) {
      wx.showToast({
        title: '恭喜您听完本课',
        icon: 'success',
        duration: 2000
      })
      this.setData({
        percent: 100
      })
      return
    }
    var that = this;
    if (flag != true) { //在触发下一个之前，不是在听一次
      wordPass++
      var position = wordList.indexOf(that.data.definition)
      wordList.splice(position, 1)
      console.log(wordList.length)
      console.log(wordPass)
    }
    flag = false;

    var idx = Math.floor(Math.random() * (wordList.length - 1)) //任选一个听写

    that.setData({
      //设置加载条
      content: wordList[idx].content,
      pron: wordList[idx].pron,
      definition: wordList[idx].definition,
      audioUrl: null,
      // hidden: !that.data.hidden,
      showNot: false,
      percent: wordPass * 100 / wordSum
    })
    this.read()
  },

  read: function() {
    var word = that.data.content
    console.log(word)
    wx.request({
      url: 'https://api.shanbay.com/bdc/search/?word=' + that.data.content,
      data: {},
      method: 'GET',
      success: function(res) {
        var innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = res.data.data.audio
        innerAudioContext.autoplay = true
        innerAudioContext.onPlay(() => {
          console.log('read()开始播放')
        })
        innerAudioContext.onError((res) => {
          console.log("read()出错了")
          wx.showToast({
            title: '读音走丢了TAT',
            mask: false,
          })
        })
      },
      fail: function() {},
      complete: function() {}
    })
  }


})