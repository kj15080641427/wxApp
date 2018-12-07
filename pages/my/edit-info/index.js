// pages/my/edit-info/index.js
var wxrequest = require('../../../utils/request.js')
var api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[{"nikeName":'北雁南飞',"gender":'女',"birth":'1976-01-01',"address":'湖南 常德'}],
    region:['湖南省','长沙市','芙蓉区'],
    date:['1980-01-01'],
    gender:['女','男'],
    index:'0',
    infoList:['您的行业','您的企业','您的职务','您的邮箱'],
    avatarUrl:'../../../image/my_icon@3x/mine_icon_02_3x.png'
  },
  // 性别
  bindChange:function(e){
    this.setData({
      index:e.detail.value
    })
  },
  // 选择地区
  bindRegionChange:function(e){
    this.setData({
      region: e.detail.value
    })
  },
  // 选择时间
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 更换头像
  replaceAvatar:function(){
    var that = this
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      success: function(res) {

        console.log(res)
        wx.uploadFile({
          url: api.getImageUrl(),
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            "type": '2'
          },
          success(data){
            var imageUrl = JSON.parse(data.data)
            imageUrl.data.weburl
            that.setData({
              avatarUrl: imageUrl.data.weburl
            })
          },
          fail(e){
            console.log(e)
          }
        })
      },
    })
  },
  saveInfo:function(){
    wx.setStorage({
      key: 'avatar',
      data: this.data.avatarUrl,
    })
    wx.showToast({
      title: '保存成功',
      icon:'none'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      avatarUrl:wx.getStorageSync("avatar")
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