// pages/SellSecNum/SellSecNum.js
//二级商从user表查询自己的信息
var Bmob = require("../../utils/bmob.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    str:options.str,
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
    var zhekou2 = Bmob.Object.extend("zhekou");
    var querys = new Bmob.Query(zhekou2);
    querys.first({
      success: function (object) {
        that.setData({
          zhekou: object.get("num")
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    
  

    var _User = Bmob.Object.extend("_User");
    var query = new Bmob.Query(_User);
    query.equalTo("isSec", true);
    var that = this;
    // 查询所有数据
    query.find({
      success: function (results) {
       that.setData({
         moodList:results
       })
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