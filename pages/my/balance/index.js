// pages/my/balance/index.js
var api = require('../../../utils/api.js')
import wxPay from '../../../utils/wxPay.js'
var wxrequest = require('../../../utils/request.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        balance: '',
        memberId: ''
    },
    //交易明细
    gotoDetail: function () {
        wx.navigateTo({
            url: '../balance-detail/index?memberId=' + this.data.memberId,
        })
    },
    //提现
    gotoCash: function () {
        wx.navigateTo({
            url: '../cash/index?balance=' + JSON.stringify(this.data.balance),
        })
    },
    //获取账户余额
    getBalance: function () {
        var url = api.getBalance() + this.data.memberId
        var data = {
            "memberId": this.data.memberId
        }
        var succeee = (data) => {
            console.log(data)
            this.setData({
                balance: data
            })
          console.log("余额", this.data.balance.data.balanceAmount)
        }
        var fail = (e) => {
            console.log(e)
        }
        wxrequest.requestGetpar(url, data, '', succeee, fail)
    },
    charge(e){
        //  调取微信支付
        wxPay(e.currentTarget.dataset.amt * 100)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            memberId: options.memberId
        })
        this.getBalance()
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