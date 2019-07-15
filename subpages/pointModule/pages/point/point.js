import mainService from '../../../../services/main.service'
import pathModel from '../../../../models/path.model'
import memberService from '../../../../pages/memberModule/services/member.service'
import userModel from '../../../../pages/memberModule/models/user.model'

import imgModel from '../../models/img.model'
import ajaxService from '../../services/ajax.service'
import utilService from '../../services/util.service'

const LIST_TYPE = {
  ALL: 0,
  GAIN: 1,
  CONSUME: 2
}

Page({
  data: {
    imgModel,
    navHeight: 0,
    LIST_TYPE,
    tabs: [
      { val: LIST_TYPE.ALL, text: '全部' },
      { val: LIST_TYPE.GAIN, text: '获取' },
      { val: LIST_TYPE.CONSUME, text: '消耗' }
    ],
    activeTab: LIST_TYPE.ALL,
    point: 0, // 积分余额
    aboutExpire: 0, // 即将失效的积分
    aboutUpgrade: 0, // 升级差分
    list: null, // 积分记录列表
    currentPage: 1,
    isEnd: false,
    toTop: 'toTop', // 控制列表滚动位置至顶
  },

  onLoad: function (options) {
    this.setNav()
  },
  onShow: function () {
    memberService.initJudgeJump(() => {
      this.updateList('refresh')
      this.getPointDetail()
    })
  },
  onShareAppMessage: function () {
    return mainService.shareInfo()
  },

  setNav() {
    const navEle = this.selectComponent("#compNavDynamic")

    navEle.setOptions({
      navBackgroundInit: 'transparent', // 导航栏背景颜色-初始值
      navBackgroundRoll: 'transparent', // 导航栏背景颜色-滚动值
      titleColorInit: '#ffffff', // 标题颜色-初始值 16进制
      titleColorRoll: '#ffffff', // 标题颜色-滚动值 16进制
      titleTextInit: '积分详情', // 标题文字-初始值
      titleTextRoll: '', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
    })

    const navHeight = navEle.getNavHeight()
    this.setData({ navHeight })
  },
  getPointDetail() {
    // 获取积分余额
    memberService.getMemberDetail(() => {
      this.setData({
        point: userModel.point,
        aboutExpire: userModel.expirePoint
      })
    })
  },
  showRule() {
    mainService.link(`${pathModel.pt_point_rule}`)
  },
  changeTab(e) {
    const val = e.currentTarget.dataset.val
    this.setData({ activeTab: val })
    this.updateList('refresh')
  },
  updateList(type) {
    if (type == 'refresh') {
      this.data.list = null
      this.data.currentPage = 1
      this.data.isEnd = false
    }
    if (this.data.isEnd) return

    // 会员才能获取积分明细
    this.selectComponent('#compRegister').openHandle({
      success: () => {
        this.getList(type)
      }
    })
  },
  getList(type) {
    const listType = this.data.activeTab
    let currentPage = this.data.currentPage

    const params = {
      status: listType,
      page: currentPage,
      unionid: userModel.unionid
    }

    ajaxService.getPointRecode(params).then(res => {
      const { errcode, errmsg, data } = res
      if (!errcode) {
        currentPage = data.current_page
        currentPage++
        const isEnd = currentPage > data.last_page
        const list = (type == 'refresh' || !this.data.list) ? [] : this.data.list
        const currentList = this.transferList(data.data)
        
        this.setData({
          currentPage,
          isEnd,
          list: list.concat(currentList)
        })
        // 滚动区域至顶
        if (type == 'refresh') { this.setData({ toTop: 'toTop'})}
      } else {
        mainService.modal(errmsg)
      }
    })
  },

  transferList(list = []) {
    return list.map(item => {
      return {
        date: utilService.format(new Date((item.created_at).replace(/-/g,"/")), 'yyyy-MM-dd hh:mm'),
        point: item.change_point > 0 ? '+' + item.change_point : item.change_point,
        // type: item.status,
        dec: item.message
      }
    })
  }
})