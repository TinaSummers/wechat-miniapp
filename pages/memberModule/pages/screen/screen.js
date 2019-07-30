import memberService from '../../services/member.service';
import imgModel from '../../models/img.model';
import userModel from '../../models/user.model';
import mainService from '../../../../services/main.service';
import configModel from '../../../../models/config.model';
import pathModel from '../../../../models/path.model';

Page({
  data: {
    imgModel,
    userModel,
    btnShow: false, // 是否展示按钮
    isBigScreen: mainService.judgeBigScreen(), // 是否大屏
  },
  onLoad() {
    this.setNav();
  },
  onShow(){
    this.login();
  },
  setNav() {
    this.selectComponent('#comp-nav-dynamic').setOptions({
      navBackgroundInit: 'transparent', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '', // 标题文字-初始值
      titleTextRoll: '', // 标题文字-滚动值
      historyShow: false, // 历史图标是否显示
      scrollMin: 0, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 0, // 最大滚动间距（保持初始值，设置为0），单位px
    })
  },
  login() {
    // 微信登录事件处理
    configModel.needUnionid = 1;
    mainService.login(() => {
      this.setData({
        btnShow: true,
        userModel,
      });
    });
  },
  getUserInfo(e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      mainService.getUserInfo(e.detail, () => {
        memberService.judgeTerminalPath();
      })
    } else {
      // wx.navigateBack();
    }
  },
  jumpPage(){
    memberService.judgeTerminalPath();
  },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})