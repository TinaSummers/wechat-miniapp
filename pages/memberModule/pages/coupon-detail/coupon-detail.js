// pages/memberModule/pages/coupon-detail/coupon-detail.js
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
    isPageShow: false,
    id: 0,
    type: 8,
    code: '',
    barcode: '',
    couponInfo: {},
    
  },
  onLoad(options) {
    this.setData({id: options.id, type: options.type, code: options.code});
    
    let navData = {
      navBackgroundInit: '#ffffff', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '优惠券', // 标题文字-初始值
      titleTextRoll: '优惠券', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 10, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 50, // 最大滚动间距（保持初始值，设置为0），单位px
    }
    this.selectComponent('#comp-nav-dynamic').setOptions(navData);
    this.setData({navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight()});
    
    memberService.initJudgeJump(() => {
      this.getCouponDetail();
      this.getBarcode();
    });
  },
  onShow() {
    
  },
  getBarcode(){
    if(this.data.code.length){
      mainService.qrcodeBarcode(this.data.code, (res) => {
        this.setData({barcode: res.barcode});
      })
    }
  },
  getCouponDetail(){
    ajaxService.couponDetail({id: this.data.id}, this.data.id).then(res => {
      let {data: {errcode, data, errmsg}} = res;
      
      if(errcode == 'ER200'){
        this.setData({isPageShow: true});
        data.start_time = data.begin_time;
        data.coupon_type = data.type;
        // data.begin_time = data.begin_time ? data.begin_time.replace(/-/g, '.').substr(5, 5):'';
        // data.end_time = data.end_time ? data.end_time.replace(/-/g, '.').substr(5, 5):'';
        // data.discount = Number.parseFloat(data.discount);
        // data.discount = ( (data.discount + '').indexOf('.') != -1 ) ? (data.discount*10) : data.discount;
        this.setData({couponInfo: data});
      }else{
        mainService.modal(errmsg);
      }
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