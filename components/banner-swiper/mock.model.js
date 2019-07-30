let mockData = [
  {
    imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557897135467&di=4cfe8a2a73682252f80a34e444c319e8&imgtype=0&src=http%3A%2F%2Fk.zol-img.com.cn%2Fsjbbs%2F7692%2Fa7691515_s.jpg',
    jumpType: 1, // 跳转类型 0-无 1-跳转小程序内部页面 2 - 跳转h5; 3 - 跳转其他小程序
    jumpUrl: '/pages/memberModule/pages/index/index', // 跳转路径
    webvidePath: '', // h5跳转所需的承载页面
    appId: '' // 跳转其他小程序的小程序id
  }
]

/* 跳转参数详情 参考 Component - navigation */

export default mockData;