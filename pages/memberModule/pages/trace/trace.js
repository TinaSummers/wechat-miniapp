// pages/memberModule/pages/trace/trace.js
import memberService from '../../services/member.service';
import imgModel from '../../models/img.model';
import mainService from '../../../../services/main.service';
import pathModel from '../../../../models/path.model';
import ajaxService from '../../services/ajax.service';

Page({
  data: {
    imgModel,

    isPageShow: false, //页面内容是否显示
    navHeight: 0,
    list: [
      // {id: 1, icon: '', title: '卓诗尼凉鞋2019夏新款时尚简约圆头毛球凉鞋女款', price: '419.00', oldPrice: '439.00'},
      // {id: 2, icon: '', title: '卓诗尼凉鞋2019夏新款时尚简约圆头毛球凉鞋女款', price: '419.00', oldPrice: '439.00'},
      // {id: 3, icon: '', title: '卓诗尼凉鞋2019夏新款时尚简约圆头毛球凉鞋女款', price: '419.00', oldPrice: '439.00'},
      // {id: 4, icon: '', title: '卓诗尼凉鞋2019夏新款时尚简约圆头毛球凉鞋女款', price: '419.00', oldPrice: '439.00'},
      // {id: 5, icon: '', title: '卓诗尼凉鞋2019夏新款时尚简约圆头毛球凉鞋女款', price: '419.00', oldPrice: '439.00'},
      // {id: 6, icon: '', title: '卓诗尼凉鞋2019夏新款时尚简约圆头毛球凉鞋女款', price: '419.00', oldPrice: '439.00'},
      // {id: 7, icon: '', title: '卓诗尼凉鞋2019夏新款时尚简约圆头毛球凉鞋女款', price: '419.00', oldPrice: '439.00'},
      // {id: 8, icon: '', title: '卓诗尼凉鞋2019夏新款时尚简约圆头毛球凉鞋女款', price: '419.00', oldPrice: '439.00'},
    ],
    pageIndex: 0,
    pageSize: 10,
    isPageMore: true,
  },
  onLoad() {
    let navData = {
      navBackgroundInit: '#ffffff', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '我的足迹', // 标题文字-初始值
      titleTextRoll: '我的足迹', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 10, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 50, // 最大滚动间距（保持初始值，设置为0），单位px
    }
    this.selectComponent('#comp-nav-dynamic').setOptions(navData);
    this.setData({navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight()});
    
    memberService.initJudgeJump(() => {
      this.getTraceList();
    });
  },
  onShow() {
    // this.setData({
    //   isPageMore: false,
    //   pageIndex: 0,
    //   isPageMore: true
    // })
    
  },
  getTraceList(){
    this.data.pageIndex += 1;
    let params = {
      // token: 'etoshoptest',
      type: 'product',
      currentPage: this.data.pageIndex,
      pageSize: this.data.pageSize
    }
    ajaxService.traceList(params).then((res) => {
      let {data: {errcode, data, errmsg}} = res;
      this.setData({isPageShow: true});
      if(errcode == 200){
        let list = data.data;
        this.setData({
          list: this.data.list.concat(list),
          isPageMore: list.length >= this.data.pageSize ? true:false
        })
      }else{
        mainService.modal(errmsg);
      }
    });
  },

  loadPageMore(){
    if(!this.data.isPageMore){
      return;
    }
    this.getTraceList();
  },
  linkProductDetail(e){
    let productId = e.currentTarget.dataset.productId;
    mainService.link(`${pathModel.shop_productDetail}?productId=${productId}`);
  },
  // onPageScroll(e) {
  //   let { scrollTop } = e;
  //   this.selectComponent('#comp-nav-dynamic').scrollHandle(scrollTop);
  // },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})