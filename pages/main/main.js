//商品删除和修改页面。该页面功能很简单，就是遍历查询出所有商品，然后选择删除。
var app = getApp()
var common = require('../template/getCode.js')
var Bmob = require("../../utils/bmob.js");
var agoods = Bmob.Object.extend("agoods");
var query = new Bmob.Query(agoods);
var that;
var molist = new Array();
var iNow = 0
Page({
  data: {
    moodList: [],
    limit: 0,
    init: false,
    length: 0,
    loading: false,
    windowHeight: 0,
    windowWidth: 0
  },
  onLoad: function (options) {
    that = this;
    that.setData({
      loading: false
    })

    //查询有多少条数据,保存这个值方便页面再次进来的时候进行判断数据库是否更新
    wx.getStorage({
      key: 'user_id',
      success: function (ress) {
        if (ress.data) {
          var isme = new Bmob.User();
          isme.id = ress.data;
          // query.equalTo("publisher", isme.id);
          query.find({
            success: function (results) {
              that.setData({
                length: results.length,
              })
            }
          });
        }
      }
    })

    //每一次范围进行更新4条数据
    // this.getData()
  },
  onShow: function () { //查询所有的商品信息
   
  
    var agoods = Bmob.Object.extend("agoods");
    var chaxun = new Bmob.Query(agoods);//要查询的表为商品goods表
    that = this;
    chaxun.find({
      success: function (results) {
        that.setData({   //查询到所有的表中数据
          moodList:results,//将查询到的信息放入队列中，在wxml层显示出来。
          loading: true
        });
      
      }
    });
  },

  shanchu:function(e){ //选择某个商品，并且在数据库表中删除该条商品数据

    var shanchugoodId = e.currentTarget.dataset.id;
    console.log("id是" + shanchugoodId)

    wx.showModal({
      title: '确定删除该商品吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {

    var agoods = Bmob.Object.extend("agoods");
    var query = new Bmob.Query(agoods);
    that = this;
    query.get(shanchugoodId, {
      success: function (object) {
        // The object was retrieved successfully.
        object.destroy({
          success: function (deleteObject) {
            console.log('删除商品成功');
            wx.showToast({
              title: '删除商品成功',
              icon: 'success',
              duration: 1000
            })
         
          },

          error: function (object, error) {
            console.log('删除商品失败');
          }
        });
      },
      error: function (object, error) {
        console.log("query object fail");
      }
    });
 
        }
      }
    })

  },
  xiugai: function (e) { 
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: "/pages/XiuGaiShangPingMuLu/xiugai?goodid=" + e.currentTarget.dataset.id
    })   
  },
  onHide: function () {
    this.setData({
      init: true
    })
  },
  onReachBottom: function () {

    // this.getData()
    iNow++
  },
  onUnload: function (event) {

  },
  pullUpLoad: function (e) {
    var limit = this.data.limit + 2
    that.setData({
      limit: limit
    })
    this.onShow()
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }

})
