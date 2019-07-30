/**
 * -- 带链接的图片预处理组件 --
 * properties - imgData
 * @param {string} url 图片路径
 * @param {string} width 图片宽度
 * @param {string} height 图片高度
 * @param {string} mode 图片裁剪/缩放模式 - 参看原生image标签mode合法值
 * properties - linkData -> 参看Component - navigation的参数
 */

Component({
  /**
   * Component properties
   */
  properties: {
    imgData: {
      type: Object,
      value: {
        url: '',
        width: '750',
        height: '300'
      }
    },
    linkData: {
      type: Object,
      value: {
        type: 0,
        url: ''
      }
    }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {

  }
})
