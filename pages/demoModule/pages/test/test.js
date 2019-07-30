import mainService from '../../../../services/main.service'
import memberService from '../../../../pages/memberModule/services/member.service'
import imgModel from '../../models/img.model';

Page({
  data: {
    navHeight: 0,
    imgModel
  },
  onLoad() {
    this.setNav();
  },
  onShow() {
    memberService.initJudgeJump(() => {
      this.judgeRegisterStatus();
    });
  },
  setNav() {
    this.selectComponent('#comp-nav-dynamic').setOptions({
      navBackgroundInit: '#000000', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#ffffff', // 文本颜色-初始值 16进制
      titleColorRoll: '#000000', // 文本颜色-滚动值 16进制
      titleTextInit: '初始标题', // 标题文字-初始值
      titleTextRoll: '滚动标题', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 50, // 最小滚动间距，单位px
      scrollMax: 200, // 最大滚动间距，单位px
      homeShow: true, // home图标是否显示
      homeJudgeStack: false, // home图标显示是否判断页面栈
      homePath: '/pages/memberModule/pages/index/index', // home页面路径
      homeColorInit: 'white', // home图标颜色-初始值 white / black
      homeColorRoll: 'black', // home图标颜色-滚动值 white / black
    })
    this.setData({
      navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight(),
    })
  },
  judgeRegisterStatus() {
    // 调用注册组件
    this.selectComponent('#comp-register').openHandle({
      success: () => {
        console.log('入会成功');
      },
      fail: () => {
        console.log('入会失败');
      }
    })
  },
  sealHandle(e) {
    this.selectComponent("#comp-seal").checkSeal(e, res => {
      console.log(res, 'comp-seal');
    })
  },
  onPageScroll(e) {
    this.selectComponent('#comp-nav-dynamic').scrollHandle(e.scrollTop);
  },
  onShareAppMessage() {
    return mainService.shareInfo();
  }
})