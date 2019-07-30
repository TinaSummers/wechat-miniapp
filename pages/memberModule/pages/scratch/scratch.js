// pages/memberModule/pages/scratch/scratch.js
import memberService from '../../services/member.service';
import imgModel from '../../models/img.model';
import mainService from '../../../../services/main.service';
import pathModel from '../../../../models/path.model';
import userModel from '../../models/user.model';
import ajaxService from '../../services/ajax.service';
import Scratch from '../../utils/scratch/scratch';
import animationService from '../../services/animation.service';

Page({
  data: {
    imgModel,
    
    navHeight: 0,
    isShowSuccessToast: false,
    isShowFailToast: false,
    isShowCoating: true, // 显示刮刮乐涂层
    isFirstStart: true, // 是否是首次启动刮刮乐
    isPrizeReady: false, // 是否显示奖品
    isCoatingReady: false, // 刮刮奖涂层是否加载完毕
    scratchObj: null,
  },
  onLoad() {
    let navData = {
      navBackgroundInit: '#ffffff', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '刮刮乐', // 标题文字-初始值
      titleTextRoll: '刮刮乐', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 10, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 50, // 最大滚动间距（保持初始值，设置为0），单位px
    }
    this.selectComponent('#comp-nav-dynamic').setOptions(navData);
    this.setData({navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight()});
    
    this.createScratch();
  },
  onShow() {
    memberService.initJudgeJump(() => {
      this.readyLuck();
    });
  },
  /**
   * 刮奖准备：1. 获取奖品；2. 重启刮奖图层
   */
  readyLuck() {
    if (this.data.isShowModal) { this.closeModal(); }
    this.showScratch();
    this.getPrize();
  },
  createScratch() {
    this.scratchObj = new Scratch(this, {
      canvasWidth: 630,
      canvasHeight: 300,
      imageResource: imgModel.prize_coating,
      r: 24,
      callback: () => {
        this.setData({ isShowCoating: false });
        this.openPrize();
      },
      onCoatingImgLoad: () => {
        this.setData({ isCoatingReady: true });
      }
    });
  },
  /**
   * 显示刮奖涂层
   */
  showScratch() {
    this.setData({ isShowCoating: true });
  },
  
  /**
   * 开启刮奖
   */
  startScratch() {
    let { isFirstStart } = this.data;
    if (isFirstStart) {
      this.scratchObj.start();
      this.setData({ isFirstStart: false });
    } else {
      this.setData({ isCoatingReady: false });
      this.scratchObj.restart();
    }
  },
  /**
   * 获取刮刮乐奖品
   */
  getPrize() {
    this.setData({ isPrizeReady: false });

    this.setData({ isPrizeReady: true });
    this.startScratch();
  },
  /**
   * 通知后台用户刮奖完成
   */
  openPrize() {
    this.showFailToast();
  },
  showSuccessToast(){
    this.setData({isShowSuccessToast: true});
    animationService.animationSlideupShow(this, 'slide_up_success', -15, 1);
  },
  hideSuccessToast(){
    animationService.animationSlideupShow(this, 'slide_up_success', 15, 0);
    setTimeout(() => {
      this.setData({isShowSuccessToast: false});
    }, 350);
  },
  showFailToast(){
    this.setData({isShowFailToast: true});
    animationService.animationSlideupShow(this, 'slide_up_fail', -15, 1);
  },
  hideFailToast(){
    animationService.animationSlideupShow(this, 'slide_up_fail', 15, 0);
    setTimeout(() => {
      this.setData({isShowFailToast: false});
    }, 350);
  },
  // onPageScroll(e) {
  //   let { scrollTop } = e;
  //   this.selectComponent('#comp-nav-dynamic').scrollHandle(scrollTop);
  // },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})