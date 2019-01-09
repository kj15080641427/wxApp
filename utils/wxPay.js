import api from './api.js'
import hex_md5 from '../jM/md5.js'
var App = getApp()
var device = App.globalData.device
// var device = {
//   "device_type": 5,
//   "app_version": "1.0",
//   "app_version_code": 1,
//   "channel": "wxapp"
// }
//  获取微信支付信息
const getPayInfo = (v) => {
  return new Promise((reslove, reject) => {
    const res = wx.getSystemInfoSync()
    let _ua = 'wxapp:brand(' + res.brand + ') model(' + res.model + ') system(' + res.system + ') SDKVersion(' + res.SDKVersion + ')'

    // <<<<<<< HEAD
    wx.request({
      url: api.getPayInfo(),
      method: 'POST',
      header: {
        'x-Token': wx.getStorageSync('token')
      },
      data: {
        money: v.money, //money, //   分
        type: v.type, // 1微信 2支付宝 3余额
        source: 1, //1小程序 2APP
        ua: _ua,
        sign: hex_md5('money=' + v.money + '&type=' + v.type + '&source=1&ua=' + _ua),
        openid: wx.getStorageSync('openid'),
        product: v.product // 1.增信保证金 2.快速咨询 3.专家咨询 4.充值 5.发需求
      },
      success(res) {
        if (res.data.code == 0) {
          if (v.type == 1) {
            wx.requestPayment({
              timeStamp: res.data.data.timestamp,
              nonceStr: res.data.data.nonceStr,
              package: 'prepay_id=' + res.data.data.prepayId,
              signType: 'MD5',
              paySign: res.data.data.sign,
              success: function(payRes) {
                if (v.product == 2) {
                  wx.request({
                    url: api.getQuick(),
                    header: {
                      'Content-Type': 'application/json',
                      'device': JSON.stringify(device),
                      'X-Token': wx.getStorageSync("token")
                    },
                    method: "POSt",
                    data: {
                      payOrderNo: res.data.data.orderno,
                      phone: v.phone,
                      payType: 1,
                      payAmount: v.money / 100,
                      typeId: v.typeQuick.id
                    },
                    success(data) {
                      console.log("余额支付33", data)
                      wx.navigateTo({
                        url: '../quick-consultation-finish/index?orderNo=' + data.data.data.orderNo + '&timeStamp=' + data.data.data.timeStamp + '&type=' + v.typeQuick.typeName + '&phone=' + v.phone + '&money=' + v.money / 100,
                      })
                      reslove(data)
                    },
                    fail(e) {
                      console.log("余额支付失败333", e)
                    }
                  })
                } else if (v.product == 4) {
                  reslove(res)
                }
              },
              fail: function(res) {
                wx.hideLoading()
                console.log(res)
                reject(new Error(res))
              },
              complete: function(res) {}
            })
          } else if (v.type == 3 && v.product == 2) {
            wx.request({
              url: api.getQuick(),
              header: {
                'Content-Type': 'application/json',
                'device': JSON.stringify(device),
                'X-Token': wx.getStorageSync("token")
              },
              method: "POSt",
              data: {
                payOrderNo: res.data.data.orderno,
                payType: 3,
                phone: v.phone,
                payAmount: v.money / 100,
                typeId: v.typeQuick.id
              },
              success(data) {
                console.log("余额支付33", data)
                wx.navigateTo({
                  url: '../quick-consultation-finish/index?orderNo=' + data.data.data.orderNo + '&timeStamp=' + data.data.data.timeStamp + '&type=' + v.typeQuick.typeName + '&phone=' + v.phone + '&money=' + v.money / 100,
                })
              },
              fail(e) {
                wx.hideLoading()
                // console.log("余额支付失败333", e)
                reject(new Error(res))
              }
            })
          } else if (v.type == 3 && v.product == 3) {
            console.log('专家咨询支付', res)
            wx.request({
              url: api.getExpertPhone() + v.lawyerId,
              data: '',
              header: {
                'Content-Type': 'application/json',
                'device': JSON.stringify(device),
                'X-Token': wx.getStorageSync("token")
              },
              method: 'GET',
              dataType: 'json',
              responseType: 'text',
              success: function(res) {
                v.downTime
                v.countDown = true
                console.log(res)
                reslove(res)
              },
              fail: function(res) {
                console.log(res)
                reject(new Error(res))
              },
              complete: function(res) {},
            })
          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          v.go = true
          reject(res)
        }
      }
    })
  })
}


export default getPayInfo