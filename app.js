//app.js
import JMessage from './jM/jmessage-wxapplet-sdk-1.4.0.min'
import api from './utils/api'
App({
  device: {
    "device_type": 1,
    "app_version": "2.0",
    "app_version_code": 2,
    "channel": "wxapp"
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // wx.checkSession({
    //     success(data) {
    //         console.log(data)
    //       // session_key 未过期，并且在本生命周期一直有效
    //     },
    //     fail() {
    //       // session_key 已经失效，需要重新执行登录流程
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: api.appLogin(),
          method: 'POST',
          data: {
            code: res.code
          },
          success(r) {
            console.log(r)
            wx.setStorageSync('openid', r.data.data.openid)
          }
        })
      }
    })
    //     }
    // })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
            }
          })
        }
        // else {
        //     // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //     wx.getUserInfo({
        //         success: res => {
        //             // 可以将 res 发送给后台解码出 unionId
        //             this.globalData.userInfo = res.userInfo

        //             // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //             // 所以此处加入 callback 以防止这种情况
        //             if (this.userInfoReadyCallback) {
        //                 this.userInfoReadyCallback(res)
        //             }
        //         }
        //     })
        // }
      }
    })
  },
  globalData: {
    userInfo: null,
    jMessage: new JMessage({
      debug: true //  是否开启debug模式
    })
  }
})