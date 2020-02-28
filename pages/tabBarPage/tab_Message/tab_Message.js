const app = getApp();
const url = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    linkList: [],
    isEmpty: false,
    pageStart: 1
  },

  // 点击按钮 让全部未读消息变为已读
  allRead:function(e){
    let _that = this; 
    let dataList = _that.data.linkList;
    let target = dataList.find(item => { return item.isRead == '0'; });
    let unReadList = target.map(item => { return item.recruiterId; });
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
        wx.showLoading({
          title: '加载中...',
        });
        wx.request({
          url: url + 'recruiterInfo/getListByMessageCommunication.json',
          method: 'POST',
          data: {
            'pageStart': _that.data.pageStart,
            'rows': 5
          },
          header: {
            'Cookie': 'JSESSIONID=' + sessionId
          },
          success: res => {
            let dataJson = res.data.data.list;
            console.log(dataJson)
            if (dataJson == '') {
              _that.setData({
                isEmpty: true
              });
            } else {
              _that.setData({
                isEmpty: false
              });
            }
            _that.setData({
              linkList: dataJson
            });
          },
          complete: res => {
            wx.hideLoading();
          }
        });
      },
    });
  },
})