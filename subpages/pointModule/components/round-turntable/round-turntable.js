/**
 * @param {number} size 转盘直径大小
 * @param {array} prizes 转盘奖品组，最大个数为12个，最小个数为3个
 * --- prize ---
 * -- @param {number} id 奖品标识id
 * -- @param {string} imgUrl 奖品图片
 * -- @param {string} title 奖品标题
 * -- @param {string} subtitle 奖品副标题
 * @param {array} colors 转盘奖品格子背景颜色组
 */
Component({
  options: {
    multipleSlots: true
  },
  externalClasses: ['custom-class'],
  properties: {
    size: {
      type: Number,
      value: 600
    },
    prizes: {
      type: Array,
      value: [],
      observer(val) {
        this.setData({ prizeCount: val.length || 0 })
        this._setBoxBg()
      }
    },
    colors: {
      type: Array,
      value: ['#fff', '#f7f4f2'],
      observer(val) {
        if (val) {
          this._setBoxBg()
        }
      }
    }
  },

  data: {
    prizeCount: 0,
    stripeColors: [],
    prizeId: 0,
    resultDeg: 0, // 停止位置角度
    turnTotalDeg: 0, // 动画期间转动角度
    transition: 'none'
  },

  methods: {
    startTurning(prizeId = 0) {
      const prizeIndex = this.data.prizes.findIndex(prize => prize.id == prizeId)
      const { prizeCount } = this.data
      const stepDeg = 360 / prizeCount
      const resultDeg = 360 - stepDeg * prizeIndex + stepDeg / 2
  
      this.setData({
        resultDeg,
        turnTotalDeg: prizeCount * 360 + resultDeg,
        transition: 'all 5s'
      })

      setTimeout(() => { this._turningEnd() }, 5000)
    },
    _turningEnd() {
      const resultDeg = this.data.resultDeg
      this.setData({
        turnTotalDeg: resultDeg,
        transition: 'none'
      })
      this.triggerEvent('turnend')
    },
    // 根据颜色组和奖品个数分配转盘格子背景色
    _setBoxBg() {
      let stripeColors = [], index = 0
      const { prizeCount, colors } = this.data
      if (prizeCount && colors.length) {
        let point = 0
        while (index < prizeCount) {
          if (point > colors.length - 1) { point = 0 }
          stripeColors.push(colors[point])

          index++
          point++
        }

        this.setData({ stripeColors })
      }
    }
  }
})
