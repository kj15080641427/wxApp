// pages/my/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  gotoGuide:function(){
    wx.navigateTo({
      url: '../my/guide/index?id=2',
    })
  },
  gotoAbout:function(){
    wx.navigateTo({
      url: '../my/about/index?id=3',
    })
  },
  gotoWatchlist:function(){
    wx.navigateTo({
      url: '../my/watchlist/index?id=4',
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