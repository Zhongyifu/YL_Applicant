const app = getApp();
const url = app.globalData.baseUrl;

//职位
function getJobDate(callBack) {
  let jobList = [];
  // ffm 第一层级的标记，sfm,第二层级的标记，tfm，第三层级的标记,level 当前数据所在的层级
  //status':200,'msg': '成功','data': { } 数据描述
  wx.request({
    url: url + 'jobDataOne/getJobDataList.json',
    method: 'POST',
    success(res) {
      jobList = res.data.data;
      callBack(jobList);
    }
  });
}

//行业
function getIndustryDate(callBack) {
  let indList = [];
  wx.request({
    url: url + 'tradeType/findList.json',
    success(res) {
      indList = res.data.data;
      callBack(indList);
    }
  });
}

//技能标签
function getSkillDate(callBack) {
  let skillList = [];
  wx.request({
    url: url + 'workSkillLabel/findList.json',
    success(res) {
      skillList = res.data.data;
      callBack(skillList);
    }
  });
}

//教育背景
function getEduList(callBack) {
  let eduList = [];
  wx.request({
    url: url + 'educationalBackgroundType/findList.json',
    success(res) {
      eduList = res.data.data;
      callBack(eduList);
    }
  });
}

//求职状态
function getJobStatusType(callBack) {
  let typeList = [];
  wx.request({
    url: url + 'jobStatusType/findList.json',
    success(res) {
      typeList = res.data.data;
      callBack(typeList);
    }
  });
}

//薪资要求
function getSalaryDate(callBack){
  let salaryList = [];
  wx.request({
    url: url + 'salaryRangeType/findList.json',
    success(res) {
      salaryList = res.data.data;
      callBack(salaryList);
    }
  });
}

//婚姻情况
function getMaritalDate(callBack){
  let maritalList = [];
  wx.request({
    url: url + 'maritalStatusType/findList.json',
    method:'POST',
    data:{},
    success(res) {
      maritalList = res.data.data;
      callBack(maritalList);
    }
  });
}

module.exports = {
  'getJobDate': getJobDate,
  'getIndustryDate': getIndustryDate,
  'getSkillDate': getSkillDate,
  'getEduList': getEduList,
  'getJobStatusType': getJobStatusType,
  'getSalaryDate': getSalaryDate,
  'getMaritalDate': getMaritalDate
}