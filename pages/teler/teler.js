// pages/teler/teler.js
var code = '';
var openid = '';
var personInfo = '';
var shuju=[];
var app = getApp();
var on_url = app.globalData.on_url; //域名
var user_info;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // ----------------用户授权
    mou_box: 'none', //模态框显示情况
    body_height: '100vh', //禁止下滑
    // ----------------用户授权
    user_name: '--', //用户姓名
    user_phone: '--',//用户电话
    user_enter: '未入驻', //用户入驻情况
    about_shop1: 'block',
    about_shop2: 'none',
    user_disp: 'none',
    about: 0,
    pages: 1,//当前页--分享
    total: 3, //总页--分享
    pages_about: 1,//当前页--入驻
    total_about: 3, //总页--入驻
    shujuyuan: 'none',
    shujuyuan_about: 'none',
    dianjiyichan: "bolck", //点击隐藏
    dianjiyichan_about: "bolck", //点击隐藏
    jiazaigenduo: "点击加载更多",
    jiazaigenduo_about: "点击加载更多", //分享加载
    code: '',
    sharing: "--",
    lister:[
      { "name": "我的分享"},
      { "name": "交易记录" },
    ],
    shuju:[],
    shuju_about:[],//分享记录数据
    userinfo: [],
    personInfo:[],
    personInfoname: '刷新'
  },

  /**
   * 生命周期函数--监听页面显示
   */

  onLoad: function () {
    var that = this;
    that.user_off();

    that.setData({
      pages: 1, //当前页
      jiazaigenduo: "点击加载更多",
      shuju: []
    })
    //调用数据
    var hetTime = setInterval(function () {
      if (wx.getStorageSync('user_obj') != '') {
        console.log(wx.getStorageSync('user_obj'));
        user_info = wx.getStorageSync('user_obj');
        if (user_info.is_enter==0) {
          that.setData({
            sharing: user_info.code,
            user_name: "--", //用户姓名
            user_phone: "--",//用户电话
            user_enter: '未入驻', //用户入驻情况
            user_disp: 'none'
          });
        } else {
          that.setData({
            sharing: user_info.code,
            user_name: user_info.user, //用户姓名
            user_phone: user_info.phone,//用户电话
            user_enter: '已入驻', //用户入驻情况
            user_disp: 'bolck'
          });
        }
        setTimeout(function () {
          that.jieko();
          that.jieko_about();
        }, 200)
        clearInterval(hetTime);
      }
    }, 100);

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
  //使用指南
  destnow: function () {
    wx.navigateTo({
      url: '../dester/dester'
    })
  },
  collection: function () {
    wx.navigateTo({
      url: '../collection/collection'
    })
  },
  //下部分享--点击
  about_list: function(e){
    console.log(e);
    var that=this;
    if (e.currentTarget.id==0){
      that.setData({
        about_shop1: 'block',
        about_shop2: 'none',
        about: e.currentTarget.id
      });
      that.jieko();
      
    }else{
      that.setData({
        about_shop1: 'none',
        about_shop2: 'block',
        about: e.currentTarget.id
      });
      that.jieko_about();
    }
    
  },
  //跳分享详细信息
  detailed_xianxia: function (e) {
    console.log(e);
    var ids = e.currentTarget.id;
    var codes = e.currentTarget.dataset.id;
    var that = this;
    wx.navigateTo({
      url: '../detailed_xianxia/detailed_xianxia?id=' + ids + '&codes=' + codes
    })
  },
  //跳下线详情判断
  level_my: function (e) {
    wx.navigateTo({
      url: '../level_my/level_my'
    })
  },
  //跳下线详情判断
  level_xianxia: function (e) {
    wx.navigateTo({
      url: '../level_xianxia/level_xianxia'
    })
  },
  // -------------------------------------------------用户授权-----------------------------
  //判断用户是否授权
  user_off: function () {
    var that = this;
    // 查看是否授权
    wx.getUserInfo({
      success: function (res) {
        // console.log(res);
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
  onGotUserInfo: function (e) {
    var that = this;
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      console.log("用户按了允许授权按钮");
      var Base = require('../../utils/base.js');
      user_info = Base.is_user_obj('');
      // setTimeout(function () {
      //   console.log(wx.getStorageSync('user_obj'));
      // }, 5000)
      
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



  //判断session_key未过期
  // sessiokk: function(){
  //   wx.checkSession({
  //     success: function () {
  //       // console.log("session_key未过期");
  //       //session_key 未过期，并且在本生命周期一直有效
  //     },
  //     fail: function () {
  //       // session_key 已经失效，需要重新执行登录流程
  //       app.getOpenId();
  //     }
  //   })
  // },



  //清理缓存
  syncs: function(){
    // console.log(wx.getStorageSync('user_obj'));
    // var ruzhu = wx.getStorageSync('ruzhu');
    wx.clearStorageSync('user_obj');
    // wx.setStorageSync('ruzhu', ruzhu);
    // console.log(wx.getStorageSync('user_obj'));
    //提示框
      wx.showToast({
        title: '清理中...',
        icon: 'loading',
        duration: 1000
      });

  },

  //分享---数据接口
  jieko: function () {
    var that = this;
    wx.request({
      url: on_url +'/xcy/home/Goods/getshare',
      data: {
        "p": that.data.pages,
        "openid": user_info.openid
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var codes = res.data.code;
        var loat = res.data.data;
        console.log(codes)
        if (codes == "200") {
          var total = res.data.data.page.total;
          var pages = that.data.pages;
          console.log(total)
          if (total == 1) {
            that.setData({
              shujuyuan: 'none',
              jiazaigenduo: "已加载全部",
              dianjiyichan: "bolck"
            })
          } else {
            that.setData({
              shujuyuan: 'none',
              jiazaigenduo: "点击加载更多",
              dianjiyichan: "bolck"
            })
          }

          that.setData({
            total: total,
            shuju: res.data.data.list,
            sharing: user_info.code,
            loat: loat
          })
        } else {
          var total = 1;
          that.setData({
            total: total,
            shuju: [],
            sharing: user_info.code,
            loat: [],
            shujuyuan: 'bolck',
            jiazaigenduo: "已加载全部",
            dianjiyichan: "none"
          })
        }
       
        console.log(that.data.loat);
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
      url: on_url + '/xcy/home/Goods/getshare',
      data: {
        "p": that.data.pages,
        "openid": user_info.openid
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var codes = res.data.code;
        var loat = res.data.data;
        var shuju = that.data.shuju;
        console.log(codes);
        if (codes == "200") {
          var total = res.data.data.page.total;
          if (total == 1) {
            that.setData({
              shujuyuan: 'none',
              jiazaigenduo: "已加载全部",
              dianjiyichan: "bolck",
            })
          } else {
            that.setData({
              shujuyuan: 'none',
              jiazaigenduo: "点击加载更多",
              dianjiyichan: "bolck"
            })
          }
          for (var i = 0; i < res.data.data.list.length; i++) {
            shuju.push(res.data.data.list[i])

          }
          console.log(shuju);
        } else {
          var total = 1;
          that.setData({
            shujuyuan: 'bolck',
            jiazaigenduo: "已加载全部",
            dianjiyichan: "none"
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
  //点击加载更多
  dianjijiazai: function (e) {
    var that = this;
    var pages = that.data.pages;
    var total = that.data.total;

    if (pages < total) {
      pages++;
      this.setData({
        pages: pages
      })
      that.jiekoss();
      if (pages == total) {
        setTimeout(function(){
          that.setData({
            jiazaigenduo: "已加载全部"
          })
        },500)
        
      }

    } else {
      that.setData({
        jiazaigenduo: "已加载全部"
      })

    }

  },

  //入驻---数据接口
  jieko_about: function () {
    var that = this;
    wx.request({
      url: on_url + '/xcy/index.php//home/Column/get_lin',
      data: { //get_lin,self_order
        "code": user_info.code
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        if(res.data.code==200){
          that.setData({
            shujuyuan_about: 'none',
            shuju_about:res.data.data,
            jiazaigenduo_about: "已加载全部",
            dianjiyichan_about: "bolck",
          })
        }else{
          that.setData({
            shujuyuan_about: 'block',
            shuju_about: [],
            jiazaigenduo_about: "已加载全部",
            dianjiyichan_about: "none",
          })
        }

      },
      fail: function () {
        console.log('error1')
      }
    })
  },
  //数据接口-加载
  // jiekoss_about: function () {
  //   var that = this;
  //   wx.request({
  //     url: on_url + '/xcy/home/Goods/getshare',
  //     data: {
  //       "p": that.data.pages,
  //       "openid": user_info.openid
  //     },
  //     method: "POST",
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     },
  //     success: function (res) {
  //       var codes = res.data.code;
  //       var loat = res.data.data;
  //       var shuju = that.data.shuju;
  //       console.log(codes);
  //       if (codes == "200") {
  //         var total = res.data.data.page.total;
  //         if (total == 1) {
  //           that.setData({
  //             shujuyuan_about: 'none',
  //             jiazaigenduo_about: "已加载全部",
  //             dianjiyichan_about: "bolck",
  //           })
  //         } else {
  //           that.setData({
  //             shujuyuan_about: 'none',
  //             jiazaigenduo_about: "点击加载更多",
  //             dianjiyichan_about: "bolck"
  //           })
  //         }
  //         for (var i = 0; i < res.data.data.list.length; i++) {
  //           shuju.push(res.data.data.list[i])
  //         }
  //         console.log(shuju);
  //       } else {
  //         var total_about = 1;
  //         that.setData({
  //           shujuyuan: 'bolck',
  //           jiazaigenduo_about: "已加载全部",
  //           dianjiyichan_about: "none"
  //         })
  //       }

  //       that.setData({
  //         total_about: total_about,
  //         shuju_about: shuju_about
  //       })
  //       console.log(that.data.loat);
  //     },
  //     fail: function () {
  //       console.log('error1')
  //     }
  //   })
  // },
  //点击加载更多
  // dianjijiazai_about: function (e) {
  //   var that = this;
  //   var pages_about = that.data.pages;
  //   var total_about = that.data.total;

  //   if (pages < total) {
  //     pages++;
  //     this.setData({
  //       pages_about: pages_about
  //     })
  //     that.jiekoss();
  //     if (pages_about == total_about) {
  //       setTimeout(function () {
  //         that.setData({
  //           jiazaigenduo_about: "已加载全部"
  //         })
  //       }, 500)

  //     }

  //   } else {
  //     that.setData({
  //       jiazaigenduo_about: "已加载全部"
  //     })

  //   }

  // },
  bindGetUserInfo: function (e) {
    console.log(e)
  },
  // 
  
  submission: function (f) {
    console.log(f);
    var tt = f.currentTarget.dataset.text;
    var k_id = f.currentTarget.id;
    wx.navigateTo({
      url: '../submission/submission?will=' + tt + '&id=' + k_id
    })
  },
//刷新
  suanxin: function(){
    //更新数据
    var that=this;
    that.setData({
      code: '',
      userinfo: [],
      personInfo: '刷新'
    })
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 1000
    });
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉")
    var that = this;
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000);
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 1500
    });
    that.setData({
      pages: 1, //当前页
      jiazaigenduo: "点击加载更多",
      shuju_about: [],
      shuju: []
    })
    wx.clearStorageSync('user_obj');
    var Base = require('../../utils/base.js');
    user_info = Base.is_user_obj('');
    //调用数据
    var hetTime = setInterval(function () {
      if (wx.getStorageSync('user_obj') != '') {
        console.log(wx.getStorageSync('user_obj'));
        user_info = wx.getStorageSync('user_obj');
        if (user_info.is_enter == 0) {
          that.setData({
            sharing: user_info.code,
            user_name: "--", //用户姓名
            about: 0,
            about_shop1: 'block',
            about_shop2: 'none',
            user_phone: "--",//用户电话
            user_enter: '未入驻', //用户入驻情况
            user_disp: 'none'
          });
        } else {
          that.setData({
            sharing: user_info.code,
            user_name: user_info.user, //用户姓名
            about: 0,
            about_shop1: 'block',
            about_shop2: 'none',
            user_phone: user_info.phone,//用户电话
            user_enter: '已入驻', //用户入驻情况
            user_disp: 'bolck'
          });
        }
        setTimeout(function () {
          that.jieko();
          // that.jieko_about();
        }, 200)
        clearInterval(hetTime);
      }
    }, 100);

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