var wxrequest = require('../../../utils/request.js')
var api = require('../../../utils/api.js')
var reg = require('../../../region.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:1,
    array: [],
    hasSelect:true,
    hasSelectAddress:true,
    region: '',

    consultationTypeId:"",
    regionId:"",
    commitContent:"",
    isHide:1,

    multiIndex: [0,0],
    multiArray: ''
  },
  //地区

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
      multiIndex: this.data.multiIndex,
      hasSelectAddress: false,
    })

    // this.multiArray = this.data.multiArray;
    // this.multiIndex = this.data.multiIndex;
    // // 使用wepy开发，this.$apply()为脏数据检查
    // this.$apply();
  },
  bindMultiPickerChange: function (e) {
    // console.log(
    //   this.multiArray[0][e.detail.value[0]],
    //   this.multiArray[1][e.detail.value[1]]
    // ); // {value: "431000", label: "郴州市", level: 2}
    console.log(this.data.multiArray[0][e.detail.value[0]])
    console.log(this.data.multiArray[1][e.detail.value[1]])
    this.setData({
      regionId: this.data.multiArray[1][e.detail.value[1]].regionId ? this.data.multiArray[1][e.detail.value[1]].regionId : this.data.multiArray[0][e.detail.value[0]].regionId
    })

    this.setData({
      multiIndex: e.detail.value
    })
    // this.multiIndex = e.detail.value;
    // this.$apply();
  },


  // 匿名
  radioChange: function (e) {
    this.setData({
      isHide: !this.data.isHide
    })
  },
  // 选择问题
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      hasSelect:false,
    })
    this.setData({
      consultationTypeId: this.data.array[e.detail.value].id
    })
    console.log(this.data.consultationTypeId)
  },

 
  // input
  getInput:function(e){
    // console.log(e.detail.value)
    this.setData({
      commitContent: e.detail.value
    })
  },
  // 提交
  commit:function(){
    var that = this
    var commitURL = api.getCommitUrl()
    var data = {
      "consultationTypeId": that.data.consultationTypeId,
      "regionId": that.data.regionId, 
      "content": that.data.commitContent,
      "isHide": that.data.isHide == true ? '1':'0'
     }
    var success = function(data){
      that.setData({
        consultation:data
      })
    that.getOrder()
    console.log('成功')
      wx.showToast({
        title: '提交成功',
      })
      console.log(',.....',that.data.consultation)
    // setTimeout(function(){
    //   wx.navigateBack({
        
    //   })
    // },1000)
    }
    var fail = function(e){
      console.log(12312312312)
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
      wxrequest.request(commitURL, data, success, fail)
    }
  },
  //订单
  getOrder: function () {
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
      console.log("订单", data)
      wx.redirectTo({
        url: '/pages/index/consultation-details/index?orderDetail=' + JSON.stringify(that.data.order[0]) ,
      })
    }
    var fail = (e) => {
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
  },
  //解决方案类型  
  getArticleType:function(){
    var that = this
    var url = api.getArticleTypeUrl()
    var messagetype = ""
    var data = { "pageNum": 1, "pageSize": 100,"deviceInfoId":5 }
    var success = function (data) {
      wx.hideLoading()
      console.log("解决方案分类list", data.data)
      that.setData({
        array: data.data,
      })
      // that.getArticleList()
      // initIndex: data.data.list[0].id
    }
    var fail = function (e) {
      wx.hideLoading()
      console.log("解决方案错误", e)
    }
    wxrequest.requestPost(url, data, messagetype, success, fail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //选择地区
    var city = reg.citysData
    // this.multiArray = [[...city], [...city[0].children]];
    // this.$apply();
    this.setData({
      multiArray: [[...city], [...city[0].child]],
    })
    console.log(this.data.multiArray)


    this.getArticleType()
    console.log("问题类型",this.data.array)
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
    
  },
})