// pages/search/demand-type/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    busiTypes:'',
    typeindex:'',
    demandType:''
  },
  //完善信息
  gotoDetail:function(e){
    wx.navigateTo({
      url: '../demand-detail/index?busiTypes=' + JSON.stringify(this.data.busiTypes[e.currentTarget.dataset.typeindex]) + '&demandType=' + JSON.stringify(this.data.demandType),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      busiTypes: JSON.parse(options.demandType)[options.index].busiTypes,
      demandType: JSON.parse(options.demandType)[options.index],
      typeindex:options.index
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
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    setTimeout(()=>{
      wx.hideLoading()
    },500)
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