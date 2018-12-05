// pages/my/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[
      {"time":'2018-01-01 01:01',"consulType":'快速咨询',"problemType":'婚姻家事',"statu":'待接单',"lawyer":''},
      { "time": '2017-01-01 01:01', "consulType": '发布需求', "problemType": '知识产权', "statu": '待接单', "lawyer": '刘岩' },
      {"time":'2017-01-01 01:01',"consulType":'免费文字咨询',"problemType":'知识产权',"statu":'已完成',"lawyer":'' },
      { "time": '2017-01-01 01:01', "consulType": '专家咨询', "problemType": '知识产权', "statu": '已关闭', "lawyer": '陈宇龙' },
      { "time": '2017-01-01 01:01', "consulType": '免费电话咨询', "problemType": '知识产权', "statu": '进行中', "lawyer": '' },
      
      ]
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