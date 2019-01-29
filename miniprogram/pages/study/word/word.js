var app = getApp()
var that;
var list;
var wordsListLen;
var familiarLevel;
var levelArr;
var selectArr; //可供选择的单词的数组
var innerAudioContext;
var wordSum;
var wordPass;
var tempAudioPath = ''
var arr

Page({
  data: {
    list: "",
    wordsListLen: "",
    hidden: false,
    content: '',
    proficiency: 1,
    percent: 1,
    wordPass: 0,
    wordSum: 0
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
      wx.setStorage({  //改单词
        key: that.data.content,
        data: 1,
      })
      wordSum = that.data.list.length * 2 //因为有2熟练度，实际上是要见三次面的
      wordPass = 0
      console.log(wordPass + ':' + wordSum)
      that.read()
    })
    
  },


  onHide: function () {
    //关掉页面之后所有storage全部清除
    wx.clearStorage()
  },

  onUnload: function () {
    wx.clearStorage()
  },

  show: function () { //显示释义
    this.setData({
      showNot: true
    })
  },

  next: function () {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = 'cloud://zhanyeye-3b8d33.7a68-zhanyeye-3b8d33/right.mp3'
    innerAudioContext.onPlay(() => {
      console.log('ding的一声')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

    that = this
    wordPass = wordPass + 1 //每次按下next都算是见过一次面了
    this.setData({
      showNot: false,
      percent: wordPass * 100 / wordSum 
    })
    console.log(wordPass + ':' + wordSum + ':' + that.data.list.length)

    //这里设置用户熟练度到本地
    //TODO 其实没有考虑到熟练度为空的时候的情况
    familiarLevel = wx.getStorageSync(that.data.content)
    familiarLevel++
    //如果熟练度到2了就删掉
    if (familiarLevel == 2) {
      //判断位置删除
      var position = that.data.list.indexOf(that.data.content)
      that.data.list.splice(position, 1)
    } else {
      wx.setStorage({
        key: that.data.content,
        data: familiarLevel,
      })
    }

    if (that.data.list.length == 0) {
      wx.showToast({
        title: '恭喜您学完本课',
        icon: 'success',
        duration: 2000
      })
    } else {
      var idx = Math.floor(Math.random() * (that.data.list.length - 1))
      this.setData({
        content: arr[idx].content,
        pron: arr[idx].pron,
        definition: arr[idx].definition,
        proficiency: familiarLevel
      })
      that.read()
    }

  },

  read: function () {
    var word = that.data.content
    console.log(word)
    var fdStart = that.data.content.indexOf("～");
    if (fdStart == 0) {
      //表示strCode是以~开头；
      word = that.data.content.replace("～", "");
    }
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = 'http://fanyi.baidu.com/gettts?lan=en&text=' + encodeURIComponent(word) + '&spd=3&source=web'
    innerAudioContext.autoplay = true
    innerAudioContext.onPlay(() => {
      // console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
       console.log(res.errMsg)
       console.log(res.errCode)
      wx.showToast({
        title: '读音走丢了TAT',
        mask: false,
        success: function () { },
        fail: function () { },
        complete: function () { }
      })
    })

  }
})