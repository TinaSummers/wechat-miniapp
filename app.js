const etdsdk = require('assets/libs/etd-sdk.min.js');
// require('./assets/libs/tracking');

App({
  onLaunch() { },
  onShow(options) {
    console.log(options, ' ======= app onShow');
		/**
		 * @param {string} ant_share_unionid 分享好友的unionid
     * @param {string} ant_share_memberid 分享好友的memberid
		 * @param {string} ant_register_channel 注册渠道
		 */
    options.query.ant_share_unionid && wx.setStorageSync('ant_share_unionid', options.query.ant_share_unionid);
    options.query.ant_share_memberid && wx.setStorageSync('ant_share_memberid', options.query.ant_share_memberid);
    options.query.ant_register_channel && wx.setStorageSync('ant_register_channel', options.query.ant_register_channel);
  },
  onHide() { },
  onError() { },
  globalData: {},
});
