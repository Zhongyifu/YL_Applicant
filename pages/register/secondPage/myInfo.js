import WxValidate from '../../../utils/WxValidate.js'
var util = require('../../../utils/util.js'),
  app = getApp(),
  url = app.globalData.baseUrl;
Page({

  data: {
    salaryList: [],
    salaryValue: '',
    salaryItem: 0,

    isSalaryChange: false,

    maritalList: [],
    maritalItem: 0,
    maritalValue: '',
    isMaritalChange: false,

    startDay: '1951-01-01',
    endDay: '',
    nowDate: '',

    birthdayDate: '',
    isBirthdayChange: false,

    jobDate: '',
    isJobChange: false,

    sex: '',
    userImg: '',
  },
  //月薪
  salayChange: function(e) {
    let _that = this;
    _that.setData({
      salaryItem: e.detail.value,
      salaryValue: e.currentTarget.dataset.id,
      isSalaryChange: true
    })
  },

  //婚姻情况
  maritalChange: function(e) {
    let _that = this;
    _that.setData({
      maritalItem: e.detail.value,
      maritalValue: e.currentTarget.dataset.id,
      isMaritalChange: true
    });
  },

  //出生年月
  birthdayChange: function(e) {
    let _that = this;
    _that.setData({
      isBirthdayChange: true,
      birthdayDate: e.detail.value
    });
  },

  //参加工作的时间
  jobExpChange: function(e) {
    let _that = this;
    _that.setData({
      jobDate: e.detail.value,
      isJobChange: true
    });
  },

  //性别
  sexChanage: function(e) {
    let _that = this;
    _that.setData({
      sex: e.detail.value
    });
  },

  //上传头像
  chooseHP: function(e) {
    let _that = this;
    //在点击后先将选择的图片上传至缓存中，待到整个页面提交时再统一提交到服务端
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        _that.setData({
          userImg: res.tempFilePaths
        });
        //将用户选择的图片存储到缓存中
        wx.setStorage({
          key: 'uploadUrl',
          data: res.tempFilePaths
        });
      },
    })
  },

  //将页面的数据提交至缓存中
  myInfoForm: function(e) {
    let _that = this;
    //验证
    if (!_that.WxValidate.checkForm(e.detail.value)) {
      const error = this.WxValidate.errorList[0];
      _that.showError(error);
      return false;
    }
    wx.setStorage({
      key: 'userName',
      data: e.detail.value.userName,
    });
    wx.setStorage({
      key: 'userSex',
      data: e.detail.value.userSex,
    });
    wx.setStorage({
      key: 'userBirthday',
      data: e.detail.value.userBirthday,
    });
    wx.setStorage({
      key: 'applicantMailbox',
      data: e.detail.value.applicantMailbox,
    });
    wx.setStorage({
      key: 'applicantWorkDate',
      data: e.detail.value.applicantWorkDate,
    });
    wx.setStorage({
      key: 'maritalStatusTypeId',
      data: _that.data.maritalValue,
    });
    wx.setStorage({
      key: 'salaryRangeTypeId',
      data: _that.data.salaryValue,
    });


    wx.showToast({
      title: '上传成功!',
      icon: 'success',
      duration: 2000
    });
    wx.navigateTo({
      url: '../thirdPage/jobExp',
    });
  },

  //获取当前日期
  onLoad: function(e) {

    //验证是否登录
    util.checkLogin();


    let _that = this,
      nowTime = util.formatTime(new Date());
    _that.setData({
      endDay: nowTime,
    });
    //装载验证规则
    this.initValidate();

    //获取预装的值
    let maritalList = []; //婚姻状态
    wx.request({
      url: url + 'maritalStatusType/findList.json',
      success(res) {
        maritalList = res.data.data;
        _that.setData({
          maritalList: maritalList,
          isMaritalChange: false
        });
      }
    });

    let salaryList = []; //当前月薪
    wx.request({
      url: url + 'salaryRangeType/findList.json',
      success(res) {
        salaryList = res.data.data;
        _that.setData({
          salaryList: salaryList
        });
      }
    });

    let userImg = ''; //清空Storage里存储的头像的值
    wx.setStorage({
      key: 'uploadUrl',
      data: userImg
    });
    _that.setData({
      userImg: userImg
    });

  },

  //关于表单验证的弹窗提示
  showError: function(error) {
    wx.showModal({
      content: error.msg,
      showCancel: true
    });
  },

  //配置验证规则
  initValidate: function(e) {
    const rules = {
      name: {
        required: true,
        rangelength: [2, 4]
      },
      email: {
        required: true,
        email: true
      },
      idcard: {
        required: true,
        idcard: true
      },
      birthday: {
        required: true
      }
    };
    const ruleMsg = {
      name: {
        required: '请填写您的真实姓名',
        rangelength: '请填写正确的姓名'
      },
      email: {
        required: '请填写您的E-Mail',
        email: '请填写正确的E-Mail地址'
      },
      birthday: {
        required: '请填写您的出生日期'
      }
    };

    this.WxValidate = new WxValidate(rules, ruleMsg);
  },
})