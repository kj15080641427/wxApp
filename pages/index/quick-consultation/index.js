// pages/index/quick-consultation/index.js
var wxrequest = require('../../../utils/request.js')
var api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneInput:'',
    typeName:['婚姻家庭'],
    selectType:true,
    // payList: [
    //   { "icon":'../../../image/my_icon@3x/Rapidconsultation_icon_01_3x.png',"name":'微信支付',checked:true},
    //   { "icon": '../../../image/my_icon@3x/Rapidconsultation_icon_02_3x.png', "name": '账户余额', checked:false}
    //   ],
    selectProblem:'请选择问题类型',
    money:0,
    balance:10.5,
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
      money: Number(e.detail.value)+100
    })
  },
  phoneInput:function(e){
    this.setData({
      phoneInput: e.detail.value 
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
    } else if (!(/^1[345678]\d{9}$/.test(this.data.phoneInput))) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
    }else {
      wx.navigateTo({
        url: '../quick-consultation-finish/index',
      })
    }
  },
  //解决方案类型
  getArticleType: function () {
    var that = this
    var url = api.getArticleTypeUrl()
    var messagetype = ""
    var data = { "pageNum": 1, "pageSize": 100 }
    var success = function (data) {
      console.log("解决方案分类list", data.data.list)
      that.setData({
        popular: data.data.list.reverse(),
      })
      // that.getArticleList()
      // initIndex: data.data.list[0].id
    }
    var fail = function (e) {
      console.log("解决方案错误", e)
    }
    wxrequest.requestPost(url, data, messagetype, success, fail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getArticleType()
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