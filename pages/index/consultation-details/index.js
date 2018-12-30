var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
var formatTime = require('../../../utils/util.js')
var x=[]
var all = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    answer:"",
    i: 0
  },
  // 删除已发布咨询
  deleteInfo:function(){
    wx.showModal({
      title: '删除已发布的咨询?',
      cancelColor:"#717171",
      confirmColor:"#1ec88c",
      // content: '11'
      success:function(){
        console.log("确定")
      },
      fail:function(){
        console.log("取消")
      }
    })
  },
  //单条文字咨询详情
  getFree:function(){
    var url = api.getFreeText()+this.data.id
    var data = {"consultationId":this.data.id}
    var success = data =>{
      console.log("单条文字咨询详情", data)
      this.setData({
        freeOne:data.data
      })
    }
    var fail = e =>{
      console.log(e)
    }
    wxrequest.requestGetpar(url,data,'',success,fail)
  },
  //文字咨询列表
  getFreetextList:function(){
    var url = api.getFreetextList() +this.data.id+'/reply/1/10'
    var data = { "consultationId": this.data.id, "pageNum": '1',"pageSize":'10'}
    var success = data =>{
      this.setData({
        freeTextList:data.data.list,
        freetotal:data.data,
        listLength: data.data.list.length,
        i:0,
        allTotal:0
      })
      all=0
      x = []
      this.data.freeTextList.map(item=>{
        this.getFreeText(item.consultationId,item.lawyerId)
      })
 
      this.lawTime()
      console.log("文字咨询列表freeTextList", this.data.freeTextList)
    }
    var fail = e =>{
      console.log("文字咨询列表错误",e)
    }
    wxrequest.requestGetpar(url,data,'',success,fail)
  },
  //文字咨询回复详情
  getFreeText: function (consultationId, lawyerId) {
    var url = api.getFreeText() + consultationId + '/' + lawyerId + '/reply/detail/1/99'
    var data = { "consultationId": consultationId, "lawyerId": lawyerId, "pageNum": 1, "pageSize": 99 }
    var success = data => {
      x.push(data.data.total)
      this.setData({
        freeText: x,
        i: this.data.i+1
      })
      if (this.data.i == this.data.listLength) {
        this.data.freeText.map(item => {
          all = all + item
        })
        this.setData({
          allTotal: all
        })
      }
      this.lawTime()
      console.log('wwwwwwww', this.data.i)
      console.log("文字咨询回复详情freeText", this.data.freeText)
    }
    var fail = e => {
      console.log("文字咨询回复详情", e)
    }
    wxrequest.requestGetpar(url, data, '', success, fail)
  },
  // 回复
  gotoReply:function(e){
    wx.navigateTo({
      url: '../consultation-reply/index?lawtList=' + this.data.lawtList[e.currentTarget.dataset.freeindex] + '&time='+this.data.time   ,
    })
    wx.setStorageSync("freeTextList", this.data.freeTextList[e.currentTarget.dataset.freeindex])
    console.log(e)
  },
  //

  lawTime: function () {
    //律师回复时间
    var that = this
    var dateList = []
    var lawTimeList = []
    var lawgaoList = []
    var lawagoTextList = []
    var showtimeList = []
    that.data.freeTextList.map(item => {
      dateList.push(item.dateAdded)
      lawTimeList.push(item.dateAdded.split(" ")[1].split(":", 2).join(":"))
    })
    that.setData({
      lawtList: lawTimeList
    })
    console.log("律师回复时间time", lawTimeList)
    dateList.map((item, index) => {

      var lawnowYear = formatTime.formatTime(new Date()).split(" ")[0].split("/")
      var lawyear = item.split(" ")[0].split("-")
      var lawnowYearTime = formatTime.formatTime(new Date()).split(" ")[1].split("/")
      var lawyearTime = item.split(" ")[1].split(":")
      if (lawnowYear[0] - lawyear[0] > 0) {
        showtimeList.push(this.data.freeTextList[index].dateAdded.split(" "))
        that.setData({
          timelaw: showtimeList
        })
      } else if (lawnowYear[1] - lawyear[1] > 0) {
        showtimeList.push(this.data.freeTextList[index].dateAdded.split(" "))
        that.setData({
          timelaw: showtimeList
        })
      }
      else if (lawnowYear[2] - lawyear[2] > 7) {
        showtimeList.push(this.data.freeTextList[index].dateAdded.split(" "))
        this.setData({
          timelaw: showtimeList
        })
      } else if (lawnowYear[2] - lawyear[2] > 2 && lawnowYear[2] - lawyear[2] <= 7) {
        lawgaoList.push(lawnowYear[2] - lawyear[2])
        showtimeList.push('天前' + this.data.freeTextList[index].dateAdded.split(" ")[1].split(":", 2).join(":"))
        this.setData({
          timelaw: showtimeList,
        })
      }
      else if (lawnowYear[2] - lawyear[2] == 2) {
        lawagoTextList.push()
        showtimeList.push('前天' + this.data.freeTextList[index].dateAdded.split(" ")[1].split(":", 2).join(":"))
        that.setData({

          timelaw: showtimeList
        })
        console.log("<><<<<<<<<<<<", this.data.timelaw)
      } else if (lawnowYear[2] - lawyear[2] == 1) {
        lawagoTextList.push()
        showtimeList.push('昨天' + this.data.freeTextList[index].dateAdded.split(" ")[1].split(":", 2).join(":"))
        that.setData({

          timelaw: showtimeList
        })

      }
      else if (lawnowYear[2] - lawyear[2] == 0 && lawnowYearTime[0].split(":")[0] - lawyearTime[0] >= 1) {
        showtimeList.push(this.data.freeTextList[index].dateAdded.split(" ")[1].split(":", 2).join(":"))
        that.setData({
          timelaw: showtimeList
        })
        console.log('律师回阿诗丹顿复时间', this.data.timelaw)
      }
      else if (lawnowYearTime[0].split(":")[1] - lawyearTime[1] > 5) {
        showtimeList.push(lawnowYearTime[0].split(":")[1] - lawyearTime[1] + '分钟前')
        that.setData({
          timelaw: showtimeList
        })
        console.log(that.data.lawago, that.data.lawagoText)
      } else {
        showtimeList.push('刚刚')
        that.setData({
          timelaw: showtimeList
        })
      }
      console.log('律师回复时间', lawnowYearTime[0].split(":")[1] - lawyearTime[1] > 5)
    })

  },
  //律师主页
  toLawyerHomePage:function(e){
    wx.navigateTo({
      url: '/pages/search/lawyer-detail/index?memberId=' + this.data.freeTextList[e.currentTarget.dataset.lawindex].lawyerId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: JSON.parse(options.orderDetail).id,
      orderDetail: options.orderDetail ? JSON.parse(options.orderDetail) : options.date,
      userInfo: wx.getStorageSync("userInfo"),
      time: options.orderDetail ? JSON.parse(options.orderDetail).createDate.split(" ")[1].split(":",2).join(":"):''
    })
    console.log('qqqqqqqqqqqq',JSON.parse(options.orderDetail))


    wx.setStorageSync('consultationId', JSON.parse(options.orderDetail).id) 
    this.userTime()
    // this.getFreetextList()
    this.getFree()
    
    // this.getFreetextList()
    // this.getReply()
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
    this.getFreetextList()
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var x = []
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var x = []
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
    
  },
//用户回复时间
userTime:function(){
  var that = this
  var dateList = []
  // var lawTimeList = []
  var lawgaoList = []
  var lawagoTextList = []
  var showtimeList = []
  // that.data.freeTextList.map(item => {
  //   dateList.push(item.dateAdded)
  //   lawTimeList.push(item.dateAdded.split(" ")[1].split(":", 2).join(":"))
  // })
  // that.setData({
  //   lawtList: lawTimeList
  // })
  // console.log("律师回复时间time", lawTimeList)
  var nowYear = formatTime.formatTime(new Date()).split(" ")[0].split("/")
  var year = this.data.orderDetail.createDate.split(" ")[0].split("-")
  var nowYearTime = formatTime.formatTime(new Date()).split(" ")[1].split(":")
  var yearTime = this.data.orderDetail.createDate.split(" ")[1].split(":")
  if (nowYear[0] - year[0] > 0) {
    // showtimeList.push(this.data.freeTextList[index].dateAdded.split(" "))
    that.setData({
      timet: this.data.time
    })
  } else if (nowYear[1] - year[1] > 0) {
    // showtimeList.push(this.data.freeTextList[index].dateAdded.split(" "))
    that.setData({
      timet: this.data.time
    })
  }
  else if (nowYear[2] - year[2] > 7) {
    this.setData({
      timet: this.data.time
    })
  } else if (nowYear[2] - year[2] > 2 && nowYear[2] - year[2] <= 7) {
    // lawgaoList.push(nowYear[2] - year[2])
    // lawagoTextList.push('天前')
    this.setData({
      timet: this.data.time,
      ago: nowYear[2] - year[2],
      agoText: '天前',
    })
  }
  else if (nowYear[2] - year[2] == 2) {
    // lawagoTextList.push('前天')
    that.setData({
      agoText: '前天',
      timet: this.data.time
    })
    console.log("<><<<<<<<<<<<", this.data.timelaw)
  } else if (nowYear[2] - year[2] == 1) {
    that.setData({
      agoText: '昨天',
      timet: this.data.time
    })
  }
  else if (nowYear[2] - year[2] == 0 && nowYearTime[0].split(":")[0] - yearTime[0].split(":")[0] >= 1) {
    // showtimeList.push(this.data.freeTextList[index].dateAdded.split(" ")[1].split(":", 2).join(":"))
    that.setData({
      timet: this.data.time
    })
    console.log('律师回阿诗丹顿复时间', this.data.timelaw)
  }
  else if (nowYearTime[0].split(":")[1] - yearTime[0].split(":")[1] > 5) {
    that.setData({
      ago: nowYearTime[0].split(":")[1] - yearTime[0].split(":")[1],
      agoText: '分钟前'
    })
  } else {
    that.setData({
      ago: '刚',
      agoText: '刚'
    })
  }
  console.log('用户时间', nowYearTime, yearTime)
}
})