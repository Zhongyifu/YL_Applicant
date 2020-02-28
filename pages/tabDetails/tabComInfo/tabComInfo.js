// pages/tabDetails/tabComInfo/tabComInfo.js
const app = getApp();
const url = app.globalData.baseUrl;
Page({
  data: {
    dataList: {},
    //公司介绍
    //是否展示查看 '查看全文' 按钮
    isShowText: true,
    isTooLong: false,
    heightInfo: 50,
    // 公司照片
    comPhotoList: [
      '../../../images/hP.jpg',
      '../../../images/hP.jpg',
      '../../../images/hP.jpg',
      '../../../images/hP.jpg',
      '../../../images/hP.jpg',
      '../../../images/hP.jpg',
      '../../../images/hP.jpg',
    ],
    // 公司地址
    latitude: '23.099994',
    longitude: '113.324520',
    markers: [{
      iconPath: '../../../images/makerIcon.png',
      id: 1,
      latitude: 23.099994, //地图 经度
      longitude: 113.324520, //地图 纬度
      width: 30,
      height: 30
    }],

    // 公司工商信息
    companyAICInfo: [],
    // 工商信息-> 经营范围 查看全文
    isShowAICText: true,
    isTooLongAIC: false,
    heightAIC: 70
  },


  // 预览公司照片
  previewPhoto: function(e) {
    let _that = this;
    let srcStr = e.target.dataset.src;
    wx.previewImage({ //这里只能使用图片的网络地址，不支持本地地址
      current: srcStr,
      urls: _that.data.comPhotoList
    });
  },

  onLoad(e) {
    let _that = this;
    //获得数据
    let companyId = e.cId; //传过来的职位的id
    // let companyId = '01'; //传过来的职位的id
    wx.request({
      url: url + 'companyInfo/getCompanyInfo.json',
      method: 'POST',
      data: {
        'companyId': companyId
      },
      success: res => {
        if (res.data.status == 10000) {
          _that.setData({
            dataList: res.data.data
          });
          // 获得公司的部分工商信息
          wx.request({
            url: url + 'companyInfo/getCompanyAICInfo.json',
            method: 'POST',
            data: {
              "companyFullName": res.data.data.companyFullName
            },
            success: result => {
              if (result.data.status == 10000) {
                _that.setData({
                  companyAICInfo: result.data.data
                });
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '信息获取出错，请重新进入页面',
          });
        }
      }
    });
  },


  onReady() {
    const query = wx.createSelectorQuery();
    let self = this
    // 关于公司介绍的 文字折叠
    query.select(".comInfoText").boundingClientRect(function(res) {
      const lineHeight = 18;
      const height = res.height;
      self.setData({
        isTooLong: height / lineHeight > 3
      });
    }).exec()

    // 关于公司工商信息->经营范围 的文字折叠
    query.select('.comInfoAICText').boundingClientRect(function(result) {
      const lineHeight = 18;
      const height = result.height;
      self.setData({
        isTooLongAIC: height / lineHeight > 3
      });
    }).exec();
  },


  //公司介绍，点击查看全文
  showMoreText() {
    this.setData({
      isShowText: !this.data.isShowText,
      heightInfo: '100%'
    });
  },

  showMoreAICText() {
    this.setData({
      isShowAICText: !this.data.isShowAICText,
      heightAIC: '100%'
    });
  },

  // 跳转前往 该公司的招聘职位列表
  getJobList: function(e) {
    let _that = this;
    wx.navigateTo({
      url: '../../tabDetails/comJobList/comJobList?cId=' + this.data.dataList.companyId,
    })
  },

})