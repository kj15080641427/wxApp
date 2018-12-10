
//获取应用实例
var app = getApp();

var cityData = require('../../region.js');

Page({
  data: {
    citysData: cityData.citysData,
    provinces: [],
    citys: [],
    areas: [],
    value: [0, 0, 0],
    name: '',
    regionId:'',
    index:''
  },

  initData: function () {
    var provinces = [];
    var citys = [];
    var areas = [];

    this.data.citysData.forEach(function (province, i) {
      provinces.push(province.name);
      if (i === 0) {
        citys.push(province.child[i].name);
        areas = province.child[i].child;
      }
    });

    this.setData({
      provinces: provinces,
      citys: citys,
      areas: areas
    });
  },

  bindChange: function (e) {
    var citysData = this.data.citysData;
    var value = this.data.value;
    var current_value = e.detail.value;
    var citys = [];

    var provinceObj = {};
    var cityObj = {};

    this.setData({
      index: e.detail.value
    })
    provinceObj = citysData[current_value[0]];

    if (value[0] !== current_value[0]) {
      // 滑动省份
      provinceObj.child.forEach(function (v) {
        citys.push(v.name);
      });
      this.setData({
        citys: citys
      });
      console.log(this.data.areas)

      cityObj = provinceObj.child[0];
      this.setData({
        areas: cityObj.child,
        value: [current_value[0], 0, 0]
      });

    } else if (value[0] === current_value[0] && value[1] !== current_value[1]) {
      // 滑动城市
      if (current_value[1] >= provinceObj.child.length) {
        // 数据不存在 跳过
        return;
      }
      cityObj = provinceObj.child[current_value[1]];
      this.setData({
        areas: cityObj.child,
        value: [current_value[0], current_value[1], 0]
      });
      console.log(this.data.areas)
    } else {
      // 滑动区县
      cityObj = provinceObj.child[current_value[1]];
      this.setData({
        value: current_value,
        regionId: this.data.areas[this.data.value[2]].regionId
      });
      console.log(this.data.areas[this.data.value[2]].regionId)
    }

    this.setData({
      name: provinceObj.name + '-' + cityObj.name + '-' + cityObj.child[this.data.value[2]].name
    });
  },

  // 页面初始化事件
  onLoad: function () {
    this.initData();
  },
  showModal: function () {
    // 显示遮罩层
    wx.hideTabBar({})
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(200).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
    wx.showTabBar({})
  },
  showid:function(e){
    if(this.data.index){
      this.setData({
        regionId: this.data.areas[this.data.index[2]]
      })
      console.log(this.data.index[2])
      console.log(this.data.areas[this.data.index[2]])
    }else{
      this.setData({
        regionId:this.data.areas[0]
      })
      console.log(this.data.regionId)
    }
  }
});