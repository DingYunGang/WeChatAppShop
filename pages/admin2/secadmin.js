//这个是管理员的管理界面
const app = getApp()

Page({
  data: {
    balance: 0,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0
  },
  onLoad() {
   
  },

  onShow() { 
    this.getUserInfo();//获取用户信息接口
    this.setData({
      version: app.globalData.version
    });
  
  },
  getUserInfo: function (cb) { 
    var that = this
    wx.login({  //登录接口
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              userInfo: res.userInfo //获取到用户信息
            });
          }
        })
      }
    })
  },
  aboutUs: function () { //点击商城首页，跳转到商城首页
 
    wx.switchTab({
      url: '/pages/index/index', 
    });
  },

  relogin: function () {  //没用的一段
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
      fail(res) {
        console.log(res);
        wx.openSetting({});
      }
    })
  },
  recharge: function () {  //充值和提现的按钮
    wx.showModal({ 
      title: '温馨提示',
      content: '该功能暂未开放',
      showCancel: false
    })

  },
  withdraw: function () {  //充值和提现的按钮
    wx.showModal({
      title: '温馨提示',
      content: '该功能暂未开放',
      showCancel: false
    })

  },
  tuichu: function () { //点击账户退出，重新回到开始界面
    wx.showModal({
      title: '确定要退出吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          getApp().globalData.userid = null; 
          getApp().globalData.username = null;
          wx.redirectTo({
            url: '/pages/start/start'
          })
        }
      }
    })
  },
})