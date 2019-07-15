import mainService from '../../../../services/main.service'

Page({
  data: {
    navHeight: 0
  },

  onLoad: function (options) {
    this.setNav()
  },
  onShow: function () {

  },
  onShareAppMessage: function () {
    return mainService.shareInfo()
  },

  setNav() {
    const navEle = this.selectComponent('#compNavDynamic')
    navEle.setOptions({
      navBackgroundInit: '#ffffff', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 标题颜色-初始值 16进制
      titleColorRoll: '#000000', // 标题颜色-滚动值 16进制
      titleTextInit: '积分规则', // 标题文字-初始值
      titleTextRoll: '', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
    })

    const navHeight = navEle.getNavHeight()
    this.setData({ navHeight })
  }
})