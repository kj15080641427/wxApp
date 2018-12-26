// pages/my/order/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:'',//我的订单列表
    mobile:'',//电话
  },
  getOrderIndex:function(e){
    var that = this
    if (that.data.order[e.currentTarget.dataset.orderindex].orderType == '免费文字咨询'){
      wx.navigateTo({
        url: '../../index/consultation-details/index?orderDetail=' + JSON.stringify(this.data.order[e.currentTarget.dataset.orderindex]) + '&mobile=' + this.data.mobile,
      })
    } else if (that.data.order[e.currentTarget.dataset.orderindex].orderType == '需求'){
      wx.navigateTo({
        url: '../../message/index',
      })
    } else if (that.data.order[e.currentTarget.dataset.orderindex].orderType =='快速电话咨询'){
      wx.navigateTo({
        url: '../order-detail/index?orderno=' + that.data.order[e.currentTarget.dataset.orderindex].orderNo,
      })
    }
    console.log("index",e)
  },
  //订单
  getOrder:function(){
    var url = api.getOrder()
    var data = { "memberId": this.data.memberId,"pageNum":1,"pageSize":50}
    var success = (data)=>{
      this.setData({
        order:data.data.list
      })
      console.log("订单",data)
    }
    var fail = (e)=>{
      console.log(e)
    }
    wxrequest.request(url,data,success,fail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      memberId:options.memberId,
      mobile: options.mobile
    })
    this.getOrder()
    console.log("??", options.memberId)
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