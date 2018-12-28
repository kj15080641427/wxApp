// pages/my/balance-detail/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberId:'',
    detail:''
  },
  //交易明细详情
  gotoBalanceDetail:function(e){
    wx.navigateTo({
      url: '../balance-detail-two/index?detailList=' + JSON.stringify(this.data.detail[e.currentTarget.dataset.baindex]),
    })
    console.log(e)
  },
  //获取交易明细
  getBalanceDetail:function(){
    var url = api.getBalanceDetail()
    var data = { "memberId": this.data.memberId, "pageNum": '1',"pageSize":'500'}
    var success = (data)=>{
      this.setData({
        detail:data.data.list
      })
      console.log(this.data.detail)
    }
    var fail = (e)=>{
      console.log(e)
    }
    wxrequest.request(url,data,success,fail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      memberId:options.memberId
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
    this.getBalanceDetail()
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