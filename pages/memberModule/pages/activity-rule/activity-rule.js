// pages/memberModule/pages/activity-rule/activity-rule.js
import memberService from '../../services/member.service';

Page({
  data: {
    navHeight: 0
  },
  onLoad() {
    let navData = {
      navBackgroundInit: '#2c5596', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#2c5596', // 导航栏背景颜色-滚动值
      titleColorInit: '#ffffff', // 标题颜色-初始值
      titleColorRoll: '#ffffff', // 标题颜色-滚动值
      titleTextInit: '活动规则', // 标题文字-初始值
      titleTextRoll: '活动规则', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 10, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 50, // 最大滚动间距（保持初始值，设置为0），单位px
    }
    this.selectComponent('#comp-nav-dynamic').setOptions(navData);
    this.setData({navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight()});

  },
  onShow() {

  },
  // onPageScroll(e) {
  //   let { scrollTop } = e;
  //   this.selectComponent('#comp-nav-dynamic').scrollHandle(scrollTop);
  // },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})