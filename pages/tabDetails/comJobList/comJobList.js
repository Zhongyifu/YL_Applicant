// pages/tab_JobList.js
let locationDate = require('../../../utils/address.js'); //加载全国的行政区划信息
let locationCN = [];
Page({
  data: {
    searchValue: null,

    icon_Recent: '../../../images/order_up.png',
    icon_Address: '../../../images/order_up.png',
    icon_Exp: '../../../images/order_up.png',
    icon_Salary: '../../../images/order_up.png',
    icon_JobType: '../../../images/order_up.png',

    // 关于各个选项值
    recentVal: '推荐',
    recentChecked: 1, //通过改变状态来改变推荐一栏的样式

    //选择地点
    addressVal: '广州',
    province: '',
    city: '',
    district: '',
    jobListItem: [{
        jobId: '0001',
        jobName: '岗位名称岗位名称岗位名称岗位名称岗位名称岗位名称岗位名称岗位名称岗位名称',
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

    //工作经验
    expList:[],
    expVal: "",
    expChecked: 3, //使用数字来标识各个选项 （1.在校生，2.应届生，3、1-2，....）

    //薪资待遇
    salary: '',
    salaryChecked: 1, //同工作经验

    //该公司正在招聘的职业
    jobTypeVal: '',
    jobTypeChecked: 1,
    jobTypeList: [],

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
  changeIconSrc: function(p1) { //变换图标地址,以及相关的弹出层操作
    let _that = this,
      oldIcon = '';
    switch (p1) {
      case 'Recent':
        oldIcon = _that.data.icon_Recent;
        if (oldIcon == '../../../images/order_up.png') {
          _that.setData({
            icon_Recent: '../../../images/order_down.png'
          });
          // 打开相应的弹出层，并关闭其他的层
          _that.modal_Recent.showModal();
          _that.modal_Address.closeModal();
          _that.modal_Experience.closeModal();
          _that.modal_Salary.closeModal();
          _that.modal_JobType.closeModal();
        } else {
          _that.setData({
            icon_Recent: '../../../images/order_up.png'
          });
          _that.modal_Recent.closeModal();
        }

        break;
      case 'Address':
        oldIcon = _that.data.icon_Address;
        if (oldIcon == '../../../images/order_up.png') {
          _that.setData({
            icon_Address: '../../../images/order_down.png'
          });
          // 打开相应的弹出层，并关闭其他的层
          _that.modal_Recent.closeModal();
          _that.modal_Address.showModal();
          _that.modal_Experience.closeModal();
          _that.modal_Salary.closeModal();
          _that.modal_JobType.closeModal();
        } else {
          _that.setData({
            icon_Address: '../../../images/order_up.png'
          });
          _that.modal_Address.closeModal();
        }
        break;
      case 'EXP':
        oldIcon = _that.data.icon_Exp;
        if (oldIcon == '../../../images/order_up.png') {
          _that.setData({
            icon_Exp: '../../../images/order_down.png'
          });
          // 打开相应的弹出层，并关闭其他的层
          _that.modal_Recent.closeModal();
          _that.modal_Address.closeModal();
          _that.modal_Experience.showModal();
          _that.modal_Salary.closeModal();
          _that.modal_JobType.closeModal();
        } else {
          _that.setData({
            icon_Exp: '../../../images/order_up.png'
          });
          _that.modal_Experience.closeModal();
        }
        break;
      case 'Salary':
        oldIcon = _that.data.icon_Salary;
        if (oldIcon == '../../../images/order_up.png') {
          _that.setData({
            icon_Salary: '../../../images/order_down.png'
          });
          // 打开相应的弹出层，并关闭其他的层
          _that.modal_Recent.closeModal();
          _that.modal_Address.closeModal();
          _that.modal_Experience.closeModal();
          _that.modal_Salary.showModal();
          _that.modal_JobType.closeModal();
        } else {
          _that.setData({
            icon_Salary: '../../../images/order_up.png'
          });
          _that.modal_Salary.closeModal();
        }
        break;
      case 'JobType':
        oldIcon = _that.data.icon_JobType;
        if (oldIcon == '../../../images/order_up.png') {
          _that.setData({
            icon_JobType: '../../../images/order_down.png'
          });
          // 打开相应的弹出层，并关闭其他的层
          _that.modal_Recent.closeModal();
          _that.modal_Address.closeModal();
          _that.modal_Experience.closeModal();
          _that.modal_Salary.closeModal();
          _that.modal_JobType.showModal();
        } else {
          _that.setData({
            icon_JobType: '../../../images/order_up.png'
          });
          _that.modal_JobType.closeModal();
        }
        break;
    }
  },
  // 调用各自的模态框以及发起请求
  orderByRecent: function(e) { //根据推荐排序
    let _that = this;
    _that.changeIconSrc('Recent');
  },
  orderByAddress: function() { //根据地址排序
    let _that = this;
    _that.changeIconSrc('Address');
  },
  orderByEXP: function() { //根据工作经验排序
    let _that = this;
    _that.changeIconSrc('EXP');
  },
  orderBySalary: function() { //根据要求排序
    let _that = this;
    _that.changeIconSrc('Salary');
  },
  orderByJobType: function() { //根据职位类型
    let _that = this;
    _that.changeIconSrc('JobType');
  },
  onLoad: function(e) {
    let _that = this;
    _that.modal_Recent = _that.selectComponent("#modal_Recent"); //通过给组件所起的id调用组件
    _that.modal_Address = _that.selectComponent("#modal_Address");
    _that.modal_Experience = _that.selectComponent("#modal_Experience");
    _that.modal_Salary = _that.selectComponent("#modal_Salary");
    _that.modal_JobType = _that.selectComponent("#modal_JobType");

    let locationCN = [];
    //装填行政区划信息
    locationDate.getAllLocationCN(function(res) {
      locationCN = res;
    });
    _that.setData({
      locationCN: locationCN
    });

    //装填动态的数据
    let jobTypeList = [];
    let expList = ['在校生', '应届生', '1-3年', '3-5年', '5-10年', '10年以上'];
    _that.setData({
      expList: expList
    });

  },

  // 各项搜索值的点击事件
  clickRecent: function(e) {
    let _that=this;
    // let searchVal = e._relatedInfo.anchorTargetText;
    // wx.request({});
    console.log(e)
    //改变item的css属性
    _that.setData({
      recentChecked: e.currentTarget.dataset.resid
    });
  },
  clickAddress: function(e) {
    console.log(e);
  },
  clickEXP: function(e) {
    let _that = this;
    let searchVal = e._relatedInfo.anchorTargetText;
    _that.setData({
      expChecked: e.currentTarget.dataset.expid
    });
  },
  clickSalary:function(e){
    let _that=this;
    let searchVal = e._relatedInfo.anchorTargetText;
    _that.setData({
      salaryChecked: e.currentTarget.dataset.salaryid
    });
  },
  clickJobType:function(e){
    let _that = this;
    let searchVal = e._relatedInfo.anchorTargetText;
    _that.setData({
      jobTypeChecked: e.currentTarget.dataset.typeid
    });
  },

})