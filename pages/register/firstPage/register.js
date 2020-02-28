// pages/register/firstPage/register.js
const app = getApp();
const url = app.globalData.baseUrl;
const checkFun = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sessionId: '',
    phone: '',
    isSend: false, //验证码是否已经发送
    isPass: true, //是否通过了验证
    keyCodeBtn: '获取验证码', //显示在获取验证码按钮上的文字
  },
  //装填手机号
  phoneInput: function(e) {
    let _that = this;
    _that.setData({
      phone: e.detail.value
    });
  },

  //获取验证码
  getCode: function(e) {
    let _that = this,
      runTime = 60;
    //需要发起请求，当成功发送了验证码之后设置在60S之后才能再次获取
    let sessionId = _that.data.sessionId;
    wx.request({
      url: url + 'register/sendMessage.json',
      data: {
        'userPhone': _that.data.phone
      },
      header: {
        'Cookie': 'JSESSIONID=' + sessionId
      },
      success(res) {
        if (res.data.status == 20016) {
          wx.showModal({
            title: '提示信息',
            content: '该手机号码已经绑定!',
            showCancel: false
          });
        } else {
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 2000
          });
          let timer = setInterval(function() {
            if (runTime > 1) {
              runTime--;
              _that.setData({
                keyCodeBtn: runTime + 's',
                isSend: true,
              });
            } else {
              _that.setData({
                keyCodeBtn: '获取验证码',
                isSend: false,
              });
              clearInterval(timer)
            }
          }, 1000);
        }
      }
    });
  },

  //在提交之前先验证用户输入的值是否合法
  validateFun: function(p, k) {
    let _that = this,
      phoneNumber = p,
      keyCode = k,
      phoneReg = /^13[\d]{9}$|^14[5,7]{1}\d{8}$|^15[^4]{1}\d{8}$|^17[0,3,6,7,8]{1}\d{8}$|^18[\d]{9}$/;
    //验证手机号
    if (phoneNumber.length == 0) {
      _that.setData({
        isPass: false
      });
      wx.showModal({
        title: '提示信息',
        content: '手机号码不能为空!',
        showCancel: false
      })
    } else if (!phoneReg.test(phoneNumber)) {
      _that.setData({
        isPass: false
      });
      wx.showModal({
        title: '提示信息',
        content: '请输入正确的手机号码!',
        showCancel: false
      });
    } else {
      //验证获得的验证码
      if (keyCode.length == 0) {
        _that.setData({
          isPass: false
        });
        wx.showModal({
          title: '提示信息',
          content: '验证码不能为空!',
          showCancel: false
        });
      } else {
        _that.setData({
          isPass: true
        });
      }
    }
    return _that.data.isPass;
  },

  //表单提交
  registerForm: function(e) {
    let _that = this;
    let isPass = _that.validateFun(e.detail.value.phone, e.detail.value.code);
    let sessionId = _that.data.sessionId;
    //获得当前用户的标识，以对应后台的数据
    if (isPass) {
      //验证获得的手机验证码是否正确
      wx.request({
        url: url + 'register/saveMessage.json',
        data: {
          'userPhone': e.detail.value.phone,
          'phoneCode': e.detail.value.code
        },
        method: 'POST',
        header: {
          'Cookie': 'JSESSIONID=' + sessionId
        },
        success(res) {
          if (res.data.status == 20017) {
            wx.showModal({
              title: '提示信息',
              content: '验证码错误!',
              showCancel: false
            });
          } else if (res.data.status == 20018) {
            wx.showModal({
              title: '提示信息',
              content: '验证码失效，请重新获取!',
              showCancel: false
            });
          } else if (res.data.status == 10000){
            wx.showToast({
              title: '绑定成功，请填写个人信息',
              icon: 'success',
              success(res) {
                wx.redirectTo({
                  url: "../secondPage/myInfo?key=register"
                });
              }
            });
          }
        },
      });
    }
  },

  onLoad: function(e) {
    let sessionId = '';
    let that = this;
    that.setData({
      sessionId: wx.getStorageSync('wechat_session').sessionId
    });
  }
});