// pages/login/index.js
var api = require('../../utils/api.js')
var wxrequest = require('../../utils/request.js')
import hex_md5 from '../../jM/md5.js'
var app = getApp()
var jM = app.globalData.jMessage
Page({
    /**
     * 页面的初始数据
     */
  data: {
      inputPhone: '',
      inputCode: '',
      isFocus:false, //
      countdown:60,
      startCountdown:false
  },
  //获取手机号输入框值
  getPhoneInput: function (e) {
      this.setData({
          inputPhone: e.detail.value
      })
  },
// <<<<<<< HEAD
        // setTimeout(function(){
        //   wx.navigateBack({
        //     delta:2
        //   })
        // },1000)

      // var that = this
      // // 获取用户信息
      // var userInfoUrl = api.getUserInfo()
      // var message = ''
      // var idData = wx.getStorageSync("token")
      // var success = function (data) {
      //   wx.setStorage({
      //     key: 'memberId',
      //     data: data.data.memberId,
      //   })
// =======}
        // console.log('inputphone', this.data.inputPhone)
    
    
    //获取验证码输入框值
    getCodeInput: function (e) {
        this.setData({
            inputCode: e.detail.value
        })
    },
    // 获取验证码
    getVerificationCode: function () {
        var that = this
        var verifyCodeUrl = api.getVerifyCodeUrl()
        var verifydata = {
            "phone": `${this.data.inputPhone}`,
            "code": "654321"
        }
        var success = function (data) {
            wx.showToast({
                title: '发送成功',
            })
          that.getCountdown()
          that.setData({
            isFocus: true
          })
            console.log(data)
        }
        var fail = function (e) {
            wx.showToast({
                title: e.message,
                icon: 'none'
            })
            console.log(e)
        }
        // 
        if (!(/^1[345678]\d{9}$/.test(this.data.inputPhone))) {
            wx.showToast({
              title: '手机号错误',
              icon:'none'
            })
        } else {
            wxrequest.request(verifyCodeUrl, verifydata, success, fail)
        }
    },

    // 注册
    userLogin: function () {
        var message = "1"
        var loginUrl = api.getLoginUrl()
        var logindata = {
            "phone": `${this.data.inputPhone}`,
            "verifyCode": `${this.data.inputCode}`,
            "code": "654321"
        }
        var success = function (data) {
            console.log(data)
            // if(data.code == 0){
            wx.showToast({
                title: '注册成功',
            })
            setTimeout(function () {
                wx.navigateBack({
                    delta: 2
                })
            }, 1000)
            wx.setStorageSync("token", data.data.token)
            // console.log("注册成功", data)
            // console.log("token111", wx.getStorageSync("token"))

            var that = this
            // 获取用户memberID信息
            var userInfoUrl = api.getUserInfo()
            var message = ''
            var idData = wx.getStorageSync("token")
            var success = function (res) {
                wx.setStorageSync("userInfo", res.data)
                wx.setStorageSync("memberId", res.data.memberId)
                wx.setStorageSync("mobile", res.data.mobile)
                if(!jM.isLogin()){
                    wxrequest.superRequest(api.getImConfig(),{},'GET').then(res => {
                        console.log('config:',res)
                        //  初始化jmessage
                        wx.setStorageSync('appkey', res.data.data.appkey)
                        jM.init({
                            "appkey"    : res.data.data.appkey,
                            "random_str": res.data.data.random,
                            "signature" : res.data.data.signature,
                            "timestamp" : res.data.data.timestamp,
                            "flag": 1
                        }).onSuccess(function(data) {
                            jM.login({
                                'username' : 'lex' + wx.getStorageSync('memberId'),
                                'password' : hex_md5(wx.getStorageSync('mobile'))
                            }).onSuccess(function(lData) {
                                console.log('jm-login:',lData)
                                wx.hideLoading()
                                wx.navigateBack({
                                    delta:1
                                })
                            }).onFail(function(data){
                                console.log(data.message)
                                wx.hideLoading()
                                //同上
                            })
                        }).onFail(function(data) {
                            console.log(data)
                            wx.hideLoading()
                        }); 
                    },error => {console.log(error);wx.hideLoading()})
                }
            }
            var fail = function (e) {
                console.log("memberId",e)
            }
            wxrequest.requestGet(userInfoUrl, message, success, fail)

            // }else{
            //   wx.showToast({
            //     title: '注册失败',
            //     icon: 'none'
            //   })
            // }
            // var loginToken = wx.getStorage({"token":data.data.token})
            // console.log("token2",loginToken)
        }
        var fail = function (data) {
            wx.showToast({
              title: data.message ? data.message:data,
                icon: 'none'
            })
            console.log(data)
        }
        // 
        if (this.data.inputPhone !== '' && this.data.inputCode !== '') {
            wxrequest.request(loginUrl, logindata, success, fail)
        } else {
            wx.showToast({
                title: '不能为空',
                icon: 'none'
            })
        }
    },
    //倒计时
    getCountdown:function(){
      var that = this
      var interval  = setInterval(function(){
        that.setData({
          countdown:that.data.countdown - 1,
          startCountdown:true
        })
        if(that.data.countdown <= 0){
          clearInterval(interval)
          that.setData({
            startCountdown:false,
            countdown:60
          })
        }
        // console.log(that.data.countdown)
      },1000)
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
        wx.login({
            success: res => {
                console.log(res)
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    url: api.appLogin(),
                    method: 'POST',
                    data: { code: res.code },
                    success(r){
                        console.log(r)
                        wx.setStorageSync('openid', r.data.data.openid)
                    }
                })
            }
        })
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