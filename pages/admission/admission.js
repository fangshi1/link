var city = require('../../utils/city.js');
var app = getApp();
var on_url = app.globalData.on_url; //域名
var user_info;
var mobiles = false; //电话输入判断

Page({
  data: {
    jang: "none",
    y1_hide: 'none',
    y2_hide: 'none',
    y3_hide: 'none',
    y4_hide: 'none',
    y5_hide: 'none',
    y6_hide: 'none',
    tuijian: '',//推荐码
    num_money: 0, //总收益
    kshuju: '',
    sharing: '--',
    xm:'', //姓名
    dh: '', //电话
    fx: '', //分享码
    shuju:[],
    shuju1:[
      // {"name":"齐林"}
      ],
    shuju2: [
 
    ],
    searchLetter: [], 
    xiang: "none",
    fff: ""
  },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    //调用本地用户信息
    var that=this;
    var Base = require('../../utils/base.js');
        user_info = Base.is_user_obj('');

    that.setData({
      searchLetter: [],
      xiang: "none"
    });

    //调用数据
    var hetTime = setInterval(function () {
      if (wx.getStorageSync('user_obj') != '') {
        console.log(wx.getStorageSync('user_obj'));
        user_info = wx.getStorageSync('user_obj');
        console.log(user_info.is_enter);
          //入驻详情页面
          setTimeout(function () {
            that.setData({
              sharing: user_info.code
            })
            that.jiekoh();
          }, 200);
        clearInterval(hetTime);
      }
    }, 100);

    
  },
  xuangzhe: function(){
    this.setData({
      jang: "none",
      xiang: "block"
    })
  },
  tiaojian: function (w) {
    console.log(w);
    var will = w.currentTarget.dataset.text;
    this.setData({
      xiang: "none",
      jang: "bolck"
    })
  },
  // 姓名
  xm: function (h) {
    console.log(h);
    var will = h.detail.value;
      this.setData({
        xm: will
    })
  },
// 电话
  dh: function (h) {
    console.log(h);
    var will = h.detail.value;
    this.setData({
      dh: will
    })
  },
// 分享
  fx: function (h) {
    console.log(h);
    var will = h.detail.value;
    this.setData({
      fx: will
    })
  },
  
  
  jang: function () {
    this.setData({
      xiang: "none",
      jang: "bolck"
    })
  },
  fabu: function(){
    var that=this;
    //调用数据
    var hetTime = setInterval(function () {
      if (wx.getStorageSync('user_obj') != '') {
        // console.log(wx.getStorageSync('user_obj'));
        user_info = wx.getStorageSync('user_obj');
        setTimeout(function () {
          that.jieko();
        }, 300);
        clearInterval(hetTime);
      }
    }, 200);
  },
//跳下线详情判断
  lower_level_details: function(e){
    console.log(e);
    var codes = e.currentTarget.dataset.text;
    var names = e.currentTarget.dataset.index;
    var name_id = e.currentTarget.dataset.id;
    var class_id = e.currentTarget.id;
    wx.navigateTo({
      url: '../level_details/level_details?code=' + codes + '&names=' + names + '&name_id=' + name_id + "&class_id=" + class_id
    })
  },
  //数据获取接口
  jiekoh: function () {
    var that = this;
    wx.request({
      url: on_url + '/xcy/home/Column/get_push',
      data: {
        "openid": user_info.openid
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
       console.log(res);
        //当用户为200时，显示有下级的页面
        if (res.data.code == 200) {
          app.globalData.admission = "下级列表";
          wx.setNavigationBarTitle({ title: '下级列表' });
          var zhangshi1 = res.data.data.one || 0;
          var zhangshi2 = res.data.data.tow;
          //判断是否有一级下级 没有则隐藏
          
          if (zhangshi1 != 0){
            zhangshi1 = res.data.data.one.length;
          } 
           //判断是否有二级下级 没有则隐藏
          if (zhangshi2 == null){
            that.setData({
              y6_hide: 'none'
            })
          } else{
            that.setData({
              y6_hide: 'bolck'
            })
            zhangshi2 = res.data.data.tow.length;
          }
          if (zhangshi1 <= 5){
            that.setData({
              y4_hide: 'none'
            })
          }else{
            that.setData({
              y4_hide: 'bolck'
            })
          };
          if (zhangshi2 <= 5) {
            that.setData({
              y5_hide: 'none'
            })
          } else {
            that.setData({
              y5_hide: 'bolck'
            })
          };
          var num_money = res.data.num;
          if (num_money == undefined){
            num_money = 0;
          }
          console.log(res.data.num)
          console.log(num_money)
          that.setData({
            y1_hide: 'none',
            y2_hide: 'bolck',
            y3_hide: 'none',
            num_money: num_money,
            shuju1: res.data.data.one,
            shuju2: res.data.data.tow
          });
          app.globalData.admission = "下级列表";
          wx.setNavigationBarTitle({ title: '下级列表' });
          app.globalData.miss = "已入驻";
        }else{
          //否则显示没有下线页面
          if (res.data.code == 100){
            that.setData({
              y1_hide: 'none',
              y2_hide: 'none',
              y3_hide: 'bolck'
            });
            app.globalData.admission = "入驻列表";
            wx.setNavigationBarTitle({ title: '入驻列表' });
            app.globalData.miss = "已入驻";
          }else{
            //提交页面
            that.setData({
              sharing: user_info.code,
              y1_hide: 'bolck',
              y3_hide: 'none',
              y2_hide: 'none'
            })
            app.globalData.admission = "加入我们";
            wx.setNavigationBarTitle({ title: '加入我们' });
            app.globalData.miss = "未入驻";
            console.log("请求失败！");
          }

          // console.log(res.data.data.one);
        }
      },
      fail: function () {
        console.log('error1')
      }
    })

  },

  //数据提交接口
    jieko: function() {
      var that = this;
      var tuijian = that.data.xm;
      // console.log(tuijian);
      if (tuijian ==''){
        wx.showToast({
          title: '请输入姓名！',
          icon: 'success',
          duration: 1500
        })
        return false;
      }
      that.validatemobile(that.data.dh);
      console.log(mobiles);
      if (mobiles == true){
        console.log("进入");
        wx.request({
          url: on_url + '/xcy/home/Column/enter',
          data: {
            "name": that.data.xm, //昵称-姓名
            "phone": that.data.dh, //电话
            "openid": user_info.openid,
            "self_code": user_info.code //分享码
          },
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res);

            // var ggg = res.data.msg + "";
            var vodes = res.data.code;
            var vodesd = res.data.is_enter;
            wx.showModal({
              title: "申请成功",
              content: '',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else {
                  console.log('用户点击取消')
                }
                if (vodes == 200 || vodesd == false) {
                  setTimeout(function () {
                    that.setData({
                      sharing: user_info.code,
                      y1_hide: 'none',
                      y3_hide: 'bolck',
                      y2_hide: 'none'
                    })
                    wx.setNavigationBarTitle({ title: '入驻列表' });
                    // 直接把用户信息存入 本地缓存
                    // wx.setStorageSync('ruzhu','false');
                    app.globalData.admission = "入驻列表";
                    app.globalData.miss = "已入驻";
                  }, 500);

                }else{
                  setTimeout(function () {
                    that.setData({
                      sharing: user_info.code,
                      y1_hide: 'bolck',
                      y3_hide: 'none',
                      y2_hide: 'none'
                    })
                    wx.setNavigationBarTitle({ title: '加入我们' });
                    // 直接把用户信息存入 本地缓存
                    // wx.setStorageSync('ruzhu', '');
                    app.globalData.admission = "加入我们";
                    app.globalData.miss = "未入驻";
                  }, 500);
                }
              }
            })

          },
          fail: function () {
            console.log('error1')
          }
        })
      }else{
        // return false;
      }
     
    },


 validatemobile: function (mobile) {
   console.log(mobile)
    if (mobile.length == 0) {
          wx.showToast({
            title: '请输入手机号！',
            icon: 'success',
            duration: 1500
          })
      return false;
    }
    if (mobile.length != 11) {
      
        wx.showToast({
            title: '号码长度有误！',
            icon: 'success',
            duration: 1500
        })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
           wx.showToast({
            title: '手机号有误！',
            icon: 'success',
            duration: 1500
          })
      return false;
    }
   mobiles = true;
    return true;
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
    that.jiekoh();
  }




  // onShareAppMessage: function () {
  //   // 用户点击右上角分享
  //   return {
  //     title: 'title', // 分享标题
  //     desc: 'desc', // 分享描述
  //     path: 'path' // 分享路径
  //   }
  // }

})