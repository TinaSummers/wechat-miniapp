// pages/memberModule/pages/card/card.js
import memberService from '../../services/member.service';
import imgModel from '../../models/img.model';
import mainService from '../../../../services/main.service';
import pathModel from '../../../../models/path.model';
import ajaxService from '../../services/ajax.service';
import userModel from '../../models/user.model';

Page({
  data: {
    imgModel,

    navHeight: 0,
    cardNum: '',
    qrcode: '',
    barcode: '',
  },
  onLoad() {
    let navData = {
      navBackgroundInit: '#eeeeee', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#eeeeee', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '电子卡会员卡', // 标题文字-初始值
      titleTextRoll: '电子卡会员卡', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 10, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 50, // 最大滚动间距（保持初始值，设置为0），单位px
    }
    this.selectComponent('#comp-nav-dynamic').setOptions(navData);
    this.setData({navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight()});
    memberService.initMiniProgram(() => {
      this.setData({cardNum: userModel.cardNum || 'AEJ888888888888'})
      this.getQrcodeBarcode();
    });

  },
  onShow() {

  },
  getQrcodeBarcode(){
    mainService.qrcodeBarcode(userModel.cardNum, res => {
      this.setData({
        qrcode: res.qrcode,
        barcode: res.barcode,
      })
    });
  },
  // onPageScroll(e) {
  //   let { scrollTop } = e;
  //   this.selectComponent('#comp-nav-dynamic').scrollHandle(scrollTop);
  // },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})