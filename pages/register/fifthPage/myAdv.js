// pages/register/fifthPage/myAdv.js
import WxValidate from '../../../utils/WxValidate.js';
const util = require('../../../utils/util.js'),
  app = getApp(),
  url = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storageDate: []
  },
  onLoad: function(e) {
    let _that = this;
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId;
        let id_Code = e.key;
        // let id_Code = 'register';
        _that.setData({
          id_Code: id_Code,
          sessionId: sessionId
        });
        if (id_Code == 'update') {
          wx.request({
            url: url + 'applicantInfo/getApplicantAdvantage.json',
            method: 'POST',
            header: {
              'Cookie': 'JSESSIONID=' + sessionId
            },
            success: res => {
              if (res.data.status == 10000) {
                _that.setData({
                  myAdv: res.data.data,
                  btnText: '保存'
                });
              }
            }
          })
        } else if (id_Code == 'register') {
          _that.setData({
            btnText: '下一步'
          });
        }
      },
    })
  },

  registerForm: function(e) {
    if (this.data.id_Code == 'register') {
      let storageDate = wx.getStorageSync('registerJson');
      this.setData({
        storageDate: storageDate
      });
      this.data.storageDate.applicantAdvantage = e.detail.value.myAdv;
      wx.setStorage({
        key: 'registerJson',
        data: this.data.storageDate,
        success: function() {
          wx.showToast({
            title: '提交成功',
            success: res => {
              wx.redirectTo({
                url: '../sixthPage/workTag?key=register',
              })
            }
          })
        }
      })
    } else if (this.data.id_Code == 'update') {
      wx.request({
        url: url + 'applicantInfo/updateApplicantInfo.json',
        method: 'POST',
        header: {
          'Cookie': 'JSESSIONID=' + this.data.sessionId
        },
        success: res => {
          if (res.data.status == 10000) {
            wx.showToast({
              title: '修改成功',
              icon: "success",
              success: res => {
                //返回入口
                wx.redirectTo
                ({
                  url: '',
                })
              }
            });
          }
        }
      })
    }
  }
});