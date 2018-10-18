//顾客订单处理页面

var wxpay = require('../../utils/pay.js')
var Bmob = require("../../utils/bmob.js");
var util = require('../../utils/util.js');  
var molist = new Array();
var app = getApp()
Page({
  data:{
    statusType: ["待付款", "待发货", "待收货",  "已完成"],//四种状态
    currentType:0,
    tabClass: ["", "", "", ""],
    moodList: []
  },
  statusTap:function(e){ //点击4个选项。
     var curType =  e.currentTarget.dataset.index;
     console.log("这是"+curType);
     this.data.currentType = curType
     this.setData({
       currentType:curType
     });
 
     this.onShow(); 
  },
  // orderDetail : function (e) {
  //   var orderId = e.currentTarget.dataset.id;
  //   wx.navigateTo({
  //     url: "/pages/order-details/index?id=" + orderId
  //   })
  // },
  cancelOrderTap:function(e){  //取消订单功能，微信退款加在这里
    var that = this; 
    var orderId = e.currentTarget.dataset.ss;
    console.log("oederid是"+orderId);
     wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {//点击确认取消订单
// 
// 
// 这里一大段就把微信的退款的那一段代码复制上去。
// 
// 


//下面的是从订单表里删除该订单        
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
  toPayTap:function(e){  //顾客支付
    var that = this;
    var id = e.currentTarget.dataset.id;
// 
// 
//     
//从这里开始，把微信支付的那一段代码复制粘贴，确认支付成功后，就把后面的一大段代码执行。
//
// 
// 
// 

      wx.showModal({   //这只是一个显示框，弹出一个窗口
          title: '温馨提示',
          content: '支付成功',
          showCancel: false
      })
      var aorder = Bmob.Object.extend("aorder");//修改订单信息
      var query = new Bmob.Query(aorder);
      // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
      query.get(id, {
        success: function (result) { 
           var dalou = result.get("dalou") //获取订单中的大楼和单位信息
           var danwei = result.get("danwei")
           console.log(dalou);
           console.log(danwei);
          result.set('zhifu',1); //zhifu等于1代表已支付。
          result.save();
      
          var u = Bmob.Object.extend("_User"); //调用user用户表
          var diary2 = new Bmob.Query(u);
          diary2.equalTo("dalou",dalou),  //匹配大楼和单位
          diary2.equalTo("danwei", danwei)
          diary2.first({     //找到匹配的二级商用户
            success: function (object) {
              var kouling = object.get("kouling") //取出二级商的口令
                 var time = util.formatTime2(new Date()); //获取当前时间，调用了util文件里面的时间函数
      var temp2 = {  //从113行到141行是推送消息的模板，在bmob文档中有抄
        "touser": kouling, //这个就是要推送的openid。要更改推送用户，只要改这一行的信息就行
        "template_id": "K9-6_Ayj4MLC2yvwY60-cq18tngJHAlqDfsOvv3D7a8",//模板信息
        "url": "https://www.bmob.cn/",
        "data": {
          "first": {
            "value": "您收到新的订单，请查看",
            "color": "#c00"
          },
          "tradeDateTime": {
            "value": time
          },
          "orderType": {
            "value": "普通购买"
          },
          "customerInfo": {
            "value": "商城顾客"
          },
          "remark": {
            "value": "如果您十分钟内再次收到此信息，请及时处理。"
          }
        }
      }
      Bmob.sendMasterMessage(temp2).then(function (obj) { //发送消息
        console.log('发送成功');
        console.log(obj);
      }, function (err) {
        console.log(err);
      });
            },
            error: function (error) {
              console.log("查询失败: " + error.code + " " + error.message);
            }
          });
          that.onShow(); //重新刷新页面
        },
        error: function (object, error) {
        }
          
      });
      var time = util.formatTime(new Date()); //这个是消息推送，从bmob文档抄的
      var openid = "oUxY3w1TcVtH3RoHYwkyKmwZ6FTk"//推送给该商城总部，这个是老板的openid。
      var temp = {
        "touser": openid, 
        "template_id": "K9-6_Ayj4MLC2yvwY60-cq18tngJHAlqDfsOvv3D7a8",
        "url": "https://www.bmob.cn/",
        "data": {
          "first": {
            "value": "您收到新的订单，请查看",
            "color": "#c00"
          },
          "tradeDateTime": {
            "value": time
          },
          "orderType": {
            "value": "普通购买"
          },
          "customerInfo": {
            "value": "商城顾客"
          },
          "remark": {
            "value": "如果您十分钟内再次收到此信息，请及时处理。"
          }
        }
      }
      Bmob.sendMasterMessage(temp).then(function (obj) {
        console.log('发送成功');
        console.log(obj);
      }, function (err) {
        console.log(err);
      });
      wx.reLaunch({
          url: "/pages/index/index"
      });
   
  },
  okorder:function(e){ //确认收货
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定收到货物吗？',
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
              result.set("shouhuoTime",time);//记录下当时的时间，用于比较时间的大小
              console.log("收货时间是："+time);
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
  onShow:function(){   //查询订单
    // 获取订单列表
    wx.showLoading();
    var that = this;
    
    var aorder = Bmob.Object.extend("aorder");
    var chaxun = new Bmob.Query(aorder);//要查询的表为订单表
    that = this;
  
    var testuname = getApp().globalData.userid;//获取用户全局变量id
    chaxun.equalTo("users", testuname);//只能查询自己的订单
    chaxun.include("user");
    chaxun.include("address");
    chaxun.include("agood");
    var tt = that.data.currentType;//点击的选择框数字是几
    chaxun.equalTo("zhifu",tt); //就选择显示出订单状态为几的状态

    chaxun.find({  //查询出的结果存入列表中
      success: function (results) {
          that.setData({
          moodList:results,//将moodList列表中的信息在wxml中遍历。
          loading: true
        })
      },
      error: function (error) {
        that.setData({
          loading: true
        })
        console.log(error)
      }
    });



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