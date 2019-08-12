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
    isTriggleRegister: false, // 是否唤起注册组件
    pointBalance: 0,
    headerHeight: 432.5,
    headerTop: 14,
    cardWidth: 355*2,
    isScroll: false,//用于页面滚动到某个位置， >= scrollTop 时改变头部效果
    scrollTop: 15,
    optList: [
      [
        {icon: imgModel.icon_index1, title: '会员专享', url: pathModel.mc_member_right, power: false},
        {icon: imgModel.icon_index2, title: '我的预约', url: pathModel.salon_reservations, power: true},
        {icon: imgModel.icon_index3, title: '我的印章', url: pathModel.inter_myCollection, power: true},
      ],
      [
        {icon: imgModel.icon_index4, title: '个人资料', url: pathModel.mc_info, power: true},
        {icon: imgModel.icon_index5, title: '我的报告', url: pathModel.inter_myReport, power: true},
        {icon: imgModel.icon_index6, title: '合作机构', url: pathModel.mc_store, power: false},
      ],
    ],
    barcode: '',
    isBigScreen: mainService.judgeBigScreen(), // 是否大屏
  },
  onLoad() {
    let navData = {
      navBackgroundInit: 'transparent', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '', // 标题文字-初始值
      titleTextRoll: '我的', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 10, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 50, // 最大滚动间距（保持初始值，设置为0），单位px
    }
    this.selectComponent('#comp-nav-dynamic').setOptions(navData);
    this.setData({isBigScreen: mainService.judgeBigScreen()});
  },
  onShow() {
    // wx.pageScrollTo({
    //   scrollTop: 0,
    //   duration: 300,
    // })
    // this.changeHeaderSize();
    memberService.initMiniProgram(() => {
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
    if (!userModel.isAuthUnionid) {
      // 未授权unionid
      console.log('未授权unionid');
      return
    }
    if (userModel.isAuthUnionid && !this.data.isTriggleRegister) {
      // 已授权unionid && 未唤起注册组件
      console.log('已授权unionid && 未唤起注册组件');
      this.judgeRegisterStatus();
      return
    }
    if (userModel.isAuthUnionid && this.data.isTriggleRegister) {
      // 已授权unionid && 已唤起注册组件
      console.log('已授权unionid && 已唤起注册组件');
      this.getMemberDetail();
      return
    }
  },
  judgeRegisterStatus() {
    // 调用注册组件
    this.data.isTriggleRegister = true;
    this.selectComponent('#comp-register').openHandle({
      success: () => {
        console.log('入会成功');
        this.setData({isMember: true});
        // this.changeHeaderSize();
        this.getMemberDetail();
      },
      fail: () => {
        console.log('入会失败');
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
        // this.getCardStatus();
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
    let {currentTarget: {dataset: {item}}} = e;
    if(item.power && !userModel.isBind){
      this.judgeRegisterStatus();
      return;
    }
    if(item.url.length){
      mainService.link(item.url);
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
    if(!userModel.isBind){
      this.judgeRegisterStatus();
      return;
    }
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
  // onPageScroll(e) {
  //   let { scrollTop } = e;
  //   this.selectComponent('#comp-nav-dynamic').scrollHandle(scrollTop);
  //   // if(this.data.isMember){
  //   //   this.changeHeaderHeight(scrollTop);
  //   // }

  //   if(this.data.isMember){
  //     if(scrollTop >= this.data.scrollTop){
  //       this.setData({isScroll: true});
  //     }else{
  //       this.setData({isScroll: false});
  //     }
  //   }
  // },
  linkCard(){
    mainService.link(pathModel.mc_card);
  },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})