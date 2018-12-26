
import api from './api.js'
import hex_md5 from '../jM/md5.js'
//  获取微信支付信息
const getPayInfo = (money,product) =>{
    return new Promise((reslove,reject) => {
        const res = wx.getSystemInfoSync()
        let _ua = 'wxapp:brand(' + res.brand + ') model(' + res.model + ') system(' + res.system + ') SDKVersion(' + res.SDKVersion +')'
        
        wx.request({
            url: api.getPayInfo(),
            method: 'POST',
            header: { 'x-Token': wx.getStorageSync('token') },
            data: {
                money: money, //   分
                type: 1, // 1微信 2支付宝
                source: 1, //1小程序 2APP
                ua: _ua,
                sign: hex_md5('money='+money+'&type=1&source=1&ua='+_ua),
                openid: wx.getStorageSync('openid'),
                product: product // 1.增信保证金 2.快速咨询 3.专家咨询 4.充值 5.发需求
            },
            success(res) {
                wx.requestPayment({
                    timeStamp: res.data.data.timestamp,
                    nonceStr: res.data.data.nonceStr,
                    package: 'prepay_id=' + res.data.data.prepayId,
                    signType: 'MD5',
                    paySign: res.data.data.sign,
                    success:function(payRes){
                        reslove(payRes)
                    },
                    fail:function(res){
                        console.log(res)
                    },
                    complete:function(res){}
                })
            },
            fail:function(res){
                console.log(res)
            },
        })
    })
}


export default getPayInfo