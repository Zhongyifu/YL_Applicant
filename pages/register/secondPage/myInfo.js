import WxValidate from '../../../utils/WxValidate.js'
const dataList = require('../../../utils/job.js');
const util = require('../../../utils/util.js'),
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
    sexType: '1',
    userImg: '',

    //id_Code:identification code
    id_Code: '',
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
        let path = res.tempFilePaths[0];
        wx.getStorage({
          key: 'wechat_session',
          success: function(res) {
            let sessionId = res.data.sessionId;
            wx.showLoading({
              title: '上传中...',
            });
            // 上传到服务器缓存
            wx.uploadFile({
              url: url + 'uploadphoto/uploadCachePhoto.json',
              filePath: path,
              name: 'file',
              formData: {
                'file': path
              },
              header: {
                'content-type': 'multipart/form-data',
                'Cookie': 'JSESSIONID=' + sessionId
              },
              success: res => {
                let dataJson = JSON.parse(res.data);
                let imgCashUrl = dataJson.data;
                // 上传到服务器
                wx.request({
                  url: url + 'register/updateUserImg.json',
                  data: {
                    'img': imgCashUrl
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Cookie': 'JSESSIONID=' + sessionId
                  },
                  success: result => {
                    _that.setData({
                      userImg: result.data.data
                    });
                  },
                  complete: result => {
                    wx.hideLoading();
                  }
                })
              }
            });
          },
        })
      },
    })
  },

  //将页面的数据提交至缓存中
  myInfoForm: function(e) {
    let _that = this;
    //验证数据完整性
    if (!_that.WxValidate.checkForm(e.detail.value)) {
      const error = this.WxValidate.errorList[0];
      _that.showError(error);
      return false;
    }
    //提交流程，注册/更新
    let formJson = {};
    formJson.userName = e.detail.value.userName;
    formJson.userSex = e.detail.value.userSex;
    formJson.userBirthday = e.detail.value.userBirthday;
    formJson.applicantMailbox = e.detail.value.applicantMailbox;
    formJson.applicantWorkDate = e.detail.value.applicantWorkDate;
    formJson.maritalStatusTypeId = _that.data.maritalValue;
    formJson.salaryRangeTypeId = _that.data.salaryValue;
    formJson.userImg = _that.data.userImg;
    if (_that.data.id_Code == 'register') {
      wx.setStorage({
        key: 'registerJson',
        data: formJson,
        success: function() {
          wx.showToast({
            title: '保存成功!',
            icon: 'success',
            duration: 2000
          });
          wx.navigateTo({
            url: '../thirdPage/jobExp?key=register',
          });
        }
      });
    } else {
      //更新这段数据
      wx.request({
        url: url + 'applicantInfo/updateApplicantInfo.json',
        method: 'POST',
        data: formJson,
        success: res => {
          if (res.data.status = 10000) {
            wx.showToast({
              title: '上传成功!',
              icon: 'success',
              duration: 2000
            });
            //返回入口页面
          }
        }
      })
    }
  },

  //获取当前日期
  onLoad: function(e) {
    let _that = this;
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId;
        //获取入口标识 
        //(1.register 由注册进入，启用注册流程的代码)
        //(2.update 由修改进入，启用修改流程的代码)
        // let id_Code = 'register'; //fake data
        //获取当前的系统时间
        _that.setData({
          id_Code: e.key,
          endDay: util.formatTime(new Date()),
          sessionId: sessionId
        });
        //根据获得的标识预装数据
        if (_that.data.id_Code == 'update') {
          wx.request({
            url: url + 'applicantInfo/getApplicantInfo.json',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Cookie': 'JSESSIONID=' + sessionId
            },
            success: res => {
              if (res.data.status == 10000) {
                let dataArr = res.data.data;
                _that.setData({
                  //数据填充
                  userImg: dataArr.applicantImg,
                  sexType: dataArr.applicantSex,
                  userName: dataArr.applicantName,
                  birthday: dataArr.applicantBirthday,
                  birthdayDate: dataArr.applicantBirthday,
                  email: dataArr.applicantMailbox,
                  salary: dataArr.salaryRangeTypeName,
                  marital: dataArr.maritalStatusTypeName,
                  jobExp: dataArr.applicantWorkDate,
                  btnText: '保存'
                });
              }
            }
          });
        } else {
          _that.setData({
            btnText: '下一步'
          });
        }
      },
    })
    //装载验证规则
    this.initValidate();

    //装填婚姻状态
    dataList.getMaritalDate(function(arr) {
      _that.setData({
        maritalList: arr
      });
    });

    //装填薪资
    dataList.getSalaryDate(function(arr) {
      _that.setData({
        salaryList: arr
      });
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
      userName: {
        required: true,
        rangelength: [2, 4]
      },
      applicantMailbox: {
        required: true,
        email: true
      },
      userBirthday: {
        required: true
      }
    };
    const ruleMsg = {
      userName: {
        required: '请填写您的真实姓名',
        rangelength: '请填写正确的姓名'
      },
      applicantMailbox: {
        required: '请填写您的E-Mail',
        email: '请填写正确的E-Mail地址'
      },
      userBirthday: {
        required: '请填写您的出生日期'
      }
    };

    this.WxValidate = new WxValidate(rules, ruleMsg);
  },
});