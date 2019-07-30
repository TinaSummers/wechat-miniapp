/**
 * -- video 组件优化(增加封面，画面正中播放图标等) --
 * @param {string} src 视频链接
 * @param {string} videoWidth 视频宽度 单位 - rpx
 * @param {boolean} isPlaying 视频是否播放
 * @param {string} coverImg 封面图片链接
 * 
 * event
 * videoPlay -- 视频播放事件
 * videoEnded -- 视频播放结束事件
 */
Component({
  properties: {
    src: {
      type: String,
      value: ''
    },
    videoWidth: {
      type: String,
      value: '600'
    },
    isPlaying: {
      type: Boolean,
      value: false
    },
    coverImg: {
      type: String,
      value: ''
    },
  },

  data: {
    videoContext: null
  },

  ready() {
    const videoContext = wx.createVideoContext('beautifyVideo', this);
    this.setData({ videoContext })
  },

  methods: {
    _videoPlay() {
      this.triggerEvent('videoPlay')
      this.data.videoContext.play()
      this.setData({ isPlaying: true })
    },
    _hiddenPlayIcon() {
      this.setData({ isPlaying: false })
    },
    _videoPause() {
      this._hiddenPlayIcon()
    },
    _videoEnded() {
      this.triggerEvent('videoEnded')
      this._hiddenPlayIcon()
    }
  }
})
