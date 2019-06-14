// ../thirdPage/jobExp.js
import WxValidate from '../../../utils/WxValidate.js'
var util = require('../../../utils/util.js');
var dateList = require('../../../utils/job.js'),
  //期望职业
  allJobDate = [],
  jobFFs = [],
  jobSFs = [],
  jobTFs = [];
const app = getApp();
const url = app.globalData.baseUrl;
Page({
  data: {
    endDay: '',
    startDate: '',
    endDate: '',
    isStartChange: false,
    isEndChange: false,
    //职业类型
    jobFFs: jobFFs,
    jobSFs: jobSFs,
    jobTFs: jobTFs,
    jobTypeV: '',
    jobFFIndex: '', //用于存储第一层的下标，来传递给第三层
    showSF: false, //是否展示第二层
    showTF: false, //是否展示第三层
    jobCheck: '', //用于控制职业类型的单选
    isJobChang: false,
    //技能标签
    skillBox: [],
    skillBoxIndex: 0,
    skillList: [],
    skillValue: '',
    skillIndex: 0,
    isSkillChange: false,
    //公司行业
    companyList: [],
    cTV: '', //用于暂存数据
    companyTypeV: '',
    ctid: 'H001',
    isIndChang: false,

  },

  //公司行业
  companyType: function(e) {
    let _that = this;
    _that.modal_companyType.showModal();
  },

  selectedItem: function(e) {
    let _that = this;
    let index = e.currentTarget.dataset.id; //当前点击的元素的id
    let value = e._relatedInfo.anchorTargetText; //当前元素的内容
    _that.setData({
      ctid: index,
      cTV: value,
    });
  },

  //关闭弹窗
  cancel_ct: function(e) {
    this.modal_companyType.closeModal();
  },
  //确认选择
  comfirmDate_ct: function(e) {
    let _that = this;
    _that.setData({
      companyTypeV: _that.data.cTV,
      isIndChang: true
    });
    _that.modal_companyType.closeModal();
  },

  //职业类型
  jobType: function(e) {
    let _that = this;
    _that.modal_jobType.showModal();
  },

  //点击第一层，展示相对应的第二层的选项
  showSF: function(e) {
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
  showTF: function(e) {
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
  selectJobItem: function(e) {
    let _that = this;
    let index = e.currentTarget.dataset.tfid;
    let value = e._relatedInfo.anchorTargetText;
    console.log(e)
    _that.setData({
      jobCheck: index,
      jobTypeV: value,
      isJobChang:true
    });
  },

  //技能标签
  bSkillChange: function(e) {
    let _that = this;
    // console.log(e)
    _that.setData({
      skillIndex: e.detail.value,
      skillValue: e.currentTarget.dataset.id,
      isSkillChange: true
    });
  },

  addSkill: function(e) {
    let _that = this;
    if (_that.data.skillBox.length >= 2) {
      wx.showModal({
        title: '提示',
        content: '技能标签最多存在三个',
      });
    } else {
      let old = _that.data.skillBox;
      old.push(1);
      _that.setData({
        skillBox: old
      });
    }
  },

  //参加工作时间
  startChange: function(e) {
    let _that = this;
    _that.setData({
      startDate: e.detail.value,
      isStartChange: true
    });
  },

  endChange: function(e) {
    let _that = this;
    _that.setData({
      endDate: e.detail.value,
      isEndChange: true
    });
  },

  //配置验证规则
  initValidate: function(e) {
    const rules = {
      companyName: {
        required: true,
        rangelength: [2, 10]
      }
    };
    const ruleMsg = {
      companyName: {
        required: '公司名称必填',
        rangelength: '输入的值不合法'
      }
    };
    this.WxValidate = new WxValidate(rules, ruleMsg);
  },

  //提交表单
  jobExpForm: function(e) {
    let _that = this,
      formValue = {};
    //组装数据
    let checkFormData = {
      'companyName': e.detail.value.companyName
    }
    // console.log(e)
    wx.setStorage({
      key: 'workExperienceList',
      data: {
        'companyName': e.detail.value.companyName,
        'jobThreeId': _that.data.industryVal,
        'jobContent': e.detail.value.wContent,
        'tradeTypeId': _that.data.jobTFVal,
        'startTime': e.detail.value.start,
        'endTime': e.detail.value.end
      },
    })
    //验证合法性
    // if (!_that.WxValidate.checkForm(checkFormData)) {
    //   const error = this.WxValidate.errorList[0];
    //   _that.showError(error);
    //   return false;
    // } else {
    //   formValue.workExperienceList = workExperienceList;
    // }
    let a = wx.getStorageSync('workExperienceList');
    // console.log(a);
    // wx.showModal({
    //   title: '提示',
    //   content: '还要继续添加工作经验吗？取消则前往下一步',
    //   success(res) {
    //     if (res.confirm) {
    //       wx.navigateTo({
    //         url: '../thirdPage/jobExp',
    //       });
    //     } else if (res.cancel) {
    //       wx.navigateTo({
    //         url: '../fourthPage/eduExp',
    //       });
    //     }
    //   }
    // });
  },

  //关于表单验证的弹窗提示
  showError: function(error) {
    wx.showModal({
      content: error.msg,
      showCancel: true
    });
  },

  //跳过此页
  skipTap: function(e) {
    wx.navigateTo({
      url: '../fourthPage/eduExp',
    })
  },

  //获取初始化信息
  onLoad: function(e) {
    let _that = this,
      nowTime = util.formatTime(new Date()),
      companyList = [],
      skillList = [];
    _that.setData({
      endDay: nowTime,
    });
    //装载验证规则
    this.initValidate();

    //初始化弹窗
    _that.modal_companyType = _that.selectComponent('#modal_companyType');
    _that.modal_jobType = _that.selectComponent('#modal_jobType');


    //装填职业类型
    dateList.getJobDate(function(arr) {
      allJobDate = arr;
      getJobFFData(_that);
    });

    //装填公司行业
    dateList.getIndustryDate(function(indArr) {
      companyList = indArr;
      // console.log(companyList)
      _that.setData({
        companyList: companyList
      });
    });

    //装填技能标签
    dateList.getSkillDate(function(skillArr) {
      skillList = skillArr;
      _that.setData({
        skillList: skillList
      });
    });
  },

  onReady: function() {

  },

})

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
    // console.log(c)
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