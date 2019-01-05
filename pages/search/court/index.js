// pages/search/court/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
var reg = require('../../../region.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiIndex: [0, 0],
    multiArray: '',
  },
  //法院列表
  getCourt: function () {
    var url = api.getCourt()
    var data = {
      keywords: '',
      regionId: '',
      pageNum: 1,
      pageSize: 10
    }
    var success = data => {
      console.log('法院列表', data)
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
  },
  hideRegion: function () {
    this.setData({
      hasaddress: false,
    })
  },
  //选择地区
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    console.log(e.detail.column)
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
  bindMultiPickerChange: function (e) {
    console.log(this.data.multiArray[0][e.detail.value[0]])
    console.log(this.data.multiArray[1][e.detail.value[1]])
    this.setData({
      ['changeInfo.regionId']: this.data.multiArray[1][e.detail.value[1]].regionId ? this.data.multiArray[1][e.detail.value[1]].regionId : this.data.multiArray[0][e.detail.value[0]].regionId
    })

    this.setData({
      multiIndex: e.detail.value,
      hasaddress: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCourt()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})