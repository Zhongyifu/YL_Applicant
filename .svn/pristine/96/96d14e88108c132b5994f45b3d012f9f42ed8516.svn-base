// pages/tabDetails/tabJobInfo.js
Page({

  data: {
    dataList: [], //关于该职位的所以数据的集合
    jobIntroduce: [], // 任职要求
    jobSkill: [], //职位的技能要求，
    jobWelfare: [], //公司福利
    jobComIntroduce: '', //公司介绍

    //地图部分的参数
    latitude: '23.099994', 
    longitude: '113.324520', 
    markers: [{
      iconPath: '../../../images/makerIcon.png',
      id: 1,
      latitude: 23.099994,  //地图 经度
      longitude: 113.324520, //地图 纬度
      width: 30,
      height: 30
    }],
  },

  onLoad: function(options) {
    let jobId = options.jobId; //传过来的职位的id
    let _that = this;
    //通过jobId获取数据
    wx.request({
      url: '',
      data: {
        'jobId': jobId
      },
      success: function(res) {
        if (res.status == 200) {
          //装填各项的值 ...
          _that.data.dataList = res.data;
          _that.data.jobIntroduce = res.data.jobIntroduce;
        } else {
          wx.showModal({
            title: '提示',
            content: '信息获取出错，请重新进入页面',
          });
        }
      }
    });
  },

});