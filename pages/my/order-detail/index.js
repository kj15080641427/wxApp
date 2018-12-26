// pages/my/order-detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:'00:28:21',
    detailList:[
      { "name": '订单编号', "text": ''},
      { "name": '订单日期', "text": '2018-12-12 14:03' },
      { "name": '商品名称', "text": '快速咨询' },
      { "name": '咨询类型', "text": '婚姻家庭' },
      { "name": '联系手机', "text": '13333333333' },
      { "name": '订单金额', "text": '¥99' },
      { "name": '订单状态', "text": '进行中' },
      { "name": '订单详情', "text": '内容'}
      ],
    // orderDetail:''
  },
  gotoChat:function(){
    wx.navigateTo({
      url: '../order-chat/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = JSON.parse(options.orderDetail)
    this.setData({
      // orderDetail:data,
      ['detailList[0].text']: data.orderNo,
      ['detailList[1].text']: data.createDate,
      ['detailList[2].text']: data.orderType,
      ['detailList[3].text']: data.typeName,
      ['detailList[4].text']: options.mobile,//手机号
      ['detailList[5].text']: data.buyerPayAmount,
      ['detailList[6].text']: data.statusValue,
      ['detailList[7].text']:data.content
    })
    console.log(data)
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