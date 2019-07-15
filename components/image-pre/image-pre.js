/**
 * 图片预处理组件
 */
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    width: {
      type: String,
      value: '750',
    },
    height: {
      type: String,
      value: '300',
    },
    mode: {
      type: String,
      value: '',
    },
    src: {
      type: String,
      value: '',
    },
  },
  data: {
    imageLoaded: false, // 图片是否加载完成
  },
  attached() {},
  methods: {
    imageLoadHandle(e) {
      // 监听image加载完成
      setTimeout(()=>{
        this.setData({
          imageLoaded: true,
        })
      }, 200);
      this.triggerEvent('load', e.detail);
    },
  }
})