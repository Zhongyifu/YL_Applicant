// pages/tab_Myinfo.js
var app = getApp();
const url = app.globalData.baseUrl;
Page({
  data: {
    isRegister: false
  },
  //跳转到注册页面
  nvaToRegister: function(e) {
    wx.navigateTo({
      url: '../../register/firstPage/register',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onLoad: function(options) {
    let _that = this;
    //在页面加载完成之后，发起请求判断用户是否登录或注册
    wx.checkSession({
      success: function(e) {
        _that.setData({
          isRegister: true
        });
      },
      fail: function(e) {
        //当用户的登录信息已经过期
        _that.setData({
          isRegister: false
        });
        //重新获得用户授权
        wx.login({
          success(res) {
            if (res.code) {
              //发起网络请求
              wx.request({
                url: url + 'login/miniProgramcLogin.json',
                data: {
                  code: res.code
                },
              })
            } else {
              console.log('登录失败！' + res.errMsg);
            }
          }
        })
      }
    });
  },


})