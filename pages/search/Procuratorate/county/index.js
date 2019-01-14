var api = require('../../../../utils/api.js')
var wxrequest = require('../../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //高级检察院
  getProcur: function (ProcurName) {
    var url = api.getProcur()
    var data = {
      keywords: '',
      regionId: ProcurName,
      pageNum: 1,
      pageSize: 20
    }
    var success = data => {
      this.setData({
        bestProcur: data.data.topList,
        otherProcur: data.data.result.list
      })
      console.log('success', data)
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
  },
  //选择基础检察院
  selectProcur: function (e) {
    wx.setStorageSync('ProcurId', this.data.otherProcur[e.currentTarget.dataset.procurindex].institutionId)
    wx.setStorageSync('ProcurName', this.data.otherProcur[e.currentTarget.dataset.procurindex].institutionName)
    wx.navigateBack({
      delta: 3,
    })
  },
  //选择中级检察院
  selectBestProcur: function (e) {
    wx.setStorageSync('ProcurId', this.data.bestProcur[e.currentTarget.dataset.procurbestindex].institutionId)
    wx.setStorageSync('ProcurName', this.data.bestProcur[e.currentTarget.dataset.procurbestindex].institutionName)
    wx.navigateBack({
      delta: 3,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      noFilter: options.noFilter
    })
    this.getProcur(options.county)
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