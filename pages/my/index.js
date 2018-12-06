// pages/my/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  onLoad: function (options) {

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