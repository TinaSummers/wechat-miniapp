/**
 * 后台请求地址集合
 */
import configModel from './config.model';
const apiUrl = configModel.apiUrl;
const ecrmUrl = configModel.ecrmUrl;
const hubUrl = configModel.hubUrl;
const mcUrl = configModel.mcUrl;
const etoshopUrl = configModel.etoshopUrl;

export default {
  // 会员中心
  mc_save_formid: apiUrl + '/api/miniapp-formid', // 保存formid
  mc_qrcode_barcode: ecrmUrl + '/get/code', // 获取条形码&&二维码
  mc_login: ecrmUrl + "/auth/miniapp/login", // login授权
  mc_userinfo: ecrmUrl + "/auth/miniapp/userinfo", // userinfo授权
  mc_decrypt: ecrmUrl + '/miniapp/member/decrypt', // 解密
  mc_member_detail: ecrmUrl + "/miniapp/member/detail", // 会员详情
  mc_member_register: ecrmUrl + "/miniapp/member/register", // 会员注册
  mc_member_update: ecrmUrl + "/miniapp/member/update", // 会员更新
  mc_sendsms: ecrmUrl + "/miniapp/member/sendsms", // 发送短信验证
  mc_member_bind: ecrmUrl + "/miniapp/member/bind", // 会员绑定
  mc_member_card: ecrmUrl + "/miniapp/member/get-member-card", // 会员卡
  mc_member_card_receive: ecrmUrl + "/miniapp/membercard/receive", // 会员卡领卡通知
  mc_shopid_position: etoshopUrl + '/index.php/Home/Shop/getShopIdByPosition', // 根据经纬度获取shopid
  mc_store_list: hubUrl + "/store/nearby-stores", // 门店-门店列表（授权经纬度）
  mc_store_list_default: hubUrl + "/store", // 门店-默认门店列表（未授权经纬度）
  mc_store_city: hubUrl + '/store/fetchCity', // 门店-省市区
  mc_signin_detail: `${ecrmUrl}/api/sign/detail`, // 签到详情
  mc_signin: `${ecrmUrl}/api/sign`, // 签到
  mc_coupon_list: `${ecrmUrl}/miniapp/members/coupons`, //会员优惠券列表
  mc_coupon_detail: `${ecrmUrl}/miniapp/members/coupons/`, //会员优惠详情
  mc_coupon_list_sel: `${etoshopUrl}/coupons/api/coupons_list`, //会员优惠详情
  mc_share_record: `${ecrmUrl}/miniapp/invite/record`, //邀请好友记录
  mc_wish_list: `${etoshopUrl}/index.php/Home/Goods/collectList`, // 收藏商品列表
  mc_wish_toggle: `${etoshopUrl}/index.php/Home/Goods/collect`, // 切换收藏
  mc_product_detail: `${etoshopUrl}/index.php/Home/Goods/productDetail`, // 商品详情
  mc_cart_add: `${etoshopUrl}/Home/Cart/addToCart`, // 加入购物车
  mc_trace_list: `${etoshopUrl}/Orders/api/goods_view_list`, // 我的足迹
  mc_order_count: `${etoshopUrl}/Orders/Api/order_count`, // 订单不同状态下的数量
  mc_recommend_list: `${etoshopUrl}/index.php/base/home/GoodsApi/getRecommendLists`, // 推荐商品列表
  mc_ad_list: etoshopUrl + '/Home/AdPosition/getAdStatusOne', // 广告列表

  // 积分兑换
  pt_recode_list: `${ecrmUrl}/miniapp/gift/change-list`, // 兑换记录列表
  pt_product_list: `${ecrmUrl}/miniapp/gift/shelf-info`, // 兑换积分商品列表
  pt_product_detail: `${ecrmUrl}/miniapp/gift/info`, // 获取积分商品详情
  pt_point_exchange: `${ecrmUrl}/miniapp/gift/exchange`, // 积分兑换
  pt_get_point_recode: `${ecrmUrl}/api-client/member/points`, // 积分历史记录

  // 大转盘
  pt_get_point_prize: `${ecrmUrl}/miniapp/wheel/my-prize`, // 积分转盘-我的奖品
  pt_turntable_index: `${ecrmUrl}/miniapp/wheel/mini-index`, // 积分转盘- 转盘奖品列表
  pt_open_prize: `${ecrmUrl}/miniapp/wheel/get-award`, // 开奖
  pt_turntable_share: `${ecrmUrl}/miniapp/wheel/my-share`, // 分享得次数
}
