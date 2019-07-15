/**
 * ajax请求集合
 */
import apiModel from '../../../models/api.model';
import mainService from '../../../services/main.service';

class AjaxService {
  saveFormId(params) {
    // 保存formid
    return mainService.request({
      url: apiModel.mc_save_formid,
      params,
      method: 'POST',
      header: 1,
      loadingType: 0,
    });
  }

  memberDetail(params) {
    // 会员信息
    return mainService.request({
      url: apiModel.mc_member_detail,
      params,
      method: 'GET',
      header: 1,
      loadingType: 1,
    });
  }

  memberRegister(params) {
    // 会员注册
    return mainService.request({
      url: apiModel.mc_member_register,
      params,
      method: 'POST',
      header: 1,
      loadingType: 1,
    });
  }

  memberUpdate(params) {
    // 会员更新
    return mainService.request({
      url: apiModel.mc_member_update,
      params,
      method: 'POST',
      header: 1,
      loadingType: 1,
    });
  }

  memberBind(params) {
    // 会员绑定
    return mainService.request({
      url: apiModel.mc_member_bind,
      params,
      method: 'POST',
      header: 1,
      loadingType: 1,
    });
  }

  decrypt(params) {
    // 解密
    return mainService.request({
      url: apiModel.mc_decrypt,
      params,
      method: 'POST',
      header: 1,
      loadingType: 1,
    });
  }

  getShopid(params) {
    // 获取shopid
    return mainService.request({
      url: apiModel.mc_shopid_position,
      params,
      method: 'POST',
      header: 2,
      loadingType: 1,
    });
  }

  sendsms(params) {
    // 发送验证码
    return mainService.request({
      url: apiModel.mc_sendsms,
      params: params,
      method: 'POST',
      header: 1,
      loadingType: 1,
    });
  }

  memberCard(params) {
    // 会员卡
    return mainService.request({
      url: apiModel.mc_member_card,
      params: params,
      method: 'GET',
      header: 1,
      loadingType: 2,
    });
  }

  memberCardReceive(params) {
    // 会员卡-领卡通知
    return mainService.request({
      url: apiModel.mc_member_card_receive,
      params: params,
      method: 'POST',
      header: 1,
      loadingType: 0,
    });
  }

  qrcodeBarcode(params) {
    // 获取qrcode barcode
    return mainService.request({
      url: apiModel.mc_qrcode_barcode,
      params,
      method: 'GET',
      header: 1,
      loadingType: 1,
    });
  }

  storeList(params) {
    // 门店-门店列表
    if (params.latitude) {
      return mainService.request({
        url: apiModel.mc_store_list,
        params,
        method: 'GET',
        header: 1,
        loadingType: 1,
      });
    }
    return mainService.request({
      url: apiModel.mc_store_list_default,
      params,
      method: 'GET',
      header: 1,
      loadingType: 1,
    });
  }

  storeOfCity(params) {
    // 门店-省市区
    return mainService.request({
      url: apiModel.mc_store_city,
      params,
      method: 'GET',
      header: 1,
      loadingType: 1,
    });
  }

  adList(params) {
    // 广告位列表
    return mainService.request({
      url: apiModel.mc_ad_list,
      params,
      method: 'POST',
      header: 2,
      loadingType: 0,
    });
  }

  signinDetail(params) {
    // 签到记录
    return mainService.request({
      url: apiModel.mc_signin_detail,
      params,
      method: 'GET',
      header: 1,
      loadingType: 1,
    });
  }

  signin(params) {
    // 签到
    return mainService.request({
      url: apiModel.mc_signin,
      params,
      method: 'POST',
      header: 1,
      loadingType: 1,
    });
  }

  couponList(params) {
    // 会员优惠券列表
    return mainService.request({
      url: apiModel.mc_coupon_list,
      params,
      method: 'GET',
      header: 1,
      loadingType: 1,
    });
  }

  couponDetail(params, id) {
    // 会员优惠券详情
    return mainService.request({
      url: `${apiModel.mc_coupon_detail}${id}`,
      params,
      method: 'GET',
      header: 1,
      loadingType: 1,
    });
  }

  couponListSel(params) {
    // 会员优惠券列表（可用）
    return mainService.request({
      url: apiModel.mc_coupon_list_sel,
      params,
      method: 'POST',
      header: 2,
      loadingType: 1,
    });
  }

  shareRecord(params) {
    // 邀请好友记录
    return mainService.request({
      url: apiModel.mc_share_record,
      params,
      method: 'GET',
      header: 1,
      loadingType: 1,
    });
  }

  wishList(params) {
    // 收藏列表
    return mainService.request({
      url: apiModel.mc_wish_list,
      params,
      method: 'POST',
      header: 2,
      loadingType: 1,
    });
  }

  wishToggle(params) {
    // 切换收藏
    return mainService.request({
      url: apiModel.mc_wish_toggle,
      params,
      method: 'POST',
      header: 2,
      loadingType: 1,
    });
  }

  productDetail(params) {
    // 商品详情
    return mainService.request({
      url: apiModel.mc_product_detail,
      params,
      method: 'POST',
      header: 2,
      loadingType: 1,
    });
  }

  cartAdd(params) {
    // 加入购物车
    return mainService.request({
      url: apiModel.mc_cart_add,
      params,
      method: 'POST',
      header: 2,
      loadingType: 1,
    });
  }

  traceList(params) {
    // 我的足迹
    return mainService.request({
      url: apiModel.mc_trace_list,
      params,
      method: 'POST',
      header: 2,
      loadingType: 1,
    });
  }

  orderCount(params) {
    // 订单不同状态下的数量
    return mainService.request({
      url: apiModel.mc_order_count,
      params,
      method: 'POST',
      header: 2,
      loadingType: 0,
    });
  }

  recommendList(params) {
    // 推荐商品列表
    return mainService.request({
      url: apiModel.mc_recommend_list,
      params,
      method: 'POST',
      header: 2,
      loadingType: 0,
    });
  }
}

export default new AjaxService();
