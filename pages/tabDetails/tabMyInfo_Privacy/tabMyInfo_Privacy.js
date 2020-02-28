// pages/tabDetails/tabMyInfo_Privacy/tabMyInfo_Privacy.js\
const app = getApp();
const url = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    pageStart: 1,
    companyList: [], //已经屏蔽的公司列表
    resultList: [], // 搜索得到的列表
    resultCheckList: [], // 被选中的需要被屏蔽的公司id集合
    resultFakerList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _that = this;
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId;
        wx.request({
          url: url + 'companyInfo/getCompanyByShielded.json',
          method: 'POST',
          data: {
            "pageStart": _that.data.pageStart,
            "rows": 5
          },
          header: {
            'Cookie': 'JSESSIONID=' + sessionId
          },
          success: res => {
            _that.setData({
              companyList: res.data.data.list,
              total: res.data.data.list.length
            });
            _that.modal_AddNew = _that.selectComponent("#modal_AddNew");
          }
        })
      },
    })
  },

  deleteDate: function(e) {
    let _that = this;
    let shieldedId = e.currentTarget.dataset.sid;
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId;
        wx.showLoading({
          title: '删除中...',
        });
        wx.request({
          url: url + 'applicantShieldedCompany/delete.json',
          method: 'POST',
          data: {
            'shieldedId': shieldedId
          },
          success: res => {
            _that.onLoad();
          },
          complete: res => {
            wx.hideLoading();
          }
        })
      }
    });
  },

  addNew: function(e) {
    this.modal_AddNew.showModal();
  },

  inputFun: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  searchCompany: function(e) {
    let _that = this;
    let value = _that.data.inputValue;
    if (value == '') {
      wx.showToast({
        title: '请输入公司名称！',
        icon: 'none'
      });
      return false
    }
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
            'companyName': value,
            'pageStart': 1,
            'rows': 5
          },
          header: {
            'Cookie': 'JSESSIONID=' + sessionId
          },
          success: res => {
            console.log(res)
          },
          complete: res => {
            wx.hideLoading();
          }
        })
      },
    })
  },

  modalUpdate: function(e) {
    let _that = this;
    let rFakerl = _that.data.resultFakerList;
    let index = e.currentTarget.dataset.index; // 下标
    let item = _that.data.resultList[index]; // 根据下标得到的具体公司的信息
    let companyId = e.currentTarget.dataset.did;
    if (!item.isHide) {
      item.isHide = true;
      rFakerl.push({
        'companyId': companyId,
      });
      _that.setData({
        resultFakerList: rFakerl
      });
    } else {
      item.isHide = false;
      rFakerl.splice((index), 1);
      _that.setData({
        resultFakerList: rFakerl
      });
    }
  },

  sumbitModal: function(e) {
    let _that = this;
    let rFakerl = _that.data.resultFakerList;
    if (rFakerl == '') {
      wx.showToast({
        title: '请至少选中一家公司！',
        icon: 'none'
      });
      return false
    }
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId;
        wx.showLoading({
          title: '加载中...',
        });
        wx.request({
          url: url + 'applicantShieldedCompany/save.json',
          method: 'POST',
          data: {
            'companyIds': rFakerl,
          },
          header: {
            'Cookie': 'JSESSIONID=' + sessionId
          },
          success: res => {
            console.log(res)
          },
          complete: res => {
            wx.hideLoading();
            _that.modal_AddNew.closeModal();
          }
        })
      },
    })
  },

  cancelModal: function(e) {
    this.modal_AddNew.closeModal();
  },


})