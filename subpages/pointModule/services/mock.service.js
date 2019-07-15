
function createProduct(val, id) {
  const point = val == 5 ? 300 : val == 10 ? 500 : 800;
  const startDate = '2019/04/24', endDate = '2019/06/24';

  return {
    img: '/pages/pointModule/assets/images/coupon.png',
    largeImg: '/pages/pointModule/assets/images/coupon_bg.png',
    point,
    marketVal: val.toFixed(2),
    dec: `${val}元面值卓诗尼商城代金券`,
    stock: Math.floor(Math.random() * 1000 + 100),
    id,
    startDate,
    endDate,
    detail: `<p>这里是后台给的富文本</p>`
  }
}

function createProductList(pageSize = 10) {
  const vals = [5, 10, 20];

  const list = vals.map((val, index) => {
    return createProduct(val, index);
  })
  return list;
}

function createRecodeList(pageSize = 10) {
  const list = [];
  let i = 0;
  
  while (i < pageSize) {
    // 随机生成代金券
    let random = Math.floor(Math.random()*10);
    const val = random <= 3 ? 5 : random <= 6 ? 10 : 20;
    const product = createProduct(val, i);
  
    random = Math.floor(Math.random()*10);
    // 0: 待使用； 1： 已使用； 2: 已过期
    const status = random <= 3 ? 0 : random <= 6 ? 1 : 2;

    list.push({
      product,
      status,
      point: product.point
    });
    i++;
  }

  return list
}

function createPointRecode(type) {
  const list = []

  const randomNum = Math.ceil(Math.random()*10 + 20)
  let i = 0
  while (i < randomNum) {
    let itemType = type
    if (type == 0) {
      itemType = i%3 == 0 ? 1 : 2
    }
    const point = Math.ceil(Math.random()*100+ 5)
    list.push({
      type: itemType,
      point,
      dec: `积分描述:${itemType == 1 ? '获取' : '消耗'}`,
      date: new Date()
    })
    i++
  }

  return list
}

function createPointPrize() {
  const list = [], num = 10
  let i = 0
  while (i < num) {
    const randomType = Math.floor(Math.random()*10)
    const type = randomType <= 3 ? 'coupon' : randomType <= 6 ? 'point' : 'free'
    
    list.push({
      type,
      date: new Date(),
      dec: type == 'coupon' ? '优惠券' : type == 'point' ? '5积分' : '免费抽奖'
    })
    i++
  }
  return list
}

class MockHttpClient {
  _instance = null;
 
  constructor() {
    this.productList = [];
  }

  static get instance () {
    if (!this._instance) {
      this._instance = new MockHttpClient();
    }
    return this._instance;
  }

  request(config) {
    let target = {
      url: '',
      params: {}
    }

    Object.assign(target, config);
    if (target.loadingType != 0) {
      MockHttpClient.showLoading();
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config.loadingType != 0) {
          MockHttpClient.hideLoading();
        }
        resolve(MockHttpClient.createResponse(target));
      }, 500);
    });
  }

  static showLoading() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
  }

  static hideLoading() {
    wx.hideLoading();
  }

  static createResponse(target) {
    const resData = { errcode: 0, errmsg: '', data: {} }

    MockHttpClient[target.url](target.params, resData)

    return { data: resData }
  }

  static getRecodeList(params, resData) {
    const recodeList = createRecodeList(params.pageSize);
    resData.data = {
      current_page: params.page,
      last_page: 3,
      data: recodeList
    }
  }

  static getProductList(params, resData) {
    const productList = createProductList(params.pageSize);
    if (params.page == 1) {
      this.instance.productList = productList
    }
    resData.data = {
      current_page: params.page,
      last_page: 1,
      data: productList
    }
  }

  static getProductDetail(params, resData) {
    if (params.id !== undefined) {
      const product = this.instance.productList[params.id]

      if (product) {
        resData.data = product
      } else {
        resData.errcode = 1
        resData.errmsg = '该商品不存在'
      }
    } else {
      resData.errcode = 2
      resData.errmsg = '请输入商品id'
    }
  }

  static getPointBalance(params, resData) {
    const balance = Math.floor(Math.random()*1000 + 100);
    resData.data = { balance }
  }

  static pointExchange(params, resData) {
    const random = Math.floor(Math.random()*10)
    if (random >= 7) {
      resData.errcode = 1
      resData.errmsg = '积分不足'
    }
  }

  static getPointRecode(params, resData) {
    const list = createPointRecode(params.status)
    resData.data = {
      current_page: params.page,
      last_page: 5,
      data: list
    }
  }

  static getPointPrize(params, resData) {
    const list = createPointPrize()
    resData.data = {
      current_page: params.page,
      last_page: 2,
      data: list
    }
  }
}

export default MockHttpClient.instance;
