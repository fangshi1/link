// pages/vr360/vr360.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that=this;
    var vr_img = options.vr_img;
    var imgurl = "https://www.wh2013.net/xcy/3D/index.php?vr_pic=" + vr_img;
    console.log(vr_img);
    that.setData({
      imgurl: imgurl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      // //测试
    // setTimeout(function () {
    //   wx.showModal({
    //     title: "" + wx.getStorageSync('is_have_code'),
    //     content: '',
    //     success: function (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       } else {
    //         console.log('用户点击取消')
    //       }

    //     }
    //   })
    // }, 2000)

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