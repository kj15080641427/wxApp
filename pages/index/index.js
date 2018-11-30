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
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    winHeight: "",//窗口高度
    scrollLeft: 0, //tab标题的滚动条位置
    tabList: [
      { "tabname": "测试1", "id": "id1" },
      { "tabname": "测试2", "id": "id2" },
      { "tabname": "测试3", "id": "id3" },
      { "tabname": "测试4", "id": "id4" },
      { "tabname": "测试5", "id": "id5" },
      { "tabname": "测试6", "id": "id6" },
      { "tabname": "测试7", "id": "id7" }
    ]
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
  // 切换
  // swichNav: function (e) {
  //   var that = this
  //   that.setData({
  //     articleIndex: e.articleIndex.id
  //   })
  //   this.checkCor();
  // },
  // 滚动样式
  switchTab: function (e) {
    var that = this
    that.setData({
      articleIndex: e.detail.current
    })
    this.checkCor();
    console.log(123)
    console.log(that.data.articleIndex)
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.articleIndex >=4) {
      this.setData({
        scrollLeft: this.data.scrollLeft+100
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
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
    this.checkCor();
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
   
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  // 页面跳转
  gotoConstultation:function(){
    var problemType = this.data.popular
    wx.navigateTo({
      url:'../consultation/index?problemType=problemType'
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
