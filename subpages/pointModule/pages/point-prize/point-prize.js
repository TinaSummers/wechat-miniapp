import mainService from '../../../../services/main.service'
import memberService from '../../../../pages/memberModule/services/member.service';

import imgModel from '../../models/img.model'
import ajaxService from '../../services/ajax.service';
import utilService from '../../services/util.service';

const TYPE_MAP = {
  1: { icon: 'icon_coupon', iconClass: 'icon-coupon' },
  2: { icon: 'icon_point', iconClass: 'icon-point' },
  0: { icon: 'icon_turntable', iconClass: 'icon-turntable' }
}

Page({
  data: {
    imgModel,
    list: null,
    currentPage: 1,
    isEnd: false,
    activityId: 0 // 活动id，api接口参数
  },

  onLoad: function (options) {
    this.setNav()
    this.setData({ activityId: options.id || 0 })
  },

  onShow: function () {
    memberService.initJudgeJump(() => {
      this.getList()
    })
  },

  onShareAppMessage: function () {
    return mainService.shareInfo()
  },

  setNav() {
    const navEle = this.selectComponent('#compNavDynamic')
    navEle.setOptions({
      navBackgroundInit: 'transparent', // 导航栏背景颜色-初始值
      navBackgroundRoll: 'transparent', // 导航栏背景颜色-滚动值
      titleColorInit: '#ffffff', // 标题颜色-初始值 16进制
      titleColorRoll: '#ffffff', // 标题颜色-滚动值 16进制
      titleTextInit: '我的奖品', // 标题文字-初始值
      titleTextRoll: '', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
    })
    const navHeight = navEle.getNavHeight()
    this.setData({ navHeight })
  },

  getList() {
    let { currentPage, isEnd, activityId } = this.data
    if (isEnd) return

    const params = { page: currentPage, id: activityId }

    ajaxService.getPointPrize(params).then(res => {
      const { errcode, errmsg, data } = res
      if (!errcode && data) {
        currentPage = data.current_page
        currentPage++
        const isEnd = currentPage > data.last_page
        const list = this.data.list || []
        const currentList = this.transferList(data.data)
        this.setData({
          currentPage,
          isEnd,
          list: list.concat(currentList)
        })
      } else {
        mainService.modal(errmsg)
      }
    })
  },

  transferList(list = []) {
    return list.map(item => {
      const map = TYPE_MAP[item.award_type]
      return {
        type: item.award_type,
        date: utilService.format(new Date((item.created_at).replace(/-/g,"/")), 'yyyy-MM-dd hh:mm'),
        dec: item.award_name,
        iconClass: map.iconClass,
        icon: map.icon
      }
    })
  }

})