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

let checkLogin = () => {
  let baseUrl = 'http://localhost:8081/';
  let isLogin = false;
  let seeionValue = wx.getStorageSync('wechat_session');
  wx.request({
    url: baseUrl + 'login/checkSession.json',
    data: {
      'wechatSession': seeionValue
    },
    success: res => {
      console.log(res)
      if (res.data.status == 20022) {
        //会话失效则重新登录
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: baseUrl + 'login/miniProgramcLogin.json',
              data: {
                'code': res.code
              },
              success: res => {
                wx.setStorageSync("wechat_session", res.data.data)
              }
            });
          }
        });
      }
    }
  });
}

module.exports = {
  formatTime: formatTime,
  checkLogin: checkLogin
}