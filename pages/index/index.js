var wxrequest = require('../../utils/request.js')
var api = require('../../utils/api.js')
var that 
var articleTypeId 
var categoryName 
var articleList 
Page({
  data: {
    imgUrls: [
      'http://5b0988e595225.cdn.sohucs.com/images/20170906/58cdb24be3624488ad3e8d3d00b4585f.jpeg',
      'http://pic28.photophoto.cn/20130818/0020033143720852_b.jpg',
      'http://img.zcool.cn/community/014565554b3814000001bf7232251d.jpg@1280w_1l_2o_100sh.png'
    ],
    interval: 3000,
    duration: 1000,
    popular: [{ "categoryName": "婚姻家庭","id":"1"}],//文章分类
    article: [],//文章列表
    articleId:1,//文章类型 分类ID
    helpNumber:10,
    more:false,
    choose:false,
    chooseSize:false,
    animationData:{},
    tipsNumber:999,
    tipsOne:false,
    tipsTwo:false,
    articleIndex:0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var that = this
    var articleTypeId=[]
    var categoryName = []
    var articleList = []

    // 文章分类
    var typeUrl = api.getArticleTypeUrl()
    var message = "加载中"
    var successType = function(data){
      console.log("列表", data.data)
      data.data.map(function (item) {
        categoryName.push({ "categoryName": item.categoryName, "id":item.id})
        // articleTypeId.push(item.id)
      })  
      that.setData({
          popular: categoryName,
          articleId: articleTypeId
        })
    }
    var failType = function (e){
      console.log("错误",e)
    }
    wxrequest.requestGet(typeUrl, message, successType, failType)

    // // 文章列表
    // var listUrl = api.getArticleListUrl()
    // var message = "加载中"
    // var listData = { "categoryId": 12}
    // var successList = function (data){
    //   console.log("list",data)
    //   data.data.list.map(function (item) {
    //     articleList.push({"articleName":item.articleTitle,"articleImageSrc":item.image})
    //   })
    //   console.log(articleList)
    //   that.setData({
    //     article:articleList
    //   })
    // }
    // var failList = function (e){
    //   console.log("list",e)
    // }
    // wxrequest.requestPost(listUrl,listData, message, successList,failList)

    // 消息
    this.judgeTips()
  },
  // 登录
  getUserInfo: function (e) {
    var that = this
    console.log(e)
    console.log("获取用户信息")
    app.globalData.userInfo = e.detail.userInfo
    that.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.request({
      url: 'https://api-test.lex-mung.com/passport/app/login',
    })
  },
  // 选择文章
  selsectArticle:function(e){
    var that = this
    var articleTypeId = []
    var categoryName = []
    var articleList = []
    that.setData({
      articleIndex: e.currentTarget.id
    })
    var articleID = that.data.popular[that.data.articleIndex].id

    var listUrl = api.getArticleListUrl()
    var message = "加载中"
    var listData = { "categoryId": articleID}
    var successList = function (data){
      console.log("选择list",data)
      data.data.list.map(function (item) {
        articleList.push({"articleName":item.articleTitle,"articleImageSrc":item.image})
      })
      console.log(articleList)
      that.setData({
        article:articleList
      })
    }
    var failList = function (e){
      console.log("list",e)
    }
    wxrequest.requestPost(listUrl,listData, message, successList,failList)
   
    // console.log(this.data.popular[this.data.articleIndex].id)
    // console.log(e.currentTarget.id)
  },
  // 页面跳转
  gotoConstultation:function(){
    wx.navigateTo({
      url:'../consultation/index?id=1'
    })
  },
  onReady: function () {

  },
  // 消息
  judgeTips:function(){
    if (this.data.tipsNumber < 10) {
      this.setData({
        tipsOne: true
      })
    } else if (this.data.tipsNumber >= 10 && this.data.tipsNumber < 100) {
      this.setData({
        tipsTwo: true
      })
    } else {
      this.setData({
        tipsNumber: "99＋",
        tipsTwo: true
      })
    }
  },
  // 清除消息
  clearTips:function(){
    this.setData({
      tipsOne:false,
      tipsTwo:false
    })
  },
  loadMorePopular:function(){
    console.log('更多热门推荐')
  },
  loadMore:function(){
    console.log("加载更多")
  },
  test:function(){
    var that = this;
    // 显示加载图标
    console.log(that.data.more)
    that.setData({
      more:!that.data.more
    })
  },
  // onReachBottom: function () {
    // wx.showLoading({
    //   title: '加载中',
    // }),
    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 2000)
    // 页数+1
    // page = page + 1;
    // wx.request({
    //   url: 'https://xxx/?page=' + page,
    //   method: "GET",
    //   // 请求头部
    //   header: {
    //     'content-type': 'application/text'
    //   },
    //   success: function (res) {
    //     // 回调函数
    //     var moment_list = that.data.moment;
 
    //     for (var i = 0; i < res.data.data.length; i++) {
    //       moment_list.push(res.data.data[i]);
    //     }
    //     // 设置数据
    //     that.setData({
    //       moment: that.data.moment
    //     })
    //     // 隐藏加载框
    //     wx.hideLoading();
    //   }
    // })
    // console.log("加载更多")
  // },
  showModal: function () {
    // 显示遮罩层
    wx.hideTabBar({}) 
    var animation = wx.createAnimation({
      duration: 100,
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
    wx.showTabBar({})
  }
})
