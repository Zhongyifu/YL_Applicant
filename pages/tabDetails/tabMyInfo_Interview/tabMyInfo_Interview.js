// pages/tabDetails/tabMyInfo_Interview/tabMyInfo_Interview.js
const app = getApp();
const url = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelect: '1',
    interviewList: [],
    pageStart: 1
  },


  searchDate: function(status, pageStart) {
    let _that = this;
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: url + 'jobInterview/getJobInterviewDTOList.json',
      method: 'POST',
      data: {
        'isInterview': status, //0 未面试。1 已面试
        'pageStart': pageStart,
        'rows': 5
      },
      header: {
        'Cookie': 'JSESSIONID=' + _that.data.sessionId
      },
      success: res => {
        if (res.data.data.list == '' && _that.data.pageStart == 1) {
          _that.setData({
            interviewList: res.data.data.list,
            isEmpty: true
          });
        } else {
          _that.setData({
            interviewList: res.data.data.list,
            isEmpty: false
          });
        }
      },
      complete: res => {
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _that = this;
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId;
        _that.setData({
          sessionId: sessionId
        });
        _that.searchDate('1', 1);
      },
    })
  },

  // 搜索 已完成的面试
  interviewed: function(e) {
    this.searchDate('1', 1);
    this.setData({
      isSelect: '1'
    });
  },

  // 搜索 未完成的面试
  unInterview: function(e) {
    this.searchDate('0', 1);
    this.setData({
      isSelect: '0'
    });
  }

})