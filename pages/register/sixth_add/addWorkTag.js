const dateList = require('../../../utils/job.js');
const app = getApp();
const url = app.globalData.baseUrl;
//期望职位需要用到的额外参数
let allJobDate = [],
  jobFFs = [],
  jobSFs = [],
  jobTFs = [];
Page({
  data: {
    //期望行业
    industryList: [],
    ind: '', //用于暂存数据
    industryValue: '',
    tradeTypeId: '',
    isIndChang: false,
    //期望职位
    jobFFs: jobFFs,
    jobSFs: jobSFs,
    jobTFs: jobTFs,
    jtv: '',
    jobThreeName: '',
    jobFFIndex: '', //用于存储第一层的下标，来传递给第三层
    showSF: false, //是否展示第二层
    showTF: false, //是否展示第三层
    jobThreeId: '', //用于控制职业类型的单选
    isJobChang: false,
    //期望工作地点
    placeList: [],
    // placeList: ['不限', '不限', '不限'],
    // placeItem: '不限',
    placeItem: '',
    placeCode: [],
    isPlaceChange: false,
    //薪资要求
    salaryList: [],
    salaryItem: 0,
    isSalaryChang: false,
    storageDate: {},
    // 流程参数
    isEmpty:false,
  },


  //期望行业
  industry: function (e) {
    let _that = this;
    _that.modal_industry.showModal();
  },

  selectedInd: function (e) {
    let _that = this;
    let index = e.currentTarget.dataset.id; //当前点击的元素的id
    let value = e.currentTarget.dataset.text; //当前元素的内容
    _that.setData({
      tradeTypeId: index,
      ind: value,
    });
  },

  cancel_ind: function (e) {
    this.modal_industry.closeModal();
  },

  comfirmDate_ind: function (e) {
    this.setData({
      isIndChang: true,
      tradeTypeName: this.data.ind
    });
    this.modal_industry.closeModal();
  },

  //期望职位
  jobType: function (e) {
    let _that = this;
    _that.modal_jobType.showModal();
    _that.setData({
      isShow: true
    });
  },

  //点击第一层，展示相对应的第二层的选项
  showSF: function (e) {
    let _that = this;
    //判断当前点击的层是否的展开状态
    if (_that.data.showSF == true) {
      _that.setData({
        showSF: false
      });
    } else {
      let index = e.currentTarget.dataset.index; //被点击的第一层的id
      // let ffm = e.currentTarget.dataset.ffm;
      //使用获得的id去获取对应的第二层的数据
      getJobSFData(index, _that);
      _that.setData({
        showSF: true,
        jobFFIndex: index
      });
    }
  },

  //第三层
  showTF: function (e) {
    let _that = this;
    if (_that.data.showTF == true) {
      _that.setData({
        showTF: false
      });
    } else {
      let index = e.currentTarget.dataset.index;
      let jobFFIndex = _that.data.jobFFIndex;
      getJobTFData(jobFFIndex, index, _that);
      _that.setData({
        showTF: true
      });
    }
  },

  //选中一个选项
  selectJobItem: function (e) {
    let _that = this;
    let index = e.currentTarget.dataset.tfid;
    let value = e.currentTarget.dataset.text;
    _that.setData({
      jobThreeId: index,
      // jtv: index,
      jtv: value,
    });
  },

  //关闭和提交职位类型
  cancel_job: function (e) {
    this.modal_jobType.closeModal();
    this.setData({
      isShow: false
    });
  },

  comfirmDate_job: function (e) {
    this.setData({
      jobThreeName: this.data.jtv,
      isJobChang: true,
      isShow: false
    });
    this.modal_jobType.closeModal();
  },

  //期望工作地点
  placeChange: function (e) {
    this.setData({
      placeCode: e.detail.code,
      placeList: e.detail.value,
      isPlaceChange: true
    });
  },

  //薪资要求
  salaryChange: function (e) {
    let salaryList = this.data.salaryList;
    this.setData({
      salaryItem: e.detail.value,
      salaryId: salaryList[e.detail.value].typeId,
      salaryName: salaryList[e.detail.value].typeName,
      isSalaryChang: true
    });
  },

  //提交页面
  workTagForm: function (e) {
    let _that = this;
    let storageList = [];
    let newDate = {
      'jobThreeId': _that.data.jobThreeId == '' ? _that.data.re_JobTypeId : _that.data.jobThreeId,
      'tradeTypeId': _that.data.tradeTypeId == '' ? _that.data.re_IndustryId : _that.data.tradeTypeId,
      'cityId': _that.data.placeCode[1] == undefined ? _that.data.re_PlaceId : _that.data.placeCode[1],
      'salaryRangeTypeId': _that.data.salaryId == undefined ? _that.data.re_SalaryId : _that.data.salaryId,
      //前端取值
      'jobIntentionId': _that.data.workId == '' ? Math.random().toString(36).substr(2, 15) : _that.data.workId,
      'jobThreeName': _that.data.jobThreeName == '' ? _that.data.re_JobTypeName : _that.data.jobThreeName,
      'tradeTypeName': _that.data.tradeTypeName == undefined ? _that.data.re_IndustryName : _that.data.tradeTypeName,
      'cityName': _that.data.placeList[1] == undefined ? _that.data.re_PlaceName : _that.data.placeList[1],
      'salaryRangeTypeName': _that.data.salaryName == undefined ? _that.data.re_SalaryName : _that.data.salaryName
    }
    // debugger;
    // console.log(newDate)
    // return false;
    _that.setData({
      storageDate: wx.getStorageSync('registerJson') == '' ? [] : wx.getStorageSync('registerJson')
    });
    let oldDate = _that.data.storageDate.jobIntentionList == undefined ? [] : _that.data.storageDate.jobIntentionList;
    let re_IdCode = _that.data.id_Code;
    let re_WId = _that.data.workId;
    if (re_IdCode == 'register' && re_WId == '') {
      if (oldDate != "") { //判断用户是否是第一次填写数据
        oldDate.push(newDate);
        _that.data.storageDate.jobIntentionList = oldDate;
        wx.setStorageSync('registerJson', _that.data.storageDate);
      } else {
        storageList.push(newDate);
        _that.data.storageDate.jobIntentionList = storageList;
        wx.setStorageSync('registerJson', _that.data.storageDate);
      }
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        success: function (res) {
          wx.redirectTo({
            url: '../sixthPage/workTag?key=register',
          });
        }
      });
    } else if (re_IdCode == 'register' && re_WId != '') {
      let target = oldDate.find(function (obj) {
        return obj.jobIntentionId === re_WId;
      });
      // 更新目标数据
      // target.myStateId = newDate.myStateId;
      // target.myStateName = newDate.myStateName;
      target.jobThreeId = newDate.jobThreeId;
      target.jobThreeName = newDate.jobThreeName;
      target.tradeTypeId = newDate.tradeTypeId;
      target.tradeTypeName = newDate.tradeTypeName;
      target.cityId = newDate.cityId;
      target.cityName = newDate.cityName;
      target.salaryRangeTypeId = newDate.salaryRangeTypeId;
      target.salaryRangeTypeName = newDate.salaryRangeTypeName;

      oldDate.find(function (obj) {
        if (obj.jobIntentionId === _that.data.eduId) {
          obj = target;
        }
      });
      wx.setStorageSync('registerJson', _that.data.storageDate);
      wx.showToast({
        title: '更新成功',
        icon: 'success',
        success: function (res) {
          wx.redirectTo({
            url: '../sixthPage/workTag?key=register',
          });
        }
      });
    } else if (re_IdCode == 'update' && re_WId != '') {
      wx.request({
        url: url + 'jobIntention/updateJobIntention.json',
        method: 'POST',
        data: JSON.stringify(newDate),
        header: {
          'content-type': 'application/json',
        },
        success: res => {
          if (res.data.status == 10000) {
            wx.showToast({
              title: '更新成功',
              icon: 'success',
              success: function (res) {
                wx.redirectTo({
                  url: '../sixthPage/workTag?key=update',
                });
              }
            });
          }
        }
      });
    } else if (re_IdCode == 'update' && re_WId == ''){
      wx.getStorage({
        key: 'wechat_session',
        success: function(res) {
          let sessionId = res.data.sessionId;

      wx.request({
        url: url + 'jobIntention/saveJobIntention.json',
        method: 'POST',
        data: JSON.stringify(newDate),
        header: {
          'content-type': 'application/json',
          'Cookie': 'JSESSIONID=' + sessionId
        },
        success: res => {
          debugger;
          if (res.data.status == 10000) {
            wx.showToast({
              title: '更新成功',
              icon: 'success',
              success: function (res) {
                wx.redirectTo({
                  url: '../sixthPage/workTag?key=update',
                });
              }
            });
          }
        }
      });

        },
      })
    }
  },

  onLoad: function (e) {
    let _that = this;
    let id_Code = e.key;
    let workId = e.wId == undefined ? '' : e.wId;
    _that.setData({
      id_Code: id_Code,
      workId: workId,
    });
    if (id_Code == 'register' && workId != '') {
      let sdata = wx.getStorageSync('registerJson').jobIntentionList;
      let target = sdata.find(function (obj) {
        return obj.jobIntentionId === workId;
      });
      _that.setData({
        isStatusChange: false,
        isIndChang:false,
        isJobChang: false,
        isSalaryChang:false,
        isEmpty: true,
        // 're_MyStateId': target.myStateId,
        // 're_MyStateName': target.myStateName,
        're_JobTypeId': target.jobThreeId == null ? '' : target.jobThreeId,
        're_JobTypeName': target.jobThreeName == undefined ? '' : target.jobThreeName,
        're_IndustryId': target.tradeTypeId,
        're_IndustryName': target.tradeTypeName,
        're_PlaceId': target.cityId,
        're_PlaceName': target.cityName,
        're_SalaryId': target.salaryRangeTypeId,
        're_SalaryName': target.salaryRangeTypeName,
      });
    } else if (id_Code == 'update' && workId != '') {
      wx.showLoading({
        title: 'Loding...',
      });
      wx.request({
        url: url + 'jobIntention/getJobIntention.json',
        method: 'POST',
        data: {
          'jobIntentionId': workId
        },
        header:{
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: res => {
          //从数据库获得相应数据
          let target = res.data.data;
          _that.setData({
            isStatusChange: false,
            isIndChang: false,
            isJobChang: false,
            isSalaryChang: false,
            isEmpty: true,
            // 're_MyStateId': target.myStateId,
            // 're_MyStateName': target.myStateName,
            're_JobTypeId': target.jobThreeId == null ? '' : target.jobThreeId,
            're_JobTypeName': target.jobThreeName == null ? '' : target.jobThreeName,
            're_IndustryId': target.tradeTypeId,
            're_IndustryName': target.tradeTypeName,
            're_PlaceId': target.cityId,
            're_PlaceName': target.cityName,
            're_SalaryId': target.salaryRangeTypeId,
            're_SalaryName': target.salaryRangeTypeName,
          });
          wx.hideLoading();
        }
      });
    }

    
    //装载弹窗框
    _that.modal_industry = _that.selectComponent('#modal_industry');
    _that.modal_jobType = _that.selectComponent('#modal_jobType');

    //装载期望行业
    dateList.getIndustryDate(function (arr) {
      _that.setData({
        industryList: arr
      });
    });

    //装填期望职位
    dateList.getJobDate(function (arr) {
      allJobDate = arr;
      getJobFFData(_that);
    });

    //装填薪资要求
    dateList.getSalaryDate(function (arr) {
      _that.setData({
        salaryList: arr
      });
    });
  },
});


function getJobFFData(that) { //获取职位数据的第一层
  let s, num = 0;
  jobFFs = [];
  for (let i = 0; i < allJobDate.length; i++) {
    s = allJobDate[i];
    if (s.sfm == undefined && s.tfm == undefined) {
      jobFFs[num] = s;
      num++;
    }
  }
  that.setData({
    jobFFs: jobFFs
  });
}

function getJobSFData(count, that) { //获取职位数据的第二层
  let c, num = 0;
  jobSFs = [];
  for (var i = 0; i < allJobDate.length; i++) {
    c = allJobDate[i];
    if (c.sfm != undefined && c.ffm == jobFFs[count].ffm && c.tfm == undefined) {
      jobSFs[num] = c;
      num++;
    }
  }
  if (jobSFs.length == 0) {
    jobSFs[0] = {
      name: ''
    };
  }
  that.setData({
    jobSFs: jobSFs,
  });
}

function getJobTFData(column0, column1, that) { //获取职位数据的第三层
  var c, num = 0;
  jobTFs = [];
  for (var i = 0; i < allJobDate.length; i++) {
    c = allJobDate[i];
    if (c.tfm != undefined && c.ffm == jobFFs[column0].ffm && c.sfm == jobSFs[column1].sfm) {
      jobTFs[num] = c;
      num++;
    }
  }
  if (jobTFs.length == 0) {
    jobTFs[0] = {
      name: ''
    };
  }
  that.setData({
    jobTFs: jobTFs,
  })
}