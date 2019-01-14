var api = require('../../../../utils/api.js')
var wxrequest = require('../../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //高级法院
  getCourt: function(region) {
    var url = api.getCourt()
    var data = {
      keywords: '',
      regionId: region,
      pageNum: 1,
      pageSize: 10
    }
    var success = data => {
      this.setData({
        bestCourt: data.data.topList
      })
      console.log('success', data)
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
  },
  //选择高级法院
  selectCourt: function(e) {
    wx.setStorageSync('courtId', this.data.bestCourt[e.currentTarget.dataset.index].institutionId)
    wx.setStorageSync('courtName', this.data.bestCourt[e.currentTarget.dataset.index].institutionName)
    wx.navigateBack({
      delta: 2,
    })
  },
  //前往下一页选择中级法院和基层法院
  toCounty: function(e) {
    wx.navigateTo({
      url: '/pages/search/court/county/index?county=' + this.data.city[e.currentTarget.dataset.countyindex].regionId + '&noFilter=' + this.data.noFilter,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      city: JSON.parse(options.city),
      noFilter: options.noFilter
    })
    this.getCourt(`${options.regionId}`)
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

  }
})