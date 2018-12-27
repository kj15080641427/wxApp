// pages/search/lawyer-detail/index.js
var formatTime = require('../../../utils/util.js')
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
import wxPay from '../../../utils/wxPay.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lawyerInfo:'',
    lawyerList:'',
    index:'',
    year:'',
    education:'',
    work:'',
    address:'',
    age:'',
    lawyerCard:'',
    showMore:false,//展示更多简介
    isFollow:'',//是否已关注
    myFollow:'',//我的关注列表
    caseList:'',//案例
    isshowCard: true,
    isshowCase: false
  },
  //关注
  follow:function(){
    var that = this
    var url = api.getFollow() + that.data.lawyerCard.memberId
    var data = that.data.lawyerCard.memberId
    var success = function(data){
      that.setData({
        isFollow:true
      })
    }
    var fail = function(e){
      wx.showToast({
        title: '关注失败',
        icon:'none'
      })
      console.log(e)
    }
    if(wx.getStorageSync("token")){
    wxrequest.requestGetpar(url,data,'',success,fail)
    }else{
      wx.navigateTo({
        url: '../../../../../../userlogin/index',
      })
    }
  },
  //取消关注
  unFollow:function(){
    var that = this
    var url = api.getUnfollow() + that.data.lawyerCard.memberId
    var data = that.data.lawyerCard.memberId
    var success = (data)=>{
      that.setData({
        isFollow:false
      })
      wx.showToast({
        title: '已取消关注',
        icon:'none'
      })
    }
    var fail = (e)=>{
      wx.showToast({
        title: e.message,
        icon:'none'
      })
    }
    
    wxrequest.requestGetpar(url,data,'',success,fail)
  },
  //小数
  getnumber:function(num){
    num.map(function(item){
      item.toFixed(2)
    })
  },
  //律师主页
  getlawyer: function (e) {
    var that = this
    var listIndex = that.data.index //index
    var year = that.data.year //执业年限
    // 律师名片
    var lawyerInfoUrl = api.getlawyerInfo() + that.data.lawyerCard.memberId
    var lawyerData = that.data.lawyerCard.memberId
    var success = function (data) {
      wx.hideLoading()
      that.setData({
        lawyerInfo:data.data
      })

      var scoreList = []
      that.data.lawyerInfo.businessType.map(item => {
        scoreList.push((item.score * 100).toFixed(2))
      })
      that.setData({
        score: scoreList
      })

      console.log("律师主页",data.data)
      that.ageAddress()
    }
    var fail = function (e) {
      wx.hideLoading()
      wx.showToast({
        title: '获取律师信息失败',
        icon:'none'
      })
      console.log(e)
    }
    wxrequest.requestGetpar(lawyerInfoUrl, lawyerData, '', success, fail)
  },
  //搜索
  search:function(){
    var that = this
    // wx.showLoading({
    //   title: '',
    // })listIndex
    wx.hideLoading()
    //律师主页 (背景图/所获荣誉/描述)
    var homeUrl = api.getLawHomePage() + that.data.lawyerList
    var homeData = that.data.lawyerList
    var homeSuccess = function (data) {
      that.setData({
        lawyerCard: data.data
      })
      that.getCase()
      that.getlawyer()
      that.getAge()
      console.log("背景图/荣誉",data.data)
    }
    var homeFail = function (e) {
      console.log(e)
    }
    wxrequest.requestGetpar(homeUrl, homeData, '', homeSuccess, homeFail) //主页
  },
  //我的关注
  followList:function(){
    var that = this
    var url = api.getMyFollow()
    var data = { "pageNum": '1', "pageSize": '50' }
    var success = (data) => {
      // that.setData({
      //   myFollow: data.data.list
      // })
      data.data.list.map(function(item){
        if (that.data.lawyerCard.memberId == item.memberId){
          that.setData({
            isFollow:true,
          })
        }
      })
    }
    var fail = e => {
      console.log(e)
    }
    if (wx.getStorageSync("token")) {
    wxrequest.request(url, data, success, fail)
    }
    // else{
    //   wx.navigateTo({
    //     url: '../../../../../../userlogin/index',
    //   })
    // }
  },
  // 简介加载更多
  showMore: function (e) {
    this.setData({
      showMore: !this.data.showMore
    })
    console.log(e)
  },
  //年龄地址
  ageAddress:function(){
    var that = this
    var td = that.data.lawyerInfo
    //教育信息
    var educationList = []
    td.education[0] ? td.education.map(function (item) {
      educationList.push({ "startDate": item.startDate.split(" ")[0].split('-', 2).join("/"), "endDate": item.endDate.split(" ")[0].split('-', 2).join("/"), "educationTitle": item.educationTitle, "educationName": item.educationName })
    }) : ''
    //工作经历
    var workList = []
    td.workExp[0] ? td.workExp.map(function (item) {
      workList.push({ "startDate": item.startDate.split(" ")[0].split('-', 2).join("/"), "endDate": item.endDate.split(" ")[0].split('-', 2).join("/"), "institutionName": item.institutionName, "positionName": item.positionName })
    }) : ''
    var now = formatTime.formatTime(new Date()).split('/')[0]
    var age = that.data.lawyerCard.birthday.split("-")[0]
    that.setData({
      education: educationList,
      work: workList,
      address: that.data.lawyerCard.region.split('-', 2),
      age: now - age
    })
  },
  //案例
  getCase:function(){
    var url = api.getCase()
    var data = { "memberId": this.data.lawyerCard.memberId,"pageNum":'1',"pageSize":'10'}
    var success = (data)=>{
      this.setData({
        caseList:data.data.list
      })
      console.log("案例",data)
    }
    var fail = (e)=>{
      console.log("案例错误",e)
    }
    wxrequest.request(url,data,success,fail)
  },
  //案件h5
  gotoCase:function(e){
    wx.navigateTo({
      url: '../case-web/index?url=' + this.data.caseList[e.currentTarget.dataset.caseindex].url,
    })
  },
  //显示名片
  showCard:function(){
    this.setData({
      isshowCard:true,
      isshowCase:false
    })
  },
  //显示案件展示
  showCase:function(){
    this.setData({
      isshowCard: false,
      isshowCase: true
    })
  },
  //执业年份
  getAge: function () {
    var that = this
    that.setData({
      year: formatTime.formatTime(new Date()).split("/")[0] - that.data.lawyerCard.beginPracticeDate.split("-")[0],
    })
  },
  
  //支付
  //快速咨询
  quickConsultation:function(){
    var t = { money: 100, type: 3, product:3}
    wxPay(t).then(res=>{
      console.log(res)
    })
    // PA18122702075861469
    // var url = api.getExpertPhone() +'/PA18122702075861469'
    // var success = data =>{
    //   console.log(data)
    // }
    // var fail = e=>{
    //   wx.showToast({
    //     title: e.data.message,
    //     icon:'none'
    //   })
    //   console.log(e)
    // }
    // wxrequest.requestGet(url,'',success,fail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.quickConsultation()
    this.setData({
      lawyerList: options.memberId,
      quick:options.quick ? true:false
    })
    wx.showLoading({
      title: '获取律师信息',
    })
    this.search()
    this.followList()
    // this.getlawyer()
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
    //选择id
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
