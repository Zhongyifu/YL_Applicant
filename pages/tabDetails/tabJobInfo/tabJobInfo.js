// pages/tabDetails/tabJobInfo.js
const app = getApp();
const url = app.globalData.baseUrl;
Page({

  data: {
    dataList: {}, //关于该职位的所以数据的集合

    jobIntroduce: [], // 任职要求
    jobSkill: [], //职位的技能要求，
    jobWelfare: [], //公司福利
    jobComIntroduce: '', //公司介绍

    //地图部分的参数
    latitude: '23.099994',
    longitude: '113.324520',
    markers: [],

    // 收藏图标
    iconSrc: '../../../images/follow.png',
  },

  onLoad: function(options) {
    let jobId = options.jobId; //传过来的职位的id 01
    // let jobId = '01';
    let _that = this;
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId;
        //通过jobId获取数据
        wx.showLoading({
          title: '加载中...',
        })
        wx.request({
          url: url + 'job/getJob.json',
          method: 'POST',
          data: {
            'jobId': jobId
          },
          header: {
            'Cookie': 'JSESSIONID=' + sessionId
          },
          success: function(res) {
            if (res.data.status == 10000) {
              _that.setData({
                jobId: jobId,
                dataList: res.data.data,
                markers: [{
                  id: 1,
                  iconPath: '../../../images/makerIcon.png',
                  latitude: res.data.data.latitude, //地图 经度
                  longitude: res.data.data.longitude, //地图 纬度
                  width: 30,
                  height: 30
                }],
              });
              if (res.data.data.isInterested === '1') {
                _that.setData({
                  iconSrc: '../../../images/unfollow.png'
                });
              } else if (res.data.data.isInterested === '0') {
                _that.setData({
                  iconSrc: '../../../images/follow.png'
                });
              }
            } else {
              wx.showModal({
                title: '提示',
                content: '信息获取出错，请重新进入页面',
              });
            }
          },
          complete: function() {
            wx.hideLoading();
          }
        });
      }
    });
  },

  goToMessage: function(e) {
    wx.navigateTo({
      url: '../messageInfo/messageInfo?jobId=' + this.data.jobId + '&hrId=' + this.data.dataList.recruiterId,
    })
  },

  followJob: function(e) {
    let _that = this;
    let jobId = _that.data.jobId;
    wx.getStorage({
      key: 'wechat_session',
      success: function(res) {
        let sessionId = res.data.sessionId;
        // 判断是收藏还是取消收藏
        let status = e.currentTarget.dataset.status;
        if (status === '0') {
          // 被点击的项当前未被收藏
          wx.request({
            url: url + 'jobInterested/saveJobInterested.json',
            method: 'POST',
            data: {
              'jobId': jobId
            },
            header: {
              'Cookie': 'JSESSIONID=' + sessionId
            },
            success: res => {
              if (res.data.status === 10000) {
                wx.showToast({
                  title: '收藏成功',
                });
                _that.setData({
                  iconSrc: '../../../images/unfollow.png'
                });
                wx.setStorageSync('jobInterestedId', res.data.data.jobInterestedId);
              }
            }
          });
        } else if (status === '1') {
          wx.getStorage({
            key: 'jobInterestedId',
            success: function(res) {
              let jobInterestedId = res.data;
              wx.request({
                url: url + 'jobInterested/delete.json',
                method: 'POST',
                data: {
                  'jobInterestedId': jobInterestedId
                },
                success: res => {
                  console.log(res)
                  if (res.data.status === 10000) {
                    wx.showToast({
                      title: '取消收藏成功',
                    });
                    _that.setData({
                      iconSrc: '../../../images/follow.png'
                    });
                  }
                }
              });
            },
          });
        }
      },
    })
  }

});