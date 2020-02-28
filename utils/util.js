const Promise = require('es6-promise.min.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const setUUID = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

const checkSessionAndBind = () => {
  let isExist = false;
  let baseUrl = 'http://localhost:8081/';
  // let baseUrl = 'https://www.hxtschool.xyz/leaflink-applicant-web/';
  let sessionId = wx.getStorageSync('wechat_session').sessionId;
  if (sessionId == undefined) {
    sessionId = null
  }
    wx.request({
      url: baseUrl + 'login/checkSession.json',
      header: {
        'Cookie': 'JSESSIONID=' + sessionId
      },
      success: res => {
        if (res.data.status == 20022) {
          console.log('会话失效');
          wx.login({
            success: res => {
              wx.request({
                url: baseUrl + 'login/checkBind.json',
                data: {
                  'code': res.code
                },
                success: res => {
                  //上传时需要去掉末尾的1
                  if (res.data.status == 10003) {
                    isBind = false;
                  } else {
                    isBind = true
                  }
                }
              });
            }
          });
        } else if (res.data.status == 10003) {
         //会话成功
        }  
      }
    });
}

// JSON 去重
//arr是要进行去重的json串
//attribute是针对json串中哪个属性进行去重
const distinctJSON =(arr, attribute) => {
  var new_arr = [];
  var json_arr = [];
  for (var i = 0; i < arr.length; i++) {
    if (new_arr.indexOf(arr[i][attribute]) == -1) {    //  -1代表没有找到
      new_arr.push(arr[i][attribute]);   //如果没有找到就把这个name放到arr里面，以便下次循环时用
      json_arr.push(arr[i]);
    } else {
    }
  }
  return json_arr;
}


module.exports = {
  formatTime: formatTime,
  distinctJSON: distinctJSON,
  setUUID: setUUID
}