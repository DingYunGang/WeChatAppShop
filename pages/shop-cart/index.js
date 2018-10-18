//index.js
//购物车信息页面，显示出购物车表中的信息，这个页面我不太清楚，黄昭为写的
var Bmob = require("../../utils/bmob.js")
var app = getApp()
Page({
  // 页面初始化数据
  data: {
    goodsList:{
      saveHidden:true,
      totalPrice:0,
      allSelect:true,
      noSelect:false,
      list:[]
    },
    delBtnWidth:120,    //删除按钮宽度单位（rpx）
  },
 
 //获取元素自适应后的实际宽度
  getEleWidth:function(w){
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750/2)/(w/2);  //以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res/scale);
      return real;
    } catch (e) {
      return false;
     // Do something when catch error
    }
  },
  // 点击编辑触发事件
  initEleWidth:function(){
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth:delBtnWidth
    });
  },
  onLoad: function () {
      this.initEleWidth();
      this.onShow();
  },
  onShow: function(){
      var shopList = [];
      // 获取购物车数据
      // var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
      var shoppingCar = Bmob.Object.extend("shoppingCar");
      var query = new Bmob.Query(shoppingCar);
      var that = this
      var testuname = getApp().globalData.userid;
      query.equalTo("users", testuname);
      // 查询所有数据
      query.find({
        success: function (results) {
          console.log("共查询到 " + results.length + " 条记录");
          // 循环处理查询到的数据
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            shopList.push({
              price: object.get('price'),
              picture: object.get('picture'),
              name: object.get('name'),
              goodid: object.get('goodid'),
              count: object.get('count'),
              objectId: object.id,
              origin:object.get("origin")
            })
          }
          console.log(shopList)
          that.data.goodsList.list = shopList;
          that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), shopList);
        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
          that.data.goodsList.list = shopList;
          that.setGoodsList(that.getSaveHide(), that.totalPrice(), that.allSelect(), that.noSelect(), shopList);
        }
      });
  },
  toIndexPage:function(){
      wx.switchTab({
            url: "/pages/index/index"
      });
  },

  touchS:function(e){
    if(e.touches.length==1){
      this.setData({
        startX:e.touches[0].clientX
      });
    }
  },
  touchM:function(e){
  var index = e.currentTarget.dataset.index;

    if(e.touches.length==1){
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if(disX == 0 || disX < 0){//如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      }else if(disX > 0 ){//移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-"+disX+"px";
        if(disX>=delBtnWidth){
          left = "left:-"+delBtnWidth+"px";
        }
      }
      var list = this.data.goodsList.list;
      if(index!="" && index !=null){
        list[parseInt(index)].left = left; 
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
      }
    }
  },

  touchE:function(e){
    var index = e.currentTarget.dataset.index;    
    if(e.changedTouches.length==1){
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth/2 ? "margin-left:-"+delBtnWidth+"px":"margin-left:0px";
      var list = this.data.goodsList.list;
     if(index!=="" && index != null){
        list[parseInt(index)].left = left; 
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);

      }
    }
  },
  delItem:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    list.splice(index,1);
    this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
  },
  selectTap:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if(index!=="" && index != null){
        list[parseInt(index)].active = !list[parseInt(index)].active ; 
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
      }
   },
   totalPrice:function(){
      var list = this.data.goodsList.list;
      var total = 0;
      for(var i = 0 ; i < list.length ; i++){
          var curItem = list[i];
          if(curItem.active){
            total+= parseFloat(curItem.price)*curItem.count;
          }
      }
      total = parseFloat(total.toFixed(2));//js浮点计算bug，取两位小数精度
      return total;
   },
   totallirun: function () {
     var list = this.data.goodsList.list;
     var lirun = 0;
     for (var i = 0; i < list.length; i++) {
       var curItem = list[i];
       if (curItem.active) {
         lirun += parseFloat(curItem.price - curItem.origin) * curItem.count;
       }
     }
     lirun = parseFloat(lirun.toFixed(2));//js浮点计算bug，取两位小数精度
     return lirun;
   },
   
   allSelect:function(){
      var list = this.data.goodsList.list;
      var allSelect = false;
      for(var i = 0 ; i < list.length ; i++){
          var curItem = list[i];
          if(curItem.active){
            allSelect = true;
          }else{
             allSelect = false;
             break;
          }
      }
      return allSelect;
   },
   noSelect:function(){
      var list = this.data.goodsList.list;
      var noSelect = 0;
      for(var i = 0 ; i < list.length ; i++){
          var curItem = list[i];
          if(!curItem.active){
            noSelect++;
          }
      }
      if(noSelect == list.length){
         return true;
      }else{
        return false;
      }
   },
   setGoodsList:function(saveHidden,total,allSelect,noSelect,list){
      this.setData({
        goodsList:{
          saveHidden:saveHidden,
          totalPrice:total,
          allSelect:allSelect,
          noSelect:noSelect,
          list:list
        }
      });
      var shopCarInfo = {};
      var tempNumber = 0;
      shopCarInfo.shopList = list;
      for(var i = 0;i<list.length;i++){
        tempNumber = tempNumber + list[i].number
      }
      shopCarInfo.shopNum = tempNumber;
      wx.setStorage({
        key:"shopCarInfo",
        data:shopCarInfo
      })
   },
   bindAllSelect:function(){
      var currentAllSelect = this.data.goodsList.allSelect;
      var list = this.data.goodsList.list;
      if(currentAllSelect){
        for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            curItem.active = false;
        }
      }else{
        for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            curItem.active = true;
        }
      }
     
      this.setGoodsList(this.getSaveHide(),this.totalPrice(),!currentAllSelect,this.noSelect(),list);
   },
   jiaBtnTap:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if(index!=="" && index != null){
      if(list[parseInt(index)].number<10){
        list[parseInt(index)].number++; 
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
      }
    }
   },
   jianBtnTap:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if(index!=="" && index != null){
      if(list[parseInt(index)].number>1){
        list[parseInt(index)].number-- ;
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
      }
    }
   },
   editTap:function(){
     var list = this.data.goodsList.list;
     for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            curItem.active = false;
     }
     this.setGoodsList(!this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
   },
   saveTap:function(){
     var list = this.data.goodsList.list;
     for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            curItem.active = true;
     }
     this.setGoodsList(!this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
   },
   getSaveHide:function(){
     var saveHidden = this.data.goodsList.saveHidden;
     return saveHidden;
   },
   deleteSelected:function(){
      var list = this.data.goodsList.list;

    var deleteList = list.filter(function(g) {
      return g.active
    })
    var query = new Bmob.Query('shoppingCar');
    for (var i = 0; i < deleteList.length; i++) {
      console.log(deleteList[i])
      query.equalTo('objectId', deleteList[i].objectId)
      query.find().then(function (todos) {
        return Bmob.Object.destroyAll(todos);
      }).then(function (todos) {
        console.log('delete success');
        // 删除成功
      }, function (error) {
        // 异常处理
        console.error(error)
      });
    }
     list = list.filter(function(curGoods) {
        return !curGoods.active;
     });
     this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
    },
    toPayOrder:function(){
      this.navigateToPayOrder();
      // wx.showLoading();
      // var that = this;
      // if (this.data.goodsList.noSelect) {
      //   wx.hideLoading();
      //   return;
      // }
      // // 重新计算价格，判断库存
      // var shopList = [];
      // var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
      // if (shopCarInfoMem && shopCarInfoMem.shopList) {
      //   // shopList = shopCarInfoMem.shopList
      //   shopList = shopCarInfoMem.shopList.filter(entity => {
      //     return entity.active;
      //   });
      // }
      // if (shopList.length == 0) {
      //   wx.hideLoading();
      //   return;
      // }
      // var isFail = false;
      // var doneNumber = 0;
      // var needDoneNUmber = shopList.length;
      // for (let i =0; i < shopList.length; i++) {
      //   if (isFail) {
      //     wx.hideLoading();
      //     return;
      //   }
      //   let carShopBean = shopList[i];
      //   // 获取价格和库存
      //   if (!carShopBean.propertyChildIds || carShopBean.propertyChildIds == "") {
      //     wx.request({
      //       url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/shop/goods/detail',
      //       data: {
      //         id: carShopBean.goodsId
      //       },
      //       success: function(res) {
      //         doneNumber++;
      //         if (res.data.data.properties) {
      //           wx.showModal({
      //             title: '提示',
      //             content: res.data.data.basicInfo.name + ' 商品已失效，请重新购买',
      //             showCancel:false
      //           })
      //           isFail = true;
      //           wx.hideLoading();
      //           return;
      //         }
      //         if (res.data.data.basicInfo.stores < carShopBean.number) {
      //           wx.showModal({
      //             title: '提示',
      //             content: res.data.data.basicInfo.name + ' 库存不足，请重新购买',
      //             showCancel:false
      //           })
      //           isFail = true;
      //           wx.hideLoading();
      //           return;
      //         }
      //         if (res.data.data.basicInfo.minPrice != carShopBean.price) {
      //           wx.showModal({
      //             title: '提示',
      //             content: res.data.data.basicInfo.name + ' 价格有调整，请重新购买',
      //             showCancel:false
      //           })
      //           isFail = true;
      //           wx.hideLoading();
      //           return;
      //         }
      //         if (needDoneNUmber == doneNumber) {
      //           that.navigateToPayOrder();
      //         }
      //       }
      //     })
      //   } else {
      //     wx.request({
      //       url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/shop/goods/price',
      //       data: {
      //         goodsId: carShopBean.goodsId,
      //         propertyChildIds:carShopBean.propertyChildIds
      //       },
      //       success: function(res) {
      //         doneNumber++;
      //         if (res.data.data.stores < carShopBean.number) {
      //           wx.showModal({
      //             title: '提示',
      //             content: carShopBean.name + ' 库存不足，请重新购买',
      //             showCancel:false
      //           })
      //           isFail = true;
      //           wx.hideLoading();
      //           return;
      //         }
      //         if (res.data.data.price != carShopBean.price) {
      //           wx.showModal({
      //             title: '提示',
      //             content: carShopBean.name + ' 价格有调整，请重新购买',
      //             showCancel:false
      //           })
      //           isFail = true;
      //           wx.hideLoading();
      //           return;
      //         }
      //         if (needDoneNUmber == doneNumber) {
      //           that.navigateToPayOrder();
      //         }
      //       }
      //     })
      //   }
      //
      // }
    },
    navigateToPayOrder:function () {
      wx.hideLoading();
      console.log(this.totalPrice());
      wx.navigateTo({
        url: "/pages/ToPayOrderCar/index?total=" +this.totalPrice()+"&lirun="+this.totallirun()
      })
    }



})
