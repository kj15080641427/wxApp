import JMessage from './jmessage-wxapplet-sdk-1.4.0.min'
import hex_md5 from './md5.js'
//  创建 jMessage 实例
let jMessage = new JMessage({
    debug:true   //  是否开启debug模式
})

let memberId = null
let mobile = null

if(wx.getStorageSync('memberId') != ''){
    memberId = 'lex' + wx.getStorageSync('memberId')
    mobile = hex_md5(wx.getStorageSync('userInfo').mobile)
}

let jM = {
    //  是否初始化
    isInit(){
        return jMessage.isInit()
    },
    //  是否登录
    isLogin() {
        return jMessage.isLogin()
    },
    //  初始化im
    init(appkey,random,signature,timestamp) {
        return new Promise( reslove => {
            jMessage.init({
                "appkey"    : appkey,
                "random_str": random,
                "signature" : signature,
                "timestamp" : timestamp,
                "flag": 1
            }).onSuccess(function(data) {
                reslove(data)
            }).onFail(function(data) {
                console.log(data)
            }); 
        })
    },
    //  开启断线监听
    disconnect() {
        jMessage.onDisconnect(function(){
            jM.jmLogin()
        });
    },
    //  jm 登录
    jmLogin() {
        return new Promise(resolve => {
            jMessage.login({
                'username' : memberId,
                'password' : mobile
            }).onSuccess(function(data) {
                // wx.hideLoading()
                // console.log(data)
                // jM.getJMUserInfo()
                // jM.getJMConversation().then(res => {console.log(res)})
                    //data.code 返回码
                    //data.message 描述
                    //data.online_list[] 在线设备列表
                    //data.online_list[].platform  Android,ios,pc,web
                    //data.online_list[].mtime 最近一次登录时间
                    //data.online_list[].isOnline 是否在线 true or false
                    //data.online_list[].isLogin 是否登录 true or false
                    //data.online_list[].flag 该设备是否被当前登录设备踢出 true or false
                jM.disconnect()
                jMessage.onMutiUnreadMsgUpdate(function(data) {
                    console.log(data)
                    // data.type 会话类型
                    // data.gid 群 id
                    // data.appkey 所属 appkey
                    // data.username 会话 username
                });
                resolve(data)
            }).onFail(function(data){
                console.log(data.message)
                //同上
            })
        })
    },

    //  获取jm用户信息 
    getJMUserInfo(memberId,appkey) {
        return new Promise( resolve => {
            jMessage.getUserInfo({
                'username' : memberId,
                'appkey' : appkey
            }).onSuccess(function(data) {
                console.log(data)
                resolve(data)
                //data.code 返回码
                //data.message 描述
                //data.user_info.username
                //data.user_info.appkey
                //data.user_info.nickname
                //data.user_info.avatar 头像
                //data.user_info.birthday 生日，默认空
                //data.user_info.gender 性别 0 - 未知， 1 - 男 ，2 - 女
                //data.user_info.signature 用户签名
                //data.user_info.region 用户所属地区
                //data.user_info.address 用户地址
                //data.user_info.mtime 用户信息最后修改时间
                //data.extras 自定义json字段
                }).onFail(function(data) {
                    console.log(data)
                //data.code 返回码
                //data.message 描述
            })
        })
    },

    //  获取jm会话列表
    getJMConversation() {
        return new Promise(resolve => {
            jMessage.getConversation().onSuccess(function(data) {
                console.log(data)
                resolve(data)
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
        })
        
    },

    //  更新会话信息
    updateConversation(appkey,username,extras) {
        jMessage.updateConversation({
            'appkey' : appkey,
            'username' : username,
            'extras' : extras
           });
    },

    //  获取会话未读数
    getConversationNoRead(username) {
        return jMessage.getUnreadMsgCnt({'username' : username});
    },
    
    //  发送消息
    sendMessage(targetName,content) {
        return new Promise( resolve => {
            // 发送消息
            jMessage.sendSingleMsg({
                'target_username' : targetName,
                'content' : content,
                'no_offline' : true
            }).onSuccess(function(data,msg) {
                console.log(data)
                console.log(msg)
                resolve(msg)
                //data.code 返回码
                //data.message 描述
                //data.msg_id 发送成功后的消息 id
                //data.ctime_ms 消息生成时间,毫秒
                //data.appkey 用户所属 appkey
                //data.target_username 用户名
                //msg.content 发送成功消息体,见下面消息体详情
            }).onFail(function(data) {
                //data.code 返回码
                //data.message 描述
            })
        })
    },

    //  获取离线消息
    getOutlineMessage() {
        console.log(123)
        jMessage.onSyncConversation(function(data) {
            console.log(123132)
            console.log(data)
            // data[]
            // data[].msg_type 会话类型
            // data[].from_appey 单聊有效
            // data[].from_username 单聊有效
            // data[].from_gid 群聊有效
            // data[].unread_msg_count 消息未读数
            // 消息已读回执状态，针对自己发的消息
            // data[].receipt_msgs[]
            // data[].receipt_msgs[].msg_id
            // data[].receipt_msgs[].unread_count
            // data[].receipt_msgs[].mtime
            // 消息列表
            // data[].msgs[]
            // data[].msgs[].msg_id
            // data[].msgs[].content
            // data[].msgs[].msg_type
            // data[].msgs[].ctime_ms
            // data[].msgs[].need_receipt
            // data[].msgs[].custom_notification.enabled
            // data[].msgs[].custom_notification.title
            // data[].msgs[].custom_notification.alert
            // data[].msgs[].custom_notification.at_prefix
         });
    },

    //  监听消息
    listenMessage() {
        return new Promise( resolve => {
            jMessage.onMsgReceive(function(data) {
                console.log(data)
                console.log(jM.getConversationNoRead(data.messages[0].from_username))
                let res = {
                    d: data,
                    noCount: jM.getConversationNoRead(data.messages[0].from_username)
                }
                // let extras = {
                //     unread_msg_count: jM.getConversationNoRead()
                // }
                // jM.updateConversation(data.messages[0].from_appkey,data.messages[0].from_username,extras)
                resolve(res)
                // data.messages[]
                // data.messages[].ctime_ms
                // data.messages[].msg_type 会话类型
                // data.messages[].msg_id
                // data.messages[].from_appey 单聊有效
                // data.messages[].from_username 单聊有效
                // data.messages[].from_gid 群聊有效
                // data.messages[].need_receipt
                // data.messages[].content
                // data.messages[].custom_notification.enabled
                // data.messages[].custom_notification.title
                // data.messages[].custom_notification.alert
                // data.messages[].custom_notification.at_prefix
            });
        })
    },

    //  消息回执
    messageRequire(memberId,msgId) {
        return new Promise( reslove => {
            // 接收方收到需要消息回执的消息，阅读后进行消息回执操作
            jMessage.addSingleReceiptReport({
                'username' : memberId,
                'msg_ids' : msgId
            }).onSuccess(function(data,msg_ids){
                console.log(data)
                reslove(data)
                // data.code 返回码
                // data.appkey 目标 appkey
                // data.username 目标 username
                // msg_ids 消息数组
            }).onFail(function(){

            })
        })
    },

    //  消息已读数变更事件同步监听
    messageSyncReceipt() {
        jMessage.onSyncMsgReceipt(function(data) {
            console.log(data)
            // data 为已读数变更事件数组 [receiptChange1,...]
        });
    },

    //  重置会话未读数
    resetConversationCount(username) {
        jMessage.resetUnreadCount({'username' : username});
    }
}

export default jM