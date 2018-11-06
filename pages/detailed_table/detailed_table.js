var city = require('../../utils/city.js');
var app = getApp();
var on_url = app.globalData.on_url; //域名
var user_info;

// console.log(user_info);
// if (user_info == undefined) {
//   app.globalData.sharing = '';
// } else {
//   //获取用户信息
//   app.globalData.user_pcode = user_info.pcode; //父级code
//   app.globalData.openid = user_info.openid; //自己的openid
//   app.globalData.sharing = user_info.code; //自己的code
// }

Page({
  data: {
    ids:'',
    codes: '',
    jibie: '',
    shuju:[]
  },
  onShow: function(){
    //调用公共获取用户信息
    var Base = require('../../utils/base.js');
    user_info = Base.is_user_obj('');
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    // options 跳转传送的数据
    console.log(options);
    var that = this;
    var ids = options.id; //code
    var codes = options.codes; //code
    var jibie = options.jibie;
    that.setData({
      codes: codes,
      jibie: jibie,
      ids: ids
    });
    that.jieko();
  },
  //数据接口
    jieko: function() {
      var that = this;
      wx.request({
        url: on_url +'/xcy/index.php/home/column/get_earnings',
        data: {
          "code": that.data.codes,   //分享码
          "step": 2,  //
          "class": that.data.jibie, 
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