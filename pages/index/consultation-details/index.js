var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
var formatTime = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    answer:""
  },
  // 删除已发布咨询
  deleteInfo:function(){
    wx.showModal({
      title: '删除已发布的咨询?',
      cancelColor:"#717171",
      confirmColor:"#1ec88c",
      // content: '11'
      success:function(){
        console.log("确定")
      },
      fail:function(){
        console.log("取消")
      }
    })
  },
  //文字咨询列表
  getFreetextList:function(){
    var url = api.getFreetextList() +this.data.id+'/reply/1/10'
    var data = { "consultationId": this.data.id, "pageNum": '1',"pageSize":'10'}
    var success = data =>{
      this.setData({
        freeTextList:data.data.list
      })
      this.lawTime()
      console.log("文字咨询列表",data)
      this.getFreeText()
    }
    var fail = e =>{
      console.log("文字咨询列表错误",e)
    }
    wxrequest.requestGetpar(url,data,'',success,fail)
  },
  //文字咨询回复详情
  getFreeText:function(){
    var url = api.getFreeText() + this.data.id + '/' + this.data.freeTextList[1].lawyerId +'/reply/detail/1/10'
    var data = { "consultationId": this.data.id, "lawyerId": this.data.freeTextList[1].lawyerId, "pageNum": 1,"pageSize":10}
    var success = data =>{
      this.setData({
        freeText:data.data
      })
      console.log("文字咨询回复详情",data)
    }
    var fail = e =>{
      console.log("文字咨询回复详情", e)
    }
    wxrequest.requestGetpar(url,data,'',success,fail)
  },
  //文字咨询详情
  // getReply:function(){
  //   var url = api.getFreeText()
  //   var data = {}
  //   var success = data =>{
  //     console.log(data)
  //   }
  //   var fail = e =>{
  //     console.log(e)
  //   }
  //   wxrequest.request(url,data,success,fail)
  // },
  // 回复
  gotoReply:function(e){
    wx.navigateTo({
      url: '../consultation-reply/index?lawtList=' + this.data.lawtList[e.currentTarget.dataset.freeindex] + '&lawago=' + this.data.lawago[e.currentTarget.dataset.freeindex] + '&lawagoText=' + this.data.lawagoText[e.currentTarget.dataset.freeindex] ,
    })
    wx.setStorageSync("freeTextList", this.data.freeTextList[e.currentTarget.dataset.freeindex])
    console.log(e)
  },
  //律师回复时间
  lawTime:function(){
    //律师回复时间
    var that = this
    var dateList = []
    var lawTimeList = []
    var lawgaoList = []
    var lawagoTextList = []
    that.data.freeTextList.map(item=>{
      dateList.push(item.dateAdded)
      lawTimeList.push(item.dateAdded.split(" ")[1].split(":",2).join(":"))
    })
    that.setData({
      lawtList: lawTimeList
    })
    console.log("律师回复时间time", lawTimeList)
    dateList.map(item=>{
      var lawnowYear = formatTime.formatTime(new Date()).split(" ")[0].split("/")
    var lawyear = item.split(" ")[0].split("-")
    var lawnowYearTime = formatTime.formatTime(new Date()).split(" ")[1].split("/")
    var lawyearTime = item.split(" ")[1].split("-")
    if (lawnowYear[0] - lawyear[0] > 0) {
      lawgaoList.push(lawnowYear[0] - lawyear[0])
      lawagoTextList.push('年')
      that.setData({
        lawago: lawgaoList,
        lawagoText: lawagoTextList
      })
    } else if (lawnowYear[1] - lawyear[1] > 0) {
      lawgaoList.push(lawnowYear[1] - lawyear[1])
      lawagoTextList.push('月')
      that.setData({
        lawago: lawgaoList,
        lawagoText: lawagoTextList
      })
    } else if (lawnowYear[2] - lawyear[2] > 0) {
      lawgaoList.push(lawnowYear[2] - lawyear[2])
      lawagoTextList.push('天')
      that.setData({
        lawago: lawgaoList,
        lawagoText: lawagoTextList
      })
    } else if (lawnowYearTime[0] - lawyearTime[0] > 0) {
      lawgaoList.push(lawnowYearTime[0] - lawyearTime[0])
      lawagoTextList.push('小时')
      that.setData({
        lawago: lawgaoList,
        lawagoText: lawagoTextList
      })
    } else if (lawnowYearTime[1] - lawyearTime[1] > 5) {
      lawgaoList.push(lawnowYearTime[1] - lawyearTime[1])
      lawagoTextList.push('分钟')
      that.setData({
        lawago: lawgaoList,
        lawagoText: lawagoTextList
      })
    } else {
      lawgaoList.push('刚')
      lawagoTextList.push('刚')
      that.setData({
        lawago: lawgaoList,
        lawagoText: lawagoTextList
      })
    }
    })
    console.log('律师回复时间', dateList)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: JSON.parse(options.orderDetail).id,
      orderDetail: JSON.parse(options.orderDetail),
      userInfo: wx.getStorageSync("userInfo"),
      time: JSON.parse(options.orderDetail).createDate.split(" ")[1].split(":",2).join(":")
    })
    wx.setStorageSync('consultationId', JSON.parse(options.orderDetail).id )
    var nowYear = formatTime.formatTime(new Date()).split(" ")[0].split("/")
    var year = this.data.orderDetail.createDate.split(" ")[0].split("-")
    var nowYearTime = formatTime.formatTime(new Date()).split(" ")[1].split("/")
    var yearTime = this.data.orderDetail.createDate.split(" ")[1].split("-")
    if (nowYear[0]-year[0]>0){
      this.setData({
        ago: nowYear[0] - year[0],
        agoText:'年'
      })
    } else if (nowYear[1] - year[1] > 0){
      this.setData({
        ago: nowYear[1] - year[1],
        agoText:'月'
      })
    } else if (nowYear[2] - year[2] > 0){
      this.setData({
        ago: nowYear[2] - year[2],
        agoText: '天'
      })
    }else if(nowYearTime[0]-yearTime[0]>0){
      this.setData({
        ago: nowYearTime[0] - yearTime[0],
        agoText: '小时'
      })
    } else if (nowYearTime[1] - yearTime[1] > 5  ) {
      this.setData({
        ago: nowYearTime[1] - yearTime[1],
        agoText: '分钟'
      })
    }else{
      this.setData({
        ago:'刚',
        agoText: '刚'
      })
    }
    this.getFreetextList()
    // this.getFreetextList()
    // this.getReply()
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