// pages/memberModule/pages/register/register.js
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
    isBigScreen: mainService.judgeBigScreen(), // 是否大屏
  },
  onLoad() {
    this.setNav();
    this.setData({isBigScreen: mainService.judgeBigScreen()});
  },
  onShow(){
    memberService.initJudgeJump(() => {
      memberService.getMemberBindStatus(res => {
        this.setData({
          userModel,
        });
      });//获取入会状态
    });
  },
  setNav() {
    this.selectComponent('#comp-nav-dynamic').setOptions({
      navBackgroundInit: 'transparent', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#ffffff', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '', // 标题文字-初始值
      titleTextRoll: '', // 标题文字-滚动值
      historyShow: false, // 历史图标是否显示
      scrollMin: 0, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 0, // 最大滚动间距（保持初始值，设置为0），单位px
    })
  },

  judgeRegisterStatus() {
    // 调用注册组件
    this.selectComponent('#comp-register').showHandle({
      success: () => {
        console.log('入会成功');
        userModel.isBind = 1;
        this.setData({userModel});
      },
      fail: () => {
        console.log('入会失败');
      }
    })
  },
  
  jumpPage(){
    mainService.link(pathModel.shop_onShop, 3);
  },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})