// pages/memberModule/pages/question/question.js
import memberService from '../../services/member.service';
import imgModel from '../../models/img.model';
import mainService from '../../../../services/main.service';
import pathModel from '../../../../models/path.model';
import userModel from '../../models/user.model';
import ajaxService from '../../services/ajax.service';

Page({
  data: {
    imgModel,
    
    navHeight: 0,
  },
  onLoad() {
    let navData = {
      navBackgroundInit: '#f6f7fa', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#f6f7fa', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '美丽问卷', // 标题文字-初始值
      titleTextRoll: '美丽问卷', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 10, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 50, // 最大滚动间距（保持初始值，设置为0），单位px
    }
    this.selectComponent('#comp-nav-dynamic').setOptions(navData);
    this.setData({navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight(), isBigScreen: mainService.judgeBigScreen()});
    
    
  },
  onShow() {
    memberService.initJudgeJump(() => {
      
    });
  },
  linkScratch(){
    mainService.link(pathModel.mc_scratch);
  },
  linkPrizeList(){
    mainService.link(pathModel.mc_prize_list);
  },
  // onPageScroll(e) {
  //   let { scrollTop } = e;
  //   this.selectComponent('#comp-nav-dynamic').scrollHandle(scrollTop);
  // },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})