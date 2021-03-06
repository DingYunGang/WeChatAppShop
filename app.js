//app.js
var common = require("utils/common.js");
var Bmob = require('utils/bmob.js');
var BmobSocketIo = require('utils/bmobSocketIo.js').BmobSocketIo;
Bmob.initialize("29a3a35855ea403ba18706739230fe39", "05071c4a144040206aa08b2ac2eada00");

App({
  onLaunch: function () {
    var user = new Bmob.User();//开始注册用户
    var newOpenid = wx.getStorageSync('openid')
    if (!newOpenid) {
      wx.login({
        success: function (res) {
          user.loginWithWeapp(res.code).then(function (user) {
            var openid = user.get("authData").weapp.openid;
            console.log(user, 'user', user.id, res);
            if (user.get("nickName")) {
              // 第二次访问
              console.log(user.get("nickName"), 'res.get("nickName")');
              wx.setStorageSync('openid', openid)
            } else {
              //保存用户其他信息
              wx.getUserInfo({
                success: function (result) {
                  var userInfo = result.userInfo;
                  var nickName = userInfo.nickName;
                  var avatarUrl = userInfo.avatarUrl;

                  var u = Bmob.Object.extend("_User");
                  var query = new Bmob.Query(u);
                  // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
                  query.get(user.id, {
                    success: function (result) {
                      // 自动绑定之前的账号
                      result.set("isAdmin",false);
                      result.set("isSec", false);
                      result.set('nickName', nickName);
                      result.set("userPic", avatarUrl);
                      result.set("openid", openid);
                      console.log("第二次放")
                      result.save();
                    }
                  });
                }
              });
            }
          }, function (err) {
            console.log(err, 'errr');
          });
        }
      });
    }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {

          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
    globalData:{
        userid:null,
        username:null,
        secid:null,
        dalou:null,
        danwei:null,
        zhekou:null,
        addressmoren:null,
        subDomain: "377d140de3d8e14cde35d681049ea273",
        version: "1.9.SNAPSHOT",
        shareProfile: '百款精品商品，总有一款适合您'
    }
})
