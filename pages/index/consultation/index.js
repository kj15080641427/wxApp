var wxrequest = require('../../../utils/request.js')
var api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:1,
    array: ['婚姻家事', '房产土地', '债权债务', '公司工商'],
    hasSelect:true,
    hasSelectAddress:true,
    region: ["湖南省","长沙市","芙蓉区"],

    consultationTypeId:"",
    regionId:"",
    commitContent:"",
    isHide:1,
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
      consultationTypeId: Number(e.detail.value)+1
    })
    // console.log(e.detail.value)
  },
  // 选择地区
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      hasSelectAddress:false,
      regionId: e.detail.code[2]
    })
    // console.log(e.detail.code[2])
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
    var commitURL = api.getCommitUrl()
    var data = {
      "consultationTypeId": this.data.consultationTypeId,
      "regionId": this.data.regionId, 
      "content": this.data.commitContent,
      "isHide": this.data.isHide == true ? '1':'0'
     }
     console.log(data)
    var success = function(data){
      console.log(data)
      if(data.code == 0){
        console.log("提交成功")
        wx.showToast({
          title: '提交成功',
        })
      }else{
        console.log(data.message)
      }
    }
    var fail = function(e){
      console.log(e)
    }
    var cdata = this.data
    if (cdata.consultationTypeId != '' && cdata.region != '' && cdata.commitContent.length > 10){
    wxrequest.request(commitURL,data,success,fail)
    }else{
      wx.showToast({
        title: '不能为空',
        icon:'none'
      })
      console.log("不能为空")
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var typelist = []
    var type = wx.getStorageSync('typeName') 
    type.map(function(item){
      typelist.push(item.categoryName)
    })
    this.setData({
      array:typelist
    })
    // console.log(this.data.array)
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