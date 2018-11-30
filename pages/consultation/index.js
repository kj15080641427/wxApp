Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:true,
    array: ['婚姻家事', '房产土地', '债权债务', '公司工商'],
    hasSelect:true,
    hasSelectAddress:true,
    region: ["湖南省","长沙市","芙蓉区"],
    customItem: '全部'
  },
  radioChange: function (e) {
    this.setData({
      checked:!this.data.checked
    })
    console.log(this.data.checked)
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      hasSelect:false,
    })
  },
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      hasSelectAddress:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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