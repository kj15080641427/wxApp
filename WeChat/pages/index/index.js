//index.js
//获取应用实例
const app = getApp()

// Page({
//   data: {
//     motto: 'Hello World',
//     userInfo: {},
//     hasUserInfo: false,
//     canIUse: wx.canIUse('button.open-type.getUserInfo')
//   },
//   //事件处理函数
//   bindViewTap: function() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onLoad: function () {
//     if (app.globalData.userInfo) {
//       this.setData({
//         userInfo: app.globalData.userInfo,
//         hasUserInfo: true
//       })
//     } else if (this.data.canIUse){
//       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//       // 所以此处加入 callback 以防止这种情况
//       app.userInfoReadyCallback = res => {
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     } else {
//       // 在没有 open-type=getUserInfo 版本的兼容处理
//       wx.getUserInfo({
//         success: res => {
//           app.globalData.userInfo = res.userInfo
//           this.setData({
//             userInfo: res.userInfo,
//             hasUserInfo: true
//           })
//         }
//       })
//     }
//   },
//   getUserInfo: function(e) {
//     console.log(e)
//     app.globalData.userInfo = e.detail.userInfo
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   }
// })
Page({
  data: {
    imgUrls: [
      'http://5b0988e595225.cdn.sohucs.com/images/20170906/58cdb24be3624488ad3e8d3d00b4585f.jpeg',
      'http://pic28.photophoto.cn/20130818/0020033143720852_b.jpg',
      'http://img.zcool.cn/community/014565554b3814000001bf7232251d.jpg@1280w_1l_2o_100sh.png'
    ],
    interval: 3000,
    duration: 1000,
    popular:[
      {text:"婚姻家事"},{text:"房产土地"},{text:"劳动用工"},{text:"公司工商"},{text:"债权债务"},
    ],
    lawyerIcon:[
      'http://5b0988e595225.cdn.sohucs.com/images/20170906/58cdb24be3624488ad3e8d3d00b4585f.jpeg',
      'http://pic28.photophoto.cn/20130818/0020033143720852_b.jpg',
      'http://img.zcool.cn/community/014565554b3814000001bf7232251d.jpg@1280w_1l_2o_100sh.png'
    ],
    articleName:"结婚证不在、能不能离婚、或补办?",
    helpNumber:10,
    more:false,
    choose:false
  },
  advisory:function(){
    wx.showActionSheet({
      itemList: ['热线咨询', '图文咨询'],
      success (res) {
        this.setData({
          choose:true
        })
        console.log(choose)
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
    console.log("咨询")
  },
  list:function(){
    var that = this
    console.log(that.data.popular[0].text)
  },
  loadMorePopular:function(){
    console.log('更多热门推荐')
  },
  loadMore:function(){
    console.log("加载更多")
  },
  test:function(){
    var that = this;
    // 显示加载图标
    console.log(that.data.more)
    that.setData({
      more:!that.data.more
    })
  },
  // onReachBottom: function () {
    // wx.showLoading({
    //   title: '加载中',
    // }),
    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 2000)
    // 页数+1
    // page = page + 1;
    // wx.request({
    //   url: 'https://xxx/?page=' + page,
    //   method: "GET",
    //   // 请求头部
    //   header: {
    //     'content-type': 'application/text'
    //   },
    //   success: function (res) {
    //     // 回调函数
    //     var moment_list = that.data.moment;
 
    //     for (var i = 0; i < res.data.data.length; i++) {
    //       moment_list.push(res.data.data[i]);
    //     }
    //     // 设置数据
    //     that.setData({
    //       moment: that.data.moment
    //     })
    //     // 隐藏加载框
    //     wx.hideLoading();
    //   }
    // })
    // console.log("加载更多")
  // },
})
