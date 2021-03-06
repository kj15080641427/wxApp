// pages/my/balance-detail-two/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList: [
      { "name": '订单编号', "text": '' },
      { "name": '订单日期', "text": '' },
      { "name": '商品名称', "text": '' },
      { "name": '商品类型', "text": '' },
      { "name": '订单金额', "text": '' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = JSON.parse(options.detailList)
    this.setData({
      ['detailList[0].text']: data.orderNo,//编号
      ['detailList[1].text']: data.createDate,//日期
      ['detailList[2].text']: data.orderType,
      ['detailList[3].text']: data.typeName,
      // ['detailList[4].text']: wx.getStorageSync("userInfo").mobile,//手机号
      ['detailList[4].text']: data.buyerPayAmount,
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