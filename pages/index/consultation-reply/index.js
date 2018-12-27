var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
var formatTime = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answer:"哈哈哈哈呵呵哈哈哈呵呵哈哈哈哈哈哈哈"
  },
  userreply:function(e){
    this.setData({
      replyInput:e.detail.value
    })
  },
//回复
  confirm(e){
    var that = this
    var url = api.getUserReply() + wx.getStorageSync("consultationId") +'/reply/post'
    var data = { "consultationId": wx.getStorageSync("consultationId"), "type": 2, "content": that.data.replyInput, "lawyerId": wx.getStorageSync("freeTextList").lawyerId}
    var success = data =>{
      this.setData({
        reply:data.data
      })
      that.getFreeText()
      console.log("用户回复",data.data)
    }
    var fail = e=>{
      console.log(e)
    }
    wxrequest.request(url,data,success,fail)
  },

  //文字咨询回复详情
  getFreeText: function () {
    var url = api.getFreeText() + this.data.freeTextList.consultationId + '/' + this.data.freeTextList.lawyerId + '/reply/detail/1/99'
    var data = { "consultationId": this.data.freeTextList.consultationId, "lawyerId": this.data.freeTextList.lawyerId, "pageNum": 1, "pageSize": 99 }
    var success = data => {
      this.setData({
        freeText: data.data.list
      })
      this.lawTime()
      console.log("文字咨询回复详情", data)
    }
    var fail = e => {
      console.log("文字咨询回复详情", e)
    }
    wxrequest.requestGetpar(url, data, '', success, fail)
  },
  //律师回复时间
  lawTime: function () {
    //律师回复时间
    var that = this
    var dateList = []
    var lawTimeList = []
    var lawgaoList = []
    var lawagoTextList = []
    that.data.freeText.map(item => {
      dateList.push(item.dateAdded)
      lawTimeList.push(item.dateAdded.split(" ")[1].split(":", 2).join(":"))
    })
    that.setData({
      lawtList: lawTimeList
    })
    console.log("律师回复时间time", dateList)
    dateList.map(item => {
      var lawnowYear = formatTime.formatTime(new Date()).split(" ")[0].split("/")
      var lawyear = item.split(" ")[0].split("-")
      var lawnowYearTime = formatTime.formatTime(new Date()).split(" ")[1].split(":")
      console.log("分钟11",lawnowYearTime)
      var lawyearTime = item.split(" ")[1].split(":")
      if (lawnowYear[0] - lawyear[0] > 0) {
        lawgaoList.push(lawnowYear[0] - lawyear[0])
        lawagoTextList.push('年前')
        that.setData({
          lawago: lawgaoList,
          lawagoText: lawagoTextList
        })
      } else if (lawnowYear[1] - lawyear[1] > 0) {
        lawgaoList.push(lawnowYear[1] - lawyear[1])
        lawagoTextList.push('月前')
        that.setData({
          lawago: lawgaoList,
          lawagoText: lawagoTextList
        })
      } else if (lawnowYear[2] - lawyear[2] > 0) {
        lawgaoList.push(lawnowYear[2] - lawyear[2])
        lawagoTextList.push('天前')
        that.setData({
          lawago: lawgaoList,
          lawagoText: lawagoTextList
        })
      } else if (lawnowYearTime[0].split(":")[0] - lawyearTime[0].split(":")[0] > 0) {
        lawgaoList.push(lawnowYearTime[0].split(":")[0] - lawyearTime[0].split(":")[0])
        lawagoTextList.push('小时前')
        that.setData({
          lawago: lawgaoList,
          lawagoText: lawagoTextList
        })
        // console.log("小时", lawnowYearTime[0].split(":")[0] - lawyearTime[0].split(":")[0])
      } 
      else if (lawnowYearTime[1].split(":")[0] - lawyearTime[1].split(":")[0] > 5 ) {
        lawgaoList.push(lawnowYearTime[1].split(":")[0] - lawyearTime[1].split(":")[0])
        lawagoTextList.push('分钟前',)
        that.setData({
          lawago: lawgaoList,
          lawagoText: lawagoTextList
        })
      } 
      else {
        lawgaoList.push('刚')
        lawagoTextList.push('刚')
        that.setData({
          lawago: lawgaoList,
          lawagoText: lawagoTextList
        })
        console.log("qwe", lawnowYearTime[0] )
      }
    })
    console.log('律师回复时间', dateList)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      freeTextList: wx.getStorageSync("freeTextList"),
      userInfo:wx.getStorageSync("userInfo")
      // lawtList: options.lawtList,
      // lawago: options.lawago,
      // lawagoText:options.lawagoText
    })
    console.log("huifu",this.data.freeTextList)
    this.getFreeText()
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