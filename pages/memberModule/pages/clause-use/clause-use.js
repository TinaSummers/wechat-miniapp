import mainService from '../../../../services/main.service'
import memberService from '../../../../pages/memberModule/services/member.service'
import imgModel from '../../models/img.model';

Page({
  data: {
    navHeight: 0,
    renderList: [imgModel.clause_use1, imgModel.clause_use2, imgModel.clause_use3, imgModel.clause_use4,]
  },
  onLoad() {
    this.setNav();
  },
  onShow() { },
  setNav() {
    this.selectComponent('#comp-nav-dynamic').setOptions({
      navBackgroundInit: '#ffffff', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#000000', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 文本颜色-初始值 16进制
      titleColorRoll: '#ffffff', // 文本颜色-滚动值 16进制
      titleTextInit: '使用条款', // 标题文字-初始值
      titleTextRoll: '使用条款', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 0, // 最小滚动间距，单位px
      scrollMax: 200, // 最大滚动间距，单位px
    })
    this.setData({
      navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight(),
    })
  },
  onShareAppMessage() {
    return mainService.shareInfo();
  }
})