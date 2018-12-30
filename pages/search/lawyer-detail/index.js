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
    isshowCase: false,
    time:60,
    start:true
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
  //律师单价
  getLawyerMoney:function(){
    // console.log(this.data.lawyerList)
    var url = api.getLawyerMoney() + this.data.lawyerList
    var success = data =>{
      console.log('律师单价',data.data)
      this.setData({
        lawyerMoney:data.data
      })
    }
    var fail = e =>{
      console.log(e)
    }
    wxrequest.requestGet(url,'',success,fail)
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
  //关闭弹窗
  closemodal:function(){
    console.log("??????????",this.data.time)
    if(this.data.time>0){
      // console.log("??????????")
      this.setData({
        close:true,
        countDown:false
      })
    }else{
      this.hideModal()
    }
  },
  //发布需求
  toDemand:function(){
    wx.navigateTo({
      url: '/pages/search/demand/index',
    })
  },
  //充值
  gotoCharge:function(){
    wx.navigateTo({
      url: '../../../../../../my/balance/index?memberId='+wx.getStorageSync("userInfo").memberId,
    })
  },
  //返回
  back:function(){
    this.setData({
      start: false,
      countDown: true,
      start:false,
    })
  },
  //支付
  goto:function(){
    var t = {
      money: 1, type: 3, product: 3, downTime: this.downTime(), countDown: this.setData({ start: false,countDown: true,start: false,})
      }
    wxPay(t).then(res => { //支付成功
       console.log('??>?>?>')
    },(err=>{ //支付失败
      console.log("余额不足...",err,t.go)
      // this.setData({
      //   // isgo:t.go,
      //   start:false
      // })
    }))
  },
  //倒计时
  downTime:function(){
    this.setData({ settime :setInterval(() => {
      this.setData({
        time: this.data.time - 1
      })
      if (this.data.time < 1) {
        clearInterval(this.data.settime)
        this.setData({
          time: 0
        })
      }
    }, 1000)})
  },
  //是否登录
  islogin:function(){
    if(!wx.getStorageSync("token")){
      wx.navigateTo({
        url: '/pages/userlogin/index',
      })
    }
  },
  //余额是否足够
  isEnough:function(){
    console.log(this.data.lawyerMoney.balance)
    if (this.data.lawyerMoney.balance >= this.data.lawyerMoney.lawyerPrice/60){
      this.showModal()
    }
  },
  showModal: function () {
    // 显示遮罩层
    // wx.hideTabBar({})
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(200).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    this.setData({
      countDown:false,
      start:true,
      isgo:false,
      close:false,
      time:60
    })
    clearInterval(this.data.settime)
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
    // wx.showTabBar({})
  },
  //支付
  //快速咨询
  quickConsultation:function(){
    console.log('电话咨询')
    var t = {
      money: this.data.lawyerMoney.lawyerPrice*100, type: 3, product: 5,lawyerId:this.data.lawyerList, downTime: this.downTime(), countDown: this.setData({ start: false, countDown: true, start: false, })
    }
    wxPay(t).then(res => {
      console.log('支付', res)
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
    this.setData({
      lawyerList: options.memberId,
      quick:options.quick ? true:false
    })
    wx.showLoading({
      title: '获取律师信息',
    })
    console.log("律师ID",options)
    this.search()
    this.followList()
    this.getLawyerMoney()
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
    this.hideModal()
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
