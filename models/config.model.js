/**
 * 项目配置表
 * 
 * 测试 wx5aba59796c912478
 * 正式 
 * 
 * 属性说明：
 * @param {string} ENV 环境变量 TEST(开发测试) / UAT(客户测试) / PROD(正式)
 * @param {string} miniAppid 小程序appid（与formid有关）
 * @param {string} templateId 会员中心模板id（与会员中心有关）
 * @param {string} organizationId 机构id（与会员中心有关）
 * @param {string} brandId 品牌id（与商城有关）
 * @param {string} shopId 店铺id（与商城有关）
 * @param {string} ecrmSource ecrm来源（与商城有关）
 * @param {string} publicAppid 公众号appid（与门店有关）
 * @param {number} needUnionid 初始进入小程序，是否微信授权unionid 1-需要 0-不需要
 * @param {string} trackUrl track域名
 * @param {string} apiUrl api域名
 * @param {string} ecrmUrl ecrm域名
 * @param {string} hubUrl hub域名（门店的省市区列表+门店列表）
 * @param {string} mapUrl 腾讯地图域名
 * @param {string} mapKey 腾讯地图key
 * @param {string} surveyId 调查问卷id
 */


const miniAppid = wx.getAccountInfoSync().miniProgram.appId; // 小程序appid
let config = null;

switch (miniAppid) {
  case 'wx5aba59796c912478':
    config = {
      ENV: 'TEST',
      miniAppid,
      templateId: '1',
      organizationId: '127',
      brandId: '',
      shopId: '',
      ecrmSource: '',
      publicAppid: 'wx6d5e92b278c3bdc2',
      needUnionid: 0,
      trackUrl: 'https://apitrack.woaap.com',
      apiUrl: 'https://api-test.woaap.com',
      ecrmUrl: 'https://ecrm-test.woaap.com',
      hubUrl: 'https://woaapsh.woaap.com',
      mapUrl: 'https://apis.map.qq.com',
      mapKey: 'G5WBZ-RZ6WU-Z5XVV-24E7D-RKR3Z-HHFQJ',
      surveyId: '1',
    }
    break;
}

export default config;