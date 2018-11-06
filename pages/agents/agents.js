var city = require('../../utils/city.js');
var app = getApp();
var on_url = app.globalData.on_url; //域名
var user_info;
var shuju=[];

Page({
  data: {
    num_money: 0, //页码
    levels:1,  //级别判断
    next_page: 1, //当前页
    total: 2, //总页
    load_hort0: "bolck",
    load_hort1: "none",//代理房源--加载
    load_hort2: "none",//代理房源--加载完成
    level_list:'',
    shuju: []   //数据
  },
  onLoad: function (options) {
    var that = this;
    console.log(options.id);
    that.setData({
      level_list: options.id
    })

    //调用公共获取用户信息
    var Base = require('../../utils/base.js');
    user_info = Base.is_user_obj('');
    //调用数据
    var hetTime = setInterval(function () {
      if (wx.getStorageSync('user_obj') != '') {
        console.log(wx.getStorageSync('user_obj'));
        user_info = wx.getStorageSync('user_obj');
        setTimeout(function () {
          that.jieko();
        }, 200);
        clearInterval(hetTime);
      }
    }, 100);

  },
  //拨打电话
  calling: function (e) {
    var that = this;
    var phoneNumber = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  //加载更多
  load_hort: function () {
    var that = this;
    var pages = that.data.next_page;
    var total = that.data.total;
    if (pages < total) {
      pages++;
      that.setData({
        next_page: pages
      })
      that.jieko();
      if (pages == total) {
        setTimeout(function () {
          that.setData({
            load_hort1: "none",//代理房源--加载
            load_hort2: "bolck"//代理房源--加载完成
          })
        }, 500)
      }
    } else {
      that.setData({
        load_hort1: "none",//代理房源--加载
        load_hort2: "bolck"//代理房源--加载完成
      })
    }
  },
  //数据接口
  jieko: function () {
    var that = this;
    wx.request({
      url: on_url + '/xcy/index.php/home/Column/level_list',
      data: {
        p: that.data.next_page,
        detail: that.data.level_list
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var total = res.data.total;
        var next_page = res.data.nowPage;
        var pick_list = res.data.data;
        if (pick_list == '' || pick_list == undefined) {
          that.setData({
            shuju: [],
            total: 1,
            load_hort0: "bolck",
            load_hort1: "none",//代理房源--加载
            load_hort2: "none",//代理房源--加载完成
          })

        } else {
          shuju = that.data.shuju;
          for (var i = 0; i < res.data.data.length; i++) {
            shuju.push(res.data.data[i])

          }
          if (total == next_page) {
            that.setData({
              load_hort0: "none",
              total: total,
              load_hort1: "none",//代理房源--加载
              load_hort2: "block",//代理房源--加载完成
              shuju: shuju
            })
          } else {

            that.setData({
              load_hort0: "none",
              total: total,
              load_hort1: "block",//代理房源--加载
              load_hort2: "none",//代理房源--加载完成
              shuju: shuju
            })
          }

        }

      },
      fail: function (res) {
        console.log('error1')
      }
    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉")
    var that = this;
    setTimeout(function () {
      wx.stopPullDownRefresh();
      that.setData({
        levels: 1,  //级别判断
        next_page: 1, //当前页
        total: 2, //总页
        load_hort0: "none",
        load_hort1: "none",//代理房源--加载
        load_hort2: "none",//代理房源--加载完成
        shuju: [] ,  //数据
        sharing: user_info.code
      })
      wx.clearStorageSync('user_obj');
      //调用公共获取用户信息
      var Base = require('../../utils/base.js');
      user_info = Base.is_user_obj('');
      //调用数据
      var hetTime = setInterval(function () {
        if (wx.getStorageSync('user_obj') != '') {
          console.log(wx.getStorageSync('user_obj'));
          user_info = wx.getStorageSync('user_obj');
          setTimeout(function () {
            that.jieko();
          }, 200);
          clearInterval(hetTime);
        }
      }, 100);
    }, 1200)
    
  }

})