var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '', //服务类型
  },
  //获取服务类型
  getDemandType: function() {
    var url = api.getDemandType()
    var data = wx.getStorageSync("token")
    var success = data => {
      data.data.pop()
      this.setData({
        type: data.data
      })
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.requestGetpar(url, data, '', success, fail)
  },
  //服务类型
  pickerRequire: function(e) {
    this.setData({
      index: e.detail.value,
      ['parameter.requirementTypeId']: this.data.type[e.detail.value].requireTypeId,
      ['parameter.requirementTypeName']: this.data.type[e.detail.value].requireTypeName
    })
    this.getLawCash()
  },
  //擅长领域
  pickerBusiness: function(e) {
    this.setData({
      indexBus: e.detail.value,
      ['parameter.skillName']: this.data.lawyerInfo.businessType[0] ? this.data.lawyerInfo.businessType[e.detail.value].businessTypeName : this.data.business[e.detail.value].businessTypeName,
      ['parameter.skillId']: this.data.lawyerInfo.businessType[0] ? this.data.lawyerInfo.businessType[e.detail.value].businessTypeId : this.data.business[e.detail.value].businessTypeId
    })
    this.getMark()
  },
  //最高可承受费用
  getInput: function(e) {
    this.setData({
      ['parameter.maxCost']: e.detail.value
    })
  },
  //问题内容
  getContent: function(e) {
    this.setData({
      ['parameter.requirementContent']: e.detail.value
    })
  },
  //标签列表
  getMark: function() {
    var that = this
    var urltest = that.data.lawyerInfo.businessType[0] ? that.data.lawyerInfo.businessType[that.data.indexBus].businessTypeId : that.data.business[that.data.indexBus].businessTypeId
    var url = api.getMark() + urltest
    var data = {
      "businessTypeId": urltest
    }
    var success = function(data) {
      that.setData({
        selist: []
      })
      data.data.list.map(function(item) {
        that.data.selist.push({
          "is": false
        })
      })
      that.setData({
        markList: data.data.list
      })
    }
    var fail = function(e) {
      console.log(e)
    }
    wxrequest.requestGetpar(url, data, '', success, fail)
  },
  //标签是否选中 
  isSelected: function(e) {
    this.setData({
      seindex: e.currentTarget.dataset.selectindex,
      [`selist[${e.currentTarget.dataset.selectindex}].is`]: !this.data.selist[e.currentTarget.dataset.selectindex].is,
    })
  },
  //已选标签list
  getMarkList: function() {
    var that = this
    var tagIndexList = []
    var tagIdList = []
    var tagNameList = []
    if (this.data.selist[0]) {
      this.data.selist.map(function(item, index) {
        if (item.is) {
          tagIndexList.push(index)
        }
      })
      tagIndexList.map(function(item) {
        tagIdList.push(that.data.markList[item].tagId)
        tagNameList.push(that.data.markList[item].tagName)
      })
      this.setData({
        ['parameter.tagId']: tagIdList,
        ['parameter.tagName']: tagNameList,
      })
    }
  },
  //金额
  getLawCash:function(){
    var url = api.getLawCash() + this.data.lawyerInfo.memberId
    var data = { memberId: this.data.lawyerInfo.memberId}
    var success = data =>{
      data.data.map(item=>{
        if (this.data.type[this.data.index].requireTypeName == item.requireTypeName) {
          console.log(item.requireTypeName)
          this.setData({
            lawyerMoney: item.minAmount
          })
        }
      })
      console.log('qq', data, this.data.lawyerMoney, this.data.type[this.data.index].requireTypeName)
    }
    var fail = e =>{
      console.log(e)
    }
    wxrequest.request(url,data,success,fail)
  },
  // 律师单价
  // getLawyerMoney: function () {
  //   var url = api.getLawyerMoney() + this.data.lawyerInfo.memberId
  //   var success = data => {
  //     console.log('律师单价', data.data)
  //     this.setData({
  //       lawyerMoney: data.data
  //     })
  //   }
  //   var fail = e => {
  //     console.log(e)
  //   }
  //   wxrequest.requestGet(url, '', success, fail)
  // },
  //发布需求
  publish: function() {
    console.log(this.data.parameter.maxCost , this.data.lawyerMoney)
    var url = api.getPublish()
    var data = this.data.parameter
    var success = data => {
      wx.showToast({
        title: '发送成功',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 3
        })
      }, 1500)
    }
    var fail = e => {
      wx.showToast({
        title: e.message,
        icon: 'none'
      })
      console.log(e)
    }
    if (!this.data.parameter.requirementTypeId ){
    wx.showToast({
      title: '请选择服务类型',
      icon:'none'
    })
    } else if (!this.data.parameter.skillId){
      wx.showToast({
        title: '请选择擅长领域',
        icon:'none'
      })
    } else if (!this.data.parameter.maxCost) {
      wx.showToast({
        title: '请填写最高可承受费用',
        icon: 'none'
      })
    } else if (this.data.parameter.maxCost < this.data.lawyerMoney) {
      wx.showToast({
        title: '您的可承受费用低于律师的服务费用' +'('+ this.data.lawyerMoney+')',
        icon: 'none'
      })
    } else if (!this.data.parameter.requirementContent ) {
      wx.showToast({
        title: '请填写问题描述',
        icon: 'none'
      })
    }else{
      this.getMarkList()
      wxrequest.request(url, data, success, fail)
    }
  },
  //擅长领域
  getexpert: function() {
    var that = this
    var url = api.getExpert()
    var success = function(data) {
      that.setData({
        business: data.data[1].children
      })
    }
    var fail = function(e) {
      console.log("擅长领域", e)
    }
    wxrequest.requestGet(url, '', success, fail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getDemandType()
    this.setData({
      lawyerInfo: JSON.parse(options.lawyerDetail),
      ['parameter.isFirst']: 1,
      ['parameter.targetLawyerId']: JSON.parse(options.lawyerDetail).memberId
    })
    this.getexpert()
    // this.getLawyerMoney()
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

  }
})