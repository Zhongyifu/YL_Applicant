let dateList = require('../../../utils/job.js'),
  //期望职业
  allJobDate = [],
  jobFFs = [],
  jobSFs = [],
  jobTFs = [],
  index = [0, 0, 0],
  t = 0,
  show = false,
  moveY = 20;
const app = getApp();
const url = app.globalData.baseUrl;
Page({
  data: {
    //工作状态
    statusList: [],
    statusValue: '',
    statusItem: 0,
    isStatusChange: false,
    //期望工作地点
    placeItem: ['请选择', '请选择', '请选择'],
    placeList: '全部',
    isPlaceChange: false,
    //期望工资区间
    salaryList: [],
    salaryValue: '',
    salaryItem: 0,
    isSalaryChang: false,
    //期望工职位
    show: show,
    jobFFs: jobFFs,
    jobSFs: jobSFs,
    jobTFs: jobTFs,
    jobFFVal: '',
    value: [0, 0, 0],
    isJobChang: false,
    //期望行业
    indList: [], //后台得到的完整的数据
    industryVal: '',
    indIndex: 0,
    // indList: [], //整体的数据
    // indIndex: [0, 0], //整体的数据下标
    // indListOne: [], //一级选项的数据集合
    // indBeforTwo: [], //将原始的后台数据段中的 包含了二级选项的数据提取出来
    // indListTwo: [], //二级选项的数据集合
    isIndChang: false
  },

  //求职状态
  statusChange: function(e) {
    let _that = this;
    _that.setData({
      statusItem: e.detail.value,
      statusValue: e.currentTarget.dataset.sid,
      isStatusChange: true
    });
  },

  //工作城市
  placeChange: function(e) {
    let _that = this;
    _that.setData({
      placeItem: e.detail.value,
      isPlaceChange: true
    });
  },

  //薪资要求
  salaryChange: function(e) {
    let _that = this;
    _that.setData({
      salaryItem: e.detail.value,
      salaryValue: e.currentTarget.dataset.sid,
      isSalaryChang: true
    });
  },

  //期望职位_滑动
  bJChage: function(e) {
    let val = e.detail.value,
      _that = this;
    if (index[0] != val[0]) { // 滑动了第一列
      val[1] = 0, val[2] = 0;
      getJobSFData(val[0], _that);
      getJobTFData(val[0], val[1], _that);
    } else {
      if (index[1] != val[1]) {
        val[2] = 0;
        getJobTFData(val[0], val[1], _that); //获取第三列
      }
    }
    index = val;
    _that.setData({
      value: [val[0], val[1], val[2]],
      jobFF: jobFFs[val[0]].name,
      jobSF: jobSFs[val[1]].name,
      jobTF: jobTFs[val[2]].name,
      jobTFVal: jobFFs[val[2]].id, //后台只需要第三层的id
      isJobChang: true
    });
  },

  //期望行业
  bIndChange: function(e) {
    let _that = this;
    // let listOneIndex = e.detail.value[0]; //一级选项的下标 （分级的情况下）
    // let indIndex = e.detail.value[1]; //二级选项的下标
    // let indValue = _that.data.indBeforTwo[listOneIndex][indIndex].id;
    // _that.setData({
    //   indIndex: e.detail.value,
    //   isIndChang: true
    // });

    //在不分级的情况下
    _that.setData({
      indIndex: e.detail.value,
      industryVal: e.currentTarget.dataset.id,
      isIndChang:true
    });
  },

  // 在行业分级的情况下
  bIndCChange: function(e) {
    let _that = this;
    let data = {
      indList: _that.data.indList,
      indIndex: _that.data.indIndex,
      isIndChang: true
    }
    data.indIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0: //第一列滚动时，用第一列下标，匹配第二列的值
        for (let i = 0; i < _that.data.indListOne.length; i++) {
          if (data.indIndex[0] == i) {
            data.indList[1] = _that.data.indListTwo[i]
          }
        }
        data.indIndex[1] = 0; //每次滚动第一列时，默认第二列第一项选中
        break;
    }
    _that.setData(data);
  },

  onLoad: function() { //加载初步数据
    let _that = this,
      indList = [];
    //获取期望职位的整体后台数据
    dateList.getJobDate(function(arr) {
      allJobDate = arr;
      getJobFFData(_that);
    });

    //获取期望行业的整体后台数据
    dateList.getIndustryDate(function(indArr) {
      indList = indArr;

      // indListOne = indList.map(item => {  //在分级的情况下
      //   return item.typeName
      // }); //将原始数据中的一级选项提取出来
      // indBeforTwo = indList.map(item => {
      //   return item.child
      // }); //将原始的后台数据段中的 包含了二级选项的数据提取出来
      // indBeforTwo.forEach(item => { //循环取出二级选项
      //   indListTwo.push(item.map(indItem => {
      //     return indItem.name;
      //   }));
      // });

      //在不分级的情况下
      _that.setData({
        indList: indList
      });
    });


    //获取求职状态
    let statusList = [];
    wx.request({
      url: url + 'jobStatusType/findList.json',
      success(res) {
        statusList = res.data.data;
        _that.setData({
          statusList: statusList
        });
      }
    });

    //获取求职薪资要求
    let salaryList = [];
    wx.request({
      url: url + 'salaryRangeType/findList.json',
      success(res) {
        salaryList = res.data.data;
        _that.setData({
          salaryList: salaryList
        });
      }
    })
  },

  onReady: function() {
    let _that = this;
    _that.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    })
    _that.animation.translateY(200 + 'vh').step();
    _that.setData({
      animation: _that.animation.export(),
      show: show
    });
  },

  //提交表单
  workTagForm: function(e) {
    let _that = this,
      formValue = e.detail.value;
    let jobIntentionList = [{
      'jobTypeId': _that.data.statusValue,
      'jobThreeId': _that.data.jobTFVal,
      'tradeTypeId': _that.data.industryVal,
      'cityId': _that.data.placeItem,
      'salaryRangeTypeId': _that.data.salaryValue
    }];
    console.log(formValue)

    //提交表单
    wx.request({
      url: '',
      data: formValue,
      success: function(res) {
        if (res.status = 200) {
          wx.switchTab({
            url: '../tabBarPage/tab_JobList/tab_JobList',
          })
        }
      }
    })
  },

  //点击跳过按钮
  skipTap: function(e) {
    wx.switchTab({
      url: '../tabBarPage/tab_JobList/tab_JobList',
    })
  },

  //移动按钮点击事件
  selectJob: function(e) {
    let _that = this;
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    animationEvents(_that, moveY, show);

  },

  //隐藏弹窗浮层
  hBCancle(e) {
    let _that = this;
    moveY = 200;
    show = true;
    t = 0;
    animationEvents(_that, moveY, show);
  },

});

//过渡动画
//动画事件
function animationEvents(that, moveY, show) {
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  })
  that.animation.translateY(moveY + 'vh').step()

  that.setData({
    animation: that.animation.export(),
    show: show
  })

}

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

  //初始化调一次
  getJobSFData(0, that);
  getJobTFData(0, 0, that);
  that.setData({
    jobFF: "1/",
    jobSF: "1-1/",
    jobTF: "1-1-1",
  });
}

function getJobSFData(count, that) { //获取职位数据的第二层
  var c, num = 0;
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
    jobSF: "",
    jobSFs: jobSFs,
    value: [count, 0, 0]
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
    jobTF: "",
    jobTFs: jobTFs,
    value: [column0, column1, 0]
  })
}