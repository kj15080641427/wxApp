var api = require('../../utils/api.js')
var wxrequest = require('../../utils/request.js')
var formatTime = require('../../utils/util.js')
var throttle = require('../../utils/throttle.js')
var region = require('../../region.js')
// <<<<<<< HEAD
// var noFilter = {
//   "pageNum": '1',
//   "pageSize": '10',
  // "regionId": '',
// =======

// var noFilter = {
//   "pageNum": '1',
//   "pageSize": '10',
//   "regionId": '',
// >>>>>>> f968bbecbbec771d42961a12b89ebd46f0c61f9b
  // "sort":'0',
  // "lawyerName": '',
  // "practiceYearId": '',
  // "sex": '',
  // "industryId": '',
  // "baseSkillId": '',
  // "otherSkillId": '',
  // "langSkillId": '',
  // "courtId": '',
  // "procuratorateId": '',
  // "positionId": '',
  // "honorId": '',
  // "socialId": '',
  // "depositAmountId": '',
  // "lexMungId": '',
  // "orgId": '',
// }

Page({
  /**
   * 页面的初始数据
   */
  data: {
    lawyerList: '', //律师信息
    year: '', //执业年限
    getPage: 10, //页数
    // dataJSON: '', //
    address: '', //地址
    region: '', //地区
    regionindex: 0,//省index
    cityindex: 0,//市index
    clickOhter: 0,
    clickOhterEx: 0,
    showRegion: false,//显示地区
    showExpert: false,//显示擅长
    expertIndex: 0,//擅长领域分类1级index
    expertChildIndex: 0,//擅长分类2级index
    sortIndex:0,//排序index
    hide: true,
    sort:["综合排序","最新入驻","活跃度最高"],
    showSort:false,
    // searchName:'',// 名字搜索
    expert:'擅长领域',//选择擅长领域
    selectedCity:'选择地区',//选择地区
    filterColor:false,
    noFilter: {"pageNum": '1',"pageSize": '10',}
  },
  //排序
  sort:function(){
    this.setData({
      showSort:!this.data.showSort,
      showRegion:false,
      showExpert:false,
    })
  },
  //选择擅长领域
  selectExpert: function () {
    this.setData({
      showExpert: !this.data.showExpert,
      showRegion: false,
      showSort:false,
    })

  },
  // 选择地区
  selectRegion: function () {
    this.setData({
      showRegion: !this.data.showRegion,
      showExpert: false,
      showSort:false,
    })
  },
  // 关键字搜索
  searchInput: function (e) {
    this.setData({
      ['noFilter.lawyerName']: e.detail.value,
      getPage: 10
    })
  },
  //排序Index
  getSortIndex:function(e){
    this.setData({
      sortIndex:e.currentTarget.dataset.sortindex,
      showSort:!this.data.showSort,
      ['noFilter.sort']: e.currentTarget.dataset.sortindex
    })
    this.pc()
  },
  //省index
  getRegionIndex(e) {
    this.setData({
      regionindex: e.currentTarget.dataset.regionindex,
    })
  },
  //市index
  getCityIndex: function (e) {
    this.setData({
      ['noFilter.regionId']: this.data.region[this.data.regionindex].child[e.currentTarget.dataset.cityindex].regionId,
      cityindex: e.currentTarget.dataset.cityindex,
      clickOhter: true,
      showRegion: false,
      // showSort:false,
      // showExpert:false,
      selectedCity: this.data.region[this.data.regionindex].child[e.currentTarget.dataset.cityindex].name ,
      selectedCityColor: true,
      clickOhter: false,
      getPage: 10
    })
    this.pc()
  },
  //选择擅长领域1级
  getExpertIndex: function (e) {
    this.setData({
      expertIndex: e.currentTarget.dataset.expertindex,
    })
  },
  //选择擅长领域2级列表
  getexpertChildIndex: function (e) {
    this.setData({
      expertChildIndex: e.currentTarget.dataset.expertchildindex,
      showExpert: false,
      clickOhterEx: true,
      ['noFilter.businessTypeId']: this.data.business[this.data.expertIndex].children[e.currentTarget.dataset.expertchildindex].businessTypeId ,
      expert:  this.data.business[this.data.expertIndex].children[e.currentTarget.dataset.expertchildindex].businessTypeName ,
      expertColor: true ,
      clickOhterEx: false,
      getPage: 10
    })
    this.pc()
  },
  //获取擅长领域列表
  getExpert: function () {
    var that = this
    var url = api.getExpert()
    var success = function (data) {
      data.data.unshift({ businessTypeId: '', businessTypeName: "不限", children: [{ businessTypeId: '', businessTypeName:"不限"}]})
      that.setData({
        business: data.data
      })
    }
    var fail = function (e) {
      wx.showToast({
        title: '获取擅长领域失败',
        icon:'none'
      })
    }
    wxrequest.requestGet(url, '', success, fail)
  },
  // 获取律师列表index并根据index搜索律师信息
  getIndex: function (e) {
    var that = this
    var listIndex = e.currentTarget.dataset.index //index
    var year = that.data.year //执业年限
    var lawyerList = that.data.lawyerList
      wx.navigateTo({
        url: 'lawyer-detail/index?listIndex=' + listIndex + '&year=' + year[listIndex] + '&lawyerList=' + JSON.stringify(lawyerList),
      })
  },
  // 筛选
  gotoFilter: function () {
    wx.navigateTo({
      url: '../search/filter/index?noFilter=' + JSON.stringify(this.data.noFilter),
    })
  },
  confirm(e) {
    var that = this
    var url = api.getSearchLawyer() + "1/" + that.data.getPage
    var datan = that.data.noFilter
    var success = function (data) {
      wx.hideLoading()
      that.setData({
        lawyerList: data.data.list
      })
      that.getAge()
    }
    var fail = function (e) {
      wx.hideLoading()
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
      console.log(e)
    }
    wxrequest.request(url, datan, success, fail)
    wx.showLoading({
      title: '正在加载',
    })
  },
  pc: function () {
    var that = this
    that.setData({
      lawyerList:''
    })
    var url = api.getSearchLawyer() + "1/" + that.data.getPage 
    var datan =  that.data.noFilter
    var success = function (data) {
      wx.hideLoading()
      that.setData({
        lawyerList: data.data.list
      })
      that.getAge()
    }
    var fail = function (e) {
      wx.hideLoading()
      wx.showToast({
        title: '获取数据失败',
        icon:'none'
      })
      console.log(e)
    }
    wxrequest.request(url, datan, success, fail)
    wx.showLoading({
      title: '正在加载',
    })
  },
  //执业年份
  getAge:function(){
    var yearList = []
    var addressList = []
    var that = this
    this.data.lawyerList ? this.data.lawyerList.map(function (item) {
      yearList.push(formatTime.formatTime(new Date()).split("/")[0] - item.beginPracticeDate.split("-")[0])
    }) : ''
    that.data.lawyerList ? that.data.lawyerList.map(function (item) {
      addressList.push(item.region.split('-', 2))
    }) : ''
    this.setData({
      year: yearList,
      address: addressList,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    var a = region.citysData.unshift({ "regionId": '', name: "全国", child: [{"regionId":'',name:"全国"}]})
    this.setData({
      region: region.citysData
    })
    this.pc()
    this.getExpert()
    //  加载极光im
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
    // this.pc()
    this.getAge()
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
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      getPage: that.data.getPage + 10
    })
    var page = that.data.getPage
    that.confirm(page)
  },
  /**
   * 用户点击右上角分享
  **/
  onShareAppMessage: function () {

  }
})