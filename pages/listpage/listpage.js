var app = getApp();
var on_url = app.globalData.on_url; //域名
var user_info;

var i = 0;
var shuju=[];
Page({
  data: {
    pages:1,//当前页
    total:1, //总页
    loat:[],//接口数据
    shuju:[],//查询数据
    shujuyuan: 'none',
    floor_price:'', //最低价格
    ceiling_price: '', //最高价格
    specifications:'',//规格
    region:'', //区域
    diqu2:'',
    floor_price: '',
    tabTxtas_qu:'', //区
    ceiling_price: '',
    diqu:'', //区点
    pullUpLoad: "pullUpLoad",
    jiazai: "加载中...",
    jiazaigenduo: "点击加载更多",
    dianjiyichan: "bolck", //点击隐藏
    scrollTop: 0,
    cate_text: '现房',
    tabtrue: 0,
    fid:0,
    did:0,
    data: [], //数据
    kong: (wx.getSystemInfoSync().windowHeight - 55) + "px",
    kang: "auto",
    id: 0,
    id1: 0,
    id2: 0,
    house_space: 0, //空间
    house_style: 0, //风格
    house_section: 0, //局部
    disabled: false,//加载更多按钮状态
    page: 1,//当前页码
    citys: "惠州市",
    hasMore: false,//加载更多按钮
    tabTxt: ['区域', '价格', '户型'],//tab1文案
    shop_price: [
      { floor: '', ceiling: '', name:'全部'},
      { floor: '0', ceiling: '40', name: '40万以下'}, 
      { floor: '40', ceiling: '60', name: '40-60万'},
      { floor: '60', ceiling: '80', name: '60-80万'}, 
      { floor: '80', ceiling: '100', name: '80-100万'}
      ],
    shop_specifications: [],
    tabTxtas: [],//tab11文案
    tab: [true, true, true],
    moreTxt: '点击加载更多',
    dataNull: false //无结果提示
  },
  onLoad: function (options){
    var cate_text = app.globalData.cate_text; //房类
    var citys = app.globalData.citys; //地区
    var self = this;
    if (citys == undefined || citys==''){
      citys ="惠州市";
    }
    self.setData({
      citys: citys,
      id1: 0,
      id: 0,
      tab: [true, true, true],
      id2: 0,
      scrollTop: 0,
      tabTxtas_qu: '',
      diqu2: citys,
      diqu: citys,
      shuju: [], //数据
      cate_text: cate_text
    })
    self.getFilter();
    self.jiekojia();
    self.huoxin();
    wx.setNavigationBarTitle({
      title: cate_text
    });

  },
  onShow: function (options) {
    //调用公共获取用户信息
    var Base = require('../../utils/base.js');
    user_info = Base.is_user_obj('');
    // 页面初始化 options为页面跳转所带来的参数  
    var cate_text = app.globalData.cate_text; //房类
    var citys = app.globalData.citys; //地区
    var self = this;
    var ka1 = app.globalData.cate_text;
    var ka2 = self.data.cate_text;
    var kb1 = app.globalData.citys;
    var kb2 = self.data.citys;
    self.setData({
      id1: 0,
      id: 0,
      tab: [true, true, true],
      id2: 0,
      scrollTop: 0,
      tabTxtas_qu: '',
      diqu2: citys,
      diqu: citys,
      citys: citys,
      cate_text: cate_text
    })
    
    // console.log(ka1);
    // console.log(ka2);
    // console.log(kb1);
    // console.log(kb2);
    if (ka1 != ka2){
      self.jiekojia();
      self.huoxin();
      self.getFilter();
    }
    if (kb1 != kb2) {
      self.jiekojia();
      self.huoxin();
      self.getFilter();
    }

    wx.setNavigationBarTitle({
      title: self.data.cate_text
    });
  },
  
//价格查询--点击
  shop_price: function(y){
    console.log(y);
    var fan=y.currentTarget.id;
    var floor_price = y.currentTarget.dataset.index; //最低价格
    var ceiling_price = y.currentTarget.dataset.text; //最高价格
    console.log("最低价格:" + floor_price + " 最高价格" + ceiling_price);
    this.setData({
      floor_price:floor_price,
      ceiling_price: ceiling_price,
      tab: [true, true, true],
      pages: 1,//当前页
      scrollTop: 0,
      pullUpLoad: "pullUpLoad",
      shuju: [],//查询数据
      did: fan
    })
    //数据接口
    this.jiekojia();

  },
  // 输入价格查询-确定键
  determine: function () {
    this.setData({
      pages: 1,//当前页
      shuju: [],//查询数据
      scrollTop: 0,
      pullUpLoad: "pullUpLoad",
      tab: [true, true, true]
    })
  //数据接口
    this.jiekojia();

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
      that.jieko();
      if (pages == total) {
        setTimeout(function () {
          that.setData({
            jiazaigenduo: "已加载全部"
          })
        }, 500)

      }

    } else {
      that.setData({
        jiazaigenduo: "已加载全部"
      })

    }

  },
  //规格查询
  shop_specifications: function (y) {
    console.log(y);
    var fan = y.currentTarget.id;
    var specifications = y.currentTarget.dataset.text; //规格
    console.log("规格："+specifications);
    this.setData({
      specifications: specifications,
      tab: [true, true, true],
      shuju: [],//查询数据
      scrollTop: 0,
      pullUpLoad: "pullUpLoad",
      pages: 1,//当前页
      fid: fan
    })
    //数据接口
    this.jiekojia();

  },
//最低价格-输入值
  floor_price: function(e){
    console.log(e);
    var floor_price=e.detail.value;
    this.setData({

      floor_price: floor_price
    })

  },
  //最高价格-输入值
  ceiling_price: function (e) {
    console.log(e);
    var ceiling_price = e.detail.value;
    this.setData({

      ceiling_price: ceiling_price
    })

  },
  //全部地区查询
  quyu: function (y) {
    var region = y.currentTarget.dataset.text;
    var fang = y.currentTarget.dataset.id;
    console.log(region);
    this.setData({
      citys: region,
      tab: [true, true, true],
      pullUpLoad: "pullUpLoad",
      scrollTop: 0,
      pages: 1,//当前页
      tabTxtas_qu:[],
      id: 0,
      id1: 0,
      id2: 0
    })
    this.jiekojia();
  },
  //县地区查询
  quyu1: function (y) {
    var region = y.currentTarget.dataset.text;
    var fang = y.currentTarget.dataset.id;
    console.log(region);
    this.setData({
      citys: region,
      pullUpLoad: "pullUpLoad",
      scrollTop: 0,
      pages: 1,//当前页
      diqu2: region,
      id: 1,
      id2: 0,
      id1: fang
    })
    this.getFilters();
    this.jiekojia();
  },
  //小地区查询
  quyu2: function (y) {
    var region = y.currentTarget.dataset.text;
    var fang = y.currentTarget.dataset.id;
    console.log(region);
    this.setData({
      citys: region,
      tab: [true, true, true],
      pullUpLoad: "pullUpLoad",
      scrollTop: 0,
      pages: 1,//当前页
      shuju:[],
      id: 1,
      id2: fang
    })
    this.jiekojia();
  },

  //数据接口-加载
  jieko: function () {
    var that = this;
    var cate_text = that.data.cate_text;
    if (cate_text=="现房"){
      cate_text='';
    }
    if (cate_text == "租房"){
      cate_text = '租';
    }
    wx.request({
      url: on_url+'/xcy/home/Goods/search',
      data:{
        "p": that.data.pages, //页码
        "area": that.data.citys, //城市
        "click": cate_text, //标签-如二手房
        "price[0]": that.data.floor_price, //最低价格
        "price[1]": that.data.ceiling_price, //最高价格
        "tags": that.data.specifications  //规格
      },
      header: {
        'Content-Type': 'application/json'
      },

      success: function (res) {
        var codes = res.data.code;
        var shuju = that.data.shuju;
        var loat = res.data.data;
        console.log(codes)
        if (codes == "200") {
          var total = res.data.data.page.total;
          if (total == 1) {
            that.setData({
              dianjiyichan: "none",
              shujuyuan: "none",
              jiazaigenduo: "已加载全部"
            })
          } else {
            that.setData({
              dianjiyichan: "bolck",
              shujuyuan: "none",
              jiazaigenduo: "点击加载更多"
            })
          }
          for (var i = 0; i < res.data.data.list.length; i++) {
            shuju.push(res.data.data.list[i])

          }
          
        } else {
          var total = 1;
          that.setData({
            shujuyuan: "bolck"
          })
        }
        that.setData({
          total: total,
          shuju: shuju,
          loat: loat
        })
        console.log(res);
      },
      fail: function () {
        console.log('error1')
      }
    })
  },
  //数据接口
  jiekojia: function () {
    var that = this;
    var cate_text = that.data.cate_text;
    if (cate_text == "现房") {
      cate_text = '';
    }
    if (cate_text == "租房") {
      cate_text = '租';
    }
    wx.request({
      url: on_url+'/xcy/home/Goods/search',
      data: {
        "p": 1, //页码
        "area": that.data.citys, //城市
        "click": cate_text, //标签-如二手房
        "price[0]": that.data.floor_price, //最低价格
        "price[1]": that.data.ceiling_price, //最高价格
        "tags": that.data.specifications  //规格
      },
      header: {
        'Content-Type': 'application/json'
      },

      success: function (res) {
        var codes = res.data.code;
        var loat = res.data.data;
        console.log(codes)
        if (codes == "200") {
          var total = res.data.data.page.total;
          if (total == 1) {
            that.setData({
              dianjiyichan: "bolck",
              shujuyuan: "none",
              jiazaigenduo: "已加载全部"
            })
          } else {
            that.setData({
              dianjiyichan: "bolck",
              shujuyuan: "none",
              jiazaigenduo: "点击加载更多"
            })
          }      
          that.setData({
            total: total,
            shuju: res.data.data.list,
            loat: loat
          })    
        } else {
          console.log(1111);
          var total = 1;
          that.setData({
            total: total,
            shuju: [],
            loat: [],
            shujuyuan: "bolck",
            dianjiyichan: "none"
          })
         
        }
       
        // console.log(res);
        console.log(res.data.data.list);
      },
      fail: function () {
        console.log('error1')
      }
    })
  },
  //户型获取
  huoxin: function(){
    var that = this;
    wx.request({
      url: on_url+'/xcy/home/Column/attr',
      data: {       
      },
      header: {
        'Content-Type': 'application/json'
      },

      success: function (res) {
        that.setData({
          shop_specifications: res.data.data.child
        })
        console.log(res.data.data.child);
      },
      fail: function () {
        console.log('error1')
      }
    })
  },

  /** 
   * 页面上拉触底事件的处理函数 
    */

  // pullUpLoad: function (e) {
  //   console.log(e)
  //   var that=this;
  //   var pages = that.data.pages;
  //   var total = that.data.total;
  //   if (pages < total) {

  //     pages++;
  //     console.log("ii:" + i)
  //     this.setData({
  //       pages: pages,
  //       jiazai: "加载中..."
  //     })
  //     this.jieko();

  //   } else {
  //     this.setData({
  //       jiazai: "已加载全部",
  //       pullUpLoad: ''
  //     })
  //   }
  //   var jiazai = this.data.jiazai;
  //   wx.showToast({
  //     title: jiazai,
  //     icon: 'loading',
  //     duration: 2000
  //   });

  //   console.log("上拉刷新....")
    
  // },

  // 选项卡
  filterTab: function (e) {
    var data = [true, true, true], index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    // var gun = e.currentTarget.dataset.text;
    console.log(data);
    var tab1 = data[0];
    var tab2 = data[1];
    var tab3 = data[2];

    console.log("..." + tab1 + "..." + tab2 + "..." + tab3);
    if (tab1 == true && tab2 == true && tab3 == true) {
      this.setData({
        tab: data,
        tabtrue: 0,
        kang: "auto"
      })
    } else {
      this.setData({
        tab: data,
        tabtrue: 1,
        kang: "hidden"
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
  // 获取地区-县
  getFilter: function () {
    var self = this;
    wx.request({
      url: on_url+'/xcy/home/column/city',
      data: {
        area_name: self.data.citys
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        self.setData({
          tabTxtas: res.data.data
        });
      },
      fail: function () {
        console.log('error1')
      }
    })
  },
  // 获取地区-区
  getFilters: function () {
    var self = this;
    wx.request({
      url: on_url + '/xcy/home/column/city',
      data: {
        area_name: self.data.citys
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        self.setData({
          tabTxtas_qu: res.data.data
        });
      },
      fail: function () {
        console.log('error1')
      }
    })
  },
  //筛选项点击操作
  filter: function (e) {
    console.log(e);
    var self = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          page: 1,
          data: [],
          tab: [true, true, true],
          tabTxt: tabTxt,
          house_space: id
        });
        break;
      case '1':
        tabTxt[1] = txt;
        self.setData({
          page: 1,
          data: [],
          tab: [true, true, true],
          tabTxt: tabTxt,
          house_style: id
        });
        break;
      case '2':
        tabTxt[2] = txt;
        self.setData({
          page: 1,
          data: [],
          tab: [true, true, true],
          tabTxt: tabTxt,
          house_section: id
        });
        break;
    }
    //数据筛选
    // self.getData();
  },
  //下拉
  onPullDownRefresh: function () {
    console.log("下拉")
    var that = this;
    var cate_text = app.globalData.cate_text;
    var citys = app.globalData.citys;
    
    that.setData({
      pages: 1,//当前页
      total: 1, //总页
      loat: [],//接口数据
      shuju: [],//查询数据
      floor_price: '', //最低价格
      ceiling_price: '', //最高价格
      specifications: '',//规格
      region: '', //区域
      floor_price: '',
      ceiling_price: '',
      pullUpLoad: "pullUpLoad",
      jiazai: "加载中...",
      jiazaigenduo: "点击加载更多",
      dianjiyichan: "bolck", //点击隐藏
      scrollTop: 0,
      cate_text: cate_text,
      tabtrue: 0,
      fid: 0,
      did: 0,
      data: [], //数据
      kong: (wx.getSystemInfoSync().windowHeight - 55) + "px",
      kang: "auto",
      id: 0,
      house_space: 0, //空间
      house_style: 0, //风格
      house_section: 0, //局部
      disabled: false,//加载更多按钮状态
      page: 1,//当前页码
      citys: citys,
      hasMore: false,//加载更多按钮
      tabTxt: ['区域', '价格', '户型'],//tab1文案
      shop_price: [
        { floor: '', ceiling: '', name: '全部' },
        { floor: '0', ceiling: '40', name: '40万以下' },
        { floor: '40', ceiling: '60', name: '40-60万' },
        { floor: '60', ceiling: '80', name: '60-80万' },
        { floor: '80', ceiling: '100', name: '80-100万' }
      ],
      shop_specifications: [],
      tab: [true, true, true],
      moreTxt: '点击加载更多',
      dataNull: false //无结果提示


      });
      setTimeout(function () {
        wx.stopPullDownRefresh();
      }, 1500)
      that.jiekojia();
      that.huoxin();

      // that.setData({
      //   cate_text: cate_text,
      //   citys: citys
      // })
    },
 
  //加载更多
  getMore: function () {
    var self = this;
    self.data.page++;
    self.getData(function (d) {
      self.dataFormat(d)
    });
  },
  goDetaile: function (e) {
    // console.log(e);
    app.globalData.picData = {
      data: this.data.data,
      page: this.data.page,
      space_id: this.data.space_id,
      style_id: this.data.section_id,
      section_id: this.data.section_id,
      current: e.currentTarget.dataset.index
    }
    wx.navigateTo({
      url: '../detaile/detaile'
    });
  }
})