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
      console.log(data)
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
  },
  //擅长领域
  pickerBusiness: function(e) {
    this.setData({
      indexBus: e.detail.value,
      ['parameter.skillName']: this.data.lawyerInfo.businessType[e.detail.value].businessTypeName,
      ['parameter.skillId']: this.data.lawyerInfo.businessType[e.detail.value].businessTypeId
    })
    this.getMark()
  },
  //最高可承受费用
  getInput:function(e){
    this.setData({
      ['parameter.maxCost']:e.detail.value
    })
  },
  //问题内容
  getContent:function(e){
    this.setData({
      ['parameter.requirementContent']:e.detail.value
    })
  },
  //标签列表
  getMark: function() {
    var that = this
    var url = api.getMark() + that.data.lawyerInfo.businessType[that.data.indexBus].businessTypeId
    var data = {
      "businessTypeId": that.data.lawyerInfo.businessType[that.data.indexBus].businessTypeId
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
      console.log("问题标签", that.data.markList)
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
  getMarkList:function(){
    var that = this
    var tagIndexList = []
    var tagIdList = []
    var tagNameList = []
    if (this.data.selist[0]){
      this.data.selist.map(function (item, index) {
        if (item.is) {
          tagIndexList.push(index)
        }
      })
      tagIndexList.map(function (item) {
        tagIdList.push(that.data.markList[item].tagId)
        tagNameList.push(that.data.markList[item].tagName)
      })
      this.setData({
        ['parameter.tagId']: tagIdList,
        ['parameter.tagName']: tagNameList,
      })
    }
    console.log("已选择问题标签id", tagIdList)
    console.log("已选择问题标签name", tagNameList)
  },
  //发布需求
  publish: function() {
    this.getMarkList()
    var url = api.getPublish()
    var data = this.data.parameter
    var success = data => {
      wx.showToast({
        title: '发送成功',
        icon: 'none'
      })
      console.log(data)
    }
    var fail = e => {
      wx.showToast({
        title: e.message,
        icon:'none'
      })
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
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
    console.log("擅长领域", this.data.lawyerInfo)
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