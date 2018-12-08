// pages/my/edit-info/index.js
var wxrequest = require('../../../utils/request.js')
var api = require('../../../utils/api.js')
var region = require('../../../region.js')
var userInfo = wx.getStorageSync("userInfo")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[{"nikeName":'北雁南飞',"gender":'女',"birth":'1976-01-01',"address":'湖南 常德'}],
    region:['湖南省','长沙市','芙蓉区'],
    date:'1980-01-01',
    regionJSON:[],
    gender: [{ "gender": "男", "id": 1 }, { "gender": "女", "id": 2 }, { "gender": "未知", "id": 0 }],
    index:'0',
    index1:'0',
    index2:'0',
    indexarea:'0',
    infoList:['您的行业','您的企业','您的职务','您的邮箱'],
    avatarUrl:'../../../image/my_icon@3x/mine_icon_02_3x.png',
    industry:[],
    institu:[],
    userInfo:'',

    editMember: '',//昵称
    editSex: '',//性别
    editbBrthday: '',//生日
    editIndustryId: '',//行业id
    editEmail: '',//邮箱
    editinstitutionId: ''//企业id

  },
  // 性别
  bindChange:function(e){
    this.setData({
      index:e.detail.value,
    })
    console.log("性别ID",this.data.gender[this.data.index].id)
  },

  // 选择行业
  changeindustry:function(e){
    this.setData({
      index1:e.detail.value
    })
    console.log("行业ID",this.data.industry[this.data.index1].industryId)
  },

  //选择企业
  changeinstitu:function(e){
    this.setData({
      index2:e.detail.value
    })
    console.log("企业ID",this.data.institu[this.data.index2].institutionTypeId)
  },
  // 选择地区
  bindRegionChange:function(e){
    this.setData({
      region: e.detail.value
    })
  },
  //自定义地区
  changearea:function(e){
    this.setData({
      indexarea:e.detail.value
    })
    console.log(e)
  },
  // 选择时间
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
    console.log(e)
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
            wx.setStorage({
              key: 'avatar',
              data: imageUrl.data.weburl,
            })
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
    this.setData({
      editMember:e.detail.value
    })
    console.log(e.detail.value)
  },
  // 行业
  // insTypeName:function(e){
  //   this.setData({
  //     editInsTypeName: e.detail.value
  //   })
  // },
  // // 企业
  // institutionTypeName:function(e){
  //   this.setData({
  //     editInstitutionName: e.detail.value
  //   })
  // },
  // 职务
  businessTypeName:function(e){
    this.setData({
      editBusinessTypeName: e.detail.value
    })
  },
  // 邮箱
  email:function(e){
    this.setData({
      editEmail:e.detail.value
    })
  },
  // 商会组织
  organizations:function(e){
    editOrganizations:e.detail.value
  },
  // 保存
  saveInfo:function(){
    var that = this
    var editUrl = api.getEditDetail()
    var editDetailData = {
      "memberId": wx.getStorageSync("memberId"),//用户id
      "iconImage": this.data.avatarUrl, //头像Url
      "memberName": this.data.editMember, //昵称
      "sex": this.data.gender[this.data.index].id,//性别id 
      "birthday1":this.data.date,//生日
      "email": this.data.editEmail, //邮箱
      "industryId": this.data.industry[this.data.index1].industryId, //行业id
      "institutionId": this.data.institu[this.data.index2].institutionTypeId, //企业id
      }
      console.log("上传参数",editDetailData)
      // wx.showLoading({
      //   title: '保存中',
      // })
    var success = function(data){
      console.log(wx.getStorageInfoSync("nikeName"))
      wx.showToast({
        title: '保存成功',
      })
      setTimeout(function(){
        wx.navigateBack({
        delta: 2
      })
      },5000)
      // wx.navigateBack({
      //   delta: 2
      // })
      // var userDetailUrl = api.getUserDetail() + wx.getStorageSync("memberId")
      // var userData = wx.getStorageSync("memberId")
      // var message = ''
      // var successDetail = function (dataDetail) {
      //   console.log("1",dataDetail)

      // }
      // var failDetail = function (eDetail) {
      //   console.log("e", eDetail)
      // }
      // wxrequest.request(userDetailUrl, userData, successDetail, failDetail)

    }
    var fail = function(e){
      console.log(e)
    }
    wxrequest.request(editUrl,editDetailData,success,fail)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      regionJSON:region,
      userInfo:userInfo
    })
    console.log(this.data.regionJSON)
    // 行业列表
    var that = this
    var industryUrl = api.getIndustryUrl()
    var industryData = {"parentId":'0'}
    var insSuccess = function(data){
      var industryList = []
      console.log("行业",data)
      data.data.map(function(item){
        industryList.push({ "industryName": item.industryName, "industryId": item.industryId})
      })
      that.setData({
        industry: industryList
      })
      // wx.setStorage({
      //   key: 'industry',
      //   data: data.data
      // })
      console.log(that.data.industry)
    }
    var insFail = function (e) {
      console.log(e)
    }
    wxrequest.request(industryUrl, industryData, insSuccess, insFail)

    // 企业列表
    var instituUrl = api.getInstitutionUrl()
    var instituData = {"parentId":"0"}
    var instituSuccess = function(data){
      console.log("企业",data)
      var instituList = []
      data.data.map(function(item){
        instituList.push({ "institutionTypeName": item.institutionTypeName, "institutionTypeId": item.institutionTypeId})
      })
      that.setData({
        institu:instituList
      })
      console.log(that.data.institu)
      // wx.setStorage({
      //   key: 'institu',
      //   data: data.data,
      // })
    }
    var instituFail = function(e){
      console.log(e)
    }
    wxrequest.request(instituUrl, instituData, instituSuccess, instituFail)

    //职务列表
    var positionUrl = api.getPositionUrl()
    var positionData = {"memberRoleId":5}
    var posiSuccess = function(data){
      console.log(data)
    }
    var posiFail = function(e){
      console.log(e)
    }
    wxrequest.request(positionUrl,positionData,posiSuccess,posiFail)
    //头像
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
    console.log("showwwwwww",this.data.userInfo)
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