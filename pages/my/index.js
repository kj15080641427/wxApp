// pages/my/index.js
var api = require('../../utils/api.js')
var wxrequest = require('../../utils/request.js')
var time = require('../../utils/util.js');
var formatTime = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'../../image/my_icon@3x/mine_icon_02_3x.png',
    userInfo:wx.getStorageSync("userInfo"),
    age:'',
    second:60,
    minute:1
  },
  // 登陆
  login:function(){
   if(!wx.getStorageSync("token")){
     wx.navigateTo({
       url: '../userlogin/index',
     })
   }
  },
  // 新手引导
  gotoGuide:function(){
    wx.navigateTo({
      url: '../my/guide/index',
    })
  },
  // 关于我们
  gotoAbout:function(){
    var url = api.getAbout()
    var success = data =>{
      // this.setData({
      //   aboutUrl: data.data.share.url
      // })
      console.log(data)
       wx.navigateTo({
         url: '../my/about/index?url=' + data.data.share.url,
       })
    }
    var fail = e =>{
      console.log(e)
    }
    wxrequest.requestGet(url,'',success,fail)
  },
  // 我的关注
  gotoWatchlist:function(){
    if(wx.getStorageSync("token")){
      wx.navigateTo({
        url: '../my/watchlist/index',
      })
    }else{
      this.goto()
    }
  },
  // 编辑个人信息
  gotoEditInfo:function(){
    if(wx.getStorageSync("token")){
      wx.navigateTo({
        url: '/pages/my/edit-info/index'
      })
    }else{
      wx.navigateTo({
        url: '/pages/userlogin/index',
      })
    }
  },
  //跳转
  goto:function(url){
    wx.navigateTo({
      url: '/pages/userlogin/index',
    })
  },
  // 订单
  gotoOrder:function(){
    if(wx.getStorageSync("token")){
      wx.navigateTo({
        url: '/pages/my/order/index?memberId=' + this.data.userInfo.memberId + '&mobile=' + this.data.userInfo.mobile,
      })
    }else{
      this.goto()
    }
  },
  //我的账户
  gotoBalance:function(){
    if(wx.getStorageSync("token")){
      wx.navigateTo({
        url: 'balance/index?memberId=' + this.data.userInfo.memberId,
      })
    }else{
      this.goto()
    }
  },
  getMemberId:function(){
    // 获取用户memberID信息
    var that = this
    var userInfoUrl = api.getUserInfo()
    var message = ''
    var idData = wx.getStorageSync("token")
    var success = function (data) {
      wx.setStorage({
        key: 'memberId',
        data: data.data.memberId,
      })
      that.getUserDetail()
    }
    var fail = function (e) {
      console.log(e)
    }
    if (wx.getStorageSync("token")) {
      wxrequest.requestGet(userInfoUrl, message, success, fail)
    }
  },
  //获取用户详情
  getUserDetail:function(){
    var that = this
    var userDetailUrl = api.getUserDetail() + wx.getStorageSync("memberId")
    var userData = wx.getStorageSync("memberId")
    var message = ''
    var successDetail = function (dataDetail) {
      that.setData({
        userInfo: dataDetail.data
      })
      wx.setStorageSync("userInfo", dataDetail.data)
      var now = time.formatTime(new Date()).split("/")[0]
      var old = that.data.userInfo.birthday.split("-")[0]
      var year = Number(now) - Number(old)
      that.setData({
        age: year
      })
      console.log("userinfo", wx.getStorageSync("userInfo"))
    }
    var failDetail = function (eDetail) {
      if (eDetail.code == 10002) {
        wx.showToast({
          title: '请重新登录' + eDetail.message,
        })
        wx.clearStorage()
      }
      // wx.showToast({
      //   title: '请重新登录' + eDetail.message,
      // })
      console.log("e", eDetail.code)
    }
    if (wx.getStorageSync("token")) {
      wxrequest.request(userDetailUrl, userData, successDetail, failDetail)
    }
  },
  //年龄
  getAge:function(){
    var that = this
    if (that.data.userInfo.birthday) {
      var now = time.formatTime(new Date()).split("/")[0]
      var old = that.data.userInfo.birthday.split("-")[0]
      var year = Number(now) - Number(old)
      that.setData({
        age: year
      })
      // console.log("年龄",that.data.age)
    }
  },
  //
  onTabItemTap(item) {
    if(!wx.getStorageSync("token")){
      wx.navigateTo({
        url: '/pages/userlogin/index',
      })
    }
    this.getMemberId()
    this.getAge()
    // console.log(item.index)
    // console.log(item.pagePath)
    // console.log(item.text)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 'apabfdc34cc00042c2991bd59b9e8a1ae8ap'
  onLoad: function (options) {
    this.setData({
      token: wx.getStorageSync('token')
    })
    // this.getMemberId()
    // if(wx.getStorageInfoSync().keys.length<=1){
    //   wx.clearStorage()
    // }
    //获取memberID
    // this.getMemberId()
    // // 获取用户详情
    // this.getUserDetail()
    // //年龄
    // this.getAge()
    // var startDate = ["2018/12/26", "21:35:41"][0]
    // var nowDate = formatTime.formatTime(new Date()).split(" ")[0]
    // var startTime = ["2018/12/26", "21:35:41"][1]
    // var nowTime = formatTime.formatTime(new Date()).split(" ")[1]
    // // console.log("订单开始时间", this.data.startTime.split(" "))
    // // console.log("现在时间", formatTime.formatTime(new Date()).split(" "))
    // if (nowDate.split("/")[0] - startDate.split("-")[0] > 0) {
    //   this.setData({
    //     time: false
    //   })
    //   console.log('年', nowDate.split("/")[0] - startDate.split("-")[0])
    // } else if (nowDate.split("/")[1] - startDate.split("-")[1] > 0) {
    //   this.setData({
    //     time: false
    //   })
    //   console.log('月')
    // } else if (nowDate.split("/")[2] - startDate.split("-")[2] > 0) {
    //   this.setData({
    //     time: false
    //   })
    //   console.log('日')
    // } else if ((nowTime.split(":")[0] * 60 * 60 + nowTime.split(":")[1] * 60 + Number(nowTime.split(":")[2])) - (startTime.split(":")[0] * 60 * 60 + startTime.split(":")[1] * 60 + Number(startTime.split(":")[2])) > 900) {
    //   this.setData({
    //     time: false,
    //   })
    // } else {
    //   var hasTime = (nowTime.split(":")[0] * 60 * 60 + nowTime.split(":")[1] * 60 + Number(nowTime.split(":")[2])) - (startTime.split(":")[0] * 60 * 60 + startTime.split(":")[1] * 60 + Number(startTime.split(":")[2]))
    //   this.setData({
    //     hasTime: 900 - ((nowTime.split(":")[0] * 60 * 60 + nowTime.split(":")[1] * 60 + Number(nowTime.split(":")[2])) - (startTime.split(":")[0] * 60 * 60 + startTime.split(":")[1] * 60 + Number(startTime.split(":")[2]))),
    //     statusValue: true
    //   })
    //   console.log("剩余时间")
    //   var that = this
    //   var secondInt = that.data.hasTime
    //   that.setData({
    //     minute: parseInt(secondInt / 60),
    //     second: secondInt % 60
    //   })
    // }
    // var that = this
    // this.setData({
    //   timedown: setInterval(function () {
    //     // var downTime = hasTime -- 
    //     that.setData({
    //       second: that.data.second - 1
    //     })
    //     if (that.data.second <= 0 ) {
    //       that.setData({
    //         second: 60,
    //         minute: that.data.minute - 1
    //       })
    //       if (that.data.minute != 0){
    //       that.setData({
    //         minute: that.data.minute - 1
    //       })
    //       }
    //     }
    //     if (that.data.minute <= 0 && that.data.second <= 0) {
    //       that.setData({
    //         time: false,
    //         statusValue: false
    //       })
    //       clearInterval(that.data.timedown)
    //       console.log("清除计时器")
    //     }
    //     console.log('计时器', that.data.minute)
    //   }, 1000)
    // })
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
    //获取memberID
    // 获取用户详情
    //年龄
    // this.getAge()
    wx.removeStorageSync("picIndexList")
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

  },
})