// pages/memberModule/pages/coupon/coupon.js
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
    isShow: false, //是否显示数据列表
    isPageMore: true,//是否加载跟多分页
    type: 8, //优惠券导航类型，8：可用，9：已用，7：过期
    pageIndex: 0, //分页当前页
    list: []
  },
  onLoad() {
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
    
  },
  onShow() {
    memberService.initJudgeJump(() => {
      this.getCouponList();
    });
  },
  getCouponList(){
    this.data.pageIndex += 1;
    let params = {
      unionid: userModel.unionid,
      // organization_id: 124,
      // member_id: 36,
      page: this.data.pageIndex,
      status: this.data.type
    }
    ajaxService.couponList(params).then((res) => {
      let {data: {errcode, data, errmsg}} = res;
      this.setData({isShow: true});
      if(errcode == 'ER200'){
        let list = data.data;
        // list.forEach((item,idx) => {
        //   item.start_time = item.begin_time ? item.begin_time.replace(/-/g, '.').substr(5, 5):'';
        //   item.end_time = item.end_time ? item.end_time.replace(/-/g, '.').substr(5, 5): '';
        //   item.discount = Number.parseFloat(item.discount);
        //   item.discount = ( (item.discount + '').indexOf('.') != -1 ) ? (item.discount*10) : item.discount;
        // });
        this.setData({
          list: this.data.list.concat(list),
          isPageMore: data.current_page >= data.last_page ? false:true
        })
      }else{
        mainService.modal(errmsg);
      }
    });
  },
  loadPageMore(){
    if(!isPageMore){
      return;
    }
    this.getCouponList();
  },
  onNav(e){
    let {currentTarget: {dataset: {type}}} = e;
    this.setData({
      type,
      list: [],
      isShow: false,
      isPageMore: true,
      pageIndex: 0
    });
    this.getCouponList();
  },
  linkCouponDetail(e){
    let {currentTarget: {dataset: {type, id, code}}} = e;
    mainService.link(`${pathModel.mc_coupon_detail}?id=${id}&type=${type}&code=${code}`);
  },
  // onPageScroll(e) {
  //   let { scrollTop } = e;
  //   this.selectComponent('#comp-nav-dynamic').scrollHandle(scrollTop);
  // },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})