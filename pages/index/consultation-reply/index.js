var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
var formatTime = require('../../../utils/util.js')
import Time from '../../../utils/date-time.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answer:""
  },
  userreply:function(e){
    this.setData({
      replyInput:e.detail.value
    })
  },

  //回复页
  toinput:function(){
    wx.navigateTo({
      url: '/pages/index/consultation-input/index?',
    })
  },
  //文字咨询回复详情
  getFreeText: function () {
    var url = api.getFreeText() + this.data.freeTextList.consultationId + '/' + this.data.freeTextList.lawyerId + '/reply/detail/1/99'
    var data = { "consultationId": this.data.freeTextList.consultationId, "lawyerId": this.data.freeTextList.lawyerId, "pageNum": 1, "pageSize": 99 }
    var success = data => {
      this.setData({
        freeText: data.data.list
      })
      this.lawTime()
    }
    var fail = e => {
      console.log("文字咨询回复详情", e)
    }
    wxrequest.requestGetpar(url, data, '', success, fail)
  },
    //律师回复时间
  lawTime: function () {
    let list = []
    this.data.freeText.map(item=>{
      list.push(item.dateAdded)
    })
    this.setData({
      timelaw:Time(list)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      freeTextList: wx.getStorageSync("freeTextList"),
      userInfo:wx.getStorageSync("userInfo")
    })
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
    this.getFreeText()
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
    
  },
})