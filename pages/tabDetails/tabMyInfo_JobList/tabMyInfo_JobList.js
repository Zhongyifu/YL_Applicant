var app = getApp();
const url = app.globalData.baseUrl;
const utilFun = require('../../../utils/util.js');
Page({
  data: {
    status_TJ: false,
    status_DZ: false,
    status_GS: false,
    status_YQ: false,

    upImg_TJ: '../../../images/order_up.png',
    upImg_DZ: '../../../images/order_up.png',
    upImg_GS: '../../../images/order_up.png',
    upImg_YQ: '../../../images/order_up.png',

    downImg_TJ: '../../../images/order_down.png',
    downImg_DZ: '../../../images/order_down.png',
    downImg_GS: '../../../images/order_down.png',
    downImg_YQ: '../../../images/order_down.png',

    jobList: [], //职位列表
    pageStart: 1, //显示的第几页
    isEmpty: false, //判断搜索结构是否为空
    isModalShow: false, //判断搜索栏是否弹起

    searchValue: '',
    //弹窗参数
    rck: 1, //recentChecked,最近推荐判断选中的参数

    orderByDZtext: "全国",
    proList: [], //全国省级数据
    cityList: [], //根据省级数据查询得到的相应市级数据
    cityName: '', //存放选中的市的名称
    ccheck: '', //控制用于搜索的后台值和是否被选中样式

    //公司搜索弹窗
    teamList: [], //团队规模
    teamSId: '', //用于搜索的id
    industryList: [], //行业
    industrySId: '',

    //要求搜索填充
    educationList: [],
    eduSId: '',
    experienceList: [],
    expSId: '',
    salaryList: [],
    sSid: '',
    isModalShow: false
  },

  //调用组件中定义的关闭弹窗的方法，
  //当弹窗关闭时，修改搜索栏的图标
  close_Recent: function(e) {
    if (e.detail.isShowModal == false) {
      this.setData({
        status_TJ: false,
        isModalShow: false
      });
    }
  },
  close_Address: function(e) {
    if (e.detail.isShowModal == false) {
      this.setData({
        status_DZ: false,
        isModalShow: false
      });
    }
  },
  close_Company: function(e) {
    if (e.detail.isShowModal == false) {
      this.setData({
        status_GS: false,
        isModalShow: false
      });
    }
  },
  close_Requirement: function(e) {
    if (e.detail.isShowModal == false) {
      this.setData({
        status_YQ: false,
        isModalShow: false
      });
    }
  },

  changeIconSrc: function(p1) { //变换图标地址
    let _that = this;
    switch (p1) {
      case 'TJ':
        _that.modal_Address.closeModal();
        _that.modal_company.closeModal();
        _that.modal_Requirement.closeModal();
        if (_that.data.status_TJ) {
          _that.setData({
            status_TJ: false
          });
          _that.modal_Recent.closeModal();
        } else {
          _that.setData({
            status_TJ: true,
            isModalShow: true
          });
          _that.modal_Recent.showModal();
        }
        break;
      case 'DZ':
        _that.modal_Recent.closeModal();
        _that.modal_company.closeModal();
        _that.modal_Requirement.closeModal();
        if (_that.data.status_DZ) {
          _that.setData({
            status_DZ: false
          });
          _that.modal_Address.closeModal();
        } else {
          _that.setData({
            status_DZ: true,
            isModalShow: true
          });
          _that.modal_Address.showModal();
        }
        break;
      case 'GS':
        _that.modal_Recent.closeModal();
        _that.modal_Address.closeModal();
        _that.modal_Requirement.closeModal();
        if (_that.data.status_GS) {
          _that.setData({
            status_GS: false
          });
          _that.modal_company.closeModal();
        } else {
          _that.setData({
            status_GS: true,
            isModalShow: true
          });
          _that.modal_company.showModal();
        }
        break;
      case 'YQ':
        _that.modal_Recent.closeModal();
        _that.modal_Address.closeModal();
        _that.modal_company.closeModal();
        if (_that.data.status_YQ) {
          _that.setData({
            status_YQ: false
          });
          _that.modal_Requirement.closeModal();
        } else {
          _that.setData({
            status_YQ: true,
            isModalShow: true
          });
          _that.modal_Requirement.showModal();
        }
        break;
    }
  },

  //传入参数进行搜索
  searchJobDataFun: function() {
    //依次为:input输入的值(jobName)，推荐的值(recommended)，按地址搜索的值(cityId)
    //团队规模的值(personnelSizeTypeId)，行业的值(tradeTypeId)
    //学历的值(educationalBackgroundTypeId)，工作经验的值(workingLifeTypeId)，工作薪资的值(salaryRangeTypeId)
    let _that = this;
    let itext = _that.data.searchValue;
    let tjText = _that.data.rck;
    let dzText = _that.data.ccheck;
    let dzText1 = _that.data.pcheck;
    let gsItem1 = _that.data.teamSId;
    let gsItem2 = _that.data.industrySId;
    let yqItem1 = _that.data.eduSId;
    let yqItem2 = _that.data.expSId;
    let yqItem3 = _that.data.sSid;
    let pageStart = _that.data.pageStart;
    let urlString = url;
    if (_that.data.code == 'linkUp') {
      urlString = urlString + 'job/getJobByCommunicationStatistics.json';
    } else if (_that.data.code == 'deliver') {
      urlString = urlString + 'job/getJobByJobDeliver.json';
    } else if (_that.data.code == 'interested') {
      urlString = urlString + 'job/getJobByJobInterested.json';
    }
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId
        wx.showLoading({
          title: '加载中',
        });
        wx.request({
          url: urlString,
          method: 'POST',
          data: {
            // 'applicantId': applicantId,
            'jobName': itext,
            'recommended': tjText,
            'provinceId': dzText1,
            'cityId': dzText,
            'personnelSizeTypeId': gsItem1,
            'tradeTypeId': gsItem2,
            'educationalBackgroundTypeId': yqItem1,
            'workingLifeTypeId': yqItem2,
            'salaryRangeTypeId': yqItem3,
            'pageStart': pageStart,
            'rows': 5
          },
          header: {
            'Cookie': 'JSESSIONID=' + sessionId
          },
          success: res => {
            if (res.data.data.list == '' && _that.data.pageStart == 1) {
              _that.setData({
                jobList: res.data.data.list,
                isEmpty: true
              });
            } else if (res.data.data.list != '' && _that.data.pageStart == 1) {
              _that.setData({
                jobList: []
              });
              let resList = _that.data.jobList.concat(res.data.data.list);
              let newResList = utilFun.distinctJSON(resList, 'jobId');
              _that.setData({
                jobList: newResList,
                isEmpty: false
              });
            } else {
              let resList = _that.data.jobList.concat(res.data.data.list);
              let newResList = utilFun.distinctJSON(resList, 'jobId');
              _that.setData({
                jobList: newResList,
                isEmpty: false
              });
            }
          },
          complete: res => {
            wx.hideLoading();
          }
        });
      },
    })
  },

  jobIntention: function() { //求职意向
    let _that = this;
    wx.showModal({
      title: '提示',
      content: '这是预留功能',
    });
  },

  searchValue: function(e) { //装填搜索框的值
    this.setData({
      searchValue: e.detail.value
    });
  },
  searchJob: function() { //搜索职位
    this.searchJobDataFun();
  },

  orderByTJ: function(e) { //根据推荐排序
    this.changeIconSrc('TJ');
  },
  //按推荐搜索
  submit_Recent: function(e) {
    let _that = this;
    _that.setData({
      rck: e.currentTarget.dataset.id
    });
    _that.searchJobDataFun();
    _that.modal_Recent.closeModal();
  },

  orderByDZ: function() { //根据地址排序
    this.changeIconSrc('DZ');
  },
  //根据省级id查询对应的市级信息
  checkCity: function(e) {
    let _that = this;
    let pid = e.currentTarget.dataset.id;
    wx.request({
      url: url + 'chinaProvince/getCityList.json',
      method: 'POST',
      data: {
        'provinceId': pid
      },
      success: res => {
        _that.setData({
          cityList: res.data.data,
          pcheck: pid
        });
      }
    })
  },
  checkSearch: function(e) {
    let _that = this;
    let cid = e.currentTarget.dataset.id;
    let cText = e.currentTarget.dataset.text;
    _that.setData({
      ccheck: cid,
      cityName: cText,
      orderByDZtext: cText
    });
  },
  //按工作地点搜索
  submit_Address: function(e) {
    this.searchJobDataFun();
    this.modal_Address.closeModal();
  },


  orderByGS: function() { //根据公司排序
    this.changeIconSrc('GS');
    //获取搜索条件
    //1
    wx.request({
      url: url + 'workingLifeType/findPersonnelSizeTypeList.json',
      method: 'POST',
      success: res => {
        this.setData({
          teamList: res.data.data
        });
      }
    });
    //3
    wx.request({
      url: url + 'tradeType/findList.json',
      success: res => {
        this.setData({
          industryList: res.data.data
        });
      }
    });
  },
  //点击各个选项时
  teamCheack: function(e) {
    this.setData({
      teamSId: e.currentTarget.dataset.id,
    });
  },
  industryCheack: function(e) {
    this.setData({
      industrySId: e.currentTarget.dataset.id
    });
  },
  submit_Company: function(e) { //按公司搜索
    this.searchJobDataFun();
    this.modal_company.closeModal();
  },

  orderByYQ: function() { //根据要求排序
    this.changeIconSrc('YQ');
    //获取搜索选项
    //1
    wx.request({
      url: url + 'educationalBackgroundType/findList.json',
      success: res => {
        this.setData({
          educationList: res.data.data
        });
      }
    });
    //2
    wx.request({
      url: url + 'workingLifeType/findWorkingLifeList.json',
      method: 'POST',
      success: res => {
        this.setData({
          experienceList: res.data.data
        });
      }
    });
    //3
    wx.request({
      url: url + 'salaryRangeType/findList.json',
      success: res => {
        this.setData({
          salaryList: res.data.data
        });
      }
    });

  },
  //点击各个选项时
  eduCheack: function(e) {
    this.setData({
      eduSId: e.currentTarget.dataset.id
    });
  },
  expCheack: function(e) {
    this.setData({
      expSId: e.currentTarget.dataset.id
    });
  },
  salaryCheack: function(e) {
    this.setData({
      sSId: e.currentTarget.dataset.id
    });
  },
  //按要求搜索
  submit_Requirement: function(e) {
    this.searchJobDataFun();
    this.modal_Requirement.closeModal();
  },

  onLoad: function(options) {
    let _that = this;
    let keyString = options.key;
    // let keyString = 'interested';
    let urlString = url;
    _that.setData({
      code: keyString
    });
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId;
        //预加载弹窗
        _that.modal_Recent = _that.selectComponent("#modal_Recent");
        _that.modal_Address = _that.selectComponent("#modal_Address");
        _that.modal_company = _that.selectComponent("#modal_company");
        _that.modal_Requirement = _that.selectComponent("#modal_Requirement");
        //预加载省市数据
        wx.request({
          url: url + 'chinaProvince/getProvinceList.json',
          success: res => {
            _that.setData({
              proList: res.data.data
            });
          }
        });
        //预装载部分职位列表
        let jobList = [];
        wx.showLoading({
          title: '加载中',
        });
        if (keyString == 'linkUp') {
          urlString = urlString + 'job/getJobByCommunicationStatistics.json';
          _that.getDateJsonFun(urlString, sessionId, 1);
        } else if (keyString == 'deliver') {
          urlString = urlString + 'job/getJobByJobDeliver.json';
          _that.getDateJsonFun(urlString, sessionId, 1);
        } else if (keyString == 'interested') {
          urlString = urlString + 'job/getJobByJobInterested.json';
          _that.getDateJsonFun(urlString, sessionId, 1);
        }
      },
    })
  },

  //触底加载
  onReachBottom: function() {
    let _that = this;
    _that.setData({
      pageStart: _that.data.pageStart + 1
    });
    this.searchJobDataFun();
  },
  //获取数据的请求
  getDateJsonFun: function(urlString, sessionId, pageStart) {
    let _that = this;
    wx.request({
      url: urlString,
      method: 'POST',
      data: {
        'pageStart': pageStart,
        'rows': 5
      },
      header: {
        'Cookie': 'JSESSIONID=' + sessionId
      },
      success: res => {
        if (res.data.data.list == '' && pageStart == 1) {
          _that.setData({
            isEmpty: true
          });
        } else {
          _that.setData({
            jobList: res.data.data.list,
            isEmpty: false
          });
        }
      },
      complete: res => {
        wx.hideLoading();
      }
    });
  }

})