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
    avatarUrl:'../../../image/my_icon@3x/mine_icon_02_3x.png',
    userInfo: {
      "iconImage": '',//'头像'
      "member": 'userInfo.data.menberName',//昵称
      "sex": 'userInfo.data.sex',//性别
      "birthday": 'userInfo.data.birthday',//生日
      "area": 'userInfo.data.area',//地区
      "insTypeName": 'userInfo.data.insTypeName',//行业
      "institutionTypeName": 'userInfo.data.institutionTypeName', //企业
      "businessTypeName": 'userInfo.data.businessTypeName',//职务
      "email": 'userInfo.data.email',//邮箱
      "organizations": 'userInfo.data.organizations' //组织
      }
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
  //  昵称
  member:function(e){
    console.log(e.detail.value)
  },
  saveInfo:function(){
    var editUrl = api.getEditDetail()
    var editDetailData = {}
    var success = function(data){
      console.log(data)
    }
    var fail = function(e){
      console.log(e)
    }
    wxrequest.request(editUrl,editDetailData,success,fail)
    // wx.setStorage({
    //   key: 'avatar',
    //   data: this.data.avatarUrl,
    // })
    // wx.showToast({
    //   title: '保存成功',
    //   icon:'none'
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      avatarUrl:wx.getStorageSync("avatar")
    })
    var userInfo = wx.getStorageSync("userInfo")
    this.setData({
      userInfo: {
        "iconImage": userInfo.data.iconImage,
        "member": userInfo.data.memberName,
        "sex": userInfo.data.sex,
        "birthday": userInfo.data.birthday,                                                       "area":userInfo.data.addressExtend.area,
        "insTypeName": userInfo.data.insTypeName,
        "institutionTypeName": userInfo.data.institutionTypeName, 
        "businessTypeName": userInfo.data.businessTypeName,
        "email": userInfo.data.email,
        "organizations": userInfo.data.organizations }
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