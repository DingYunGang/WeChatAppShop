// pages/申请/shengqing.js
//用户申请成为二级商，要填写一些信息到user表。
var Bmob = require("../../utils/bmob.js");
var util = require('../../utils/util.js');  
Page({
  data: {
    goodsname: '',
    goodsnum: '',
    goodsprice: '',
    receiverName: '',
    receiverMobile: '',
    arrayProvince: [],
    arraydidian: [],
    indexProvince: 0,
    indexdidian: 0,
    motto: '\n',

  },

  bindChangeProvince: function (e) { //这个没用的，我一并复制过来了
    var p = this.data.arrayProvince[e.detail.value]
    var arrayCity = district.cities(p)
    var c = arrayCity[0]

    this.setData({
      indexProvince: e.detail.value,
      arrayCity: arrayCity,
      arrayCounty: district.counties(p, c)
    })
    wx.setStorageSync('currentDistrict', [this.data.indexProvince, this.data.indexCity, this.data.indexCounty])
  },



  bindChangedidian: function (e) {//这个没用的，我一并复制过来了
    this.setData({
      indexdidian: e.detail.value
    })
    wx.setStorageSync('currentDistrict', [this.data.indexProvince, this.data.indexdidian,])
  },

  formSubmit: function (e) {
    console.log(getApp().globalData.userid);
    var inputDanwei = e.detail.value.inputDanwei;
    var inputDanyuan = e.detail.value.inputDanyuan;
    var receiverName = e.detail.value.inputName;
    var receiverMobile = e.detail.value.inputMobile
    var mima = e.detail.value.mima;

    var u = Bmob.Object.extend("_User");
    var diary2 = new Bmob.Query(u);

    diary2.get(getApp().globalData.userid, {
      success: function (diary) {
        // 自动绑定之前的账号
        diary.set("danwei", inputDanwei); //大楼名称
        diary.set("dalou", inputDanyuan); //单位名称
        diary.set("fuzeren", receiverName); //负责人名字
        diary.set("dianhuahao", receiverMobile);//电话号码
        diary.set("kouling", mima);//bmob云平台给的openid
        diary.set("shengqing",1);//申请状态是1
        diary.save();
        wx.showToast({
          title: '等待审批',
          icon: 'success',
          duration: 1000
        })
      }
    });
    var time = util.formatTime(new Date());//给商城总部推送信息
    var openid = "oUxY3w1TcVtH3RoHYwkyKmwZ6FTk"
    var temp = {
      "touser": openid,
      "template_id": "K9-6_Ayj4MLC2yvwY60-cq18tngJHAlqDfsOvv3D7a8",
      "url": "https://www.bmob.cn/",
      "data": {
        "first": {
          "value": "您收到新的二级商申请，请查看",
          "color": "#c00"
        },
        "tradeDateTime": {
          "value": time
        },
        "orderType": {
          "value": "用户申请二级商"
        },
        "customerInfo": {
          "value": receiverName
        },
        "remark": {
          "value": "如果您十分钟内再次收到此信息，请及时处理。"
        }
      }
    }

    Bmob.sendMasterMessage(temp).then(function (obj) {
      console.log('发送成功');
      console.log(obj);
    }, function (err) {
      console.log(err);
    });
  }
}
);
