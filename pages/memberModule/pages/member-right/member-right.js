// pages/memberModule/pages/member-right/member-right.js
import memberService from '../../services/member.service';
import imgModel from '../../models/img.model';

Page({
  data: {
    imgModel,
    list: [
      imgModel.member_right1,
      imgModel.member_right2,
      imgModel.member_right3,
      imgModel.member_right4,
    ]
  },
  onLoad() {
    let navData = {
      navBackgroundInit: 'transparent', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#ffffff', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '会员权益', // 标题文字-初始值
      titleTextRoll: '会员权益', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 50, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 200, // 最大滚动间距（保持初始值，设置为0），单位px
    }
    this.selectComponent('#comp-nav-dynamic').setOptions(navData);

  },
  onShow() {

  },
  onPageScroll(e) {
    let { scrollTop } = e;
    this.selectComponent('#comp-nav-dynamic').scrollHandle(scrollTop);
  },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})