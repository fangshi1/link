var city = require('../../utils/city.js');
var app = getApp();
var on_url = app.globalData.on_url; //域名
var user_info;


Page({
  data: {
    transaction: 'none', //没有交易记录
    codes:'',
    name_id: '',
    names: '',
    class_id:'',
    jibie: '',
    num_money: 0,
    shuju:[]
  },
  // onShow: function (){
  //   //调用公共获取用户信息
  //   var Base = require('../../utils/base.js');
  //       user_info = Base.is_user_obj('');
  // },
  onLoad: function (options) {
    var that = this;
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
        }, 200)
        clearInterval(hetTime);
      }
    }, 100);
    wx.setNavigationBarTitle({ title: '我的列表' });
  },
  //跳详细信息
  detailed_xianxia: function (e) {
    var ids = e.currentTarget.id;
    var that = this;
    wx.navigateTo({
      url: '../detailed_xianxia/detailed_xianxia?id=' + ids
    })
  },

  //数据接口
    jieko: function() {
      var that = this;
      wx.request({
        url: on_url +'/xcy/index.php//home/Column/get_lin',
        data: {
          "code": user_info.code   //分享码
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res);
          var money = res.data.num;
          if (res.data.code==200){
            that.setData({
              transaction: 'none',
              num_money: money,
              shuju: res.data.data
            });
          }else{
            that.setData({
              transaction: 'bolck'
            });
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
        sharing: user_info.code
      })
    }, 1200)
    that.jieko();
  }

})