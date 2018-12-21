// pages/search/lawyer-detail/index.js
var formatTime = require('../../../utils/util.js')
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
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
    myFollow:''//我的关注列表
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
      // console.log("关注成功",data)
    }
    var fail = function(e){
      console.log(e)
    }
    wxrequest.requestGetpar(url,data,'',success,fail)
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
    // var lawyerCache = that.data.lawyerList
    // 律师名片
    var lawyerInfoUrl = api.getlawyerInfo() + that.data.lawyerList[listIndex].memberId
    var lawyerData = that.data.lawyerList[listIndex].memberId
    var success = function (data) {
      wx.hideLoading()
      that.setData({
        lawyerInfo:data.data
      })
      console.log("lawyerInfo",data)
    }
    console.log("教育信息", that.data.lawyerInfo)
    var fail = function (e) {
      wx.hideLoading()
      // wx.navigateTo({
      //   url: 'lawyer-detail/index',
      // })
      // wx.showToast({
      //   title: '获取律师信息失败',
      //   icon:'none'
      // })
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
    var homeUrl = api.getLawHomePage() + that.data.lawyerList[that.data.index].memberId
    var homeData = that.data.lawyerList[that.data.index].memberId
    var homeSuccess = function (data) {
      console.log("背景图/简介", data)
      that.setData({
        lawyerCard: data.data
      })

    }
    var homeFail = function (e) {
      console.log(e)
    }
    console.log(that.data.lawyerList)
    wxrequest.requestGetpar(homeUrl, homeData, '', homeSuccess, homeFail) //主页
  },
  //我的关注
  followList:function(){
    var that = this
    var url = api.getMyFollow()
    var data = { "pageNum": '1', "pageSize": '50' }
    var success = (data) => {
      console.log('我的关注',data)
      // that.setData({
      //   myFollow: data.data.list
      // })
      data.data.list.map(function(item){
        if (that.data.lawyerCard.memberId == item.memberId){
          console.log("已经关注了")
          that.setData({
            isFollow:true,
          })
        }
      })
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
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
    console.log("教育信息", that.data.lawyerInfo)
    // //教育信息
    // var educationList = []
    // td.education[0] ? td.education.map(function (item) {
    //   educationList.push({ "startDate": item.startDate.split(" ")[0].split('-', 2).join("/"), "endDate": item.endDate.split(" ")[0].split('-', 2).join("/"), "educationTitle": item.educationTitle, "educationName": item.educationName })
    // }) : ''
    // //工作经历
    // var workList = []
    // td.workExp[0] ? td.workExp.map(function (item) {
    //   workList.push({ "startDate": item.startDate.split(" ")[0].split('-', 2).join("/"), "endDate": item.endDate.split(" ")[0].split('-', 2).join("/"), "institutionName": item.institutionName, "positionName": item.positionName })
    // }) : ''
    // var now = formatTime.formatTime(new Date()).split('/')[0]
    // var age = that.data.lawyerList[that.data.index].birthday.split("-")[0]
    // //语言能力
    // var languageList = []
    // var ohterSkillList = []
    // td.skill[0] ? td.skill.map(function(item){
    //   if(item.parentId == 3){
    //     languageList.push({ "language": item.skillName })
    //   }else if(item.parentId == 2){
    //     ohterSkillList.push({"ohterSkill":item.skillName})
    //   }
    // }) :''
    // that.setData({
    //   education: educationList,
    //   work: workList,
    //   language:languageList,
    //   ohterSkill:ohterSkillList,
    //   address: that.data.lawyerList[that.data.index].region.split('-', 2),
    //   age: now - age
    // })
    // console.log("age", that.data.age)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      lawyerList: JSON.parse(options.lawyerList),
      index: options.listIndex, //在list中的index
      year:options.year,
    })
    console.log("lawyerList", JSON.parse(options.lawyerList))
    this.search()
    this.followList()
    this.getlawyer()
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
    this.ageAddress()
    var query = wx.createSelectorQuery();
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
