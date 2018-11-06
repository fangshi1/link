var bmap = require('../../libs/bmap-wx.min.js'); //调用百度地图接口

var city = require('../../utils/city.js');
var app = getApp();
var on_url = app.globalData.on_url; //域名
var wxMarkerData = [];//调用百度地图接口
var clickname='';
var user_info;
var shuju_ = [];
//热门城市
var horts = [
  { "id": "1", "name": "惠州市" },
  { "id": "2", "name": "广州市" },
  { "id": "3", "name": "佛山市" },
  { "id": "4", "name": "深圳市" },
  { "id": "5", "name": "成都市" },
  { "id": "6", "name": "杭州市" },
  { "id": "7", "name": "南京市" },
  { "id": "8", "name": "天津市" },
  { "id": "9", "name": "北京市" }
];
Page({
  data: {
    agents:[
      {'id':'1','name':'秦始皇'},
      { 'id': '2', 'name': '李白' },
      { 'id': '3', 'name': '杜浦' },
      { 'id': '4', 'name': '陆小凤' },
    ],
    // ----------------用户授权
    mou_box: 'none', //模态框显示情况
    body_height: '100vh', //禁止下滑
    // ----------------用户授权
    userInfo:[],
    admission_text: '加入我们', //入驻按钮显示文字
    list:"list",
    admission: 'admission',
    dinwei_city:'惠州', //定位城市
    loat:[], //首页数据
    shujuan1:"none",
    shujuan2: "none",
    shujuan3: "none",
    horts: horts,
    winHeight: 0,
    tHeight: 0,
    bHeight: 0,
    xianshi: "none", //bolck,none
    body_cen: "bolck",
    startPageY: 0,
    isShowLetter: false,
    shuju:[], //代理房源数据
    load_hort0: "bolck",
    load_hort1: "bolck",//代理房源--加载
    load_hort2: "none",//代理房源--加载完成
    next_page:1, //当前页
    total:2, //总页
    scrollTop: 0,
    city: "惠州"     //页面展示城市
  },
  
  onLoad: function (options) {
    var that = this;
    // 生命周期函数--监听页面加载
    var searchLetter = city.searchLetter;
    var cityList = city.cityList();
    var sysInfo = wx.getSystemInfoSync();
    // console.log(sysInfo);
    var winHeight = sysInfo.windowHeight;
    //刷新数据
    //添加要匹配的字母范围值
    //1、更改屏幕高度设置子元素的高度
    var itemH = winHeight / searchLetter.length;
    itemH = parseInt(itemH);
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;

      tempObj.push(temp)
    }
    that.nijiexi()
    that.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList
    });
    var getAppInfo = app.globalData.userInfo;

    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 2000
    });
    that.jieko_pick();
  },

  onShow: function(){
    //调用公共获取用户信息
    var that = this;
    if (app.globalData.admission == undefined) {
      that.setData({
        admission_text: "加入我们"
      })
    } else {
      that.setData({
        admission_text: app.globalData.admission
      })
    }
    setTimeout(function(){
      that.user_off();
    },500);
    that.setData({
      xianshi: "none", //bolck,none
      body_cen: "bolck",
    })
    var cate_text = "现房";
    if (user_info == '' || user_info==undefined){
      //调用数据
      var hetTime = setInterval(function () {
        if (wx.getStorageSync('user_obj') != '') {
          console.log(wx.getStorageSync('user_obj'));
          user_info = wx.getStorageSync('user_obj');
          setTimeout(function () {
            that.jieko_inf();
            if (user_info.is_enter==1){
              app.globalData.admission ="入驻列表";
              that.setData({
                admission_text: app.globalData.admission
              })
            }
            
          }, 200);
          clearInterval(hetTime);
        }
      }, 100);
    }
    app.globalData.cate_text = cate_text;//设置全局变量(app已经定义 var app=getApp())
  },
  //代理搜索
  agents: function(t){
    console.log(t);
    var gid = t.currentTarget.dataset.text;//商品id
    wx.navigateTo({
      url: '../agents/agents?id=' + gid
    })
  },
  //购房-租房
  submission: function (f) {
    console.log(f);
    var tt = f.currentTarget.dataset.text;
    var ttid = f.currentTarget.id;
    wx.navigateTo({
      url: '../submission/submission?will=' + tt + '&id=' + ttid
    })
  },
  subordinate: function(){
    wx.navigateTo({
      url: '../user/user'
    })
  },
  //加载更多
  load_hort: function(){
      var that = this;
      var pages = that.data.next_page;
      var total = that.data.total;
      if (pages < total) {
        pages++;
        that.setData({
          next_page: pages
        })
        that.jieko_inf();
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

  // -------------------------------------------------用户授权-----------------------------
  //判断用户是否授权
  user_off: function(){
    var that = this;
    // 查看是否授权
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          body_height: 'auto', //开放滚动条
          mou_box: 'none'   //模态框不显示
        });
        var Base = require('../../utils/base.js');
        user_info = Base.is_user_obj('');
        
      }, fail: function (res) {
        console.log(res);
        that.setData({
          body_height: '100vh',//禁止下滑
          mou_box: 'bolck'    //模态框显示    
        });
      }
    });
    
  },
  //监听用户是否允许授权--点击取消--或者确定-
  onGotUserInfo: function(e){
    var that = this;
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      console.log("用户按了允许授权按钮");
      var Base = require('../../utils/base.js');
      user_info = Base.is_user_obj('');
      that.setData({
        body_height: 'auto',
        mou_box: 'none'
      });
    } else {
      //用户按了拒绝按钮
      console.log("用户按了拒绝按钮");
      that.setData({
        body_height: '100vh',
        mou_box: 'bolck'
        
      });
    }
  },
  //数据接口-代理人
  jieko_pick: function () {

    var that = this;
    wx.request({
      url: on_url + '/xcy/home/Column/level_list',
      data: {
        // is_dl: user_info.is_enter,
        // p: that.data.next_page
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var jieko_pick1 = res.data.data[0];
        var jieko_pick2 = res.data.data[1];
        var jieko_pick3 = res.data.data[2];
        var jieko_pick4 = res.data.data[3];
        
        if (jieko_pick1 == '' || jieko_pick1 == undefined){
          var pick1 = { "id": "1", "user": "代理人", "avatarurl":"../../images/default_user.gif"};
        }else{
          var  pick1 = jieko_pick1;
        }
        if (jieko_pick2 == '' || jieko_pick2 == undefined){
          var pick2 = { "id": "2", "user": "代理人", "avatarurl": "../../images/default_user.gif" };
        } else {
          var  pick2 = jieko_pick2;
        }
        if (jieko_pick3 == '' || jieko_pick3 == undefined) {
          var pick3 = { "id": "3", "user": "代理人", "avatarurl": "../../images/default_user.gif" };
         } else {
          var pick3 = jieko_pick3;
         }
        if (jieko_pick4 == '' || jieko_pick4 == undefined) {
          var pick4 = { "id": "4", "user": "代理人", "avatarurl": "../../images/default_user.gif" };
        } else {
          var pick4 = jieko_pick4;
        }
        that.setData({
          jieko_pick1: pick1,
          jieko_pick2: pick2,
          jieko_pick3: pick3,
          jieko_pick4: pick4,
        })

      },
      fail: function () {
        console.log('error1')
      }
    })

  },

// -------------------------------------------------/用户授权-----------------------------
  //数据接口-代理
  jieko_inf: function () {
    var that = this;
    if (user_info.is_enter==1){
      wx.request({
        url: on_url + '/xcy/home/goods/pick',
        data: {
          is_dl: user_info.is_enter,
          p: that.data.next_page
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          // console.log(res);
          var total = res.data.data.page.total;
          var next_page = res.data.data.page.nowPage;
          var pick_list = res.data.data.list;
          if (pick_list == '' || pick_list == undefined) {
            that.setData({
              shuju: [],
              total: 1,
              load_hort0: "none",
              load_hort1: "none",//代理房源--加载
              load_hort2: "none",//代理房源--加载完成
            })

          } else {
            shuju_ = that.data.shuju;
            for (var i = 0; i < res.data.data.list.length; i++) {
              shuju_.push(res.data.data.list[i])

            }
            if (total == next_page) {
              that.setData({
                load_hort0: "block",
                total: total,
                load_hort1: "none",//代理房源--加载
                load_hort2: "block",//代理房源--加载完成
                shuju: shuju_
              })
            } else {

              that.setData({
                load_hort0: "block",
                total: total,
                load_hort1: "block",//代理房源--加载
                load_hort2: "none",//代理房源--加载完成
                shuju: shuju_
              })
            }

          }

        },
        fail: function () {
          console.log('error1')
        }
      })
    }else{
      that.setData({
        shuju: [],
        total: 1,
        load_hort0: "none",
        load_hort1: "none",//代理房源--加载
        load_hort2: "none",//代理房源--加载完成
      })
    }




  },

  //数据接口
  jieko: function(){
    var that=this;
    wx.request({
      url: on_url+ '/xcy/home/Goods/index',
      data: {
        area: that.data.city
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // console.log(res);
        
        if (res.data.data.es==''){
          that.setData({
            shujuan1: "block"
          })
        }else{
          that.setData({
            shujuan1: "none"
          })
        }
        if (res.data.data.xf == '') {
          that.setData({
            shujuan2: "block"
          })
        } else {
          that.setData({
            shujuan2: "none"
          })
        }
        if (res.data.data.zf == '') {
          that.setData({
            shujuan3: "block"
          })
        } else {
          that.setData({
            shujuan3: "none"
          })
        }
        that.setData({
          loat: res.data.data
        })
        // console.log(that.data.loat);
      },
      fail: function () {
        console.log('error1')
      }
    })
    
  },
  // 更多
  gengduo: function(){
    wx.switchTab({
      url: '../listpage/listpage'
    })
  },
  //热门选择
  remen: function (r) {
    console.log(r);
    var din = r.currentTarget.dataset.idx;
    var xzk = r.currentTarget.dataset.text;

    console.log(din);
    this.setData({
      xianshi: "none",
      body_cen: "bolck",
      currentTab: din,
      city: xzk
    })
    var citys = this.data.city;
    app.globalData.citys = citys;//设置全局变量
    this.jieko();
  },
  listpage: function (e) {
    // console.log(e);
    var cate_text = e.currentTarget.dataset.text;
    app.globalData.cate_text = cate_text;//设置全局变量
    wx.switchTab({
      url: '../listpage/listpage'
    })
  },
  //城市选择
  xuanzhe: function (f) {
    // console.log(f.city);
    this.setData({
      xianshi: "bolck",
      body_cen: "none"
    })
  },
  admissions: function(){
    console.log("阻止点击");
  },
  //下拉
  onPullDownRefresh: function () {
    console.log("下拉")
    var that = this;
    that.setData({
      next_page: 1, //当前页
      shuju:[],
      xianshi: "none", //bolck,none --页面显示--城市获取-or-首页
      body_cen: "bolck",
    })
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1500);
    wx.clearStorageSync('user_obj');
    that.jieko();
    that.jieko_pick();
    var Base = require('../../utils/base.js');
    user_info = Base.is_user_obj('');
    //调用数据
    var hetTime = setInterval(function () {
      // console.log(wx.getStorageSync('user_obj'));
      if (wx.getStorageSync('user_obj') != '') {
        console.log(wx.getStorageSync('user_obj'));
        user_info = wx.getStorageSync('user_obj');
        setTimeout(function () {
          // console.log("888");
          that.jieko_inf();
        }, 200);
        clearInterval(hetTime);
      }
    }, 100);
  },
  //定位选择
  dinwei: function (r) {
    console.log(r);
    // var din = r.currentTarget.dataset.idx;
    var xzk = r.currentTarget.dataset.text;

    // console.log(din);
    this.setData({
      xianshi: "none",
      body_cen: "bolck",
      currentTab: -1,
      city: xzk
    })
    var citys = this.data.city;
    app.globalData.citys = citys;//城市获取
    this.jieko();

  },
//定位刷新
  huoqu:function(){
    wx.showToast({
      title: '刷新中...',
      icon: 'loading',
      duration: 1000
    });
    this.nijiexi();
  },
  //查询跳转
  register: function () {
    wx.navigateTo({
      url: '../register/register'
    })
  },
  //入驻跳转
  admission: function () {
    wx.navigateTo({
      url: '../admission/admission'
    })
  },
  //重新授权接口--地址获取失败时--调该接口重新授权
  shoquang: function(){
    wx.openSetting({
      success: (res) => {
        /*
         * res.authSetting = {
         *   "scope.userInfo": true,
         *   "scope.userLocation": true
         * }
         */
      }
    })
  },
  //逆解析地址-调用百度接口-获取当前手机定位城市
  nijiexi: function(){
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: 'DXkIQNEvkGNVXYbOIUAmURkuHz2AL4Du'
    });

    //请求百度地图api并返回模糊位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res);
        that.setData({
          latitude: res.latitude,//经度
          longitude: res.longitude//纬度
        })
        BMap.regeocoding({
          location: that.data.latitude + ',' + that.data.longitude,
          success: function (res) {
            console.log(res);
            var cityls = res.originalData.result.addressComponent.city; //当前定位城市        
            var formatted_address = res.originalData.result.formatted_address;//当前地址
            if (cityls==undefined){
              cityls="惠州";
            }
            that.setData({
              dinwei_city: cityls,
              city: cityls
            })
            app.globalData.citys = cityls;//设置全局变量(app已经定义 var app=getApp())
            //调用数据
            that.jieko();
          },
          fail: function () {
            wx.showToast({
              title: '请检查位置服务是否开启',
            })
          },
        });
      },
      fail: function (res) {
        console.log('地址获取失败');
        console.log(res)
        wx.showModal({
          title: '地址获取失败',
          content: '选择默认城市：惠州，点击取消从新授权地址位置服务！',
          success: function (res) {
            that.setData({
              dinwei_city: '惠州',
              cityls: '惠州',
              city: '惠州'
            })
            app.globalData.citys = '惠州';//设置全局变量
            if (res.confirm) {
              console.log('用户点击确定')
              setTimeout(function () {
                that.jieko();
              }, 500);
            } else if (res.cancel) {
              console.log('从新授权');
              that.shoquang();
            }
          }
        })
      }
    })
  },

  //搜索跳转
  sosuo: function () {
    wx.navigateTo({
      url: '../chaxun/chaxun'
    })
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
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    
    
  },

  //分享接口
  // onShareAppMessage: function () {
  //   // 用户点击右上角分享
  //   return {
  //     title: '鑫创业有限公司', // 分享标题
  //     desc: '鑫创业房产有限公司', // 分享描述
  //     path: '/pages/index/index' // 分享路径
  //   }
  // },

  //选择城市
  searchStart: function (e) {
    var showLetter = e.currentTarget.dataset.letter;
    var pageY = e.touches[0].pageY;
    this.setScrollTop(this, showLetter);
    this.nowLetter(pageY, this);
    this.setData({
      showLetter: showLetter,
      startPageY: pageY,
      isShowLetter: true,
    })
  },
  searchMove: function (e) {
    var pageY = e.touches[0].pageY;
    var startPageY = this.data.startPageY;
    var tHeight = this.data.tHeight;
    var bHeight = this.data.bHeight;
    var showLetter = 0;
    console.log(pageY);
    if (startPageY - pageY > 0) { //向上移动
      if (pageY < tHeight) {
        // showLetter=this.mateLetter(pageY,this);
        this.nowLetter(pageY, this);
      }
    } else {//向下移动
      if (pageY > bHeight) {
        // showLetter=this.mateLetter(pageY,this);
        this.nowLetter(pageY, this);
      }
    }
  },
  searchEnd: function (e) {
    // console.log(e);
    // var showLetter=e.currentTarget.dataset.letter;
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)

  },
  //当前滚轴位置
  nowLetter: function (pageY, that) {
    //当前选中的信息
    var letterData = this.data.searchLetter;
    var bHeight = 0;
    var tHeight = 0;
    var showLetter = "";
    for (var i = 0; i < letterData.length; i++) {
      if (letterData[i].tHeight <= pageY && pageY <= letterData[i].bHeight) {
        bHeight = letterData[i].bHeight;
        tHeight = letterData[i].tHeight;
        showLetter = letterData[i].name;
        break;
      }
    }

    this.setScrollTop(that, showLetter);

    that.setData({
      bHeight: bHeight,
      tHeight: tHeight,
      showLetter: showLetter,
      startPageY: pageY
    })
  },
  bindScroll: function (e) {
    console.log(e.detail)
  },
  setScrollTop: function (that, showLetter) {
    var scrollTop = 0;
    var cityList = that.data.cityList;
    var cityCount = 0;
    var initialCount = 0;
    for (var i = 0; i < cityList.length; i++) {
      if (showLetter == cityList[i].initial) {
        scrollTop = initialCount * 30 + cityCount * 41;
        break;
      } else {
        initialCount++;
        cityCount += cityList[i].cityInfo.length;
      }
    }

    that.setData({
      scrollTop: scrollTop
    })
  },
  //城市获取
  bindCity: function (e) {
    var city = e.currentTarget.dataset.city;

    this.setData({
      city: city,
      xianshi: "none",
      currentTab: -1,
      body_cen: "bolck"
    })
    var citys = this.data.city;
    app.globalData.citys = citys;//设置全局变量(app已经定义 var app=getApp())
    this.jieko();
  }
})