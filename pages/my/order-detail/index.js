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
        phoneNumber: data.data
      })
      console.log('获取律师电话',data)
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
    if (this.data.orderDetail.orderStatus == 5) {
      this.setData({
        statusValue: true
      })
    }
    // this.getLawyerPhone()

    var startDate = this.data.startTime.split(" ")[0]
    var nowDate = formatTime.formatTime(new Date()).split(" ")[0]
    var startTime = this.data.startTime.split(" ")[1]
    var nowTime = formatTime.formatTime(new Date()).split(" ")[1]
    console.log("订单开始时间", this.data.startTime.split(" "))
    console.log("现在时间",formatTime.formatTime(new Date()).split(" "))
    if (nowDate.split("/")[0]-startDate.split("-")[0]>0){
      this.setData({
        time: false
      })
      console.log('年', nowDate.split("/")[0] - startDate.split("-")[0])
    } else if (nowDate.split("/")[1] - startDate.split("-")[1] > 0){
      this.setData({
        time: false
      })
      console.log('月')
    } else if (nowDate.split("/")[2] - startDate.split("-")[2] > 0){
      this.setData({
        time: false
      })
      console.log('日')
    } else if ((nowTime.split(":")[0] * 60 * 60 + nowTime.split(":")[1] * 60 + Number(nowTime.split(":")[2])) - (startTime.split(":")[0] * 60 * 60 + startTime.split(":")[1] * 60 + Number(startTime.split(":")[2]))>900){
      this.setData({
        time: false,
      })
      console.log('小时')
    }else{
      var hasTime = 900-((nowTime.split(":")[0] * 60 * 60 + nowTime.split(":")[1] * 60 + Number(nowTime.split(":")[2])) - (startTime.split(":")[0] * 60 * 60 + startTime.split(":")[1] * 60 + Number(startTime.split(":")[2])))
      // this.setData({
      //   hasTime: 900-hasTime,
      //   // statusValue: true
      // })
      console.log("剩余时间", hasTime, startTime.split(":")[2])
      var that = this
      var secondInt = hasTime
      that.setData({
        minute: parseInt(secondInt / 60),
        second: secondInt % 60
      })
      console.log('计时器', that.data.minute)
      this.setData({
        timedown:setInterval(function () {
          // var downTime = hasTime -- 
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
            console.log("清除计时器")
          }
          console.log('计时器', that.data.second)
        }, 1000)
      })
    } 
    // console.log("??????", startTime.split(":")[0] * 60 * 60 + startTime.split(":")[1] * 60 + Number(startTime.split(":")[2]) )
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