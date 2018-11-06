// pages/chaxun/chaxun.js
var app = getApp();
// require('../../utils/base.js');
var shuju=[];
var on_url = app.globalData.on_url; //域名
var user_info;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    dianjiyichan: "bolck", //点击隐藏
    pages: 1,//当前页
    total: 1, //总页
    loat: [],//接口数据
    shuju: [],//查询数据
    shujuyuan: 'none',
    jiazaigenduo: "点击加载更多",
    tupian: "shang",
    id: 0,
    xiaoqu: "",
    baval: '',
    fangyuan: "二手房",
    loat:[],
    pres: [
      {
        preX: "二手房"
      },
      {
        preX: "新房"
      },
      {
        preX: "租房"
      },
      {
        preX: "公寓"
      }
    ],  
    kle: 0  //判断条件id
  },
  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    var Base = require('../../utils/base.js');
    user_info = Base.is_user_obj('');

    this.jieko();
  },
  //输入查询
  xiaoqu: function(e){
    var xiaoqu = e.detail.value;
    console.log(xiaoqu);
    this.setData({
      pages: 1,
      xiaoqu: xiaoqu
    })
    // this.jieko();
  },
  
  //点击加载更多
  dianjijiazai: function(e){
    var that=this;
    var pages = that.data.pages;
    var total = that.data.total;

    if (pages<total){
      pages++;
      this.setData({
        pages: pages
      })
      that.jiekoss();
      if (pages == total){
        setTimeout(function () {
          that.setData({
            jiazaigenduo: "已加载全部"
          })
        }, 1000)
      }

    }else{
      that.setData({
        jiazaigenduo: "已加载全部"
      })

    }

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
  dianji: function (a) {
    console.log(a);
    var kang = a.currentTarget.dataset.id;
    if (kang == 0) {
      this.setData({
        tupian: "xia",
        baval: '',
        kle: 1
      })
    } else {
      this.setData({
        tupian: "shang",
        baval: '',
        kle: 0
      })
    }
    
  },
  //数据接口-查询
  jieko: function () {
    var that = this;
    var fangyuans = that.data.fangyuan;
    if (fangyuans == '租房'){
      fangyuans ='租'
    }
    wx.request({
      url: on_url+ '/xcy/home/Goods/search',
      data: {
        p: 1,
        click: fangyuans,
        area: app.globalData.citys,
        name: that.data.xiaoqu
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var codes = res.data.code;
        var loat = res.data.data;
        console.log(codes)
        var shuju=that.data.shuju;
        if (codes == "200") {
          var total = res.data.data.page.total;
          shuju = res.data.data.list;
          // for (var i = 0; i < res.data.data.list.length; i++) {
          //   shuju.push(res.data.data.list[i])

          // }
          if (total==1){
            that.setData({
              shujuyuan: 'none',
              dianjiyichan: "bolck",
              jiazaigenduo: "已加载全部",
            })
          } else {
            that.setData({
              shujuyuan: 'none',
              dianjiyichan: "bolck",
              jiazaigenduo: "点击加载更多",
            })
          }
          console.log(shuju);
        } else {
          var total = 1;
          that.setData({
            dianjiyichan: "none",
            shujuyuan: 'bolck',
            jiazaigenduo: "已加载全部",
          })
        }

        that.setData({
          total: total,
          shuju: shuju,
          loat: loat
        })
        console.log(that.data.shuju);
      },
      fail: function () {
        console.log('error1')
      }
    })
  },
  //数据接口-加载
  jiekoss: function () {
    var that = this;
    wx.request({
      url: on_url + '/xcy/home/Goods/search',
      data: {
        p: that.data.pages,
        click: that.data.fangyuan,
        name: that.data.xiaoqu
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var codes = res.data.code;
        var loat = res.data.data;
        var shuju = that.data.shuju;
        console.log(codes)
        if (codes == "200") {
          var total = res.data.data.page.total;
          if (total == 1) {
            that.setData({
              shujuyuan: 'none',
              dianjiyichan: "bolck",
              jiazaigenduo: "已加载全部",
            })
          }else{
            that.setData({
              shujuyuan: 'none',
              dianjiyichan: "bolck",
              jiazaigenduo: "点击加载更多",
            })
          }
          for (var i = 0; i < res.data.data.list.length; i++) {
            shuju.push(res.data.data.list[i])

          }
          console.log(shuju);
        } else {
          var total = 1;
          that.setData({
            dianjiyichan: "none",
            shujuyuan: 'bolck',
            jiazaigenduo: "已加载全部",
          })
        }

        that.setData({
          total: total,
          shuju: shuju,
          loat: loat
        })
        console.log(that.data.loat);
      },
      fail: function () {
        console.log('error1')
      }
    })
  },
  //选择房子类查询
  cx_xiang: function(k){
    console.log(k);
    var fang = k.currentTarget.dataset.id;
    var fangyuan = k.currentTarget.dataset.text;

      this.setData({
        id: fang,
        pages: 1,
        xiaoqu: '',
        kle: 0 , //判断条件id
        shuju: [],
        fangyuan: fangyuan,
        tupian: "shang"
      })   
      this.jieko();
  },
  // 点击搜索查询
  suoso_on: function(){
    this.setData({
     shuju:[]
    })
    this.jieko();

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (w) {
    console.log(w);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (w) {
    // console.log(w);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})