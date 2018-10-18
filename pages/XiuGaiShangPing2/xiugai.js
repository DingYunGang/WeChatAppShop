// pages/XiuGaiShangPing2/xiugai.js
//页面功能是修改商品信息
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
    console.log(options.lie + " " + options.goodid)//接受从前面页面传递过来的信息，要修改的商品id和要修改的某一项
  this.setData({
    lie: options.lie,
    goodid: options.goodid
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
  onShow: function () {//从商品表将该商品的某一列内容查询出来，显示在wxml层
      var that  = this
    var agoods = Bmob.Object.extend("agoods");
    var query = new Bmob.Query(agoods);
    var lie = that.data.lie
    query.get(that.data.goodid, {
      success: function (result) {
       console.log(result.get(lie))
       that.setData({
         yuanzhi: result.get(lie)  //显示在wxml渲染层
       })
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  input: function (e) {  // 从渲染层wxml里面提取出空格里的值
    this.setData({
      s: e.detail.value //将该值存入页面的data中
    })
    console.log(e.detail.value);

  },
  formSubmit: function (e) {  //更新商品信息
      var that =this
    var agoods = Bmob.Object.extend("agoods");
    var query = new Bmob.Query(agoods);

    query.get(this.data.goodid, {  //更新语句
      success: function (result) {
        var lie = that.data.lie
        var zhi = that.data.s;
        if(lie=="order"){  //如果列为商品排序，（number)类型的
          var zhi = parseFloat(that.data.s);//将从渲染层读出的数据由string类型改为number类型
        } else if (lie == "price") {//同上，price价格也是（number）类型的
          var zhi = parseFloat(that.data.s);
        }
        
        result.set(lie,zhi );
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