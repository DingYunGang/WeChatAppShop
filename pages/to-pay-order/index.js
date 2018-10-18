//index.js
//获取应用实例
//直接购买下单的页面，与ToPayorderCar页面类似，但是那个是购物车下单购买的页面，详细注释我写在那个了，直接看那个页面吧，反正差不多的
var app = getApp()
var Bmob = require("../../utils/bmob.js");
Page({
  data: {
    goodsList:[],
    isNeedLogistics:0, // 是否需要物流信息
    allGoodsPrice:0,
    yunPrice:0,
    allGoodsAndYunPrice:0,
    goodsJsonStr:"",
    orderType:"", //订单类型，购物车下单或立即支付下单，默认是购物车，
    st:"",
    hasNoCoupons: true,
    coupons: [],
    youhuijine:0, //优惠券金额
    curCoupon:null // 当前选择使用的优惠券
  },
  
  onShow : function () {
    var that = this;

    try{
      var num= wx.getStorageSync('buynum');
      if(num){
        that.setData({
          buynum:num
        })
      }
    } catch (e) {
     console.log("同步获取num失败");
    }

    try {
      var goodid = wx.getStorageSync('goodid');
      if (goodid) {
        that.setData({
          goodid: goodid
        })
      }
    } catch (e) {
      console.log("同步获取goodid失败");
    }
    try {
      var addressid = wx.getStorageSync('addressid');
      if (addressid) {
        that.setData({
          addressid: addressid
        })
      }
    } catch (e) {
      console.log("同步获取addressid失败");
    }

    var Address= Bmob.Object.extend("Address");
    var query = new Bmob.Query(Address);
    query.equalTo("users", getApp().globalData.userid)
    query.get(that.data.addressid, {
      success: function (result) {
        var  id = result.id;
        var  linkMan= result.get("name");
        var  mobile=result.get("phoneNum");
        var  sheng=result.get("sheng");
        var  shi =result.get("shi");
        var  xian= result.get("xian");
        var  xiangxidizhi= result.get("xiangxidizhi");
        var  louhao= result.get("louhao");
        var  menpaihao= result.get("menpaihao");
        var st="";
        st += sheng;
        st+=shi;
        st+=xian;
        st+=xiangxidizhi;
        st+=louhao;
        st+=menpaihao;

        that.setData({
          curAddressData: {
            id: id,
            linkMan: linkMan,
            mobile: mobile,
            sheng: sheng,
            shi: shi,
            xian: xian,
            xiangxidizhi: xiangxidizhi,
            louhao: louhao,
            menpaihao: menpaihao
            // address: '湖南省湘潭市雨湖区湘潭大学'
          },
          st:st,
          phone: mobile,
          linkMan:linkMan,
          danwei:xiangxidizhi,
          dalou: louhao
        });
      
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
    
    var agoods = Bmob.Object.extend("agoods");
    var query2 = new Bmob.Query(agoods);
    console.log("goodid是"+that.data.goodid);
    query2.get(that.data.goodid, {
      success: function (result) {
        var price = result.get("price");
        var picture = result.get("picture");
        var name =result.get("name");
        var origin=result.get("originprice");
        // console.log("名字是"+content);
        that.setData({
         price:price,
         name:name,
         picture:picture,
         origin:origin
        });
      
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });

  },

  onLoad: function (e) {
    var that = this;
    //显示收货地址标识
    that.setData({
      isNeedLogistics: 1,
      orderType: e.orderType,
      kouwei:e.kouwei
    });
 
  },




  getDistrictId : function (obj, aaa){
    if (!obj) {
      return "";
    }
    if (!aaa) {
      return "";
    }
    return aaa;
  },

  createOrder:function (e) {
    wx.showLoading();
    var that = this;
    var loginToken = app.globalData.token // 用户登录 token
    var remark = ""; // 备注信息
    if (e) {
      remark = e.detail.value.remark; // 备注信息
    }


    if (that.data.isNeedLogistics > 0) {

      if (!that.data.curAddressData) {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: '请先设置您的收货地址！',
          showCancel: false
        })
        return;
      }
    }


    var aorder = Bmob.Object.extend("aorder");
    var it = new aorder();
    var isme = getApp().globalData.userid;
    it.set("users", isme);
    var num = parseFloat(that.data.buynum);
    it.set("num", num);
    var price = parseFloat(that.data.price);
    it.set("danjia", that.data.price);
    var total = num * price;
    total = parseFloat(total);
    it.set("total", total);
    var origin = parseFloat(that.data.origin);
    var lirundanjia = price-origin;
    var lirun = lirundanjia*num;
    it.set("lirun",lirun);

    it.set("danwei", that.data.danwei);
    it.set("dalou", that.data.dalou);
    it.set("zhifu",0);
    var test1 = that.data.goodid;
    it.set("agood", test1);
    var test2 = that.data.addressid;
    var goodstr="";
    goodstr += that.data.name;
    goodstr+=" * ";
    goodstr += that.data.buynum;
    goodstr +="[";
    goodstr +=that.data.kouwei;
    goodstr += "]  "
    it.set("goodstr", goodstr);
    it.set("phone",that.data.phone);
    it.set("personname", that.data.linkMan);

    var test3 = getApp().globalData.userid;
    // console.log("测试"+that.data.st);
     it.set("dizhi",that.data.st);
    it.set("orderContext",remark);
    it.save(null, {
      success: function (result) {
        console.log("订单创建成功, objectId:" + result.id);
        wx.showToast({
          title: '订单创建成功',
          icon: 'success',
          duration: 1000
        })
     
      },
      error: function (result, error) {
        // 添加失败
        console.log('创建订单失败');
        wx.showToast({
          title: '订单创建失败',
          icon: 'loading',
          duration: 1000
        })
      }
    })
    // var shengyunum = parseFloat(that.data.shengyunum);
    // var agoods = Bmob.Object.extend("agoods");
    // var query = new Bmob.Query(agoods);
    // query.get(test1, {
    //   success: function (result) {
    //     result.set('goodsnum', shengyunum);
    //     result.save();
    //   },
    //   error: function (object, error) {
    //   }
    // });
    wx.redirectTo({
      url: "/pages/order-list/index"
    });
     
  },
 
  processYunfei: function () {
    var that = this;
    var goodsList = this.data.goodsList;
    var goodsJsonStr = "[";
    var isNeedLogistics = 0;
    var allGoodsPrice = 0;

    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];
      if (carShopBean.logistics) {
        isNeedLogistics = 1;
      }
      allGoodsPrice += carShopBean.price * carShopBean.number;

      var goodsJsonStrTmp = '';
      if (i > 0) {
        goodsJsonStrTmp = ",";
      }


      let inviter_id = 0;
      let inviter_id_storge = wx.getStorageSync('inviter_id_' + carShopBean.goodsId);
      if (inviter_id_storge) {
        inviter_id = inviter_id_storge;
      }


      goodsJsonStrTmp += '{"goodsId":' + carShopBean.goodsId + ',"number":' + carShopBean.number + ',"propertyChildIds":"' + carShopBean.propertyChildIds + '","logisticsType":0, "inviter_id":' + inviter_id +'}';
      goodsJsonStr += goodsJsonStrTmp;


    }
    goodsJsonStr += "]";
    //console.log(goodsJsonStr);
    that.setData({
      isNeedLogistics: isNeedLogistics,
      goodsJsonStr: goodsJsonStr
    });
    that.createOrder();
  },
  addAddress: function () {
    wx.navigateTo({
      // url:"/pages/address-add/index"
      url: "/pages/address/address"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url:"/pages/select-address/index"
    })
  },

})
