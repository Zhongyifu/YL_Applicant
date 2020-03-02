var utils = require("../../../utils/util.js")
var app = getApp();
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
// var url = 'ws://请填写您的长链接接口地址';
// var url = 'wss://echo.websocket.org';
// var url = 'ws://localhost:1111/websocket';
// var webUrl = 'ws://www.hxtschool.xyz:2221/websocket';
var webUrl = 'ws://localhost:8063/websocket/applicantId/recruiterId/type';
// var webUrl = '';
// var upload_url = '请填写您的图片上传接口地址'
let applicantId;
let recruiterId;
Page({
  data: {
    user_input_text: '', //用户输入文字
    inputValue: '',
    returnValue: '',
    addImg: false,
    //格式示例数据，可为空
    allContentList: [],
    num: 0,
  },

  // 页面加载
  onLoad: function(option) {
    let _that = this;
    applicantId = "f0870e37a0724656be2d7ac9d1eaf38c";
    recruiterId = "9fcb0f2cd58249bb8de0638d6fb5d105";
    webUrl = 'ws://localhost:8063/websocket/' + applicantId + "/" + recruiterId + "/A";

    // 判断用户的入口
    // let recruiterId = option.hrId; // recruiterId:招聘者的id 用于查询当前沟通的HR的部分信息,各个入口都会传
    // 也可以代表用户是点击HR的头像等进入的页面
    // let linkId = option.linkId; // 从聊天列表页面进入
    // let jobId = option.jobId; // 从职位列表进入
    wx.getStorage({
      key: 'wechat_session',
      success: function (res) {  let sessionId = res.data.sessionId }});
    // 获取某个标识，来获取历史聊天记录和部分对话双方的信息
    // do something...

    // 创建Socket
    SocketTask = wx.connectSocket({
      url: webUrl,
      data: 'data',
      method: 'post',
      success: function (res) {
        console.log('WebSocket 连接创建成功', res)
      },
      fail: function (err) {
        wx.showToast({ title: '网络异常！' })
        console.log(err)
      },
    });

    SocketTask.onOpen(res => {
      socketOpen = true;
      console.log('监听 WebSocket 连接打开事件。', res);
    })
    SocketTask.onClose(onClose => {
      console.log('监听 WebSocket 连接关闭事件。', onClose)
      socketOpen = false;
      // this.webSocket()
    })
    SocketTask.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    SocketTask.onMessage(onMessage => {
      console.log('监听 WebSocket 接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data))
      let onMessage_data = JSON.parse(onMessage.data)
    })
    _that.bottom();
  },

  // 提交文字
  submitTo: function(e) {
    let that = this;
    // let recruiterId = that.data.recruiterId;
    // let applicantId = that.data.applicantId;
    // let sendType = 'B';
    let body = that.data.inputValue;
    let msg = "A0001&" + body;
    if (socketOpen) {
      // 如果打开了socket就发送数据给服务器
      sendSocketMessage(msg)
    }
  },

  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  onHide: function() {
    SocketTask.close(function(close) {
      console.log('关闭 WebSocket 连接。', close)
    })
  },

  upimg: function() {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      success: function(res) {
        that.setData({
          img: res.tempFilePaths
        })
        wx.uploadFile({
          url: upload_url,
          filePath: res.tempFilePaths,
          name: 'img',
          success: function(res) {
            console.log(res)
            wx.showToast({
              title: '图片发送成功！',
              duration: 3000
            });
          }
        })
        that.data.allContentList.push({
          is_my: {
            img: res.tempFilePaths
          }
        });
        that.setData({
          allContentList: that.data.allContentList,
        })
        that.bottom();
      }
    })
  },

  addImg: function() {
    this.setData({
      addImg: !this.data.addImg
    })

  },

  // 获取hei的id节点然后屏幕焦点调转到这个节点  
  bottom: function() {
    var that = this;
    this.setData({
      scrollTop: 1000000
    })
  },
})

//通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
function sendSocketMessage(msg) {
  var that = this;
  console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
  SocketTask.send({
    data: JSON.stringify(msg)
  }, function(res) {
    console.log('已发送', res)
  })
}