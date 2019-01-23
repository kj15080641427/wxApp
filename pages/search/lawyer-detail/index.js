// pages/search/lawyer-detail/index.js
var formatTime = require('../../../utils/util.js')
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
import wxPay from '../../../utils/wxPay.js'
var App = getApp()


var numCount = 6; //元素个数
var numSlot = 5; //一条线上的总节点数
var mW = 400; //Canvas的宽度
var mCenter = mW / 2;
var mAngle = Math.PI * 2 / numCount;
var mRadius = mCenter - 60; //半径(减去的值用于给绘制的文本留空间)
//获取指定的Canvas
var radCtx = wx.createCanvasContext("radarCanvas")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    stepText: 5,
    chanelArray1: [
      ["", 88],
      ["", 30],
      ["", 66],
      ["", 90],
      ["", 95],
      ["", 88]
    ],
    chanelArray2: [
      ["", 24],
      ["", 60],
      ["", 88],
      ["", 49],
      ["", 46],
      ["", 92]
    ],
    lawyerInfo: '',
    lawyerList: '',
    index: '',
    year: '',
    education: '',
    work: '',
    address: '',
    age: '',
    lawyerCard: '',
    showMore: false, //展示更多简介
    isFollow: '', //是否已关注
    myFollow: '', //我的关注列表
    caseList: '', //案例
    isshowCard: true,
    isshowCase: false,
    time: 60,
    start: true,
    lawyerFirm: '',
    firstPage: false //默认从此页面进入小程序
  },
  //返回
  tabBack: function() {
    wx.navigateBack({

    })
  },
  //预览头像
  showImage: function() {
    if (this.data.lawyerCard.iconImage) {
      wx.previewImage({
        urls: [this.data.lawyerCard.iconImage],
      })
    }
  },
  //预览背景图
  showBackgroundImage: function() {
    if (this.data.lawyerCard.backgroundImage) {
      wx.previewImage({
        urls: [this.data.lawyerCard.backgroundImage],
      })
    }
  },
  //组织
  toOrgId: function(e) {
    console.log(this.data.lawyerCard.orgTags[e.currentTarget.dataset.orgindex].link)
    wx.setStorageSync('orgUrl', `${this.data.lawyerCard.orgTags[e.currentTarget.dataset.orgindex].link}&memberId=${wx.getStorageSync('memberId')}&token=${wx.getStorageSync("token")}`)
    wx.navigateTo({
      url: '/pages/search/orgweb-viewTwo/index',
    })
  },
  //回到首页
  toindex: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //关注
  follow: function() {
    var that = this
    var url = api.getFollow() + that.data.lawyerCard.memberId
    var data = that.data.lawyerCard.memberId
    var success = function(data) {
      that.setData({
        isFollow: true
      })
    }
    var fail = function(e) {
      wx.showToast({
        title: '关注失败',
        icon: 'none'
      })
      console.log(e)
    }
    if (wx.getStorageSync("token")) {
      wxrequest.requestGetpar(url, data, '', success, fail)
    } else {
      wx.navigateTo({
        url: '../../../../../../userlogin/index',
      })
    }
  },
  //取消关注
  unFollow: function() {
    var that = this
    var url = api.getUnfollow() + that.data.lawyerCard.memberId
    var data = that.data.lawyerCard.memberId
    var success = (data) => {
      that.setData({
        isFollow: false
      })
      wx.showToast({
        title: '已取消关注',
        icon: 'none'
      })
    }
    var fail = (e) => {
      wx.showToast({
        title: e.message,
        icon: 'none'
      })
    }

    wxrequest.requestGetpar(url, data, '', success, fail)
  },
  //小数
  getnumber: function(num) {
    num.map(function(item) {
      item.toFixed(2)
    })
  },
  //律师单价
  getLawyerMoney: function() {
    var url = api.getLawyerMoney() + this.data.lawyerList
    var success = data => {
      this.setData({
        lawyerMoney: data.data
      })
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.requestGet(url, '', success, fail)
  },
  //律师主页
  getlawyer: function(e) {
    var that = this
    var listIndex = that.data.index //index
    var year = that.data.year //执业年限
    var lawyerInfoUrl = api.getlawyerInfo() + that.data.lawyerCard.memberId
    var lawyerData = that.data.lawyerCard.memberId
    var success = function(data) {
      wx.hideLoading()
      that.setData({
        lawyerInfo: data.data
      })
      // console.log('Info',data.data)
      var scoreList = []
      that.data.lawyerInfo.businessType.map(item => {
        if (item.score >= 1) {
          scoreList.push((item.score * 100))
        } else {
          scoreList.push((item.score * 100).toFixed(2))
        }
      })
      that.setData({
        score: scoreList
      })
      that.ageAddress()
      that.court()
    }
    var fail = function(e) {
      wx.hideLoading()
      wx.showToast({
        title: '获取律师信息失败',
        icon: 'none'
      })
      console.log(e)
    }
    wxrequest.requestGetpar(lawyerInfoUrl, lawyerData, '', success, fail)
  },
  //搜索
  search: function() {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //律师主页 (背景图/所获荣誉/描述)
    var homeUrl = api.getLawHomePage() + that.data.lawyerList
    var homeData = that.data.lawyerList
    var homeSuccess = function(data) {
      that.setData({
        lawyerCard: data.data
      })
      // console.log('card',data.data)
      // that.getCase()
      that.getlawyer()
      that.getYear()
      wx.hideLoading()
    }
    var homeFail = function(e) {
      wx.hideLoading()
      console.log(e)
    }
    wxrequest.requestGetpar(homeUrl, homeData, '', homeSuccess, homeFail) //主页
  },
  //法院检察院
  court: function() {
    var courtList = []
    var procList = []
    console.log(this.data.lawyerInfo)
    this.data.lawyerInfo.institution.map(item => {
      if (item.indexOf('检察院') == -1) {
        courtList.push(item)
      } else {
        procList.push(item)
      }
    })
    this.setData({
      court: courtList,
      proc: procList
    })
  },
  //我的关注
  followList: function() {
    var that = this
    var url = api.getMyFollow()
    var data = {
      "pageNum": '1',
      "pageSize": '50'
    }
    var success = (data) => {
      data.data.list.map(function(item) {
        if (that.data.lawyerCard.memberId == item.memberId) {
          that.setData({
            isFollow: true,
          })
        }
      })
      // console.log('已关注列表',data.data.list, )
      // console.log( '关注id', that.data.lawyerCard.memberId)
    }
    var fail = e => {
      console.log(e)
    }
    wxrequest.request(url, data, success, fail)
  },
  // 简介加载更多
  showMore: function(e) {
    this.setData({
      showMore: !this.data.showMore
    })
    console.log(e)
  },
  //年龄地址
  ageAddress: function() {
    var that = this
    var td = that.data.lawyerInfo
    //教育信息
    var educationList = []
    td.education[0] ? td.education.map(function(item) {
      educationList.push({
        "startDate": item.startDate.split(" ")[0].split('-', 2).join("/"),
        "endDate": item.endDate.split(" ")[0].split('-', 2).join("/"),
        "educationTitle": item.educationTitle,
        "educationName": item.educationName
      })
    }) : ''
    //工作经历
    var workList = []
    td.workExp[0] ? td.workExp.map(function(item) {
      workList.push({
        "startDate": item.startDate.split(" ")[0].split('-', 2).join("/"),
        "endDate": item.endDate.split(" ")[0].split('-', 2).join("/"),
        "institutionName": item.institutionName,
        "positionName": item.positionName
      })
    }) : ''
    var now = formatTime.formatTime(new Date()).split('-')[0]
    var age = that.data.lawyerCard.birthday.split("-")[0]
    that.setData({
      education: educationList,
      work: workList,
      address: that.data.lawyerCard.region.split('-', 2),
      age: now - age
    })
  },
  //案例
  getCase: function() {
    var url = api.getCase()
    var data = {
      "memberId": this.data.lawyerCard.memberId,
      "pageNum": '1',
      "pageSize": '10',
      'lawyerFirm': this.data.lawyerCard.institutionName
    }
    var success = (data) => {
      this.setData({
        caseList: data.data.list
      })
    }
    var fail = (e) => {
      console.log("案例错误", e)
    }
    wxrequest.request(url, data, success, fail)
  },
  //案件h5
  gotoCase: function(e) {
    wx.navigateTo({
      url: '../case-web/index?url=' + this.data.caseList[e.currentTarget.dataset.caseindex].url,
    })
  },
  //显示名片
  showCard: function() {
    this.setData({
      isshowCard: true,
      isshowCase: false
    })
  },
  //显示案件展示
  showCase: function() {
    this.setData({
      isshowCard: false,
      isshowCase: true
    })
  },
  //执业年份
  getYear: function() {
    var that = this
    that.setData({
      year: formatTime.formatTime(new Date()).split("-")[0] - that.data.lawyerCard.beginPracticeDate.split("-")[0],
    })
  },
  //关闭弹窗
  closemodal: function() {
    if (this.data.time > 0) {
      this.setData({
        close: true,
        countDown: false
      })
    } else {
      this.hideModal()
    }
  },
  //发布需求
  toDemand: function() {
    if (!wx.getStorageSync("token")) { //是否登录
      wx.navigateTo({
        url: '/pages/userlogin/index',
      })
    } else {
      if (this.data.justDo) { //从律师服务进律师主页 直接发送需求  
        var url = api.getPublish()
        var data = this.data.parameter
        var success = data => {
          if (this.data.demandIndex) {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; //上一个页面
            //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
            prevPage.setData({
              [`isDemand[${this.data.demandIndex}]`]: true
            })
            setTimeout(() => {
              wx.navigateBack({})
            }, 1000)
          }
          wx.showToast({
            title: '发送成功',
            icon: 'none'
          })
        }
        var fail = e => {
          wx.showToast({
            title: e.message,
            icon: 'none'
          })
          console.log(e)
        }
        wxrequest.request(url, data, success, fail)
      } else { //律师主页发布需求页面
        wx.navigateTo({
          url: '/pages/search/lawyer-demand/index?lawyerDetail=' + JSON.stringify(this.data.lawyerInfo), //参数为 律师擅长领域 律师最低可承受费用,律师ID
        })
      }
    }
  },
  //充值
  gotoCharge: function() {
    wx.navigateTo({
      url: '../../../../../../my/balance/index?memberId=' + wx.getStorageSync("userInfo").memberId,
    })
  },
  //返回
  back: function() {
    this.setData({
      start: false,
      countDown: true,
      start: false,
    })
  },
  //支付
  goto: function() {
    var t = {
      money: 1,
      type: 3,
      product: 3,
      downTime: this.downTime(),
      countDown: this.setData({
        start: false,
        countDown: true,
        start: false,
      })
    }
    wxPay(t).then(res => { //支付成功
    }, (err => { //支付失败
      console.log("余额不足...", err, t.go)
    }))
  },
  //倒计时
  downTime: function() {
    this.setData({
      settime: setInterval(() => {
        this.setData({
          time: this.data.time - 1
        })
        if (this.data.time < 1) {
          clearInterval(this.data.settime)
          this.setData({
            time: 0
          })
        }
      }, 1000)
    })
  },
  //是否登录
  islogin: function() {
    if (!wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '/pages/userlogin/index',
      })
    }
  },
  //余额是否足够
  isEnough: function() {
    if (wx.getStorageSync('token')) {
      if (this.data.lawyerMoney.balance >= this.data.lawyerMoney.lawyerPrice / 60) {
        //每秒单价
        let secondPrice = this.data.lawyerMoney.lawyerPrice / 60 / 60
        let balance = this.data.lawyerMoney.balance
        this.setData({
          hour: Math.round((balance / secondPrice + 15) / 60 /60) > 1 ? Math.round((balance / secondPrice + 15) / 60 / 60) + '小时' : '',
          minute: Math.round((balance / secondPrice + 15) / 60 %60 ) + '分',
          second: Math.round((balance / secondPrice + 15)%60)  + '秒'
        })
        console.log(this.data.hour, secondPrice, balance)
        this.callPhone()
        // this.showModal()
      } else {
        wx.showToast({
          title: '最低通话时间为1分钟,当前余额不足,请先充值',
          icon: 'none'
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/userlogin/index',
      })
    }
  },
  //拨打电话
  callPhone: function() {
    wx.showModal({
      title: '联系律师',
      content: `律师咨询价格为${this.data.lawyerMoney.lawyerPrice}/元${this.data.lawyerMoney.priceUnit},我们将以秒为单位进行计费,前${this.data.lawyerMoney.freeTime}免费,当前可通话${this.data.hour}${this.data.minute}${this.data.second}`,
      confirmText: '拨打电话',
      success: (res) => {
        if (res.confirm) {
          this.quickConsultation()
          console.log('modal拨打电话')
        }
      }
    })
  },
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(200).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
    this.setData({
      countDown: false,
      start: true,
      isgo: false,
      close: false,
      time: 60
    })
    clearInterval(this.data.settime)
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
    // wx.showTabBar({})
  },
  //支付
  //专家服务
  quickConsultation: function() {
    var that = this
    wx.showLoading({
      title:'正在联系律师',
      mask: true
    })
    var url = api.getExpertPhone() + that.data.lawyerList
    var success = (res) => {
      console.log(res)
      // this.setData({
      //   countDown: true
      // })
      wx.hideLoading()
      this.downTime()
    }
    var fail = (e) => {
      // this.hideModal()
      wx.hideLoading()
      console.log(e)
    }
    wxrequest.requestGet(url, '', success, fail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          statuH: res.statusBarHeight,
          navH: res.statusBarHeight + 40 //导航栏总高度 IOS
        })
        if (res.model.indexOf("iPhone") == -1) {
          that.setData({
            navH: res.statusBarHeight + 48 //导航栏总高度 安卓
          })
        }
      },
    })
    if (options.scene) {
      console.log('options', options.scene)
      var sceneList = options.scene.split("-")
      if (sceneList.length == 2) {
        this.setData({
          lawyerList: sceneList[0],
          channel: sceneList[1],
          firstPage: true
        })
        App.globalData.device.channel = sceneList[1]
        console.log('channel', App.globalData.device.channel)
      } else {
        this.setData({
          lawyerList: sceneList[0],
          firstPage: true
        })
      }
    } else {
      this.setData({
        lawyerList: options.id,
        quick: options.quick ? true : false,
        parameter: options.parameter ? JSON.parse(options.parameter) : '',
        ['parameter.targetLawyerId']: options.id ? options.id : '',
        justDo: options.justDo ? options.justDo : '', //是否直接发送
        demandIndex: options.demandIndex ? options.demandIndex : '' //点击发布需求后按钮变灰
      })
    }
    this.search()
    this.getLawyerMoney()
    if (wx.getStorageSync('token')) {
      this.followList()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 雷达图
  drawRadar: function() {
    var sourceData1 = this.data.chanelArray1
    // var sourceData2 = this.data.chanelArray2

    //调用
    this.drawEdge() //画六边形
    //this.drawArcEdge() //画圆
    this.drawLinePoint()
    //设置数据
    this.drawRegion(sourceData1, 'rgba(255, 0, 0, 0.5)') //第一个人的
    // this.drawRegion(sourceData2, 'rgba(255, 200, 0, 0.5)') //第二个人
    //设置文本数据
    this.drawTextCans(sourceData1)
    //设置节点
    this.drawCircle(sourceData1, 'red')
    // this.drawCircle(sourceData2, 'yellow')
    //开始绘制
    radCtx.draw()
  },
  // 绘制6条边
  drawEdge: function() {
    radCtx.setStrokeStyle("white")
    radCtx.setLineWidth(2) //设置线宽
    for (var i = 0; i < numSlot; i++) {
      //计算半径
      radCtx.beginPath()
      var rdius = mRadius / numSlot * (i + 1)
      //画6条线段
      for (var j = 0; j < numCount; j++) {
        //坐标
        var x = mCenter + rdius * Math.cos(mAngle * j);
        var y = mCenter + rdius * Math.sin(mAngle * j);
        radCtx.lineTo(x, y);
      }
      radCtx.closePath()
      radCtx.strokeStyle = '#b5b5b5'
      radCtx.stroke()
    }
  },
  // 绘制连接点
  drawLinePoint: function() {
    radCtx.beginPath();
    // for (var k = 0; k < numCount; k++) {
    //   var x = mCenter + mRadius * Math.cos(mAngle * k);
    //   var y = mCenter + mRadius * Math.sin(mAngle * k);

    //   radCtx.moveTo(mCenter, mCenter);
    //   radCtx.lineTo(x, y);
    // }
    radCtx.stroke();
  },
  //绘制数据区域(数据和填充颜色)
  drawRegion: function(mData, color) {

    radCtx.beginPath();
    for (var m = 0; m < numCount; m++) {
      var x = mCenter + mRadius * Math.cos(mAngle * m) * mData[m][1] / 100;
      var y = mCenter + mRadius * Math.sin(mAngle * m) * mData[m][1] / 100;

      radCtx.lineTo(x, y);
    }
    radCtx.closePath();
    radCtx.setFillStyle(color)
    radCtx.strokeStyle = 'red'
    radCtx.stroke();
  },

  //绘制文字
  drawTextCans: function(mData) {

    radCtx.setFillStyle("white")
    radCtx.font = 'bold 17px cursive' //设置字体
    for (var n = 0; n < numCount; n++) {
      var x = mCenter + mRadius * Math.cos(mAngle * n);
      var y = mCenter + mRadius * Math.sin(mAngle * n);
      // radCtx.fillText(mData[n][0], x, y);
      //通过不同的位置，调整文本的显示位置
      if (mAngle * n >= 0 && mAngle * n <= Math.PI / 2) {
        radCtx.fillText(mData[n][0], x + 5, y + 5);
      } else if (mAngle * n > Math.PI / 2 && mAngle * n <= Math.PI) {
        radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width - 7, y + 5);
      } else if (mAngle * n > Math.PI && mAngle * n <= Math.PI * 3 / 2) {
        radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width - 5, y);
      } else {
        radCtx.fillText(mData[n][0], x + 7, y + 2);
      }

    }
  },
  //画点
  drawCircle: function(mData, color) {
    var r = 3; //设置节点小圆点的半径
    for (var i = 0; i < numCount; i++) {
      var x = mCenter + mRadius * Math.cos(mAngle * i) * mData[i][1] / 100;
      var y = mCenter + mRadius * Math.sin(mAngle * i) * mData[i][1] / 100;

      radCtx.beginPath();
      radCtx.arc(x, y, r, 0, Math.PI * 2);
      radCtx.fillStyle = color;
      radCtx.fill();
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    this.drawRadar()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.hideModal()
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