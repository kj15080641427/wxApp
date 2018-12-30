var app = getApp();
var reg = require('../../../region.js');
var wxrequest = require('../../../utils/request.js')
var api = require('../../../utils/api.js')
var userInfo = wx.getStorageSync("userInfo")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: userInfo.sex ? userInfo.sex -1  :'0', //性别index
    index1: wx.getStorageSync("index1") ? wx.getStorageSync("index1") : '' , //行业index
    industry:[], //行业列表
    enidUserInfo:'', //用户信息
    selectIndestry:false,
    selectInstitu:false,
    selectAddress:true,
    selecttime:true,
    systime:false,
    hasaddress:true,
    industryName:'', //行业
    orgN:'',
    avatarUrl: userInfo.iconImage ? userInfo.iconImage : '',
    editMember: userInfo.memberName ? userInfo.memberName :'',//昵称
    gender: [{ "gender": "男", "id": 1 }, { "gender": "女", "id": 2 }],//性别
    editIndustryId: userInfo.industryId ? userInfo.industryId : '',//行业id
    editEmail: userInfo.email ? userInfo.email : '',//邮箱
    editaddress: userInfo.areaId ? userInfo.areaId:'',
    time: userInfo.birthday ? userInfo.birthday :'选择出生日期',//出生日期
    memberPositionName: userInfo.memberPositionName ? userInfo.memberPositionName : '',
    institutionName: userInfo.institutionName ? userInfo.institutionName : '', //企业名称
    orgName: userInfo.organizationId ? userInfo.organizationId :[],
    //地区
    // citysData: cityData.citysData,
    provinces: [],
    citys: [],
    areas: [],
    value: [0, 0, 0],
    name: '',
    regionId: '',
    indexadd: '',

    multiIndex: [0,0],
    multiArray: ''
  },
  //
  hideRegion:function(){
    this.setData({
      hasaddress: false,
    })
  },
  //选择地区
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    console.log(e.detail.column)
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        data.multiArray[1] = this.data.multiArray[e.detail.column][e.detail.value].child;
        break;
    }
    this.setData({
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
    })
    
    // this.multiArray = this.data.multiArray;
    // this.multiIndex = this.data.multiIndex;
    // // 使用wepy开发，this.$apply()为脏数据检查
    // this.$apply();
  },
  bindMultiPickerChange: function (e) {
    // console.log(
    //   this.multiArray[0][e.detail.value[0]],
    //   this.multiArray[1][e.detail.value[1]]
    // ); // {value: "431000", label: "郴州市", level: 2}
    console.log(this.data.multiArray[0][e.detail.value[0]])
    console.log(this.data.multiArray[1][e.detail.value[1]])
    this.setData({
      editaddress: this.data.multiArray[1][e.detail.value[1]].regionId ? this.data.multiArray[1][e.detail.value[1]].regionId : this.data.multiArray[0][e.detail.value[0]].regionId
    })

    this.setData({
      multiIndex: e.detail.value
    })
    // this.multiIndex = e.detail.value;
    // this.$apply();
  },



  //获取用户详情
  getUserDetail:function(){
    var that = this
    // console.log(wx.getStorageSync("memberId"))
    var userDetailUrl = api.getUserDetail() + wx.getStorageSync("memberId")
    var userData = wx.getStorageSync("memberId")
    var message = ''
    var successDetail = function (dataDetail) {
      wx.hideLoading()
      that.setData({
        userInfo: dataDetail.data
      })
      wx.setStorage({
        key: 'userInfo',
        data: dataDetail.data,
      })
    }
    var failDetail = function (eDetail) {
      console.log("e", eDetail)
    }
    // 点击保存后更新用户详情
    wxrequest.request(userDetailUrl, userData, successDetail, failDetail)
  },
  //获取行业列表
  getIndustry:function(){
    // // 行业列表
    var that = this
    var url = api.getIndustryUrl()
    var data = { "parentId": '0' }
    var success = function (data) {
      // console.log("行业", data.data)
      that.setData({
        industry: data.data
      })
      data.data.map(function(item){
        if (item.industryId == userInfo.industryId){
          that.setData({
            industryName: item.industryName
          })
        }
      })
    }
    var fail = function (e) {
      console.log(e)
      // console.log("行业", data)
    }
    wxrequest.request(url, data, success, fail)
  },
  //获取商会组织
  getOrganization:function (){
    var that = this
    var url = api.getOrganization()
    var success=(data)=>{
      // console.log("商会组织",data)
      this.setData({
        org:data.data
      })
      that.data.org.map(function(item){
        if (item.organizationId[0]){
          if (item.organizationId == userInfo.organizations[0].organizationId) {
            that.setData({
              orgN: item.organizationName
            })
          }
        }
        // console.log("哈哈哈哈哈哈哈哈", item.organizationName, "=", userInfo)
      })
    }
    var fail = (e)=>{
      console.log(e)
    }
    wxrequest.requestGet(url,'',success,fail)
  },
 // 保存
  saveInfo:function(){
    var that = this
    var editUrl = api.getEditDetail()
    var editDetailData = {
      "memberId": wx.getStorageSync("memberId"),//用户id
      "iconImage": that.data.avatarUrl, //头像Url
      "memberName": that.data.editMember, //昵称
      "sex": that.data.gender[that.data.index].id,//性别id 
      "birthday": that.data.time ? that.data.time + ' 00:01:01' : '1970-01-01' + ' 00:01:01',//生日
      "email": that.data.editEmail ? that.data.editEmail : '', //邮箱
      "industryId": that.data.industry&&that.data.index1 ? that.data.industry[that.data.index1].industryId : '', //行业id
      "regionId":that.data.editaddress,
      "memberPositionName": that.data.memberPositionName ? that.data.memberPositionName : '',
      "institutionName": that.data.institutionName ? that.data.institutionName : '',
      "oids": that.data.org && that.data.index2 ? [that.data.org[that.data.index2].organizationId] : []
      }
    // console.log("上传参数", this.data.org[that.data.index2].organizationId)

    var success = function(data){
      wx.setStorageSync('index1',that.data.index1 )
      that.setData({
        index1:wx.getStorageSync('index1'),
      })
      wx.showToast({
        title: '保存成功',
      })
      // 获取用户详情
      that.getUserDetail()
      
      setTimeout(function(){
        wx.navigateBack({
        delta: 2
      })
      },1000)
    }
    var fail = function(e){
      wx.showToast({
        title: '保存失败'+e.message,
        icon: 'none'
      })
      console.log(e)
    }
    // 保存
    wxrequest.request(editUrl,editDetailData,success,fail)
    
  },
  //性别picker
  bindChangegender: function (e) {
    this.setData({
      index: e.detail.value,
    })
  },

  // 选择行业
  changeindustry: function (e) {
    this.setData({
      index1: e.detail.value,
      selectIndestry:false
    })
  },
  //商会
  changeorg:function(e){
    this.setData({
      index2:e.detail.value
    })
  },
  //选择企业
  institutionTypeName: function (e) {
    this.setData({
      institutionName:e.detail.value
    })
  },
  // 选择时间
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      time: e.detail.value,
      selecttime:false,
      systime:true
    })
    // console.log(e.detail.value)
  },
  // 更换头像
  replaceAvatar: function () {
    var that = this
    wx.chooseImage({
      count:1,
      sourceType: ['album', 'camera'],
      success: function (res) {

        // console.log(res)
        wx.uploadFile({
          url: api.getImageUrl(),
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            "type": '2'
          },
          success(data) {
            var imageUrl = JSON.parse(data.data)
            // wx.setStorage({
            //   key: 'avatar',
            //   data: imageUrl.data.weburl,
            // })
            that.setData({
              avatarUrl: imageUrl.data.weburl
            })
          },
          fail(e) {
            console.log(e)
          }
        })
      },
    })
  },
  //  昵称
  member: function (e) {
    this.setData({
      editMember: e.detail.value
    })
    // console.log('input值', !!e.detail.value)
  },

  // 职务
  businessTypeName: function (e) {
    this.setData({
      memberPositionName: e.detail.value
    })
  },
  // 邮箱
  email: function (e) {
    this.setData({
      editEmail: e.detail.value
    })
  },
  // 商会组织
  // organizations: function (e) {
  //   editOrganizations: e.detail.value
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*选择地区

    */
    var city = reg.citysData
    // this.multiArray = [[...city], [...city[0].children]];
    // this.$apply();
    this.setData({
      multiArray: [[...city], [...city[0].child]],
    })
    console.log(this.data.multiArray)


    userInfo = wx.getStorageSync("userInfo")
    // this.initData();
    var that = this
    // 行业列表
    this.getIndustry()
    this.getOrganization()
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
    var that = this
    var editInfo = wx.getStorageSync("userInfo")
    that.setData({

      avatarUrl: editInfo.iconImage ? editInfo.iconImage : '../../../image/my_icon@3x/mine_icon_02_3x.png',
      editMember: editInfo.memberName ? editInfo.memberName : '',
      time: editInfo.birthday ? editInfo.birthday.split(" ")[0] : editInfo.birthday , //出生日期
      index: editInfo.sex ? editInfo.sex -1 : '0', //性别index
      editEmail: editInfo.email ? editInfo.email : '', //邮箱
      memberPositionName: editInfo.memberPositionName ? editInfo.memberPositionName: '', //职位名称
      institutionName: editInfo.institutionName ? editInfo.institutionName : '',//企业名称
      editIndustryId: editInfo.industryId ? editInfo.industryId : '',
      orgName: editInfo.institutionId ? editInfo.institutionId : ''
    })
    // console.log("userinfottt", wx.getStorageInfoSync())
    // console.log("time", that.data.time)
    // if (!wx.getStorageSync('index2') || !wx.getStorageSync('index1') || !wx.getStorageSync('index')) {
    //   that.setData({
    //     selectInstitu:true,
    //     selectIndestry:true,
    //   })
    // }
    // this.setData({
    //   time: this.data.time
    // })
    // console.log(wx.getStorageInfoSync())


    wx.showLoading({
      title: '加载中',
    })
    // 获取用户详情
    this.getUserDetail()
  
    this.setData({
      index1: wx.getStorageSync('index1'),
    })
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

  },
})