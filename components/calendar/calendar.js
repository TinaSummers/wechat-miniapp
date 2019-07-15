/**
 * 日历组件
 */
Component({
  options: {
    multipleSlots: true
  },
  properties: {},
  data: {
    weekGroup: ['日', '一', '二', '三', '四', '五', '六'], // 星期列表
    renderList: [], // 日期列表
    currDate: null, // 当前选中Date数据
    month: '', // 展示的月
    swiperIndex: 11, // 当前的swiper下标
    canPrevious: true, // swiper是否能向后滚动
    canAhead: true, // swiper是否能向后滚动
    dotArr: [], // 显示点的集合
  },
  attached() {
    this.init();
  },
  methods: {
    init() {
      // 组件初始化
      this.createCurrWeek();
      this.createNewWeekMuch(10, 1);
      this.createNewWeekMuch(2, 2);
      this.getMonth();
      console.log(this.data.renderList);
    },
    createNewWeekMuch(num, status) {
      // 一次性创建多个week
      for (let i = 0; i <= num; i++) {
        this.createNewWeek(status);
      }
    },
    createCurrWeek() {
      // 创建当前week
      let result = [];
      let now = this.getDateByMilliSecond(new Date().getTime());
      for (let i = 0; i < now.week; i++) {
        result.push(this.getDateByMilliSecond(now.ms - 24 * 60 * 60 * 1000 * (now.week - i)));
      }
      for (let i = now.week; i < 7; i++) {
        result.push(this.getDateByMilliSecond(now.ms + 24 * 60 * 60 * 1000 * (i - now.week)));
      }
      // 设置当天为选中状态
      this.data.renderList.push(result);
      this.setData({
        currDate: now,
        renderList: this.data.renderList
      })
    },
    createNewWeek(status) {
      // 创建新的week
      // status: 状态 1-前一周 2-后一周
      let result = [];
      switch (status) {
        case 1:
          for (let i = 1; i <= 7; i++) {
            let ms = this.data.renderList[0][0].ms;
            result.unshift(this.getDateByMilliSecond(ms - 24 * 60 * 60 * 1000 * i));
          }
          this.data.renderList.unshift(result);
          break;
        case 2:
          for (let i = 1; i <= 7; i++) {
            let ms = this.data.renderList[this.data.renderList.length - 1][6].ms;
            result.push(this.getDateByMilliSecond(ms + 24 * 60 * 60 * 1000 * i));
          }
          this.data.renderList.push(result);
          break;
      }
      this.setData({
        renderList: this.data.renderList
      })
    },
    getDateByMilliSecond(ms) {
      // 根据毫秒获取当前的date参数 ms-毫秒值
      let monthGroup = '一,二,三,四,五,六,七,八,九,十,十一,十二'.split(',');
      let date = new Date(ms);
      let year = date.getFullYear(); // 年
      let month = date.getMonth() + 1; // 月
      let month_china = monthGroup[month - 1];
      let day = date.getDate(); // 日
      let week = date.getDay(); // 一周中的某一天
      let week_china = this.data.weekGroup[week];
      return {
        year,
        month,
        month_china,
        day,
        week,
        week_china,
        ms,
        date: `${year}-${month >= 10 ? month : '0' + month}-${day >= 10 ? day : '0' + day}`,
        group: `星期${week_china} ${year}年${month >= 10 ? month : '0' + month}月${day >= 10 ? day : '0' + day}日`,
      }
    },
    toggleDate(e) {
      // 切换当前date
      let { currentTarget: { dataset: { index1, index2 } } } = e;
      this.setData({
        currDate: this.data.renderList[index1][index2],
      })
      this.triggerEvent('toggleDateEmit', {
        date: this.data.currDate,
      });
    },
    getMonth() {
      // 获取展示的月
      this.setData({
        month: this.data.renderList[this.data.swiperIndex][6].month_china,
      })
    },
    getCurrDate(){
      // 获取当前的时间json
      return this.data.currDate;
    },
    swiperChange(e) {
      // swiper事件
      let { detail: { current } } = e;
      this.data.swiperIndex = current;
      let canPrevious = this.data.swiperIndex <= 0 ? false : true;
      let canAhead = this.data.swiperIndex >= this.data.renderList.length - 1 ? false : true;
      this.setData({
        canPrevious,
        canAhead,
      })
      this.getMonth();
    },
    aheadHandle() {
      // swiper前进事件
      if (this.data.swiperIndex >= this.data.renderList.length - 1) {
        this.data.swiperIndex = this.data.renderList.length - 1;
        return
      }
      this.createNewWeek(2);
      this.data.swiperIndex++;
      this.setData({
        swiperIndex: this.data.swiperIndex,
      })
      this.getMonth();
      this.resetDotStatus(this.data.dotArr);
    },
    previousHandle() {
      // swiper后退事件
      if (this.data.swiperIndex <= 0) {
        this.data.swiperIndex = 0;
        return
      }
      this.data.swiperIndex--;
      this.setData({
        swiperIndex: this.data.swiperIndex,
      })
      this.getMonth();
      this.resetDotStatus(this.data.dotArr);
    },
    resetDotStatus(obj) {
      // 重置dot状态
      if (Object.prototype.toString.call(obj) != '[object Array]') {
        throw new Error('params must be Array');
      }
      if(!this.data.dotArr.length){
        this.data.dotArr = JSON.parse(JSON.stringify(obj));
      }
      let dateArr = JSON.parse(JSON.stringify(obj));
      dateArr.forEach((item, key, arr) => {
        arr[key] = this.getDateByMilliSecond(new Date(item).getTime());
      })
      this.data.renderList.forEach((v, i) => {
        v.forEach((v2, i2) => {
          v2.hasDot = 0;
        })
      })
      dateArr.forEach((item, key) => {
        this.data.renderList.forEach((v, i) => {
          v.forEach((v2, i2) => {
            if (item.date == v2.date) {
              v2.hasDot = 1;
            }
          })
        })
      })
      this.setData({
        renderList: this.data.renderList,
      })
    }
  }
})