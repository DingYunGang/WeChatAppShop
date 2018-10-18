// pages/personsec/index.js
//这个页面很简单，就是二级商从user表查看自己的信息
var Bmob = require("../../utils/bmob.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '\n',//回车符
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    var that =this;
   var objectid = getApp().globalData.userid;
   var secadmin = Bmob.Object.extend("_User");
   var query = new Bmob.Query(secadmin);
 
   query.get(objectid, {
     success: function (result) {
      that.setData({
        danwei : result.get("danwei"), //获取到自己的单位信息
        dalou :result.get("dalou"),   //大楼信息
        dianhuahao: result.get("dianhuahao"), //电话号码
        fuzeren: result.get("fuzeren")       //负责人
      })  
     },         //在wxml层显示出来
     error: function (object, error) { 
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