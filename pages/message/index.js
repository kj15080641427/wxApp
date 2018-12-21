
import wxrequest from '../../utils/request.js'
import api from '../../utils/api.js'
import hex_md5 from '../../jM/md5.js'
import wxPay from '../../utils/wxPay.js'
var app = getApp()
var jM = app.globalData.jMessage
Page({
    data: {
        messageCount: 10,
        conversationList: []
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
        if(!jM.isLogin()){
            let that = this
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
                        jM.onMsgReceive(function(data) {
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
            jM.getConversation().onSuccess(function(data) {
                that.setData({
                    conversationList: data.conversations
                })
            }).onFail(function(data) {
                console.log(data)
            });
            jM.onMsgReceive(function(data) {
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
            });
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
    /**
     * 初始化极光iM
     * @param {c} appkey 极光IM appkey
     * @param {*} random 随机数
     * @param {*} signature 签名
     * @param {*} timestamp 时间戳
     */
    jMInit(appkey,random,signature,timestamp) {
        let that = this
        jM.jmLogin().then(res => {
            jM.getJMConversation().then(cRes => {
                console.log(cRes)
                that.setData({
                    conversationList: cRes.conversations
                })
            })
            jM.listenMessage().then(lRes => {
                console.log(lRes)
                console.log(lRes.noCount)
                jM.getJMConversation().then(cRes => {
                    console.log(cRes)
                    that.setData({
                        conversationList: cRes.conversations
                    })
                })
                // jM.updateConversation(lRes.d.messages[0].from_appkey,lRes.d.messages[0].from_username,{})
                // let arr = that.data.conversationList
                // let checkArr = arr.filter(item => {
                //     return item.username == lRes.messages[0].from_username
                // })
                // if( checkArr.length == 0){
                //     arr.push({
                //         username:lRes.messages[0].from_username,
                //         unread_msg_count:lRes.messages[0].unread_msg_count
                //     })
                // }
                // jM.getJMUserInfo(lRes.messages[0].from_username)
                
            })
            wx.hideLoading()
        })
    },
    goChart(e) {
        wx.navigateTo({
            url: '../message/chart/index?name=' + e.currentTarget.dataset.name + '&userName=' + e.currentTarget.dataset.user + '&avatar=' + e.currentTarget.dataset.avatar,
            complete:function(res){
                console.log(res)
            }            
        })
    }
})