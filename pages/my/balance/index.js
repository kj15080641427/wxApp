// pages/my/balance/index.js
var api = require('../../../utils/api.js')
import wxPay from '../../../utils/wxPay.js'
var wxrequest = require('../../../utils/request.js')
var throttle = require('../../../utils/throttle.js')
Page({

  // <<<<<<< HEAD
  /**
   * 页面的初始数据
   */
  data: {
    balance: '',
    memberId: '',
    bindClick: false
  },
  //交易明细
  gotoDetail: function() {
    wx.navigateTo({
      url: '../balance-detail/index?memberId=' + this.data.memberId,
    })
  },
  //提现
  gotoCash: function() {
    wx.navigateTo({
      url: '../cash/index?balance=' + JSON.stringify(this.data.balance),
    })
    // wx.showToast({
    //   title: '暂不支持',
    //   icon: 'none'
    // })
  },
  //获取账户余额
  getBalance: function() {
    var url = api.getBalance() + this.data.memberId
    var data = {
      "memberId": this.data.memberId
    }
    var succeee = (data) => {
      this.setData({
        balance: data
      })
    }
    var fail = (e) => {
      console.log(e)
    }
    wxrequest.requestGetpar(url, data, '', succeee, fail)
  },
  touchStart(e) {
    this.touchStartTime = e.timeStamp;
  },
  touchEnd(e) {
    this.touchEndTime = e.timeStamp;
  },
  charge(e) {
    let that = this
    if (!that.data.bindClick) {
      that.setData({
        bindClick: true
      })
      var v = {
        type: 1,
        product: 4,
        money: e.currentTarget.dataset.amt * 100
      }
      wxPay(v).then(res => {
        that.getBalance()
        that.setData({
          bindClick: false
        })
      }, err => {
        console.log(err)
        that.setData({
          bindClick: false
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      memberId: options.memberId
    })
    this.getBalance()
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