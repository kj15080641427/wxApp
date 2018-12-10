// pages/search/filter/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:['熟悉行业','基本技能','扩展技能','第二语言','常去法院','常去检察院'],
    list2:['律师职位','所获荣誉','社会职务','增信担保','绿豆圈','商会组织'],
    select:'',
    gender:''
  },
  changeColor1:function(){
    this.setData({
      select:1,
    })
  },
  changeColor2: function () {
    this.setData({
      select: 2,
    })
  },
  changeColor3: function () {
    this.setData({
      select: 3,
    })
  },
  changeColor4: function () {
    this.setData({
      select: 4,
    })
  },
  changeColor5: function () {
    this.setData({
      select:5,
    })
  },
  changeColor6: function () {
    this.setData({
      select: 6,
    })
  },
  gender0:function(){
    this.setData({
      gender:'0'
    })
  },
  gender1: function () {
    this.setData({
      gender: '1'
    })
  },
  gender2: function () {
    this.setData({
      gender: '2'
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