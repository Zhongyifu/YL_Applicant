const app = getApp();
const url = app.globalData.baseUrl;
function getAllLocationCN(callBack) {
  let allDate = [];
  wx.request({
    url: url +'chinaProvince/getProvinceCityDistrictTreeList.json',
    success: (res) =>{
      allDate =res.data.data;
      callBack(allDate);
    }
  })
}

function getCompanyJobList(callBack){
  
}
module.exports = {
  'getAllLocationCN': getAllLocationCN
}