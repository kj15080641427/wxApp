// pages/search/demand-list/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
var formatTime = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listIndex: '',
    parameter: '',
    noFilter: {
      "regionId": '',
      "lawyerName": '',
      "practiceYearId": '',
      "sex": '',
      "industryId": '',
      "baseSkillId": '',
      "otherSkillId": '',
      "langSkillId": '',
      "courtId": '',
      "procuratorateId": '',
      "positionId": '',
      "honorId": '',
      "socialId": '',
      "depositAmountId": '',
      "lexMungId": '',
      "orgId": '',
      "businessTypeId": '',
      "require": {
        "requireTypeId": '',
        "clientAffordMaxAmount": ''
      }
    },
    sort: ["综合排序", "最新入驻", "活跃度最高"],
    sortIndex: 0, //排序index
    hasList: true,
    pageNum:1,
    // hasNextPage:true
  },
  //排序Index
  getSortIndex: function(e) {
    this.setData({
      sortIndex: e.currentTarget.dataset.sortindex,
      showSort: !this.data.showSort,
      ['noFilter.sort']: e.currentTarget.dataset.sortindex
    })
    this.searchLawyer()
  },
  //排序
  sort: function() {
    this.setData({
      showSort: !this.data.showSort,
      showRegion: false,
      showExpert: false,
    })
  },
  //关键字搜索
  searchInput: function(e) {
    this.setData({
      ['noFilter.lawyerName']: e.detail.value,
      ishidden: true
    })
  },
  //index
  getIndex: function(e) {
    this.setData({
      listIndex: e.currentTarget.dataset.index,
      ['parameter.targetLawyerId']: this.data.lawyerList[e.currentTarget.dataset.index].memberId
    })
  },
  //筛选
  gotoFilter: function() {
    wx.navigateTo({
      url: '../../search/filter/index?noFilter=' + JSON.stringify(this.data.noFilter) + '&require=' + JSON.stringify(this.data.require),
    })
  },
  //律师主页
  toLawyer:function(e){
    wx.navigateTo({
      url: '/pages/search/lawyer-detail/index?id=' + this.data.lawyerList[e.currentTarget.dataset.lawindex].memberId + '&parameter=' + JSON.stringify(this.data.parameter)+'&justDo=true',
    })
  },
  //上拉搜索
  topSearch: function () {
    var that = this
    var url = api.getSearchLawyer() + that.data.pageNum  + '/10'
    var datan = that.data.noFilter
    var success = function (data) {
      wx.hideLoading()
      if (!data.data.list[0]) {
        that.setData({
          hasList: false
        })
      } that.setData({
        hasList: true
      })
      that.setData({
        hasNextPage: data.data.hasNextPage,
        lawyerList: that.data.lawyerList.concat(data.data.list),
      })
    }
    var fail = function (e) {
      wx.hideLoading()
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
      console.log(e)
    }
    wxrequest.request(url, datan, success, fail)
  },
  //
  confirm(e) {
    var that = this
    var url = api.getSearchLawyer() + that.data.pageNum + '/10'
    var datan = that.data.noFilter
    that.setData({})
    var success = function(data) {
      wx.hideLoading()
      if (!data.data.list[0]) {
        that.setData({
          hasList: false
        })
      } that.setData({
        hasList: true
      })
      that.setData({
        lawyerList: data.data.list,
        ishidden: true
      })
      // that.getAge()
    }
    var fail = function(e) {
      wx.hideLoading()
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
      console.log(e)
    }
    wxrequest.request(url, datan, success, fail)
  },
  //搜索律师
  searchLawyer: function() {
    var that = this
    // var noFilter = noFilter
    var url = api.getSearchLawyer() + that.data.pageNum + '/10'
    var data = that.data.noFilter
    var success = function(data) {
      wx.hideLoading()
      that.setData({
        lawyerList: data.data.list,
      })
      if (!data.data.list[0]) {
        that.setData({
          hasList: false
        })
      }else{
        that.setData({
          hasList: true
        })
      }
      // 成功后调用onShow刷新页面
      that.onShow()
      that.onShow()
    }
    var fail = function(e) {
      wx.hideLoading()
      wx.showToast({
        title: '获取数据失败',
      })
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
    wx.showLoading({
      title: '正在加载',
    })
  },
  //发送需求
  sendDemand: function(e) {
    var that = this
    that.setData({
      listIndex: e.currentTarget.dataset.index,
      ['parameter.targetLawyerId']: String(that.data.lawyerList[e.currentTarget.dataset.index].memberId)
    })
    var url = api.getPublish()
    var data = that.data.parameter
    var success = function(data) {
      that.setData({
        ['parameter.isFirst']: 0,
        ['parameter.requirementId']: data.data.requirementId
      })
      wx.showToast({
        title: '发送需求成功',
        success() {

        }
      })
    }
    var fail = function(e) {
      wx.showToast({
        title: e.message,
        icon: 'none'
      })
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      parameter: JSON.parse(options.parameter),
      ['noFilter.regionId']: JSON.parse(options.parameter).lawyerRegionId,
      ['noFilter.businessTypeId']: JSON.parse(options.parameter).skillId ? JSON.parse(options.parameter).skillId : '',
      ['noFilter.require']: JSON.parse(options.require),
      require: JSON.parse(options.require)

      // "require": {
      //   "requireTypeId": '',
      //   "clientAffordMaxAmount": ''
      // }
    })
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面

    //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      postList: JSON.parse(options.parameter)
    })
    this.searchLawyer()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var yearList = []
    var addressList = []
    var that = this
    this.data.lawyerList ? this.data.lawyerList.map(function(item) {
      yearList.push(formatTime.formatTime(new Date()).split("/")[0] - item.beginPracticeDate.split("-")[0])
    }) : ''
    that.data.lawyerList ? that.data.lawyerList.map(function(item) {
      addressList.push(item.region.split('-', 2))
    }) : ''
    this.setData({
      year: yearList,
      address: addressList,
      // region: region.citysData
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.removeStorageSync("requirementId")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    if (that.data.hasNextPage){
    that.setData({
      pageNum: that.data.pageNum + 1,
    })
    that.topSearch()
    }else {
      wx.showToast({
        title: '没有更多数据',
        icon:'none'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})