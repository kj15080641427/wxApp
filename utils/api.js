'use strict';
// 地址
var HOST_URL = 'https://api-test.lex-mung.com';

//  获取openid
var Openid = '/wechat/openid'
function appLogin() { 
  return HOST_URL+Openid
}

// 获取验证码地址
var VerifyCode = '/passport/verifycode';

// 登录地址
var Login = '/passport/app/login';

// 文章分类地址
var ArticleType = '/solution/type'

// 文章列表地址 解决方案
// var ArticleList = '/client/solution/list'
var ArticleList = '/solution/list'

// 文字咨询地址
var Commit = '/client/freeText/post' 

// 上传图片地址
var Image = '/upload/file'

// 获取用户信息地址
var UserInfo = '/client/user/userinfo'

// 用户详情地址
var UserDetail = '/client/member/detail/'

// 修改用户详情地址
var EditDetail = '/client/member/update'

// 行业列表地址
var Industry = '/common/industry'

// 获取行业列表
function getIndustryUrl(){
  return HOST_URL+Industry
}

// 组织机构地址
var Institution = '/common/institution/type'

//获取组织机构列表
function getInstitutionUrl(){
  return HOST_URL+Institution
}

//职务列表地址
var Position = '/common/member/position'
//获取职务列表
function getPositionUrl(){
  return HOST_URL+Position
}

// 获取验证码
function getVerifyCodeUrl(){
  return HOST_URL + VerifyCode
}

// 登录
function getLoginUrl(){
  return HOST_URL + Login
}

// 文章分类
function getArticleTypeUrl(){
  return HOST_URL+ArticleType
}

// 文章列表
function getArticleListUrl(){
  return HOST_URL+ArticleList
}

// 文字咨询
function getCommitUrl(){
  return HOST_URL+Commit
}

//上传图片
function getImageUrl(){
  return HOST_URL+Image
}

// 用户信息
function getUserInfo(){
  return HOST_URL+UserInfo
}

// 用户详情
function getUserDetail(){
  return HOST_URL+UserDetail
}

//修改用户详情
function getEditDetail(){
  return HOST_URL + EditDetail
}

// 律师常去机构
var InstituType = '/lawyer/member/institution/type/'
function getInstitutype(){
  return HOST_URL + InstituType
}
// 律师搜索页筛选条件
var Search = '/lawyer/search/page'
function getSearch(){
  return HOST_URL + Search
}
//搜索律师
var SearchLawyer = '/lawyer/search/'
function getSearchLawyer(){
  return HOST_URL + SearchLawyer
}
// 获取律师信息
var LawyerInfo = '/lawyer/member/homepage/card/'
function getlawyerInfo(){
  return HOST_URL + LawyerInfo
}
//律师个人主页(背景图/所获荣誉/描述)
var LawHomePage = '/lawyer/member/homepage/base/'
function getLawHomePage(){
  return HOST_URL + LawHomePage
}
//需求服务分类/事务分类
var Demand = '/client/requirement/types'
function getDemand(){
  return HOST_URL +Demand
}
//擅长领域
var Expert = '/common/businessType'
function getExpert(){
  return HOST_URL + Expert
}

//  获取极光IM相关配置信息
var ImConfig = '/client/im/config'
function getImConfig(){
  return HOST_URL + ImConfig
}
//发布需求
//发布需求类型
var DemandType = '/client/requirement/types'
function getDemandType(){
  return HOST_URL + Demand
}
//标签
var Mark = '/client/requirement/tags/'
function getMark(){
  return HOST_URL + Mark
}
//发布需求
var Publish = '/client/requirement/post'
function getPublish(){
  return HOST_URL + Publish
}

// 获取微信支付信息
var Pay = '/pay/recharge'
function getPayInfo(){
  return HOST_URL + Pay
}
//热线咨询
var Phone = '/client/freecall/phone'
function getPhone(){
  return HOST_URL + Phone
}
//关注
var Follow = '/lawyer/member/follow/'
function getFollow(){
  return HOST_URL + Follow
}
//取消关注
var Unfollow = '/lawyer/member/unfollow/'
function getUnfollow(){
  return HOST_URL+Unfollow
}

//我的关注列表
var Myfollow = '/lawyer/member/myfollow'
function getMyFollow(){
  return HOST_URL + Myfollow
}
//订单
var Order = '/client/member/order'
function getOrder(){
  return HOST_URL + Order
}
// 账户余额
var Balance = '/client/amount/balance/'
function getBalance(){
  return HOST_URL +Balance
}
// 交易明细
var BalanceDetail = '/client/amount/detail'
function getBalanceDetail(){
  return HOST_URL + BalanceDetail
}
//组织列表
var Organization = '/client/organization'
function getOrganization (){
  return HOST_URL + Organization
}
//广告
var Adbanner = '/banner'
function getAdbanner(){
  return HOST_URL + Adbanner
}
//案例
var Case = '/lawyer/case'
function getCase(){
  return HOST_URL + Case
}
//文字咨询
var FreeText = '/lawyer/freeText/'
function getFreeText(){
  return HOST_URL + FreeText
}
//快速咨询 
var Quick = '/client/quick/post'
function getQuick(){
  return HOST_URL + Quick
}
//客户端解决方案类型
var Type = '/solution/type'
function getType(){
  return HOST_URL + Type
}
//专家服务
var ExpertPhone = '/client/expert/call/'
function getExpertPhone(){
  return HOST_URL + ExpertPhone
}
//文字咨询列表
var FreetextList = '/lawyer/freeText/'
function getFreetextList(){
  return HOST_URL + FreetextList
}
//用户回复文字咨询
var UserReply = '/lawyer/freeText/'
function getUserReply(){
  return HOST_URL + UserReply
}
//关于
var About = '/aboutus'
function getAbout(){
  return HOST_URL + About
}
module.exports={
  appLogin: appLogin,
  getLoginUrl: getLoginUrl,
  getVerifyCodeUrl: getVerifyCodeUrl,
  getArticleTypeUrl: getArticleTypeUrl,
  getArticleListUrl: getArticleListUrl,
  getCommitUrl:getCommitUrl,
  getImageUrl:getImageUrl,
  getUserInfo:getUserInfo,
  getUserDetail:getUserDetail,
  getEditDetail: getEditDetail,
  getIndustryUrl: getIndustryUrl,
  getInstitutionUrl: getInstitutionUrl,
  getPositionUrl: getPositionUrl,
  getInstitutype: getInstitutype,
  getSearch: getSearch,
  getSearchLawyer: getSearchLawyer,
  getlawyerInfo: getlawyerInfo,
  getLawHomePage: getLawHomePage,
  getDemand: getDemand,
  getExpert: getExpert,
  getImConfig: getImConfig,
  getDemandType: getDemandType,
  getMark:getMark,
  getPublish: getPublish,
  getPayInfo: getPayInfo,
  getPhone: getPhone,
  getFollow: getFollow,
  getMyFollow: getMyFollow,
  getUnfollow: getUnfollow,
  getOrder: getOrder,
  getBalance:getBalance,
  getBalanceDetail: getBalanceDetail,
  getOrganization: getOrganization,
  getAdbanner: getAdbanner,
  getCase: getCase,
  getFreeText: getFreeText,
  getQuick: getQuick,
  getType:getType,
  getExpertPhone: getExpertPhone,
  getFreetextList: getFreetextList,
  getUserReply: getUserReply,
  getAbout: getAbout
}