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
var ArticleList = '/client/article'

// 文字咨询地址
var Commit = '/client/freeText/post' 


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
module.exports={
  getLoginUrl: getLoginUrl,
  getVerifyCodeUrl: getVerifyCodeUrl,
  getArticleTypeUrl: getArticleTypeUrl,
  getArticleListUrl: getArticleListUrl,
  getCommitUrl:getCommitUrl
}