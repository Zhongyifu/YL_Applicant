// pages/tab_JobList.js
const app = getApp();
const url = app.globalData.baseUrl;
const utilFun = require('../../../utils/util.js');
Page({
  data: {
    status_TJ: false,
    status_DZ: false,
    status_YQ: false,

    upImg_TJ: '../../../images/order_up.png',
    upImg_DZ: '../../../images/order_up.png',
    upImg_YQ: '../../../images/order_up.png',

    downImg_TJ: '../../../images/order_down.png',
    downImg_DZ: '../../../images/order_down.png',
    downImg_YQ: '../../../images/order_down.png',

    re_value: '推荐',
    address_value: '全国',
    jobList: [],
    isEmpty: false,
    pageStart: 1,
    //设定部分默认值
    rck: '1',
    isModalShow:false,
  },

  //调用组件中定义的关闭弹窗的方法，
  //当弹窗关闭时，修改搜索栏的图标
  close_Recent:function(e){
    if (e.detail.isShowModal == false) {
      this.setData({
        status_TJ: false,
        isModalShow:false
      });
    }
  },
  close_Address:function(e){
    if (e.detail.isShowModal == false) {
      this.setData({
        status_DZ: false,
        isModalShow: false
      });
    }
  },
  close_Require:function(e){
    if (e.detail.isShowModal == false) {
      this.setData({
        status_YQ: false,
        isModalShow: false
      });
    }
  },

  //变换图标地址
  changeIcon: function(p1) {
    let _that = this;
    switch (p1) {
      case 'recent':
        _that.modal_Address.closeModal();
        _that.modal_Require.closeModal();
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
      case 'address':
        _that.modal_Require.closeModal();
        _that.modal_Recent.closeModal();
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
      case 'require':
        _that.modal_Address.closeModal();
        _that.modal_Recent.closeModal();
        if (_that.data.status_YQ) {
          _that.setData({
            status_YQ: false
          });
          _that.modal_Require.closeModal();
        } else {
          _that.setData({
            status_YQ: true,
            isModalShow: true
          });
          _that.modal_Require.showModal();
        }
        break;
    }
  },

  //传入参数，进行搜索
  searchFun: function() {
    let _that = this;
    let itext = _that.data.searchValue;
    let recent = _that.data.searchRecent;
    let address = _that.data.dck;
    let require_Exp = _that.data.expId;
    let require_salary = _that.data.saId;
    let require_jobThree = _that.data.jobId;
    let pageStart = _that.data.pageStart;
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: url + 'job/findListByJobParamDO.json',
      method: 'POST',
      data: {
        'companyId': _that.data.companyId,
        'jobName': itext,
        'recommended': recent,
        'districtId': address,
        'workingLifeTypeId': require_Exp,
        'salaryRangeTypeId': require_salary,
        'jobThreeId': require_jobThree,
        'pageStart': pageStart,
        'rows': 5
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

  //装填搜索的值
  searchValue: function(e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  orderByRecent: function(e) {
    this.changeIcon('recent');
  },

  orderByAddress: function(e) {
    this.changeIcon('address');
  },

  orderByReq: function(e) {
    let _that = this;
    _that.changeIcon('require');
    //1
    wx.request({
      url: url + 'workingLifeType/findWorkingLifeList.json',
      method: 'POST',
      success: res => {
        _that.setData({
          experienceList: res.data.data
        });
      }
    });
    //2
    wx.request({
      url: url + 'salaryRangeType/findList.json',
      success: res => {
        _that.setData({
          salaryList: res.data.data
        });
      }
    });
    //3.获取公司存在的职位类型
    wx.request({
      url: url + 'jobDataOne/getJobDataThreeByCompany.json',
      method: 'POST',
      data: {
        'companyId': _that.data.companyId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: res => {
        _that.setData({
          jobThreeList: res.data.data
        });
      }
    });
  },

  //搜索公司
  searchJob: function() {
    this.searchFun();
  },

  search_Recent: function(e) {
    this.setData({
      searchRecent: e.currentTarget.dataset.id
    });
    this.searchFun();
    this.modal_Recent.closeModal();
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
          pck: pid
        });
      }
    })
  },
  //根据市级id查询对应的县级信息
  checkDistrct: function(e) {
    let _that = this;
    let cid = e.currentTarget.dataset.id;
    wx.request({
      url: url + 'chinaProvince/getDistrictList.json',
      method: 'POST',
      data: {
        'cityId': cid
      },
      success: res => {
        _that.setData({
          disList: res.data.data,
          cck: cid
        });
      }
    })
  },
  //点击县级数据组装数据
  checkedDis: function(e) {
    let _that = this;
    let did = e.currentTarget.dataset.id;
    let dText = e.currentTarget.dataset.text;
    _that.setData({
      dck: did,
      address_value: dText
    });
  },
  //按工作地点搜索
  submit_Address: function(e) {
    this.searchFun();
    this.modal_Address.closeModal();
  },

  checkExp: function(e) {
    this.setData({
      expId: e.currentTarget.dataset.id
    });
  },
  checkSalary: function(e) {
    this.setData({
      saId: e.currentTarget.dataset.id
    });
  },
  checkJob: function(e) {
    this.setData({
      jobId: e.currentTarget.dataset.id
    });
  },
  submit_Require: function(e) {
    this.searchFun();
    this.modal_Require.closeModal();
  },


  onLoad: function(e) {
    let _that = this;
    _that.modal_Recent = _that.selectComponent("#modal_Recent");
    _that.modal_Address = _that.selectComponent("#modal_Address");
    _that.modal_Require = _that.selectComponent("#modal_Require");
    //根据传过来的公司id 查询数据
    let companyId = e.cId;
    // let companyId = '01';
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: url + 'job/findListByJobParamDO.json',
      method: 'POST',
      data: {
        'companyId': companyId,
        'pageStart': 1,
        'rows': 5
      },
      success: res => {
        _that.setData({
          jobList: res.data.data.list,
          companyId: companyId
        });
        wx.hideLoading();
      }
    })
    //预加载省市数据
    wx.request({
      url: url + 'chinaProvince/getProvinceList.json',
      success: res => {
        _that.setData({
          proList: res.data.data
        });
      }
    });
  },

  //触底加载
  onReachBottom: function() {
    let _that = this;
    _that.setData({
      pageStart: _that.data.pageStart + 1
    });
    this.searchFun();
  }
})