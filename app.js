//app.js

App({
  globalData: {
    userInfo: null,
    openid: '',
    is_have_pid: 0, //初始化等级值
    is_have_empty: '', //昵称
    is_have_code: 0, //父级code
    session_key: '',
    // 公共url  域名
    on_url: 'https://www.wh2013.net', 
    
  },
 
  onLaunch: function (open) {
    // console.log(open);
    //测试
    var that = this;
    //公共调取用户信息
    // console.log(wx.getStorageSync('is_have_code'));
    //父级code缓存
    // var is_have_code=wx.getStorageSync('is_have_code');
    
    //普通进入
    // if (is_have_code == ''){
      // wx.setStorageSync('is_have_code', '');
      // that.getOpenId();
      // that.getUserInfo();
      // that.openidt();
      // console.log("没有上级code");
    // }else{
      //分享进入
      
        // that.getOpenId();
        // that.getUserInfo();
        // console.log("有上级code");
      
    // }

    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  //获取openid
  getOpenId: function (cb) {
    var that = this;
    if (that.globalData.openid) {
      typeof cb == "function" && cb(that.globalData.openid)
    } else {
      wx.login({
        success: function (res) {
          // console.log(res.code);//(1)如果登录成功打印code值
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://www.wh2013.net/xcy/home/column/openid',
              data: {
                code: res.code   //将code值传入php中
                // is_have_pid: that.globalData.is_have_pid
              },
              success: function (result) {
                // console.log(result);//传入成功code值返回过来
                var res = result.data.data
                that.globalData.openid = res.openid
                that.globalData.session_key = res.session_key
                // console.log(that.globalData.openid)
                typeof cb == "function" && cb(that.globalData.openid);
                typeof cb == "function" && cb(that.globalData.session_key);
              }
            })
          } else {
            conso1e.log('获取用户登录态失败!' + res.errM3g)
          }
        }
      });
    }
  },
  //插入openid
  openidt: function () {
    var that = this;
    var openid = that.globalData.openid;
    if (openid != '') {
      setTimeout(function () {
        openid = that.globalData.openid;
        // console.log(55);
        wx.request({
          url: that.globalData.on_url + '/xcy/home/Column/user',
          data: {
            openid: openid,
            area: that.globalData.citys,
            pcode: wx.getStorageSync('is_have_code')
          },
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res)
            var sharing = res.data.data.code;
            that.globalData.sharing = sharing;//设置全局变量(app已经定义 var app=getApp())

          },
          fail: function () {
            console.log('error1')
          }
        })
      }, 1000)
    } else {
      setTimeout(function () {
        that.openidt();
        // console.log(666);
      }, 1000)
    }

  },
  getUserInfo:function(cb){
    var that = this;
    console.log(cb);
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.globalData.is_have_empty = res.userInfo.nickName;
              typeof cb == "function" && cb(that.globalData.is_have_empty);
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo);
              // console.log(that.globalData.is_have_empty);
            }
          })
        }
      })
    }
  }

  

})


