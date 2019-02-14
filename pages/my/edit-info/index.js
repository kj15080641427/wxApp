var app = getApp();
var reg = require('../../../region.js')
var wxrequest = require('../../../utils/request.js')
var api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: wx.getStorageSync('userInfo').sex ? wx.getStorageSync('userInfo').sex-1: 'qqq', //性别index
    index1: wx.getStorageSync("index1") ? wx.getStorageSync("index1") : '', //行业index
    industry: [], //行业列表
    enidUserInfo: '', //用户信息
    // selectIndestry: false,
    // selectInstitu: false,
    selectAddress: true,
    selecttime: true,
    systime: false,
    hasaddress: false,
    industryName: '', //行业
    orgN: '',
    avatarUrl: '',
    // editMember:'', //昵称
    gender: [{
      "gender": "男",
      "id": 1
    }, {
      "gender": "女",
      "id": 2
    }], //性别
    index:0,
    provinces: [],
    citys: [],
    areas: [],
    value: [0, 0, 0],
    name: '',
    regionId: '',
    indexadd: '',

    multiIndex: [0, 0],
    multiArray: '',

    changeInfo: {
      memberId: wx.getStorageSync('memberId'),
    }
  },
  //
  hideRegion: function() {
    this.setData({
      hasaddress: false,
    })
  },
  //选择地区
  bindMultiPickerColumnChange: function(e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        data.multiArray[1] = this.data.multiArray[e.detail.column][e.detail.value].child;
        break;
    }
    this.setData({
      multiArray: this.data.multiArray,
      // multiIndex: this.data.multiIndex,
    })

  },
  bindMultiPickerChange: function(e) {
    this.setData({
      ['changeInfo.regionId']: this.data.multiArray[1][e.detail.value[1]].regionId ? this.data.multiArray[1][e.detail.value[1]].regionId : this.data.multiArray[0][e.detail.value[0]].regionId
    })

    this.setData({
      multiIndex: e.detail.value,
      hasaddress: true
    })
  },

  //获取行业列表
  getIndustry: function() {
    var that = this
    var url = api.getIndustryUrl()
    var data = {
      "parentId": '0'
    }
    var success = function(data) {
      that.setData({
        industry: data.data
      })
      data.data.map(function(item) {
        if (item.industryId == that.data.userInfo.industryId) {
          that.setData({
            industryName: item.industryName
          })
        }
      })
    }
    var fail = function(e) {
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
  },
  //获取商会组织
  getOrganization: function() {
    var that = this
    var url = api.getOrganization()
    var success = (data) => {
      this.setData({
        org: data.data
      })
      that.data.org.map(function(item) {
        if (item.organizationId[0]) {
          if (item.organizationId == that.data.userInfo.organizations[0].organizationId) {
            that.setData({
              orgN: item.organizationName
            })
          }
        }
      })
    }
    var fail = (e) => {
      console.log(e)
    }
    wxrequest.requestGet(url, '', success, fail)
  },
  // 保存
  saveInfo: function() {
    var that = this
    var editUrl = api.getEditDetail()
    var editDetailData = that.data.changeInfo
    var success = function(data) {
      wx.setStorageSync('index1', that.data.index1)
      that.setData({
        index1: wx.getStorageSync('index1'),
      })
      wx.showToast({
        title: '保存成功',
      })
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1]; //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面
      prevPage.getUserDetail() //调用上一个页面方法

      setTimeout(function() {
        wx.navigateBack({
          delta: 2
        })
      }, 1000)
    }
    var fail = function(e) {
      wx.showToast({
        title: '保存失败' + e.message,
        icon: 'none'
      })
      console.log(e)
    }
    wxrequest.request(editUrl, editDetailData, success, fail)
  },
  //性别picker
  bindChangegender: function(e) {
    this.setData({
      ['changeInfo.sex']: this.data.gender[e.detail.value].id,
      index: e.detail.value,
    })
  },
  //企业
  institutionTypeName: function(e) {
    this.setData({
      ['changeInfo.institutionName']: e.detail.value
    })
  },
  // 选择行业
  changeindustry: function(e) {
    this.setData({
      ['changeInfo.industryId']: this.data.industry[e.detail.value].industryId,
      index1: e.detail.value
    })
  },
  //商会
  changeorg: function(e) {
    this.setData({
      ['changeInfo.oids']: this.data.org[e.detail.value].organizationId
    })
  },
  // 选择时间
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      ['changeInfo.birthday']: e.detail.value + ' 00:01:01',
      selecttime: false,
      systime: true
    })
  },
  showLoad: function() {
    wx.showLoading({
      title: '上传中',
    })
  },
  // 更换头像
  replaceAvatar: function() {
    var that = this
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.showLoad(),
          wx.uploadFile({
            url: api.getImageUrl(),
            filePath: res.tempFilePaths[0],
            name: 'file',
            formData: {
              "type": '2'
            },
            success(data) {
              wx.hideLoading()
              var imageUrl = JSON.parse(data.data)
              that.setData({
                avatarUrl: imageUrl.data.weburl,
                ['changeInfo.iconImage']: imageUrl.data.weburl
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
  member: function(e) {
    this.setData({
      ['changeInfo.memberName']: e.detail.value
    })
  },

  // 职务
  businessTypeName: function(e) {
    this.setData({
      ['changeInfo.memberPositionName']: e.detail.value
    })
  },
  // 邮箱
  email: function(e) {
    this.setData({
      ['changeInfo.email']: e.detail.value
    })
  },
  // 商会组织
  // organizations: function (e) {
  //   editOrganizations: e.detail.value
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    /*选择地区*/
    reg.citysData.map((item, index) => {
      if (item.name == wx.getStorageSync("province")) {
        this.setData({
          provi: index
        })
      }
    })
    if (!this.data.provi) {
      this.setData({
        provi: 0
      })
    }
    // console.log('省', this.data.provi)
    reg.citysData[this.data.provi].child.map((item, index) => {
      if (item.name == wx.getStorageSync("city")) {
        this.setData({
          cit: index
        })
      }
    })
    if (!this.data.cit) {
      this.setData({
        cit: 0
      })
    }
    // console.log([reg.citysData][0][0], '市', this.data.cit)
    // this.setData({
    //   multiIndex:[this.data.provi,this.data.cit]
    // })
    this.setData({
      multiIndex: [this.data.provi, this.data.cit],
      multiArray: [
        [reg.citysData][0],
        [reg.citysData][0][this.data.provi].child
      ],
    })
    //性别index
    this.setData({
      // multiArray: [
      //   [reg.citysData][0],
      //   [reg.citysData][0][0].child
      // ],
      userInfo: wx.getStorageSync("userInfo"),
      index: wx.getStorageSync('userInfo').sex ? wx.getStorageSync('userInfo').sex - 1 : '0',
      avatarUrl: wx.getStorageSync('userInfo').iconImage ? wx.getStorageSync('userInfo').iconImage :'',
      ['changeInfo.memberId']:wx.getStorageSync('memberId'),
      ['changeInfo.sex']: this.data.gender[this.data.index].id
    })
    // 行业列表
    this.getIndustry()
    this.getOrganization()
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

    var that = this
    var editInfo = wx.getStorageSync("userInfo")
    this.setData({
      birthday: this.data.userInfo.birthday.split(" ")[0]
    })
    this.setData({
      index1: wx.getStorageSync('index1'),
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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