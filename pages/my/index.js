// pages/my/index.js
var api = require('../../utils/api.js')
var wxrequest = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'../../image/my_icon@3x/mine_icon_02_3x.png'
  },
  // 登陆
  login:function(){
    wx.navigateTo({
      url: '../userlogin/index',
    })
  },
  // 新手引导
  gotoGuide:function(){
    wx.navigateTo({
      url: '../my/guide/index',
    })
  },
  // 关于我们
  gotoAbout:function(){
    wx.navigateTo({
      url: '../my/about/index',
    })
  },
  // 我的关注
  gotoWatchlist:function(){
    wx.navigateTo({
      url: '../my/watchlist/index',
    })
  },
  // 编辑个人信息
  gotoEditInfo:function(){
    wx.navigateTo({
      url: '../my/edit-info/index',
    })
  },
  // 订单
  gotoOrder:function(){
    wx.navigateTo({
      url: '../my/order/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 'apabfdc34cc00042c2991bd59b9e8a1ae8ap'
  onLoad: function (options) {
    // console.log(wx.getStorageSync("token"))

    // 获取用户信息
    var userInfoUrl = api.getUserInfo()
    var message = ''
    var success = function(data){
      wx.setStorage({
        key: 'memberId',
        data: data.data.memberId,
      })
      // console.log(data)
      // console.log(wx.getStorageSync("memberId"))
    } 
    var fail = function(e){
      console.log(e)
    }
    // wxrequest.requestGet(userInfoUrl, message,success,fail)

    console.log(wx.getStorageSync("memberId"))
    var userDetailUrl = api.getUserDetail() + wx.getStorageSync("memberId")
    var userData = wx.getStorageSync("memberId")
    var message = ''
    var successDetail = function(dataDetail){
      console.log(dataDetail)
      wx.setStorage({
        key: 'userInfo',
        data: dataDetail,
      })
      console.log("userinfo",wx.getStorageSync("userInfo"))
      
    }
    var failDetail = function(eDetail){
      console.log("e",eDetail)
    }
    wxrequest.request(userDetailUrl, userData, successDetail, failDetail)

    // var infoUrl = api.getUserDetail()
    // var infoData = {"memberId":"apf363e040137547939bfd1d472f53a91bap"}
    // var success = function (data){
    //   console.log(data)
    // }
    // var fail = function (e){
    //   console.log(e)
    // }
    // wxrequest.request(infoUrl, infoData, success, fail)
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
    this.setData({
      avatar: wx.getStorageSync("avatar")
    })
    // console.log(wx.getStorageSync("avatar"))
    // console.log(123)
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