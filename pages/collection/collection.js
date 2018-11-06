// pages/chaxun/chaxun.js
var app = getApp();
var shuju=[];
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

  /**
   * 页面的初始数据
   */
  data: {
    dianjiyichan: "bolck", //点击隐藏
    pages: 1,//当前页
    shujuyuan: 'none',
    total: 1, //总页
    loat: [],//接口数据
    shuju: [],//查询数据
    jiazaigenduo: "点击加载更多",
    tupian: "shang",
    pid: 0,
    loat:[],
    suosou_val: '',  //输入框值
    fangyuan: '新房', //房类查询
    pres: [   //房类数据
      {
        preX: "新房"
      },
      {
        preX: "二手房"
      },
      {
        preX: "整租"
      },
      {
        preX: "合租"
      },
      {
        preX: "公寓"
      }
    ],  

  },
  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    //调用公共获取用户信息
    var Base = require('../../utils/base.js');
        user_info = Base.is_user_obj('');
    this.jieko();
    this.setData({
      pages: 1,
      shuju: [],//查询数据
      jiazaigenduo: "点击加载更多"
    })
    wx.setNavigationBarTitle({ title: '收藏' });
  },
  //点击加载更多
  dianjijiazai: function (e) {
    var that = this;
    var pages = that.data.pages;
    var total = that.data.total;
    console.log(total);
    if (pages < total) {
      pages++;
      this.setData({
        pages: pages,
        total: total
      })
      that.jiekoss();
      if (pages == total) {
        setTimeout(function () {
          that.setData({
            jiazaigenduo: "已加载全部"
          })
        }, 1000)
      }

    } else {
      that.setData({
        jiazaigenduo: "已加载全部"
      })

    }

  },

  //数据接口
  jieko: function () {
    var that = this;
    console.log("....:" + app.globalData.openid + "...:" + that.data.fangyuan + "...:" + that.data.suosou_val)
    wx.request({
      url: on_url+'/xcy/home/Goods/getuser',
      data: {
        "p": 1,
        "openid": user_info.openid,
        "click": that.data.fangyuan, //标签
        "name": that.data.suosou_val, //地区
      },
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },

      success: function (res) {
        var codes = res.data.code;
        var loat = res.data.data;
        console.log(codes)
        if (codes == "200") {
          var total = res.data.data.page.total;
          if (total == 1) {
            that.setData({
              shujuyuan: 'none',
              jiazaigenduo: "已加载全部",
              dianjiyichan: "bolck"
            })
          } else {
            console.log(444);
            that.setData({
              shujuyuan: 'none',
              jiazaigenduo: "点击加载更多",
              dianjiyichan: "bolck"
            })
          }
          that.setData({
            pages: 1,
            total: total,
            shuju: res.data.data.list,
            loat: loat
          })
        } else {
          var total = 1;
          that.setData({
            pages: 1,
            total: total,
            shuju: [],
            loat: [],
            shujuyuan: 'bolck',
            dianjiyichan: "none"
          })
        }
        
        
        console.log(res.data.data);
      },
      fail: function () {
        console.log('error1')
      }
    })
  },
  //数据接口
  jiekoss: function () {
    var that = this;
    console.log("....:" + app.globalData.openid + "...:" + that.data.fangyuan + "...:" + that.data.suosou_val)
    wx.request({
      url: on_url + '/xcy/home/Goods/getuser',
      data: {
        "p": that.data.pages,
        "openid": user_info.openid,
        "click": that.data.fangyuan, //标签
        "name": that.data.suosou_val, //地区
      },
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },

      success: function (res) {
        var codes = res.data.code;
        var loat = res.data.data;
        console.log(codes)
        if (codes == "200") {
          var total = res.data.data.page.total;
          if (total == 1) {
            that.setData({
              jiazaigenduo: "已加载全部",
              shujuyuan: 'none',
              dianjiyichan: "bolck"
            })
          } else {
            that.setData({
              jiazaigenduo: "点击加载更多",
              shujuyuan: 'none',
              dianjiyichan: "bolck"
            })
          }
          var shuju = that.data.shuju;
          for (var i = 0; i < res.data.data.list.length; i++) {
            shuju.push(res.data.data.list[i])

          }
          console.log(shuju);
        } else {
          var total = 1;
          that.setData({
            jiazaigenduo: "已加载全部",
            shujuyuan: 'bolck',
            dianjiyichan: "none"
          })
        }

        that.setData({
          total: total,
          shuju: shuju,
          loat: loat
        })
        // console.log(that.data.loat);
      },
      fail: function () {
        console.log('error1')
      }
    })
  },
  //房类查询
  dianji_list: function(k){
    console.log(k);
    var fang = k.currentTarget.dataset.id;
    var fangyuan = k.currentTarget.dataset.text;

      this.setData({
        pid: fang,
        pages:1,
        shuju:[],
        suosou_val:'',
        fangyuan: fangyuan
      }) 
    //数据接口
    this.jieko();
  },
  //输入查询
  suosou: function(e){
    var suosou_val = e.detail.value;
    this.setData({
      suosou_val: suosou_val
    }) 
    console.log(this.data.id);
  },
  //商品跳详情事件
  shop_dian: function (t) {
    console.log(t);
    var gid = t.currentTarget.id;//商品id
    app.globalData.gid = gid;//设置全局变量(app已经定义 var app=getApp())
    wx.navigateTo({
      url: '../detaile/detaile?id=' + gid
    })
  },
  //输入框的值
  suosou: function(w){
    console.log(w);
    var suosou_val = w.detail.value;
    this.setData({
      suosou_val: suosou_val
    }) 
  },
  //清除房类查询
  suosoup: function(){ 

    this.jieko();
  },
  //查询-确定键
  quedin: function(){
    this.setData({
      shuju: []
    }) 
    this.jieko();
  },
 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})