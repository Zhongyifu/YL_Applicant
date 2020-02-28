const app = getApp();
const url = app.globalData.baseUrl;
const dateList = require('../../../utils/job.js');
const utilFun = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    workList: [],
    // 是否显示跳过按钮，注册流程
    isRegister: true,
    //是否存在已经填好的工作经验
    isEmpty: false,
    btnText: '完成注册',
  },

  //求职
  statusChange: function(e) {
    let _that = this;
    let myStateList = _that.data.myStateList;
    _that.setData({
      myStateIndex: e.detail.value,
      myStateId: myStateList[e.detail.value].typeId,
      myStateName: myStateList[e.detail.value].typeName,
      isStatusChange: true
    });
    wx.setStorage({
      key: 'myState',
      data: e.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _that = this;
    wx.getStorage({
      key: 'wechat_session',
      complete: function(res) {
        let sessionId = res.data.sessionId;
        let id_Code = options.key;
        // let id_Code = 'update';
        //装载求职状态
        dateList.getJobStatusType(function(arr) {
          _that.setData({
            myStateList: arr,
          });
          // 获取填好的求职状态
          wx.getStorage({
            key: 'myState',
            complete: function(result) {
              if (result.data != null && result.data != '') {
                _that.setData({
                  isStatusChange: true,
                  myStateIndex: result.data,
                  myStateId: arr[result.data].typeId,
                });
              } else {
                _that.setData({
                  isStatusChange: false
                });
              }
            },
          });
        });
        _that.setData({
          id_Code: id_Code,
          sessionId: sessionId
        });
        if (id_Code == 'update') {
          // 当前用户已经添加的工作经验
          wx.showLoading({
            title: 'Loading...',
          });
          wx.request({
            url: url + 'jobIntention/findList.json',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Cookie': 'JSESSIONID=' + sessionId
            },
            success: res => {
              console.log(res.data.data)
              _that.setData({
                workList: res.data.data,
                isEmpty: false,
                btnText: '保存',
                isRegister: false
              });
              wx.hideLoading();
            },
            fail: res => {
              _that.setData({
                isEmpty: true
              });
            }
          });
        } else if (id_Code == 'register') {
          // 获取用户在添加页面所填写的工作经验数据
          let storageDate = [];
          storageDate = wx.getStorageSync('registerJson').jobIntentionList;
          if (storageDate == undefined) {
            storageDate = [];
            _that.setData({
              isEmpty: true
            });
          } else {
            _that.setData({
              isEmpty: false,
            });
          }
          _that.setData({
            workList: storageDate,
            btnText: '完成注册',
            isRegister: true
          });
        } else {
          wx.showToast({
            title: '流程标识为空',
            icon: 'success'
          });
        }
      },
    })
  },

  //完成注册
  sendDate: function(e) {
    let idCode = this.data.id_Code;
    if (this.data.myStateId == undefined) {
      wx.showModal({
        title: '警告',
        content: '请填写求职状态!',
      });
      return false;
    }
    if (idCode == 'register') {
      let formJson = wx.getStorageSync('registerJson');
      formJson.jobStatusTypeId = this.data.myStateId;
      wx.request({
        url: url + 'register/updateApplicantInfo.json',
        method: 'POST',
        data: JSON.stringify(formJson),
        header: {
          'content-type': 'application/json',
          'Cookie': 'JSESSIONID=' + this.data.sessionId,
        },
        success: function(res) {
          if (res.data.status == 10000) {
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              success: function(res) {
                wx.removeStorage({
                  key: 'registerJson',
                  success: function(res) {
                    //2.发起请求重新登录
                    wx.login({
                      success: res => {
                        wx.request({
                          url: url + 'login/miniProgramcLogin.json',
                          data: {
                            'code': res.code
                          },
                          success: res => {
                            let storageData = {
                              'uuid': utilFun.setUUID(),
                              'sessionId': res.data.data.sessionId
                            };
                            wx.setStorageSync('wechat_session', storageData);
                            wx.switchTab({
                              url: '../../tabBarPage/tab_JobList/tab_JobList',
                            });
                          }
                        });
                      }
                    });
                  },
                })
              }
            });
          }
        }
      });
    } else if (idCode == 'update') {
      //更新流程,返回到更新入口的页面
      wx.switchTab({
        url: '../../tabBarPage/tab_Myinfo/tab_Myinfo',
      });
    }
  },
})