var wxrequest = require('../../utils/request.js')
var api = require('../../utils/api.js')
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
    article: [{ "articleName":'文章名称', "articleImageSrc": '图片地址', "id": '文章分类ID' } ],//文章列表
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
        })
    }
    var failType = function (e){
      console.log("错误",e)
    }
    wxrequest.requestGet(typeUrl, message, successType, failType)

    // 文章列表
    var listUrl = api.getArticleListUrl()
    var message = "加载中"
    var listData = { }
    var successList = function (data){
      console.log("list",data)
      data.data.list.map(function (item) {
        articleList.push({ "articleName": item.articleTitle, "articleImageSrc": item.image, "id": item.categoryId})
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

    // 消息
    var tipsList = 
    // 消息
    this.judgeTips()
  },
  // 滚动样式
  switchTab: function (e) {
    var that = this
    this.setData({
      articleIndex: e.detail.current
    });
    this.checkCor();
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

    // var articleID = that.data.popular[that.data.articleIndex].id
    // var listUrl = api.getArticleListUrl()
    // var message = "加载中"
    // var listData = { "categoryId": articleID}
    // var successList = function (data){
    //   console.log("选择list",data)
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
   
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        // console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.articleIndex <= 3) {
      this.setData({
        scrollLeft: 0
      })
    } else if (this.data.articleIndex > 3 && this.data.articleIndex <= 7) {
      this.setData({
        scrollLeft: "750rpx"
      })
    } else if (this.data.articleIndex > 7 && this.data.articleIndex <= 11) {
      this.setData({
        scrollLeft: "1500rpx"
      })
    } else if (this.data.articleIndex > 11 && this.data.articleIndex <= 15) {
      this.setData({
        scrollLeft: "2250rpx"
      })
    } else if (this.data.articleIndex > 15 && this.data.articleIndex < 19) {
      this.setData({
        scrollLeft: "3000rpx"
      })
    }
  },
  // 页面跳转
  gotoConstultation:function(){
    var problemType = this.data.popular
    // 缓存到本地
    wx.setStorageSync('typeName', problemType)
    // 
    wx.navigateTo({
      url:'../index/consultation/index?id=1'
    })
  },
  gotoQuick:function(){
    wx.navigateTo({
      url: '../index/quick-consultation/index?id=2',
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
