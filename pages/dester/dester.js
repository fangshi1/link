var city = require('../../utils/city.js');

var app = getApp();
var on_url = app.globalData.on_url; //域名
var user_info;



Page({
  data: {
    tu_img: '../../images/null.png'
  },
  onShow: function(){
    //调用公共获取用户信息
    var Base = require('../../utils/base.js');
    var user_info = Base.is_user_obj('');
  },
  onLoad: function (options) {
    var that=this;
    that.jieko();
  },
  jieko: function () {
    var that = this;
    wx.request({
      url: on_url + '/xcy/home/Goods/hint',
      data: {

      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if(res.data.code != 400){
          that.setData({
            tu_img: res.data.data.pic
          })
        }
        
      },
      fail: function () {
        console.log('error')
      }
    })
  }
})