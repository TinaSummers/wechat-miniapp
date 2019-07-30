/**
 * @description 刮刮乐游戏逻辑部分
 * @author pfan
 * 
 * 问题：
 * 1.drawImage 与 clearRect 清除展示移动端和模拟器不一致
 * 2.小程序无globalCompositeOperation = 'destination-out'属性
 * 3.小程序无getImageData, 使用canvasGetImageData获取像素点对比擦除范围
 * 4.小程序canvas绘制图片，真机要正常展示需要使用https协议的图片， http或相对路径微信小程序工具可以展示
 * 遗留问题：图片画的问题
 *使用 downloadFile 这种方式来先加载图片再绘制
 * 问题: 无法监测canvas是否渲染完成且渲染有效图像
 * 检测canvas透明像素个数，若等于总像素点默认未完成绘图
 * 未完成绘图时使用 image 占位；
 *
 * * 调用方式：
 * 
 * 例如：import Scratch from "./utils/scratch.js"
 * 
 * wxml 文件需要引入 scratch.wxml
 * 例如：<import src="utils/scratch.wxml" />
 *      <template is = "scratch" data = "{{scratch, isScroll}}"></template> 
 * 
 * js 中调用
 *   maskColor 和 imageResource 都存在时，优先绘制图片
 *  this.scratch = new Scratch(this, {
 *    openingRatio: 0.5, // 开奖 擦除比；默认为0.5
 *    canvasWidth: 400,   //画布宽度 rpx
 *    canvasHeight: 150,  //画布高度 rpx
 *    imageResource: './images/placeholder.png', //画布背景
 *    r: 4, //笔触半径
 *    awardTxt: '中大奖', //底部抽奖文字
 *    awardTxtColor: "#1AAD16", //画布颜色
 *    awardTxtFontSize: "24px", //文字字体大小
 *    maskColor: "red",
 *    callback: () => {
 *      // 清除画布回调
 *    },
 *    onCoatingImgLoad: () => {
 *      // 涂层图片onload事件
 *    }
 *  })
 */

export default class Scratch {
  constructor(pageContext, opts) {
    this.page = pageContext;
    this.init(opts);

    this.page.touchStart = this.touchStart.bind(this);
    this.page.touchMove = this.touchMove.bind(this);
    this.page.touchEnd = this.touchEnd.bind(this);
  }
  // 初始化值
  init(opts = null) {
    this.isStart = false;
    if (opts) {
      this.openingRatio = opts.openingRatio || 0.5;
      this.canvasWidth = opts.canvasWidth;
      this.canvasHeight = opts.canvasHeight;
      this.imageResource = opts.imageResource;
      this.maskColor = opts.maskColor;
      this.r = opts.r || 8;
      this.endCallBack = opts.callback;
      this.onCoatingImgLoad = opts.onCoatingImgLoad;
      this.tPx = 0;
      this.allPx = 0;

      // 页面所用数据
      this.page.setData({
        scratch: {
          "awardTxt": opts.awardTxt,
          "awardTxtColor": opts.awardTxtColor,
          "awardTxtFontSize": opts.awardTxtFontSize,
          "awardTxtLineHeight": opts.canvasHeight,
          "width": opts.canvasWidth,
          "height": opts.canvasHeight,
          "imageResource": opts.imageResource,
          "showTempImg": true
        },
        "isScroll": true
      });
    }

    this.coatingInit();
  }
  // 刮奖涂层初始化
  coatingInit() {
    let { canvasWidth, canvasHeight } = this;
    const self = this;
    // 根据 rpx 值 和设备dpr获取px值: 涂层绘制区域大小
    if (wx.canIUse('getSystemInfo')) {
      wx.getSystemInfo({
        success: (res) => {
          const percent = res.screenWidth / 750;
          self.pxWidth = Math.floor(canvasWidth * percent);
          self.pxHeight = Math.floor(canvasHeight * percent);
          self.drawCoating();
        }
      });
    } else {
      self.drawCoating();
    }
  }
  // 绘制涂层
  drawCoating() {
    const { pxWidth, pxHeight, imageResource, maskColor } = this;
    const self = this;
    this.ctx = wx.createCanvasContext('scratch');
    this.ctx.clearRect(0, 0, pxWidth, pxWidth);
  
    if (imageResource && imageResource != '') {
      wx.downloadFile({
        url: imageResource,
        success: (res) => {
          self.ctx.drawImage(res.tempFilePath, 0, 0, pxWidth, pxHeight);
          self.ctx.draw();
          self.onCoatingImgLoad && self.onCoatingImgLoad();
        }
      });
    } else {
      self.ctx.setFillStyle(maskColor);
      self.ctx.fillRect(0, 0, pxWidth, pxHeight);
      self.ctx.draw();
    }
  }

  drawRect(x, y) {
    let { r } = this;
    let x1 = x - r > 0 ? x - r : 0;
    let y1 = y - r > 0 ? y - r : 0;
    return [x1, y1, 2 * r];
  }

  start() {
    this.isStart = true;
    this.page.setData({
      "isScroll": false
    });
  }

  restart() {
    this.coatingInit();
    this.isStart = true;
    this.page.setData({
      "isScroll": false
    });
  }

  touchStart(e) {
    if (!this.isStart) return
    if (this.page.data.scratch.showTempImg) {
      this.getTransparentPx(() => {
        // 画布非空才将临时图片清除
        if (this.allPx && this.tPx != this.allPx) {
          const scratch = this.page.data.scratch;
          scratch.showTempImg = false;
          this.page.setData({ scratch });
        }
      });
    }
    let pos = this.drawRect(e.touches[0].x, e.touches[0].y);
    this.ctx.clearRect(pos[0], pos[1], pos[2], pos[2]);
    this.ctx.draw(true);
  }

  touchMove(e) {
    if (!this.isStart) return
    let pos = this.drawRect(e.touches[0].x, e.touches[0].y);
    this.ctx.clearRect(pos[0], pos[1], pos[2], pos[2]);
    this.ctx.draw(true);
  }

  touchEnd(e) {
    if (!this.isStart) return
    // 画布无任何图像，即画布未渲染完成
    if (this.allPx && this.tPx == this.allPx) return

    this.getTransparentPx(() => {
      if (this.tPx >= this.allPx * this.openingRatio) {
        this.ctx.draw();
        this.endCallBack && this.endCallBack();
        this.isStart = false;
        this.page.setData({
          "isScroll": true
        });
      }
    });
  }

  // 获取canvas透明像素点
  getTransparentPx(cb) {
    const width = this.pxWidth;
    const height = this.pxHeight;
    const self = this;
    
    wx.canvasGetImageData({
      canvasId: 'scratch',
      x: 0,
      y: 0,
      width,
      height,
      success(res) {
        const allPx = res.width * res.height; // 像素点个数
        let tPx = 0; // 透明像素点
        // 计算擦除像素点: 每四个值为一组rgba，第四个值为透明度；透明度为0则为被擦除像素
        for (let i = 0; i < allPx; i++) {
          if (res.data[i * 4 + 3] == 0) {
            tPx++;
          }
        }

        self.tPx = tPx;
        self.allPx = allPx;

        cb && cb();
      }
    });
  }

  reset(opts) {
    this.init(opts);
  }
  
}
