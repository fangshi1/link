var city = require('../../utils/city.js');
var app = getApp();
var on_url = app.globalData.on_url; //域名
var user_info;

Page({
  data: {
    ids:'',
    codes: '',
    jibie: '',
    shuju:[]
  },
  // onShow: function(){
  //   //调用公共获取用户信息
  //   var Base = require('../../utils/base.js');
  //   user_info = Base.is_user_obj('');
  // },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    // options 跳转传送的数据
    console.log(options);
    var that = this;
    var ids = options.id; //code
    //调用公共获取用户信息
    var Base = require('../../utils/base.js');
    user_info = Base.is_user_obj('');
    //调用数据
    var hetTime = setInterval(function () {
      if (wx.getStorageSync('user_obj') != '') {
        console.log(wx.getStorageSync('user_obj'));
        user_info = wx.getStorageSync('user_obj');
        setTimeout(function () {
          that.setData({
            ids: ids
          })
          that.jieko();
        }, 500)
        clearInterval(hetTime);
      }
    }, 300);
  },
  //数据接口
    jieko: function() {
      var that = this;
      wx.request({
        url: on_url +'/xcy/index.php//home/Column/get_lin',
        data: {
          "code": user_info.code,
          "id": that.data.ids   //id
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res);
          var titles = res.data.data.houses_name;
          wx.setNavigationBarTitle({ title: titles });
          that.setData({
            shuju: res.data.data
          })

        },
        fail: function (res) {
          console.log('error1')
        }
      })

    }
  

})