//普通顾客的个人信息管理页面
const app = getApp()
var Bmob = require("../../utils/bmob.js");
Page({
	data: {
    balance:0,
    freeze:0,
    score:0,
    score_sign_continuous:0
  },
	onLoad() {
    
	},	
  onShow() {
    this.getUserInfo();
    this.setData({
      version: app.globalData.version
    });
    
    console.log(getApp().globalData.userid);
    var u = Bmob.Object.extend("_User");
    var query = new Bmob.Query(u);
    var that = this;
    query.get(getApp().globalData.userid, {
      success: function (object) {
        console.log(object.get("isSec"));
        that.setData({
          isSec: object.get("isSec"),
          dalou: object.get("dalou"),
          danwei: object.get("danwei"),
        })
      }
    });

  },	
  getUserInfo: function (cb) {
      var that = this
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                userInfo: res.userInfo
              });
            }
          })
        }
      })
  },
  aboutUs : function () {
    wx.showModal({
      title: '关于我们',
      content: '本程序为毕设实验版程序，不可作为商业代码使用',
      showCancel:false
    })
  },
  aboutkefu:function(){
    wx.showModal({
      title: '客服信息',
      content: '电话号码--XXXXXX,微信公众平台XXXXXX',
      showCancel: false
    })
  },

  tuichu:function(){
    wx.showModal({
      title: '确定要退出吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          getApp().globalData.userid=null;
          getApp().globalData.username=null;
          wx.redirectTo({
            url: '/pages/start/start'
          })
        }
      }
    })
  },

  relogin:function(){
    var that = this;
    wx.authorize({
      scope: 'scope.userInfo',
      success() {
        app.globalData.token = null;
        app.login();
        wx.showModal({
          title: '提示',
          content: '重新登陆成功',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              that.onShow();
            }
          }
        })
      },
      fail(res){
        console.log(res);
        wx.openSetting({});
      }
    })
  },
  recharge: function () {
      wx.showModal({
          title: '温馨提示',
          content: '该功能暂未开放',
          showCancel:false
      })

  },
  withdraw: function () {
      wx.showModal({
          title: '温馨提示',
          content: '该功能暂未开放',
          showCancel:false
      })

  },
  erji: function () {

    if (this.data.isSec == true) {
      wx.navigateTo({
        url: '/pages/secadmin2/admin',
      });
      getApp().globalData.userdanwei =this.data.danwei;
      getApp().globalData.userdalou = this.data.dalou;
      var zhekou2 = Bmob.Object.extend("zhekou");
      var query = new Bmob.Query(zhekou2);
      query.first({
        success: function (object) {
          getApp().globalData.zhekou=object.get("num");
          
          console.log(object.id)
        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      });
    } else {
      wx.navigateTo({
        url: '/pages/shengqing/shengqing',
      });
 
    }
  },
})