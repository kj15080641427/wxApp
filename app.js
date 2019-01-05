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
                // if (!res.authSetting['scope.userLocation']) {
                //     wx.authorize({
                //         scope: 'scope.userLocation',
                //         success() {
                //             // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                //         }
                //     })
                // }
            },
        })
        wx.reportMonitor('1001', 2)
        wx.reportMonitor('1002', 1)
        wx.reportMonitor('1003', 1)
        wx.reportMonitor('1004', 1)
        wx.reportMonitor('1005', 1)
        wx.reportMonitor('1006', 1)
        wx.reportMonitor('1007', 1)
        wx.reportMonitor('1008', 1)
        wx.reportMonitor('1009', 1)
        wx.reportMonitor('1010', 1)
        wx.reportMonitor('1011', 1)
        wx.reportMonitor('1012', 1)
        wx.reportMonitor('1013', 1)
        wx.reportMonitor('1014', 1)
        wx.reportMonitor('1015', 1)
        wx.reportMonitor('1016', 1)
        wx.reportMonitor('1017', 1)
        wx.reportMonitor('1018', 1)
        wx.reportMonitor('1019', 1)
        wx.reportMonitor('1020', 1)
        wx.reportMonitor('1021', 1)
        wx.reportMonitor('1022', 1)
        wx.reportMonitor('1023', 1)
        wx.reportMonitor('1024', 1)
        wx.reportMonitor('1025', 1)
        wx.reportMonitor('1026', 1)
        wx.reportMonitor('1027', 1)
    },
    globalData: {
        userInfo: null,
        jMessage: new JMessage({
            debug: true   //  是否开启debug模式
        })
    }
})