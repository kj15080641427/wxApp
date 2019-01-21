import wxrequest from '../../utils/request.js'
import api from '../../utils/api.js'
import hex_md5 from '../../jM/md5.js'
var app = getApp()
var jM = app.globalData.jMessage
Page({
  data: {
    current:0,
    content: 'demand',
    messageCount: 0,
    conversationList: [],
    orderList: [],
    pageNum: 1,
    articleIndex:0
  },
  //滑动
  swiper:function(e){
    this.setData({
      current:e.detail.current
    })
    console.log('currrrrrrrrr',this.data.current)
    if(e.detail.current==1){
      this.getSystem()
    }
  },
  //系统消息列表
  getSystem:function(){
    var url = api.getSystem()
    var success = (res)=>{
      console.log('系统消息',res)
      this.setData({
        sysMessage:res.data
      })
    }
    var fail = (e)=>{
      console.log(e)
    }
    wxrequest.requestGet(url,'',success,fail)
  },
  //未读消息
  getUnread:function(){
    var url = api.getUnread()
    var success = (res)=>{
      console.log('全部未读消息',res)
      this.setData({
        unread:res.data
      })
    }
    var fail = (e)=>{
      console.log(e)
    }
    wxrequest.requestGet(url,'',success,fail)
  },
  //更新某类消息为已读
  getAllread:function(){
    if (this.data.current==3){
      var type = 1
    } else if (this.data.current == 1){
      var type = 2
    } else {
      var type = 1
    }
    var url = api.getAllread()+type
    var success = (res)=>{
      console.log('readall',res)
    }
    var fail = (e)=>{
      console.log(e)
    }
    wxrequest.requestGet(url,'',success,fail)
  },
  //更新某条消息为已读
  getReadone:function(){
    var url = api.getReadone()
    var success = (res)=>{
      console.log('readone',res)
    }
    var fail = (e)=>{
      console.log(e)
    }
    wxrequest.requestGet(url,'',success,fail)
  },
  onLoad(options) {
    this.getUnread()
    this.checkLogin()
  },
  onReady() {},
  onShow() {
    if (!jM.isLogin()) {
      let that = this
      wx.showLoading({
        title: '加载中',
      })

      function getImConfigSuccess(res) {
        // console.log('res',res.data.appkey)
        //  初始化jmessager
        wx.setStorageSync('appkey', res.data.appkey)
        wx.setStorageSync('authorization', res.data.authorization)
        jM.init({
          "appkey": res.data.appkey,
          "random_str": res.data.random,
          "signature": res.data.signature,
          "timestamp": res.data.timestamp,
          "flag": 1
        }).onSuccess(function(data) {
          jM.login({
            'username': 'lex' + wx.getStorageSync('memberId'),
            'password': hex_md5(wx.getStorageSync('mobile'))
          }).onSuccess(function(lData) {
            // console.log(lData)
            jM.getConversation().onSuccess(function(data) {
              console.log(data)
              if (data.conversations && data.conversations.length > 0) {
                let arr = []
                that.getUserAvatarResource(0, data.conversations, data.conversations.length, arr)
              } else {
                wx.hideLoading()
              }
            }).onFail(function(data) {
              //data.code 返回码
              //data.message 描述
            });
            jM.onMsgReceive(function(msgRes) {
              jM.getConversation().onSuccess(function(data) {
                let arr = []
                that.getUserAvatarResource(0, data.conversations, data.conversations.length, arr)
              }).onFail(function(data) {
                // console.log(data)
                wx.hideLoading()
                //data.code 返回码
                //data.message 描述
              });
              that.setMessage(msgRes)
            });
            wx.hideLoading()
          }).onFail(function(data) {
            wx.hideLoading()
            // console.log(data.message)
            //同上
          })
        }).onFail(function(data) {
          wx.hideLoading()
          // console.log(data)
        });
        // console.log(app.globalData)
      }

      function getImConfigFail(res) {
        // console.log(res)
      }
      //  获取im的必须参数
      wxrequest.requestGet(api.getImConfig(), '', getImConfigSuccess, getImConfigFail)
    } else {
      let that = this
      wx.showLoading({
        title: '加载中',
      })
      jM.getConversation().onSuccess(function(data) {
        console.log(data)
        if (data.conversations && data.conversations.length > 0) {
          let arr = []
          that.getUserAvatarResource(0, data.conversations, data.conversations.length, arr)
        } else {
          wx.hideLoading()
        }
        jM.onMutiUnreadMsgUpdate(function(d) {
          console.log({
            'mutiUnread =============>': d
          })
        });
      }).onFail(function(data) {
        wx.hideLoading()
      });
      jM.onMsgReceiptChange(function(data) {
        console.log({
          'unread =>>>>>>>>>>': data
        })
        that.setData({
          messageCount: data.receipt_msgs[0].unread_count
        })
      });
      jM.onMsgReceive(function(msgRes) {
        jM.getConversation().onSuccess(function(data) {
          // console.log(data)
          let arr = []
          that.getUserAvatarResource(0, data.conversations, data.conversations.length, arr)
        }).onFail(function(data) {
          wx.hideLoading()
        });
        that.setMessage(msgRes)
      });
    }
  },
  getUserAvatarResource(i, arr, len, targetArr) {
    let that = this
    if (len > 0) {
      if (arr[i].avatar.indexOf('qiniu') != -1) {
        jM.getResource({
          'media_id': arr[i].avatar
        }).onSuccess(function(gRes) {
          let k = null
          k = arr[i]
          k.avatar = gRes.url
          targetArr.push(k)
          if (++i < len) {
            that.getUserAvatarResource(i, arr, len, targetArr)
          } else {
            that.setData({
              conversationList: targetArr
            }, function() {
              wx.hideLoading()
            })
          }
        }).onFail(function(data) {
          let k = null
          k = arr[i]
          k.avatar = ''
          targetArr.push(k)
          if (++i < len) {
            that.getUserAvatarResource(i, arr, len, targetArr)
          } else {
            that.setData({
              conversationList: targetArr
            }, function() {
              wx.hideLoading()
            })
          }
          // console.log('error:' + JSON.stringify(data));
        });
      } else {
        if (arr[i].avatar == '') {
          let k = null
          k = arr[i]
          k.avatar = '../../image/message/default-lawyer.png'
          targetArr.push(arr[i])
          if (++i < len) {
            that.getUserAvatarResource(i, arr, len, targetArr)
          } else {
            that.setData({
              conversationList: targetArr
            }, function() {
              wx.hideLoading()
            })
          }
        } else {
          targetArr.push(arr[i])
          if (++i < len) {
            that.getUserAvatarResource(i, arr, len, targetArr)
          } else {
            that.setData({
              conversationList: targetArr
            }, function() {
              wx.hideLoading()
            })
          }
        }
      }
    }
  },
  //  处理时间
  disposeTime(time) {
    if (time.toString().length == 10) {
      return time * 1000
    } else {
      return time
    }
  },
  setMessage(v) {
    let that = this
    let unReadMsgList = wx.getStorageSync('unReadMsgList') || []
    // console.log(unReadMsgList)
    let msg = v.messages[0]
    if (msg.content.msg_type == 'voice') {
      jM.getResource({
        'media_id': msg.msg_body.media_id
      }).onSuccess(function(gRes) {
        unReadMsgList.push({
          msg_id: msg.msg_id,
          from_id: msg.content.from_id,
          target_id: msg.content.target_id,
          msg_type: msg.content.msg_type,
          create_time: that.disposeTime(msg.content.create_time),
          duration: msg.content.msg_body.duration,
          content: gRes.url
        })
        wx.setStorageSync('unReadMsgList', unReadMsgList)
      }).onFail(function(data) {
        wx.hideLoading()
        // console.log('error:' + JSON.stringify(data));
      });
    } else if (msg.content.msg_type == 'text') {
      unReadMsgList.push({
        from_id: msg.content.from_id,
        msg_type: msg.content.msg_type,
        target_id: msg.content.target_id,
        content: msg.content.msg_body.text,
        create_time: that.disposeTime(msg.content.create_time),
        msg_id: msg.msg_id
      })
      wx.setStorageSync('unReadMsgList', unReadMsgList)
    }
  },
  checkLogin() {
    if (wx.getStorageSync('token') == '') {
      wx.navigateTo({
        url: '../userlogin/index',
        complete: function(res) {
          // console.log(res)
        }
      })
    }
  },
  switchTab(e) {
    this.setData({
      current: e.currentTarget.dataset.current
    })
    console.log('current',e.currentTarget.dataset.current)
    if (e.detail.current == 2) {
      this.getSystem()
    }
  },
  goChart(e) {
    let avatar = e.currentTarget.dataset.avatar.indexOf('../') == -1 ? e.currentTarget.dataset.avatar : '../' + e.currentTarget.dataset.avatar
    wx.setStorageSync('lawyer-avatar', avatar)
    wx.navigateTo({
      url: '../message/chart/index?name=' + e.currentTarget.dataset.name + '&userName=' + e.currentTarget.dataset.user + '&avatar=' + e.currentTarget.dataset.avatar,
      complete: function(res) {
        // console.log(res)
      }
    })
  },
  getOrderList(pageNum) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    let data = {
      memberId: wx.getStorageSync('memberId'),
      pageNum: pageNum,
      pageSize: 10
    }
    wxrequest.superRequest(api.getOrder(), data, 'POST').then(res => {
      // console.log(123)
      wx.hideLoading()
    }).catch(res => {
      // console.log(456)
    })
  },
  //  上拉加载
  loadData() {
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    this.getOrderList(this.data.pageNum + 1)
  }
})