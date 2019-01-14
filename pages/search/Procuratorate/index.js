// pages/search/Procur/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
var reg = require('../../../region.js');
// import pc from '../../../..//utils/search.js'
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
      url: '/pages/search/Procuratorate/search/index',
    })
  },
  //法院列表
  getProcur: function (ProcurName) {
    var url = api.getProcur()
    var data = {
      keywords: ProcurName,
      regionId: '',
      pageNum: 1,
      pageSize: 1
    }
    var success = data => {
      this.setData({
        bestProcur: data.data.result.list[0]
      })
      console.log('success',data)
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
  },
  //选择最高人民法院
  selectBestProcur: function (e) {
    wx.setStorageSync('ProcurId', this.data.bestProcur.institutionId)
    wx.setStorageSync('ProcurName', this.data.bestProcur.institutionName)
    wx.navigateBack({
      delta: 1,
    })
    // console.log(this.data.bestProcur, e.currentTarget.dataset.index)
  },
  //选择
  toSelectCity:function(e){
    wx.navigateTo({
      url: '/pages/search/Procuratorate/city/index?city=' + JSON.stringify(this.data.city[e.currentTarget.dataset.cityindex].child) + '&regionId=' + this.data.city[e.currentTarget.dataset.cityindex].regionId + '&noFilter=' + this.data.noFilter,
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
      city: reg.citysData,
      noFilter: options.noFilter
    })
    console.log(this.data.noFilter)
    this.getProcur('最高人民')
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