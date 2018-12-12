// pages/search/index.js
var api = require('../../utils/api.js')
var wxrequest = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  gotoFilter:function(){
    wx.navigateTo({
      url: '../search/filter/index',
    })
  },
  // confirm(e)
  pc:function() {
    var searchLawyerUrl = api.getSearchLawyer() + "1/10"
    var searchlawyerData = this.data.dataJSON ? this.data.dataJSON : ''
    console.log("上传参数")
    var success = function (data) {
      console.log("搜索成功", data)
      wx.setStorageSync("lawyerList", data.data)
      wx.navigateTo({
        url: 'lawyer-list/index',
      })
    }
    var fail = function (e) {
      console.log(e)
    }
    console.log("筛选参数", searchlawyerData)
    wxrequest.request(searchLawyerUrl, searchlawyerData, success, fail)
    console.log(123456)
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
    console.log("筛选参数", this.data.dataJSON ? this.data.dataJSON : '无')
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