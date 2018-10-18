//获取应用实例
//添加商品信息页面
var app = getApp()
var Bmob = require("../../utils/bmob.js");
var that;
Page({
  onLoad: function (options) {
    that = this;
    that.setData({//初始化数据
      src: "",
      isSrc: false,
      ishide: "0",
      autoFocus: true,
      isLoading: false,
      loading: true,
      isdisabled: false,
      url:""
    })
  },
  onReady: function () {
    wx.hideToast()
  },

  uploadPic: function () {//选择图标，上传图片功能
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          isSrc: true,
          src: tempFilePaths
        })
      }
    })
  },
  clearPic: function () {//删除图片
    that.setData({
      isSrc: false,
      src: ""
    })
  },
  sendNewMood: function (e) {//提交商品信息
    //判断内容是否为空
   
    var content = e.detail.value.content;
    var price = parseInt( e.detail.value.price);
    var fenlei = e.detail.value.fenlei;
    var iname = e.detail.value.iname;
    var order = parseInt(e.detail.value.order);
    var kouwei = e.detail.value.kouwei;
    var goodsnum = parseInt(e.detail.value.goodsnum);
    var originprice = e.detail.value.originprice;
    var name = "201842.jpg";//上传的图片的别名，建议可以用日期命名
    var file = new Bmob.File(name, this.data.src);
    file.save().then(function (res) {
      console.log("图片路径 " + res.url());
      that.setData({
        url : res.url()
      })
    
    
    }, function (error) {
      console.log(error);
    })
    if (price == "") {
      wx.showToast({
        title: '商品价格不能为空',
        icon: 'loading',
        duration: 1000
      })  
    } else if (content == "") {
      wx.showToast({
        title: '商品介绍不能为空',
        icon: 'loading',
        duration: 1000
      })  
    
    }
    else {
      that.setData({
        isLoading: true,
        isdisabled: true
      })
          var agoods = Bmob.Object.extend("agoods");
          var hw = new agoods();
          hw.set("price", price);
          hw.set("originprice", originprice);
          hw.set("content", content);
          hw.set("fenlei", fenlei);
          hw.set("kouwei",kouwei);
          hw.set("order",order);
          hw.set("name",iname);
          hw.set("goodsnum", goodsnum);//商品数量
          if (that.data.isSrc == true) {
            var name = that.data.src;//上传的图片的别名
            var file = new Bmob.File(name, that.data.src);
            file.save();
            hw.set("picture", file);
          }
          // }
          hw.save(null, {
            success: function (result) {
              console.log("发布成功");
              that.setData({
                isLoading: false,
                isdisabled: false
              })
              wx.showToast({
                title: '商品发布成功',
                icon: 'success',
                duration: 1000
              })  
            },
            error: function (result, error) {
              // 添加失败
              console.log(error)
              wx.showToast({
                title: '商品发布失败',
                icon: 'loading',
                duration: 1000
              })  
              that.setData({
                isLoading: false,
                isdisabled: false
              })

            }
          });
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})
