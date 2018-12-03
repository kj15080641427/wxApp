// pages/login/index.js
var api = require ('../../utils/api.js')
var wxrequest = require('../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputPhone:'',
    inputCode:''
  },
  //获取手机号输入框值
  getPhoneInput:function(e){
    this.setData({
      inputPhone:e.detail.value
    })
  },
  //获取验证码输入框值
  getCodeInput:function(e){
    this.setData({
      inputCode:e.detail.value
    })
  },

  // 获取验证码
  getVerificationCode: function () {
    var verifyCodeUrl = api.getVerifyCodeUrl()
    var verifydata = { "phone": `${this.data.inputPhone}`,"code":"654321"}
    var success = function (data){
      console.log(data)
    }
    var fail = function (e){
      console.log(e)
    }
    // 
    wxrequest.request(verifyCodeUrl,verifydata,success,fail)
  },

  // 用户注册登录
  userLogin:function(){
    var message = "1"
    var loginUrl = api.getLoginUrl()
    var logindata = { "phone": `${this.data.inputPhone}`, "verifyCode": `${this.data.inputCode}`,"code":"654321"}
    var success = function (data){
      console.log(data)
      if(data.code == 0){
        console.log("注册成功")
      }else{
        console.log("注册失败")
      }
      var loginToken = wx.setStorage({"token":data.data.token})
      console.log(loginToken)
    }
    var fail = function (data){
      console.log(data)
    }
    // 
    wxrequest.request(loginUrl, logindata,success,fail)
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