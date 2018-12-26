// pages/search/demand-detail/index.js
var api = require('../../../utils/api.js')
var wxrequest = require('../../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    markId:'',
    markList:'',
    region: ['湖南省', '长沙市'],
    selist: [], //标签
    seindex:'',//标签index
    business:'', //擅长领域列表
    busiType:'', //前一页面事务分类 /个人及家事类/企业及商务类/涉外及海外类
    // inputValueNext:'',//  最多可承受金额
    // busiNext: '',// 擅长领域或熟悉行业
    // regionIdNext:'', // 律师所在地区id
    // contentNext:'', //问题内容
    // markNext:'', //问题标签
    // industry:'',//向下传递熟悉行业
    postList: {
      "requirementId": String(wx.getStorageSync("requirementId")) || '0',
      "requirementTypeId": '',
      "requirementTypeName": '',
      "requirementBusiId": "",
      "requirementBusiName": '',
      "lawyerRegionId": '430100',
      "skillId": '',
      "skillName": '',
      "maxCost": '',
      "requirementContent": '',
      "tagId": '',
      "tag": '',
      "targetLawyerId": '',
      "isFirst":'1'
    }
  },
  //标签列表
  getMark:function(){
    var that = this
    var url = api.getMark() + that.data.business[that.data.index].businessTypeId
    var data = { "businessTypeId": that.data.business[that.data.index].businessTypeId}
    var success = function(data){
      data.data.list.map(function(item){
        that.data.selist.push({ "is": false })
      })
      that.setData({
        markList:data.data.list
      })
      console.log("问题标签", that.data.markList)
    }
    var fail = function(e){
      console.log(e)
    }
    wxrequest.requestGetpar(url,data,'',success,fail)
  },
  //擅长领域
  getexpert:function(){
    var that =  this
    var url = api.getExpert()
    var success = function(data){
      data.data.map(function(item){
        if (item.businessTypeId == that.data.busiType.businessTypeId){
          that.setData({
            business: item.children
          })
        }
        // console.log("对应index擅长领域列表", that.data.business)
      })
      console.log("对应index擅长领域列表", data)
    }
    var fail = function(e){
      console.log("擅长领域",e)
    }
    wxrequest.requestGet(url,'',success,fail)
  },
  //熟悉行业
  // getIndustry:function(){
  //   var that = this
  //   var url = api.getIndustryUrl()
  //   var data = { "parentId": '0' }
  //   var success = function(data){
  //     // console.log(data)
  //     that.setData({
  //       business:data.data
  //     })
  //   }
  //   var fail = function(e){
  //     console.log(e)
  //   }
  //   wxrequest.request(url,data,success,fail)
  // },
  //标签是否选中 
  isSelected:function(e){
    this.setData({
      seindex: e.currentTarget.dataset.selectindex,
      [`selist[${e.currentTarget.dataset.selectindex}].is`]: !this.data.selist[e.currentTarget.dataset.selectindex].is,
      // ['postList.tagId']: String(this.data.markList[e.currentTarget.dataset.selectindex].id),
      // ['postList.tag']: this.data.markList[e.currentTarget.dataset.selectindex].name
    })
    // console.log("selist",this.data.seindex)
    // if(selist){

    // }
  },
  //获取最高可承受费用值
  getInput:function(e){
    this.setData({
      ['postList.maxCost']:e.detail.value
    })
    // console.log(this.data.postList)
  },
  //获取问题描述
  getTextarea:function(e){
    this.setData({
      ['postList.requirementContent']:e.detail.value
    })
  },
  //region
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value,
      ['postList.lawyerRegionId']: e.detail.code[2]
    })
    // console.log("diqu",e.detail.code[2])
  },
  //选择擅长领域 
  pickerLIst:function(e){
    this.setData({
      index: e.detail.value,
      ['postList.skillId']: String(this.data.business[e.detail.value].businessTypeId),
      ['postList.skillName']: this.data.business[e.detail.value].businessTypeName
    })
    this.getMark()
    // console.log("事务分类picker", this.data.business)
  },
  //发送需求
  gotoDemandList:function(){
    var that = this 
    var tagIndexList = []
    var tagIdList = []
    var tagNameList = []
    that.data.selist.map(function(item,index){
      if(item.is){
        tagIndexList.push(index)
      }
    })
    tagIndexList.map(function(item){
      tagIdList.push(that.data.markList[item].id)
      tagNameList.push(that.data.markList[item].name)
    })
    var test= tagIdList
    // test
    that.setData({
      ['postList.tagId']: tagIdList,
      ['postList.tag']: tagNameList
    })
    console.log("标签", that.data.postList.tag)
    var par = this.data.postList
    if (!that.data.id ? par.skillId=="" || par.skillName == '' :false){
      wx.showToast({
        title: '请选择擅长领域',
        icon:'none'
      })
    }else if (par.maxCost==''){
      wx.showToast({
        title: '请填写最高可承受费用',
        icon:'none'
      })
    } else if (!(/^[0-9]*$/.test(par.maxCost))  ){
      wx.showToast({
        title: '请填写正确的最高可承受费用',
        icon:'none'
      })
    } else if (par.requirementContent==''){
      wx.showToast({
        title: '请填写问题描述',
        icon:'none'
      })
    }else{
      wx.navigateTo({
        url: '../demand-list/index?parameter=' + JSON.stringify(this.data.postList),
      })
    }

    this.data.selist.map(function(item){
      if(item.is){
        console.log(item)
      }
    })
    console.log(this.data.postList)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // markId: JSON.parse(options.busiType)
      busiType: options.busiTypes ? JSON.parse(options.busiTypes):'',//服务类型: 诉讼/仲裁 审查/起草合同....
      id:options.id ? options.id:0,
      // demandType:
      ['postList.requirementTypeId']: options.demandType ? JSON.parse(options.demandType).requireTypeId:'',
      ['postList.requirementTypeName']: options.demandType ? JSON.parse(options.demandType).requireTypeName:'',
      ['postList.requirementBusiId']: options.busiTypes ? JSON.parse(options.busiTypes).businessTypeId:'',
      ['postList.requirementBusiName']: options.busiTypes ? JSON.parse(options.busiTypes).businessTypeName: ''
    })
    console.log("leixing", JSON.parse(options.demandType))
    console.log("feilei", options.busiTypes ? 1:0)
    console.log("类型id", this.data.business)
    
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
    //擅长领域
    this.getexpert()
    // console.log("requirementId",requirementId)
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

