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
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        wx.login({
            success: res => {
                console.log(res)
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    url: api.appLogin(),
                    method: 'POST',
                    data: { code: res.code },
                    success(r) {
                        console.log(r)
                        wx.setStorageSync('openid', r.data.data.openid)
                    }
                })
            }
        })

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
            },
        })
    },
    globalData: {
        userInfo: null,
        jMessage: new JMessage({
            debug: true   //  是否开启debug模式
        })
    }
})