import mainService from '../../../../services/main.service'
import memberService from '../../services/member.service';
import ajaxService from '../../services/ajax.service';
import imgModel from '../../models/img.model';
import userModel from '../../models/user.model';
import pathModel from '../../../../models/path.model';

Page({
  data: {
		imgModel,

		isShow: false,
		successNum:0,//成功邀请任务
		totalPoints:0,//累计积分
		singlePoint: 5,//成功邀请1位，加5积分
		list: [],
	},
	setNav() {
		// 设置nav
		this.selectComponent('#comp-nav-dynamic').setOptions({
			navBackgroundInit: 'transparent', // 导航栏背景颜色-初始值
			navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
			titleColorInit: '#000000', // 标题颜色-初始值
			titleColorRoll: '#000000', // 标题颜色-滚动值
			titleTextInit: '邀请好友', // 标题文字-初始值
			titleTextRoll: '邀请好友', // 标题文字-滚动值
			historyShow: true, // 历史图标是否显示
			scrollMin:50, // 最小滚动间距（保持初始值，设置为0），单位px
			scrollMax:100, // 最大滚动间距（保持初始值，设置为0），单位px
		});
	},
  onLoad(options) {
	this.setNav();
	memberService.initJudgeJump(() => {
		this.setData({isShow: true});
		this.getNetData();
	})
  },
  getNetData(){
	let params = {};
	ajaxService.shareRecord(params).then(res=>{
		let { data: {errcode, errmsg, data} } = res;
		if (errcode == 0) {
			if(data){
				this.setData({
					successNum: data.unionids_count,
					totalPoints: data.count_integral,
					list: data.unionids
				})
			}
	
		} else {
			mainService.modal(errmsg);
		}
	});
  },
  onShareAppMessage() {
  let shareInfo = mainService.shareInfo();
  shareInfo.path = `${pathModel.shop_onShop}?ant_share_unionid=${userModel.unionid}&ant_share_memberid=${userModel.memberid}`;
	return shareInfo;
  }
})