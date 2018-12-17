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
    initIndex:''
  },
  //需求test
  gotoDemand:function(){
    wx.navigateTo({
      url: '../search/demand/index',
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
  //解决方案列表index
  // getresIndex:function(e){
  //   this.setData({
  //     resIndex: e.currentTarget.dataset.resolveindex
  //   })
  //   console.log('解决方案index',e)
  // },
  onLoad: function () {
    console.log('12312312',wx.getStorageInfoSync())
    var that = this
    var listUrltype = api.getArticleTypeUrl()
    var messagetype = ""
    var listDatatype = {"pageNum": 1, "pageSize": 100 }
    var successListtype = function (data) {
      console.log("解决方案分类list", data.data.list)
      that.setData({
        popular: data.data.list.reverse(),
        initIndex:data.data.list[0].id
      })

      //解决方案
      var listUrl = api.getArticleListUrl()
      var message = ""
      var listData = { "typeId":that.data.initIndex, "pageNum": 1, "pageSize": 10 }
      var successList = function (data) {
        console.log("解决方案list", data)
        that.setData({
          article: data.data.list
        })
      }
      var failList = function (e) {
        console.log("解决方案错误", e)
      }
      wxrequest.requestPost(listUrl, listData, message, successList, failList)

    }
    var failListtype = function (e) {
      console.log("解决方案错误", e)
    }
    wxrequest.requestPost(listUrltype, listDatatype, messagetype, successListtype, failListtype)


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
    var listData = { "typeId": that.data.popular[e.detail.current].id, "pageNum": 1, "pageSize": 10 }
    var successList = function (data) {
      console.log("list", data.data.list)
      that.setData({
        article: data.data.list
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
  // 页面跳转
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
