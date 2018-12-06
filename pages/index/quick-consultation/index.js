// pages/index/quick-consultation/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeName:['婚姻家庭'],
    selectType:true,
    payList: [
      { "icon":'../../../image/my_icon@3x/Rapidconsultation_icon_01_3x.png',"name":'微信支付',checked:true},
      { "icon": '../../../image/my_icon@3x/Rapidconsultation_icon_02_3x.png', "name": '账户余额' }
      ],
    selectProblem:'请选择问题类型',
    money:0,
    balance:10.5
  },
  // picker
  changeType:function(e){
    this.setData({
      index:e.detail.value,
      selectType:false,
      money: Number(e.detail.value)+100
    })
  },
  // 跳转
  gotofinish: function () {
    if (this.data.index) {
      wx.navigateTo({
        url: '../quick-consultation-finish/index',
      })
    } else {
      wx.showToast({
        title: '请选择问题类型',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var typeNameList = []
    var typeName = wx.getStorageSync('typeName') 
    typeName.map(function(item){
      typeNameList.push(item.categoryName)
    })
    this.setData({
      typeName: typeNameList
    })
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