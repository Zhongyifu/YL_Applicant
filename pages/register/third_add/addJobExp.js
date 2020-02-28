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
    startDate: '',
    endDate: '',
    isStartChange: false,
    isEndChange: false,
    //职业类型
    jobFFs: jobFFs,
    jobSFs: jobSFs,
    jobTFs: jobTFs,
    jtv: '',
    jobThreeName: '',
    jobFFIndex: '', //用于存储第一层的下标，来传递给第三层
    showSF: false, //是否展示第二层
    showTF: false, //是否展示第三层
    jobCheck: '', //用于控制职业类型的单选
    isJobChang: false,
    //技能标签
    skv: [], //临时存储被选中的值
    skvList: [], //临时存储被选中的值，用于展示到页面中
    skillV: '',
    isSkillChange: false,
    //公司行业
    companyList: [],
    cTV: '', //用于暂存数据
    tradeTypeName: '',
    ctid: 'H001',
    isIndChang: false,
    //上一次存入缓存的工作经验的数据
    storageDate: [],
    id_Code: '', //流程标识
    isEmpty: false, //控制是否显示预装的值
    isShowModel: false // 判断弹出层是否弹起
  },

  // 
  close_companyType: function(e) {
    if (e.detail.isShowModal == false) {
      this.setData({
        isShowModel: false
      });
    }
  },
  close_jobType: function(e) {
    if (e.detail.isShowModal == false) {
      this.setData({
        isShowModel: false
      });
    }
  },
  close_Skill: function(e) {
    if (e.detail.isShowModal == false) {
      this.setData({
        isShowModel: false
      });
    }
  },

  //公司行业
  companyType: function(e) {
    let _that = this;
    _that.modal_companyType.showModal();
    _that.setData({
      isShowModel:true
    });
  },

  selectedItem: function(e) {
    let _that = this;
    let index = e.currentTarget.dataset.id; //当前点击的元素的id
    let value = e.currentTarget.dataset.text; //当前元素的内容
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
    this.setData({
      tradeTypeName: this.data.cTV,
      tradeTypeId: this.data.ctid,
      isIndChang: true,
    });
    this.modal_companyType.closeModal();
  },

  //职业类型
  jobType: function(e) {
    let _that = this;
    _that.modal_jobType.showModal();
    _that.setData({
     isShowModal:true
    });
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
    let value = e.currentTarget.dataset.text;
    _that.setData({
      jobCheck: index,
      jtv: value,
    });
  },

  //关闭和提交职位类型
  cancel_job: function(e) {
    this.modal_jobType.closeModal();
  },

  comfirmDate_job: function(e) {
    this.setData({
      jobThreeName: this.data.jtv,
      jobThreeId: this.data.jobCheck,
      isJobChang: true,
    });
    this.modal_jobType.closeModal();
  },

  //技能标签
  skillTag: function(e) {
    let _that = this;
    _that.modal_skill.showModal();
    _that.setData({
      isShowModal: true
    });
  },

  //选择一个或者多个技能标签
  selectSkill: function(e) {
    let _that = this;
    let skv = _that.data.skv;
    let index = e.currentTarget.dataset.id;
    let lid = e.currentTarget.dataset.lid;
    let item = _that.data.skillList[index];
    //新增值
    //如果被点击的项之前没有被选中,则视为新增
    if (item.isSelected == false) {
      item.isSelected = true;
      skv.push({
        'name': e.currentTarget.dataset.text,
        'id': lid
      });
      _that.setData({
        skv: skv
      });
    } else {
      //如果被点击的项之前就已经被选中，则视为删除
      item.isSelected = false;
      let value = e.currentTarget.dataset.text;
      skv.splice((index - 1), 1);
      _that.setData({
        skv: skv
      });
    }
    _that.setData({
      skillList: _that.data.skillList
    });
  },

  //关闭和提交模态框 skillV
  cancel_sk: function(e) {
    this.modal_skill.closeModal();
  },

  comfirmDate_sk: function(e) {
    this.setData({
      skillV: this.data.skillV,
      isSkillChange: true,
      skvList: this.data.skv
    });
    this.modal_skill.closeModal();
  },

  //参加工作时间
  startChange: function(e) {
    console.log(e)
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
        rangelength: '公司名称长度应2-10个字符以内'
      }
    };
    this.WxValidate = new WxValidate(rules, ruleMsg);
  },

  //提交表单
  workTagForm: function(e) {
    let _that = this;
    //验证合法性
    if (!_that.WxValidate.checkForm({
        'companyName': e.detail.value.companyName
      })) {
      const error = this.WxValidate.errorList[0];
      _that.showError(error);
      return false;
    }
    //提取数据
    let skillId = [];
    let skillName = [];
    if (_that.data.skvList != null) {
      skillId = _that.data.skvList.map(item => {
        return item.id;
      });
    }

    //组装数据
    let storageList = [];
    _that.setData({
      // 获取用户在添加页面所填写的工作经验数据
      storageDate: wx.getStorageSync('registerJson') == undefined ? [] : wx.getStorageSync('registerJson')
    });
    let newDate = {
      'companyName': e.detail.value.companyName,
      'jobThreeId': _that.data.jobThreeId == undefined ? _that.data.re_JobThreeId : _that.data.jobThreeId,
      'jobContent': e.detail.value.workContent,
      'tradeTypeId': _that.data.tradeTypeId == undefined ? _that.data.re_TradeTypeId : _that.data.tradeTypeId,
      'skillLabelId': skillId,
      'startTime': e.detail.value.startTime == '' ? _that.data.re_StartTime : e.detail.value.startTime,
      'endTime': e.detail.value.endTime == '' ? _that.data.re_EndTime : e.detail.value.endTime,
      //用于前端取值，在后台忽略
      'workExperienceId': _that.data.jobId == '' ? Math.random().toString(36).substr(2, 15) : _that.data.jobId, //唯一标识，用于前端辨识
      'jobThreeName': _that.data.jobThreeName == '' ? _that.data.re_JobThreeName : _that.data.jobThreeName,
      'tradeTypeName': _that.data.tradeTypeName == '' ? _that.data.re_TradeTypeName : _that.data.tradeTypeName,
      're_skillLabelList': _that.data.skvList
    };
    // debugger;
    // console.log(newDate)
    // return false;
    let oldDate = _that.data.storageDate.workExperienceList == undefined ? [] : _that.data.storageDate.workExperienceList;
    if (_that.data.id_Code == 'register' && _that.data.jobId == '') {
      // 注册流程新增数据
      if (oldDate != "") { //判断用户是否是第一次填写数据
        oldDate.push(newDate);
        _that.data.storageDate.workExperienceList = oldDate;
        wx.setStorageSync('registerJson', _that.data.storageDate);
      } else {
        storageList.push(newDate);
        _that.data.storageDate.workExperienceList = storageList;
        wx.setStorageSync('registerJson', _that.data.storageDate);
      }
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        success: function(res) {
          wx.redirectTo({
            url: '../thirdPage/jobExp?key=register',
          });
        }
      });
    } else if (_that.data.id_Code == 'register' && _that.data.jobId != '') {
      // 注册流程修改数据
      // 根据 标识找到对应的数据
      let target = oldDate.find(function(obj) {
        return obj.workExperienceId === _that.data.jobId
      });

      // 更新目标数据
      target.companyName = newDate.companyName;
      target.jobThreeId = newDate.jobThreeId == '' ? target.jobThreeId : newDate.jobThreeId;
      target.jobThreeName = newDate.jobThreeName == '' ? target.jobThreeName : newDate.jobThreeName;
      target.jobContent = newDate.jobContent;
      target.tradeTypeId = newDate.tradeTypeId == '' ? target.tradeTypeId : newDate.tradeTypeId;
      target.tradeTypeName = newDate.tradeTypeName == '' ? target.tradeTypeName : newDate.tradeTypeName;
      target.startTime = newDate.startTime == '' ? target.startTime : newDate.startTime;
      target.endTime = newDate.endTime == '' ? target.endTime : newDate.endTime;
      target.skillLabelId = newDate.skillLabelId;
      target.re_skillLabelList = newDate.re_skillLabelList;
      // debugger;
      oldDate.find(function(obj) {
        if (obj.workExperienceId === _that.data.jobId) {
          obj = target;
        }
      });
      wx.setStorageSync('registerJson', _that.data.storageDate);
      wx.showToast({
        title: '更新成功',
        icon: 'success',
        success: function(res) {
          wx.redirectTo({
            url: '../thirdPage/jobExp?key=register',
          });
        }
      });
    } else if (_that.data.id_Code == 'update' && _that.data.jobId != '') {
      // 更新流程
      // 更新这段数据
      wx.request({
        url: url + 'workExperience/updateWorkExperience.json',
        method: 'POST',
        data: JSON.stringify(newDate),
        header: {
          // 'content-type': 'application/x-www-form-urlencoded',
          'content-type': 'application/json',
        },
        success: res => {
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

  //关于表单验证的弹窗提示
  showError: function(error) {
    wx.showModal({
      content: error.msg,
      showCancel: true
    });
  },

  //获取初始化信息
  onLoad: function(option) {
    let _that = this,
      skillList = [],
      companyList = [],
      nowTime = util.formatTime(new Date());
    // 获取系统当时间
    let id_Code = option.key; // 获取流程标识 register / update
    let jobId = option.jobId == undefined ? '' : option.jobId; // 获取条目的ID
    _that.setData({
      id_Code: id_Code,
      jobId: jobId,
      endDay: nowTime,
    });

    if (id_Code == 'register' && jobId != '') {
      // 在注册流程中，用户想要再次查看填写完成的项目
      let sdata = wx.getStorageSync('registerJson').workExperienceList;
      let target = sdata.find(function(obj) {
        return obj.workExperienceId === jobId
      });
      // 通过之前添加的 checkToken 获取到 存于storage中的数据
      _that.setData({
        isEmpty: true,
        're_CompanyName': target.companyName,
        're_TradeTypeId': target.tradeTypeId,
        're_TradeTypeName': target.tradeTypeName,
        're_JobThreeId': target.jobThreeId,
        're_JobThreeName': target.jobThreeName,
        're_StartTime': target.startTime,
        're_EndTime': target.endTime,
        're_workContent': target.jobContent,
        'skvList': target.re_skillLabelList
      });
    } else if (id_Code == 'update' && jobId != '') {
      wx.showLoading({
        title: 'Loding...',
      });
      wx.request({
        url: url + 'workExperience/getWorkExperience.json',
        method: 'POST',
        data: {
          'workExperienceId': jobId
        },
        success: res => {
          //从数据库获得相应数据
          let target = res.data.data;
          _that.setData({
            isEmpty: true,
            're_CompanyName': target.companyName,
            're_TradeTypeId': target.tradeTypeId,
            're_TradeType': target.tradeTypeName,
            're_jobThreeId': target.jobThreeId,
            're_JobType': target.jobThreeName,
            're_StartTime': target.startTime,
            're_EndTime': target.endTime,
            're_workContent': target.jobContent,
            'skvList': target.skillLabelList
          });
          wx.hideLoading();
        }
      });
    }

    //装载验证规则
    this.initValidate();

    //初始化弹窗
    _that.modal_companyType = _that.selectComponent('#modal_companyType');
    _that.modal_jobType = _that.selectComponent('#modal_jobType');
    _that.modal_skill = _that.selectComponent('#modal_skill');


    //装填职业类型
    dateList.getJobDate(function(arr) {
      allJobDate = arr;
      getJobFFData(_that);
    });

    //装填公司行业
    dateList.getIndustryDate(function(indArr) {
      companyList = indArr;
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