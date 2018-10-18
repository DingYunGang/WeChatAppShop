// pages/SellSecGood/SellSecGood.js
//商城总部的订单分析，查询的是卖出的订单情况。
var Bmob = require("../../utils/bmob.js");
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
  this.setData({
    str: options.str,//从enquire页面传递过来的起始时间
    id: options.id,
    danwei: options.danwei,
    dalou: options.dalou,
    str2: options.str2,//从enquire页面传递过来的截止时间
    zhekou: options.zhekou//从enquire页面传递过来的订单折扣
  })
  
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
     var that =this
    var zhekou =parseFloat(that.data.zhekou)
   
    var val = Date.parse(that.data.str);//将起始时间转换为时间戳，用于比较大小
    var newDate = new Date(val);
    console.log(newDate.getTime() / (24 * 60 * 60 * 1000));

    var val2 = Date.parse(that.data.str2);//将截止时间转换为时间戳，用于比较大小
    var newDate2 = new Date(val2);
    console.log(newDate2.getTime() / (24 * 60 * 60 * 1000) + 1);


    var aorder = Bmob.Object.extend("aorder");//操作订单表
    var query2 = new Bmob.Query(aorder);
    query2.include("agood");//关联商品表，这一行代码其实没用了
    console.log("ceshi " + that.data.dalou + " " + that.data.danwei)//输出信息
    query2.equalTo("dalou", that.data.dalou)//订单表与二级商大楼匹配
    query2.equalTo("danwei", that.data.danwei)///订单表与二级商单位匹配
    query2.equalTo("zhifu", 3);//查询订单状态为已完成的
    query2.greaterThan("chenjiaoTime", newDate.getTime() / (24 * 60 * 60 * 1000))//大于起始时间
    query2.lessThan("chenjiaoTime", newDate2.getTime() / (24 * 60 * 60 * 1000) + 1)//小于截止时间
    // 查询所有数据
    query2.find({
      success: function (results) {
         var chen =0;
        for(var i=0;i<results.length;i++){
          console.log(results[i].get("lirun"));//统计利润
          chen += results[i].get("lirun");
        }
        chen*=(zhekou/100) //利润乘以折扣
        that.setData({   //查询到所有的表中数据，存入data中，显示在wxml显示层。
          moodList: results,
          loading: true,
          chen:chen,
          bili: (zhekou / 100)
        });
        console.log("分成是"+chen);
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
    console.log("ceshi " + this.data.dalou)
  }
})