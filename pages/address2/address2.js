//与address地址添加页面差不多，就是复制过来的，区别是单位小区和大楼不是选择二级商，而是自己手动填写的
const address = require('../../utils/address.js')
const district = require('../../utils/address_data.js')
var Bmob = require("../../utils/bmob.js");
var molist = new Array();
var molist2 = new Set();
var molist3 = new Array();
var molist4 = new Array();
Page({
  data: {
    detailAddress: '',
    zhuzhailouhao:'',
    menpaihao:   '',
    receiverName:'',
    receiverMobile:'',
    arrayProvince: [],
    arrayCity: [],
    arrayCounty: [],
    indexProvince: 0,
    indexCity: 0,
    indexCounty: 0,
    indexdanyuan: 0,
    index: 0,
    arraydanyuan: [],
    arraydanwei: []
  },
  onShow: function () {

    var _User = Bmob.Object.extend("_User");
    var chaxun = new Bmob.Query(_User);//要查询的表为address地址表
    var that = this;
    chaxun.equalTo("isSec", true);
    chaxun.find({
      success: function (results) {
        console.log(results.length);
        for (var i = 0; i < results.length; i++) {
          var danwei = results[i].get("danwei");
          molist2.add(danwei)
        }
        console.log(molist2.size);
        let molist = Array.from(molist2);

        that.setData({
          arraydanyuan: molist
        });

      }

    })

  },
  bindChangeProvince: function(e) {
    var p = this.data.arrayProvince[e.detail.value]
    var arrayCity = district.cities(p)
    var c = arrayCity[0]

    this.setData({
      indexProvince: e.detail.value,
      arrayCity: arrayCity,
      arrayCounty: district.counties(p,c)
    })
    wx.setStorageSync('currentDistrict', [this.data.indexProvince, this.data.indexCity, this.data.indexCounty])
  },

  bindChangeCity: function(e) {
    var p = this.data.arrayProvince[this.data.indexProvince]
    var c = this.data.arrayCity[e.detail.value]
    this.setData({
      indexCity: e.detail.value,
      arrayCounty: district.counties(p,c)
    })
    wx.setStorageSync('currentDistrict', [this.data.indexProvince, this.data.indexCity, this.data.indexCounty])
  },

  bindChangeCounty: function(e) {
    this.setData({
      indexCounty: e.detail.value
    })
    wx.setStorageSync('currentDistrict', [this.data.indexProvince, this.data.indexCity, this.data.indexCounty])
  },




  formSubmit: function(e) {
    var Address = Bmob.Object.extend("Address");
    var address = new Address();
  
     var menpaihao = e.detail.value.inputdoor;
     var receiverName  =  e.detail.value.inputName;
     var receiverMobile = e.detail.value.inputMobile;
     var receiverdanwei = e.detail.value.inputdanwei;
     var receiverdalou = e.detail.value.inputdalou;

     address.set("sheng", this.data.arrayProvince[this.data.indexProvince]);
     address.set("shi", this.data.arrayCity[ this.data.indexCity]);
     address.set("xian", this.data.arrayCounty[this.data.indexCounty]);
     address.set("xiangxidizhi", receiverdanwei);
     address.set("name", receiverName);
     address.set("phoneNum",receiverMobile);
     address.set("louhao", receiverdalou );
     address.set("menpaihao", menpaihao);
     var isme = getApp().globalData.userid;
     address.set("users", isme);
     
     address.save(null, {
       success: function (result) {
         console.log('地址创建成功');
         wx.showToast({
           title: '添加成功',
           icon: 'success',
           duration: 1000
         })
       },
       error: function (result, error) {
         // 添加失败
         console.log('创建地址失败');
         wx.showToast({
           title: '添加失败',
           icon: 'loading',
           duration: 1000
         })
       }
     });

  
  },
  formReset:function(){
    wx.navigateTo({
      url: '/pages/address2/address2',
    })
  },

  onLoad (params) {
    var currentDistrict = wx.getStorageSync('currentDistrict') || [0, 0, 0]
    var arrayProvince = district.provinces()
    var arrayCity     = district.cities(arrayProvince[currentDistrict[0]])
    var arrayCounty   = district.counties(arrayProvince[currentDistrict[0]], arrayCity[currentDistrict[1]])

    this.setData({
      indexProvince:  currentDistrict[0],
      indexCity:      currentDistrict[1],
      indexCounty:    currentDistrict[2],
      arrayProvince:  arrayProvince,
      arrayCity:      arrayCity,
      arrayCounty:    arrayCounty,
      detailAddress:  wx.getStorageSync('detailAddress'),
      receiverName:   wx.getStorageSync('receiverName'),
      receiverMobile: wx.getStorageSync('receiverMobile')
    })
  }
})
