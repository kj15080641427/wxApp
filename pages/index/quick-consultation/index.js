// pages/index/quick-consultation/index.js
var wxrequest = require('../../../utils/request.js')
var api = require('../../../utils/api.js')
import wxPay from '../../../utils/wxPay.js'
var pay = require('../../../utils/wxPay.js')
var throttle = require('../../../utils/throttle.js')
var time = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectType: true,
    // money:0,
    balance: '',
    checked1: true,
    checked2: false,
    phone: ''
  },
  //
  changeChecked1: function(e) {
    if (this.data.checked1 !== true) {
      this.setData({
        checked1: !this.data.checked1,
        checked2: !this.data.checked2
      })
    }
  },
  changeChecked2: function() {
    if (this.data.checked2 !== true) {
      this.setData({
        checked2: !this.data.checked2,
        checked1: !this.data.checked1
      })
    }
  },
  // picker
  changeType: function(e) {
    this.setData({
      index: e.detail.value,
      selectType: false,
      money: this.data.popular[e.detail.value].price
      // money: Number(e.detail.value)+1
    })
  },
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  wxPay:function(){
    wx.showLoading({
      title: '支付中',
      mask: true
    })
    if (!this.data.index) {
      wx.showToast({
        title: '请选择问题类型',
        icon: 'none'
      })
    } else if (!(/^1[3456789]\d{9}$/.test(this.data.phone))) {
      // (this.data.phone) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
    } else {
      if (this.data.checked1) {
        var t = {
          typeQuick: this.data.popular[this.data.index],
          money: this.data.money * 100,
          type: 1,
          product: 2,
          phone: this.data.phone
        }
        var that = this
        var payMoney = that.data.money
        wxPay(t).then(res => {
          // this.getQuick.then(res.data.data.orderno)
        })
      } else {
        var that = this
        var s = {
          typeQuick: this.data.popular[this.data.index],
          money: this.data.money * 100,
          type: 3,
          product: 2,
          phone: this.data.phone
        }
        wxPay(s).then(res => {
          // this.getQuick.then(res.data.data.orderno)
        }, error => {
          console.log('asdasdasd', error.data.message), wx.showToast({
            title: error.data.message,
            icon: 'none',
          })
        })
      }
      // }
    }
  },
  // 跳转
  gotofinish: function() {
    var that = this
    var hour = new Date().getHours()
    console.log(hour)
    if (hour < 9 || hour >= 22){
      wx.showModal({
        title: '温馨提示',
        content: '当前不是律师工作时间范围,可能会回复的比较慢,建议您改成其他时间再来咨询',
        confirmText:'继续咨询',
        success(res){
          if(res.confirm){
            throttle.throttle(that.wxPay())
          }
        }
      })
    }else{
      that.wxPay()
    }
  },
  //快速咨询资费说明
  gettariffUrl: function() {
    var url = api.getTariff()
    var data = {}
    var success = data => {
      this.setData({
        tariffUrl: data.data.tariffExplanationUrl
      })
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.requestGet(url, '', success, fail)
  },
  toTariff: function() {
    // wx.setStorageSync('h5g', this.data.tariffUrl)
    wx.navigateTo({
      url: '../consultation-h5/index?url=' + this.data.tariffUrl
    })
  },
  //查询余额
  getBalance: function() {
    var url = api.getBalance() + wx.getStorageSync("memberId")
    var data = wx.getStorageSync("memberId")
    var success = (data) => {
      this.setData({
        balance: data.data.balanceAmount || 0
      })
    }
    var fail = (e) => {
      console.log(e)
    }
    wxrequest.requestGetpar(url, data, '', success, fail)
  },
  //快速咨询
  getQuType: function() {
    var url = api.getType()
    var data = {
      'quick': 1
    }
    var success = data => {
      this.setData({
        popular: data.data,
      })
    }
    var fail = data => {
      console.log("快速咨询", e)
    }
    wxrequest.request(url, data, success, fail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(new Date().getHours())
    this.getQuType()
    this.gettariffUrl()
    // this.getQuick()
    this.getBalance()
    var that = this
    that.setData({
      phone: wx.getStorageSync("mobile")
    })
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