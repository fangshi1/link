var city = require('../../utils/city.js');
var app = getApp();
var on_url = app.globalData.on_url; //域名
var user_info;


Page({
  data: {
    jang: "bolck",
    xm:'', //姓名
    dh: '', //电话
    wx: '', //微信
    xq: '', //详情
    willids: 1, //需求id
    searchLetter: [], 
    will: "买房", //需求
    xiang: "none",
    fff: ""
  },
  onShow: function(){
    //调用公共获取用户信息
    var Base = require('../../utils/base.js');
        user_info = Base.is_user_obj('');
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    console.log(options);
    var that=this;
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 1000
    });
    var willids = options.id;
    // 页面初始化 options为页面跳转所带来的参数  
    that.setData({
      searchLetter: [],
      xiang: "none",
      fff: "",
      willids: willids,
      will: options.will
    });
    // wx.setNavigationBarTitle({ title: '当前页面' });
  },
  xuangzhe: function(){
    this.setData({
      jang: "bolck",
      xiang: "none"
    })
  },
  tiaojian: function (w) {
    console.log(w);
    var will = w.currentTarget.dataset.text;
    var willids = w.currentTarget.id;
    this.setData({
      xiang: "none",
      jang: "bolck",
      willids: willids,
      will: will
    })
  },
  xm: function (h) {
    console.log(h);
    var will = h.detail.value;
      this.setData({
        xm: will
    })
  },
  dh: function (h) {
    console.log(h);
    var will = h.detail.value;
    this.setData({
      dh: will
    })
  },
  wx: function (h) {
    console.log(h);
    var will = h.detail.value;
    this.setData({
      wx: will
    })
  },
  
  xq: function (h) {
    console.log(h);
    var will = h.detail.value;
    this.setData({
      xq: will
    })
  },
  jang: function () {
    this.setData({
      xiang: "none",
      jang: "bolck"
    })
  },
  fabu: function(){
    this.jieko();
  },
  //数据接口
    jieko: function() {
      var that = this;
      wx.request({
        url: on_url+'/xcy/home/column/request',
        data: {
          "openid": user_info.openid, //唯一标识
          "name": that.data.xm, //昵称-姓名
          "phone": that.data.dh, //电话
          // "wechat": that.data.wx, //微信
          "request": that.data.willids, //需求
          "detail": that.data.xq  //描述
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res);
          // that.setData({
          //   loat: res.data.data
          // })
          var ggg = res.data.msg+"";
          var vodes = res.data.code;
          wx.showModal({
            title: ggg,
            content: '',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else {
                console.log('用户点击取消')
              }
              if (vodes == 200) {
                setTimeout(function () {
                  wx.switchTab({
                    url: '../index/index'
                  })
                }, 500)
              }
            }
          })
          // console.log(ggg);
         
        },
        fail: function () {
          console.log('error1')
        }
      })

    },

  
  // onShareAppMessage: function () {
  //   // 用户点击右上角分享
  //   return {
  //     title: 'title', // 分享标题
  //     desc: 'desc', // 分享描述
  //     path: 'path' // 分享路径
  //   }
  // }

})