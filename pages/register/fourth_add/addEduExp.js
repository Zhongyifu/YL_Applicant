const util = require('../../../utils/util.js');
const dateList = require('../../../utils/job.js'),
  app = getApp(),
  url = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eduList: [],
    eduIndex: '',
    educationId: '',
    educationName: '',
    isEduSelected: false,

    nowTime: "",
    isStartChange: false,

    startTime: '',
    endTime: '',
    isEndDChange: false,

    storageDate: [],
    id_Code: ''
  },

  bEduChange: function(e) {
    let _that = this;
    let eduList = _that.data.eduList;
    _that.setData({
      eduIndex: e.detail.value,
      educationId: eduList[e.detail.value].typeId,
      educationName: eduList[e.detail.value].typeName,
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
    //获取系统当前日期
    let nowTime = util.formatTime(new Date());
    let id_Code = e.key;
    let eduId = e.eduId == undefined ? '' : e.eduId;
    _that.setData({
      id_Code: id_Code,
      eduId: eduId,
      nowTime: nowTime,
    });

    if (id_Code == 'register' && eduId != '') {
      let sdata = wx.getStorageSync('registerJson').educationExperienceList;
      let target = sdata.find(function(obj) {
        return obj.educationExperienceId === eduId;
      });
      _that.setData({
        isEmpty: true,
        're_Sname': target.schoolName,
        're_Education': target.educationalBackgroundTypeName,
        're_EducationId': target.educationalBackgroundTypeId,
        're_Mname': target.majorName,
        're_StartTime': target.startTime,
        're_EndTime': target.endTime
      });
    } else if (id_Code == 'update' && eduId != '') {
      wx.showLoading({
        title: 'Loding...',
      });
      wx.request({
        url: url + 'workExperience/getEducationExperience.json',
        method: 'POST',
        data: {
          'educationExperienceId': eduId
        },
        success: res => {
          //从数据库获得相应数据
          let target = res.data.data;
          _that.setData({
            isEmpty: true,
          });
          wx.hideLoading();
        }
      });
    }

    //预装学历背景
    dateList.getEduList(function(arr) {
      _that.setData({
        eduList: arr
      });
    });
  },

  //表单提交
  registerForm: function(e) {
    let _that = this;
    let storageList = [];
    let newDate = {
      'schoolName': e.detail.value.schoolName,
      'educationalBackgroundTypeId': _that.data.educationId == '' ? _that.data.re_EducationId : _that.data.educationId,
      'majorName': e.detail.value.majorName,
      'startTime': e.detail.value.sTime == '' ? _that.data.re_StartTime : e.detail.value.sTime,
      'endTime': e.detail.value.eTime == '' ? _that.data.re_EndTime : e.detail.value.eTime,
      //前端取值参数
      'educationExperienceId': _that.data.eduId == '' ? Math.random().toString(36).substr(2, 15) : _that.data.eduId,
      'educationalBackgroundTypeName': _that.data.educationName == undefined ? _that.data.re_Education : _that.data.educationName,
    };
    _that.setData({
      storageDate: wx.getStorageSync('registerJson') == undefined ? [] : wx.getStorageSync('registerJson')
    });
    let oldDate = _that.data.storageDate.educationExperienceList == undefined ? [] : _that.data.storageDate.educationExperienceList;
    let re_IdCode = _that.data.id_Code;
    let re_EduId = _that.data.eduId;
    if (re_IdCode == 'register' && re_EduId == '') {
      if (oldDate != "") { //判断用户是否是第一次填写数据
        oldDate.push(newDate);
        _that.data.storageDate.educationExperienceList = oldDate;
        wx.setStorageSync('registerJson', _that.data.storageDate);
      } else {
        storageList.push(newDate);
        _that.data.storageDate.educationExperienceList = storageList;
        wx.setStorageSync('registerJson', _that.data.storageDate);
      }
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        success: function(res) {
          wx.redirectTo({
            url: '../fourthPage/eduExp?key=register',
          });
        }
      });
    } else if (re_IdCode == 'register' && re_EduId != '') {
      let target = oldDate.find(function(obj) {
        return obj.educationExperienceId === _that.data.eduId;
      });
      // 更新目标数据
      target.schoolName = newDate.schoolName;
      target.educationalBackgroundTypeId = newDate.educationalBackgroundTypeId;
      target.educationalBackgroundTypeName = newDate.educationalBackgroundTypeName;
      target.majorName = newDate.majorName;
      target.startTime = newDate.startTime == '' ? target.startTime : newDate.startTime;
      target.endTime = newDate.endTime == '' ? target.endTime : newDate.endTime;

      oldDate.find(function(obj) {
        if (obj.educationExperienceId === _that.data.eduId) {
          obj = target;
        }
      });
      wx.setStorageSync('registerJson', _that.data.storageDate);
      wx.showToast({
        title: '更新成功',
        icon: 'success',
        success: function(res) {
          wx.redirectTo({
            url: '../fourthPage/eduExp?key=register',
          });
        }
      });
    } else if (re_IdCode == 'update' && re_EduId != '') {
      wx.request({
        url: url + 'workExperience/updateWorkExperience.json',
        method: 'POST',
        data: JSON.stringify(newDate),
        header: {
          'content-type': 'application/json',
        },
        success: res => {
          console.log(res)
          if (res.data.status == 10000) {
            wx.showToast({
              title: '更新成功',
              icon: 'success',
              success: function(res) {
                wx.redirectTo({
                  url: '../thirdPage/jobExp?key=update',
                });
              }
            });
          }
        }
      });
    }

  },
})