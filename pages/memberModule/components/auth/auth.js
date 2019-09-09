/**
 * 授权组件
 * 在父组件中调用授权组件的openHandle方法，同时设置成功授权的回调、失败授权的回调；
 * 授权成功，执行成功授权的回调；
 * 授权失败，执行失败授权的回调；
 */
import imgModel from '../../models/img.model';
import userModel from '../../models/user.model';
import ajaxService from '../../services/ajax.service';
import mainService from '../../../../services/main.service';
import configModel from '../../../../models/config.model';
import memberService from '../../services/member.service';
import pathModel from '../../../../models/path.model';

Component({
  options: {
    multipleSlots: true
  },
  properties: {
    closeBtnShow: { // 关闭按钮是否显示
      type: Number,
      value: 1,
    },
  },
  data: {
    imgModel,
    compShow: false, // 组件是否显示
    successCb: null, // 成功授权的回调
    failCb: null, // 失败授权的回调
    checked: true, // 是否阅读隐私条款
  },
  pageLifetimes: {
    // 监听页面生命周期
    show() {
      if (userModel.isAuthUnionid) {
        // 处理未关闭组件，但是已授权的细节
        this.setData({
          compShow: false,
        })
      }
    },
  },
  attached() { },
  methods: {
    /**
     * 打开组件事件
     * @param {function} successCb 成功授权的回调
     * @param {function} failCb 失败授权的回调
     */
    openHandle(obj) {
      const successCb = obj.success, failCb = obj.fail;
      if (successCb && Object.prototype.toString.call(successCb) != '[object Function]') {
        throw new Error('授权组件的传参错误');
      }
      if (failCb && Object.prototype.toString.call(failCb) != '[object Function]') {
        throw new Error('授权组件的传参错误');
      }
      this.data.successCb = successCb ? successCb : function () {
        console.log('默认回调：成功授权');
      };
      this.data.failCb = failCb ? failCb : function () {
        console.log('默认回调：失败授权');
      };
      // @请求后台，判断unionid授权状态
      // mainService.login(() => {
      if (userModel.isAuthUnionid) {
        // 已授权
        this.data.successCb && this.data.successCb();
        return
      }
      this.setData({
        compShow: true,
      })
      // })
    },
    getUserInfo(e) {
      if (e.detail.errMsg == 'getUserInfo:ok') {
        // 允许授权
        console.log('允许授权unionid');
        mainService.throttle(() => {
          mainService.getUserInfo(e.detail, () => {
            this.data.successCb && this.data.successCb();
            this.setData({
              compShow: false,
            })
          })
        }, 5000)
      } else {
        // 拒绝授权
        console.log('拒绝授权unionid');
        // this.data.failCb && this.data.failCb();
        // this.setData({
        //   compShow: false,
        // })
      }
    },
    cancelHandle() {
      this.data.failCb && this.data.failCb();
      this.setData({
        compShow: false,
      })
    },
    closeHandle() {
      this.data.failCb && this.data.failCb();
      this.setData({
        compShow: false,
      })
    },
    submitHandle(e) {
      // 保存formid
      memberService.saveFormId(e);
    }
  }
})