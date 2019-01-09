var wxrequest = require('../../../utils/request.js')
var api = require('../../../utils/api.js')
var reg = require('../../../region.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: 1,
    array: [],
    hasSelect: true,
    hasSelectAddress: false,
    region: '',

    consultationTypeId: "",
    regionId: "",
    commitContent: "",
    isHide: 1,

    multiIndex: [0, 0],
    multiArray: '',
    openid: wx.getStorageSync('openid')
  },
  //地区

  hideRegion: function() {
    this.setData({
      hasSelectAddress: false,
    })
  },
  //选择地区
  bindMultiPickerColumnChange: function(e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        data.multiArray[1] = this.data.multiArray[e.detail.column][e.detail.value].child;
        break;
    }
    this.setData({
      multiArray: this.data.multiArray,
      // multiIndex: this.data.multiIndex,
    })
  },
  bindMultiPickerChange: function(e) {
    this.setData({
      regionId: this.data.multiArray[1][e.detail.value[1]].regionId,
      multiIndex: e.detail.value,
      hasSelectAddress: true,
    })
  },


  // 匿名
  radioChange: function(e) {
    this.setData({
      isHide: !this.data.isHide
    })
  },
  // 选择问题
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
      hasSelect: false,
    })
    this.setData({
      consultationTypeId: this.data.array[e.detail.value].id
    })
  },


  // input
  getInput: function(e) {
    this.setData({
      commitContent: e.detail.value
    })
  },
  // formSubmit(e) {
  //   var that = this
  //   console.log('form发生了submit事件，携带数据为：', e)
  //   this.setData({
  //     formId: e.detail.formId
  //   })

  //   var commitURL = api.getCommitUrl()
  //   var freedata = {
  //     "consultationTypeId": e.detail.value.consultationTypeId,
  //     "regionId": e.detail.value.regionId, 
  //     "content": e.detail.value.content,
  //     "isHide": e.detail.value.isHide,
  //     "wxReportSubmit": {
  //       "openId": e.detail.value.openid,
  //       "formId": e.detail.formId
  //     }
  //    }
  //   console.log("formIdsssssssssssss",that.data.formId)
  //   var success = function(data){
  //     console.log("上传参数", freedata)
  //     that.setData({
  //       consultation:data
  //     })
  //   that.getOrder()
  //   console.log('成功')
  //     wx.showToast({
  //       title: '提交成功',
  //     })
  //     console.log(',.....',that.data.consultation)
  //   }
  //   var fail = function(e){
  //     console.log(12312312312,e)
  //     wx.showToast({
  //       title: '提交失败',
  //     })
  //   }
  //   var cdata = this.data
  //   if (cdata.consultationTypeId == '') {
  //     wx.showToast({
  //       title: '请选择问题类型',
  //       icon: 'none'
  //     })
  //   } else if (cdata.regionId == '') {
  //     wx.showToast({
  //       title: '请选择地区',
  //       icon: 'none'
  //     })
  //   } else if (cdata.commitContent.length < 10) {
  //     wx.showToast({
  //       title: '问题描述需10字以上',
  //       icon: 'none'
  //     })
  //   } else {
  //     wxrequest.requestForm(commitURL, freedata,'', success, fail)
  //   }
  // },
  // 提交
  commit: function() {
    var that = this
    var commitURL = api.getCommitUrl()
    var freedata = {
      "consultationTypeId": that.data.consultationTypeId,
      "regionId": that.data.regionId,
      "content": that.data.commitContent,
      "isHide": that.data.isHide == true ? '1' : '0',
      // "wxReportSubmit": {
      //   "openId": wx.getStorageSync('openid'),
      //   "formId": that.data.formId
      // }
    }
    var success = function(data) {
      that.setData({
        consultation: data
      })
      that.getOrder()
      wx.showToast({
        title: '提交成功',
      })
    }
    var fail = function(e) {
      wx.showToast({
        title: '提交失败',
      })
    }
    var cdata = this.data
    if (cdata.consultationTypeId == '') {
      wx.showToast({
        title: '请选择问题类型',
        icon: 'none'
      })
    } else if (cdata.regionId == '') {
      wx.showToast({
        title: '请选择地区',
        icon: 'none'
      })
    } else if (cdata.commitContent.length < 10) {
      wx.showToast({
        title: '问题描述需10字以上',
        icon: 'none'
      })
    } else {
      wxrequest.request(commitURL, freedata, success, fail)
    }
  },
  //订单
  getOrder: function() {
    var that = this
    var url = api.getOrder()
    var data = {
      "memberId": this.data.memberId,
      "pageNum": 1,
      "pageSize": 50
    }
    var success = (data) => {
      this.setData({
        order: data.data.list
      })
      wx.redirectTo({
        url: '/pages/index/consultation-details/index?orderDetail=' + JSON.stringify(that.data.order[0]),
      })
    }
    var fail = (e) => {
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
  },
  //首页解决方案类型是否加载成功
  hasArticleType:function(){
    if (!wx.getStorageSync('type')) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      setTimeout(() => {
        wx.hideLoading()
      }, 10000)
      this.getArticleType()
    }
  },
  //解决方案类型  
  getArticleType: function() {
    var that = this
    var url = api.getArticleTypeUrl()
    var messagetype = ""
    var data = {
      "pageNum": 1,
      "pageSize": 100,
      "deviceInfoId": 5
    }
    var success = function(data) {
      function toSort(a, b) {
        return a.sort - b.sort
      }
      wx.setStorageSync('type', data.data.sort(toSort))
      wx.hideLoading()
    }
    var fail = function(e) {
      wx.hideLoading()
      console.log("解决方案错误", e)
    }
    wxrequest.requestPost(url, data, messagetype, success, fail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getArticleType()
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
    reg.citysData.map((item, index) => {
      if (item.name == wx.getStorageSync("province")) {
        this.setData({
          provi: index
        })
      }
    })
    if (!this.data.provi) {
      this.setData({
        provi: 0
      })
    }
    // console.log('省', this.data.provi)
    reg.citysData[this.data.provi].child.map((item, index) => {
      if (item.name == wx.getStorageSync("city")) {
        this.setData({
          cit: index
        })
      }
    })
    if (!this.data.cit) {
      this.setData({
        cit: 0
      })
    }
    this.setData({
      multiIndex: [this.data.provi, this.data.cit]
    })
    this.setData({
      array: wx.getStorageSync('type'),
      multiArray: [
        reg.citysData,
        reg.citysData[this.data.provi].child
      ],
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 10000)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})