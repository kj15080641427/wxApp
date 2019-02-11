// pages/search/lawyer-detail/index.js
var formatTime = require('../../../utils/util.js')
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
import wxPay from '../../../utils/wxPay.js'
var App = getApp()
var numCount = 6; //元素个数
var numSlot = 5; //一条线上的总节点数
var mW = 350; //Canvas的宽度
var mCenter = mW / 2;
var mAngle = Math.PI * 2 / numCount;
var mRadius = mCenter - 100; //半径(减去的值用于给绘制的文本留空间)
//获取指定的Canvas
var radCtx = wx.createCanvasContext("radarCanvas")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['基本信息', '服务价格', '活跃度', '诚信度', '社会资源', '诉讼经验'],
    // lawyerInfo: '',
    lawyerID: '',
    index: '',
    year: '',
    education: '',
    workExp: '',
    showMore: false, //展示更多简介
    isFollow: '', //是否已关注
    caseList: '', //案例
    isshowCard: true,
    isshowCase: false,
    time: 60,
    start: true,
    lawyerFirm: '',
    firstPage: false, //默认从此页面进入小程序
    tabindex: 0
  },
  //tab
  selectTab: function(e) {
    this.setData({
      tabindex: e.currentTarget.dataset.tabindex
    })
    let idx = e.currentTarget.dataset.tabindex
  },
  //返回
  tabBack: function() {
    wx.navigateBack({})
  },
  //预览头像
  showImage: function() {
    if (this.data.lawyerInfoV2.iconImage) {
      wx.previewImage({
        urls: [this.data.lawyerInfoV2.iconImage],
      })
    }
  },
  //预览背景图
  showBackgroundImage: function() {
    if (this.data.lawyerInfoV2.backgroundImage) {
      wx.previewImage({
        urls: [this.data.lawyerInfoV2.backgroundImage],
      })
    }
  },
  //组织
  toOrgId: function(e) {
    console.log(this.data.lawyerInfoV2.orgTags[e.currentTarget.dataset.orgindex].link)
    wx.setStorageSync('orgUrl', `${this.data.lawyerInfoV2.orgTags[e.currentTarget.dataset.orgindex].link}&memberId=${wx.getStorageSync('memberId')}&token=${wx.getStorageSync("token")}`)
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
    var url = api.getFollow() + that.data.lawyerID
    var data = that.data.lawyerID
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
    var url = api.getUnfollow() + that.data.lawyerID
    var data = that.data.lawyerID
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
    var url = api.getLawyerMoney() + this.data.lawyerID
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
  //获取律师信息V2
  getlawyerInfoV2: function() {
    wx.showLoading({
      
    })
    wxrequest.superRequest(api.getlawyerInfoV2() + this.data.lawyerID, this.data.lawyerID, "GET").then((res) => {
      this.setData({
        lawyerInfoV2: res.data.data,
        isFollow: res.data.data.isCollect, //是否已关注
        workExp: res.data.data.reliabilityInfo.workExp, //工作经验
        education: res.data.data.reliabilityInfo.education, //教育背景
      })
      this.getTime(res.data.data.reliabilityInfo.workExp, res.data.data.reliabilityInfo.education) //工作.教育 时间
      this.getCase()
      console.log('律师信息V2', this.data.lawyerInfoV2)
    }).then((res) => {
      wx.hideLoading()  //hide loading
      let scoreLawyer = []
      let scoreAvg = []
      this.data.lawyerInfoV2.baseInfo.businessRadar.map((item) => {
        scoreLawyer.push([
          item.businessTypeName, item.score * 100
        ])
        scoreAvg.push(['', item.avgScore * 100])
      })
      this.getRound() //圆环
      if (this.data.lawyerInfoV2.baseInfo.businessRadar[0]){
        this.drawRadar(scoreLawyer, scoreAvg) //雷达图
      }
    }).catch((e)=>{
      console.log(e)
      wx.hideLoading()
    })
  },
  //工作 教育时间
  getTime: function(workTime, educaTime) {
    let startWorkTimeList = []
    let endWorkTimeList = []
    let startEducaTimeList = []
    let endEducaTimeList = []
    workTime.map((item) => {
      startWorkTimeList.push(item.startDate.split(" ")[0])
      endWorkTimeList.push(item.endDate.split(" ")[0])
    })
    educaTime.map((item) => {
      startEducaTimeList.push(item.startDate.split(" ")[0])
      endEducaTimeList.push(item.endDate.split(" ")[0])
    })
    this.setData({
      startWorkList: startWorkTimeList,
      startEducaList: startEducaTimeList,
      endWorkList: endWorkTimeList,
      endEducaList: endEducaTimeList
    })
    console.log('shijian', startWorkTimeList, endWorkTimeList)
  },
  //获取律师服务价格
  // getlawyerPrice:function(){
  //   wxrequest.superRequest(api.getlawyerPrice()+this.data.lawyerID,this.data.lawyerID,"POST").then((res)=>{
  //     this.setData({
  //       servicePrice:res.data.data
  //     })
  //     console.log('律师服务价格',res)
  //   })
  // },
  /**
   * 圆环
   */
  getRound: function() {
    var that = this
    //获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          width: res.windowWidth
        })
        // console.log('设备信息', that.data.width)
        let dataF = that.data.lawyerInfoV2.evaluation
        that.showScoreAnimation(dataF.aspectLitigation.score, 100, 'canvasArc', that.data.width / 5 / 2, that.data.width / 5 / 2);
        that.showScoreAnimation(dataF.aspectNonLitigation.score, 100, 'canvasArc2', that.data.width / 5 / 2, that.data.width / 5 / 2);
        that.showScoreAnimation(dataF.aspectReliability.score, 100, 'canvasArc3', that.data.width / 5 / 2, that.data.width / 5 / 2);
        that.showScoreAnimation(dataF.aspectSocial.score, 100, 'canvasArc4', that.data.width / 5 / 2, that.data.width / 5 / 2);
        that.showScoreAnimation(dataF.aspectVitality.score, 100, 'canvasArc5', that.data.width / 5 / 2, that.data.width / 5 / 2);
      },
    })
  },
  //案例
  getCase: function() {
    var url = api.getCase()
    var data = {
      "memberId": this.data.lawyerInfoV2.memberId,
      "pageNum": '1',
      "pageSize": '10',
      'lawyerFirm': this.data.lawyerInfoV2.institutionName
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
    wx.setStorageSync('caseUrl', this.data.caseList[e.currentTarget.dataset.caseindex].url)
    wx.navigateTo({
      url: '../case-web/index',
    })
    // console.log(this.data.caseList[e.currentTarget.dataset.caseindex].url)
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
            wx.showToast({
              title: '发送成功',
            })
            setTimeout(() => {
              wx.navigateBack({})
            }, 2000)
          }
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
          url: '/pages/search/lawyer-demand/index?bussType=' + JSON.stringify(this.data.lawyerInfoV2.baseInfo.businessRadar) + "&money=" + this.data.lawyerMoney.lawyerPrice + "&memberId=" + this.data.lawyerInfoV2.memberId, //参数为 律师擅长领域 律师最低可承受费用,律师ID
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
          this.hideModal()
          // this.setData({
          //   time: 0
          // })
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
          hour: Math.round((balance / secondPrice + 15) / 60 / 60) > 1 ? Math.round((balance / secondPrice + 15) / 60 / 60) + '小时' : '',
          minute: Math.round((balance / secondPrice + 15) / 60 % 60) + '分',
          second: Math.round((balance / secondPrice + 15) % 60) + '秒'
        })
        // this.callPhone()
        this.showModal()
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
  //关闭弹窗
  closemodal: function () {
    if (this.data.time > 0) {
      this.setData({
        close: true,
        countDown: false
      })
    } else {
      this.hideModal()
    }
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
    // wx.showLoading({
    //   title:'正在联系律师',
    //   mask: true
    // })
    var url = api.getExpertPhone() + that.data.lawyerInfoV2.memberId
    var success = (res) => {
      console.log(res)
      this.setData({
        countDown: true,
        start: false
      })
      wx.hideLoading()
      this.downTime()
    }
    var fail = (e) => {
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
          navH: res.statusBarHeight + 40, //导航栏总高度 IOS
          tabH: res.statusBarHeight
        })
        if (res.model.indexOf("iPhone") == -1) {
          that.setData({
            navH: res.statusBarHeight + 48, //导航栏总高度 安卓
            tabH: res.statusBarHeight,
          })
        }
      },
    })
    if (options.scene) {
      console.log('options', options.scene)
      var sceneList = options.scene.split("-")
      if (sceneList.length == 2) {
        this.setData({
          lawyerID: sceneList[0],
          channel: sceneList[1],
          firstPage: true
        })
        App.globalData.device.channel = sceneList[1]
        console.log('channel', App.globalData.device.channel)
      } else {
        this.setData({
          lawyerID: sceneList[0],
          firstPage: true
        })
      }
    } else {
      this.setData({
        lawyerID: options.id,
        quick: options.quick ? true : false,
        parameter: options.parameter ? JSON.parse(options.parameter) : '',
        ['parameter.targetLawyerId']: options.id ? options.id : '',
        justDo: options.justDo ? options.justDo : '', //是否直接发送
        demandIndex: options.demandIndex ? options.demandIndex : '' //点击发布需求后按钮变灰
      })
    }
    this.getLawyerMoney() //律师价格
    this.getlawyerInfoV2() //最新律师信息V2
    // this.getlawyerPrice() //律师服务价格
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;
    let totalItems = 100;
    let rightItems = 90;
    let completePercent = parseInt((rightItems / totalItems) * 100);
  },
  showScoreAnimation: function(rightItems, totalItems, canvasArc, x, y) {
    /*
    cxt_arc.arc(x, y, r, sAngle, eAngle, counterclockwise);
    x	                    Number	  圆的x坐标
    y	                    Number	  圆的y坐标
    r	                    Number	  圆的半径
    sAngle	            Number	  起始弧度，单位弧度（在3点钟方向）
    eAngle	            Number	  终止弧度
    counterclockwise	    Boolean	  可选。指定弧度的方向是逆时针还是顺时针。默认是false，即顺时针。
    */
    let that = this;
    // 页面渲染完成
    // 这部分是灰色底层
    let cxt_arc = wx.createCanvasContext(canvasArc); //创建并返回绘图上下文context对象。
    cxt_arc.setLineWidth(3); //绘线的宽度
    cxt_arc.setStrokeStyle('#717171'); //绘线的颜色
    cxt_arc.setLineCap('round'); //线条端点样式
    cxt_arc.beginPath(); //开始一个新的路径
    cxt_arc.arc(x, y, 20, 0, 2 * Math.PI, false); //设置一个原点(x,y)，半径为25的圆的路径到当前路径
    cxt_arc.stroke(); //对当前路径进行描边
    //这部分是蓝色部分
    cxt_arc.setLineWidth(3);
    cxt_arc.setStrokeStyle('#ffffff');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath(); //开始一个新的路径
    cxt_arc.arc(x, y, 20, -Math.PI * 1 / 2, 2 * Math.PI * ((100 - rightItems) / totalItems) - Math.PI * 1 / 2, true);
    cxt_arc.stroke(); //对当前路径进行描边
    cxt_arc.draw();
  },

  // 雷达图
  drawRadar: function(sourceData1, sourceData2) {
    this.drawRegion2(sourceData2, '#caffd6') //平均值
    //调用
    this.drawEdge() //画六边形
    //this.drawArcEdge() //画圆
    this.drawLinePoint()
    //设置数据
    this.drawRegion(sourceData1, '#f8b62d') //律师
    //设置文本数据
    this.drawTextCans(sourceData1)
    //设置节点
    this.drawCircle(sourceData1, '#f8b62d')
    // this.drawCircle(sourceData2, '#caffd6')
    //开始绘制
    radCtx.draw()
  },
  // 绘制6条边
  drawEdge: function() {
    radCtx.setStrokeStyle("#b5b5b5")
    radCtx.setLineWidth(1) //设置线宽

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
      radCtx.stroke()
    }
  },
  // 绘制连接点
  drawLinePoint: function() {
    radCtx.beginPath();
    for (var k = 0; k < numCount; k++) {
      var x = mCenter + mRadius * Math.cos(mAngle * k);
      var y = mCenter + mRadius * Math.sin(mAngle * k);

      radCtx.moveTo(mCenter, mCenter);
      radCtx.lineTo(x, y);
    }
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
    radCtx.globalCompositionOperation = 'source-over'
    radCtx.closePath();
    radCtx.setFillStyle(color)
    radCtx.strokeStyle = '#f8b62d'
    radCtx.stroke();
  },
  //绘制数据区域(数据和填充颜色)
  drawRegion2: function(mData, color) {
    radCtx.beginPath();
    for (var m = 0; m < numCount; m++) {
      var x = mCenter + mRadius * Math.cos(mAngle * m) * mData[m][1] / 100;
      var y = mCenter + mRadius * Math.sin(mAngle * m) * mData[m][1] / 100;
      radCtx.lineTo(x, y);
    }
    radCtx.closePath();
    radCtx.setFillStyle(color)
    radCtx.fill();
  },

  //绘制文字
  drawTextCans: function(mData) {
    radCtx.setFillStyle("black")
    radCtx.font = '15px bold' //设置字体
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
  onShow: function() {},
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