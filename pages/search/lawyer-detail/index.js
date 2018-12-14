// pages/search/lawyer-detail/index.js
var formatTime = require('../../../utils/util.js')
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lawyerRequset:'',
    lawyerCache:'',
    index:'',
    year:'',
    education:'',
    work:'',
    address:'',
    age:'',
    lawyerCard:'',
    showMore:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    this.setData({
      lawyerRequset: JSON.parse(options.lawyerInfo),
      lawyerCache: JSON.parse(options.lawyerCache),
      index:options.listIndex,
      year:options.year.split(","),
    })

    console.log("lawyerCache", this.data.lawyerCache)
    // console.log("year", options )

    //律师主页 (背景图/所获荣誉/描述)
    var homeUrl = api.getLawHomePage() + this.data.lawyerCache[this.data.index].memberId
    var homeData = this.data.lawyerCache[this.data.index].memberId
    var homeSuccess = function (data) {
      console.log("背景图/简介",data)
      that.setData({
        lawyerCard: data.data
      })

    }
    var homeFail = function (e) {
      console.log(e)
    }
    wxrequest.requestGetpar(homeUrl, homeData, '', homeSuccess, homeFail) //主页


    // var that = this
    // var lawyerData = that.data.lawyerCache[that.data.index]
    // // var index = e.currentTarget.dataset.index
    // var year = that.data.year
    // // 律师名片
    // var lawyerInfoUrl = api.getlawyerInfo() + this.data.lawyerCache[that.data.index].memberId
    // var lawyerData = this.data.lawyerCache[that.data.index].memberId
    // var success = function (data) {
    //   console.log("律师详情页.名片", data)
    //   that.setData({
    //     lawyerRequset: data.data
    //   })
    //   console.log("lawyerRequset", this.data.lawyerRequset)
    // }
    // var fail = function (e) {
    //   wx.showToast({
    //     title: '获取律师信息失败',
    //     icon: 'none'
    //   })
    //   console.log(e)
    // }
    // wxrequest.requestGetpar(lawyerInfoUrl, lawyerData, '', success, fail)

  },

  // 加载简介
  showMore:function(e){
    this.setData({
      showMore:!this.data.showMore
    })
    console.log(e)
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
    var educationList = []
    that.data.lawyerRequset.education ? that.data.lawyerRequset.education.map(function(item){
      educationList.push({ "startDate": item.startDate.split(" ")[0].split('-', 2).join("/"), "endDate": item.endDate.split(" ")[0].split('-', 2).join("/")})
    }) : console.log("无教育信息")

    var workList = []
    !that.data.lawyerRequset.workExp.endDate ? that.data.lawyerRequset.workExp.map(function (item) {
      work.push({ "startDate": item.startDate.split(" ")[0], "endDate": item.endDate.split(" ")[0] })
    }) : ''
    var now = formatTime.formatTime(new Date()).split('/')[0]
    var age = that.data.lawyerCache[that.data.index].birthday.split("-")[0]
    // var educationList = {"startDate": that.data.lawyerRequset.education[this.data.index].startDate.split(" ")[0], "endDate": that.data.lawyerRequset.education[this.data.index].endDate.split(" ")[0]}
    this.setData({
      education: educationList,
      work: workList,
      address : that.data.lawyerCache[that.data.index].region.split('-', 2),
      age:now-age
    })
    console.log("age", that.data.age)
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