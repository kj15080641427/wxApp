// pages/my/edit-info/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[{"nikeName":'北雁南飞',"gender":'女',"birth":'1976-01-01',"address":'湖南 常德'}],
    region:['湖南省','长沙市','芙蓉区'],
    date:['1980-01-01'],
    gender:['女','男'],
    index:'0',
    infoList:['您的行业','您的企业','您的职务','您的邮箱']
  },
  // 性别
  bindChange:function(e){
    this.setData({
      index:e.detail.value
    })
  },
  // 选择地区
  bindRegionChange:function(e){
    this.setData({
      region: e.detail.value
    })
  },
  // 选择时间
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 更换头像
  replaceAvatar:function(){
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res)
      },
    })
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