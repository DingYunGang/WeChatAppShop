//index.js
//获取应用实例
//商品首页页面，主要功能是显示商品表里商品的信息
var app = getApp()
var common = require('../template/getCode.js')
var Bmob = require("../../utils/bmob.js");
var agoods = Bmob.Object.extend("agoods");
var query = new Bmob.Query(agoods);
var that;
var molist = new Array();
Page({
    data: {
        indicatorDots: true,
        moodList: [],
        autoplay: true,
        interval: 3000,
        duration: 1000,
        loadingHidden: false, // loading
        userInfo: {},
        swiperCurrent: 0,
        selectCurrent: 0,
        categories: [],
        activeCategoryId: 0,
        goods: [],
        scrollTop: "0",
        loadingMoreHidden: true,

        hasNoCoupons: true,
        coupons: [],
        searchInput: '',
    },

    tabClick: function (e) {//没用的
        this.setData({
            activeCategoryId: e.currentTarget.id
        });
        this.getGoodsList(this.data.activeCategoryId);
    },
    //事件处理函数
    swiperchange: function (e) {
        //console.log(e.detail.current)
        this.setData({
            swiperCurrent: e.detail.current
        })
    },
    onShow: function () {
     //查询出商品表中的信息，存入MoodList队列中，并显示在wxml显示层
      console.log(getApp().globalData.userid);
      var agoods = Bmob.Object.extend("agoods");
      var chaxun = new Bmob.Query(agoods);//要查询的表为商品goods表
      that = this;
      chaxun.ascending("order");//排列顺序是按照order从小到大排列的
      chaxun.find({
        success: function (results) {
          that.setData({   //查询到所有的表中数据
            moodList: results,
            loading: true,
            
          });
         
        }
      });
    },
    toDetailsTap: function (e) {//点击某个商品跳转到商品的详细页面
        wx.navigateTo({
            url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id//id是选中商品的id
        })
    },
    tapBanner: function (e) {//没用的一段
        if (e.currentTarget.dataset.id != 0) {
            wx.navigateTo({
                url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
            })
        }
    },
    bindTypeTap: function (e) {
        this.setData({
            selectCurrent: e.index
        })
    },
    scroll: function (e) {
        //  console.log(e) ;
        var that = this, scrollTop = that.data.scrollTop;
        that.setData({
            scrollTop: e.detail.scrollTop
        })
        // console.log('e.detail.scrollTop:'+e.detail.scrollTop) ;
        // console.log('scrollTop:'+scrollTop)
    },
    onLoad: function () {//这一大段都是没用的
        var that = this
        wx.setNavigationBarTitle({
            title: wx.getStorageSync('mallName')
        })
        //设置写死了的轮播图列表
        that.setData({
            banners:[
                {
                    "businessId": 1,
                    "dateAdd": "2018-01-30 08:58:08",
                    "id": 4617,
                    "linkUrl": "",
                    "paixu": 0,
                    "picUrl": "http://www.wailian.work/images/2018/03/15/banner01.md.jpg",
                    "remark": "",
                    "status": 0,
                    "statusStr": "显示",
                    "title": "图片2",
                    "type": "test",
                    "userId": 3791
                },
                {
                    "businessId": 0,
                    "dateAdd": "2018-01-30 08:57:53",
                    "id": 4616,
                    "linkUrl": "",
                    "paixu": 0,
                    "picUrl": "http://www.wailian.work/images/2018/03/15/banner02.md.jpg",
                    "remark": "",
                    "status": 0,
                    "statusStr": "显示",
                    "title": "图片1",
                    "type": "test",
                    "userId": 3791
                }
            ]
        });
       
        var res = {
            "code": 0,
            "data": [
                {
                    "dateAdd": "2018-01-30 08:46:55",
                    "icon": "https://cdn.it120.cc/apifactory/2018/01/29/c0494a2bd3425e456e52b0e366023a8d.jpg",
                    "id": 7127,
                    "isUse": true,
                    "key": "000001",
                    "level": 1,
                    "name": "",
                    "paixu": 0,
                    "pid": 0,
                    "type": "手机",
                    "userId": 3791
                }
            ],
            "msg": "success"
        }

        var categories = [{id: 0, name: "全部"}];
        if (res.code == 0) {
            for (var i = 0; i < res.data.length; i++) {
                categories.push(res.data[i]);
                }
        }
        that.setData({
            categories: categories,
            activeCategoryId: 0
        });
        // that.getCoupons();
        // that.getNotice();
        //获取所有商品
        that.getGoodsList(0);
    },
    //此处为获取商品接口，此为标准请求样例
    //请求地址为：https://api.bmob.cn/1/classes/goods
    getGoodsList: function (categoryId) { //这一大段也是没用的
        if (categoryId == 0) {
            categoryId = "";
        }
        // console.log(categoryId)
        var that = this;
        //构建模拟数据
        var res = {
            "code": 0,
            "data": [
                {
                    "barCode": "000001",
                    "categoryId": 7127,
                    "characteristic": "超级大促销",
                    "commission": 0,
                    "commissionType": 0,
                    "dateAdd": "2018-01-30 08:48:23",
                    "dateStart": "2018-01-30 08:46:59",
                    "dateUpdate": "2018-01-30 08:50:16",
                    "id": 22913,
                    "logisticsId": 0,
                    "minPrice": 2599,
                    "name": "华为V10",
                    "numberFav": 0,
                    "numberGoodReputation": 0,
                    "numberOrders": 0,
                    "originalPrice": 3989,
                    "paixu": 0,
                    "pic": "https://ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=694b483f811363270aedc433a18ea056/11385343fbf2b211eb8751adc18065380dd78eac.jpg",
                    "recommendStatus": 1,
                    "recommendStatusStr": "推荐",
                    "shopId": 0,
                    "status": 0,
                    "statusStr": "上架",
                    "stores": 1000,
                    "userId": 3791,
                    "videoId": "",
                    "views": 11,
                    "weight": 0
                },
                {
                    "barCode": "000001",
                    "categoryId": 7127,
                    "characteristic": "超级大促销",
                    "commission": 0,
                    "commissionType": 0,
                    "dateAdd": "2018-01-30 08:48:23",
                    "dateStart": "2018-01-30 08:46:59",
                    "dateUpdate": "2018-01-30 08:50:16",
                    "id": 22914,
                    "logisticsId": 0,
                    "minPrice": 6666,
                    "name": "iphone X",
                    "numberFav": 0,
                    "numberGoodReputation": 0,
                    "numberOrders": 0,
                    "originalPrice": 8888,
                    "paixu": 0,
                    "pic": "https://ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=694b483f811363270aedc433a18ea056/11385343fbf2b211eb8751adc18065380dd78eac.jpg",
                    "recommendStatus": 1,
                    "recommendStatusStr": "推荐",
                    "shopId": 0,
                    "status": 0,
                    "statusStr": "上架",
                    "stores": 1000,
                    "userId": 3791,
                    "videoId": "",
                    "views": 11,
                    "weight": 0
                },
                {
                    "barCode": "000001",
                    "categoryId": 7127,
                    "characteristic": "超级大促销",
                    "commission": 0,
                    "commissionType": 0,
                    "dateAdd": "2018-01-30 08:48:23",
                    "dateStart": "2018-01-30 08:46:59",
                    "dateUpdate": "2018-01-30 08:50:16",
                    "id": 22915,
                    "logisticsId": 0,
                    "minPrice": 2899,
                    "name": "小米6",
                    "numberFav": 0,
                    "numberGoodReputation": 0,
                    "numberOrders": 0,
                    "originalPrice": 2999,
                    "paixu": 0,
                    "pic": "https://ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=694b483f811363270aedc433a18ea056/11385343fbf2b211eb8751adc18065380dd78eac.jpg",
                    "recommendStatus": 1,
                    "recommendStatusStr": "推荐",
                    "shopId": 0,
                    "status": 0,
                    "statusStr": "上架",
                    "stores": 1000,
                    "userId": 3791,
                    "videoId": "",
                    "views": 11,
                    "weight": 0
                }
            ],
            "msg": "success"
        }
     

    },
    getCoupons: function () {//没用的一段
        var that = this;
        wx.request({
            url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/coupons',
            data: {
                type: ''
            },
            success: function (res) {
                if (res.data.code == 0) {
                    that.setData({
                        hasNoCoupons: false,
                        coupons: res.data.data
                    });
                }
            }
        })
    },
  
   
    getNotice: function () {
        var that = this;
        wx.request({
            url: 'https://api.it120.cc/' + app.globalData.subDomain + '/notice/list',
            data: {pageSize: 5},
            success: function (res) {
                if (res.data.code == 0) {
                    that.setData({
                        noticeList: res.data.data
                    });
                }
            }
        })
    },
    listenerSearchInput: function (e) {
        this.setData({
            searchInput: e.detail.value
        })

    },
    toSearch: function () {
        this.getGoodsList(this.data.activeCategoryId);
    }
})
