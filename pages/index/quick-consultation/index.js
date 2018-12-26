// pages/index/quick-consultation/index.js
var wxrequest = require('../../../utils/request.js')
var api = require('../../../utils/api.js')
import wxPay from '../../../utils/wxPay.js'
var pay = require('../../../utils/wxPay.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // phoneInput:'',
    typeName:['婚姻家庭'],
    selectType:true,
    // payList: [
    //   { "icon":'../../../image/my_icon@3x/Rapidconsultation_icon_01_3x.png',"name":'微信支付',checked:true},
    //   { "icon": '../../../image/my_icon@3x/Rapidconsultation_icon_02_3x.png', "name": '账户余额', checked:false}
    //   ],
    selectProblem:'请选择问题类型',
    money:0,
    balance:'',
    checked1:true,
    checked2:false,
    phone:''
  },
  //
  changeChecked1:function(e){
    if(this.data.checked1 !==true){
      this.setData({
        checked1: !this.data.checked1,
        checked2: !this.data.checked2
      })
    }
    // console.log(this.data.payList[e.currentTarget.dataset.payindex].checked, e.currentTarget.dataset.payindex)
    console.log()
  },
  changeChecked2:function(){
    if(this.data.checked2 !== true){
      this.setData({
        checked2: !this.data.checked2,
        checked1: !this.data.checked1
      })
    }
  },
  // picker
  changeType:function(e){
    this.setData({
      index:e.detail.value,
      selectType:false,
      money: Number(e.detail.value)+1
    })
  },
  phoneInput:function(e){
    this.setData({
      phone: e.detail.value 
    })
    console.log(e.detail.value)
  },
  // 跳转
  gotofinish: function () {
    if (!this.data.index) {
      wx.showToast({
        title: '请选择问题类型',
        icon: 'none'
      })
    } else {
    if (!(/^1[345678]\d{9}$/.test(this.data.phone))) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
    }else{
      var t = { typeQuick: this.data.popular[this.data.index].id, money: this.data.money, type: 1, product: 3 }
      if(this.data.checked1){
        var that = this
        var payMoney = that.data.money
        console.log("money", that.data.money)
        wxPay(t).then(res => {
          console.log("微信支付", res.data.data.orderno)
          that.getQuick(res.data.data.orderno)
        })
      }else{
        var that = this
        var s = { typeQuick: this.data.popular[this.data.index].id, money: this.data.money, type: 3, product: 3 ,phone:this.data.phone}
        wxPay(s).then(res => {
          // this.getQuick.then(res.data.data.orderno)
          console.log("余额支付", res.data.data.orderno)
        },error => {console.log(error)})
      }
    }
  }
  },
  // 快速咨询
  getQuick: function (orderNo){
    var url = api.getQuick()
    var data = { "payOrderNo": orderNo, "payType": this.data.checked1 ?1:3, "payAmount": this.data.money, "typeId": this.data.popular[this.data.index].id}
    var success = data => {
      console.log("支付成功",data)
      wx.navigateTo({
        url: '../quick-consultation-finish/index?orderNo=' + data.data.orderNo + '&timeStamp=' + data.data.timeStamp + '&type=' + this.data.popular[this.data.index].typeName + '&phone=' + this.data.phone +'&money=' + this.data.money
      })
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.request(url, data, success,fail)
  },
  //查询余额
  getBalance:function(){
    var url = api.getBalance() + wx.getStorageSync("memberId")
    var data = wx.getStorageSync("memberId")
    var success = (data)=>{
      console.log("余额",data)
      this.setData({
        balance: data.data.balanceAmount
      })
    }
    var fail = (e) => {
      console.log(e)
    }
    wxrequest.requestGetpar(url,data,'',success,fail)
  },
  //解决方案类型
  // getArticleType: function () {
  //   var that = this
  //   var url = api.getArticleTypeUrl()
  //   var messagetype = ""
  //   var data = { "pageNum": 1, "pageSize": 100 }
  //   var success = function (data) {
  //     console.log("解决方案分类list", data.data.list)
  //     that.setData({
  //       popular: data.data.list.reverse(),
  //     })
  //     // that.getArticleList()
  //     // initIndex: data.data.list[0].id
  //   }
  //   var fail = function (e) {
  //     console.log("解决方案错误", e)
  //   }
  //   wxrequest.requestPost(url, data, messagetype, success, fail)
  // },
  //快速咨询
  getQuType:function(){
    var url = api.getType()
    var data = {'quick':1}
    var success = data =>{
      console.log("快速咨询",data)
      this.setData({
        popular: data.data,
      })
    }
    var fail = data =>{
      console.log("快速咨询",e)
    }
    wxrequest.request(url,data,success,fail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getQuType()
    // this.getQuick()
    this.getBalance()
    var that = this
    that.setData({
      phone: wx.getStorageSync("mobile")
    })
    // // 文章分类
    // var typeUrl = api.getArticleTypeUrl()
    // var message = ""
    // var successType = function (data) {
    //   that.setData({
    //     typeName: data.data,
    //   })
    // }
    // var failType = function (e) {
    //   console.log("错误", e)
    // }
    // wxrequest.requestGet(typeUrl, message, successType, failType)
    // console.log('qqqq',this.data.typeName)
    // this.getArticleType()
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