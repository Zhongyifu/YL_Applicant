// pages/tab_Company/tab_Company.js
const app = getApp();
const url = app.globalData.baseUrl;
const utilFun = require('../../../utils/util.js');
Page({
  data: {
    upImg_FI: '../../../images/order_up.png',
    upImg_SC: '../../../images/order_up.png',
    upImg_IN: '../../../images/order_up.png',
    downImg_FI: '../../../images/order_down.png',
    downImg_SC: '../../../images/order_down.png',
    downImg_IN: '../../../images/order_down.png',
    // status_finance: false,
    // status_scale: false,
    // status_industry: false,

    companyList: [],
    isEmpty: false,
    pageStart: 1,
    isModalShow:false,
    //设定部分默认值
    searchValue: '',
    fck: 0,
    sck: '',
    lck: ''
  },
  //调用组件中定义的关闭弹窗的方法，
  //当弹窗关闭时，修改搜索栏的图标
  close_Financing: function(e) {
    if (e.detail.isShowModal == false) {
      this.setData({
        status_finance: false,
        isModalShow:false
      });
    }
  },
  close_Scale: function(e) {
    if (e.detail.isShowModal == false) {
      this.setData({
        status_scale: false,
        isModalShow: false
      });
    }
  },
  close_Industry: function(e) {
    if (e.detail.isShowModal == false) {
      this.setData({
        status_industry: false,
        isModalShow: false
      });
    }
  },

  changeIcon: function(p1) { //变换图标地址
    let _that = this;
    switch (p1) {
      case 'financing':
        _that.modal_Scale.closeModal();
        _that.modal_Industry.closeModal();
        if (!_that.data.status_finance) {
          _that.modal_Financing.showModal();
          _that.setData({
            status_finance: true,
            isModalShow: true
          });
        } else {
          _that.modal_Financing.closeModal();
          _that.setData({
            financingIcon: false
          });
        }
        break;
      case 'scale':
        _that.modal_Industry.closeModal();
        _that.modal_Financing.closeModal();
        if (!_that.data.status_scale) {
          _that.setData({
            status_scale: true,
            isModalShow: true
          });
          _that.modal_Scale.showModal();
        } else {
          _that.setData({
            status_scale: false
          });
          _that.modal_Scale.closeModal();
        }
        break;
      case 'industry':
        _that.modal_Scale.closeModal();
        _that.modal_Financing.closeModal();
        if (!_that.data.status_industry) {
          _that.setData({
            status_industry: true,
            isModalShow: true
          });
          _that.modal_Industry.showModal();
        } else {
          _that.setData({
            status_industry: false
          });
          _that.modal_Industry.closeModal();
        }
        break;
    }
  },

  //传入参数，进行搜索
  searchFun: function() {
    let _that = this;
    let itext = _that.data.searchValue;
    let financing = _that.data.fck;
    let scale = _that.data.sck;
    let industry = _that.data.lck;
    let pageStart = _that.data.pageStart
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId;
        wx.showLoading({
          title: '加载中...',
        });
        wx.request({
          url: url + 'companyInfo/findCompanyList.json',
          method: 'POST',
          data: {
            'companyName': itext,
            'isListedCompanies': financing,
            'companySizeTypeId': scale,
            'companyTradeTypeId': industry,
            'pageStart': pageStart,
            'rows': 5
          },
          header: {
            'Cookie': 'JSESSIONID=' + sessionId
          },
          success: res => {
            if (res.data.data.list == '' && _that.data.pageStart == 1) {
              _that.setData({
                companyList: res.data.data.list,
                isEmpty: true
              });
            } else if (res.data.data.list != '' && _that.data.pageStart == 1) {
              _that.setData({
                companyList: []
              });
              let resList = _that.data.companyList.concat(res.data.data.list);
              let newResList = utilFun.distinctJSON(resList, 'companyId');
              _that.setData({
                companyList: _that.isFollowSrc(newResList),
                isEmpty: false
              });
            } else if (res.data.data.list != '' && _that.data.pageStart != 1) {
              let resList = _that.data.companyList.concat(res.data.data.list);
              let newResList = utilFun.distinctJSON(resList, 'companyId');
              _that.setData({
                companyList: _that.isFollowSrc(newResList),
                isEmpty: false
              });
            } else {
              // res.data.data.list == '' && _that.data.pageStart != 1
              // 当第二页没有数据时
            }
          },
          complete: res => {
            wx.hideLoading();
          }
        });
      },
    })
  },


  searchValue: function(e) { //装填搜索框的值
    this.setData({
      searchValue: e.detail.value
    });
  },
  searchCompany: function() { //搜索公司
    this.searchFun();
  },

  search_financing: function(e) {
    this.changeIcon('financing');
  },

  submit_Financing: function(e) {
    this.setData({
      fck: e.currentTarget.dataset.id
    });
    this.searchFun();
    this.modal_Financing.closeModal();
  },

  search_scale: function() {
    this.changeIcon('scale');
    wx.request({
      url: url + 'workingLifeType/findPersonnelSizeTypeList.json',
      method: 'POST',
      success: res => {
        this.setData({
          scale: res.data.data
        });
      }
    });
  },
  submit_Scale: function(e) {
    this.setData({
      sck: e.currentTarget.dataset.id
    });
    this.searchFun();
    this.modal_Scale.closeModal();
  },


  search_industry: function() {
    this.changeIcon('industry');
    wx.request({
      url: url + 'tradeType/findList.json',
      success: res => {
        this.setData({
          industry: res.data.data
        });
      }
    });
  },
  submit_Industry: function(e) {
    let _that = this;
    _that.setData({
      lck: e.currentTarget.dataset.id,
    });
    this.searchFun();
    this.modal_Industry.closeModal();
  },

  onShow:function(e){
    this.setData({
      pageStart:1
    });
  },
  onLoad: function(e) {
    let _that = this;
    //预加载弹窗
    _that.modal_Financing = _that.selectComponent("#modal_Financing");
    _that.modal_Scale = _that.selectComponent("#modal_Scale");
    _that.modal_Industry = _that.selectComponent("#modal_Industry");
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId;
        //预加载公司列表
        wx.showLoading({
          title: '加载中...',
        });
        wx.request({
          url: url + 'companyInfo/findCompanyList.json',
          method: 'POST',
          data: {
            'pageStart': _that.data.pageStart,
            'rows': 5
          },
          header: {
            'Cookie': 'JSESSIONID=' + sessionId
          },
          success: res => {
            let resList = res.data.data.list;
            if (resList == '' && _that.data.pageStart == 1) {
              _that.setData({
                isEmpty: true
              });
            } else {
              _that.setData({
                companyList: _that.isFollowSrc(resList),
                isEmpty: false,
                pageStart: 1
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

  //触底加载
  onReachBottom: function() {
    this.setData({
      pageStart: this.data.pageStart + 1
    });
    this.searchFun();
  },

  // 点击星号，收藏该公司
  followCompany: function(e) {
    let _that = this;
    let dataJson = _that.data.companyList;
    let companyId = e.currentTarget.dataset.did;
    let status = e.currentTarget.dataset.status;
    let index = e.currentTarget.dataset.index;
    if (status === '0') {
      // 该公司被点击前未被关注
      wx.getStorage({
        key: 'wechat_session',
        success: function(res) {
          let sessionId = res.data.sessionId;
          wx.request({
            url: url + 'applicantFocusedCompany/save.json',
            method: 'POST',
            data: {
              'companyId': companyId
            },
            header: {
              'Cookie': 'JSESSIONID=' + sessionId
            },
            success: res => {
              if (res.data.status === 10000) {
                wx.showToast({
                  title: '关注成功',
                });
                wx.setStorageSync('focusedId', res.data.data.focusedId);
                dataJson[index].focuseSrc = '../../../images/unfollow.png';
                _that.setData({
                  companyList: dataJson
                });
              }
            }
          })
        },
      })
    } else if (status === '1') {
      //该公司被点击前已经关注
      wx.getStorage({
        key: 'focusedId',
        success: function(res) {
          let focusedId = res.data;
          wx.request({
            url: url + 'applicantFocusedCompany/delete.json',
            method: 'POST',
            data: {
              'focusedId': focusedId
            },
            success: res => {
              if (res.data.status === 10000) {
                wx.showToast({
                  title: '取消关注成功',
                });
                dataJson[index].focuseSrc = '../../../images/follow.png';
                _that.setData({
                  companyList: dataJson
                });
              }
            }
          })
        },
      })
    }
  },

  // 区分已关注和为关注的公司
  isFollowSrc: function(dataList) {
    let _that = this;
    let resList = dataList;
    for (let i = 0; i < resList.length; i++) {
      if (resList[i].isFocused === '1') {
        resList[i].focuseSrc = '../../../images/unfollow.png';
      } else if (resList[i].isFocused === '0') {
        resList[i].focuseSrc = '../../../images/follow.png';
      }
    }
    return resList;
  },

});