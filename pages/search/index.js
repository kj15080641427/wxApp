var api = require('../../utils/api.js')
var wxrequest = require('../../utils/request.js')
var formatTime = require('../../utils/util.js')
var throttle = require('../../utils/throttle.js')
var region = require('../../region.js')
var noFilter = {
  "pageNum": '1',
  "pageSize": '10',
  "regionId": '',
  // "sort":'0',
  "lawyerName": '',
  "practiceYearId": '',
  "sex": '',
  "industryId": '',
  "baseSkillId": '',
  "otherSkillId": '',
  "langSkillId": '',
  "courtId": '',
  "procuratorateId": '',
  "positionId": '',
  "honorId": '',
  "socialId": '',
  "depositAmountId": '',
  "lexMungId": '',
  "orgId": '',
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    lawyerList: '',
    year: '',
    getPage: 10,
    dataJSON: '',
    address: '',
    region: '',
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
    searchName:'',// 名字搜索
    expert:'擅长领域',//选择擅长领域
    selectedCity:'选择地区',//选择地区
    // isExpert:true,
    // isselectedCity:true,
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
    console.log(this.data.showRegion)
    // noFilter.regionId = this.data.region[this.data.regionindex].child[this.data.cityindex].regionId || ''
    // dataJSON.regionId = 1
  },
  // 关键字搜索
  searchInput: function (e) {
    this.setData({
      searchName: e.detail.value
    })
    // noFilter.lawyerName = e.detail.value
    console.log(e.detail.value)
  },
  //排序Index
  getSortIndex:function(e){
    this.setData({
      sortIndex:e.currentTarget.dataset.sortindex,
      showSort:!this.data.showSort,
      ['dataJSON.sort']: e.currentTarget.dataset.sortindex
    })
    this.pc()
  },
  //省index
  getRegionIndex(e) {
    console.log("省index", e.currentTarget.dataset.regionindex)
    this.setData({
      regionindex: e.currentTarget.dataset.regionindex,
      // isSelect: !this.data.isSelect,

    })
  },
  //市index
  getCityIndex: function (e) {
    var dataRegion = "dataJSON.regionId"
    this.setData({
      // isselectedCity: this.data.region[this.data.regionindex].child[e.currentTarget.dataset.cityindex]==this.data.index ? !this.data.isselectedCity : this.data.isselectedCity ,
      [dataRegion]: this.data.region[this.data.regionindex].child[e.currentTarget.dataset.cityindex].regionId,
      cityindex: e.currentTarget.dataset.cityindex,//是cityindex不等于index
      clickOhter: true,
      showRegion: false,
      showSort:false,
      showExpert:false,
      selectedCity: this.data.region[this.data.regionindex].child[e.currentTarget.dataset.cityindex].name ,
      selectedCityColor: true,
      clickOhter: false,
    })
    // noFilter.regionId = this.data.region[this.data.regionindex].child[this.data.cityindex].regionId || ''
    this.pc()
    console.log("地区", this.data.dataJSON)
  },
  //选择擅长领域1级
  getExpertIndex: function (e) {
    this.setData({
      expertIndex: e.currentTarget.dataset.expertindex,
    })
    console.log("1ji", this.data.business[this.data.expertIndex].children)
  },
  //选择擅长领域2级列表
  getexpertChildIndex: function (e) {
    this.setData({
      // isExpert: !this.data.isExpert,
      expertChildIndex: e.currentTarget.dataset.expertchildindex,
      showExpert: false,
      clickOhterEx: true,
      ['dataJSON.businessTypeId']: this.data.business[this.data.expertIndex].children[e.currentTarget.dataset.expertchildindex].businessTypeId ,
      expert:  this.data.business[this.data.expertIndex].children[e.currentTarget.dataset.expertchildindex].businessTypeName ,
      expertColor: true ,
      clickOhterEx: false
    })
    this.pc()
    console.log("2ji", e)
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
      console.log("对应index擅长领域列表", that.data.business)
    }
    var fail = function (e) {
      console.log("擅长领域", e)
    }
    wxrequest.requestGet(url, '', success, fail)
  },
  // 获取律师列表index并根据index搜索律师信息
  getIndex: function (e) {
    var that = this
    var listIndex = e.currentTarget.dataset.index //index
    var year = that.data.year //执业年限
    var lawyerList = that.data.lawyerList
    // // 律师名片
    // var lawyerInfoUrl = api.getlawyerInfo() + this.data.lawyerList[e.currentTarget.dataset.index].memberId
    // var lawyerData = this.data.lawyerList[e.currentTarget.dataset.index].memberId
    // var success = function (data) {
      // console.log("律师名片", data)
      wx.hideLoading()
      wx.navigateTo({
        url: 'lawyer-detail/index?listIndex=' + listIndex + '&year=' + year[listIndex] + '&lawyerList=' + JSON.stringify(lawyerList),
      })
    // }
    // var fail = function (e) {
    //   wx.hideLoading()
    //   // wx.navigateTo({
    //   //   url: 'lawyer-detail/index',
    //   // })
    //   // wx.showToast({
    //   //   title: '获取律师信息失败',
    //   //   icon:'none'
    //   // })
    //   console.log(e)
    // }
    // wxrequest.requestGetpar(lawyerInfoUrl, lawyerData, '', success, fail)
  },
  // 筛选
  gotoFilter: function () {
    wx.navigateTo({
      url: '../search/filter/index',
    })
  },
  confirm(e) {
    var that = this
    that.setData({
      lawyerList: ''
    })
    var url = api.getSearchLawyer() + "1/" + that.data.getPage
    var datan = { "lawyerName": this.data.searchName}
    console.log("上传参数")
    var success = function (data) {
      // wx.pageScrollTo({
      //   scrollTop: 200,
      //   // duration: 300
      // })
      wx.hideLoading()
      console.log("筛选参数", datan)
      console.log("搜索成功", data)
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
    // console.log("筛选参数", searchlawyerData)
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
    var datan = this.data.dataJSON ? this.data.dataJSON : noFilter
    console.log("上传参数")
    var success = function (data) {
      // wx.pageScrollTo({
      //   scrollTop: 200,
      //   // duration: 300
      // })
      wx.hideLoading()
      console.log("筛选参数", datan)
      console.log("搜索成功", data)
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
    // console.log("筛选参数", searchlawyerData)
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
  // changeData: function () {
  //   //需要刷新的区域的代码
  //   this.setData({
  //     lawyerList: wx.getStorageSync("lawyerList")
  //   })

  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var a = region.citysData.unshift({ "regionId": '', name: "全国", child: [{"regionId":'',name:"全国"}]})
    this.setData({
      region: region.citysData
    })
    console.log("region", this.data.region)
    this.confirm()
    this.getExpert()
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

    this.getAge()
    // console.log("筛选参数", this.data.dataJSON ? this.data.dataJSON : '无')
    // console.log("region", that.data.region)
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
    console.log(that.data.getPage)
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      getPage: that.data.getPage + 10
    })
    var page = that.data.getPage
    that.pc(page)
  },


  /**
   * 用户点击右上角分享
  **/
  onShareAppMessage: function () {

  }
})