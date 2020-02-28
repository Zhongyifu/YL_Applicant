const app = getApp();
const url = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eduExpList: [],
    id_Code: "",
    btnText: '下一步',
    // 是否显示跳过按钮，注册流程
    isRegister: true,
    //是否存在已经填好的工作经验
    isEmpty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _that=this;
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId;
        let id_Code = options.key;
        _that.setData({
          id_Code: id_Code,
          sessionId: sessionId
        });
        if (id_Code == 'update') {
          // 当前用户已经添加的工作经验
          wx.request({
            url: url + 'educationExperience/getEducationExperienceList.json',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Cookie': 'JSESSIONID=' + sessionId
            },
            success: res => {
              _that.setData({
                eduExpList: res.data.data,
                isEmpty: false,
                btnText: '保存',
                isRegister: false
              });
            },
            fail: res => {
              _that.setData({
                isEmpty: true
              });
            }
          });
        } else {
          // 获取用户在添加页面所填写的工作经验数据
          let storageDate = [];
          // wx.clearStorageSync() //用于清空数据
          storageDate = wx.getStorageSync('registerJson').educationExperienceList;
          if (storageDate == undefined) {
            storageDate = [];
            _that.setData({
              isEmpty: true
            });
          } else {
            _that.setData({
              isEmpty: false
            });
          }
          _that.setData({
            eduExpList: storageDate,
            btnText: '下一步',
            isRegister: true
          });
        }
      },
    })
  },

  //下一页或者保存
  nextTap: function(e) {
    let _that = this;
    if (_that.data.isRegister == true) {
      //注册流程
      if (_that.data.eduExpList == []) {
        wx.showModal({
          title: '提示',
          content: '您还未填写一份教育经验，确定要前往下一页吗？',
          success: res => {
            if (res.confirm) {
              wx.navigateTo({
                url: '../fifthPage/myAdv?key=register',
              });
            }
          }
        })
      } else {
        wx.navigateTo({
          url: '../fifthPage/myAdv?key=register',
        });
      }
    } else {
      //更新流程,返回到更新入口的页面
      wx.navigateTo({
        // url: '',
      });
    }
  },
})