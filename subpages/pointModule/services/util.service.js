/**
 * 工具类
 */
export default {
  gethm(dateObj) {  // hh:mm
    const dateFull = this.getFull(dateObj);
    if (!dateFull) { return '' }
    return dateFull.hour + ':' + dateFull.minute;
    //return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;  
  },

  getFull(dateObj) {
    if (!dateObj) { return }
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    month = month < 10 ? ('0' + month) : month;
    let day = dateObj.getDate();
    day = day < 10 ? ('0' + day) : day;
    let hour = dateObj.getHours();
    hour = hour < 10 ? ('0' + hour) : hour;
    let minute = dateObj.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    let second = dateObj.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return { year, month, day, hour, minute, second}
  },

  /**
   * 
   * @param {*Date} dateObj
   * @param {*string} template 
   */
  format(dateObj, template = 'yyyy-MM-dd hh:mm:ss') {
    const dateFull = this.getFull(dateObj);
    if (!dateFull) { return '' }
    return template.replace('yyyy', dateFull.year)
      .replace('MM', dateFull.month)
      .replace('dd', dateFull.day)
      .replace('hh', dateFull.hour)
      .replace('mm', dateFull.minute)
      .replace('ss', dateFull.second)
  },

  // 特殊处理函数
  transfer(dateStr) {
    if (!dateStr) { return '' }
    const dateObj = new Date(dateStr.replace(/-/g,"/"));
    return this.format(dateObj, 'yyyy-MM-dd hh:mm');
  },

  formatMonth(dateObj) {
    if (!dateObj) return ''
    let currentMonth = new Date().getMonth() + 1
    const fullDate = this.getFull(dateObj)
    if (Number(fullDate.month) == currentMonth) {
      return '本月'
    }

    return `${fullDate.year}年${fullDate.month}月`
  },

  formatPirze(prize) {
    if (!prize) return '0.00'
    return Number(prize) && Number(prize).toFixed(2) || '0.00'
  }
}