// pages/search/filter/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select:'',
    gender:'',
    search:'',
    listIndex:'',
    indexPicker:'',
    click:false,
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
  getType:function(e){
    this.setData({
      listIndex: e.currentTarget.dataset.getindex
    })
    // var typeIndex = e.currentTarget.dataset.getindex;
    console.log("listIndex", this.data.listIndex)
  },
  bindPickerChange:function(e){
    var pickeridx = e.detail.value
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexPicker: e.detail.value,
      // click: true
    })
    
  },
  getList:function(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      var searchUrl = api.getSearch()
      var searchSuccess = function (data) {
        that.setData({
          search: data.data
        })
        console.log("成功", data.data)
      }
      var searchFail = function (e) {
        console.log("失败", e)
      }
      wxrequest.requestGet(searchUrl, ' ', searchSuccess, searchFail)
      // console.log("getInstitutype")
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
