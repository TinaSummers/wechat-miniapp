/**
 * 后台数据结构：
  ad_position_id: '', // 广告位id
  interaction_type: '', // 交互类型 1-跳转小程序页面 2-自定义跳转 3-跳转至商品分类页 10-无
  pic: '', // 图片地址

  // interaction_type == 1
  page_name_id: '', // 页面名称id 2-商品筛选 3-商品列表 其他-普通页面
  group_id1: '', // 当 page_name_id == 3 时传值
  group_id2: '', // 当 page_name_id == 3 时传值
  group_id3: '', // 当 page_name_id == 3 时传值
  group_name1: '', // 当 page_name_id == 3 时传值
  group_name2: '', // 当 page_name_id == 3 时传值
  group_name3: '', // 当 page_name_id == 3 时传值
  mini_url: '', // page_name_id != 3

  // interaction_type == 2
  url: '', // 自定义跳转url

  // interaction_type == 3
  product_id: '397', // 商品id
 */

/**
 * 渲染数据结构：
  id: '', // 广告位id
  imgUrl: '', // 图片地址
  jumpType: '', // 跳转类型 1-无 2-跳转小程序内部页面 3-跳转H5
  miniUrl: '', // 小程序内部页面地址
  h5Url: '', // h5地址
 */

export default {
  idList: [ // 广告位id列表
    { "id": "1", "name": "个人中心" },
    { "id": "2", "name": "购物袋" },
    { "id": "3", "name": "会员礼遇" },
    { "id": "4", "name": "会员资料" },
    { "id": "5", "name": "门店查询" },
    { "id": "6", "name": "搜索" },
    { "id": "7", "name": "搜索列表" },
    { "id": "8", "name": "我的订单" },
    { "id": "9", "name": "我的心愿单" },
    { "id": "10", "name": "商品详情" },
  ],
  adList: [ // 广告列表
    {
      id: '1',
      imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557897135467&di=4cfe8a2a73682252f80a34e444c319e8&imgtype=0&src=http%3A%2F%2Fk.zol-img.com.cn%2Fsjbbs%2F7692%2Fa7691515_s.jpg',
      jumpType: 1,
      miniUrl: '',
      h5Url: '',
    },
  ]
}