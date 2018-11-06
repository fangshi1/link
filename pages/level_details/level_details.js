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
  onShow: function (){
    //调用公共获取用户信息
    var Base = require('../../utils/base.js');
        user_info = Base.is_user_obj('');
  },
  onLoad: function (options) {
    var that = this;
    // 生命周期函数--监听页面加载
    // options 跳转传送的数据
    console.log(options);
    var codes = options.code; //code
    var class_id = options.class_id;
    var name_id = options.name_id; //一级，二级
    var names = options.names; //名字
    that.setData({
      codes: codes,
      name_id: name_id,
      jibie: class_id,
      class_id: class_id,
      names: names
    });
    that.jieko();

    wx.setNavigationBarTitle({ title: '下级详情' });
  },
  //跳详细信息
  detailed_table: function (e) {
    var ids = e.currentTarget.id;
    var that = this;
    wx.navigateTo({
      url: '../detailed_table/detailed_table?id=' + ids + '&codes=' + that.data.codes + "&jibie=" + that.data.jibie
    })
  },

  //数据接口
    jieko: function() {
      var that = this;
      wx.request({
        url: on_url +'/xcy/index.php/home/column/get_earnings',
        data: {
          "code": that.data.codes,   //分享码
          "step": 1,//分享码
          "class": that.data.class_id   //分享码
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