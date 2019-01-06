// pages/my/cash/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
import hex_md5 from '../../../jM/md5.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance:''
  },
  //姓名
  name:function(e){
    this.setData({
      userName:e.detail.value
    })
  },
  //支付宝
  acc:function(e){
    this.setData({
      account:e.detail.value
    })
  },
  cash:function(){
    var that = this
    var moneyt = that.data.balance
    var accountt = that.data.account
    var namet = that.data.userName
    const res = wx.getSystemInfoSync()
    let _ua = 'wxapp:brand(' + res.brand + ')model(' + res.model + ')system(' + res.system + ')SDKVersion(' + res.SDKVersion + ')'
    var url = api.getCash()
    var data = { intmoney: parseInt(moneyt), money: moneyt, account: accountt, name: namet, ua: _ua, sign: hex_md5('money=' + parseInt(moneyt)+'&account='+accountt+'&ua='+_ua) }
    console.log('money=' + parseInt(moneyt) + '&account=' + accountt + '&ua=' + _ua)
    var success = data =>{
      wx.showToast({
        title: '提现成功',
        icon:'none'
      })
      wx.navigateBack({
        // delta:5
      })
      console.log(data)
    }
    var fail = e =>{
      wx.showToast({
        title: '提现失败',
        icon:'none'
      })
    }
    if (that.data.balance >= 1){
    wxrequest.request(url,data,success,fail)
    }else{
      wx.showToast({
        title: '余额大于1元才能提现',
        icon:'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      balance: JSON.parse(options.balance).data.balanceAmount
    })
    console.log(this.data.balance)
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