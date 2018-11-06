// 判断 用户对象 是否存在 
// 如果存在  返回 true  程序往下走
// 如果不存在  通过 新的方法 获取 用信息  并存入 本地缓存 locatstrage
//参数： u:域名 i: 自己的openid, c: 当前的城市, o: 父级的code
var user_info_off = 0; //开关
var userInfo =''; //全局定义用户信息变量
function is_user_obj(p){
    var user_obj = '';
    user_obj = wx.getStorageSync('user_obj');
    user_obj = user_obj ? user_obj : false;
    // console.log(user_obj);
    if (user_obj) {
      console.log('用户对象存在');
      console.log(user_obj);
      console.log(p);
      return user_obj;
    } else {
      user_inif();
      console.log("用户对象不存在");
      console.log(userInfo.avatarUrl);
      
        var timest=setInterval(function () {
          if (userInfo == '' || userInfo == undefined) {
              user_inif();
            } else {
            get_user_info(p);
            clearInterval(timest);
          }
        }, 500);
      
      // 获取用户信息 
      return user_obj;
    }
}

// 获取每个页面的URL 参数
// console.log('bbb');
//封装的函数
//插入openid
// var openid=0; //自己的openid
// kount(); //获取openid


//新增用户 
// i 微信 openid  
// o 用户父级 ID
// wx_user_info 用户微信所有信息
function openidt(i, o, wx_user_info){
  console.log('我是加载后的', userInfo)
  console.log(wx_user_info)
  var openid = i;
  if (openid != '') {
    setTimeout(function () {
      // console.log(5555);
      console.log(userInfo.avatarUrl);
      wx.request({
        url: 'https://www.wh2013.net/xcy/home/Column/user',
        data: {
          openid: openid,
          city: '惠州',
          nickName: userInfo.nickName, //昵称
          gender: userInfo.gender, //性别
          avatarUrl: userInfo.avatarUrl,// 头像 
          pcode: o
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res);
          wx.setStorageSync('user_obj', res.data.data);
          console.log(wx.getStorageSync('user_obj'));
        },
        fail: function () {
          console.log('error1')
        }
      })
    }, 1000)
  } else {
    setTimeout(function () {
      console.log(666);
    }, 1000)
  }
}
//获取用户信息接口
function user_inif(){
      //调用登录接口
  console.log("进入");
  wx.getUserInfo({
    success: function (res) {
      console.log(res);
      userInfo = res.userInfo;
      user_info_off = 1;
      console.log(userInfo);
    },
    fail:function(data){
      console.log(data);
    }
    
  })

  
}
//获取用户信息接口
function get_user_info(pid) {
  console.log(pid);

  wx.login({
    success: function (res) {
      console.log(res.code);//(1)如果登录成功打印code值
      if (res.code) {
        //发起网络请求 获取OPENID   
        // 通过 code 获取 用户信息  如果没有用户 则返回 openid  再通过  openid  和 本地的 其他用户信息 生成新的用户 并插入用户表
        wx.request({
          url: 'https://www.wh2013.net/xcy/home/column/openid',
          data: {
            code: res.code, //将code值传入php中
            avatarUrl: userInfo.avatarUrl // 头像 
          },
          success: function (result) {
            console.log(result);
            // onoff = true;
            // console.log(result.data.code);
             
            if(result.data.code == 200){
              // console.log(pid);
              // var wx_user_info = user_inif(); // 用户微信的所有信息 
              // openidt(result.data.data.openid, pid, wx_user_info); //插入新用户
              // 直接把用户信息存入 本地缓存

              wx.setStorageSync('user_obj', result.data.data);
            } else if (result.data.code == 100){
              // 通过下一个接口 生成新的用户
              console.log(user_info_off);

              user_inif(); // 用户微信的所有信息 

             //获取用户信息为异步请求，获取用户信息有延迟。
             //延时判断user_info_off是否为0，0：没有获取到userInfo，1:获取到userInfo
             //当user_info_off=0，循环每100毫秒判断一次，直至获取到userInfo，获取到userInfo后改user_info_off=1.
             //当user_info_off=1，继续执行插入新用户操作
              var Time = setInterval(function(){
                if (user_info_off == 0){
                  console.log('定');
                  // return false;
                }else{
                  console.log('定时器');
                  console.log(userInfo);
                  openidt(result.data.data.openid, pid, userInfo); //插入新用户
                  clearInterval(Time);
                }
              },100)
             
            }else{
              console.log('网络出错，请联系管理员')
            }
          }
        })
      } else {
        conso1e.log('获取用户登录态失败!' + res.errM3g)
      }
    }
  })
  // console.log(openid);
}


//转化成小程序模板语言 这一步非常重要 不然无法正确调用
module.exports = {
  // 获取用户信息
  get_user_info:get_user_info,
  user_inif: user_inif,
  openidt:openidt,
  is_user_obj: is_user_obj
}


