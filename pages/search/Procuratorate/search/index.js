var api = require('../../../../utils/api.js')
var wxrequest = require('../../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //选择检察院
  selectProcur: function (e) {
    wx.setStorageSync('ProcurId', this.data.searchList[e.currentTarget.dataset.procurindex].institutionId)
    wx.setStorageSync('ProcurName', this.data.searchList[e.currentTarget.dataset.procurindex].institutionName)
    wx.navigateBack({
      delta: 2,
    })
  },
  //input value
  getInput: function (e) {
    this.setData({
      bestName: e.detail.value
    })
  },
  //搜索检察院名称
  confirm:function() {
    var url = api.getProcur()
    var data = {
      keywords: this.data.bestName,
      regionId: '',
      pageNum: 1,
      pageSize: 50
    }
    var success = data => {
      this.setData({
        searchList: data.data.result.list
      })
      console.log('success', data)
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
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