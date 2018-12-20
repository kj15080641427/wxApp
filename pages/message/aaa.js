//极光的 kay 和ms
var across_appkey = '';
var MASTER_SECRET = '';
//当前用户的id  头像  和昵称 
var myOid = '';
var myAvatar = '';
var myName = '';
window.JIM = new JMessage({
    //debug : true
});
//聊天组件
var layim;
var imdata;
//好友信息
var IMfriend;
//离线信息
var OfflineInfo;
//接收的未读消息
var Unmessage = new Map();
//当前选择的文件
var file;
$.ajaxSetup({
    async: false
});
$(function () {
        if (localStorage.getItem("layim") == null) {
            setLayImLocal();
        }
        init();
});
 
//初始化 layim
function initializeIM() {
    layui.use('layim', function () {
        var $ = layui.$;
        layim = layui.layim;
        //基础配置
        layim.config({
            //初始化接口
            init: {
                //极光的数据 不是请求的所以自定义
                mine: {
                    "username": myName //我的昵称
                    , "id": myOid //我的ID
                    , "status": "online" //在线状态 online：在线、hide：隐身
                    , "sign": "" //我的签名
                    , "avatar": myAvatar //我的头像
                }
                , friend: IMfriend
                //现在还没有组聊天 先不用
                //,group: []
            }
            , uploadImage: {
                url: 'app/common/uploadImage' //（返回的数据格式见下文）
            }
            //, isAudio: true //开启聊天工具栏音频
            //, isVideo: true //开启聊天工具栏视频
            , title: myName //自定义主面板最小化时的标题
            , initSkin: '3.jpg' //1-5 设置初始背景
            , notice: true
            //,chatLog: layui.cache.dir + 'css/modules/layim/html/chatlog.html'
            //, face:false
        });
        //监听发送消息
        layim.on('sendMessage', function (data) {
            //对方账号信息
            var to = data.to;
            //我的账号信息
            var mine = data.mine;
            if (mine.content.indexOf('img[') >= 0) {
                sendSinglePic(to.id, to.name, mine.content.replace(/(^img\[)|(\]$)/g, ''))
                setmsg(to.id,myOid,mine.content.replace(/(^img\[)|(\]$)/g, ''),"image");
            } else {
                sendSingleMsg(to.id, mine.content);
                setmsg(to.id,myOid,mine.content,"text");
            }
        });
        layim.on('chatChange', function (obj) {
            console.log(obj);
        });
    });
}
 
//初始化  漫游消息
//如果  新浏览器没有 layim 的缓存的 才获取漫游消息
function setLayImLocal() {
    //设置时间是为了等待初始化layim
    setTimeout(function () {
        //初始化结束  开始推送离线消息
        //这次循环的是所有用户
        var local = layui.data('layim')[myOid] || {};
        var obj = {}, history = local.history || {};
        local.spread0 = true;
        layui.data('layim', {
            key: myOid
            ,value:local
        });
        for (var i = 0; i < OfflineInfo.length; i++) {
            for (var j = 0; j < IMfriend[0].list.length; j++) {
                if(OfflineInfo[i].from_username == IMfriend[0].list[j].id){
                    var useroid = "friend"+IMfriend[0].list[j].id;
                    var chatlog = local.chatlog || {};
                    var thisid = chatlog[useroid] || [];
                    for (var x = 0; x < OfflineInfo[i].msgs.length; x++) {
                        //如果 漫游消息的发消息人的id 不是自己 说明接收消息
                        if(OfflineInfo[i].msgs[x].content.target_id == myOid){
                            if(OfflineInfo[i].msgs[x].content.msg_type == "text"){//文本消息
                                thisid.push({
                                    "username":IMfriend[0].list[j].username,
                                    "avatar":IMfriend[0].list[j].avatar,
                                    "id":IMfriend[0].list[j].id,
                                    "type":"friend",
                                    "content":OfflineInfo[i].msgs[x].content.msg_body.text,
                                    "timestamp":OfflineInfo[i].msgs[x].ctime_ms
                                });
                            }else if(OfflineInfo[i].msgs[x].content.msg_type == "image"){//图片消息
                                if(OfflineInfo[i].msgs[x].content.msg_body.extras != null){
                                    thisid.push({
                                        "username":IMfriend[0].list[j].username,
                                        "avatar":IMfriend[0].list[j].avatar,
                                        "id":IMfriend[0].list[j].id,
                                        "type":"friend",
                                        "content":"img["+OfflineInfo[i].msgs[x].content.msg_body.extras.url+"]",
                                        "timestamp":OfflineInfo[i].msgs[x].ctime_ms
                                    });
                                }
                            }else if(OfflineInfo[i].msgs[x].content.msg_type == "audio"){//音频消息
                                if(OfflineInfo[i].msgs[x].content.msg_body.extras != null) {
                                    thisid.push({
                                        "username": IMfriend[0].list[j].username,
                                        "avatar": IMfriend[0].list[j].avatar,
                                        "id": IMfriend[0].list[j].id,
                                        "type": "friend",
                                        "content": "img[" + OfflineInfo[i].msgs[x].content.msg_body.extras.url + "]",
                                        "timestamp": OfflineInfo[i].msgs[x].ctime_ms,
                                        "mine": true
                                    });
                                }
                            }
                            //吧聊天未读消息储存
                            if (Unmessage.get(OfflineInfo[i].msgs[x].from_username)) {
                                var arr = Unmessage.get(OfflineInfo[i].msgs[x].from_username);
                                arr.push(OfflineInfo[i].msgs[x].msg_id);
                                Unmessage.set(OfflineInfo[i].msgs[x].from_username, arr);
                            } else {
                                var arr = [];
                                arr.push(OfflineInfo[i].msgs[x].msg_id);
                                Unmessage.set(OfflineInfo[i].msgs[x].from_username, arr);
                            }
                        }else {
                            if(OfflineInfo[i].msgs[x].content.msg_type == "text"){//文本消息
                                thisid.push({
                                    "username":IMfriend[0].list[j].username,
                                    "avatar":IMfriend[0].list[j].avatar,
                                    "id":IMfriend[0].list[j].id,
                                    "type":"friend",
                                    "content":OfflineInfo[i].msgs[x].content.msg_body.text,
                                    "timestamp":OfflineInfo[i].msgs[x].ctime_ms,
                                    "mine":true
                                });
                            }else if(OfflineInfo[i].msgs[x].content.msg_type == "image"){//图片消息
                                if(OfflineInfo[i].msgs[x].content.msg_body.extras != null) {
                                    thisid.push({
                                        "username": IMfriend[0].list[j].username,
                                        "avatar": IMfriend[0].list[j].avatar,
                                        "id": IMfriend[0].list[j].id,
                                        "type": "friend",
                                        "content": "img[" + OfflineInfo[i].msgs[x].content.msg_body.extras.url + "]",
                                        "timestamp": OfflineInfo[i].msgs[x].ctime_ms,
                                        "mine": true
                                    });
                                }
                            }
                        }
                    }
                    chatlog[useroid] = thisid;
                    local.chatlog = chatlog;
                    layui.data('layim', {
                        key: myOid
                        ,value:local
                    });
                    var data = {
                        "username":IMfriend[0].list[j].username,
                        "id":IMfriend[0].list[j].id,
                        "avatar":IMfriend[0].list[j].avatar,
                        "sign":"",
                        "status":"online",
                        "name":IMfriend[0].list[j].username,
                        "type":"friend",
                        "historyTime":new Date().getTime()
                    };
                    data.historyTime = new Date().getTime();
                    history["friend"+IMfriend[0].list[j].id] = data;
                    local.history = history;
                    layui.data('layim', {
                        key: myOid
                        ,value: local
                    });
                }
            }
        }
        console.log(local);
    }, 3000);
}
//初始化极光聊天
function init() {
    var random_str = randomString(20);
    var timestamp = new Date().getTime();
    var signature = hex_md5('appkey=' + across_appkey + '&timestamp=' + timestamp + '&random_str=' + random_str + '&key=' + MASTER_SECRET);
    JIM.init({
        "appkey": across_appkey,
        "random_str": random_str,
        "signature": signature,
        "timestamp": timestamp,
        "flag": 1
    }).onSuccess(function (data) {
        console.log('success:' + JSON.stringify(data));
        //初始化后就登录
        login();
    }).onFail(function (data) {
        console.log('error:' + JSON.stringify(data));
        Dialog.alert("初始化聊天功能失败！请联系管理员！");
    });
}
//用户登录
function login() {
    JIM.login({
        'username': '${user.oid}',
        'password': '${user.password}'
    }).onSuccess(function (data) {
            //初始化  layim
            //获取消息列表 每次登录都会获取到离线消息=。=
            getConversation();
            //聊天消息实时监听
            JIM.onMsgReceive(function (data) {
                //收到消息创建会话  会话已经存在就会累加
                console.log(data);
                JIM.getUserInfo({
                    'username': data.messages[0].from_username,
                    'appkey': across_appkey
                }).onSuccess(function (res) {
                    console.log(res);
                    if (data.messages[0].content.msg_type == "text") {
                        layim.getMessage({
                            username: data.messages[0].content.from_name
                            , avatar: res.user_info.avatar
                            , id: data.messages[0].from_username
                            , type: "friend"
                            , cid: data.messages[0].msg_id
                            , content: data.messages[0].content.msg_body.text
                        });
                    } else if (data.messages[0].content.msg_type == "image") {
                        JIM.getResource({'media_id': data.messages[0].content.msg_body.media_id})
                            .onSuccess(function (img) {
                                layim.getMessage({
                                    username: data.messages[0].content.from_name
                                    , avatar: res.user_info.avatar
                                    , id: data.messages[0].from_username
                                    , type: "friend"
                                    , cid: data.messages[0].msg_id //消息id，可不传。除非你要对消息进行一些操作（如撤回）
                                    , content: "img[" + img.url + "]"
                                });
                            }).onFail(function (data) {
                            console.log('error:' + JSON.stringify(data));
                        });
                    } else if (data.messages[0].content.msg_type == "voice") {
                        JIM.getResource({'media_id': data.messages[0].content.msg_body.media_id})
                            .onSuccess(function (img) {
                                layim.getMessage({
                                    username: data.messages[0].content.from_name
                                    , avatar: res.user_info.avatar
                                    , id: data.messages[0].from_username
                                    , type: "friend"
                                    , cid: data.messages[0].msg_id //消息id，可不传。除非你要对消息进行一些操作（如撤回）
                                    , content: "audio[" + img.url + "]"
                                });
                            }).onFail(function (data) {
                            console.log('error:' + JSON.stringify(data));
                        });
                    } else if (data.messages[0].content.msg_type == "custom") {
                        //手机端创建的自定义消息
                        layim.getMessage({
                            username: data.messages[0].content.from_name
                            , avatar: res.user_info.avatar
                            , id: data.messages[0].from_username
                            , type: "friend"
                            , cid: data.messages[0].msg_id //消息id，可不传。除非你要对消息进行一些操作（如撤回）
                            , content: "custom[" + img.url + "]"
                        });
                    }
                    //吧聊天未读消息储存
                    if (Unmessage.get(data.messages[0].from_username)) {
                        var arr = Unmessage.get(data.messages[0].from_username);
                        arr.push(data.messages[0].msg_id);
                        Unmessage.set(data.messages[0].from_username, arr);
                    } else {
                        var arr = [];
                        arr.push(data.messages[0].msg_id);
                        Unmessage.set(data.messages[0].from_username, arr);
                    }
                }).onFail(function (data) {
                });
            });
            //业务事件监听
            JIM.onEventNotification(function (data) {
                console.log('event_receive: ' + JSON.stringify(data));
            });
            //离线消息同步监听
            JIM.onSyncConversation(function (datamsg) {
                console.log("离线消息 也是直接发送给layim");
                OfflineInfo = datamsg;
            });
            JIM.onDisconnect(function () {
                login();
            });
            //用户信息变更监听
            JIM.onUserInfUpdate(function (data) {
                console.log('onUserInfUpdate : ' + JSON.stringify(data));
            });
            //业务事件同步监听
            JIM.onSyncEvent(function (data) {
                console.log('onSyncEvent : ' + JSON.stringify(data));
            });
            //消息已读数变更事件实时监听
            JIM.onMsgReceiptChange(function (data) {
                console.log('onMsgReceiptChange : ' + JSON.stringify(data));
            });
            //消息已读数变更事件同步监听
            JIM.onSyncMsgReceipt(function (data) {
                imdata = data;
                //console.log('onSyncMsgReceipt : ' + JSON.stringify(data));
            });
            //会话未读数变更监听
            JIM.onMutiUnreadMsgUpdate(function (data) {
                console.log('onConversationUpdate : ' + JSON.stringify(data));
            });
            //消息透传监听
            JIM.onTransMsgRec(function (data) {
                console.log('onTransMsgRec : ' + JSON.stringify(data));
            });
            //聊天室消息监听
            JIM.onRoomMsg(function (data) {
                console.log('onRoomMsg  : ' + JSON.stringify(data));
            });
            //请求失败回调
        }
    ).onFail(function (data) {
        console.log('error:' + JSON.stringify(data));
        Dialog.alert("登录聊天功能失败！请联系管理员！");
        //请求超时回调
    }).onTimeout(function (data) {
        console.log('timeout:' + JSON.stringify(data));
        Dialog.alert("登录聊天功能失败！请联系管理员！");
    });
}
/***
 * 发消息
 * across_user 目标用户
 * content 内容
 * */
function sendSingleMsg(across_user, content) {
    JIM.sendSingleMsg({
        'target_username': across_user,
        'appkey': across_appkey,
        'content': content,
        'no_offline': false,//消息离线控制标志，false，默认值，保存离线消息；true，不保存离线消息
        'no_notification': false,//状态栏显示消息标志，false，默认值，状态栏显示消息；true，状态栏不显示消息
        //'custom_notification':{'enabled':true,'title':'title','alert':'alert','at_prefix':'atprefix'}
        need_receipt: true//是否需要已读回执，需要:true 不需要:false
    }).onSuccess(function (data, msg) {
        console.log('success data:' + JSON.stringify(data));
        console.log('succes msg:' + JSON.stringify(msg));
    }).onFail(function (data) {
        console.log('error:' + JSON.stringify(data));
    });
    var arr = Unmessage.get(across_user);
    if (arr != null && arr != undefined) {
        addSingleReceiptReport(myOid, arr);
    }
}
/**
 * 极光web 发送图片需要这个file 用监听事件拿到这个文件
 */
function selectFile(obj) {
    file = obj.files[0] ;
}
/**
 * 极光发送图片
 */
function sendSinglePic(across_user, across_name, content) {
    var fd = new FormData();
    fd.append(file.name, file);
    JIM.sendSinglePic({
        'target_username' : across_user,
        'target_nickname' : across_name,
        'image' : fd,
        'appkey' : across_appkey
        , extras:{url:content}
    }).onSuccess(function (res, msg) {
        console.log('success:' + JSON.stringify(res));
        console.log('successssssss:' + JSON.stringify(msg));
    }).onFail(function (res) {
        console.log('error:' + JSON.stringify(res));
    });
    var arr = Unmessage.get(across_user);
    if (arr != null && arr != undefined) {
        addSingleReceiptReport(myOid, arr);
    }
}
/**
 * 获取消息列表
 * */
function getConversation() {
    JIM.getConversation().onSuccess(function (data) {
        console.log("登录成功之后获取消息列表");
        //极光im 的好友信息与 layim有区别 转换一下
        var list = [];
        for (var i = 0; i < data.conversations.length; i++) {
            var friend = { //好友昵称
                username: data.conversations[i].nickName
                , id: data.conversations[i].name //好友ID
                , avatar: data.conversations[i].avatar //好友头像
                , sign: "" //好友签名
                , status: "online" //若值为offline代表离线，online或者不填为在线
            };
            list.push(friend);
        }
        IMfriend = [{
            groupname: "客户",
            id: 1,
            list: list
        }];
        //先拿到以前的消息再初始化
        initializeIM();
    }).onFail(function (data) {});
}
//获取随机字符串
function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
/**
 * 单聊消息已读回执
 */
// msg_ids 消息数组
function addSingleReceiptReport(across_user, msg_ids) {
    //2018年11月8日 13:30:09 官方文档 中的 msg_ids  少了个 s 坑比
    JIM.addSingleReceiptReport({
        'username': across_user,
        'msg_ids': msg_ids
    }).onSuccess(function (data, msg_ids) {
        //console.log(data);
        //console.log(msg_ids);
    }).onFail(function (data, msg_ids) {
        //console.log(data);
        //console.log(msg_ids);
    })
}
/**
 * user: MRDOUBI
 * 邮箱：1327466228@qq.com
 * 功能描述：记录用户的聊天消息
 * 日期:下午 1:29 2018/11/8
 * @param sendUserOid
 * @param receiveUserOid
 * @param content
 * @param smsType
 */
function setmsg(sendUserOid,receiveUserOid,content,smsType) {
    var data = {
        sendUserOid:sendUserOid,
        receiveUserOid:receiveUserOid,
        content:content
    };
    if(smsType == "text"){
        data.smsType = 1;
    }else if(smsType == "image"){
        data.smsType = 2;
    }else if(smsType == "audio"){
        data.smsType = 3;
    }else if(smsType == "custom"){
        data.smsType = 4;
    }else {
        data.smsType = 0;
    }
    $.ajax({
        "url": "app/jiguang/setmsg",
        "type": "POST",
        "async": true,
        "dataType": "json",
        "data": data,
        "success": function (data) {
            //不需要回调  异步塞值即可
            console.log(data);
        }
    })
}