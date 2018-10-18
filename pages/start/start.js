//login.js
//获取应用实例
//开始页面，商城进入的第一个页面
var app = getApp();
var util = require('../../utils/util.js');  
var Bmob = require("../../utils/bmob.js");
Page({
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  goToIndex:function(){ //用户的登录与注册功能，这段代码是从bmob文档里面抄来的
    var user = new Bmob.User();
      wx.login({ //调用用户登录接口
        success: function (res) {
          user.loginWithWeapp(res.code).then(function (user) { 
            var openid = user.get("authData").weapp.openid;//获取openid
            console.log(user, 'user', user.id, res); //输出个人信息
            if (user.get("nickName")) { //如果在user表里面已经有信息了，就可以登录
              // 第二次访问
              var u = Bmob.Object.extend("_User");
              var query = new Bmob.Query(u); //那么取出改用户的信息
              getApp().globalData.userid = user.id;//将用户的id存为系统全局变量
              console.log("用户是 "+user.get("isAdmin"))
            } else { //user表中没有用户信息，说明用户是第一次访问
              //保存用户其他信息
              wx.getUserInfo({ 
                success: function (result) {
                  var userInfo = result.userInfo;//获取用户头像，昵称等信息
                  var nickName = userInfo.nickName;
                  var avatarUrl = userInfo.avatarUrl;

                  var u = Bmob.Object.extend("_User");//调用user表用到的代码
                  var query = new Bmob.Query(u);//调用user表用到的代码
                  query.get(user.id, {  //将用户信息存入user表，完成注册。
                    success: function (result) {
                      // 自动绑定之前的账号
                      result.set("isSec",false); //不是二级商
                      result.set("isAdmin",false);//不是管理者
                      result.set('nickName', nickName);//下面是存放头像昵称等等3个信息
                      result.set("userPic", avatarUrl);
                      result.set("openid", openid);
                      result.save();//保存
                    }
                  });
                  console.log("是 "+user.id);
                  getApp().globalData.userid = user.id;
                }
              });
            }
          }, function (err) {
            console.log(err, 'errr');
          });
        }
      });
   
   
    if (this.data.isAdmin==true){//如果用户为商城管理者
    wx.redirectTo({   //跳转到管理者页面
      url: '/pages/admin2/secadmin',
    });
    }else{  //如果不是
      wx.switchTab({
        url: '/pages/index/index',//跳转到商城首页，普通顾客身份
      });
   }
  },
  bindGetUserInfo: function (e) { //这段代码好像没什么用，但是别删
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
    this.setData({
      canIUse:false
    })
   
    } else {
      wx.showToast({
        title: '拒绝授权',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  onLoad:function(){  //每个页面都会先执行这个onload函数，再执行onshow函数
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              //用户已经授权过
            }
          })
        }
      }
    })
  },
  onShow:function(){ //onshow函数是每次打开一次页面都会执行的函数。
    var newOpenid = wx.getStorageSync('openid');//获取本地openid缓存
    console.log("openid是" + newOpenid);
    var u = Bmob.Object.extend("_User");
    var query = new Bmob.Query(u);//调用user表
    var that = this;
    query.equalTo("openid", newOpenid);//匹配用户openid 
    query.first({  //获取到表中openid等于系统数据的一行，就是登陆用户的个人信息
      success: function (object) {
        console.log(object.id);
        getApp().globalData.userid = object.id;

        console.log(object.get("isAdmin"));
        that.setData({
          isAdmin: object.get("isAdmin")
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },
  DateDiff:function(){

  },
  onReady: function(){ //这个没什么用，就是以前登录时那个头像转动的函数。别乱删。
    var that = this;
    setTimeout(function(){
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x*30).toFixed(1);
      if(angle>14){ angle=14; }
      else if(angle<-14){ angle=-14; }
      if(that.data.angle !== angle){
        that.setData({
          angle: angle
        });
      }
    });
  }
});