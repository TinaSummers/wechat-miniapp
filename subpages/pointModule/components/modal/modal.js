/**
 * @param {boolean} isCustom 模态框内容区域是否自定义, 为true时，自定义内容在插槽区域显示
 * option 属性:
 * @param {string} title 标题
 * @param {string} content 模态框内容
 * @param {string} confirmType 确认按钮 open-type
 * @param {string} confirmTxt 确认按钮文字
 * @param {string} cancelTxt 取消按钮文字
 * @param {boolean} showCancel 是否显示取消按钮
 * @param {boolean} hasCloseBtn 右上角是否有关闭按钮
 * @param {function} confirm 确认按钮回调函数
 * @param {function} cancel 起效按钮回调函数
 */

const DEFAULT_OPTION = {
  title: '',
  content: '',
  confirmTxt: '确定',
  cancelTxt: '取消',
  showCancel: true,
  confirmTxtSize: 'normal',
  confirmType: ''
}

Component({
  /**
   * Component properties
   */
  properties: {
    isCustom: {
      type: Boolean,
      value: false
    },
    hasCloseBtn: {
      type: Boolean,
      value: false
    }
  },

  data: {
    closeBtn: './close_btn.png',
    title: '',
    content: '',
    cancelTxt: DEFAULT_OPTION.cancelTxt,
    confirmTxt: DEFAULT_OPTION.confirmTxt,
    hasCloseBtn: false,
    isShowModal: false,
    confirmType: ''
  },

  methods: {
    _cancel() {
      this.cancelCb && this.cancelCb()

      this._closeModal()
      this.triggerEvent('cancel')
    },
    _confirm() {
      this.confirmCb && this.confirmCb()

      this._closeModal()
      this.triggerEvent('confirm')
    },
    _closeModal() {
      this.setData({ isShowModal: false })
    },
    showModal(option = DEFAULT_OPTION) {
      this.confirmCb = option.confirm || null
      this.cancelCb = option.cancel || null

      const hasCloseBtn = option.hasCloseBtn !== undefined ? option.hasCloseBtn : this.data.hasCloseBtn

      this.setData({ 
        isShowModal: true,
        cancelTxt: option.cancelTxt || DEFAULT_OPTION.cancelTxt,
        confirmTxt: option.confirmTxt || DEFAULT_OPTION.confirmTxt,
        confirmTxtSize: option.confirmTxtSize || DEFAULT_OPTION.confirmTxtSize,
        title: option.title || '',
        content: option.content || '',
        hasCloseBtn,
        showCancel: option.showCancel == undefined ? DEFAULT_OPTION.showCancel : option.showCancel,
        confirmType: option.confirmType ||  DEFAULT_OPTION.confirmType
      })
    }
  }
})
