//index.js
//获取应用实例
//商品详情页面。主要作用是显示商品的详细信息，并且购买，加入购物车
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var Bmob = require("../../utils/bmob.js");
var agoods = Bmob.Object.extend("agoods");
var query = new Bmob.Query(agoods);
var that;
Page({
  // 页面初始化数据
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
    kouwei:"",
    propertyChildIds:"",
    propertyChildNames:"",
    canSubmit:false, //  选中规格尺寸时候是否允许加入购物车
    shopCarInfo:{},
    shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
  },

  //事件处理函数
//  页面加载
  onLoad: function (options) {//接收从商城首页传送过来的商品id，并存入页面data中
    this.setData({
      good_id: options.moodId
    })
    that = this;
    console.log(options.moodId);
    var agoods = Bmob.Object.extend("agoods");
    var query = new Bmob.Query(agoods);
    query.get(options.moodId, {
      success: function (result) {
        console.log( result.get("goodsnum"));//获取商品信息
        that.setData({
          goodsnum: result.get("goodsnum")
        })
      }
    });
    that.loadOrder(options.moodId);
  },
// 购物车页面订单信息的传值
  loadOrder: function (objectId) {//添加购物车用到的代码一部分
    query.get(objectId).then(function (result) {
      that.setData({
        goodid:result.id,
        goods: result,
        price: result.get("price"),
        origin:result.get("originprice"),
         buyNumMax: 1000
      });
    });
    // 页面显示的数据
    var data={ //这个是没用的，但是不好删除
      "category": {
        "dateAdd": "2018-01-30 08:46:55",
        "id": 7127,
        "isUse": true,
        "key": "000001",
        "name": "手机",
        "paixu": 0,
        "pid": 0,
        "type": "手机",
        "userId": 3791
      },
      "pics": [
        {
          "goodsId": 22913,
          "id": 114997,
          "pic": "https://ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=694b483f811363270aedc433a18ea056/11385343fbf2b211eb8751adc18065380dd78eac.jpg",
          "userId": 3791
        }
      ],
      "content": "<p>商品介绍的信息</p><p>信息</p>",
      "basicInfo": {
        "barCode": "000001",
        "categoryId": 7127,
        "characteristic": "大促销",
        "commission": 0,
        "commissionType": 0,
        "dateAdd": "2018-01-30 08:48:23",
        "dateStart": "2018-01-30 08:46:59",
        "dateUpdate": "2018-01-30 08:50:16",
        "id": 22913,
        "logisticsId": 0,
        "minPrice": 550,
        "name": "华为v9",
        "numberFav": 0,
        "numberGoodReputation": 0,
        "numberOrders": 0,
        "originalPrice": 550,
        "paixu": 0,
        "pic": "图片链接",
        "recommendStatus": 1,
        "recommendStatusStr": "推荐",
        "shopId": 0,
        "status": 0,
        "statusStr": "上架",
        "stores": 1000,
        "userId": 3791,
        "videoId": "",
        "views": 14,
        "weight": 0
      }
    }
    that.setData({
      goodsDetail:data
    })
    
  },
 
  //选择是直接下单购买还是添加购物车
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
  // 减号按钮的定义
  numJianTap: function() { //减一个
     if(this.data.buyNumber > this.data.buyNumMin){
        var currentNum = this.data.buyNumber;
        currentNum--; 
        this.setData({  
            buyNumber: currentNum
        })  
     }
  },
  // 加号按钮的定义
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
    console.log(this.data.goodsDetail)
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
    var ShoppingCar = Bmob.Object.extend("shoppingCar")
    var shoppingCar = new ShoppingCar()
    var isme = getApp().globalData.userid;
    shoppingCar.save({ //商品信息存储在购物车表中
      picture: this.data.goods.attributes.picture.url,
      price: this.data.goods.attributes.price,
      name: this.data.goods.attributes.name+ "[" + this.data.kouwei+"]  ",
      count: this.data.buyNumber,
      origin:parseFloat(this.data.origin),
      users: isme
    }, {
        success: function (result) {
          // 添加成功
          console.log('success')
        },
        error: function (result, error) {
          // 添加失败
          console.error(error)
        }
      });
  },
	/**
	  * 立即购买
	  */
  setfenlei:function(e){
    console.log("选择分类是" + e.detail.value);

    
    var that =this;
    that.setData({
      kouwei: e.detail.value
    })
  },

  buyNow:function(){
    if(this.data.buyNumber < 1){
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel:false
      })
      return;
    } else if (this.data.buyNumber >this.data.goodsnum){
      wx.showModal({
        title: '提示',
        content: '库存数量不足',
        showCancel: false
      })
      return;
    }
        wx.setStorage({
          key: "buynum",
          data: this.data.buyNumber
        })
        wx.setStorage({
          key: "goodid",
          data: this.data.goodid
        })
     
    wx.navigateTo({
      url: "/pages/to-pay-order/index?orderType=buyNow&kouwei="+this.data.kouwei
    })    
  },
  /**
   * 组建购物车信息
   */
  bulidShopCarInfo: function () {
    // 加入购物车
    var shopCarMap = {};
    // shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸 
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }

    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }
    return shopCarInfo;
  },
	/**
	 * 组建立即购买信息
	 */
  buliduBuyNowInfo: function () {
    var shopCarMap = {};
    // shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.pics[0].pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var buyNowInfo = {};
    if (!buyNowInfo.shopNum) {
      buyNowInfo.shopNum = 0;
    }
    if (!buyNowInfo.shopList) {
      buyNowInfo.shopList = [];
    }
    buyNowInfo.shopList.push(shopCarMap);
    return buyNowInfo;
  },   
 
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
