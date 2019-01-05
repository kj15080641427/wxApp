// pages/search/filter/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
var dataJSON
var picIndexList = {}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    select: '',
    gender: '',
    search: '', //律师
    listIndex: '',
    indexPicker: '',
    click: false,
    practiceYearId: 1, //执业年限
    // sex: '', //性别
    industryId: '', //行业
    skillId: '', //基本技能
    expandId: '', // 扩展技能
    languageId: '', //第二语言
    courtId: '', //法院
    procuratorateId: '', //检察院
    positionId: '', //职位
    honorId: '', //荣誉
    socialId: '', // 社会职务
    guaranteeId: '', //增信担保
    mungId: '', //绿豆圈
    organizationId: '', //商会组织
  },

  // 确定按钮
  getSearchLawyer: function() {
    var that = this
    var t = that.data
    wx.setStorageSync("picIndexList", picIndexList)
    var gs = wx.getStorageSync("picIndexList")
    dataJSON = {
      "pageNum": '1',
      "pageSize": '10',
      "businessTypeId": t.noFilter.businessTypeId || '',
      "regionId": t.noFilter.regionId || '',
      "lawyerName": t.noFilter.lawyerName || '',
      "sort": t.noFilter.sort || '',
      "practiceYearId": t.practiceYearId ? t.practiceYearId : gs.practiceYearId ? gs.practiceYearId : '',
      // "sex": t.sex ? t.sex : gs.sex ? gs.sex : '',
      "industryId": t.industryId ? t.industryId : gs.insIndex ? t.search[2].items[gs.insIndex].id : '',
      "baseSkillId": t.skillId ? t.skillId : gs.baseSkillIndex ? t.search[3].items[gs.baseSkillIndex].id : '',
      "otherSkillId": t.expandId ? t.expandId : gs.ohterSkillIndex ? t.search[4].items[gs.ohterSkillIndex].id : '',
      "langSkillId": t.languageId ? t.languageId : gs.langSkillIndex ? t.search[5].items[gs.langSkillIndex].id : '',
      "courtId": t.courtId ? t.courtId : gs.courtIndex && t.search[6].items[0] ? t.search[6].items[gs.courtIndex].id : '',
      "procuratorateId": t.procuratorateId ? t.procuratorateId : gs.procuratorateIndex && t.search[7].items[0] ? t.search[7].items[gs.procuratorateIndex].id : '',
      "positionId": t.positionId ? t.positionId : gs.positionIndex ? t.search[8].items[gs.positionIndex].id : '',
      "honorId": t.honorId ? t.honorId : gs.honorIndex ? t.search[9].items[gs.honorIndex].id : '',
      "socialId": t.socialId ? t.socialId : gs.socialIndex ? t.search[10].items[gs.socialIndex].id : '',
      "depositAmountId": t.guaranteeId ? t.guaranteeId : gs.depositIndex ? t.search[11].items[gs.depositIndex].id : '',
      "lexMungId": t.mungId ? t.mungId : gs.lexMungIndex ? t.search[12].items[gs.lexMungIndex].id : '',
      "orgId": t.organizationId ? t.organizationId : gs.organziationIndex ? t.search[13].items[gs.organziationIndex].id : ''
    }
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      getPage: 10,
      noFilter: {
        ...dataJSON
      }
    })
    prevPage.pc ? prevPage.pc() : prevPage.searchLawyer()
    wx.navigateBack({
      url: '../index',
    })
  },
  // 重置按钮
  reset: function() {
    var that = this
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    dataJSON = {
      "pageNum": '1',
      "pageSize": '10'
    }
    prevPage.setData({
      noFilter: {
        "pageNum": '1',
        "pageSize": '10',
        "lawyerName": that.data.name
      },
      ishidden: true
    })
    picIndexList = {}
    wx.removeStorageSync("picIndexList")
    this.onShow()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getCourt()
    var that = this
    that.setData({
      noFilter: JSON.parse(options.noFilter),
      name: JSON.parse(options.noFilter).lawyerName ? JSON.parse(options.noFilter).lawyerName : ''
    })
    var searchUrl = api.getSearch()
    var searchSuccess = function(data) {
      that.setData({
        search: data.data
      })
    }
    var searchFail = function(e) {
      wx.showToast({
        title: '获取筛选列表失败',
        icon: 'none'
      })
      console.log("失败", e)
    }
    wxrequest.requestGet(searchUrl, ' ', searchSuccess, searchFail)
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
    var gs = wx.getStorageSync("picIndexList")
    that.setData({
      practiceYearId: gs.practiceYearId ? gs.practiceYearId : 1, //执业年限
      // sex: gs.sex ? gs.sex : '',
      insIndex: gs.insIndex ? gs.insIndex : '', //行业
      baseSkillIndex: gs.baseSkillIndex ? gs.baseSkillIndex : '', //基本技能
      ohterSkillIndex: gs.ohterSkillIndex ? gs.ohterSkillIndex : '', //扩展技能
      langSkillIndex: gs.langSkillIndex ? gs.langSkillIndex : '', //第二语言
      courtIndex: gs.courtIndex ? gs.courtIndex : '', //常去法院
      procuratorateIndex: gs.procuratorateIndex ? gs.procuratorateIndex : '', //常去检察院
      positionIndex: gs.positionIndex ? gs.positionIndex : '', //律师职位
      honorIndex: gs.honorIndex ? gs.honorIndex : '', //所获荣誉
      socialIndex: gs.socialIndex ? gs.socialIndex : '', //社会职务
      depositIndex: gs.depositIndex ? gs.depositIndex : '', //增信担保
      lexMungIndex: gs.lexMungIndex ? gs.lexMungIndex : '', //绿豆圈
      organziationIndex: gs.organziationIndex ? gs.organziationIndex : '', //商会组织
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
  //熟悉行业
  changeIndustry: function(e) {
    var pickeridx = e.detail.value
    this.setData({
      insIndex: +e.detail.value,
      industryId: this.data.search[1].items[e.detail.value].id
    })
    //储存所选picker的Index值
    picIndexList.insIndex = e.detail.value
  },
  //基本技能
  changeSkill: function(e) {
    this.setData({
      baseSkillIndex: e.detail.value,
      skillId: this.data.search[2].items[e.detail.value].id
    })
    picIndexList.baseSkillIndex = e.detail.value

  },
  //扩展技能
  changeExpand: function(e) {
    this.setData({
      ohterSkillIndex: e.detail.value,
      expandId: this.data.search[3].items[e.detail.value].id
    })
    picIndexList.ohterSkillIndex = e.detail.value
  },
  // 第二语言
  changeLanguage: function(e) {
    this.setData({
      langSkillIndex: e.detail.value,
      languageId: this.data.search[4].items[e.detail.value].id
    })
    picIndexList.langSkillIndex = e.detail.value
  },
  // 常去法院
  changeCourt: function(e) {
    this.setData({
      courtIndex: e.detail.value,
      courtId: this.data.search[5].items[e.detail.value] ? this.data.search[5].items[e.detail.value].id : ""
    })
    picIndexList.courtIndex = e.detail.value
  },
  //常去检察院
  changeProcuratorate: function(e) {
    this.setData({
      procuratorateIndex: e.detail.value,
      procuratorateId: this.data.search[6].items[e.detail.value] ? this.data.search[6].items[e.detail.value].id : ""
    })
    picIndexList.procuratorateIndex = e.detail.value
  },
  //律师职位
  changePosition: function(e) {
    this.setData({
      positionIndex: e.detail.value,
      positionId: this.data.search[7].items[e.detail.value].id
    })
    picIndexList.positionIndex = e.detail.value
  },
  //所获荣誉
  changeHonor: function(e) {
    this.setData({
      honorIndex: e.detail.value,
      honorId: this.data.search[8].items[e.detail.value].id
    })
    picIndexList.honorIndex = e.detail.value
  },
  //社会职务
  changeSocial: function(e) {
    this.setData({
      socialIndex: e.detail.value,
      socialId: this.data.search[9].items[e.detail.value].id
    })
    picIndexList.socialIndex = e.detail.value
  },
  //增信担保
  changeGuarantee: function(e) {
    this.setData({
      depositIndex: e.detail.value,
      guaranteeId: this.data.search[10].items[e.detail.value].id
    })
    picIndexList.depositIndex = e.detail.value
  },
  //绿豆圈
  changeMung: function(e) {
    this.setData({
      lexMungIndex: e.detail.value,
      mungId: this.data.search[11].items[e.detail.value].id
    })
    picIndexList.lexMungIndex = e.detail.value
  },
  //商会组织
  changeOrganization: function(e) {
    this.setData({
      organziationIndex: e.detail.value,
      organizationId: this.data.search[12].items[e.detail.value].id
    })
    picIndexList.organziationIndex = e.detail.value
  },
  //选择执业年限
  changeColor: function(e) {
    this.setData({
      practiceYearId: this.data.search[0].items[e.currentTarget.dataset.yearindex].id
    })
    picIndexList.practiceYearId = this.data.practiceYearId
  },
  // //选择性别
  // gender: function (e) {
  //   this.setData({
  //     sex: this.data.search[1].items[e.currentTarget.dataset.genderindex].id
  //   })
  //   picIndexList.sex = this.data.sex
  // },
  getType: function(e) {
    this.setData({
      listIndex: e.currentTarget.dataset.getindex
    })
  },
})