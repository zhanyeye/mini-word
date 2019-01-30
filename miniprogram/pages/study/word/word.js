var that;
var innerAudioContext;
var wordSum;
var wordPass;
var wordList
var gradeList
var last_idx
var flag //标志该单词是否不认识

Page({
  data: {
    hidden: false,
    content: '',
    proficiency: 1,
    percent: 0,
  },

  onLoad: function(options) {
    that = this;
    let db = wx.cloud.database();
    let bookid = (options.book == '1') ? "wordlist1" : "wordlist2" //选择单词书
    db.collection(bookid).doc(parseInt(options.part)).field({
      section: true
    }).get().then(res => {

      wordList = res.data.section
      wordSum = wordList.length
      wordPass = 0
      gradeList = new Array(wordList.length).fill(1);
      console.log(gradeList)

      var idx = Math.floor(Math.random() * (wordList.length - 1))
      last_idx = idx
      that.setData({
        content: wordList[idx].content,
        pron: wordList[idx].pron,
        definition: wordList[idx].definition,
        proficiency: gradeList[idx],
        hidden: !that.data.hidden
      })

      that.read()
    })

  },

  onHide: function() {

  },

  onUnload: function() {

  },

  show: function() { //显示释义
    console.log(gradeList)
    this.promptTone() //提示音
    flag = true
    if (gradeList[last_idx] > 0) { //降低熟练度
      gradeList[last_idx]--
    }
    this.read()
    this.setData({
      showNot: true,
      proficiency: gradeList[last_idx]
    })
    console.log(gradeList)
  },

  next: function() {
    this.promptTone()

    if (wordList.length == 1 && gradeList[last_idx] == 3) {
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

    if (flag == false) {
      gradeList[last_idx]++ //只有当上一个单词认识时，熟练度才加1
        if (gradeList[last_idx] == 3 && wordList.length != 1) { //当上一个单词熟练度达到3时，可以删除
          wordPass++
          console.log("delete: " + wordList[last_idx].content)
          wordList.splice(last_idx, 1)
          gradeList.splice(last_idx, 1)
          console.log(wordList.length)
          console.log(wordPass)
        }
    }
    flag = false

    var idx = Math.floor(Math.random() * (wordList.length - 1))
    last_idx = idx
    this.setData({
      showNot: false,
      content: wordList[idx].content,
      pron: wordList[idx].pron,
      definition: wordList[idx].definition,
      proficiency: gradeList[idx],
      percent: wordPass * 100 / wordSum
    })
    that.read()

  },

  promptTone: function() {
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = 'cloud://zhanyeye-3b8d33.7a68-zhanyeye-3b8d33/right.mp3'
    innerAudioContext.onPlay(() => {
      console.log('ding的一声')
    })
    innerAudioContext.onError((res) => {
      console.log('ding的一声失败')
    })
  },



  read: function() {
    var word = that.data.content
    console.log(word)
    wx.request({
      url: 'https://api.shanbay.com/bdc/search/?word=' + that.data.content,
      data: {},
      method: 'GET',
      success: function(res) {
        innerAudioContext = wx.createInnerAudioContext()
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