// pages/index/quick-consultation-finish/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipList:[
      { "key": '订单编号', "value": ' '},
      { "key": '订单日期', "value": ' ' },
      { "key": '商品名称', "value": ' 快速咨询' },
      { "key": '商品类型', "value": ' ' },
      { "key": '联系手机', "value": '' },
      { "key": '订单金额', "value": '' }
    ]
  },
  goHome:function(){
    wx.switchTab({
      url: '../../../pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     ['tipList[0].value']: options.orderNo,
     ['tipList[1].value']: options.timeStamp,
     ['tipList[3].value']: options.type,
     ['tipList[4].value']: options.phone,
     ['tipList[5].value']: options.money,
   })
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