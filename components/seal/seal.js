/**
 * 盖章组件
 */
const TRIANGLE_GIRTH_MAX = 650;
const TRIANGLE_GIRTH_MIN = 450;
const PENTAGON_DELTA = 20;
const ALARM_PATH = 'https://alioss.woaap.com/base/alarm.mp3';

Component({
  properties: {
    /**
     * 校验成功动画时间
     */
    coverTime: {
      type: Number,
      value: 3000
    },
    /**
     * 印章类型 1：五触点；2：三触点
     */
    sealType: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hidden: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 检查印章敲章是否成功
     * @param {Event} events 印章 touch events
     * @param {Function} callback 回调函数
     */
    checkSeal(events, callback) {
      const that = this;
      const touches = events.touches || [];
      switch (true) {
        case !that.data.hidden:
          console.log('正在校验印章');
          break;
        case (touches.length > 2):
          if (that.checkSign(touches, that.data.sealType)) {
            that.setData({
              hidden: false
            })
            // 震动、播放音频
            const innerAudioContext = wx.createInnerAudioContext();
            innerAudioContext.src = ALARM_PATH;
            innerAudioContext.play();
            wx.vibrateShort();
            // 关闭弹层
            setTimeout(() => {
              that.setData({
                hidden: true
              })
            }, that.data.coverTime);
            callback({
              errCode: 0,
              errMsg: '校验成功'
            });
          } else {
            callback({
              errCode: -1,
              errMsg: '印章校验失败'
            });
          }
          break;
        default:
          console.log('未识别到印章');
          break;
      }
    },
    /**
     * 校验印章
     * @param {Array} touches 印章触点坐标数组
     * @param {Number} type 印章类型
     * @returns 印章真假
     */
    checkSign(touches, type) {
      let delta = 0;
      let result = false;
      if (touches.length == 3 && type == 2) {
        delta = this.totalLong(touches);
        if (delta > TRIANGLE_GIRTH_MIN && delta < TRIANGLE_GIRTH_MAX) {
          result = true;
        }
      } else if (touches.length == 4 && type == 1) {
        const arr = touches;
        const a = this.distanceCAL(arr[0], arr[1]);
        const b = this.distanceCAL(arr[0], arr[2]);
        const c = this.distanceCAL(arr[1], arr[2]);
        const d = this.distanceCAL(arr[0], arr[3]);
        const e = this.distanceCAL(arr[1], arr[3]);
        const f = this.distanceCAL(arr[2], arr[3]);
        const _a = [a, b, c, d, e, f];
        _a.sort((a, b) => a - b);
        if (Math.abs(_a[0] - _a[1]) < PENTAGON_DELTA && Math.abs(_a[2] - _a[1]) < PENTAGON_DELTA && Math.abs(_a[0] - _a[2]) < PENTAGON_DELTA) {
          if (Math.abs(_a[3] - _a[4]) < PENTAGON_DELTA && Math.abs(_a[3] - _a[5]) < PENTAGON_DELTA && Math.abs(_a[5] - _a[4]) < PENTAGON_DELTA) {
            result = true;
          }
        }
      }
      return result;
    },
    /**
     * 计算两点距离
     * @param {*} a 坐标a
     * @param {*} b 坐标b
     * @returns 距离
     */
    distanceCAL(a, b) {
      const scale = 1;
      const x1 = scale * (a.clientX);
      const y1 = scale * (a.clientY);
      const x2 = scale * (b.clientX);
      const y2 = scale * (b.clientY);
      const calX = x2 - x1;
      const calY = y2 - y1;
      return Math.pow(((calX * calX) + (calY * calY)), 0.5);
    },
    /**
     * 计算三角形周长
     * @param {*} arr 坐标数组
     */
    totalLong(arr) {
      const a = this.distanceCAL(arr[0], arr[1]);
      const b = this.distanceCAL(arr[0], arr[2]);
      const c = this.distanceCAL(arr[1], arr[2]);
      console.log(a, b, c, a - b, b - c, a - c)
      if (Math.abs(a - b) < 15 && Math.abs(a - c) < 15 && Math.abs(b - c) < 15) {
        return a + b + c;
      }
      return 0;
    },
  }
})