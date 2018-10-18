//页面本来的功能是赋予二级商权限，但是因为更新，用户表中无法更新其他用户的信息，所以此表功能作废。
var Bmob = require("../../utils/bmob.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '\n',//这个东西是页面wxml里面换行用的
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
    var u = Bmob.Object.extend("_User");
    var query = new Bmob.Query(u);
    var that = this;
    query.equalTo("shengqing",1);
    query.find({
      success: function (objects) {
        // console.log(object.id);
        // getApp().globalData.userid = object.id;

     
        that.setData({
         List: objects
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },
  fuyu:function(e){
    var orderId = e.currentTarget.dataset.id;
    console.log(orderId)
    wx.showModal({
      title: '确定要赋予权限吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showModal({
            title: '处理方法',
            content: '进入Bmob后端云数据库，将User表中该用户的isSec改成true，shengqing改为0',
            showCancel: false
          })
        }
      }
    })
  },
  jujue: function (e) {
    var orderId = e.currentTarget.dataset.id;
    console.log(orderId)
    wx.showModal({
      title: '确定要拒绝请求吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showModal({
            title: '处理方法',
            content: '进入Bmob后端云数据库，将User表中该用户的shengqing信息改为0',
            showCancel: false
          })
        }
      }
    })
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