import mainService from '../../../../services/main.service';
import memberService from '../../../../pages/memberModule/services/member.service';
import imgModel from '../../models/img.model';
import DrawService from './draw.service';
import configModel from '../../../../models/config.model';

Page({
  data: {
    navHeight: 0,
    imgModel,
    isOpenSetting: false, // 是否打开设置
    isBigScreen: mainService.judgeBigScreen(), // 判断大小屏幕
    qrcodeObj: { // 配置太阳码
      path: 'pages/homeModule/pages/index/index', // 分享路径
      scene: 666, // 分享场景值
      width: 430, // 太阳码大小
    },
    posterUrl: '', // 海报图片
    configArr: [
      {
        palette: {},
        banner: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566995239&di=d7c1eba0860f9e84dd995acdf4995b93&imgtype=jpg&er=1&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201504%2F22%2F20150422H5459_KSVjy.jpeg',
        qrcode: '',
      },
      {
        palette: {},
        banner: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566218379437&di=5bdc6dbf9b8a5bad0eccd9521e8a96dd&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201601%2F29%2F20160129154307_xt4A2.thumb.700_0.jpeg',
        qrcode: '',
      },
    ], // 生成海报的配置集合
    swiperArr: [], // 轮播图的展示集合
  },
  onLoad(options) {
    this.setNav();
    this.initOpenSetting();
    memberService.initMiniProgram(() => {
      this.painterDraw();
    });
  },
  onShow() { },
  setNav() {
    this.selectComponent('#comp-nav-dynamic').setOptions({
      navBackgroundInit: '#ffffff', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#000000', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 文本颜色-初始值 16进制
      titleColorRoll: '#ffffff', // 文本颜色-滚动值 16进制
      titleTextInit: '海报组件', // 标题文字-初始值
      titleTextRoll: '滚动标题', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 0, // 最小滚动间距，单位px
      scrollMax: 200, // 最大滚动间距，单位px
      homeShow: true, // home图标是否显示
      homeJudgeStack: false, // home图标显示是否判断页面栈
      homePath: '/pages/homeModule/pages/index/index', // home页面路径
      homeColorInit: 'black', // home图标颜色-初始值 white / black
      homeColorRoll: 'white', // home图标颜色-滚动值 white / black
    })
    this.setData({
      navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight(),
    })
  },
  painterDraw() {
    // 绘制海报
    let qrcode = `${configModel.apiUrl}/api-sys/miniapp-b-qrcode?scene=${this.data.qrcodeObj.scene}&appid=${configModel.miniAppid}&page=${this.data.qrcodeObj.path}&width=${this.data.qrcodeObj.width}`;

    // 更新configArr数据
    this.data.configArr.forEach((item, key) => {
      item.qrcode = qrcode;
      item.palette = new DrawService().draw(item);
    })
    this.setData({
      configArr: this.data.configArr,
    })
  },
  painterSuccessHandle(e) {
    console.log(e, 'painterSuccessHandle');
    let index = e.target.dataset.index;
    let posterUrl = e.detail.path;
    this.setData({
      [`swiperArr[${index}]`]: posterUrl,
    })
    if (index == 0) {
      this.setData({
        posterUrl,
      })
    }
  },
  painterFailHandle(e) {
    console.log(e, 'painterFailHandle');
  },
  swiperChange(e) {
    let { detail: { current } } = e;
    this.setData({
      posterUrl: this.data.swiperArr[current],
    })
  },
  saveImageHandle() {
    // 保存图片的回调
    mainService.throttle(() => {
      wx.getSetting({
        success: (res) => {
          console.log(res, '获取授权列表成功');
          let authorize = res.authSetting['scope.writePhotosAlbum'] ? true : false;
          switch (authorize) {
            case true:
              this.saveImageToPhotosAlbum();
              break;
            case false:
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => {
                  this.saveImageToPhotosAlbum();
                },
                fail: () => {
                  this.setData({
                    isOpenSetting: true,
                  })
                }
              })
              break;
          }
        },
        fail: (err) => {
          console.log(err, '获取授权列表失败');
        }
      })
    }, 2000)
  },
  initOpenSetting() {
    // 是否需要开发设置初始化
    mainService.throttle(() => {
      wx.getSetting({
        success: (res) => {
          console.log(res.authSetting, '已授权列表');
          let authList = res.authSetting;
          let isOpenSetting = false;
          if (authList.hasOwnProperty('scope.writePhotosAlbum') && !authList['scope.writePhotosAlbum']) {
            isOpenSetting = true;
          } else {
            isOpenSetting = false;
          }
          this.setData({
            isOpenSetting,
          })
        }
      })
    }, 2000)
  },
  openSettingHandle(e) {
    // 打开手机授权设置
    this.setData({
      isOpenSetting: e.detail.authSetting['scope.writePhotosAlbum'] ? false : true
    })
  },
  saveImageToPhotosAlbum() {
    // 下载图片
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterUrl,
      success: () => {
        mainService.toast('保存成功');
      },
      fail: () => {
        mainService.toast('保存失败');
      }
    })
  },
  onPageScroll(e) {
    this.selectComponent('#comp-nav-dynamic').scrollHandle(e.scrollTop);
  },
  onShareAppMessage() {
    return mainService.shareInfo();
  }
})