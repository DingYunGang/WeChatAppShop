function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-')//secLirun页面调用过一次这个函数
  //  + ' ' + [hour, minute, second].map(formatNumber).join(':')//只要年月日，时分秒注释掉
}
function formatTime2(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber2).join('-')//secLirun页面调用过一次这个函数
   + ' ' + [hour, minute, second].map(formatNumber2).join(':')//只要年月日，时分秒注释掉
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n :  n
}
function formatNumber2(n) {
  n = n.toString()
  return n[1] ? n : '0'+ n
}

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2
}
