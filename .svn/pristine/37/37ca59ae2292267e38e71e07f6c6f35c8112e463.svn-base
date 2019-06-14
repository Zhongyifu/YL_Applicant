var util = require('../../../utils/util.js'),
  app = getApp(),
  url = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eduList: [],
    eduIndex: 0,
    eduValue: '',
    isEduSelected: false,
    nowTime: "",
    isStartChange: false,
    startTime: '',
    endTime: '',
    isEndDChange: false,
  },

  bEduChange: function(e) {
    let _that = this;
    _that.setData({
      eduIndex: e.detail.value,
      eduValue: e.currentTarget.dataset.eid,
      isEduSelected: true
    });
  },
  startDateChange: function(e) {
    this.setData({
      startTime: e.detail.value,
      isStartChange: true
    });
  },
  endDateChange: function(e) {
    this.setData({
      endTime: e.detail.value,
      isEndDChange: true
    });
  },
  onLoad: function(e) {
    let _that = this;
    let eduList = [];
    //获取系统当前日期
    let nowTime = util.formatTime(new Date());
    _that.setData({
      nowTime: nowTime,
    });
    wx.request({
      url: url + 'educationalBackgroundType/findList.json',
      success(res) {
        eduList = res.data.data;
        _that.setData({
          eduList: eduList,
          isEduSelected: true
        });
      }
    })
  },
  //表单提交
  registerForm: function(e) {
    let _that = this;
    let formValue = {};
    if (_that.data.eduValue == '') {
      _that.data.eduValue = "01";
    }
    let dataList = [{
      'schoolName': e.detail.value.schoolName,
      'educationalBackgroundTypeId': _that.data.eduValue,
      'majorName': e.detail.value.majorName,
      'startTime': e.detail.value.sTime,
      'endTime': e.detail.value.eTime
    }];
    formValue.educationExperienceList = dataList;
    //将数据存储到缓存中
    wx.setStorage('educationExperienceList', dataList);
    wx.showModal({
      title: '提示',
      content: '还要继续添加教育经验吗？取消则前往下一步',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../fourthPage/eduExp',
          })
        } else if (res.cancel) {
          wx.navigateTo({
            url: '../fifthPage/myAdv',
          })
        }
      }
    });
  },
  //跳过次页
  skipTap: function(e) {
    wx.navigateTo({
      url: '../fifthPage/myAdv',
    });
  },
})