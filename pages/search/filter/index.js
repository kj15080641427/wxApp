// pages/search/filter/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
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
    practiceYearId:'', //执业年限
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
    organizationId:'' //商会组织
  },

  // getList:function(){
  // },
  // 确定按钮
  getSearchLawyer:function(){
    var that = this
    var t = that.data
    var dataJSON = {
      "pageNum":'1',
      "pageSize":'10',
      "regionId":'',
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

    var that = this
    var searchLawyerUrl = api.getSearchLawyer() + "1/10"
    var searchlawyerData = dataJSON 
    console.log("上传参数", dataJSON )
    wx.showLoading({
      title: '搜索中',
    })
    var success = function (data) {
      console.log("搜索成功", data)
      wx.hideLoading()
      // that.changeParentData()
      // wx.setStorageSync("lawyerList", data.data.list)
      wx.navigateBack({
        url: '../index',
      })
      prevPage.setData({
        getPage: 10,
        lawyerList:data.data.list,
        dataJSON: dataJSON,
        topNum:0
      })
      // prevPage.gotop()
    }
    var fail = function (e) {
      wx.hideLoading()
      wx.showToast({
        title: '加载数据失败',
        icon:'neno'
      })
      console.log(e)
    }
    // console.log("筛选参数", searchlawyerData)
    wxrequest.request(searchLawyerUrl, searchlawyerData, success, fail)

    //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      getPage: 10
    })
  },
  // 重置按钮
  reset:function(){
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      lawyerList: {"practiceYearId":''}
    })
  },
  // changeParentData: function () {

  //   var pages = getCurrentPages();//当前页面栈

  //   if (pages.length > 1) {

  //     var beforePage = pages[pages.length - 2];//获取上一个页面实例对象

  //     beforePage.changeData();//触发父页面中的方法

  //   }

  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      var searchUrl = api.getSearch()
      var searchSuccess = function (data) {
        that.setData({
          search: data.data
        })
        console.log("成功", data.data)
      }
      var searchFail = function (e) {
        console.log("失败", e)
      }
      wxrequest.requestGet(searchUrl, ' ', searchSuccess, searchFail)
      // console.log("getInstitutype")
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

  },
  //熟悉行业
  changeIndustry: function (e) {
    var pickeridx = e.detail.value
    this.setData({
      indexPicker2: e.detail.value,
      industryId: this.data.search[2].items[e.detail.value].id
    })
    console.log('选中信息', this.data.industryId)
  },
  //基本技能
  changeSkill: function (e) {
    this.setData({
      indexPicker3: e.detail.value,
      skillId: this.data.search[3].items[e.detail.value].id
    })
    console.log('选中信息', this.data.skillId)
  },
  //扩展技能
  changeExpand: function (e) {
    this.setData({
      indexPicker4: e.detail.value,
      expandId: this.data.search[4].items[e.detail.value].id
    })
    console.log('选中信息', this.data.expandId)
  },
  // 第二语言
  changeLanguage: function (e) {
    this.setData({
      indexPicker5: e.detail.value,
      languageId: this.data.search[5].items[e.detail.value].id
    })
    console.log('选中信息', this.data.languageId)
  },
  // 常去法院
  changeCourt: function (e) {
    this.setData({
      indexPicker6: e.detail.value,
      courtId: this.data.search[6].items[e.detail.value] ? this.data.search[6].items[e.detail.value].id : ""
    })
    console.log('选中信息', this.data.courtId)
  },
  //常去检察院
  changeProcuratorate: function (e) {
    this.setData({
      indexPicker7: e.detail.value,
      procuratorateId: this.data.search[7].items[e.detail.value] ? this.data.search[7].items[e.detail.value].id : ""
    })
    console.log('选中信息', this.data.procuratorateId)
  },
  //律师职位
  changePosition: function (e) {
    this.setData({
      indexPicker8: e.detail.value,
      positionId: this.data.search[8].items[e.detail.value].id
    })
    console.log('选中信息', this.data.positionId)
  },
  //所获荣誉
  changeHonor: function (e) {
    this.setData({
      indexPicker9: e.detail.value,
      honorId: this.data.search[9].items[e.detail.value].id
    })
    console.log('选中信息', this.data.honorId)
  },
  //社会职务
  changeSocial: function (e) {
    this.setData({
      indexPicker10: e.detail.value,
      socialId: this.data.search[10].items[e.detail.value].id
    })
    console.log('选中信息', this.data.socialId)
  },
  //增信担保
  changeGuarantee: function (e) {
    this.setData({
      indexPicker11: e.detail.value,
      guaranteeId: this.data.search[11].items[e.detail.value].id
    })
    console.log('选中信息', this.data.guaranteeId)
  },
  //绿豆圈
  changeMung: function (e) {
    this.setData({
      indexPicker12: e.detail.value,
      mungId: this.data.search[12].items[e.detail.value].id
    })
    console.log('选中信息', this.data.mungId)
  },
  //商会组织
  changeOrganization: function (e) {
    this.setData({
      indexPicker13: e.detail.value,
      organizationId: this.data.search[13].items[e.detail.value].id
    })
    console.log('选中信息', this.data.organizationId)
  },
  //选中效果
  changeColor1: function () {
    this.setData({
      select: 1,
      practiceYearId: this.data.search[0].items[0].id
    })
  },
  changeColor2: function () {
    this.setData({
      select: 2,
      practiceYearId: this.data.search[0].items[1].id
    })
  },
  changeColor3: function () {
    this.setData({
      select: 3,
      practiceYearId: this.data.search[0].items[2].id
    })
  },
  changeColor4: function () {
    this.setData({
      select: 4,
      practiceYearId: this.data.search[0].items[3].id
    })
  },
  changeColor5: function () {
    this.setData({
      select: 5,
      practiceYearId: this.data.search[0].items[4].id
    })
  },
  changeColor6: function () {
    this.setData({
      select: 6,
      practiceYearId: this.data.search[0].items[5].id
    })
  },
  gender0: function () {
    this.setData({
      gender: '0',
      sex: this.data.search[1].items[0].id
    })
    console.log(this.data.sex)
  },
  gender1: function () {
    this.setData({
      gender: '1',
      sex: this.data.search[1].items[1].id
    })
    console.log(this.data.sex)
  },
  gender2: function () {
    this.setData({
      gender: '2',
      sex: this.data.search[1].items[2].id
    })
    console.log(this.data.sex)
  },
  getType: function (e) {
    this.setData({
      listIndex: e.currentTarget.dataset.getindex
    })
    // var typeIndex = e.currentTarget.dataset.getindex;
    console.log("listIndex", this.data.listIndex)
  },
})
