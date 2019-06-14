// pages/tab_JobList.js
Page({
  data: {
    searchValue: null,
    orderByDZtext: "广州",
    orderByTJicon: '../../../images/order_up.png',
    orderByDZicon: '../../../images/order_up.png',
    orderByGSicon: '../../../images/order_up.png',
    orderByYQicon: '../../../images/order_up.png',
    jobListItem: [{
        jobId: '0001',
        jobName: '岗位名称',
        jobPayMin: '14K',
        jobPayMax: '15K',
        companyName: '公司名称',
        companyAddress: '公司地址',
        workExperience: '工作经验',
        degree: '学历',
        publisherName: '发布人',
        publisherPost: '发布人职位'
      },
      {
        jobId: '0002',
        jobName: '岗位名称',
        jobPayMin: '11K',
        jobPayMax: '13K',
        companyName: '公司名称',
        companyAddress: '公司地址',
        workExperience: '工作经验',
        wegree: '学历',
        publisherName: '发布人',
        publisherPost: '发布人职位'
      }
    ],
  },
  jobIntention: function() { //求职意向
    let _that = this;
    wx.showModal({
      title: '提示',
      content: '这是预留功能',
    })
  },
  searchValue: function(e) { //装填搜索框的值
    let _that = this;
    _that.setData({
      searchValue: e.detail.value
    });
  },
  searchJob: function() { //搜索职位
    let _that = this;
    wx.showModal({
      title: '提示',
      content: "input Value:" + _that.data.searchValue,
    })
  },
  changeIconSrc: function(p1) { //变换图标地址
    let _that = this,
      oldIcon = '';
    switch (p1) {
      case 'TJ':
        oldIcon = _that.data.orderByTJicon;
        if (oldIcon == '../../../images/order_up.png') {
          _that.setData({
            orderByTJicon: '../../../images/order_down.png'
          });
        } else {
          _that.setData({
            orderByTJicon: '../../../images/order_up.png'
          });
        }
        break;
      case 'DZ':
        oldIcon = _that.data.orderByDZicon;
        if (oldIcon == '../../../images/order_up.png') {
          _that.setData({
            orderByDZicon: '../../../images/order_down.png'
          });
        } else {
          _that.setData({
            orderByDZicon: '../../../images/order_up.png'
          });
        }
        break;
      case 'GS':
        oldIcon = _that.data.orderByGSicon;
        if (oldIcon == '../../../images/order_up.png') {
          _that.setData({
            orderByGSicon: '../../../images/order_down.png'
          });
        } else {
          _that.setData({
            orderByGSicon: '../../../images/order_up.png'
          });
        }
        break;
      case 'YQ':
        oldIcon = _that.data.orderByYQicon;
        if (oldIcon == '../../../images/order_up.png') {
          _that.setData({
            orderByYQicon: '../../../images/order_down.png'
          });
        } else {
          _that.setData({
            orderByYQicon: '../../../images/order_up.png'
          });
        }
        break;
    }
  },
  orderByTJ: function(e) { //根据推荐排序
    let _that = this;
    _that.changeIconSrc('TJ');
  },
  orderByDZ: function() { //根据地址排序
    let _that = this;
    _that.changeIconSrc('DZ');
  },
  orderByGS: function() { //根据公司排序
    let _that = this;
    _that.changeIconSrc('GS');
  },
  orderByYQ: function() { //根据要求排序
    let _that = this;
    _that.changeIconSrc('YQ');
  },
  onLoad: function(e) {
    let _that = this;
    //发起请求去判断用户是否已经使用手机号码注册过
  },
})