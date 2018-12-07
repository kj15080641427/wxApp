'use strict';
// 地址
var HOST_URL = 'https://api-test.lex-mung.com';

// 获取验证码地址
var VerifyCode = '/passport/verifycode';

// 登录地址
var Login = '/passport/app/login';

// 文章分类地址
var ArticleType = '/client/article/category'

// 文章列表地址
var ArticleList = '/client/solution/list'

// 文字咨询地址
var Commit = '/client/freeText/post' 

// 上传图片地址
var Image = '/upload/file'

// 获取用户信息地址
var UserInfo = '/client/user/userinfo'

// 用户详情地址
var UserDetail = '/client/member/detail/'

// 修改用户详情
var EditDetail = '/client/member/detail/'

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
module.exports={
  getLoginUrl: getLoginUrl,
  getVerifyCodeUrl: getVerifyCodeUrl,
  getArticleTypeUrl: getArticleTypeUrl,
  getArticleListUrl: getArticleListUrl,
  getCommitUrl:getCommitUrl,
  getImageUrl:getImageUrl,
  getUserInfo:getUserInfo,
  getUserDetail:getUserDetail,
}