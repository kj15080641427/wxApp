// pages/search/demand-detail/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markId:'',
    markList:'',
    region: ['广东省', '广州市', '海珠区'],
    selist: [],
    seindex:''
  },
  //标签列表
  getMark:function(){
    var that = this
    var url = api.getMark()
    var data = { "pageNum": 1, "pageSize": 10, "typeId": that.data.businessTypeId}
    var success = function(data){
      data.data.list.map(function(item){
        that.data.selist.push({ "is": false })
      })
      that.setData({
        markList:data.data.list
      })
      console.log(data)
    }
    var fail = function(e){
      console.log(e)
    }
    wxrequest.request(url,data,success,fail)
  },
  //是否选中 
  isSelected:function(e){
    this.setData({
      seindex: e.currentTarget.dataset.selectindex,
      [`selist[${e.currentTarget.dataset.selectindex}].is`]: !this.data.selist[e.currentTarget.dataset.selectindex].is
    })
    console.log("selist",this.data.seindex)
  },
  //
  // getSelectIndex:function(e){
  //   console.log("catch",e)
  // },
  //region
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // markId: JSON.parse(options.busiType)
    })
    // console.log(this.data.markId)
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
    this.getMark()
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