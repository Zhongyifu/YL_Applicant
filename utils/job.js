const app = getApp();
const url = app.globalData.baseUrl;

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

module.exports = {
  'getJobDate': getJobDate,
  'getIndustryDate': getIndustryDate,
  'getSkillDate': getSkillDate
}