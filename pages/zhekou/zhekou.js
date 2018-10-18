// pages/zhekou/zhekou.js
//该页面的主要功能就是查询二级商提成折扣和修改折扣。
var Bmob = require("../../utils/bmob.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      motto: '\n', //这个东西是页面wxml里面换行用的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  input: function (e) {  // 从渲染层wxml里面提取出空格里的值
    this.setData({
      s: e.detail.value //将该值存入页面的data中
    })
    console.log(e.detail.value);

  },
  formSubmit: function (e) {  //更新折扣信息
   
    var t = parseFloat(this.data.s); //取出data中的折扣值，并且将之转换为浮点型。
    console.log(t);
    var zhekou = Bmob.Object.extend("zhekou");//操作折扣表的语句
    var querys = new Bmob.Query(zhekou);//操作折扣表的语句
 
    querys.get(this.data.id, {  //更新语句
      success: function (result) {
    
        result.set('num', t);  
    
        result.save();
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        })
      },
      error: function (object, error) {

      }
    });

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {  //查询出表中的折扣，并且显示
    var that =this;
    var zhekou2 = Bmob.Object.extend("zhekou");//操作折扣表的语句
    var query = new Bmob.Query(zhekou2);//操作折扣表的语句
    query.first({      //查询出折扣表的第一条信息
      success: function (object) {
        that.setData({
          zhekou:object.get("num"), //取出这条信息，存入页面data
          id:object.id              
        })
      
        console.log(object.id)
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
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