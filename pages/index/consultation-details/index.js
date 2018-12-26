var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    answer:""
  },
  // 删除已发布咨询
  deleteInfo:function(){
    wx.showModal({
      title: '删除已发布的咨询?',
      cancelColor:"#717171",
      confirmColor:"#1ec88c",
      // content: '11'
      success:function(){
        console.log("确定")
      },
      fail:function(){
        console.log("取消")
      }
    })
  },
  //文字咨询列表
  getFreetextList:function(){
    var url = api.getFreetextList() +this.data.id+'/reply/1/10'
    var data = { "consultationId": this.data.id, "pageNum": '1',"pageSize":'10'}
    var success = data =>{
      this.setData({
        freeTextList:data.data.list
      })
      console.log("文字咨询列表",data)
      this.getFreeText()
    }
    var fail = e =>{
      console.log("文字咨询列表错误",e)
    }
    wxrequest.requestGetpar(url,data,'',success,fail)
  },
  //文字咨询回复详情
  getFreeText:function(){
    var url = api.getFreeText() + this.data.id + '/' + this.data.freeTextList[0].lawyerId +'/reply/detail/1/10'
    var data = { "consultationId": this.data.id, "lawyerId": this.data.freeTextList[0].lawyerId, "pageNum": 1,"pageSize":10}
    var success = data =>{
      this.setData({
        freeText:data.data
      })
      console.log("文字咨询回复详情",data)
    }
    var fail = e =>{
      console.log("文字咨询回复详情", e)
    }
    wxrequest.requestGetpar(url,data,'',success,fail)
  },
  //文字咨询详情
  // getReply:function(){
  //   var url = api.getFreeText()
  //   var data = {}
  //   var success = data =>{
  //     console.log(data)
  //   }
  //   var fail = e =>{
  //     console.log(e)
  //   }
  //   wxrequest.request(url,data,success,fail)
  // },
  // 回复
  gotoReply:function(){
    wx.navigateTo({
      url: '../consultation-reply/index?id=3',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: JSON.parse(options.orderDetail).id
    })
    console.log(JSON.parse(options.orderDetail))
    this.getFreetextList()
    // this.getFreetextList()
    // this.getReply()
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