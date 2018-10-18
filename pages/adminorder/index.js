//这个是商城管理员的订单处理页面，和order-list差不多，复制过来的，就是改了一点，把未支付改成了全部订单。注释详细看那个。
var wxpay = require('../../utils/pay.js');
var util = require('../../utils/util.js');  
var Bmob = require("../../utils/bmob.js");
var molist = new Array();
var app = getApp()
Page({
  data:{
    statusType: ["全部", "待发货", "待收货",  "已完成"],
    currentType:0,
    tabClass: ["", "", "", ""],
    moodList: []
  },
  statusTap:function(e){
     var curType =  e.currentTarget.dataset.index;
     console.log("这是"+curType);
     this.data.currentType = curType
     this.setData({
       currentType:curType
     });
 
     this.onShow();
  },
  orderDetail : function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  cancelOrderTap:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    console.log("id是"+orderId);
     wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          var aorder = Bmob.Object.extend("aorder");
          var query = new Bmob.Query(aorder);
          query.get(orderId, {
            success: function (object) {
           
              object.destroy({
                success: function (deleteObject) {
                  console.log('删除订单成功');
                  that.onShow();
                  wx.showToast({
                    title: '删除订单成功',
                    icon: 'success',
                    duration: 1000
                  })  
                },
                error: function (object, error) {
                  console.log('删除订单失败');
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
  querenshouhuo:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定买家已经收到货物吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          var aorder = Bmob.Object.extend("aorder");
          var query = new Bmob.Query(aorder);
          query.get(orderId, {
            success: function (result) {
              var time = util.formatTime(new Date());
              var myDate = new Date();
              result.set("chenjiaoTime", myDate.getTime() / (24 * 60 * 60 * 1000))
              result.set("shouhuoTime", time);//记录下当时的时间，用于比较时间的大小
              console.log("收货时间是：" + time);
              result.set('zhifu', 3); //将订单支付状态改为3，已完成
              result.save();
              that.onShow();
            },
            error: function (object, error) {
              console.log("错误");
            }
          });
        }
      }
    })
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
   
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
 
  },
  getOrderStatistics : function () {
    var that = this;
    //设置模拟数据

      that.setData({
          tabClass: ['red-dot','','',''],
      });

 
  },
  fahuo:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    console.log("id是" + orderId);
    wx.showModal({
      title: '确定要发货吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          var aorder = Bmob.Object.extend("aorder");
          var query = new Bmob.Query(aorder);
          query.get(orderId, {
            success: function (result) {
              var time = util.formatTime(new Date()); 
              console.log("时间"+time);
             result.set('zhifu', 2);
            result.set("fahuotime",time);
             result.save();
             that.onShow();
            },
            error: function (object, error) {
              console.log("错误");
            }
          });


        }
      }
    })
  },
  onShow:function(){
    // 获取订单列表
    wx.showLoading();
    var that = this;
   
    var aorder = Bmob.Object.extend("aorder");
    var chaxun = new Bmob.Query(aorder);//要查询的表为订单表
    that = this;
    // var test3 = getApp().globalData.userid;

    chaxun.include("user");
    chaxun.include("agood");
    // chaxun.equalTo("user",test3);
    var tt = that.data.currentType;
    if(tt==0){
      chaxun.notEqualTo("zhifu",tt);
      chaxun.find({
        success: function (results) {
          that.setData({
            moodList: results,
            loading: true
          })
        },
        error: function (error) {
          // common.dataLoading(error, "loading");
          that.setData({
            loading: true
          })
          console.log(error)
        }
      });
    } else{
      chaxun.equalTo("zhifu", tt);
    chaxun.find({
      success: function (results) {
          that.setData({
          moodList:results,
          loading: true
        })
      },
      error: function (error) {
        // common.dataLoading(error, "loading");
        that.setData({
          loading: true
        })
        console.log(error)
      }
    });
    }
    this.getOrderStatistics();
      wx.hideLoading();
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
 
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
 
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
   
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  
  }
})