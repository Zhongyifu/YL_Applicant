// pages/tab_Myinfo.js
var app = getApp();
const url = app.globalData.baseUrl;
Page({
  data: {
    isRegister: false,
    myinfoData: ''
  },
  //跳转到注册页面
  nvaToRegister: function(e) {
    wx.navigateTo({
      url: '../../register/firstPage/register',
    })
  },
  onShow: function(options) {
    let _that = this;
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId
        wx.request({
          url: url + 'applicantInfo/getMineInfo.json',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': 'JSESSIONID=' + sessionId
          },
          success(res) {
            let myinfoData = res.data.data;
            _that.setData({
              myinfoData: myinfoData
            });
          }
        });
      },
    })
  },
  // 我的简历
  toMyResume:function(e){
    wx.switchTab({
      url: '../tab_Resume/tab_Resume',
    })
  },
  // 沟通过
  toLinkUp:function(e){
    wx.navigateTo({
      url: '../../tabDetails/tabMyInfo_JobList/tabMyInfo_JobList?key=linkUp',
    })
  },
  // 面试
  toInterview:function(e){
    wx.navigateTo({
      url: '../../tabDetails/tabMyInfo_Interview/tabMyInfo_Interview',
    })
  },
  // 投递
  toDeliver:function(e){
    wx.navigateTo({
      url: '../../tabDetails/tabMyInfo_JobList/tabMyInfo_JobList?key=deliver',
    })
  },
  // 感兴趣 
  toInterested:function(e){
    wx.navigateTo({
      url: '../../tabDetails/tabMyInfo_JobList/tabMyInfo_JobList?key=interested',
    })
  },
  // 我的简历
  toMyResume: function(e) {
    wx.switchTab({
      url: '../../tabBarPage/tab_Resume/tab_Resume',
    })
  },
  // 管理求职意向
  jobIntention: function(e) {
    wx.navigateTo({
      url: '../../register/sixthPage/workTag?key=update',
    })
  },
  // 关注公司
  focuseCompany:function(e){
    wx.navigateTo({
      url: '../../tabDetails/tabMyInfo_ComList/tabMyInfo_ComList',
    })
  },
})