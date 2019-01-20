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
    toneIcon: '/images/icon/0.png',
    percent: 1,
    wordPass: 0,
    wordSum: 0
  },


  onLoad: function(options) {

    that = this;
    let db = wx.cloud.database();
    let bookid = (options.book == '1') ? "wordlist1" : "wordlist2" //选择单词书
    db.collection(bookid).doc(parseInt(options.part)).field({
      section: true
    }).get().then(res => {
      console.log(res.data)
      arr = res.data.section
      wordsListLen = arr.length
      var idx = Math.floor(Math.random() * (wordsListLen - 1))
      var word
      that.setData({
        list: arr,
        word: arr[idx],
        content: arr[idx].content,
        pron: arr[idx].pron,
        definition: arr[idx].definition,
        // tone: res.data[idx].WordTone,
        // toneIcon: '../../../images/' + res.data[idx].WordTone + '.png',
        hidden: !that.data.hidden
      })
      wx.setStorage({
        key: that.data.content,
        data: 1,
      })
      console.log(that.data.list)
      wordSum = that.data.list.length * 2 //因为有2熟练度，实际上是要见三次面的
      wordPass = 0
      console.log(wordPass + ':' + wordSum)
    })
    wx.downloadFile({
      url: 'https://www.osinglar.top/Content/right.mp3',
      success: function(res) {
        tempAudioPath = res.tempFilePath
      },
      fail: function(err) {
        console.log(err)
      }
    })

  },

  onHide: function() {
    //关掉页面之后所有storage全部清除
    wx.clearStorage()
  },

  onUnload: function() {
    wx.clearStorage()
  },

  show: function() {
    this.setData({
      showNot: true
    })
  },

  next: function() {
    //选择下一个的时候 ding一声
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = tempAudioPath
    innerAudioContext.autoplay = true
    innerAudioContext.onPlay(() => {
      // console.log('开始播放ding')
    })
    innerAudioContext.onError((res) => {
      // console.log(res.errMsg)
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
    console.log(familiarLevel)
    familiarLevel++
    console.log(familiarLevel)
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

    //TODO 显示完这个框之后会怎么样 此处应该让他们选择是否再来一次 哈哈
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
        // tone: this.data.list[idx].WordTone,
        // toneIcon: '../../../images/' + this.data.list[idx].WordTone + '.png',
        proficiency: familiarLevel
      })
      that.read()
    }

  },
  read: function() {
    var japanWord = that.data.content
    var fdStart = that.data.content.indexOf("～");
    if (fdStart == 0) {
      //表示strCode是以~开头；
      japanWord = that.data.content.replace("～", "");
    }
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = 'http://fanyi.baidu.com/gettts?lan=en&text=' + encodeURIComponent(japanWord) + '&spd=3&source=web'
    innerAudioContext.autoplay = true
    innerAudioContext.onPlay(() => {
      // console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      // console.log("chucuole")
      // console.log(res.errMsg)
      // console.log(res.errCode)
      wx.showToast({
        title: '读音走丢了TAT', //标题  
        mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false  
        success: function() {}, //接口调用成功的回调函数  
        fail: function() {}, //接口调用失败的回调函数  
        complete: function() {} //接口调用结束的回调函数  
      })
    })

  }
})