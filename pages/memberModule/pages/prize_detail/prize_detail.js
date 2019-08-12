// pages/memberModule/pages/prize_detail/prize_detail.js
import memberService from '../../services/member.service';
import imgModel from '../../models/img.model';
import mainService from '../../../../services/main.service';
import pathModel from '../../../../models/path.model';
import userModel from '../../models/user.model';
import ajaxService from '../../services/ajax.service';
import animationService from '../../services/animation.service';

Page({
  data: {
    imgModel,
    userModel,
    
    navHeight: 0,
    prizeInfo: {},
    amount_list: [1, 2, 3, 4, 5],
    amount_index: 0,
    isShowInstr: false,
    isShowToast: false,
  },
  onLoad(options) {
    let prizeInfo = JSON.parse(options.prizeInfo);
    prizeInfo.isShowDate = false;
    this.setData({prizeInfo});
    
    let navData = {
      navBackgroundInit: '#ffffff', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '我的奖品', // 标题文字-初始值
      titleTextRoll: '我的奖品', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 10, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 50, // 最大滚动间距（保持初始值，设置为0），单位px
    }
    this.selectComponent('#comp-nav-dynamic').setOptions(navData);
    this.setData({navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight()});
    
  },
  onShow() {
    memberService.initMiniProgram(() => {
      // memberService.getMemberDetail(res => {
      //   this.setData({userModel});
      // });
    });
  },
  bindPickerChange(e){
    this.setData({amount_index: e.detail.value});
  },
  onConfirm(){
    let params = {
      phone: this.data.prizeInfo.phone,
      cardType: this.data.prizeInfo.cardType,
      awardId: this.data.prizeInfo.awardId
    };
    ajaxService.prizeUse(params).then(res => {
      let {data: {errcode, data, errmsg}} = res;
      if(errcode == 200){
        this.setData({isShowToast: true});
        animationService.animationSlideupShow(this, 'slide_up', -15, 1);
      }else{
        mainService.modal(errmsg);
      }
    });
    
  },
  onHideToast(){
    animationService.animationSlideupShow(this, 'slide_up', 15, 0);
    setTimeout(() => {
      this.setData({isShowToast: false});
      wx.navigateBack();
    }, 350);
  },
  onShowInstr(){
    this.setData({isShowInstr: true});
    animationService.animationShow(this, 'show_hide_instr', 1);
  },
  onHideInstr(){
    animationService.animationShow(this, 'show_hide_instr', 0);
    setTimeout(() => {
      this.setData({isShowInstr: false});
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