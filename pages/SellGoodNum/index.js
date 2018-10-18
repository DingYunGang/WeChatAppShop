// pages/SellGoodNum/index.
//商城总部的订单分析，查询的是卖出的商品情况，和其他几个页面都类似，有大量的重复代码。注释详情看SellSecgood页面
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
      str: options.str,
      str2: options.str2
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
    var that = this;
    var val = Date.parse(that.data.str);
    var newDate = new Date(val);
    console.log(newDate.getTime() / (24 * 60 * 60 * 1000));

    var val2 = Date.parse(that.data.str2);
    var newDate2 = new Date(val2);
    console.log(newDate2.getTime() / (24 * 60 * 60 * 1000) + 1);

    var aorder = Bmob.Object.extend("aorder");
    var query = new Bmob.Query(aorder);
    query.include("agood");
    query.equalTo("zhifu", 3);
    query.greaterThan("chenjiaoTime", newDate.getTime() / (24 * 60 * 60 * 1000))
    query.lessThan("chenjiaoTime", newDate2.getTime() / (24 * 60 * 60 * 1000) + 1)
    // 查询所有数据
    query.find({
      success: function (results) {
        that.setData({   //查询到所有的表中数据
          moodList: results,
          loading: true
        });
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