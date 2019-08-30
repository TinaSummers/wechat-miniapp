/**
 * 后台请求地址集合
 */
import configModel from './config.model';
const { apiUrl, ecrmUrl, hubUrl } = configModel;

export default {
  // 主页

  // 会员中心
  mc_save_formid: `${apiUrl}/api/miniapp-formid`, // 保存formid
  mc_qrcode_barcode: `${ecrmUrl}/get/code`, // 获取条形码&&二维码
  mc_login: `${ecrmUrl}/auth/miniapp/login`, // login授权
  mc_userinfo: `${ecrmUrl}/auth/miniapp/userinfo`, // userinfo授权
  mc_decrypt: `${ecrmUrl}/miniapp/member/decrypt`, // 解密
  mc_member_detail: `${ecrmUrl}/miniapp/member/detail`, // 会员详情
  mc_member_register: `${ecrmUrl}/miniapp/member/register`, // 会员注册
  mc_member_update: `${ecrmUrl}/miniapp/member/update`, // 会员更新
  mc_member_bind: `${ecrmUrl}/miniapp/member/bind`, // 会员绑定
  mc_sendsms: `${ecrmUrl}/miniapp/member/sendsms`, // 发送短信验证
  mc_member_card: `${ecrmUrl}/miniapp/member/get-member-card`, // 会员卡
  mc_member_card_receive: `${ecrmUrl}/miniapp/membercard/receive`, // 会员卡领卡通知
  mc_store_list: `${hubUrl}/store/nearby-stores`, // 门店-门店列表（授权经纬度）
  mc_store_list_default: `${hubUrl}/store`, // 门店-默认门店列表（未授权经纬度）
  mc_store_labels: `${hubUrl}/labels/list`, // 门店-标签列表
  mc_store_city: `${hubUrl}/store/fetchCity`, // 门店-省市区
  mc_signin_detail: `${ecrmUrl}/api/sign/detail`, // 签到详情
  mc_signin: `${ecrmUrl}/api/sign`, // 签到
  mc_share_record: `${ecrmUrl}/miniapp/invite/record`, //邀请好友记录
  mc_coupon_list: `${ecrmUrl}/miniapp/members/coupons`, // 会员优惠券列表
  mc_coupon_detail: `${ecrmUrl}/miniapp/members/coupons/`, // 会员优惠详情
  // mc_ad_list: etoshopUrl + `/Home/AdPosition/getAdStatusOne`, // 广告列表（与商城有关）

  // 调查问卷
  qs_list: `${ecrmUrl}/miniapp/survey/detail/#`, // 题库（#代表题库id）
  qs_report: `${ecrmUrl}/miniapp/survey/report`, // 提交答案
}
