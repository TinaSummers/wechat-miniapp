import imgModel from '../../models/img.model';
import ajaxService from '../../services/ajax.service';
import utilService from '../../services/util.service';

import mainService from '../../../../services/main.service';
import pathModel from '../../../../models/path.model';
import memberService from '../../../../pages/memberModule/services/member.service';
import userModel from '../../../../pages/memberModule/models/user.model';

const PRODUCT = 'product', RECODE = 'recode';

Page({
  data: {
    PRODUCT,
    RECODE,
    imgModel,
    balance: 0, // 积分余额
    tabs: [
      { id: PRODUCT, text: '兑换代金券' },
      { id: RECODE, text: '兑换记录' }
    ],
    currentTab: 'product',
    list: null,
    currntPage: 1,
    isEnd: false,
    loading: false, // 请求列表中
  },
  onLoad: function (options) {
    this.setNav()
  },
  onShow: function () {
    memberService.initJudgeJump(() => {
      this.updateList('refresh')
      this.getPointBalance()
    })
  },
  onReachBottom: function () {
    if (this.data.isEnd) return
    
    this.updateList()
  },
  onShareAppMessage: function () {
    return mainService.shareInfo()
  },
  
  setNav() {
    this.selectComponent('#compNavDynamic').setOptions({
      navBackgroundInit: 'transparent', // 导航栏背景颜色-初始值
      navBackgroundRoll: 'transparent', // 导航栏背景颜色-滚动值
      titleColorInit: '#ffffff', // 标题颜色-初始值 16进制
      titleColorRoll: '#000000', // 标题颜色-滚动值 16进制
      titleTextInit: '', // 标题文字-初始值
      titleTextRoll: '', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
    });

  },
  /** 获取积分余额 */
  getPointBalance() {
    memberService.getMemberDetail(() => {
      this.setData({ balance: userModel.point })
    })
  },
  /** 切换导航栏 */
  changeTab(e) {
    // 当前列表请求未返回不允许切换tab
    if (this.data.loading) return

    const id = e.currentTarget.dataset.id;

    this.setData({ currentTab: id });
    this.updateList('refresh');
  },
  updateList(type) {
    if (this.data.loading) return

    if (type == 'refresh') {
      this.data.list = null
      this.data.currentPage = 1
      this.data.isEnd = false
    }

    this.selectComponent('#compRegister').openHandle({
      success: () => {
        // 入会成功， 可查询
        if (this.data.currentTab == PRODUCT) {
          this.getProductList()
        } else {
          this.getRecodeList(type) 
        }
      }
    })
  },
  /** 获取积分商品列表 */
  getProductList() {
    this.data.loading = true
    ajaxService.getProductList({}).then(res => {
      this.data.loading = false

      const { errcode, errmsg, data } = res
      if (!errcode) {
        const transferedList = this.transferProductList(data.items)
        
        // 接口未分页
        this.setData({
          currentPage: 1,
          isEnd: true,
          list: transferedList
        })
      } else {
        mainService.modal(errmsg)
      }
    }) 
  },
  /** 获取兑换记录列表 */
  getRecodeList(type) {
    this.data.loading = true
    let currentPage = this.data.currentPage
    const params = { page: currentPage }

    ajaxService.getRecodeList(params).then(res => {
      this.data.loading = false

      const { errcode, errmsg, data } = res
      if (!errcode) {
        currentPage = data.current_page
        currentPage++;
        const isEnd = currentPage > data.last_page
        const list = (type == 'refresh' || !this.data.list) ? [] : this.data.list
        const transferedList = this.transferRecodeList(data.data)

        this.setData({
          currentPage,
          isEnd,
          list: list.concat(transferedList)
        })
      } else {
        mainService.modal(errmsg)
      }
    }) 
  },
  /**
   * 转换积分商品数据
   * @param {*Array} list 
   */
  transferProductList(list = []) {
    const transfered = list.map(item => {
      return item.details.map(product => {
        const gift = product.gift
        return { 
          ...gift,
          dec: gift.title,
          marketVal: utilService.formatPirze(gift.prize),
          point: gift.cost,
          img: gift.cover_image
        }
      })
    })
    // 二维数组拍平
    return [].concat(...transfered)
  },
  /**
   * 转换兑换记录数据
   * @param {*array} list 
   */
  transferRecodeList(list = []) {
    return list.map(item => {
      const gift = item.gift || {}
      const product = {
        dec: gift.title,
        marketVal: utilService.formatPirze(gift.prize),
        img: gift.cover_image || '',
        stock: gift.stock || 0
      }
      const dateObj = new Date((item.created_at).replace(/-/g,"/"))
      
      return {
        product,
        createTime: utilService.gethm(dateObj),
        createDate: utilService.format(dateObj, 'yyyy/MM/dd'),
        point: item.cost_integral
      }
    })
  },
  /** 页面跳转 */ 
  toProductDetail(e) {
    const id = e.currentTarget.dataset.id
    mainService.link(`${pathModel.pt_product_detail}?id=${id}`)
  },
  toPointPage() {
    mainService.link(`${pathModel.pt_point}`)
  },
  toTurntablePage() {
    mainService.link(`${pathModel.pt_turntable}`)
  }
})