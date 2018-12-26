var wxrequest = require('../../utils/request.js')
var api = require('../../utils/api.js')
var initIndex=''
Page({
  data: {
    swiperH: '',//swiper高度
    nowIdx: 0,//当前swiper索引
    // imgList: [//图片列表
    //   'http://img.zcool.cn/community/01ed345549046c0000019ae992d5e2.jpg@1280w_1l_2o_100sh.png',
    //   'http://img.zcool.cn/community/01ed345549046c0000019ae992d5e2.jpg@1280w_1l_2o_100sh.png',
    //   'http://img.zcool.cn/community/01ed345549046c0000019ae992d5e2.jpg@1280w_1l_2o_100sh.png',
    // ],
    // interval: 3000,
    // duration: 1000,
    popular: [{ "categoryName": "婚姻家庭","id":"1"}],//文章分类
    article: [{ "articleName":'文章名称', "articleImageSrc": '图片地址', "id": '文章分类ID' } ],//文章列表
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
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    winHeight: "",//窗口高度
    scrollLeft: 0, //tab标题的滚动条位置
    adBanner:'',
    listHeight:''
  },
  //获取swiper高度
  // getHeight: function (e) {
  //   var winWid = wx.getSystemInfoSync().windowWidth - 5 * 50;//获取当前屏幕的宽度
  //   var imgh = e.detail.height;//图片高度
  //   var imgw = e.detail.width;
  //   var sH = winWid * imgh / imgw + "rpx"
  //   this.setData({
  //     swiperH: sH//设置高度
  //   })
  // },
  //swiper滑动事件banner图
  swiperChange: function (e) {
    this.setData({
      nowIdx: e.detail.current
    })
  },
  //搜索律师
  gotoSearch:function(){
    wx.switchTab({
      url:'../search/index',
    })
  },
  //h5
  gotoweb:function(e){
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
  getAdbanner:function(){
    var url = api.getAdbanner()
    var success = (data)=>{
      this.setData({
        adBanner:data.data.list
      })
      console.log("广告", data.data.list)
    }
    var fail = (e) => {
      console.log(e)
    }
    wxrequest.requestGet(url,'',success,fail)
  },
  //跳转至广告
  gotoAd:function(e){
    wx.navigateTo({
      url: 'adWebView/index?adUrl=' + this.data.adBanner[e.currentTarget.dataset.adindex].linkValue,
    })
    // console.log(this.data.adBanner[e.currentTarget.dataset.adindex].linkValue)
  },
  //解决方案类型
  getArticleType:function(){
    var that = this
    var url = api.getArticleTypeUrl()
    var messagetype = ""
    var data = { "pageNum": 1, "pageSize": 100,"deviceInfoId":5 }
    var success = function (data) {
      console.log("解决方案分类list", data.data.list)
      that.setData({
        popular: data.data.list.reverse(),
      })
      that.getArticleList()
      // initIndex: data.data.list[0].id
    }
    var fail = function (e) {
      console.log("解决方案错误", e)
    }
    wxrequest.requestPost(url, data, messagetype, success, fail)
  },
  //解决方案
  getArticleList:function(){
    var that = this
    var listUrl = api.getArticleListUrl()
    var message = ""
    var listData = { "typeId": this.data.popular[0].id, "pageNum": 1, "pageSize": 10, "deviceInfoId": 5 }
    var successList = function (data) {
      wx.hideLoading()
      console.log("解决方案list", data)
      that.setData({
        article: data.data.list ? data.data.list :data.data
      })
    }
    var failList = function (e) {
      console.log("解决方案错误", e)
    }
    wxrequest.requestPost(listUrl, listData, message, successList, failList)
  },
  //解决方案列表index
  // getresIndex:function(e){
  //   this.setData({
  //     resIndex: e.currentTarget.dataset.resolveindex
  //   })
  //   console.log('解决方案index',e)
  // },
  onLoad: function () {
    wx.showLoading({
      title: '数据加载中',
    })
    wx.removeStorageSync("picIndexList")
    console.log('12312312',wx.getStorageInfoSync())
    this.getArticleType()
    this.getAdbanner()

    // 消息
    this.judgeTips()
  },
  getLowerIndex:function(e){
    this.setData({

    })
    console.log("hhhh",e)
  },
  onReady:function(){

  },
  onShow:function(){
    
  },
  // 滚动样式
  switchTab: function (e) {
    var that = this
    this.setData({
      articleIndex: e.detail.current
    });
    this.checkCor();

    var listUrl = api.getArticleListUrl()
    var message = ""
    var listData = { "typeId": that.data.popular[e.detail.current].id, "pageNum": 1, "pageSize": 10, "deviceInfoId": 5 }
    var successList = function (data) {
      // console.log("list", data.data.list.length)
      that.setData({
        article: data.data.list ? data.data.list:data.data,
        // listHeight: data.data.list.length ? data.data.list.length*220+200+'rpx' :''
      })
    }
    var failList = function (e) {
      console.log("list", e)
    }
    wxrequest.requestPost(listUrl, listData, message, successList, failList)
  },

  // 选择文章
  selsectArticle:function(e){
    var that = this
    that.setData({
      articleIndex: e.currentTarget.id
    })
    this.checkCor();
   
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
  // 文字咨询
  gotoConstultation:function(){
    if(wx.getStorageSync("token")){
    // console.log('pop', this.data.popular)
    wx.navigateTo({
      url: '../index/consultation/index?type=' + JSON.stringify(this.data.popular)
    })
  }else{
      wx.navigateTo({
        url: '../userlogin/index'
      })
  }
  },
  //热线咨询
  phoneConstultation:function(){
    var url = api.getPhone()
    // var data = wx.getStorageSync("token")
    var success = function(data){
      console.log(data)
      wx.makePhoneCall({
        phoneNumber: data.data.phone,
      })
    }
    var fail = function(e){
      wx.showToast({
        title: '无法获取电话号码',
        icon:'none'
      })
      console.log(e)
    }
    wxrequest.requestGet(url,'', success,fail)
  },
  //专家咨询
  gotoExpert:function(){
    wx.navigateTo({
      url: '../index/expert-service/index',
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
        tipsOne: true
      })
    } else {
      this.setData({
        tipsNumber: "...",
        tipsTwo: true
      })
    }
  },
  goToMessage(){
    wx.navigateTo({
      url: '../message/index',
    })
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
