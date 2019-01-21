var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
var formatTime = require('../../../utils/util.js')
import Time from '../../../utils/date-time.js'
var x = []
var all = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    answer: "",
    i: 0
  },
  // // 删除已发布咨询
  // deleteInfo: function() {
  //   wx.showModal({
  //     title: '删除已发布的咨询?',
  //     cancelColor: "#717171",
  //     confirmColor: "#1ec88c",
  //     // content: '11'
  //     success: function() {},
  //     fail: function() {}
  //   })
  // },
  //单条文字咨询详情
  getFree: function() {
    var url = api.getFreeText() + this.data.id
    var data = {
      "consultationId": this.data.id
    }
    var success = data => {
      this.setData({
        freeOne: data.data
      })
    }
    var fail = e => {
      console.log(e)
      wx.hideLoading()
    }
    wxrequest.requestGetpar(url, data, '', success, fail)
  },
  //文字咨询列表
  getFreetextList: function() {
    var url = api.getFreetextList() + this.data.id + '/reply/1/10'
    var data = {
      "consultationId": this.data.id,
      "pageNum": '1',
      "pageSize": '10'
    }
    var success = data => {
      this.setData({
        freeTextList: data.data.list,
        freetotal: data.data,
        listLength: data.data.list.length,
        i: 0,
        allTotal: 0
      })
      all = 0
      x = []
      this.data.freeTextList.map(item => {
        this.getFreeText(item.consultationId, item.lawyerId)
      })
      this.lawTime()
      wx.hideLoading()
    }
    var fail = e => {
      console.log("文字咨询列表错误", e)
      wx.hideLoading()
    }
    wxrequest.requestGetpar(url, data, '', success, fail)
  },
  //文字咨询回复详情
  getFreeText: function(consultationId, lawyerId) {
    var url = api.getFreeText() + consultationId + '/' + lawyerId + '/reply/detail/1/99'
    var data = {
      "consultationId": consultationId,
      "lawyerId": lawyerId,
      "pageNum": 1,
      "pageSize": 99
    }
    var success = data => {
      x.push(data.data.total)
      this.setData({
        freeText: x,
        i: this.data.i + 1
      })
      if (this.data.i == this.data.listLength) {
        this.data.freeText.map(item => {
          all = all + item
        })
        this.setData({
          allTotal: all
        })
      }
      this.lawTime()
    }
    var fail = e => {
      console.log("文字咨询回复详情", e)
    }
    wxrequest.requestGetpar(url, data, '', success, fail)
  },
  // 回复
  gotoReply: function(e) {
    wx.navigateTo({
      url: '../consultation-reply/index?lawtList=' + this.data.lawtList[e.currentTarget.dataset.freeindex] + '&time=' + this.data.time,
    })
    wx.setStorageSync("freeTextList", this.data.freeTextList[e.currentTarget.dataset.freeindex])
  },
  //用户发表时间
  userTime: function () {
    let list = []
    list.push(this.data.orderDetail.createDate)
    this.setData({
      timet: Time(list)
    })
    console.log('TIME', Time(list))
  },
  //回复时间
  lawTime: function() {
    let list = []
    this.data.freeTextList.map(item=>{
      list.push(item.dateAdded)
    })
    this.setData({
      timelaw:Time(list),
      lawtList:Time(list)
    })
  },
  //律师主页
  toLawyerHomePage: function(e) {
    wx.navigateTo({
      url: '/pages/search/lawyer-detail/index?id=' + this.data.freeTextList[e.currentTarget.dataset.lawindex].lawyerId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: JSON.parse(options.orderDetail).id ? JSON.parse(options.orderDetail).id : JSON.parse(options.orderDetail).busiId,
      orderDetail: options.orderDetail ? JSON.parse(options.orderDetail) : options.date,
      userInfo: wx.getStorageSync("userInfo"),
      time: options.orderDetail ? JSON.parse(options.orderDetail).createDate : ''
    })
    console.log(options, this.data.id, this.data.orderDetail, this.data.userInfo, this.data.time)
    wx.setStorageSync('consultationId', JSON.parse(options.orderDetail).id)
    this.userTime()
    this.getFree()
    this.getFreetextList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getFreetextList()
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var x = []
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var x = []
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})