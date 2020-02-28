// pages/tabBarPage/tab_Resume/tab_Resume.js
var app = getApp();
const url = app.globalData.baseUrl;
Page({
  data: {
    isRegister: false,
    resumeData: ''
  },

  onLoad: function(options) {
    let _that = this;
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId;
        wx.request({
          url: url + 'applicantInfo/getResume.json',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': 'JSESSIONID=' + sessionId
          },
          success(res) {
            _that.setData({
              resumeData: res.data.data
            });
          }
        });
      },

    })
  },
  
  //修改简历的公开状态
  switchChange: function(e) {
    let _that = this;
    let status = '';
    if (e.detail.value === false) {
      status = '0';  // 将显示改为隐藏
    } else {
      status = '1'   // 反之
    }
    if (status != '') {
      wx.getStorage({
        key: 'wechat_session',
        success: function(res) {
          let sessionId = res.data.sessionId;
          wx.request({
            url: url + 'applicantInfo/updateIsHide.json',
            method: 'POST',
            data: {
              'isHide': status
            },
            header: {
              'Cookie': 'JSESSIONID=' + sessionId
            },
            success: res => {
              if (res.data.status === 10000) {
                wx.showToast({
                  title: '修改成功!',
                });
              }
            }
          });
        },
      });
    }
  }
})