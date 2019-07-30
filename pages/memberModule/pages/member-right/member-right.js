// pages/memberModule/pages/member-right/member-right.js
import memberService from '../../services/member.service';
import imgModel from '../../models/img.model';
import mainService from '../../../../services/main.service';
import pathModel from '../../../../models/path.model';
import userModel from '../../models/user.model';
import ajaxService from '../../services/ajax.service';

Page({
  data: {
    imgModel,
    optList: [
      {icon: imgModel.icon_right1, title: '美丽问卷', url: pathModel.mc_question},
      {icon: imgModel.icon_right2, title: '线下沙龙', url: pathModel.salon_index},
      {icon: imgModel.icon_right3, title: '娃娃机', url: ``},
      {icon: imgModel.icon_right4, title: '医师说', url: ``},
      {icon: imgModel.icon_right5, title: '促销活动', url: ``},
    ],
  },
  onLoad() {
    let navData = {
      navBackgroundInit: 'transparent', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '', // 标题文字-初始值
      titleTextRoll: '会员权益', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 50, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 200, // 最大滚动间距（保持初始值，设置为0），单位px
    }
    this.selectComponent('#comp-nav-dynamic').setOptions(navData);

  },
  onShow() {

  },
  jumpPage(e){
    let {currentTarget: {dataset: {title, url}}} = e;
    if(title == '医师说'){
      mainService.modal('小程序正在搭建中，敬请期待！');
    }else if(title == '促销活动'){
      mainService.modal('暂无促销活动，敬请期待！');
    }else if(title == '娃娃机'){
      mainService.modal('娃娃机正在搭建中，敬请期待！');
    }else{
      if(url.length){
        mainService.link(url, title == '线下沙龙'?3:0);
      }
    }
  },
  // onPageScroll(e) {
  //   let { scrollTop } = e;
  //   this.selectComponent('#comp-nav-dynamic').scrollHandle(scrollTop);
  // },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})