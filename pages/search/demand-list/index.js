// pages/search/demand-list/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
var formatTime = require('../../../utils/util.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        listIndex: '',
        getPage: 10,
        parameter: '',
        noFilter: {
            "regionId": '430100',
            "lawyerName": '',
            "practiceYearId": '',
            "sex": '',
            "industryId": '',
            "baseSkillId": '',
            "otherSkillId": '',
            "langSkillId": '',
            "courtId": '',
            "procuratorateId": '',
            "positionId": '',
            "honorId": '',
            "socialId": '',
            "depositAmountId": '',
            "lexMungId": '',
            "orgId": '',
            "businessTypeId": ''
        }
    },
    //index
    getIndex: function (e) {
        this.setData({
            listIndex: e.currentTarget.dataset.index,
            ['parameter.targetLawyerId']: this.data.lawyerList[e.currentTarget.dataset.index].memberId
        })
        console.log(this.data.parameter)
    },
    //搜索律师
    searchLawyer: function () {
        var that = this
        // var noFilter = noFilter
        var url = api.getSearchLawyer() + "1/" + that.data.getPage
        var data = that.data.noFilter
        // console.log("上传参数")
        var success = function (data) {
            console.log("搜索成功", data)
            wx.hideLoading()
            that.setData({
                lawyerList: data.data.list,
            })
            // 成功后调用onShow刷新页面
            that.onShow()
            that.onShow()
        }
        var fail = function (e) {
            wx.hideLoading()
            wx.showToast({
                title: '获取数据失败',
            })
            console.log(e)
        }
        // console.log("筛选参数", searchlawyerData)
        wxrequest.request(url, data, success, fail)
        wx.showLoading({
            title: '正在加载',
        })
    },
    //发送需求
    sendDemand: function (e) {
        var that = this
        that.setData({
            listIndex: e.currentTarget.dataset.index,
            ['parameter.targetLawyerId']: String(that.data.lawyerList[e.currentTarget.dataset.index].memberId)
        })
        var url = api.getPublish()
        var data = that.data.parameter
        var success = function (data) {
            wx.showToast({
                title: '发送需求成功',
                success() {
                    // wx.setStorageSync("requirementId", wx.getStorageSync("requirementId") + 1)
                    wx.setStorageSync("requirementId", data.data.requirementId)
                    that.setData({
                        ['parameter.requirementId']: wx.getStorageSync("requirementId")
                    }, function () {
                        wx.navigateTo({
                            url: '../../message/index'
                        })
                    })
                }
            })
            console.log(data)
        }
        var fail = function (e) {
            wx.showToast({
                title: '发送请求失败,已有需求或总需求超过5条',
                icon: 'none'
            })
            console.log(e)
        }
        console.log("请求参数", that.data.parameter)
        wxrequest.request(url, data, success, fail)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            parameter: JSON.parse(options.parameter),
            ['noFilter.regionId']: JSON.parse(options.parameter).lawyerRegionId,
            ['noFilter.businessTypeId']: JSON.parse(options.parameter).skillId ? JSON.parse(options.parameter).skillId : ''
        })

        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2]; //上一个页面

        //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
            postList: JSON.parse(options.parameter)
        })
        //筛选条件
        // console.log(JSON.parse(options.parameter))
        // noFilter.regionId = options.parameter.lawyerRegionId
        this.searchLawyer()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var yearList = []
        var addressList = []
        var that = this
        this.data.lawyerList ? this.data.lawyerList.map(function (item) {
            yearList.push(formatTime.formatTime(new Date()).split("/")[0] - item.beginPracticeDate.split("-")[0])
        }) : ''
        that.data.lawyerList ? that.data.lawyerList.map(function (item) {
            addressList.push(item.region.split('-', 2))
        }) : ''
        this.setData({
            year: yearList,
            address: addressList,
            // region: region.citysData
        })

        console.log("indexxxxxx", this.data.lawyerList)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})