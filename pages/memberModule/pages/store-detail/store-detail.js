import memberService from '../../services/member.service';
import imgModel from '../../models/img.model';
import mainService from '../../../../services/main.service';
import ajaxService from '../../services/ajax.service';
import configModel from '../../../../models/config.model';
import pathModel from '../../../../models/path.model';

Page({
  data: {
    imgModel,
    navHeight: 0, // nav高度
    renderDetail: {}, // 渲染详情
  },
  onLoad() {
    this.setNav();
    this.setData({
      renderDetail: wx.getStorageSync('storeDetail'),
    })
  },
  onShow() { },
  setNav() {
    this.selectComponent('#comp-nav-dynamic').setOptions({
      navBackgroundInit: '#ffffff', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 文本颜色-初始值 16进制
      titleColorRoll: '#000000', // 文本颜色-滚动值 16进制
      titleTextInit: '合作机构', // 标题文字-初始值
      titleTextRoll: '', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
    })
    this.setData({
      navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight(),
    })
  },
  openLocation() {
    let {latitude, longitude, business_name, address} = this.data.renderDetail;
    wx.openLocation({
      latitude,
      longitude,
      scale: 17,
      name: business_name,
      address,
    })
  },
  phoneHandle(){
    wx.makePhoneCall({
      phoneNumber: this.data.renderDetail.telephone,
    })
  },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})
