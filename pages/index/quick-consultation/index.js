// pages/index/quick-consultation/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeName:['婚姻家庭','知识产权'],
    selectType:true,
    payList: [
      { "icon":'../../../image/my_icon@3x/Rapidconsultation_icon_01_3x.png',"name":'微信支付',checked:true},
      { "icon": '../../../image/my_icon@3x/Rapidconsultation_icon_02_3x.png', "name": '余额支付' }
      ]
  },
  // picker
  changeType:function(e){
    this.setData({
      index:e.detail.value,
      selectType:false
    })
  },
// 单选
  payType:function(e){
    console.log(e)
  },
  // 跳转
  gotofinish:function(){
    wx.navigateTo({
      url: '../quick-consultation-finish/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var typeName = wx.getStorageSync('typeName') 
    // console.log(typeName)
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