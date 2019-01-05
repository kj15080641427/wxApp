// pages/my/order-detail/index.js
var formatTime = require('../../../utils/util.js')
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:true,
    detailList:[
      { "name": '订单编号', "text": ''},
      { "name": '订单日期', "text": '' },
      { "name": '商品名称', "text": '' },
      { "name": '咨询类型', "text": '' },
      { "name": '联系手机', "text": '' },
      { "name": '订单金额', "text": '' },
      { "name": '订单状态', "text": '' },
      ],
    statusValue:false
    // orderDetail:''
  },
  // gotoChat:function(){
  //   if(this.data.lawyerPhone){

  //   }
  //   // wx.navigateTo({
  //   //   url: '../order-chat/index',
  //   // })
  // },
  //获取律师电话
  getLawyerPhone:function(){
    var url = api.getLawyerPhone() + this.data.orderDetail.orderNo
    var success = (data=>{
      this.setData({
        lawyerPhone:data.data
      })
      wx.makePhoneCall({
        phoneNumber: data.data.phone
      })
    })
    var fail=(e)=>{
      console.log(e)
      wx.showToast({
        title: e.data.message,
        icon:'none'
      })
    }
    wxrequest.requestGet(url,'',success,fail)
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.clear() //调用上一个页面方法
    // prevPage.onTabItemTap()

    var data = JSON.parse(options.orderDetail)
    this.setData({
      // orderDetail:data,
      orderDetail : JSON.parse(options.orderDetail),
      ['detailList[0].text']: data.orderNo,
      ['detailList[1].text']: data.createDate,
      ['detailList[2].text']: data.orderType,
      ['detailList[3].text']: data.typeName,
      ['detailList[4].text']: wx.getStorageSync("mobile"),//手机号
      ['detailList[5].text']: data.buyerPayAmount,
      ['detailList[6].text']: data.statusValue,
      // ['detailList[7].text']: data.beginTime
      startTime: data.grabTime
    })
    console.log('订单详情',JSON.parse(options.orderDetail))
    if (this.data.orderDetail.orderStatus == 5) {
      this.setData({
        statusValue: true
      })
    }
    // this.getLawyerPhone()
    var that = this
    // var startDate = this.data.startTime.split(" ")[0]
    // var nowDate = formatTime.formatTime(new Date()).split(" ")[0]
    // var startTime = this.data.startTime.split(" ")[1]
    // var nowTime = formatTime.formatTime(new Date()).split(" ")[1]
    // if (nowDate.split("/")[0]-startDate.split("-")[0]>0){
    //   this.setData({
    //     time: false
    //   })
    // } else if (nowDate.split("/")[1] - startDate.split("-")[1] > 0){
    //   this.setData({
    //     time: false
    //   })
    // } else if (nowDate.split("/")[2] - startDate.split("-")[2] > 0){
    //   this.setData({
    //     time: false
    //   })
    // } else if ((nowTime.split(":")[0] * 60 * 60 + nowTime.split(":")[1] * 60 + Number(nowTime.split(":")[2])) - (startTime.split(":")[0] * 60 * 60 + startTime.split(":")[1] * 60 + Number(startTime.split(":")[2]))>900){
    //   this.setData({
    //     time: false,
    //   })
    // }else{
      // var hasTime = 900-((nowTime.split(":")[0] * 60 * 60 + nowTime.split(":")[1] * 60 + Number(nowTime.split(":")[2])) - (startTime.split(":")[0] * 60 * 60 + startTime.split(":")[1] * 60 + Number(startTime.split(":")[2])))
      // var that = this
      // var secondInt = hasTime
      that.setData({
        minute: parseInt(data.remainingTime / 60),
        second: data.remainingTime % 60
      })
      this.setData({
        timedown:setInterval(function () {
          that.setData({
            second: that.data.second - 1
          })
          if (that.data.second <= 0 && that.data.minute > 0) {
            that.setData({
              second: 60,
            })
            if (that.data.minute != 0){
              that.setData({
                minute: that.data.minute - 1
              })
            }
          }
          if (that.data.minute <= 0 && that.data.second<=0) {
            that.setData({
              time:false,
              statusValue:false
            })
            clearInterval(that.data.timedown)
          }
        }, 1000)
      })
    // } 
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
    // clearInterval(this.data.timedown)
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
    clearInterval(this.data.timedown)
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