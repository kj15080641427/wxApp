// pages/index/quick-consultation-finish/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipList:[
      { "key": '订单编号', "value": ' KS20180101'},
      { "key": '订单日期', "value": ' 2018-01-01 12:12' },
      { "key": '商品名称', "value": ' 快速咨询' },
      { "key": '商品类型', "value": ' 婚姻家庭' },
      { "key": '联系手机', "value": ' 13535353535' },
      { "key": '订单金额', "value": ' ¥99' }
    ]
  },
  goHome:function(){
    wx.switchTab({
      url: '../../../pages/index/index',
    })
    console.log(123)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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