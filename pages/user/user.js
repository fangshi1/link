// pages/user/user.js

var app = getApp();
var on_url = app.globalData.on_url; //域名

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shuju:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.jieko();
  },

  user_list: function(f){
    var ttid = f.currentTarget.id;
    wx.navigateTo({
      url: '../user_list/user_list?id=' + ttid
    })
  },
  //数据接口
  jieko: function () {
    var that = this;
    wx.request({
      url: on_url + '/xcy/index.php/home/Staff',
      data: {
       
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

  },
  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    console.log("下拉")
    var that = this;
    setTimeout(function () {
      wx.stopPullDownRefresh();
      that.jieko();
    }, 1200)
    
  }

  
})