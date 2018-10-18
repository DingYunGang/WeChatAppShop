// pages/SecLirun/index.js
//二级商查询每天的销售情况，复制的sellsecgood页面，基本上差不多，改了一点点，调用了该天的时间，查询的是每天的订单情况
var Bmob = require("../../utils/bmob.js");
var util = require('../../utils/util.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '\n',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatTime(new Date());  
    console.log(time);
    var str=""
    str+=time;
    console.log(str)
    this.setData({
      time: str
    });  
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
    var that = this
    var zhekou = parseFloat(getApp().globalData.zhekou);
    console.log(getApp().globalData.userdanwei + " " + getApp().globalData.userdalou);

    var that = this;

    var val = Date.parse(that.data.time);
    var newDate = new Date(val);
    console.log(newDate.getTime() / (24 * 60 * 60 * 1000));
    

    var val2 = Date.parse(that.data.time);
    var newDate2 = new Date(val2);
    console.log(newDate2.getTime() / (24 * 60 * 60 * 1000) + 1);

    var aorder = Bmob.Object.extend("aorder");
    var query2 = new Bmob.Query(aorder);
    query2.include("agood");
    query2.equalTo("zhifu", 3);
    query2.greaterThan("chenjiaoTime", newDate.getTime() / (24 * 60 * 60 * 1000))
    query2.lessThan("chenjiaoTime", newDate2.getTime() / (24 * 60 * 60 * 1000) + 1)
    
    query2.equalTo("dalou", getApp().globalData.userdalou)
    query2.equalTo("danwei", getApp().globalData.userdanwei)
    query2.equalTo("zhifu", 3);
    // 查询所有数据
    query2.find({
      success: function (results) {
        var chen = 0;
        for (var i = 0; i < results.length; i++) {
          console.log(results[i].get("lirun"));
          chen += results[i].get("lirun");
        }
        chen *= (zhekou / 100)
        that.setData({   //查询到所有的表中数据
          moodList: results,
          loading: true,
          chen: chen,
          bili: (zhekou / 100)
        });
        console.log("分成是" + chen);
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
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