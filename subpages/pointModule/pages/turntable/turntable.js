import mainService from '../../../../services/main.service'
import pathModel from '../../../../models/path.model'

import imgModel from '../../models/img.model'
import ajaxService from '../../services/ajax.service'
import memberService from '../../../../pages/memberModule/services/member.service'
import userModel from '../../../../pages/memberModule/models/user.model';

// award type: 1.优惠券；2.积分；3. 无奖励

Page({
  data: {
    imgModel,
    navHeight: 0,
    point: 0, // 积分余额
    playedTimes: 0, // 已玩次数
    invitableTimes: 0, // 剩余可邀请次数
    prizeList: [], // 奖品列表
    turntableSize: 616,
    isRunning: false, // 转盘转动中
    currentPrize: null, // 抽奖结果
    activityId: 0, //活动ID, 开奖所需
    prizeIndex: 0,
    isBigScreen: false,

    boardBg: imgModel.turntable_board,
    turntableBg: imgModel.turntable_bg,
    turntable: imgModel.turntable,
    turntablePointer: imgModel.turntable_pointer
  },

  onLoad: function (options) {
    this.setNav()
    this.judgeIsBigScreen()
  },
  onShow: function () {
    memberService.initJudgeJump(() => {
      this.judgeIsMember(this.getTurntableData)
    })
  },
  onShareAppMessage: function () {
    this.shareForFree()

    return {
      title: '卓诗尼，发现你的新魅力',
      path: pathModel.pt_turntable,
      imageUrl: imgModel.share
    }
  },

  judgeIsBigScreen() {
    const isBigScreen = mainService.judgeBigScreen()
    this.setData({ isBigScreen })
    if (!isBigScreen) {
      this.setData({
        boardBg: imgModel.turntable_board_sm,
        turntableBg: imgModel.turntable_bg_sm,
        turntable: imgModel.turntable_sm,
        turntablePointer: imgModel.turntable_pointer_sm,
        turntableSize: 520
      })
    }
  },

  setNav() {
    const navEle = this.selectComponent('#compNavDynamic')
    navEle.setOptions({
      navBackgroundInit: 'transparent', // 导航栏背景颜色-初始值
      navBackgroundRoll: 'transparent', // 导航栏背景颜色-滚动值
      titleColorInit: '#ffffff', // 标题颜色-初始值 16进制
      titleColorRoll: '#ffffff', // 标题颜色-滚动值 16进制
      titleTextInit: '', // 标题文字-初始值
      titleTextRoll: '', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
    })
    const navHeight = navEle.getNavHeight()
    this.setData({ navHeight })
  },

  judgeIsMember(successCb) {
    this.selectComponent('#compRegister').openHandle({
      success: () => {
        successCb && successCb()
      }
    })
  },

  shareForFree() {
    const id = this.data.activityId
    ajaxService.shareForFree({ id }).then(res => {
      const { errcode, errmsg } = res
      if (errcode) {
        mainService.modal(errmsg)
      }
    })
  },

  // 获取转盘奖品列表, 已玩次数，可分享次数
  getTurntableData(isUpdateList = true) {
    const loadingType = Number(isUpdateList)
    ajaxService.getTurntableData({}, loadingType).then(res => {
      const { errcode, errmsg, data } = res
      if (!errcode) {
        if (isUpdateList) {
          this.updatePrizeList(data.activit.awards)
        }
       
        this.setData({
          point: data.integral,
          playedTimes: data.todayPlayed,
          invitableTimes: data.shareNum,
          activityId: data.activit.id
        })
      } else {
        mainService.modal(errmsg || '')
      }
    })
  },
  
  updatePrizeList(list) {
    const prizeList = list.map(award => {
      return {
        id: award.id,
        awardType: award.award_type,
        title: award.award_name
      }
    })
    this.setData({ prizeList })
  },

  // 开奖
  openPrize(e) {
    if (this.data.isRunning) return

    memberService.saveFormId(e)
    this.setData({ isRunning: true })

    const id = this.data.activityId
    ajaxService.openPrize({ id }).then(res => {
      const { errcode, errmsg, data } = res
      if (!errcode && data) {
        const currentPrize = {
          id: data.id,
          awardType: data.award_type,
          text: data.award_name
        }
        this.setData({ currentPrize })
        // 转动转盘
        this.selectComponent('#turntable').startTurning(data.id)
      } else {
        this.setData({ isRunning: false })
        mainService.modal(errmsg)
      }
    })
  },
  // 转盘结束转动：更新积分余额，已玩次数，可分享次数；
  onTurnEnd() {
    this.getTurntableData(false)

    setTimeout(() => {
      const { currentPrize } = this.data
      if (!currentPrize) return
      const awardType = currentPrize.awardType
      if (awardType == 3) {
        this.notWinning()
      } else {
        let prizeTxt = `获得了${currentPrize.text}`
        if (awardType == 1) { prizeTxt += '一张' }
        this.winning(prizeTxt)
      }
      this.setData({ currentPrize: null, isRunning: false })
    }, 1000);
  },

  winning(prizeTxt) {
    this.selectComponent('#prizeModal').showModal({
      title: '恭喜您！',
      content: prizeTxt,
      showCancel: false,
      confirmTxtSize: 'sm',
      confirmTxt: '邀请好友再得抽奖机会',
      confirmType: 'share'
    })
  },

  notWinning() {
    this.selectComponent('#prizeModal').showModal({
      title: '非常遗憾',
      content: '您未获得奖品',
      showCancel: false,
      confirmTxt: '邀请好友再得抽奖机会',
      confirmTxtSize: 'sm',
      confirmType: 'share'
    })
  },
  
  openRuleModal() {
    if (this.data.isRunning) return

    this.selectComponent('#ruleModal').showModal({
      hasCloseBtn: true
    })
  },

  toPrizePage() {
    if (this.data.isRunning) return

    mainService.link(`${pathModel.pt_point_prize}?id=${this.data.activityId}`)
  },

})