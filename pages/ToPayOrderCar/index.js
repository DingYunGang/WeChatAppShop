//index.js
//获取应用实例
//购物车购买下单的页面，与to-pay-order页面类似，但是那个是直接下单购买的页面
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

    hasNoCoupons: true,
    coupons: [],
    youhuijine:0, //优惠券金额
    curCoupon:null // 当前选择使用的优惠券
  },
  
  onShow : function () { 
    var that = this;
    try{
      var num= wx.getStorageSync('buynum');//获取购买数量
      if(num){
        that.setData({
          buynum:num
        })
      }
    } catch (e) {
     console.log("同步获取num失败");
    }

    try {
      var goodid = wx.getStorageSync('goodid');//获取商品id
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

    var Address= Bmob.Object.extend("Address"); //从地址表获取发货地址
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
        var st = "";
        st += sheng;
        st += shi;
        st += xian;
        st += xiangxidizhi;
        st += louhao;
        st += menpaihao;

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
          st: st,
          phone: mobile,
          linkMan: linkMan,
          danwei: xiangxidizhi,
          dalou: louhao
        });
      
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
    
    var agoods = Bmob.Object.extend("agoods"); //获取购买的商品信息，并显示在页面上
    var query2 = new Bmob.Query(agoods);
    query2.get(that.data.goodid, {
      success: function (result) {
        var price = result.get("price");
        var picture = result.get("picture");
        var name =result.get("name");
        // console.log("名字是"+content);
        that.setData({
         price:price,  
         name:name,
         picture:picture
        });
      
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
    // var num = parseFloat(that.data.buynum);
    // var price = parseFloat(that.data.price);
    // var total = num * price;
    // total = parseFloat(total);
    // console.log(total);
    // that.setData({
    //   total:total
    // })
   
    var shopList = [];
    //立即购买下单
    if ("buyNow"==that.data.orderType){
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
    }else{
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
      if (shopCarInfoMem && shopCarInfoMem.shopList) {
        // shopList = shopCarInfoMem.shopList
        shopList = shopCarInfoMem.shopList.filter(entity => {
          return entity.active;
        });
      }
    }
    that.setData({
      goodsList: shopList,
    });
    console.log(shopList)
    // that.show();
    // that.initShippingAddress();
  },

  onLoad: function (e) {
    var that = this;
    //显示收货地址标识
    that.setData({
      isNeedLogistics: 1,
      total: e.total,
      lirun:e.lirun
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

  createOrder:function (e) {//提交订单功能
    wx.showLoading();

    var that = this;
    var goodstr="";
    // console.log(that.data.goodsList.length)
    for (var i = 0; i < that.data.goodsList.length;i++){ //goodstr是商品的名称，我把购买的数量，还有下单的口味都加在了这里。
      goodstr += that.data.goodsList[i].name;
      goodstr += " * ";
      goodstr += that.data.goodsList[i].count;
      goodstr +=" ";
    }
    console.log( goodstr);
    var loginToken = app.globalData.token // 用户登录 token
    var remark = ""; // 备注信息
    if (e) {
      remark = e.detail.value.remark; // 备注信息
    }

    // var postData = {
    //   token: loginToken,
    //   goodsJsonStr: that.data.goodsJsonStr,
    //   remark: remark
    // };
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
    var aorder = Bmob.Object.extend("aorder"); //向order表提交订单
    var it = new aorder();
    var isme = getApp().globalData.userid;
    it.set("users", isme); //下单者id
 
    var total = parseFloat(that.data.total); //总价格
    it.set("total", total);
    var lirun = parseFloat(that.data.lirun) //利润
    it.set("lirun",lirun); 
    it.set("zhifu",0);  //订单状态未付款，为0.
 

  
    it.set("phone", that.data.phone); //收货电话
    it.set("personname", that.data.linkMan);//购买者名字
    it.set("goodstr", goodstr);  //商品信息
    
    it.set("danwei", that.data.danwei);//二级商单位
    it.set("dalou", that.data.dalou);//二级商大楼
    var test3 = getApp().globalData.userid;
    it.set("dizhi", that.data.st); //发货地址
    it.set("orderContext",remark);//订单备注
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
        console.log(error);
        wx.showToast({
          title: '订单创建失败',
          icon: 'loading',
          duration: 1000
        })
      }
    })
    wx.redirectTo({
      url: "/pages/order-list/index" //跳转到订单处理页面
    });


    //   postData.provinceId = that.data.curAddressData.provinceId;
    //   postData.cityId = that.data.curAddressData.cityId;
    //   if (that.data.curAddressData.districtId) {
    //     postData.districtId = that.data.curAddressData.districtId;
    //   }
    //   postData.address = that.data.curAddressData.address;
    //   postData.linkMan = that.data.curAddressData.linkMan;
    //   postData.mobile = that.data.curAddressData.mobile;
    //   postData.code = that.data.curAddressData.code;
    // }
    // if (that.data.curCoupon) {
    //   postData.couponId = that.data.curCoupon.id;
    // }
    // if (!e) {
    //   postData.calculate = "true";
    // }
    
 
    // wx.request({
    //   url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/order/create',
    //   method:'POST',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   data: postData, // 设置请求的 参数
    //   success: (res) =>{
    //     wx.hideLoading();
    //     if (res.data.code != 0) {
    //       wx.showModal({
    //         title: '错误',
    //         content: res.data.msg,
    //         showCancel: false
    //       })
    //       return;
    //     }
    //
    //     if (e && "buyNow" != that.data.orderType) {
    //       // 清空购物车数据
    //       wx.removeStorageSync('shopCarInfo');
    //     }
    //     if (!e) {
    //       that.setData({
    //         isNeedLogistics: res.data.data.isNeedLogistics,
    //         allGoodsPrice: res.data.data.amountTotle,
    //         allGoodsAndYunPrice: res.data.data.amountLogistics + res.data.data.amountTotle,
    //         yunPrice: res.data.data.amountLogistics
    //       });
    //       that.getMyCoupons();
    //       return;
    //     }
    //     // 配置模板消息推送
    //     var postJsonString = {};
    //     postJsonString.keyword1 = { value: res.data.data.dateAdd, color: '#173177' }
    //     postJsonString.keyword2 = { value: res.data.data.amountReal + '元', color: '#173177' }
    //     postJsonString.keyword3 = { value: res.data.data.orderNumber, color: '#173177' }
    //     postJsonString.keyword4 = { value: '订单已关闭', color: '#173177' }
    //     postJsonString.keyword5 = { value: '您可以重新下单，请在30分钟内完成支付', color:'#173177'}
    //     app.sendTempleMsg(res.data.data.id, -1,
    //       'mGVFc31MYNMoR9Z-A9yeVVYLIVGphUVcK2-S2UdZHmg', e.detail.formId,
    //       'pages/index/index', JSON.stringify(postJsonString));
    //     postJsonString = {};
    //     postJsonString.keyword1 = { value: '您的订单已发货，请注意查收', color: '#173177' }
    //     postJsonString.keyword2 = { value: res.data.data.orderNumber, color: '#173177' }
    //     postJsonString.keyword3 = { value: res.data.data.dateAdd, color: '#173177' }
    //     app.sendTempleMsg(res.data.data.id, 2,
    //       'Arm2aS1rsklRuJSrfz-QVoyUzLVmU2vEMn_HgMxuegw', e.detail.formId,
    //       'pages/order-details/index?id=' + res.data.data.id, JSON.stringify(postJsonString));
    //     // 下单成功，跳转到订单管理界面
    //     wx.redirectTo({
    //       url: "/pages/order-list/index"
    //     });
    //   }
    // })
     
  },
  initShippingAddress: function () {//这一段没用
    var that = this;
      that.setData({
          curAddressData:{
              id:0,
              isDefault:"active",
              linkMan:'丁云刚',
              mobile:'1868888888',
              address:'湖南省湘潭市雨湖区湘潭大学'
          }
      });
    // wx.request({
    //   url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/user/shipping-address/default',
    //   data: {
    //     token:app.globalData.token
    //   },
    //   success: (res) =>{
    //     if (res.data.code == 0) {
    //       that.setData({
    //         curAddressData:res.data.data
    //       });
    //     }else{
    //       that.setData({
    //         curAddressData: null
    //       });
    //     }
    //     that.processYunfei();
    //   }
    // })
  },
  processYunfei: function () { //我不知道这一段有没有用
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
