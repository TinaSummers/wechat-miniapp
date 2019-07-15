// pages/memberModule/pages/coupon-select/coupon-select.js
import memberService from '../../services/member.service';
import imgModel from '../../models/img.model';
import mainService from '../../../../services/main.service';
import pathModel from '../../../../models/path.model';
import ajaxService from '../../services/ajax.service';

Page({
  data: {
    imgModel,

    navHeight: 0,
    // isPageShow: false,
    // pageIndex: 0,
    // pageSize: 10,
    // isPageMore: true,
    // list: [],
    options: {},
    couponObj: {},

  },
  onLoad(options) {
    // 参数中含优惠券信息
    this.data.options = options;
    let couponObj = [];
    if (options.hasOwnProperty('couponObj')) {
      couponObj = JSON.parse(options.couponObj);
      couponObj.forEach((item, idx) => {
        // item.start_time = item.start_date ? item.start_date.replace(/-/g, '.').substr(5, 5) : '';
        // item.end_time = item.end_date ? item.end_date.replace(/-/g, '.').substr(5, 5) : '';
        // item.discount = Number.parseFloat(item.discount);
        // item.discount = ( (item.discount + '').indexOf('.') != -1 ) ? (item.discount*10) : item.discount;
        item.start_time = item.start_date;
        item.end_time = item.end_date;
        item.title = item.coupon_name;
        item.sub_title = item.coupon_remark;
        item.selected = 0;
        item.isSelect = 1;
      });
    } else {
      // 测试数据
      // couponObj = [
      //     {coupon_type: 1, discount: 8, reduce_cost: 0, start_time: '2019-06-11', end_time: '2019-06-11', title: '指定商品', sub_title: '8折优惠券', selected: 0, isSelect: 1},
      //     {coupon_type: 2, discount: 10, reduce_cost: 10, start_time: '2019-06-11', end_time: '2019-06-11', title: '整单立减10元', sub_title: '满199可用', selected: 0, isSelect: 1},
      //     {coupon_type: 3, discount: 8, reduce_cost: 0, start_time: '2019-06-11', end_time: '2019-06-11', title: '可凭本券兑换', sub_title: 'xxx一份', selected: 0, isSelect: 1},
      //     {coupon_type: 4, discount: 8, reduce_cost: 0, start_time: '2019-06-11', end_time: '2019-06-11', title: '可凭本券兑换', sub_title: 'xxx一份', selected: 0, isSelect: 1},
      //     {coupon_type: 5, discount: 8, reduce_cost: 0, start_time: '2019-06-11', end_time: '2019-06-11', title: '可凭本券兑换', sub_title: 'xxx一份', selected: 0, isSelect: 1},
      // ];
    }
    this.setData({ couponObj });

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
    this.setData({ navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight() });

    memberService.initJudgeJump(() => {
      // this.getCouponList();
    });
  },
  onShow() {

  },
  getCouponList() {
    this.data.pageIndex += 1;
    let params = {
      coupon_status: 2,
      page: this.data.pageIndex,
      page_size: this.data.pageSize,
    }
    ajaxService.couponListSel(params).then(res => {
      let { data: { errcode, data, errmsg } } = res;
      this.setData({ isPageShow: true });
      if (errcode == 0) {
        let list = data.list;
        list.forEach((item, idx) => {
          item.start_time = item.start_date ? item.start_date.replace(/-/g, '.').substr(5, 5) : '';
          item.end_time = item.end_date ? item.end_date.replace(/-/g, '.').substr(5, 5) : '';
          item.discount = Number.parseFloat(item.discount);
          item.discount = ((item.discount + '').indexOf('.') != -1) ? (item.discount * 10) : item.discount;
          item.selected = false;
        });
        this.setData({
          list: this.data.list.concat(list),
          isPageMore: list.length >= this.data.pageSize ? false : true,
        })
      } else {
        mainService.modal(errmsg);
      }
    });
  },
  onSelect(e){
    let {currentTarget: {dataset: {index, detail}}} = e;
    let coupons = this.data.couponObj;
    coupons.forEach((item, key) => {
      if (index != key) {
        item.selected = 0;
      } else {
        item.selected = item.selected == 1 ? 0 : 1;
      }
    })
    this.setData({
      couponObj: this.data.couponObj
    })
  },
  submitHandle() {
    // todo 每项的属性selected=1表示选中状态
    wx.setStorageSync('couponObj', JSON.stringify(this.data.couponObj)); // 全部列表
    wx.navigateBack();
  },
  cancelHandle() {
    this.data.couponObj.forEach((item, key) => {
      item.selected = 0;
    })
    this.setData({
      couponObj: this.data.couponObj,
    })
    wx.setStorageSync('couponObj', JSON.stringify(this.data.couponObj)); // 全部列表
    wx.navigateBack();
  },
  // onPageScroll(e) {
  //   let { scrollTop } = e;
  //   this.selectComponent('#comp-nav-dynamic').scrollHandle(scrollTop);
  // },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})