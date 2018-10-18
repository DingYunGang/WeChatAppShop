//index.js
//获取应用实例
//商品详细信息页面，和goods-details差不太多，不知道这个页面现在还有没有用，可能是以前复制的，别删吧
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var Bmob = require("../../utils/bmob.js");
var agoods = Bmob.Object.extend("agoods");
var query = new Bmob.Query(agoods);
var that;
Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsDetail:{},
    swiperCurrent: 0,  
    hasMoreSelect:false,
    selectSize:"选择：",
    selectSizePrice:0,
    shopNum:0,
    hideShopPopup:true,
    buyNumber:0,
    buyNumMin:0,
    buyNumMax:0,
    num: 0,
    total: 0,
    price: 0,

    propertyChildIds:"",
    propertyChildNames:"",
    canSubmit:false, //  选中规格尺寸时候是否允许加入购物车
    shopCarInfo:{},
    shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
  },

  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  onLoad: function (options) {
    this.setData({
      good_id: options.moodId
    })
    console.log(options.moodId);
    that = this;
    that.loadOrder(options.moodId);
  },
  loadOrder: function (objectId) {

    query.get(objectId).then(function (result) {
      that.setData({
        goodid:result.id,
        goods: result,
        price: result.get("price"),
         buyNumMax: 1000
      });
    });
    
  },
  onShow: function () {
    var good_id = this.data.good_id;
    console.log(good_id);
    that = this;
    query.get(good_id, {
      success: function (result) {

        that.setData({   //查询到所有的表中数据
          goods: result
        });
        console.log(result)
      },
      error: function (result, error) {
        console.log("查询失败");
      },

    });
  },
  goShopCar: function () {
    wx.reLaunch({
      url: "/pages/shop-cart/index"
    });
  },
  toAddShopCar: function () {
    this.setData({
      shopType: "addShopCar"
    })
    this.bindGuiGeTap();
  },
  tobuy: function () {
    this.setData({
      shopType: "tobuy"
    });
    this.bindGuiGeTap();

  },  
  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function() {
     this.setData({  
        hideShopPopup: false 
    })  
  },
  /**
   * 规格选择弹出框隐藏
   */
  closePopupTap: function() {
     this.setData({  
        hideShopPopup: true 
    })  
  },
  numJianTap: function() { //减一个
     if(this.data.buyNumber > this.data.buyNumMin){
        var currentNum = this.data.buyNumber;
        currentNum--; 
        this.setData({  
            buyNumber: currentNum
        })  
     }
  },
  numJiaTap: function() { //加一个
     if(this.data.buyNumber < this.data.buyNumMax){
        var currentNum = this.data.buyNumber;
        currentNum++ ;
        this.setData({  
            buyNumber: currentNum
        })  
     }
  },
  /**
   * 选择商品规格
   * @param {Object} e
   */
  labelItemTap: function(e) {
    var that = this;
  
    // 取消该分类下的子栏目所有的选中状态
    var childs = that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods;
    for(var i = 0;i < childs.length;i++){
      that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[i].active = false;
    }
    // 设置当前选中状态
    that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[e.currentTarget.dataset.propertychildindex].active = true;
    // 获取所有的选中规格尺寸数据
    var needSelectNum = that.data.goodsDetail.properties.length;
    var curSelectNum = 0;
    var propertyChildIds= "";
    var propertyChildNames = "";
    for (var i = 0;i < that.data.goodsDetail.properties.length;i++) {
      childs = that.data.goodsDetail.properties[i].childsCurGoods;
      for (var j = 0;j < childs.length;j++) {
        if(childs[j].active){
          curSelectNum++;
          propertyChildIds = propertyChildIds + that.data.goodsDetail.properties[i].id + ":"+ childs[j].id +",";
          propertyChildNames = propertyChildNames + that.data.goodsDetail.properties[i].name + ":"+ childs[j].name +"  ";
        }
      }
    }
    var canSubmit = false;
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    // 计算当前价格
    if (canSubmit) {
      wx.request({
        url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/shop/goods/price',
        data: {
          goodsId: that.data.goodsDetail.basicInfo.id,
          propertyChildIds:propertyChildIds
        },
        success: function(res) {
          that.setData({
            selectSizePrice:res.data.data.price,
            propertyChildIds:propertyChildIds,
            propertyChildNames:propertyChildNames,
            buyNumMax:res.data.data.stores,
            buyNumber:(res.data.data.stores>0) ? 1: 0
          });
        }
      })
    }

    
    this.setData({
      goodsDetail: that.data.goodsDetail,
      canSubmit:canSubmit
    })  
  },
  /**
  * 加入购物车
  */
  addShopCar:function(){
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      if (!this.data.canSubmit){
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })       
      }
      this.bindGuiGeTap();
      return;
    }
    if(this.data.buyNumber < 1){
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel:false
      })
      return;
    }
    //组建购物车
    var shopCarInfo = this.bulidShopCarInfo();

    this.setData({
      shopCarInfo:shopCarInfo,
      shopNum:shopCarInfo.shopNum
    });

    // 写入本地存储
    wx.setStorage({
      key:"shopCarInfo",
      data:shopCarInfo
    })
    this.closePopupTap();
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })
    //console.log(shopCarInfo);

    //shopCarInfo = {shopNum:12,shopList:[]}
  },
	/**
	  * 立即购买
	  */
  buyNow:function(){
      
    if(this.data.buyNumber < 1){
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel:false
      })
      return;
    }
    // var aorder = Bmob.Object.extend("aorder");
    // var it = new aorder();
    // var num = parseFloat(this.data.buyNumber);
    // it.set("num", num);
    // var price = parseFloat(this.data.price);
    // it.set("danjia", that.data.price);
    // var total = num * price;
    // total = parseFloat(total);
    // it.set("total", total);
    // it.set("zhifu",0);
    // var test1 = this.data.goodid;
    // var isme = new Bmob.User();
    // isme.id = test1;
    // it.set("agood", isme);
    // it.save(null, {
    //   success: function (result) {
    //     console.log("订单创建成功, objectId:" + result.id);
    //     wx.showToast({
    //       title: '订单创建成功',
    //       icon: 'success',
    //       duration: 1000
    //     })
    //   },
    //   error: function (result, error) {
    //     // 添加失败
    //     console.log('创建订单失败');
    //     wx.showToast({
    //       title: '订单创建失败',
    //       icon: 'loading',
    //       duration: 1000
    //     })
        wx.setStorage({
          key: "buynum",
          data: this.data.buyNumber
        })
        wx.setStorage({
          key: "goodid",
          data: this.data.goodid
        })


 
    //   }
    // })

    // var aorder = Bmob.Object.extend("aorder");
    // var chaxun = new Bmob.Query(aorder);//要查询的表为商品goods表
    // that = this;
    // chaxun.set("num", this.data.buyNumber);
    // chaxun.set("danjia", this.data.price);
  

   
    // this.closePopupTap();

    wx.navigateTo({
      url: "/pages/to-pay-order/index?orderType=buyNow"
    })    
  },
  /**
   * 组建购物车信息
   */
  // bulidShopCarInfo: function () {
  //   // 加入购物车
  //   var shopCarMap = {};
  //   // shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
  //   shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
  //   shopCarMap.name = this.data.goodsDetail.basicInfo.name;
  //   // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸 
  //   shopCarMap.propertyChildIds = this.data.propertyChildIds;
  //   shopCarMap.label = this.data.propertyChildNames;
  //   shopCarMap.price = this.data.selectSizePrice;
  //   shopCarMap.left = "";
  //   shopCarMap.active = true;
  //   shopCarMap.number = this.data.buyNumber;
  //   shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
  //   shopCarMap.logistics = this.data.goodsDetail.logistics;
  //   shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

  //   var shopCarInfo = this.data.shopCarInfo;
  //   if (!shopCarInfo.shopNum) {
  //     shopCarInfo.shopNum = 0;
  //   }
  //   if (!shopCarInfo.shopList) {
  //     shopCarInfo.shopList = [];
  //   }
  //   var hasSameGoodsIndex = -1;
  //   for (var i = 0; i < shopCarInfo.shopList.length; i++) {
  //     var tmpShopCarMap = shopCarInfo.shopList[i];
  //     if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
  //       hasSameGoodsIndex = i;
  //       shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
  //       break;
  //     }
  //   }

  //   shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
  //   if (hasSameGoodsIndex > -1) {
  //     shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
  //   } else {
  //     shopCarInfo.shopList.push(shopCarMap);
  //   }
  //   return shopCarInfo;
  // },
	/**
	 * 组建立即购买信息
	 */
  // buliduBuyNowInfo: function () {
  //   var shopCarMap = {};
  //   // shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
  //   shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
  //   shopCarMap.name = this.data.goodsDetail.basicInfo.name;
  //   shopCarMap.propertyChildIds = this.data.propertyChildIds;
  //   shopCarMap.label = this.data.propertyChildNames;
  //   shopCarMap.price = this.data.selectSizePrice;
  //   shopCarMap.left = "";
  //   shopCarMap.active = true;
  //   shopCarMap.number = this.data.buyNumber;
  //   shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
  //   shopCarMap.logistics = this.data.goodsDetail.logistics;
  //   shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

  //   var buyNowInfo = {};
  //   if (!buyNowInfo.shopNum) {
  //     buyNowInfo.shopNum = 0;
  //   }
  //   if (!buyNowInfo.shopList) {
  //     buyNowInfo.shopList = [];
  //   }
   

  //   buyNowInfo.shopList.push(shopCarMap);
  //   return buyNowInfo;
  // },   
 
  reputation: function (goodsId) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/reputation',
      data: {
        goodsId: goodsId
      },
      success: function (res) {
        if (res.data.code == 0) {
          //console.log(res.data.data);
          that.setData({
            reputation: res.data.data
          });
        }
      }
    })
  },
  getVideoSrc: function (videoId) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/media/video/detail',
      data: {
        videoId: videoId
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            videoMp4Src: res.data.data.fdMp4
          });
        }
      }
    })
  }
})
