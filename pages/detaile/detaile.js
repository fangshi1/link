// 用户信息 
var user_info;
/* 详情页面 */
var app = getApp();
var on_url = app.globalData.on_url; //域名
// var detaile_title='';
Page({
  data: {
    huxing:'', //户型
    direction: '', //朝向
    // ----------------用户授权
    mou_box: 'none', //模态框显示情况
    body_height: '100vh',
    // ----------------用户授权
    user_info: [],
    sharing: '',
    descr:'', //周边配套
    phoneNumber: '10086',
    return_: "none",
    shocha: 1,
    vr_360: 'none',
    shotext: "收藏",
    shuchang: '', //判断收藏
    titles: '',//标题
    loat: [],//接口数据
    // detaile_title: detaile_title,
    latitude: 23.08383,
    longitude: 114.38273,
    vr_img:'',
    longname: '', //地址名称
    collection: "shop_no",
    t_length: 3,
    options_id: '', //数据id
    autoplay: false,//是否自动切换 
    currentTab: 0,
    slider: [], //轮播图数据
    swiperCurrent: 0,
    is_pid:'' ,//父级code
    is_if:0

  },//页面数据
  // onShow: function(){
      
  // },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数  
    console.log(options);
    var that = this;
    //分享模式，真实数据
    var is_pid = options.is_pid || 0; //父级code
    var options_ids = options.id; //详情id
    //分享模式，真实数据

    // 分享模式，模拟数据
    // var options_ids = 159;
    // var is_pid=1005;
    // 分享模式，模拟数据

    var gid = app.globalData.gid; //循环跳时的详情id
    // var is_if = options.is_if || 0;
      // console.log("..................." + is_pid);
      //判断用户进入方式--0则普通模式--否则为分享模式
      if (is_pid != 0) {
        that.setData({
          return_: "bolck",
          options_id: options_ids
        });
        app.globalData.pcode_id = is_pid;
        //调取用户信息判断----分享模式
        that.user_off();
        console.log("分享模式");


      } else {
        //调取用户信息判断----普通模式
        app.globalData.pcode_id = '';
        console.log("普通模式");
        that.user_off();
        that.setData({
          return_: "none"
        });
      }

    //判断进入方式--当gid不存在时，由外部进入--否则内部进入。
    if (gid == undefined){
      that.setData({
        options_id: options_ids
      });
    }else{
      that.setData({
        options_id: gid
      });
    }
    
    //调用数据
    var hetTime = setInterval(function () {
      if (wx.getStorageSync('user_obj') != '') {
        console.log(wx.getStorageSync('user_obj'));
        user_info = wx.getStorageSync('user_obj');

        setTimeout(function () {
          that.jieko();
        }, 200)
        clearInterval(hetTime);
        // console.log("666...", user_info);
      }
    }, 100);

    //加载中
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 1000
    });

  },
  //返回首页
  return_: function(){
    wx.switchTab({
      url: '../index/index'
    })
  },
  // -------------------------------------------------用户授权-----------------------------
  //判断用户是否授权
  user_off: function () {
    var that = this;
    // 查看是否授权
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          body_height: 'auto',
          mou_box: 'none'
        });
        
        console.log(app.globalData.pcode_id);
        var Base = require('../../utils/base.js');
        user_info = Base.is_user_obj(app.globalData.pcode_id);

      }, fail: function (res) {
        console.log(res);
        that.setData({
          body_height: '100vh',
          mou_box: 'bolck'
        });
      }
    });

  },
  //监听用户是否允许授权
  onGotUserInfo: function (e) {
    var that = this;
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      console.log("用户按了允许授权按钮");
      console.log(app.globalData.gid);
      var Base = require('../../utils/base.js');
      user_info = Base.is_user_obj(app.globalData.pcode_id);
      
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
// -------------------------------------------------/用户授权-----------------------------

  //数据接口
  jieko: function () {
    var that = this;
    console.log(that.user_info);
    wx.request({
      url: on_url+ '/xcy/home/Goods/detail',
      data: {
        "openid": user_info.openid,
        "id": that.data.options_id
        // that.data.options_id  //数据id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log("进入");
        var leis = res.data.data.detail || 0;
        for (var j = 0; j < res.data.data.detail.tags.length;j++){
          if (res.data.data.detail.tags[j].key =="户型"){
            that.setData({
              huxing: res.data.data.detail.tags[j].val
            })
          } 
          if (res.data.data.detail.tags[j].key == "朝向") {
            that.setData({
              direction: res.data.data.detail.tags[j].val
            })
          }
        }
        
        that.setData({
          descr: res.data.data.detail.descr,
          // shuchang: res.data.data.collect,
          titles: res.data.data.detail.name,
          loat: res.data.data, //全部数据
          t_length: res.data.data.detail.pic.length, //轮播图长度
          latitude: res.data.data.detail.is_index.is_index_y, //经度
          longitude: res.data.data.detail.is_index.is_index_x, //纬度
          longname: res.data.data.detail.is_index.hdaddrr,
          phoneNumber: res.data.data.detail.attr.attr_p,
          slider: res.data.data.detail.pic //轮播图地址
        })
        //vr判断
        var vrimg = res.data.data.detail.vr_pic;
        if (vrimg == null){
          // console.log("空");
          that.setData({
            vr_360: 'none'
          })
        }else{
          console.log("vr");
          that.setData({
            vr_img: res.data.data.detail.vr_pic,
            vr_360: 'bolck'
          })
        }
        //标题
        wx.setNavigationBarTitle({
          "title": res.data.data.detail.name
        });
        // console.log(res.data.data.collect);
        var shuchang = res.data.data.collect;
        if (shuchang == true) {
          // console.log(1111111111111111)
          that.setData({
            shuchang: true,
            shotext: "已收藏",
            collection: "shop_yes"
          })
        } else {
          that.setData({
            shuchang: false,
            shotext: "收藏",
            collection: "shop_no"
          })
        }
      },
      fail: function () {
        console.log('error')
      }
    })
  },
  // vr360全景
  vr360: function(){
    var that=this;
    var vr_img = that.data.vr_img;
    wx.navigateTo({
      url: '../vr360/vr360?vr_img=' + vr_img
    })
  },

  //图片点击事件
   imgYu:function(event) {
     console.log(event)
        var src = event.currentTarget.dataset.src;//获取data-src
         var imgList = event.currentTarget.dataset.list;//获取data-list
         //图片预览
         wx.previewImage({
           current: imgList, // 当前显示图片的http链接
           urls: src // 需要预览的图片http链接列表
      })
    
  },



  //拨打电话
  calling: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.phoneNumber,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  //收藏-接口
  shochang: function (e) {
    var that = this;
    console.log(e);
    var shocha = that.data.shocha;
    var shuchang = that.data.shuchang;
    console.log(shuchang);
    if (shocha==1){
      if (shuchang == false) {

        this.setData({
          shuchang: false,
          shotext: "已收藏",
          shocha:2,
          collection: "shop_yes"
        })
        that.shochangjieko();

      } else {

        this.setData({
          shuchang: true,
          shotext: "收藏",
          shocha: 2,
          collection: "shop_no"
        })
        that.clertjieko();
        
      }

    }else{
      if (shuchang == true) {

        this.setData({
          shuchang: false,
          shotext: "已收藏",
          collection: "shop_yes"
        })

        that.shochangjieko();

      } else {

        this.setData({
          shuchang: true,
          shotext: "收藏",
          collection: "shop_no"
        })

        that.clertjieko();
      }    
    }


    

  },
  //取消收藏接口
  clertjieko: function () {
    var that = this;
    wx.request({
      url: on_url+'/xcy/home/goods/delCollect',
      data: {
        "openid": user_info.openid,
        "collect": that.data.options_id  //数据id
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },

      success: function (res) {

        
        console.log(res.data.data);
      },
      fail: function () {
        console.log('error')
      }
    })
  },



  //收藏接口
  shochangjieko: function () {
    var that = this;
    wx.request({
      url: on_url+'/xcy/home/column/adduser',
      data: {
        "openid": user_info.openid,
        "collect": that.data.options_id  //数据id
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },

      success: function (res) {

        console.log(res.data.data);
      },
      fail: function () {
        console.log('error')
      }
    })
  },
  onShareAppMessage: function (e) {
    var that = this;
    // 用户点击右上角分享
    console.log(e);
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
    return {
      title: that.data.titles + "  分享码：" + user_info.code, // 分享标题
      desc: user_info.code, // 分享描述
      path: 'pages/detaile/detaile?id=' + that.data.options_id + "&is_pid=" + user_info.code, // 分享路径
      success: function (res) {
        // 转发成功之后的回调
          console.log("分享成功")
          that.fengxiang();
      },
      
    }

  },
  //商品跳详情事件
  shop_dian: function (t) {
    console.log(t);
    var gid = t.currentTarget.id;//商品id
    app.globalData.gid = gid;//设置全局变量(app已经定义 var app=getApp())
    wx.redirectTo({
      url: '../detaile/detaile'
    })
  },
  //分享记录
  fengxiang: function(){
    console.log("记录成功")
    var that = this;
    wx.request({
      url: on_url+'/xcy/home/column/adduser',
      data: {
        "openid": user_info.openid,
        "share": that.data.options_id  //数据id
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },

      success: function (res) {
        console.log(res.data.data);
      },
      fail: function () {
        console.log('error')
      }
    })

  },
  //轮播图
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  map_call: function () {
    var that = this;
    type: 'gcj02'; //返回可以用于wx.openLocation的经纬度 
    var latitude = this.data.latitude;
    latitude = Number(latitude);
    var longitude = this.data.longitude;
    longitude = Number(longitude);
    var longname = this.data.longname;
    console.log(latitude + "..." + longitude);
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: longname, //地址名称
      scale: 28
    })


    /**  
    * 使用微信内置地图查看位置  
    * 1、latitude：     纬度，范围为-90~90，负数表示南纬 必填  
    * 2、longitude：    经度，范围为-180~180，负数表示西经 必填  
    * 3、scale：        缩放比例，范围1~28，默认为28 选填  
    * 4、name：         位置名 选填  
    * 5、address：      地址的详细说明 选填  
    * 6、cbSuccessFun： 接口调用成功的回调函数 选填  
    * 7、cbFailFun：    接口调用失败的回调函数 选填  
    * 8、cbCompleteFun：接口调用结束的回调函数（调用成功、失败都会执行） 选填  
    */
    //latitude: 23.08383longitude: 114.38273

    // wx.getLocation({ //调用手机当前位置
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度  
    //   success: function (res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     console.log("latitude:" + latitude + "longitude:" + longitude);
    //     wx.openLocation({
    //       latitude: latitude,
    //       longitude: longitude,
    //       name: "花园桥肯德基",
    //       scale: 28
    //     })
    //   }
    // })  


  }




})


