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
            // console.log(res.data.code)
            if (res.statusCode == 200 && res.data.code == 0) {
                success(res.data)
            } else {
              if (res.statusCode == 401) {
                wx.navigateTo({
                  url: '/pages/userlogin/index',
                  complete: function (res) {
                    console.log(res)
                  }
                })
              }
                fail(res.data)
            }
        },
        fail: function (res) {
            wx.hideNavigationBarLoading()
            if (message != "") {
                wx.hideLoading()
            }
            console.log('request', e)
            fail(res)
        },
        complete: function (res) {

        },
    })
}
//notoken
function requestToken(url, params, message, success, fail) {
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
      if (res.statusCode == 200 && res.data.code == 0) {
        success(res.data)
      } else {
        if (res.statusCode == 401) {
          wx.navigateTo({
            url: '/pages/userlogin/index',
            complete: function (res) {
              console.log(res)
            }
          })
        }
        fail(res.data)
      }
    },
    fail: function (res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      console.log('request', e)
      fail(res)
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
            if (res.statusCode == 200 && res.data.code == 0) {
                success(res.data)
            } else {
              if (res.statusCode == 401) {
                wx.navigateTo({
                  url: '/pages/userlogin/index',
                  complete: function (res) {
                    console.log(res)
                  }
                })
              }
                fail(res)
            }
        },
        fail: function (res) {
            console.log(res)
            wx.hideNavigationBarLoading()
            if (message != "") {
                wx.hideLoading()
            }
            fail(res)
        },
        complete: function (res) {

        },
    })
}

// GET
// function requestGet(url,message, success, fail) {
//   wx.showNavigationBarLoading()
//   if (message != "") {
//     wx.showLoading({
//       title: message,
//     })
//   }
//   wx.request({
//     url: url,
//     // data: params,
//     header: {
//       'Content-Type': 'application/json',
//       'device': JSON.stringify(device),
//       'X-Token': wx.getStorageSync("token")
//       // 'content-type': 'application/x-www-form-urlencoded'
//     },
//     method: 'GET',
//     success: function (res) {
//       wx.hideNavigationBarLoading()
//       if (message != "") {
//         wx.hideLoading()
//       }
//       if (res.statusCode == 200 && res.data.code==0) {
//         success(res.data)
//       } else {
//         fail(res)
//       }
//     },
//     fail: function (res) {
//       wx.hideNavigationBarLoading()
//       if (message != "") {
//         wx.hideLoading()
//       }
//       fail(res)
//     },
//     complete: function (res) {

//     },
//   })
// }

// GET 
function requestGet(url, message, success, fail) {
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
            if (res.statusCode == 200 && res.data.code == 0) {
                success(res.data)
            } else {
                if (res.statusCode == 401) {
                    wx.navigateTo({
                        url: '/pages/userlogin/index',
                        complete: function (res) {
                            console.log(res)
                        }
                    })
                }
                fail(res)
            }
        },
        fail: function (res) {
            wx.hideNavigationBarLoading()
            if (message != "") {
                wx.hideLoading()
            }
            fail(res)

        },
        complete: function (res) {

        },
    })
}

// GET para
function requestGetpar(url, params, message, success, fail) {
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
        method: 'GET',
        success: function (res) {
            wx.hideNavigationBarLoading()
            if (message != "") {
                wx.hideLoading()
            }
            if (res.statusCode == 200 && res.data.code == 0) {
                success(res.data)
            } else {
              if (res.statusCode == 401) {
                wx.navigateTo({
                  url: '/pages/userlogin/index',
                  complete: function (res) {
                    console.log(res)
                  }
                })
              }
                fail(res)
            }
        },
        fail: function (res) {
            wx.hideNavigationBarLoading()
            if (message != "") {
                wx.hideLoading()
            }
            fail(res)
        },
        complete: function (res) {

        },
    })
}
/**
 * @name 封装wx.request
 * @param {api.url} url 
 * @param {params.data} data 
 * @param {params.type} type 
 */
function superRequest(url, data, type) {
    return new Promise( (reslove, reject) => {
        wx.request({
            url: url,
            data: data,
            method: type, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'Content-Type': 'application/json',
                'device': JSON.stringify(device),
                'X-Token': wx.getStorageSync("token")
                // 'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res){
                // success
                if (res.statusCode == 200){
                    reslove(res)
                } else if (res.statusCode == 401) {
                    wx.navigateTo({url: '/pages/userlogin/index', })
                } else {
                    console.log(res.data.message)
                }
            },
            fail: function(res) {
                // fail
                console.log(res)
                reject(new Error(res.message))
            },
            complete: function() {
                // complete
            }
        })
    })
}
module.exports = {
    request: request,
    requestLoading: requestLoading,
    requestGet: requestGet,
    requestPost: requestPost,
    requestGetpar: requestGetpar,
    superRequest: superRequest,
    requestToken: requestToken
}