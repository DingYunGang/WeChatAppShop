// pages/classify/classify.js
//这个页面是商品分类的页面
var Bmob = require('../../utils/bmob.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    content:'',
    left: ''
  },

  typeSelect: function(event) { //查询出分类信息
    var that = this;
    this.setData({
      type: event.target.dataset.classify //点击的分类，数字
    })
    var Diary = Bmob.Object.extend("agoods");
    var query = new Bmob.Query(Diary);
    query.equalTo("fenlei", event.target.dataset.classify); //查询出等于分类数字的所有商品
    // 查询所有数据
    query.find({
      success: function (results) { 
        console.log("共查询到 " + results.length + " 条记录");
        var res = new Array();
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var obj = new Object();;
          obj.name = results[i].attributes.name;
          obj.img = results[i].attributes.picture.url;
          obj.objectId = results[i].id;
          res[i] = obj
        }
  
        // 设置数据
        that.setData({
          content: res
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { //查询分类表中有多少个分类，然后显示出来
    var that = this;
    // 左侧数据
    var Diary = Bmob.Object.extend("classify");
    var query = new Bmob.Query(Diary);
    query.descending('fenlei');
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        // 循环处理查询到的数据
        var res = new Array();
        for (var i = 0; i < results.length; i++) {
          var obj = new Object();;
          obj.name = results[i].attributes.fenleiname;
          obj.id = results[i].attributes.fenlei;
          res[i] = obj
        }
        res.reverse(); 
        that.setData({
          left: res
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });


    // 右侧数据
    var Diary = Bmob.Object.extend("agoods"); //先初始化，查询分类数是1的商品
    var query = new Bmob.Query(Diary);
    query.equalTo("fenlei", '1');
    // 查询所有数据
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        var res = new Array();
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var obj = new Object();;
          obj.name = results[i].attributes.name;
          obj.img = results[i].attributes.picture.url;
          obj.objectId = results[i].id;
          res[i] = obj
        }
        // 设置数据
        that.setData({
          content: res
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
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