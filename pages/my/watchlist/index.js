// pages/my/watchlist/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
var formatTime = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myFollow:''
  },

  //我的关注列表
  followList:function(){
    var that = this
    var url = api.getMyFollow()
    var data = {"pageNum":'1',"pageSize":'50'}
    var success=(data)=>{
      console.log(data)
      that.setData({
        myFollow:data.data.list
      })
      that.ageAddress()
    }
    // var success = function(data){
    //   console.log(data)
    // }
    var fail=e=>{
      console.log(e)
    }
    wxrequest.request(url,data,success,fail)
  },
  //年龄地址
  ageAddress:function(){
    var yearList = []
    var addressList = []
    var that = this
    that.data.myFollow ? that.data.myFollow.map(function (item) {
      yearList.push(formatTime.formatTime(new Date()).split("/")[0] - item.beginPracticeDate.split("-")[0])
    }) : console.log('????')
    that.data.myFollow ? that.data.myFollow.map(function (item) {
      addressList.push(item.region.split('-', 2))
    }) : ''
    that.setData({
      year: yearList,
      address: addressList,
      // region: region.citysData
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.followList()
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