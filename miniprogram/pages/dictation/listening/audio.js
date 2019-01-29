var wordList = ""
var that
var wordPass
var wordSum
var flag
var last_idx //记录上一次单词索引序号

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
      var idx = Math.floor(Math.random() * (worldListLen - 1))
      last_idx = idx


      console.log(that.query(wordList[idx].content))

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

  query: function(word) {
    wx.request({
      url: 'https://api.shanbay.com/bdc/search/?word=' + word,
      data: {},
      method: 'GET',
      success: function (res) { 
        console.log(word)
        return  {
          pron: res.data.data.pron,
          definition: res.data.data.definition,
          audioUrl: res.data.data.audio
        }
        
      },
      fail: function () { },
      complete: function () { }
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
      console.log(wordList[last_idx])
      wordList.splice(last_idx, 1) //删除上一个单词
      console.log(wordList.length)
      console.log(wordPass)
    }
    flag = false;

    var idx = Math.floor(Math.random() * (wordList.length - 1)) //任选一个听写
    last_idx = idx
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
        console.log(res.data.data)
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