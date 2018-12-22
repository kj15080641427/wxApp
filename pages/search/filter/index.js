// pages/search/filter/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
var dataJSON
var picIndexList = []
Page({
  /**
   * 页面的初始数据
   */
  data: {
    select:'',
    gender:'',
    search:'',//律师
    listIndex:'',
    indexPicker:'',
    click:false,
    practiceYearId:1, //执业年限
    sex: '', //性别
    industryId:'', //行业
    skillId:'',//基本技能
    expandId:'', // 扩展技能
    languageId:'', //第二语言
    courtId:'', //法院
    procuratorateId:'',//检察院
    positionId:'',//职位
    honorId:'',//荣誉
    socialId:'', // 社会职务
    guaranteeId:'',//增信担保
    mungId:'',//绿豆圈
    organizationId:'', //商会组织
  },

  // getList:function(){
  // },
  // 确定按钮
  getSearchLawyer:function(){
    var that = this
    var t = that.data
    dataJSON = {
      "pageNum":'1',
      "pageSize":'10',
      "regionId": t.noFilter.regionId || '',
      "businessTypeId": t.noFilter.businessTypeId || '',
      "sort": t.noFilter.sort || '',
      "practiceYearId": t.practiceYearId,
      "sex": t.sex,
      "industryId": t.industryId,
      "baseSkillId": t.skillId,
      "otherSkillId": t.expandId,
      "langSkillId": t.languageId,
      "courtId": t.courtId,
      "procuratorateId": t.procuratorateId,
      "positionId": t.positionId,
      "honorId": t.honorId,
      "socialId": t.socialId,
      "depositAmountId": t.guaranteeId,
      "lexMungId": t.mungId,
      "orgId": t.organizationId
    }
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      getPage: 10,
      noFilter:{ ...dataJSON }
    })
    prevPage.pc()
    wx.navigateBack({
      url: '../index',
    })
   //
    // wx.setStorageSync("picIndexList", picIndexList)
  },
  // 重置按钮
  reset:function(){
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    dataJSON = { "pageNum": '1', "pageSize": '10' }
    prevPage.setData({
      noFilter: { "pageNum": '1',"pageSize":'10'},
    })
    wx.removeStorageSync("picIndexList")
    this.onShow()
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      noFilter: JSON.parse(options.noFilter)
    })
    // console.log(options)
      var searchUrl = api.getSearch()
      var searchSuccess = function (data) {
        that.setData({
          search: data.data
        })
        console.log("成功", data.data)
      }
      var searchFail = function (e) {
        wx.showToast({
          title: '获取筛选列表失败',
          icon:'none'
        })
        console.log("失败", e)
      }
      wxrequest.requestGet(searchUrl, ' ', searchSuccess, searchFail)
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
    that.setData({
      indexPicker2: wx.getStorageSync("picIndexList")[0] ? wx.getStorageSync("picIndexList")[0].indexPicker2 : '',
      indexPicker3: wx.getStorageSync("picIndexList")[1] ? wx.getStorageSync("picIndexList")[1].indexPicker3 : '',
      // indexPicker4: wx.getStorageSync("picIndexList")[0] ? wx.getStorageSync("picIndexList")[0].indexPicker4 : '',
      // indexPicker5: wx.getStorageSync("picIndexList")[0] ? wx.getStorageSync("picIndexList")[0].indexPicker5 : '',
      // indexPicker6: wx.getStorageSync("picIndexList")[0] ? wx.getStorageSync("picIndexList")[0].indexPicker6 : '',
      // indexPicker7: wx.getStorageSync("picIndexList")[0] ? wx.getStorageSync("picIndexList")[0].indexPicker7 : '',
      // indexPicker8: wx.getStorageSync("picIndexList")[0] ? wx.getStorageSync("picIndexList")[0].indexPicker8 : '',
      // indexPicker9: wx.getStorageSync("picIndexList")[0] ? wx.getStorageSync("picIndexList")[0].indexPicker9 : '',
      // indexPicker10: wx.getStorageSync("picIndexList")[0] ? wx.getStorageSync("picIndexList")[0].indexPicker10 : '',
      // indexPicker11: wx.getStorageSync("picIndexList")[0] ? wx.getStorageSync("picIndexList")[0].indexPicker11 : '',
      // indexPicker12: wx.getStorageSync("picIndexList")[0] ? wx.getStorageSync("picIndexList")[0].indexPicker12 : '',
      // indexPicker13: wx.getStorageSync("picIndexList")[0] ? wx.getStorageSync("picIndexList")[0].indexPicker13 : ''
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
  //熟悉行业
  changeIndustry: function (e) {
    var pickeridx = e.detail.value
    this.setData({
      indexPicker2: e.detail.value,
      industryId: this.data.search[2].items[e.detail.value].id
    })
    picIndexList.push({"indexPicker2":this.data.indexPicker2})
    wx.setStorageSync("picIndexList", picIndexList)
    console.log('选中信息', picIndexList)
  },
  //基本技能
  changeSkill: function (e) {
    this.setData({
      indexPicker3: e.detail.value ,
      skillId: this.data.search[3].items[e.detail.value].id
    })
    picIndexList.push({ "indexPicker3": this.data.indexPicker3 })
    wx.setStorageSync("picIndexList", picIndexList)
    console.log('选中信息', this.data.skillId)
  },
  //扩展技能
  changeExpand: function (e) {
    this.setData({
      indexPicker4: e.detail.value,
      expandId: this.data.search[4].items[e.detail.value].id
    })
    picIndexList.push({ "indexPicker4": this.data.indexPicker4 })
    wx.setStorageSync("picIndexList", picIndexList)
    console.log('选中信息', this.data.expandId)
  },
  // 第二语言
  changeLanguage: function (e) {
    this.setData({
      indexPicker5: e.detail.value,
      languageId: this.data.search[5].items[e.detail.value].id
    })
    picIndexList.push({ "indexPicker5": this.data.indexPicker5 })
    wx.setStorageSync("picIndexList", picIndexList)
    console.log('选中信息', this.data.languageId)
  },
  // 常去法院
  changeCourt: function (e) {
    this.setData({
      indexPicker6: e.detail.value,
      courtId: this.data.search[6].items[e.detail.value] ? this.data.search[6].items[e.detail.value].id : ""
    })
    picIndexList.push({ "indexPicker6": this.data.indexPicker6 })
    wx.setStorageSync("picIndexList", picIndexList)
    console.log('选中信息', this.data.courtId)
  },
  //常去检察院
  changeProcuratorate: function (e) {
    this.setData({
      indexPicker7: e.detail.value,
      procuratorateId: this.data.search[7].items[e.detail.value] ? this.data.search[7].items[e.detail.value].id : ""
    })
    picIndexList.push({ "indexPicker7": this.data.indexPicker7 })
    wx.setStorageSync("picIndexList", picIndexList)
    console.log('选中信息', this.data.procuratorateId)
  },
  //律师职位
  changePosition: function (e) {
    this.setData({
      indexPicker8: e.detail.value,
      positionId: this.data.search[8].items[e.detail.value].id
    })
    picIndexList.push({ "indexPicker8": this.data.indexPicker8 })
    wx.setStorageSync("picIndexList", picIndexList)
    console.log('选中信息', this.data.positionId)
  },
  //所获荣誉
  changeHonor: function (e) {
    this.setData({
      indexPicker9: e.detail.value,
      honorId: this.data.search[9].items[e.detail.value].id
    })
    picIndexList.push({ "indexPicker9": this.data.indexPicker9 })
    wx.setStorageSync("picIndexList", picIndexList)
    console.log('选中信息', this.data.honorId)
  },
  //社会职务
  changeSocial: function (e) {
    this.setData({
      indexPicker10: e.detail.value,
      socialId: this.data.search[10].items[e.detail.value].id
    })
    picIndexList.push({ "indexPicker10": this.data.indexPicker10 })
    wx.setStorageSync("picIndexList", picIndexList)
    console.log('选中信息', this.data.socialId)
  },
  //增信担保
  changeGuarantee: function (e) {
    this.setData({
      indexPicker11: e.detail.value,
      guaranteeId: this.data.search[11].items[e.detail.value].id
    })
    picIndexList.push({ "indexPicker11": this.data.indexPicker11 })
    wx.setStorageSync("picIndexList", picIndexList)
    console.log('选中信息', this.data.guaranteeId)
  },
  //绿豆圈
  changeMung: function (e) {
    this.setData({
      indexPicker12: e.detail.value,
      mungId: this.data.search[12].items[e.detail.value].id
    })
    picIndexList.push({ "indexPicker12": this.data.indexPicker12 })
    wx.setStorageSync("picIndexList", picIndexList)
    console.log('选中信息', this.data.mungId)
  },
  //商会组织
  changeOrganization: function (e) {
    this.setData({
      indexPicker13: e.detail.value,
      organizationId: this.data.search[13].items[e.detail.value].id
    })
    picIndexList.push({ "indexPicker13": this.data.indexPicker13 })
    wx.setStorageSync("picIndexList", picIndexList)
    console.log('选中信息', this.data.organizationId)
  },
  //选择执业年限
  changeColor: function (e) {
    this.setData({
      practiceYearId: this.data.search[0].items[e.currentTarget.dataset.yearindex].id
    })
    console.log("yearrrrrrrrrrrrr", this.data.search[0].items[e.currentTarget.dataset.yearindex])
  },
  //选择性别
  gender: function (e) {
    this.setData({
      sex: this.data.search[1].items[e.currentTarget.dataset.genderindex].id
    })
  },
  getType: function (e) {
    this.setData({
      listIndex: e.currentTarget.dataset.getindex
    })
    // var typeIndex = e.currentTarget.dataset.getindex;
    console.log("listIndex", this.data.listIndex)
  },
})
