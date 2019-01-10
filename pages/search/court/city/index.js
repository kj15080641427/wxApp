var api = require('../../../../utils/api.js')
var wxrequest = require('../../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //高级法院
  getCourt: function (courtName) {
    var url = api.getCourt()
    var data = {
      keywords: courtName,
      regionId: '',
      pageNum: 1,
      pageSize: 10
    }
    var success = data => {
      this.setData({
        bestCourt: data.data.result.list[0].institutionName
      })
      console.log('success', data)
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
  },
  //
  toCounty:function(e){
    wx.navigateTo({
      url: '/pages/search/court/county/index?county=' + this.data.city[e.currentTarget.dataset.countyindex].regionId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      city: JSON.parse(options.city)
    })
    this.getCourt(options.province)
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