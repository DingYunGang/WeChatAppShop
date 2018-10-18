// pages/XiuGaiShangPingMuLu/xiugai.js
//修改商品目录，主要就是显示要修改的项有哪些，不用关联数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  console.log(options.goodid)
  this.setData({
    id: options.goodid
  })
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
  //   var that  = this
  //   var agoods = Bmob.Object.extend("agoods");
  //   var query = new Bmob.Query(agoods);

  //   query.get(that.data.id, {
  //     success: function (result) {
  //      console.log(result.)
  //     }
  //   });
  },
  mingzi:function(e){
    wx.navigateTo({
      url: "/pages/XiuGaiShangPing2/xiugai?lie=name&goodid=" + this.data.id
    })    
  },
  kouwei: function (e) {
    wx.navigateTo({
      url: "/pages/XiuGaiShangPing2/xiugai?lie=kouwei&goodid=" + this.data.id
    })
  },
 jieshao: function (e) {
    wx.navigateTo({
      url: "/pages/XiuGaiShangPing2/xiugai?lie=content&goodid=" + this.data.id
    })
  },
 order: function (e) {
   wx.navigateTo({
     url: "/pages/XiuGaiShangPing2/xiugai?lie=order&goodid=" + this.data.id
   })
 },
 fenlei: function (e) {
   wx.navigateTo({
     url: "/pages/XiuGaiShangPing2/xiugai?lie=fenlei&goodid=" + this.data.id
   })
 },
 yuanjia: function (e) {
   wx.navigateTo({
     url: "/pages/XiuGaiShangPing2/xiugai?lie=originprice&goodid=" + this.data.id
   })
 },
 jiage: function (e) {
   wx.navigateTo({
     url: "/pages/XiuGaiShangPing2/xiugai?lie=price&goodid=" + this.data.id
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