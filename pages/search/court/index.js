// pages/search/court/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
var reg = require('../../../region.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
  },
  //搜索
  toSearch:function(){
    wx.navigateTo({
      url: '/pages/search/court/search/index',
    })
  },
  //法院列表
  getCourt: function (courtName) {
    var url = api.getCourt()
    var data = {
      keywords: courtName,
      regionId: '',
      pageNum: 1,
      pageSize: 1
    }
    var success = data => {
      this.setData({
        bestCourt: data.data.result.list[0].institutionName
      })
      console.log('success',data)
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
  },
  //选择
  toSelectCity:function(e){
    wx.navigateTo({
      url: '/pages/search/court/city/index?city=' + JSON.stringify(this.data.city[e.currentTarget.dataset.cityindex].child) + '&province=' + this.data.city[e.currentTarget.dataset.cityindex].name,
    })
    // this.setData({
    //   city: this.data.city[e.currentTarget.dataset.cityindex].child
    // })
    // console.log(e)
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      city: reg.citysData
    })
    console.log(this.data.city)
    this.getCourt('最高人民')
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