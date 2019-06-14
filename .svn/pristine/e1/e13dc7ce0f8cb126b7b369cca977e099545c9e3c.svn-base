// pages/tab_Company/tab_Company.js
Page({
  data: {
    searchValue: null,
    orderByItem1Icon: '../../../images/order_up.png',
    orderByItem2Icon: '../../../images/order_up.png',
    orderByItem3Icon: '../../../images/order_up.png',
    companyList:[{
      cover:'../../../images/hP.jpg',
      name:'companyName',
      address:'address',
      isListed:'已上市',
      quorumsMin:'1000',
      quorumsMix:'9999',
      nature:'性质',
      recruit:'JAVA高级工程师',
      recruitNum:'100'
    },
      {
        cover: '../../../images/hP.jpg',
        name: 'companyName',
        address: 'address',
        isListed: '已上市',
        quorumsMin: '1000',
        quorumsMix: '9999',
        nature: '性质',
        recruit: 'JAVA高级工程师',
        recruitNum: '10'
      },
      {
        cover: '../../../images/hP.jpg',
        name: 'companyName',
        address: 'address',
        isListed: '已上市',
        quorumsMin: '1000',
        quorumsMix: '9999',
        nature: '性质',
        recruit: 'JAVA高级工程师',
        recruitNum: '10'
      },
      {
        cover: '../../../images/hP.jpg',
        name: 'companyName',
        address: 'address',
        isListed: '已上市',
        quorumsMin: '1000',
        quorumsMix: '9999',
        nature: '性质',
        recruit: 'JAVA高级工程师',
        recruitNum: '10'
      }],
  },
  searchValue: function(e) { //装填搜索框的值
    let _that = this;
    _that.setData({
      searchValue: e.detail.value
    });
  },
  searchCompany: function() { //搜索公司
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
      case 'Item1':
        oldIcon = _that.data.orderByItem1Icon;
        if (oldIcon == '../../../images/order_up.png') {
          _that.setData({
            orderByItem1Icon: '../../../images/order_down.png'
          });
        } else {
          _that.setData({
            orderByItem1Icon: '../../../images/order_up.png'
          });
        }
        break;
      case 'Item2':
        oldIcon = _that.data.orderByItem2Icon;
        if (oldIcon == '../../../images/order_up.png') {
          _that.setData({
            orderByItem2Icon: '../../../images/order_down.png'
          });
        } else {
          _that.setData({
            orderByItem2Icon: '../../../images/order_up.png'
          });
        }
        break;
      case 'Item3':
        oldIcon = _that.data.orderByItem3Icon;
        if (oldIcon == '../../../images/order_up.png') {
          _that.setData({
            orderByItem3Icon: '../../../images/order_down.png'
          });
        } else {
          _that.setData({
            orderByItem3Icon: '../../../images/order_up.png'
          });
        }
        break;
    }
  },
  orderByItem1: function (e) { //根据推荐排序
    let _that = this;
    _that.changeIconSrc('Item1');
  },
  orderByItem2: function () { //根据地址排序
    let _that = this;
    _that.changeIconSrc('Item2');
  },
  orderByItem3: function () { //根据公司排序
    let _that = this;
    _that.changeIconSrc('Item3');
  },
})