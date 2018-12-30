// pages/index/consultation-input/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  userreply: function (e) {
    this.setData({
      replyInput: e.detail.value
    })
  },
  //回复
  confirm:function() {
    var that = this
    var url = api.getUserReply() + wx.getStorageSync("consultationId") + '/reply/post'
    var data = { "consultationId": wx.getStorageSync("consultationId"), "type": 2, "content": that.data.replyInput, "lawyerId": wx.getStorageSync("freeTextList").lawyerId }
    var success = data => {
      this.setData({
        reply: data.data
      })
      wx.showToast({
        title: '回复成功',
      })
      wx.navigateBack({
        
      })
      // that.getFreeText()
      console.log("用户回复", data.data)
    }
    var fail = e => {
      wx.showToast({
        title: e.message,
        icon:'none'
      })
      console.log(e)
    }
    if(this.data.userreply !=''){
      wxrequest.request(url, data, success, fail)
    }else{
      wx.showToast({
        title: '不能为空',
        icon:'none'
      })
    }
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