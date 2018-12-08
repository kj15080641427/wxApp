var device = {
  "device_type": 5,
  "app_version": "1.0",
  "app_version_code": 1,
  "channel": "weixin" 
}

function request(url, params, success, fail) {
  this.requestLoading(url, params, "", success, fail)
}
function requestLoading(url, params, message, success, fail) {
  // console.log(params)
  wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: url,
    data: params,
    header: {
      'Content-Type': 'application/json',
      'device':JSON.stringify(device),
      'X-Token':wx.getStorageSync("token")
      // 'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (res) {
      //console.log(res.data)
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      // console.log(res.data.code)
      if (res.statusCode == 200 && res.data.code ==0) {
        success(res.data)
      } else {
        fail()
      }
    },
    fail: function (res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      console.log('request',e)
      fail()
    },
    complete: function (res) {

    },
  })
}

// POST
function requestPost(url, params, message, success, fail) {
  // console.log(params)
  wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: url,
    data: params,
    header: {
      'Content-Type': 'application/json',
      'device': JSON.stringify(device),
      'X-Token': wx.getStorageSync("token")
      // 'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (res) {
      //console.log(res.data)
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      if (res.statusCode == 200) {
        success(res.data)
      } else {
        fail()
      }
    },
    fail: function (res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      fail()
    },
    complete: function (res) {

    },
  })
}

// GET
function requestGet(url,message, success, fail) {
  wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: url,
    // data: params,
    header: {
      'Content-Type': 'application/json',
      'device': JSON.stringify(device),
      'X-Token': wx.getStorageSync("token")
      // 'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: function (res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      if (res.statusCode == 200 ) {
        success(res.data)
      } else {
        fail()
      }
    },
    fail: function (res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      fail()
    },
    complete: function (res) {

    },
  })
}
module.exports = {
  request: request,
  requestLoading: requestLoading,
  requestGet: requestGet,
  requestPost:requestPost,
}