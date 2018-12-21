
import api from './api.js'
import hex_md5 from '../jM/md5.js'
//  获取微信支付信息
const getPayInfo = (money) =>{
    const res = wx.getSystemInfoSync()
    let _ua = 'brand(' + res.brand + ') model(' + res.model + ') system(' + res.system + ') SDKVersion(' + res.SDKVersion
    
    wx.request({
        url: api.getPayInfo(),
        method: 'POST',
        header: { 'x-Token': wx.getStorageSync('token') },
        data: {
            money: money, //   分
            type: 1, // 1微信 2支付宝
            source: 1, //1小程序 2APP
            ua: _ua,
            sign: hex_md5(_ua)
        },
        success(res) {
            console.log(res)
        }
    })
}
//  调取统一下单
// wx.request({
//     url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
//     method: 'POST',
//     data: {
//         appid: '',
//         mch_id: '',
//         nonce_str: '',
//         sign: '',
//         body: '',
//         out_trade_no: '',
//         fee_type: 'CNY',
//         total_fee: '',
//         spbill_create_ip: '',
//         notify_url: '',
//         trade_type: 'JSAPI支付',
//     },
//     success(res){
//         console.log(res.return_code)
//         wx.requestPayment({
//             'timeStamp': '',
//             'nonceStr': '',
//             'package': '',
//             'signType': 'MD5',
//             'paySign': '',
//             'success':function(res){},
//             'fail':function(res){},
//             'complete':function(res){}
//         })
//     }
// })

export default getPayInfo