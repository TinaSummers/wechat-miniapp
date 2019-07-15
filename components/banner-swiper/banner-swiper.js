/**
 * 传入属性：
 * @param {number} width 组件宽度rpx
 * @param {array} renderDetail 渲染详情
 */
import mainService from '../../services/main.service';
import pathModel from '../../models/path.model';
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
      this.setData({
        imgHeights: this.data.imgHeights,
      })
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
    },
    jumpHandle(e) {
      let { currentTarget: { dataset: { item } } } = e;
      let jumpType = item.jumpType; // 跳转类型 1-无 2-跳转小程序内部页面 3-跳转H5
      switch (jumpType) {
        case 1:
          break;
        case 2:
          let miniUrl = item.miniUrl;
          if (!miniUrl) {
            return
          }
          miniUrl = miniUrl[0] == '/' ? miniUrl : '/' + miniUrl;
          let path = miniUrl.split('?')[0];
          if (mainService.isTabPage(path)) {
            mainService.link(miniUrl, 3);
          } else {
            mainService.link(miniUrl);
          }
          break;
        case 3:
          let h5Url = item.h5Url;
          if (!h5Url) {
            return
          }
          wx.setStorageSync('webviewUrl', h5Url);
          mainService.link(pathModel.mc_webview);
          break;
      }
    },
  }
})