// pages/search/lawyerList/index.js
var formatTime = require('../../../utils/util.js')
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lawyerList:'',
    year:'',
    // index:''
  },
// 获取index
  getIndex:function(e){
    // this.setData({    "pages/search/lawyer-list/index",
    //   index: e.currentTarget.dataset
    // })
    var that = this
    var lawyerData = that.data.lawyerList[e.currentTarget.dataset.index]
    var index = e.currentTarget.dataset.index
    var lawyerInfoUrl = api.getlawyerInfo() + this.data.lawyerList[e.currentTarget.dataset.index].memberId
    var lawyerData = this.data.lawyerList[e.currentTarget.dataset.index].memberId
    var success = function (data) {
      console.log("律师详细信息",data)
      wx.navigateTo({
        url: '../lawyer-detail/index?lawyerInfo=' +JSON.stringify(data.data)+ '&listIndex=' + index ,
      })
    }
    var fail = function (e) {
      wx.showToast({
        title: '获取律师信息失败',
      })
      console.log(e)
    }
    wxrequest.requestGetpar(lawyerInfoUrl, lawyerData,'', success, fail)
  },
// 律师详情
  getLawyerInfo:function(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      lawyerList:wx.getStorageSync("lawyerList").list
    })
    console.log("律师列表", this.data.lawyerList)
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
    var yearList = []
    // console.log(this.data.lawyerList[1].beginPracticeDate.split("-")[0])
    // console.log(formatTime.formatTime(new Date()).split("/")[0] - this.data.lawyerList[1].beginPracticeDate.split("-")[0])
    this.data.lawyerList.map(function(item){
      yearList.push(formatTime.formatTime(new Date()).split("/")[0]-item.beginPracticeDate.split("-")[0])
    })
    this.setData({
      year: yearList
    })
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