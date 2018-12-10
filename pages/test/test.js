//index.js
//获取应用实例
var tcity = require("../../region.js");

var app = getApp()
Page({
  data: {
    provinces: [],
    province: "",
    citys: [],
    citysIds:[],
    city: "",
    countys: [],
    countysIds:[],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    regionId:''
  },
  bindChange: function (e) {
    // console.log('asdsa',e.detail.value);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      console.log('province no ');
      const citys = [];
      const countys = [];
      const citysIds = []
      const countysIds = []
      for (let i = 0; i < cityData[val[0]].child.length; i++) {
        citys.push(cityData[val[0]].child[i].name)
      }
      for (let i = 0; i < cityData[val[0]].child[0].child.length; i++) {
        countys.push(cityData[val[0]].child[0].child[i].name)
      }
      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].child[0].name,
        citys: citys,
        county: cityData[val[0]].child[0].child[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0],
        countysIds: countysIds,
        citysIds: citysIds
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].child[val[1]].child.length; i++) {
        countys.push(cityData[val[0]].child[val[1]].child[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].child[val[1]].child[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  onLoad: function () {
    console.log("onLoad");
    var that = this;

    tcity.init(that);

    var cityData = that.data.cityData;


    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      // provinces.push({ "name": cityData[i].name, "id": cityData[i].regionId});
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].child.length; i++) {
      // citys.push({ 'name': cityData[0].child[i].name, 'id': cityData[0].child[i].regionId})
      citys.push(cityData[0].child[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].child[0].child.length; i++) {
      // countys.push({ "name": cityData[0].child[0].child[i].name, "id": cityData[0].child[0].child[i].name})
      countys.push(cityData[0].child[0].child[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].child[0].name,
      'county': cityData[0].child[0].child[0].name
    })
    console.log('初始化完成',that.data.citys);
  }
})