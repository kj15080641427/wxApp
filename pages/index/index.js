var wxrequest = require('../../utils/request.js')
var api = require('../../utils/api.js')
var initIndex = ''
Page({
  // <<<<<<< HEAD
  data: {
    swiperH: '', //swiper高度
    nowIdx: 0, //当前swiper索引
    popular: [], //文章分类
    article: [], //文章列表
    more: false,
    choose: false,
    chooseSize: false,
    animationData: {},
    tipsNumber: 999,
    tipsOne: false,
    tipsTwo: false,
    articleIndex: 0,
    userInfo: {},
    hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    winHeight: "", //窗口高度
    scrollLeft: 0, //tab标题的滚动条位置
    adBanner: '',
    listHeight: '',
    pageNum: 1,
    total: 10,
  },
  //swiper滑动事件banner图
  swiperChange: function(e) {
    this.setData({
      nowIdx: e.detail.current
    })
  },
  //搜索律师
  gotoSearch: function() {
    wx.switchTab({
      url: '../search/index',
    })
  },
  //h5
  gotoweb: function(e) {
    this.setData({
      resIndex: e.currentTarget.dataset.resolveindex
    })
    var array = this.data.article[e.currentTarget.dataset.resolveindex]
    wx.setStorageSync("web", array)
    wx.navigateTo({
      url: 'webView/index'
    })
  },
  //广告
  getAdbanner: function() {
    var url = api.getAdbanner()
    var success = (data) => {
      wx.hideLoading()
      this.setData({
        adBanner: data.data.list
      })
      console.log("广告", data.data.list)
    }
    var fail = (e) => {
      console.log(e)
    }
    wxrequest.requestGet(url, '', success, fail)
  },
  //跳转至广告
  gotoAd: function(e) {
    wx.navigateTo({
      url: 'adWebView/index?adUrl=' + this.data.adBanner[e.currentTarget.dataset.adindex].linkValue,
    })
  },
  //解决方案类型
  getArticleType: function() {
    var that = this
    var url = api.getArticleTypeUrl()
    var messagetype = ""
    var data = {
      "pageNum": 1,
      "pageSize": 20,
      "deviceInfoId": 5
    }
    var success = function(data) {
      wx.hideLoading()
      console.log("解决方案分类list", data.data)
      that.setData({
        popular: data.data,
      })
      that.getArticleList()
    }
    var fail = function(e) {
      wx.hideLoading()
      console.log("解决方案错误", e)
    }
    wxrequest.requestPost(url, data, messagetype, success, fail)
  },
  //解决方案
  getArticleList: function() {
    var that = this
    var listUrl = api.getArticleListUrl()
    var message = ""
    var listData = {
      "typeId": that.data.popular[that.data.articleIndex].id,
      "pageNum": that.data.pageNum,
      "pageSize": 10,
      "deviceInfoId": 5
    }
    var successList = function(data) {
      that.setData({
        total: data.data.total,
        article: that.data.article.concat(data.data.list),
        listHeight: that.data.article.length ? that.data.article.length * 250 + 200 + 'rpx' : ''
      })

      console.log("解决方案list", that.data.article)
    }
    var failList = function(e) {
      console.log("解决方案错误", e)
    }
      wxrequest.requestPost(listUrl, listData, message, successList, failList)
  },
  //点击tabbar栏
  onTabItemTap(item) {
    this.getArticleType()
    this.getAdbanner()
    this.judgeTips()
  },

  //onload
  onLoad: function() {
    wx.showLoading({
      title: '数据加载中',
    })
    console.log('12312312', wx.getStorageInfoSync())
    this.getArticleType()
    this.getAdbanner()
    this.judgeTips()
  },

  onShow: function() {
    wx.removeStorageSync("picIndexList")
  },
  // 滚动样式
  switchTab: function(e) {
    var that = this
    // page=10
    this.setData({
      articleIndex: e.detail.current,
      article: [],
      pageNum: 1
    });
    this.checkCor();

    var listUrl = api.getArticleListUrl()
    var message = ""
    var listData = {
      "typeId": that.data.popular[that.data.articleIndex].id,
      "pageNum": that.data.pageNum,
      "pageSize": 10,
      "deviceInfoId": 5
    }
    var successList = function(data) {
      wx.hideLoading()
      that.setData({
        // article: data.data.list ? data.data.list : data.data,
        // listHeight: data.data.list.length * 220 + 300 + 'rpx'
        total: data.data.total,
        article: that.data.article.concat(data.data.list),
        listHeight: that.data.article.length ? that.data.article.length * 250 + 200 + 'rpx' : ''
      })
    }
    var failList = function(e) {
      console.log("list", e)
      wx.hideLoading()
    }
    wxrequest.requestPost(listUrl, listData, message, successList, failList)
  },

  // 选择文章
  selsectArticle: function(e) {
    var that = this
    that.setData({
      articleIndex: e.currentTarget.id
    })
    this.checkCor();

    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
      }
    });
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
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
  //to免费咨询
  tologin: function() {
    if (!wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '/pages/userlogin/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/consultation/index',
      })
    }
  },
  // 文字咨询
  gotoConstultation: function() {
    if (wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '../index/consultation/index?type=' + JSON.stringify(this.data.popular)
      })
    } else {
      wx.navigateTo({
        url: '../userlogin/index'
      })
    }
  },
  //热线咨询
  phoneConstultation: function() {
    var url = api.getPhone()
    var success = function(data) {
      console.log(data)
      wx.makePhoneCall({
        phoneNumber: data.data.phone,
      })
    }
    var fail = function(e) {
      wx.showToast({
        title: '无法获取电话号码',
        icon: 'none'
      })
      console.log(e)
    }
    wxrequest.requestGet(url, '', success, fail)
  },
  //专家咨询
  gotoExpert: function() {
    if (wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '../index/expert-service/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/userlogin/index',
      })
    }
  },
  //快速咨询
  gotoQuick: function() {
    if (wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '../index/quick-consultation/index?id=2',
      })
    } else {
      wx.navigateTo({
        url: '/pages/userlogin/index',
      })
    }
  },
  onReady: function() {

  },
  onReachBottom: function() {
    var that = this
    // if (this.data.total >= 10){
    that.setData({
      pageNum: that.data.pageNum + 1,
    })
    this.getArticleList()
    // }
    console.log('页数', this.data.pageNum, )
  },
  // 消息
  judgeTips: function() {
    if (this.data.tipsNumber < 10) {
      this.setData({
        tipsOne: true
      })
    } else if (this.data.tipsNumber >= 10 && this.data.tipsNumber < 100) {
      this.setData({
        tipsOne: true
      })
    } else {
      this.setData({
        tipsNumber: "...",
        tipsTwo: true
      })
    }
  },
  goToMessage() {
    wx.navigateTo({
      url: '../message/index',
    })
  },
  // 清除消息
  clearTips: function() {
    this.setData({
      tipsOne: false,
      tipsTwo: false
    })
  },
  loadMorePopular: function() {
    console.log('更多热门推荐')
  },
  loadMore: function() {
    console.log("加载更多")
  },
  test: function() {
    var that = this;
    // 显示加载图标
    console.log(that.data.more)
    that.setData({
      more: !that.data.more
    })
  },
  showModal: function() {
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
    wx.showTabBar({})
  }
})