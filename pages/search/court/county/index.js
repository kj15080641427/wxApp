var api = require('../../../../utils/api.js')
var wxrequest = require('../../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //高级法院
  getCourt: function (courtName) {
    var url = api.getCourt()
    var data = {
      keywords: '',
      regionId: courtName,
      pageNum: 1,
      pageSize: 20
    }
    var success = data => {
      this.setData({
        bestCourt: data.data.topList,
        otherCourt: data.data.result.list
      })
      console.log('success', data)
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
  },
  //选择基础法院
  selectCourt:function(e){
    wx.setStorageSync('courtId', this.data.otherCourt[e.currentTarget.dataset.courtindex].institutionId )
    wx.setStorageSync('courtName', this.data.otherCourt[e.currentTarget.dataset.courtindex].institutionName)
    wx.navigateBack({
      delta:3,
    })
  },
  //选择中级法院
  selectBestCourt:function(e){
    wx.setStorageSync('courtId', this.data.bestCourt[e.currentTarget.dataset.courtbestindex].institutionId)
    wx.setStorageSync('courtName', this.data.bestCourt[e.currentTarget.dataset.courtbestindex].institutionName)
    wx.navigateBack({
      delta: 3,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      noFilter:options.noFilter
    })
    this.getCourt(options.county)
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