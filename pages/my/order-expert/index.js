// pages/my/order-expert/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hour:'00',
    minute:'00',
    second:'00'
  },
  callTime:function(){
    if (this.data.expert.beginTime) {
      let beginAllTime = this.data.expert.beginTime.split(" ") //开始时间
      let endAllTime = this.data.expert.endTime.split(" ") //结束时间

      let beginHour = beginAllTime[1].split(":")[0] //开始hour
      let endHour = endAllTime[1].split(":")[0] //结束hour
      let beginMinute = beginAllTime[1].split(":")[1] //开始minute
      let endMinute = endAllTime[1].split(":")[1] //结束minute
      let beginSecond = beginAllTime[1].split(":")[2] //开始second
      let endSecond = endAllTime[1].split(":")[2] //结束second
      console.log(beginSecond, endSecond)
      //秒数
      if (endSecond - beginSecond < 0) { //计算秒数  结束秒数小于开始秒数 秒数+60 分钟-1  1-20
        endSecond = Number(endSecond) + 60
        endMinute = endMinute - 1
        if (endSecond - beginSecond > 9) {
          this.setData({
            second: endSecond - beginSecond
          })
        } else { // 补0
          this.setData({
            second: '0' + (endSecond - beginSecond).toString()
          })
        }
      } else {
        if (endSecond - beginSecond > 9) {
          this.setData({
            second: endSecond - beginSecond
          })
        } else {
          this.setData({
            second: '0' + (endSecond - beginSecond).toString()
          })
        }
      }
      //分钟
      if (endMinute - beginMinute > 0) {
        if (endMinute - beginMinute > 9) {
          this.setData({
            minute: endMinute - beginMinute
          })
        } else {
          this.setData({
            minute: '0' + (endMinute - beginMinute).toString()
          })
        }
      } else {
        endMinute = endMinute + 60
        endHour = endHour - 1
        if (endMinute - beginMinute > 9) {
          this.setData({
            minute: endMinute - beginMinute
          })
        } else {
          this.setData({
            minute: '0' + (endMinute - beginMinute).toString()
          })
        }
      }
      //小时
      if (endHour - beginHour > 9) {
        this.setData({
          hour: endHour - beginHour
        })
      } else {
        this.setData({
          hour: '0' + (endHour - beginHour).toString()
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      expert: JSON.parse(options.orderDetail)
    })
    this.callTime()
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