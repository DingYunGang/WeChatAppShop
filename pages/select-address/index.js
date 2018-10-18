//index.js
//获取应用实例
//顾客的地址列表
var Bmob = require("../../utils/bmob.js"); //必须要引入的文件，关联数据库需要用到的包
var app = getApp()
Page({
  data: {
    addressList:[]
  },

  selectTap: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log("id是"+id);
    wx.setStorage({
      key: 'addressid',
      data: id,
    })
    wx.navigateBack({

    })
    // wx.request({
    //   url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/user/shipping-address/update',
    //   data: {
    //     token:app.globalData.token,
    //     id:id,
    //     isDefault:'true'
    //   },
    //   success: (res) =>{
    //     wx.navigateBack({})
    //   }
    // })
    

  },

  addAddess : function () { //跳转到添加地址页面
    wx.navigateTo({
      // url:"/pages/address-add/index"
      url: "/pages/address/address"
    })
  },
  
  editAddess: function (e) { //删除地址
    var that =this;
    var id = e.currentTarget.dataset.id;
    var Address = Bmob.Object.extend("Address");
    var query = new Bmob.Query(Address);
    console.log("id是"+id);
    query.get(id, {
      success: function (object) {
        object.destroy({
          success: function (deleteObject) {
            console.log('删除地址成功');
            wx.showToast({
              title: '删除地址成功',
              icon: 'success',
              duration: 1000
            })  
            that.onShow();
          },
          error: function (object, error) {
            console.log('删除地址失败');
          }
        });
      },
      error: function (object, error) {
        console.log("query object fail");
      }
    });


    // wx.navigateTo({
    //   url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    // })

  },
  
  onLoad: function () {
    console.log('onLoad')

   
  },
  onShow : function () { 
    this.initShippingAddress();
  },
  initShippingAddress: function () { //将用户的个人地址全部显示出来
    var Address = Bmob.Object.extend("Address");
    var chaxun = new Bmob.Query(Address);//要查询的表为address地址表
    var that = this;
    
    var testuname = getApp().globalData.userid;
    chaxun.equalTo("users",testuname);
    chaxun.find({
      success: function (results) {
        that.setData({   //查询到所有的表中数据
          addressList: results
        });
      }
    })
console.log(that.data.addressList);

  }
  
})
