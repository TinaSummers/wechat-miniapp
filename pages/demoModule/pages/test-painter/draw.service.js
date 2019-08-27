import mainService from '../../../../services/main.service';
let isBigScreen = mainService.judgeBigScreen();

class DrawService {
  constructor() { }

  draw(config) {
    return {
      background: `#ffffff`,
      width: `${isBigScreen ? 687 : 600}rpx`,
      height: `${isBigScreen ? 981 : 875}rpx`,
      borderRadius: `10rpx`,
      views: [
        {
          type: `image`,
          url: config.banner,
          css: {
            top: `0rpx`,
            left: `0rpx`,
            width: `${isBigScreen ? 687 : 600}rpx`,
            height: `${isBigScreen ? 831 : 725}rpx`,
          },
        },
        {
          type: `rect`,
          css: {
            top: `${isBigScreen ? 831 : 725}rpx`,
            left: `0rpx`,
            width: `${isBigScreen ? 687 : 600}rpx`,
            height: `150rpx`,
            color: `#ffffff`,
          },
        },
        {
          type: `text`,
          text: `风萧萧兮易水寒，遥看瀑布挂前川`,
          css: {
            top: `${isBigScreen ? 876 : 770}rpx`,
            right: `180rpx`,
            color: `#11143d`,
            fontSize: `26rpx`,
          },
        },
        {
          type: `text`,
          text: `借问酒家何处有，英雄难过美人关`,
          css: {
            top: `${isBigScreen ? 906 : 800}rpx`,
            right: `180rpx`,
            color: `#11143d`,
            fontSize: `26rpx`,
          },
        },
        {
          type: `image`,
          url: config.qrcode,
          css: {
            top: `${isBigScreen ? 842 : 736}rpx`,
            right: `30rpx`,
            width: `128rpx`,
            height: `128rpx`,
          },
        },
      ],
    }
  }
}

export default DrawService;