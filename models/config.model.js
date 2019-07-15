/**
 * 小程序appid：
 * 测试 wxdfe9038246106c3b
 * 正式 
 * 
 * 属性说明：
 * @param {boolean} ENV 环境变量 TEST(开发测试) / UAT(客户测试) / PROD(正式)
 * @param {string} miniAppid 小程序appid（与formid有关）
 * @param {string} templateId 会员中心模板id（与会员中心有关）
 * @param {string} organizationId 机构id（与会员中心有关）
 * @param {string} brandId 品牌id（与商城有关）
 * @param {string} shopId 店铺id（与商城有关）
 * @param {string} publicAppid 公众号appid（与门店有关）
 * @param {string} ecrmSource ecrm来源（与商城有关）
 * @param {number} needUnionid 初始进入小程序，微信授权是否需要unionid 1-需要 0-不需要
 * @param {string} trackUrl track域名
 * @param {string} apiUrl api域名
 * @param {string} ecrmUrl ecrm域名
 * @param {string} hubUrl hub域名（门店的省市区列表+门店列表）
 * @param {string} mcUrl 会员中心域名
 * @param {string} etoshopUrl 商城域名
 * @param {string} mapKey 腾讯地图的key
 */

const ENV = 'TEST';
let config = null;

switch (ENV) {
  case 'TEST':
    config = {
      ENV,
      miniAppid: 'wxdfe9038246106c3b',
      templateId: '1',
      organizationId: '126',
      brandId: '40',
      shopId: 0,
      publicAppid: '',
      ecrmSource: 'beijing',
      needUnionid: 0,
      trackUrl: 'https://apitrack.woaap.com',
      apiUrl: 'https://api-test.woaap.com',
      ecrmUrl: 'https://ecrm-test.woaap.com',
      hubUrl: 'https://woaapsh.woaap.com',
      mcUrl: '',
      etoshopUrl: 'https://jos1ny-bj.woaap.com',
      mapKey: 'DB7BZ-RZGCF-FXSJN-JYW2W-JLFT5-MKBGB',
    }
    break;
  case 'PROD':

    break;
}

export default config;