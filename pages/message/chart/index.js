
// import jM from '../../../jM/index'
var wxformatTime = require('../../../utils/util')
var app = getApp()
var jM = app.globalData.jMessage
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
let timer = null
Page({
    data: {
        scrollTop: 0,
        userName: null,
        inputType: 'text',
        recordBtnText: '按住 说话',
        focus: false,
        showBar: false,
        inputValue: '',
        vaule: '',
        messageList: [],
        delayMessages: [],
        lawyer_avatar: null,
        my_avatar: wx.getStorageInfoSync('userInfo').iconImage
    },
    onLoad(option) {
        wx.setNavigationBarTitle({
            title: option.name
        })
        this.setData({
            userName: option.userName,
            lawyer_avatar: option.avatar
        })
    },
    onShow(){
        jM.resetUnreadCount({'username' : this.data.userName});        
        let that = this
        that.getHistoryMessage(that.data.userName)
        jM.onMsgReceive(function(lRes) {
            console.log(lRes)
            let arr = that.data.messageList
            // arr.push(lRes.messages[0].content)
            // that.setData({
            //     messageList: arr,
            //     delayMessages: arr
            // },function(){
            //     that.pageScroll(that)
            // })
            if(lRes.messages[0].content.msg_type == "voice"){
                jM.getResource({
                    'media_id': lRes.messages[0].content.msg_body.media_id
                }).onSuccess(function (gRes) {
                    arr.push({
                        from_id: lRes.messages[0].content.from_id,
                        msg_type: lRes.messages[0].content.msg_type,
                        duration: lRes.messages[0].content.msg_body.duration,
                        content: gRes.url
                    })
                    that.setData({
                        messageList: arr
                    },function(){
                        that.pageScroll(that)
                        // jM.resetConversationCount(userName)
                    })
                }).onFail(function (data) {
                    console.log('error:' + JSON.stringify(data));
                });
            }else{
                arr.push({
                    from_id: lRes.messages[0].content.from_id,
                    msg_type: lRes.messages[0].content.msg_type,
                    content: lRes.messages[0].content.msg_body.text
                })
                that.setData({
                    messageList: arr
                },function(){
                    that.pageScroll(that)
                    // jM.resetConversationCount(userName)
                })
            }
        });
    },
    onUnload(){
        //  页面关闭时停止播放语音
        innerAudioContext.stop()
        innerAudioContext.destroy()
    },
    getHistoryMessage(userName) {
        let that = this
        let now = new Date()
        let date = new Date(now)
        let beginTime = date.setDate(date.getDate()-7)
        console.log(wxformatTime.fTime(now))
        console.log(wxformatTime.fTime(beginTime))
        wx.request({
            url: encodeURI('https://report.im.jpush.cn/v2/users/lex'+wx.getStorageSync('memberId')+'/messages?count=500&begin_time='+wxformatTime.fTime(beginTime)+'&end_time='+wxformatTime.fTime(now)),
            header: { 'Authorization': 'Basic NTdlYzIzM2U0ODE1ZjExMjM1YjMyMzk1OmIyMWY2YzYzOGU3MzIwYjE0YTVhMTQ2OQ==' },
            method: 'get',
            success(res){
                console.log(res.data.messages)
                console.log(userName)
                let arr = []
                res.data.messages.forEach(item => {
                    if(item.from_id == userName){
                        if(item.msg_type == "voice"){
                            jM.getResource({
                                'media_id': item.msg_body.media_id
                            }).onSuccess(function (gRes) {
                                arr.push({
                                    from_id: item.from_id,
                                    msg_type: item.msg_type,
                                    duration: item.msg_body.duration,
                                    content: gRes.url
                                })
                                that.setData({
                                    messageList: arr
                                },function(){
                                    console.log(that.data.messageList)
                                    that.pageScroll(that)
                                    // jM.resetConversationCount(userName)
                                })
                            }).onFail(function (data) {
                                console.log('error:' + JSON.stringify(data));
                            });
                        }else{
                            arr.push({
                                from_id: item.from_id,
                                msg_type: item.msg_type,
                                content: item.msg_body.text
                            })
                            that.setData({
                                messageList: arr
                            },function(){
                                console.log(that.data.messageList)
                                that.pageScroll(that)
                                // jM.resetConversationCount(userName)
                            })
                        }
                    }
                })
            }
        })
    },
    textareaOnFocus(e) {
        console.log(e.detail.height)
        wx.pageScrollTo({
            scrollTop: e.detail.height
        })
    },
    //  发送文字消息
    confirmSendText(e) {
        console.log(e.detail.value.textarea)
        //  发消息
        let that = this
        that.setData({
            value: e.detail.value.textarea
        })
        jM.sendSingleMsg({
            'target_username' : this.data.userName,
            'content' : e.detail.value.textarea,
            'no_offline' : true
        }).onSuccess(function(data,msg) {
            console.log(data)
            console.log(msg)
            let arr = that.data.messageList
            arr.push(msg.content)
            // jM.addSingleReceiptReport({
            //     'username' : lRes.messages[0].content.from_id,
            //     'msg_ids' : [lRes.messages[0].msg_id]
            // }).onSuccess(function(data,msg_ids){
            //     jM.onSyncMsgReceipt()
            //     // data.code 返回码
            //     // data.appkey 目标 appkey
            //     // data.username 目标 username
            //     // msg_ids 消息数组
            // }).onFail(function(){

            // })
            that.setData({
                inputValue: '',
                messageList: arr,
            },function(){
                that.pageScroll(that)
            })
        }).onFail(function(data) {
            //data.code 返回码
            //data.message 描述
        })
        // jM.sendMessage(this.data.userName, e.detail.value).then( msg => {
        //     console.log(msg)
        //     let arr = that.data.messageList
        //     arr.push(msg.content)
        //     that.setData({
        //         inputValue: '',
        //         messageList: arr,
        //     },function(){
        //         that.pageScroll(that)
        //     })
        // })
    },

    //  发送语音消息
    sendSingleFile(file){
        let fd = new FormData();
        fd.append('audio', file)

        jM.sendSingleFile({
            'target_username' : userName,
            'file' : file,
            'appkey' : wx.getStorageSync('appkey')
        }).onSuccess(function(data , msg) {
            console.log(msg)
            let arr = that.data.messageList
            arr.push(msg.content)
            that.setData({
                inputValue: '',
                messageList: arr,
            },function(){
                that.pageScroll(that)
            })
            //data.code 返回码
            //data.message 描述
            //data.msg_id 发送成功后的消息id
            //data.ctime_ms 消息生成时间,毫秒
            //data.appkey 用户所属 appkey
            //data.target_username 用户名
            //msg.content 发送成功消息体
        }).onFail(function(data) {
            //同发送单聊文本
        });
    },

    //  页面滚动
    pageScroll(that) {
        // let that = this
        // 获取容器高度，使页面滚动到容器底部
        wx.createSelectorQuery().select('#chart-content').boundingClientRect(function(rect){
        // 使页面滚动到底部
        that.setData({
            scrollTop: rect.height
        })
        }).exec()
    },

    changeInputType() {
        if (this.data.inputType == 'text') {
            this.setData({
                inputType: 'record'
            })
        } else {
            this.setData({
                inputType: 'text',
                focus: true
            })
        }
    },

    recordTouchStart(){
        let that = this
        wx.showToast({
            duration: 60000,
            image: '../../../image/message/Recording-0.gif',
        })
        recorderManager.start()
        
        //  60秒自动结束录音
        timer = setTimeout(function(){
            recorderManager.stop()
            recorderManager.onStop((res) => {
                clearTimeout(timer)
                console.log(res.duration)
                that.sendSingleFile(res.tempFilePath)
            })
        },60000)
    },
    recordTouchMove(){

    },
    recordTouchEnd(){
        wx.hideToast()
        recorderManager.stop()
        recorderManager.onStop((res) => {
            clearTimeout(timer)
            console.log('recorder stop', res)
            const { tempFilePath } = res
        })
    },
    //  播放语音
    playAudio(e){
        console.log(e)
        innerAudioContext.autoplay = true
        innerAudioContext.obeyMuteSwitch = false
        innerAudioContext.play()
        innerAudioContext.src = e.currentTarget.dataset.src
        innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
        innerAudioContext.onEnded(() => {
            console.log('播放完毕')
        })
        innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        }) 
    }
})