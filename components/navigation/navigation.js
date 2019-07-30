/**
 * -- 链接组件，页面内容可自定义 -- 
 *  linkData
 * @param {number} type 点击图片跳转类型 0 - 无跳转; 1 - 小程序内部页面; 2 - 跳转h5; 3 - 跳转其他小程序
 * @param {number} navType 内部跳转小程序时的跳转类型，值参考mainService.link 的参数type
 * @param {string} url 跳转路径
 * @param {string} webviewPath h5页面跳转所需 webview 页面链接，h5跳转时必填此选项, webview 页面取localStorage的 webviewUrl 字段
 *  eg:
 *  - 内部页面或跳转其他小程序 url：'/pages/homeModule/pages/index/index'
 *  - h5 url: 'https://www.baidu.com'
 * @param {string} appId 跳转其他的小程序的小程序id
 */
import mainService from '../../services/main.service'

Component({
  properties: {
    type: {
      type: Number,
      value: 0
    },
    navType: {
      type: Number,
      value: 0
    },
    url: {
      type: String,
      value: ''
    },
    webviewPath: {
      type: String,
      value: ''
    },
    appId: {
      type: String,
      value: ''
    }
  },

  data: {},

  methods: {
    navigate() {
      let { type, url, navType, webviewPath } = this.data

      switch (type) {
        case 1:
          // 跳转内部页面
          if( mainService.isTabPage(url)) navType = 3

          mainService.link(url, navType)
          break
        case 2:
          // 跳转h5
          if (!webviewPath) break
          wx.setStorageSync('webviewUrl', url)
          mainService.link(webviewPath)
          break
        case 3:
          // 跳转其他小程序
          this._navigateToMiniProgram()
          break
        default:
          // 默认无跳转
          return
      }
    }
  },
  _navigateToMiniProgram() {
    const { url, appId } = this.data
    if (!appId) return

    let path = url.replace(/^[\/]{1}/, '')

    wx.navigateToMiniProgram({
      appId,
      path
    })
  }
})
