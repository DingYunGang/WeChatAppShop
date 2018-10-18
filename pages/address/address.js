//添加地址页面，选择二级商的地址添加，还有一个地址添加是没有二级商的，address2
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
    var chaxun = new Bmob.Query(_User);//要查询的表为user表，将二级商的地址保存在队列中放入选择器
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
  bindChangeProvince: function(e) { //选择省份
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

  bindChangeCity: function(e) {  //选择城市
    var p = this.data.arrayProvince[this.data.indexProvince]
    var c = this.data.arrayCity[e.detail.value]
    this.setData({
      indexCity: e.detail.value,
      arrayCounty: district.counties(p,c)
    })
    wx.setStorageSync('currentDistrict', [this.data.indexProvince, this.data.indexCity, this.data.indexCounty])
  },

  bindChangeCounty: function(e) { //选择县区
    this.setData({
      indexCounty: e.detail.value
    })
    wx.setStorageSync('currentDistrict', [this.data.indexProvince, this.data.indexCity, this.data.indexCounty])
  },

  chaxun: function (e) { //选择好第一个单位地址后，查询该单位地址有哪些大楼，并存入选择器
    var that = this;
    var _User = Bmob.Object.extend("_User");
    var chaxun2 = new Bmob.Query(_User);
    chaxun2.equalTo("isSec", true);
    console.log("查询的是" + that.data.arraydanyuan[that.data.indexdanyuan]);
    chaxun2.equalTo("danwei", that.data.arraydanyuan[that.data.indexdanyuan]);
    chaxun2.find({
      success: function (results) {
        console.log(results.length);
        for (var i = 0; i < results.length; i++) {
          var danwei = results[i].get("dalou");
          molist3.push(danwei);
        }
        console.log(molist3);

        that.setData({
          arraydanwei: molist3,
          index: 0
        });
        console.log("单位是" + that.data.arraydanwei)
        molist3.length = 0;
      }

    })

  },
  bindChangedanyuan: function (e) { //选择单元地址
    var that = this;
    console.log(that.data.arraydanyuan[e.detail.value])
    this.setData({
      indexdanyuan: e.detail.value
    })
    that.chaxun();
  },
  bindChangeXiaoqu: function (e) { //选择大楼，小区地址

    var that = this;
    console.log("选中的是" + that.data.arraydanyuan[that.data.indexdanyuan]);
    var c = that.data.arraydanwei[e.detail.value];
    console.log(c);
    that.setData({
      index: e.detail.value
    })
  },
  formSubmit: function(e) { //提交地址信息到地址表保存
    var Address = Bmob.Object.extend("Address");
    var address = new Address();
    

     var detailAddress =  e.detail.value.inputDetail;
     var zhuzhailouhao = e.detail.value.inputhouse;
     var menpaihao = e.detail.value.inputdoor;
     var receiverName  =  e.detail.value.inputName;
     var receiverMobile = e.detail.value.inputMobile;
   
     address.set("sheng", this.data.arrayProvince[this.data.indexProvince]);
     address.set("shi", this.data.arrayCity[ this.data.indexCity]);
     address.set("xian", this.data.arrayCounty[this.data.indexCounty]);
     address.set("xiangxidizhi", this.data.arraydanyuan[this.data.indexdanyuan]);
     address.set("name", receiverName);
     address.set("phoneNum",receiverMobile);
     address.set("louhao", this.data.arraydanwei[this.data.index] );
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
  formReset:function(){ //没有二级商地址，用另外的页面添加地址
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
