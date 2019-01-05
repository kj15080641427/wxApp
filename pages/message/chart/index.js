// import jM from '../../../jM/index'
var wxformatTime = require('../../../utils/util')
import wxrequest from '../../../utils/request.js'
import api from '../../../utils/api.js'
var app = getApp()
var jM = app.globalData.jMessage
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
let timer = null
let timer1 = null
Page({
    data: {
        scrollTop: 0,
        userName: null,
        inputType: 'text',
        recordBtnText: '',
        requireShow: false,
        requireSwitchText: '查看需求',
        requireTimeReady: false,
        requireList: [],
        canInput: false,
        tags:[],
        grabTime: null,
        nowDate: null,
        timeText: '',
        focus: false,
        showBar: false,
        inputValue: '',
        vaule: '',
        messageList: [],
        delayMessages: [],
        lawyer_avatar: null,
        activeIndex: null,
        my_avatar: wx.getStorageSync('userInfo').iconImage || '../../../image/message/default-avatar.png'
    },
    onLoad(option) {
        wx.setNavigationBarTitle({
            title: option.name
        })
        console.log(wx.getStorageSync('lawyer-avatar'))
        this.setData({
            userName: option.userName,
            // grabTime: option.grabTime || null,
            nowDate: option.nowDate || null,
            lawyer_avatar: wx.getStorageSync('lawyer-avatar') == '' ? '../../../image/message/default-avatar.png' : wx.getStorageSync('lawyer-avatar')
        })
        console.log(option.userName.substr(3))
    },
    onShow() {
        let that = this
        wx.showLoading()
        if(!jM.isLogin()){
            function getImConfigSuccess (res) {
                //  初始化jmessage
                wx.setStorageSync('appkey', res.data.appkey)
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
                    }).onSuccess(function(lData) {
                        that.getMemberAllRequireList(this.data.userName)
                        jM.resetUnreadCount({
                            'username': this.data.userName
                        });
                        that.addSingleReceiptReport()
                        that.getHistoryMessage(that.data.userName)
                        jM.onMsgReceive(function (lRes) {
                            console.log(lRes)
                            let arr = that.data.messageList
                            // arr.push(lRes.messages[0].content)
                            // that.setData({
                            //     messageList: arr,
                            //     delayMessages: arr
                            // },function(){
                            //     that.pageScroll(that)
                            // })
                            if (lRes.messages[0].content.msg_type == "voice") {
                                jM.getResource({
                                    'media_id': lRes.messages[0].content.msg_body.media_id
                                }).onSuccess(function (gRes) {
                                    arr.push({
                                        msg_id: lRes.messages[0].content.msgid,
                                        from_id: lRes.messages[0].content.from_id,
                                        msg_type: lRes.messages[0].content.msg_type,
                                        duration: lRes.messages[0].content.msg_body.duration,
                                        content: gRes.url
                                    })
                                    that.setData({
                                        messageList: arr
                                    }, function () {
                                        that.pageScroll(that)
                                        // jM.resetConversationCount(userName)
                                    })
                                }).onFail(function (data) {
                                    console.log('error:' + JSON.stringify(data));
                                });
                            } else if (lRes.messages[0].content.msg_type == "text") {
                                arr.push({
                                    msg_id: lRes.messages[0].content.msgid,
                                    from_id: lRes.messages[0].content.from_id,
                                    msg_type: lRes.messages[0].content.msg_type,
                                    content: lRes.messages[0].content.msg_body.text
                                })
                                that.setData({
                                    messageList: arr
                                }, function () {
                                    that.pageScroll(that)
                                    // jM.resetConversationCount(userName)
                                })
                            } else if (lRes.messages[0].content.msg_type == "custom") {
                                arr.push({
                                    msg_id: lRes.messages[0].content.msgid,
                                    from_id: lRes.messages[0].content.from_id,
                                    msg_type: lRes.messages[0].content.msg_type,
                                    content: lRes.messages[0].content.msg_body.content
                                })
                                that.setData({
                                    messageList: arr
                                }, function () {
                                    that.pageScroll(that)
                                    // jM.resetConversationCount(userName)
                                })
                            }
                        });
                    }).onFail(function(data){
                      wx.hideLoading() 
                    })
                }).onFail(function(data) {
                  wx.hideLoading() 
                }); 
            }
            function getImConfigFail (res) {
                // console.log(res)
            }
            //  获取im的必须参数
            wxrequest.requestGet(api.getImConfig(),'',getImConfigSuccess,getImConfigFail)
        } else {
            that.getMemberAllRequireList(this.data.userName)
            jM.resetUnreadCount({
                'username': this.data.userName
            });
            that.addSingleReceiptReport()
            that.getHistoryMessage(that.data.userName)
            jM.onMsgReceive(function (lRes) {
                console.log(lRes)
                let arr = that.data.messageList
                // arr.push(lRes.messages[0].content)
                // that.setData({
                //     messageList: arr,
                //     delayMessages: arr
                // },function(){
                //     that.pageScroll(that)
                // })
                if (lRes.messages[0].content.msg_type == "voice") {
                    jM.getResource({
                        'media_id': lRes.messages[0].content.msg_body.media_id
                    }).onSuccess(function (gRes) {
                        arr.push({
                            msg_id: lRes.messages[0].content.msgid,
                            from_id: lRes.messages[0].content.from_id,
                            msg_type: lRes.messages[0].content.msg_type,
                            duration: lRes.messages[0].content.msg_body.duration,
                            content: gRes.url
                        })
                        that.setData({
                            messageList: arr
                        }, function () {
                            that.pageScroll(that)
                            // jM.resetConversationCount(userName)
                        })
                    }).onFail(function (data) {
                        console.log('error:' + JSON.stringify(data));
                    });
                } else if (lRes.messages[0].content.msg_type == "text") {
                    arr.push({
                        msg_id: lRes.messages[0].content.msgid,
                        from_id: lRes.messages[0].content.from_id,
                        msg_type: lRes.messages[0].content.msg_type,
                        content: lRes.messages[0].content.msg_body.text
                    })
                    that.setData({
                        messageList: arr
                    }, function () {
                        that.pageScroll(that)
                        // jM.resetConversationCount(userName)
                    })
                } else if (lRes.messages[0].content.msg_type == "custom") {
                    arr.push({
                        msg_id: lRes.messages[0].content.msgid,
                        from_id: lRes.messages[0].content.from_id,
                        msg_type: lRes.messages[0].content.msg_type,
                        content: lRes.messages[0].content.msg_body.content
                    })
                    that.setData({
                        messageList: arr
                    }, function () {
                        that.pageScroll(that)
                        // jM.resetConversationCount(userName)
                    })
                }
            });
        }
        
    },
    onUnload() {
        //  页面关闭时停止播放语音
        innerAudioContext.stop()
        clearInterval(timer1);
        // innerAudioContext.destroy()
    },
    toggleRequire() {
        this.setData({
            requireShow: !this.data.requireShow,
            requireSwitchText: !this.data.requireShow ? '收起需求' : '查看需求'
        })
    },
    //  获取当前用户所有需求列表
    getMemberAllRequireList(userName) {
        let that = this
        wxrequest.superRequest(api.getAllRequireList() + userName.substr(3), {}, 'GET').then(res => {
            console.log(res)
            let isReceive = res.data.data.filter(item => {
                return item.status == 1
            })
            that.setData({
                requireList: res.data.data || [],
                grabTime: isReceive.length == 0 ? 0 : isReceive[0].remain,
                canInput: isReceive.length == 0 ? false : true,
                requireTimeReady: isReceive.length == 0 ? false : true,
            },function(){
                //  剩余服务时间
                timer1 = setInterval(function(){
                    if (that.data.grabTime > 0) {
                        // console.log(44444)
                        let h=Math.floor(that.data.grabTime/1000/60/60%24);
                        let m=Math.floor(that.data.grabTime/1000/60%60);
                        let s=Math.floor(that.data.grabTime/1000%60)<10?'0'+Math.floor(that.data.grabTime/1000%60):Math.floor(that.data.grabTime/1000%60);
                        // console.log(h+':'+m+':'+s)
                        that.setData({
                            timeText: h+':'+m+':'+s,
                            grabTime: that.data.grabTime-1000
                        })
                        // console.log(that.data.grabTime)
                    } else {
                        clearInterval(timer1);
                    }
                }, 1000);
            })
            if(res.data.data[0].status == 0){
                that.setData({
                    recordBtnText: '未接单'
                })
            } else if (res.data.data[0].status == 3){
                that.setData({
                    recordBtnText: '已关闭'
                })
            }
        })
    },
    getHistoryMessage(userName) {
        let that = this
        let now = new Date()
        let date = new Date(now)
        let beginTime = date.setDate(date.getDate() - 7)
        wx.request({
            url: encodeURI('https://report.im.jpush.cn/v2/users/lex' + wx.getStorageSync('memberId') + '/messages?count=500&begin_time=' + wxformatTime.fTime(beginTime) + '&end_time=' + wxformatTime.fTime(now)),
            header: {
                'Authorization': 'Basic NTdlYzIzM2U0ODE1ZjExMjM1YjMyMzk1OmIyMWY2YzYzOGU3MzIwYjE0YTVhMTQ2OQ=='
            },
            method: 'get',
            success(res) {
                console.log(res.data.messages)
                console.log(userName)

                let _arr = []
                res.data.messages.forEach(item => {
                    if(item.from_id == userName || item.target_id == userName){
                        _arr.push(item)
                    }
                })
                // console.log(userName)
                let dArr = []
                //  存在异步操作，只能用递归的形式加载数据
                that.buildListData(userName, 0, _arr, _arr.length, dArr)
            }
        })
    },
    getUnReadMsg(targetArr) {
        let that = this
        if (wx.getStorageSync('unReadMsgList') != '') {
            let msgList = wx.getStorageSync('unReadMsgList').filter(item => {
                return item.from_id == that.data.userName
            }) || []
            let arr = targetArr.concat(msgList)
            return this.uniq(arr)
        } else {
            return targetArr
        }
    },
    //  数组去重
    uniq(array) {
        var temp = [];
        var index = [];
        var l = array.length;
        for (var i = 0; i < l; i++) {
            for (var j = i + 1; j < l; j++) {
                if (array[i].msg_id === array[j].msg_id) {
                    i++;
                    j = i;
                }
            }
            temp.push(array[i]);
            index.push(i);
        }
        return temp;
    },
    //  拼装列表数据
    buildListData(userName, i, arr, len, targetArr) {
        console.log(arr)
        let that = this
        if (len > 0) {
            if (arr[i].from_id == userName) {
                if (arr[i].msg_type == "voice") {
                    jM.getResource({
                        'media_id': arr[i].msg_body.media_id
                    }).onSuccess(function (gRes) {
                        targetArr.push({
                            from_id: arr[i].from_id,
                            msg_type: arr[i].msg_type,
                            duration: arr[i].msg_body.duration,
                            msg_id: arr[i].msgid,
                            content: gRes.url
                        })
                        if (++i < len) {
                            that.buildListData(userName, i, arr, len, targetArr)
                        } else {
                            that.setData({
                                messageList: that.getUnReadMsg(targetArr)
                            }, function () {
                                console.log(that.data.messageList)
                                that.pageScroll(that)
                                wx.hideLoading()
                            })
                        }
                    }).onFail(function (data) {
                        if (++i < len) {
                            that.buildListData(userName, i, arr, len, targetArr)
                        } else {
                            that.setData({
                                messageList: that.getUnReadMsg(targetArr)
                            }, function () {
                                console.log(that.data.messageList)
                                that.pageScroll(that)
                                wx.hideLoading()
                            })
                        }
                        console.log('error:' + JSON.stringify(data));
                    });
                } else if (arr[i].msg_type == "text") {
                    targetArr.push({
                        from_id: arr[i].from_id,
                        msg_type: arr[i].msg_type,
                        msg_id: arr[i].msgid,
                        content: arr[i].msg_body.text
                    })
                    if (++i < len) {
                        that.buildListData(userName, i, arr, len, targetArr)
                    } else {
                        that.setData({
                            messageList: that.getUnReadMsg(targetArr)
                        }, function () {
                            console.log(that.data.messageList)
                            that.pageScroll(that)
                            wx.hideLoading()
                        })
                    }
                } else if (arr[i].msg_type == "custom") {
                    targetArr.push({
                        from_id: arr[i].from_id,
                        msg_type: arr[i].msg_type,
                        msg_id: arr[i].msgid,
                        content: arr[i].msg_body.content
                    })
                    if (++i < len) {
                        console.log(len)
                        console.log(i)
                        that.buildListData(userName, i, arr, len, targetArr)
                    } else {
                        that.setData({
                            messageList: that.getUnReadMsg(targetArr)
                        }, function () {
                            console.log(that.data.messageList)
                            that.pageScroll(that)
                            wx.hideLoading()
                        })
                    }
                } else {
                    if (++i < len) {
                        that.buildListData(userName, i, arr, len, targetArr)
                    } else {
                        that.setData({
                            messageList: that.getUnReadMsg(targetArr)
                        }, function () {
                            console.log(that.data.messageList)
                            that.pageScroll(that)
                            wx.hideLoading()
                        })
                    }
                }
            } else if (arr[i].target_id == userName) {
                targetArr.push({
                    from_id: arr[i].from_id,
                    msg_type: arr[i].msg_type,
                    msg_id: arr[i].msgid,
                    content: arr[i].msg_body.text
                })
                if (++i < len) {
                    that.buildListData(userName, i, arr, len, targetArr)
                } else {
                    that.setData({
                        messageList: that.getUnReadMsg(targetArr)
                    }, function () {
                        console.log(that.data.messageList)
                        that.pageScroll(that)
                        wx.hideLoading()
                    })
                }
            }
        }else{
            wx.hideLoading()
        }
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
            'target_username': this.data.userName,
            'content': e.detail.value.textarea,
            'no_offline': true
        }).onSuccess(function (data, msg) {
            console.log(data)
            console.log(msg)
            let arr = that.data.messageList
            arr.push({
                msg_id: msg.content.msgid,
                from_id: msg.content.from_id,
                msg_type: msg.content.msg_type,
                content: msg.content.msg_body.text
            })
            that.setData({
                inputValue: '',
                messageList: arr,
            }, function () {
                that.pageScroll(that)
            })
        }).onFail(function (data) {
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
    sendSingleFile(file) {
        let fd = new FormData();
        fd.append('audio', file)

        jM.sendSingleFile({
            'target_username': userName,
            'file': file,
            'appkey': wx.getStorageSync('appkey')
        }).onSuccess(function (data, msg) {
            console.log(msg)
            let arr = that.data.messageList
            arr.push(msg.content)
            that.setData({
                inputValue: '',
                messageList: arr,
            }, function () {
                that.pageScroll(that)
            })
            //data.code 返回码
            //data.message 描述
            //data.msg_id 发送成功后的消息id
            //data.ctime_ms 消息生成时间,毫秒
            //data.appkey 用户所属 appkey
            //data.target_username 用户名
            //msg.content 发送成功消息体
        }).onFail(function (data) {
            //同发送单聊文本
        });
    },

    // 消息已读回执
    addSingleReceiptReport() {
        let that = this
        if (wx.getStorageSync('unReadMsgList') != '') {
            let userUnReadList = wx.getStorageSync('unReadMsgList').filter(item => {
                return item.from_id == that.data.userName
            }) || []
            jM.addSingleReceiptReport({
                'username': that.data.userName,
                'msg_ids': userUnReadList.map(item => {
                    return item.msg_id
                })
            }).onSuccess(function (data, msg_ids) {
                //console.log(data);
                // console.log(msg_ids);
            }).onFail(function (data, msg_ids) {
                // console.log(data);
                //console.log(msg_ids);
            })
        }
    },

    //  页面滚动
    pageScroll(that) {
        // let that = this
        // 获取容器高度，使页面滚动到容器底部
        wx.createSelectorQuery().select('#chart-content').boundingClientRect(function (rect) {
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

    recordTouchStart() {
        let that = this
        wx.showToast({
            duration: 60000,
            image: '../../../image/message/Recording-0.gif',
        })
        recorderManager.start()

        //  60秒自动结束录音
        timer = setTimeout(function () {
            recorderManager.stop()
            recorderManager.onStop((res) => {
                clearTimeout(timer)
                console.log(res.duration)
                that.sendSingleFile(res.tempFilePath)
            })
        }, 60000)
    },
    recordTouchMove() {

    },
    recordTouchEnd() {
        wx.hideToast()
        recorderManager.stop()
        recorderManager.onStop((res) => {
            clearTimeout(timer)
            console.log('recorder stop', res)
            const {
                tempFilePath
            } = res
        })
    },
    //  播放语音
    playAudio(e) {
        let that = this
        this.setData({
            activeIndex: e.currentTarget.id
        })
        innerAudioContext.autoplay = true
        innerAudioContext.obeyMuteSwitch = false
        innerAudioContext.play()
        innerAudioContext.src = e.currentTarget.dataset.src
        innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
        innerAudioContext.onEnded(() => {
            console.log('播放完毕')
            that.setData({
                activeIndex: null
            })
        })
        innerAudioContext.onStop(() => {
            console.log('播放停止')
            that.setData({
                activeIndex: null
            })
        })
        innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    }
})