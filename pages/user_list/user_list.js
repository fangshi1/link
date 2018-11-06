// pages/user_list/user_list.js

var app = getApp();
var on_url = app.globalData.on_url; //域名

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shuju:[],
    yid:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that=this;
    that.setData({
      yid: options.id
    });
    that.jieko();
  },
  //数据接口
  jieko: function () {
    var that = this;
    wx.request({
      url: on_url + '/xcy/index.php/home/staff/staff_one',
      data: {
        id: that.data.yid
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data.data);

        that.setData({
          shuju: res.data.data
        });
      },
      fail: function (res) {
        console.log('error1')
      }
    })

  }



})