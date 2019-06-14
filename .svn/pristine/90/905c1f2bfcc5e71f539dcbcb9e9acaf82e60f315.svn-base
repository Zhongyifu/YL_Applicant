// pages/register/fifthPage/myAdv.js
import WxValidate from '../../../utils/WxValidate.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {},
  //验证规则
  initValidate: function(e) {
    const rules = {
      myAdv: {
        // rangelength: [2, 10]
      }
    };
    const ruleMsg = {
      myAdv: {
        // rangelength: '输入的值不合法'
      }
    };
    this.WxValidate = new WxValidate(rules, ruleMsg);
  },
  //关于表单验证的弹窗提示
  showError: function(error) {
    wx.showModal({
      content: error.msg,
      showCancel: true
    });
  },
  registerForm: function(e) {
    let _that = this;
    //验证合法性
    // if (!_that.WxValidate.checkForm(formValue)) {
    //   const error = this.WxValidate.errorList[0];
    //   _that.showError(error);
    //   return false;
    // }
    wx.request({
      url: '',
      data: e.detail.value,
      success: function(res) {
        if (res.status == 200) {
          wx.showToast({
            title: '上传成功!',
            icon: 'success',
            duration: 2000
          });
          wx.navigateTo({
            url: '../sixthPage/workTag',
          })
        }
      }
    })
  }
})