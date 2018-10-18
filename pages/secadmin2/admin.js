//这个是二级商的管理界面，和admin2商城总部管理界面差不多，详细注释看那个
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
    this.getUserInfo();
    this.setData({
      version: app.globalData.version
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

  relogin: function () {
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
  recharge: function () {
    wx.showModal({
      title: '温馨提示',
      content: '该功能暂未开放',
      showCancel: false
    })

  },
  withdraw: function () {
    wx.showModal({
      title: '温馨提示',
      content: '该功能暂未开放',
      showCancel: false
    })

  }
})