
import wxrequest from '../../utils/request.js'
import api from '../../utils/api.js'
import hex_md5 from '../../jM/md5.js'
import wxPay from '../../utils/wxPay.js'
var app = getApp()
var jM = app.globalData.jMessage
Page({
    data: {
        content: 'demand',
        messageCount: 0,
        conversationList: [],
        orderList: [],
        pageNum: 1
    },

    onLoad(options) {
        wx.showLoading({
          title: '加载中',
        })
        this.checkLogin() 
    },
    onReady() {
        // wxPay(1)
    },
    onShow() {
        // this.getOrderList(1)
        if(!jM.isLogin()){
            let that = this
            wx.showLoading({
                title: '加载中',
            })
            function getImConfigSuccess (res) {
                //  初始化jmessage
                wx.setStorageSync('appkey', res.data.appkey)
                // jM.init(res.data.appkey, res.data.random, res.data.signature, res.data.timestamp)
                // jM.init(res.data.appkey, res.data.random, res.data.signature, res.data.timestamp).then(iRes => {that.jMInit()})
                jM.init({
                    "appkey"    : res.data.appkey,
                    "random_str": res.data.random,
                    "signature" : res.data.signature,
                    "timestamp" : res.data.timestamp,
                    "flag": 1
                }).onSuccess(function(data) {
                    jM.login({
                        'username' : 'lex' + wx.getStorageSync('memberId'),
                        'password' : hex_md5(wx.getStorageSync('mobile'))
                    }).onSuccess(function(data) {
                        jM.getConversation().onSuccess(function(data) {
                            that.setData({
                                conversationList: data.conversations
                            },function () {
                                wx.hideLoading()
                             })
                          //缓存conversationList
                          // wx.setStorageSybc("conversationList",data.conversations)
                            //data.code 返回码
                            //data.message 描述
                            //data.conversations[] 会话列表，属性如下示例
                            //data.conversations[0].extras 附加字段
                            //data.conversations[0].unread_msg_count 消息未读数
                            //data.conversations[0].name  会话名称
                            //data.conversations[0].appkey  appkey(单聊)
                            //data.conversations[0].username  用户名(单聊)
                            //data.conversations[0].nickname  用户昵称(单聊)
                            //data.conversations[0].avatar  头像 media_id 
                            //data.conversations[0].mtime 会话最后的消息时间戳
                            //data.conversations[0].gid 群 id(群聊)
                            //data.conversations[0].type  会话类型(3 代表单聊会话类型，4 代表群聊会话类型)
                        }).onFail(function(data) {
                            console.log(data)
                            //data.code 返回码
                            //data.message 描述
                        });
                        jM.onMsgReceive(function(msgRes) {
                            jM.getConversation().onSuccess(function(data) {
                                console.log(data)
                                that.setData({
                                    conversationList: data.conversations
                                })
                                //data.code 返回码
                                //data.message 描述
                                //data.conversations[] 会话列表，属性如下示例
                                //data.conversations[0].extras 附加字段
                                //data.conversations[0].unread_msg_count 消息未读数
                                //data.conversations[0].name  会话名称
                                //data.conversations[0].appkey  appkey(单聊)
                                //data.conversations[0].username  用户名(单聊)
                                //data.conversations[0].nickname  用户昵称(单聊)
                                //data.conversations[0].avatar  头像 media_id 
                                //data.conversations[0].mtime 会话最后的消息时间戳
                                //data.conversations[0].gid 群 id(群聊)
                                //data.conversations[0].type  会话类型(3 代表单聊会话类型，4 代表群聊会话类型)
                            }).onFail(function(data) {
                                console.log(data)
                                //data.code 返回码
                                //data.message 描述
                            });
                            that.setMessage(msgRes)
                        });
                        wx.hideLoading()
                    }).onFail(function(data){
                        console.log(data.message)
                        //同上
                    })
                }).onFail(function(data) {
                    console.log(data)
                }); 
                console.log(app.globalData)
            }
            function getImConfigFail (res) {
                console.log(res)
            }
            //  获取im的必须参数
            wxrequest.requestGet(api.getImConfig(),'',getImConfigSuccess,getImConfigFail)
        } else {
            let that = this
            wx.showLoading({
                title: '加载中',
            })
            jM.getConversation().onSuccess(function(data) {
                console.log(data)
                that.setData({
                    conversationList: data.conversations
                },function(){
                    wx.hideLoading()
                })
            }).onFail(function(data) {
                console.log(data)
            });
            jM.onMsgReceiptChange(function(data) {
                console.log(data)
                that.setData({
                    messageCount: data.receipt_msgs[0].unread_count
                })
                // data.type
                // data.gid
                // data.appkey
                // data.username
                // data.receipt_msgs[].msg_id
                // data.receipt_msgs[].unread_count
            });
            jM.onMsgReceive(function(msgRes) {
                jM.getConversation().onSuccess(function(data) {
                    console.log(data)
                    that.setData({
                        conversationList: data.conversations
                    },function () { console.log(that.data.conversationList) })
                    //data.code 返回码
                    //data.message 描述
                    //data.conversations[] 会话列表，属性如下示例
                    //data.conversations[0].extras 附加字段
                    //data.conversations[0].unread_msg_count 消息未读数
                    //data.conversations[0].name  会话名称
                    //data.conversations[0].appkey  appkey(单聊)
                    //data.conversations[0].username  用户名(单聊)
                    //data.conversations[0].nickname  用户昵称(单聊)
                    //data.conversations[0].avatar  头像 media_id 
                    //data.conversations[0].mtime 会话最后的消息时间戳
                    //data.conversations[0].gid 群 id(群聊)
                    //data.conversations[0].type  会话类型(3 代表单聊会话类型，4 代表群聊会话类型)
                }).onFail(function(data) {
                    console.log(data)
                    //data.code 返回码
                    //data.message 描述
                });
                console.log(msgRes)
                that.setMessage(msgRes)
            });
        }
    },
    setMessage(v){
        let unReadMsgList = wx.getStorageSync('unReadMsgList') || []
        console.log(unReadMsgList)
        let msg = v.messages[0]
        if(msg.content.msg_type == 'voice'){
            jM.getResource({
                'media_id': msg.msg_body.media_id
            }).onSuccess(function (gRes) {
                unReadMsgList.push({
                    msg_id: msg.msg_id,
                    from_id: msg.content.from_id,
                    msg_type: msg.content.msg_type,
                    duration: msg.content.msg_body.duration,
                    content: gRes.url
                })
                wx.setStorageSync('unReadMsgList', unReadMsgList)
            }).onFail(function (data) {
                console.log('error:' + JSON.stringify(data));
            });
        } else if(msg.content.msg_type == 'text'){
            unReadMsgList.push({
                from_id: msg.content.from_id,
                msg_type: msg.content.msg_type,
                content: msg.content.msg_body.text,
                msg_id: msg.msg_id
            })
            wx.setStorageSync('unReadMsgList', unReadMsgList)
        }
    },
    checkLogin() {
        if (wx.getStorageSync('token') == '') {
            wx.navigateTo({
                url: '../userlogin/index',
                complete:function(res){
                    console.log(res)
                }            
            })
        }
    },
    switchTab(e) {
        this.setData({
            content: e.currentTarget.dataset.content
        })
    },
    goChart(e) {
        wx.navigateTo({
            url: '../message/chart/index?name=' + e.currentTarget.dataset.name + '&userName=' + e.currentTarget.dataset.user + '&avatar=' + e.currentTarget.dataset.avatar,
            complete:function(res){
                console.log(res)
            }            
        })
    },
    getOrderList(pageNum){
        let that = this
        wx.showLoading({
            title: '加载中',
        })
        let data = { memberId: wx.getStorageSync('memberId'), pageNum: pageNum, pageSize: 10}
        wxrequest.superRequest(api.getOrder(), data, 'POST').then(res => {
            console.log(123)
            wx.hideLoading()
        }).catch(res => {
            console.log(456)
        })
    },
    //  上拉加载
    loadData(){
        this.setData({
            pageNum: this.data.pageNum + 1
        })
        this.getOrderList(this.data.pageNum + 1)
    }
})