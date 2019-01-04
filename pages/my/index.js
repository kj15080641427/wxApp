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
    avatar: '../../image/my_icon@3x/mine_icon_02_3x.png',
    userInfo: wx.getStorageSync("userInfo"),
    age: '',
    second: 60,
    minute: 1
  },
  // 登陆
  login: function() {
    if (!wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '../userlogin/index',
      })
    }
  },
  // 新手引导
  gotoGuide: function() {
    wx.navigateTo({
      url: '../my/about/index?url=' + wx.getStorageSync('guideUrl'),
    })
  },
  // 关于我们
  gotoAbout: function() {
    wx.navigateTo({
      url: '../my/about/index?url=' + wx.getStorageSync('aboutUrl'),
    })
  },
  //
  getUrl:function(){
    var url = api.getAbout()
    var success = data => {
      if (data.data.aboutUsUrl){
      wx.setStorageSync('aboutUrl', data.data.aboutUsUrl)
      }
      if (data.data.guideUrl){
        wx.setStorageSync('guideUrl', data.data.guideUrl)
      }
      console.log(data)
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.requestGet(url, '', success, fail)
  },
  // 我的关注
  gotoWatchlist: function() {
    if (wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '../my/watchlist/index',
      })
    } else {
      this.goto()
    }
  },
  // 编辑个人信息
  gotoEditInfo: function() {
    if (wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '/pages/my/edit-info/index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/userlogin/index',
      })
    }
  },
  //跳转
  goto: function(url) {
    wx.navigateTo({
      url: '/pages/userlogin/index',
    })
  },
  // 订单
  gotoOrder: function() {
    if (wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '/pages/my/order/index?memberId=' + this.data.userInfo.memberId + '&mobile=' + this.data.userInfo.mobile,
      })
    } else {
      this.goto()
    }
  },
  //我的账户
  gotoBalance: function() {
    if (wx.getStorageSync("token")) {
      wx.navigateTo({
        url: 'balance/index?memberId=' + this.data.userInfo.memberId,
      })
    } else {
      this.goto()
    }
  },
  getMemberId: function() {
    // 获取用户memberID信息
    var that = this
    var userInfoUrl = api.getUserInfo()
    var message = ''
    var idData = wx.getStorageSync("token")
    var success = function(data) {
      wx.setStorage({
        key: 'memberId',
        data: data.data.memberId,
      })
      that.getUserDetail()
    }
    var fail = function(e) {
      console.log(e)
    }
    if (wx.getStorageSync("token")) {
      wxrequest.requestGet(userInfoUrl, message, success, fail)
    }
  },
  //获取用户详情
  getUserDetail: function() {
    var that = this
    var userDetailUrl = api.getUserDetail() + wx.getStorageSync("memberId")
    var userData = wx.getStorageSync("memberId")
    var message = ''
    var successDetail = function(dataDetail) {
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
    var failDetail = function(eDetail) {
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
  getAge: function() {
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
    this.getUrl()
    if (!wx.getStorageSync("token")) {
      wx.clearStorage()
      wx.navigateTo({
        url: '/pages/userlogin/index',
      })
    }else{
    this.getMemberId()
    this.getAge()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 'apabfdc34cc00042c2991bd59b9e8a1ae8ap'
  onLoad: function(options) {
    this.setData({
      token: wx.getStorageSync('token')
    })
    this.getUrl()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.removeStorageSync("picIndexList")
    this.getUserDetail()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})