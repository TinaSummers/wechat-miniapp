// pages/memberModule/pages/prize_list/prize_list.js
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
    type: '',
    isPageShow: false,
    list: [
      // {amount: 5, createTime: '2019年5月1号', state: 0, isShowDate: true},
      // {amount: 5, createTime: '2019年5月1号', state: 1, isShowDate: true},
    ],
  },
  onLoad(optios) {
    this.setData({type: optios.type || ''});
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
      this.getPrizeList();
    });
  },
  getPrizeList(){
    let params = {
      cardType: this.data.type == 'share' ? 2 : 1
    };
    ajaxService.prizeListShare(params).then(res => {
      let {data: {errcode, data, errmsg}} = res;
      this.setData({isPageShow: true});
      if(errcode == 200){
        let list = data;
        list.forEach((item, idx) => {
          item.amount = item.price;
          item.isShowDate = true;
        });
        this.setData({list});
      }else{
        mainService.modal(errmsg);
      }
    });
  },
  linkPrizeDetail(e){
    let {currentTarget: {dataset: {item}}} = e;
    mainService.link(`${pathModel.mc_prize_detail}?prizeInfo=${JSON.stringify(item)}`);
  },
  // onPageScroll(e) {
  //   let { scrollTop } = e;
  //   this.selectComponent('#comp-nav-dynamic').scrollHandle(scrollTop);
  // },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})