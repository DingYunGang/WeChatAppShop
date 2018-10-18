//商城总部的订单分析处理，主要功能就是用6个框读取出要查询的起止日期和截止日期。然后传到后面的页面去。
var Bmob = require("../../utils/bmob.js");
Page({
 data:{
   motto: '\n',
 },

  inputyear: function (e) {
   this.setData({
     year: e.detail.value
   })
    // console.log(e.detail.value);

  },
  inputyear2: function (e) {
    this.setData({
      year2: e.detail.value
    })
    // console.log(e.detail.value);

  },

  inputmonth: function (e) {
    this.setData({
     month: e.detail.value
    })
    // console.log(e.detail.value);

  },
  inputmonth2: function (e) {
    this.setData({
      month2: e.detail.value
    })
    // console.log(e.detail.value);

  },

  inputday: function (e) {
    this.setData({
      day: e.detail.value
    })
    // console.log(e.detail.value);

  },
  inputday2: function (e) {
    this.setData({
      day2: e.detail.value
    })
    // console.log(e.detail.value);

  },



  formSubmit: function (e) {
    var str="";
    str += this.data.year;
    str +='-';
    str += this.data.month;
    str+='-';
    str += this.data.day;
   
    var str2 = "";
    str2 += this.data.year2;
    str2 += '-';
    str2 += this.data.month2;
    str2 += '-';
    str2 += this.data.day2;
    // var val = Date.parse(str);
    // var newDate = new Date(val);
    // console.log(newDate.getTime() / (24 * 60 * 60 * 1000));
    wx.navigateTo({
      url: '/pages/SellSecNum/SellSecNum?str=' + str + '&str2=' + str2,
    })
  },
  formdingdan:function(e){
    var str = "";
    str += this.data.year;
    str += '-';
    str += this.data.month;
    str += '-';
    str += this.data.day;
    

    var str2 = "";
    str2 += this.data.year2;
    str2 += '-';
    str2 += this.data.month2;
    str2 += '-';
    str2 += this.data.day2;
    // console.log(str2)
wx.navigateTo({
  url: '/pages/orderListTotal/index?str='+str+'&str2='+str2,
})
  },
  formgood:function(e){
    var str = "";
    str += this.data.year;
    str += '-';
    str += this.data.month;
    str += '-';
    str += this.data.day;


    var str2 = "";
    str2 += this.data.year2;
    str2 += '-';
    str2 += this.data.month2;
    str2 += '-';
    str2 += this.data.day2;
    wx.navigateTo({
      url: '/pages/SellGoodNum/index?str=' + str + '&str2=' + str2,
    })
  },
  formpricecount:function(e){
    var str = "";
    str += this.data.year;
    str += '-';
    str += this.data.month;
    str += '-';
    str += this.data.day;

    var str2 = "";
    str2 += this.data.year2;
    str2 += '-';
    str2 += this.data.month2;
    str2 += '-';
    str2 += this.data.day2;
    wx.navigateTo({
      url: '/pages/SellPriceCount/SellPriceCount?str=' + str + '&str2=' + str2,
    })
  }

})