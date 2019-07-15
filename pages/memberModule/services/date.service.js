
class DateService {
  constructor() {

  }

  /** 
   * 时间戳格式化函数 
   * @param  {int}    timestamp 要格式化的时间 默认为当前时间 
   * @param  {string} fmt    格式 
   * @return {string}           格式化的时间字符串 
   * date('Y-m-d','1350052653');//很方便的将时间戳转换成了2012-10-11 
   * date('Y-m-d H:i:s','1350052653');//得到的结果是2012-10-12 22:37:33
   */
  format(timestamp, fmt) {
    var fmt =typeof(fmt)=="undefined"?"yyyy-MM-dd hh:mm:ss":fmt;
    // var date = ((timestamp) ? new Date(timestamp * 1000) : new Date());
    var date = new Date(timestamp * 1000);
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  
}

export default new DateService();

