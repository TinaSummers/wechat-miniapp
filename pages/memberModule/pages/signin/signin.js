// pages/memberModule/pages/signin/signin.js
import memberService from '../../services/member.service';
import imgModel from '../../models/img.model';
import mainService from '../../../../services/main.service';
import pathModel from '../../../../models/path.model';
import ajaxService from '../../services/ajax.service';
import dateService from '../../services/date.service';

Page({
  data: {
    imgModel,

    isPageShow: false, //页面内容是否显示
    ruleList: [
      [
        {award_type: 1, integral: 0, coupon_id: 0, coupon_title: '', isShow: false, signed: false},
        {award_type: 1, integral: 0, coupon_id: 0, coupon_title: '', isShow: false, signed: false},
        {award_type: 1, integral: 0, coupon_id: 0, coupon_title: '', isShow: false, signed: false},
        {award_type: 1, integral: 0, coupon_id: 0, coupon_title: '', isShow: false, signed: false},
      ],
      [
        {award_type: 1, integral: 0, coupon_id: 0, coupon_title: '', isShow: false, signed: false},
        {award_type: 1, integral: 0, coupon_id: 0, coupon_title: '', isShow: false, signed: false},
        {award_type: 1, integral: 0, coupon_id: 0, coupon_title: '', isShow: false, signed: false},
        {award_type: 1, integral: 0, coupon_id: 0, coupon_title: '', isShow: false, signed: false},
      ],
    ], //签到机制规则
    signLogs: [], //签到记录
    signDays: 0, //连续签到天数
    signed: 0, //当天是否签到
    recommendList: [],
  },
  onLoad() {
    let navData = {
      navBackgroundInit: 'transparent', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#ffffff', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '每日签到', // 标题文字-初始值
      titleTextRoll: '每日签到', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 10, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 50, // 最大滚动间距（保持初始值，设置为0），单位px
    }
    this.selectComponent('#comp-nav-dynamic').setOptions(navData);
    memberService.initJudgeJump(() => {
      this.getSigninData();
      this.getRecommendList();
    });

  },
  onShow() {

  },
  getSigninData(){
    ajaxService.signinDetail({}).then((res) => {
      let {data: { errcode, data, errmsg}} = res;
      this.setData({isPageShow: true});
      if(errcode == 0){
        
        let signLogs = data.signLogs;
        let signed = data.signed;
        let signDays = 0;
        let signTemp = signLogs.length > 0 ? signLogs[signLogs.length-1]:null;//取最后一条签到记录
        if(signed){//判断今天是否签到
          signDays = signTemp.step;
        }else{
          let preDate = new Date(new Date().getTime() - 24*60*60*1000);
          let preDateObj = mainService.getDateByMilliSecond(preDate.getTime());
          let preDateStr = preDateObj.year+'-'+preDateObj.month+'-'+preDateObj.day;
          console.log('preDateStr',preDateStr);
          if(signTemp != null){
            if(preDateStr === signTemp.date){
              signDays = signTemp.step;
            }else{
              signDays = 0;
            }
          }
          
        }
        let ruleList = this.changeRules(JSON.parse(data.sign.rule), signDays);
        
        this.setData({
          ruleList,
          signLogs,
          signed,
          signDays,
        })
      }else{
        mainService.modal(errmsg);
      }
    });
  },
  changeRules(rules, days){
    let ruleList = this.data.ruleList;
    ruleList.forEach((item, idx) => {
      item.forEach((item2, idx2) => {
        item2.isShow = false;
        item2.signed = false;
        rules.forEach((rule, ruleIdx) => {
          if(ruleIdx == (idx*4+idx2)){
            item2.award_type = rule.award_type;
            item2.integral = rule.integral;
            item2.coupon_id = rule.coupon_id;
            item2.coupon_title = rule.coupon_title;
            item2.isShow = true;
          }
        });
        // logs.forEach((log, logIdx) => {
        //   if(logIdx == (idx*4+idx2)){
        //     item2.signed = true;
        //   }
        // });
        if(days > (idx*4+idx2)){
          item2.signed = true;
        }
      });
    });
    return ruleList;
  },
  onSign(){
    if(this.data.signed){
      mainService.modal('今天已经签到过了，明天再来吧~');
      return;
    }
    ajaxService.signin({}).then((res) => {
      let {data: { errcode, data, errmsg}} = res;
      this.setData({isPageShow: true});
      if(errcode == 0){
        this.getSigninData();
      }else{
        mainService.modal(errmsg);
      }
    });
  },
  getRecommendList(){
    ajaxService.recommendList({numbers: 10}).then(res => {
      let {data: {errcode, data, errmsg}} = res;
      if(errcode == 0){
        this.setData({recommendList: data});
      }else{
        // mainService.modal(errmsg);
      }
    });
  },
  linkProductDetail(e){
    let {currentTarget: {dataset: {productId}}} = e;
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