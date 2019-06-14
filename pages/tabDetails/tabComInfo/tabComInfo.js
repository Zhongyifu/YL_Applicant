// pages/tabDetails/tabComInfo/tabComInfo.js
Page({
  data: {
    //公司介绍
    isCheckText: {
      status: false,
      tip: '查看全文'
    },
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

  onReady() {
    const query = wx.createSelectorQuery()
    let self = this
    query.select(".comInfoText").boundingClientRect(function(res) {
      const lineHeight = 18
      const height = res.height
      const status = "isCheckText.status"
      self.setData({
        [status]: height / lineHeight > 3
      })
    }).exec()
  },


  //公司介绍，点击查看全文
  showMoreText() {
    const status = this.data.isCheckText.status
    this.setData({
      isCheckText: {
        status: !status,
        tip: status ? '收起' : '查看全文'
      }
    })
  },

  // 跳转前往 该公司的招聘职位列表
  getJobList: function(e) {
    let _that=this;
    wx.navigateTo({
      url: '',
    })
  },
})