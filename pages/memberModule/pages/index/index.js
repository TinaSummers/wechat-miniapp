// pages/memberModule/pages/index/index.js
import memberService from '../../services/member.service';
import imgModel from '../../models/img.model';
import userModel from '../../models/user.model';
import mainService from '../../../../services/main.service';
import pathModel from '../../../../models/path.model';
import animationService from '../../services/animation.service';
import ajaxService from '../../services/ajax.service';

Page({
  data: {
    imgModel,
    pageShow: false,
    userModel,
    isShowToast: false,//是否显示客服弹窗
    isShowToastBarcode: false,//是否显示会员卡信息条码弹窗
    isMember: false,//是否入会
    pointBalance: 0,
    headerHeight: 432.5,
    headerTop: 14,
    cardWidth: 355*2,
    isScroll: false,//用于页面滚动到某个位置， >= scrollTop 时改变头部效果
    scrollTop: 15,
    orderList: [
      {icon: imgModel.icon_order1, title: '待付款', unNum: 0, url: `${pathModel.shop_myOrder}?activity=1`},
      {icon: imgModel.icon_order2, title: '待发货', unNum: 0, url: `${pathModel.shop_myOrder}?activity=2`},
      {icon: imgModel.icon_order3, title: '待取货', unNum: 0, url: `${pathModel.shop_myOrder}?activity=3`},
      {icon: imgModel.icon_order4, title: '退款/售后', unNum: 0, url: `${pathModel.shop_myOrder}?activity=${'after_sale'}`},
    ],
    memberList: [
      [
        {icon: imgModel.icon_member1, title: '每日签到', url: pathModel.mc_signin},
        {icon: imgModel.icon_member2, title: '积分商城', url: pathModel.pt_index},
        {icon: imgModel.icon_member3, title: '地址管理', url: pathModel.shop_addressMange},
      ],
      [
        {icon: imgModel.icon_member4, title: '优惠券', url: pathModel.mc_coupon},
        {icon: imgModel.icon_member5, title: '会员权益', url: pathModel.mc_member_right},
        {icon: imgModel.icon_member6, title: '联系客服', url: ''},
      ]
    ],
    centerList: [
      {icon: imgModel.icon_center1, title: '我的拼团', subTitle: '快来拼团吧', url: ''},
      {icon: imgModel.icon_center2, title: '我的砍价', subTitle: '邀请好友助你砍价', url: pathModel.shop_bargainList},
      {icon: imgModel.icon_center3, title: '我的发布', subTitle: '您的发现，您的文章', url: pathModel.find_self},
      {icon: imgModel.icon_center4, title: '我的收藏', subTitle: '快来宠幸我吧', url: pathModel.mc_wish},
      {icon: imgModel.icon_center5, title: '我的足迹', subTitle: '浏览商品足迹', url: pathModel.mc_trace},
    ],
    barcode: '',
  },
  onLoad() {
    let navData = {
      navBackgroundInit: 'transparent', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#ffffff', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '', // 标题文字-初始值
      titleTextRoll: '我的', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 10, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 50, // 最大滚动间距（保持初始值，设置为0），单位px
    }
    this.selectComponent('#comp-nav-dynamic').setOptions(navData);
  },
  onShow() {
    // wx.pageScrollTo({
    //   scrollTop: 0,
    //   duration: 300,
    // })
    // this.changeHeaderSize();
    memberService.initJudgeJump(() => {
      this.init();
    });
  },
  changeHeaderSize(){
    this.setData({
      headerHeight: this.data.isMember?(432.5*2):(342*2),
      headerTop: this.data.isMember?(14*2):(60*2),
    });
  },
  init() {
    // 页面初始化
    this.setData({
      pageShow: true,
      userModel,
    })
    this.judgeRegisterStatus();
  },
  judgeRegisterStatus() {
    // 调用注册组件
    this.selectComponent('#comp-register').openHandle({
      success: () => {
        console.log('入会成功');
        this.setData({isMember: true});
        // this.changeHeaderSize();
        this.getMemberDetail();
        memberService.getShopidByPosition(()=>{
          this.getOrderCount();
        });
      },
      fail: () => {
        console.log('入会失败');
        mainService.link(pathModel.shop_onShop, 3);
      }
    })
  },
  getMemberDetail() {
    // 获取会员数据
    ajaxService.memberDetail({}).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        memberService.setUserModel(userModel, data);
        this.setData({
          userModel,
        })
        this.getCardStatus();
      } else {
        mainService.modal(errmsg);
      }
    })
  },
  getOrderCount(){
    ajaxService.orderCount({}).then(res => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 200) {
        let orderList = this.data.orderList;
        orderList.forEach((item, idx) => {
          switch(idx){
            case 0:
              item.unNum = data.wait_pay_count;
              break;
            case 1:
              item.unNum = data.wait_send_count;
              break;
            case 2:
              item.unNum = data.have_send_count;
              // item.unNum = data.have_finish_count;
              break;
            case 3:
              item.unNum = data.after_sale_count;
              // item.unNum = data.cancle_count;
              break;
          }
        });
        this.setData({orderList});
      } else {
        mainService.modal(errmsg);
      }
    })
  },
  getCardStatus(){
    ajaxService.memberCard({}).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        let cardList = data.cardList // 卡列表
        if (data.is_get_card == 1) {//已领卡
          userModel.isGetCard = 1;
          // userModel.cardNum = cardList[0].code;
          mainService.qrcodeBarcode(userModel.cardNum, (res) => {
            this.setData({barcode: res.barcode});
          });
        } else {//未领卡
          userModel.isGetCard = 0;
        }
        this.setData({
          userModel,
        })
      } else {
        mainService.modal(errmsg);
      }
    })
  },
  getCardHandle() {
    // 领取会员卡
    memberService.getMemberCard(() => {
      this.setData({
        userModel,
      })
    });
  },
  jumpPage(e){
    let {currentTarget: {dataset: {title, url}}} = e;
    if(title == '联系客服'){
      this.setData({isShowToast: true});
      animationService.animationSlideupShow(this, 'slide_up', -15, 1);
    }else{
      if(url.length){
        mainService.link(url);
      }
    }
  },
  onCancel(){
    let that = this;
    animationService.animationSlideupShow(that, 'slide_up', 15, 0);
    setTimeout(() => {
      that.setData({isShowToast: false});
    }, 300);
  },
  showBarcode(){
    this.setData({isShowToastBarcode: true});
    animationService.animationSlideupShow(this, 'slide_up_barcode', -15, 1);
  },
  onCancelBarcode(){
    let that = this;
    animationService.animationSlideupShow(that, 'slide_up_barcode', 15, 0);
    setTimeout(() => {
      that.setData({isShowToastBarcode: false});
    }, 300);
  },
  linkMobile(e){
    let {currentTarget: {dataset: {mobile}}} = e;
    wx.makePhoneCall({
      phoneNumber: mobile,
    })
    this.onCancel();
  },
  linkEditInfo(){
    mainService.link(pathModel.mc_info);
  },
  linkShareRecord(){
    mainService.link(pathModel.mc_share_record);
  },
  linkOrderList(){
    mainService.link(pathModel.shop_myOrder);
  },
  changeHeaderHeight(scrollTop){
    let headerHeight = 432.5;
    let headerTop = 14;
    let cardWidth = 355;
    if(scrollTop > 0){
      headerHeight = headerHeight - (scrollTop*2 + 10);
      headerTop += scrollTop + 30;
      cardWidth -= scrollTop;
      if(headerHeight <= 265){
        headerHeight = 265
      }
      if(headerTop >= 130){
        headerTop = 130;
      }
      if(cardWidth <= 330){
        cardWidth = 330
      }
    }
    headerHeight = headerHeight*2;
    headerTop = headerTop*2;
    cardWidth = cardWidth*2;
    this.setData({
      headerHeight,
      headerTop,
      cardWidth,
    });
  },
  onPageScroll(e) {
    let { scrollTop } = e;
    this.selectComponent('#comp-nav-dynamic').scrollHandle(scrollTop);
    // if(this.data.isMember){
    //   this.changeHeaderHeight(scrollTop);
    // }

    if(this.data.isMember){
      if(scrollTop >= this.data.scrollTop){
        this.setData({isScroll: true});
      }else{
        this.setData({isScroll: false});
      }
    }
  },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})