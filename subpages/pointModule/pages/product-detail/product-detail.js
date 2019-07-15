import imgModel from '../../models/img.model'
import ajaxService from '../../services/ajax.service';
import utilService from '../../services/util.service';

import memberService from '../../../../pages/memberModule/services/member.service';
import mainService from '../../../../services/main.service';
import pathModel from '../../../../models/path.model';

Page({
  data: {
    imgModel,
    pId: 0, // 商品id
    pImgs: [],
    pTitle: '', // 商品
    pMarketVal: '', // 市场参考价
    point: 0, // 积分
    detail: '', // 商品详情富文本
    modalEle: null //模态框组件
  },

  onLoad: function (options) {
    const modalEle = this.selectComponent('#compModal')
    this.setNav()
    this.setData({
      pId: options.id,
      modalEle
    })
  },

  onShow: function () {
    memberService.initJudgeJump(() => {
      this.getProductDetail()
    })
  },

  onShareAppMessage: function () {
    return mainService.shareInfo()
  },

  setNav() {
    this.selectComponent('#compNavDynamic').setOptions({
      navBackgroundInit: 'transparent', // 导航栏背景颜色-初始值
      navBackgroundRoll: 'transparent', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 标题颜色-初始值 16进制
      titleColorRoll: '#000000', // 标题颜色-滚动值 16进制
      titleTextInit: '商品详情', // 标题文字-初始值
      titleTextRoll: '', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
    });
  },

  getProductDetail() {
    const id = this.data.pId
    ajaxService.getProductDetail({ id }).then(res => {
      const { errcode, errmsg, data } = res
      if (!errcode && data) {
        const pImgs = data.image_list.map(imgUrl => {
          return {
            imgUrl,
            jumpType: 1
          }
        })
        this.setData({
          pId: data.id || '',
          pTitle: data.title || '',
          pImgs,
          pMarketVal: utilService.formatPirze(data.prize),
          point: data.cost,
          detail: data.description || ''
        })
      } else {
        mainService.modal(errmsg)
      }
    })
  },
  // 积分兑换商品
  exchange(e) {
    memberService.saveFormId(e)

    this.judgeIsMember()
  },
  judgeIsMember() {
    this.selectComponent('#compRegister').openHandle({
      success: () => {
        // 入会成功， 可兑换
        this.data.modalEle.showModal({
          content: '你确认兑换该商品?',
          confirm: () => {
            this.confirmExchange()
          }
        })
      }
    })
  },
  confirmExchange() {
    const pId = this.data.pId
    const params = { gift_id: pId }
    ajaxService.pointExchange(params).then(res => {
      const { errcode, errmsg, data } = res
      let title = '兑换成功', content = '可以在优惠券中查看', showCancel = true
    
      if (errcode) {
        title = '兑换失败'
        content = errmsg
        showCancel = false
      }
      this.data.modalEle.showModal({
        title,
        content,
        showCancel,
        confirm: () => {
          if (!errcode) {
            mainService.link(pathModel.mc_coupon)
          }
        }
      })
    })
  },
})