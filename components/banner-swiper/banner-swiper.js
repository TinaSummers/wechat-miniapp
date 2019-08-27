/**
 * 传入属性：
 * @param {number} width 组件宽度rpx
 * @param {array} renderDetail 渲染详情
 */

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 组件的对外属性
    width: {
      type: Number,
      value: 750,
    },
    renderDetail: {
      type: Array,
      value: [],
    },
    'indicator-dots': {
      type: Boolean,
      value: false,
    },
    autoplay: {
      type: Boolean,
      value: false,
    },
    circular: {
      type: Boolean,
      value: false,
    },
    circular: {
      type: Boolean,
      value: false,
    },
    interval: {
      type: Number,
      value: 5000,
    },
    duration: {
      type: Number,
      value: 500,
    },
  },
  data: {
    imgHeights: [], // 图片的高度列表
    currHeight: 0, // 当前swiper高度
  },
  attached() { },
  methods: {
    imageLoad(e) {
      let { currentTarget: { dataset: { index } } } = e;
      // 获取图片真实宽度
      var width = e.detail.width; // 图片真实宽
      var height = e.detail.height; // 图片真实高
      var viewHeight = 750 * height / width; // 图片小程序高
      this.data.imgHeights[index] = viewHeight;
      if (index == 0) {
        // 初始化第一个
        this.setData({
          currHeight: viewHeight,
        })
      }
    },
    swiperChange(e) {
      let { detail: { current } } = e;
      this.setData({
        currHeight: this.data.imgHeights[current] ? this.data.imgHeights[current] : 600,
      })
      this.triggerEvent('change', e.detail);
    }
  }
})