var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answer:"哈哈哈哈呵呵哈哈哈呵呵哈哈哈哈哈哈哈"
  },
  userreply:function(e){
    this.setData({
      replyInput:e.detail.value
    })
  },
//回复
  confirm(e){
    var that = this
    var url = api.getUserReply() + wx.getStorageSync("consultationId") +'/reply/post'
    var data = { "consultationId": wx.getStorageSync("consultationId"), "type": 2, "content": that.data.replyInput, "lawyerId": wx.getStorageSync("freeTextList").lawyerId}
    var success = data =>{
      this.setData({
        reply:data.data
      })
      console.log("用户回复",data.data)
    }
    var fail = e=>{
      console.log(e)
    }
    wxrequest.request(url,data,success,fail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      freeTextList: wx.getStorageSync("freeTextList"),
      lawtList: options.lawtList,
      lawago: options.lawago,
      lawagoText:options.lawagoText
    })
    console.log("huifu",this.data.freeTextList)
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