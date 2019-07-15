import ajaxService from '../../services/ajax.service';
import mainService from '../../../../services/main.service';
import userModel from '../../models/user.model';
import memberService from '../../services/member.service';

Page({
  data: {
    url: '',
  },
  onLoad() {
    this.setData({
      url: wx.getStorageSync('webviewUrl'),
    })
  },
  onShow() { },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})