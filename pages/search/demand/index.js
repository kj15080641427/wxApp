// pages/search/demand/index.js
var wxrequest = require('../../../utils/request.js')
var api = require('../../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
      demandType:'',
      typeindex:''
  },
  //服务分类
  getDemandType:function(){
    var that = this
    var url = api.getDemandType()
    var data = wx.getStorage({
      key: 'token',
      success: function(res) {},
    })
    var success = function(data){
      that.setData({
        demandType:data.data
      })
      console.log("服务分类",data)
    }
    var fail = function(e){
      console.log(e)
    }
    wxrequest.requestGetpar(url, data, '', success, fail)
  },
  //index
  getTypeIndex:function(e){
    this.setData({
      typeindex:e.currentTarget.dataset.typeindex
    })
    if (this.data.demandType[e.currentTarget.dataset.typeindex].busiTypes[0].businessTypeId !== null){
      wx.navigateTo({
        url: '../demand-type/index?demandType=' + JSON.stringify(this.data.demandType) + '&index=' + e.currentTarget.dataset.typeindex,
      })
    }else{
      wx.showToast({
        title: '无擅长领域',
        icon: 'none'
      })
      wx.navigateTo({
        url: '../demand-detail/index?demandType=' + JSON.stringify(this.data.demandType) + '&index=' + e.currentTarget.dataset.typeindex+'&id=1',
      })
    }
  },
  //
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDemandType()
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