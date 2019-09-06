/**
 * 入会组件
 * 在父组件中调用入会组件的openHandle方法，同时设置成功入会的回调、失败入会的回调；
 * 入会成功，执行成功入会的回调；
 * 入会失败，执行失败入会的回调；
 */
import imgModel from '../../models/img.model';
import userModel from '../../models/user.model';
import ajaxService from '../../services/ajax.service';
import mainService from '../../../../services/main.service';
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
    successCb: null, // 成功入会的回调
    failCb: null, // 失败入会的回调
    checked: false, // 是否阅读隐私条款
  },
  pageLifetimes: {
    // 监听页面生命周期
    show() {
      if (userModel.isBind) {
        // 处理未关闭组件，但是已入会的细节
        this.setData({
          compShow: false,
        })
      }
      if (memberService.isTriggerCard) {
        memberService.isTriggerCard = false;
        this.data.successCb && this.data.successCb();
      }
    },
  },
  attached() { },
  methods: {
    /**
     * 打开组件事件
     * @param {function} successCb 成功入会的回调
     * @param {function} failCb 失败入会的回调
     */
    openHandle(obj) {
      const successCb = obj.success, failCb = obj.fail;
      if (successCb && Object.prototype.toString.call(successCb) != '[object Function]') {
        throw new Error('注册组件的传参错误');
      }
      if (failCb && Object.prototype.toString.call(failCb) != '[object Function]') {
        throw new Error('注册组件的传参错误');
      }
      this.data.successCb = successCb ? successCb : function () {
        console.log('默认回调：成功入会');
      };
      this.data.failCb = failCb ? failCb : function () {
        console.log('默认回调：失败入会');
      };
      // mainService.login(() => {
      if (!userModel.isAuthUnionid) {
        // 未授权
        mainService.awakeAuthComponent({
          success: () => {
            this.memberDetail();
          },
          fail: () => {
            this.data.failCb && this.data.failCb();
          }
        })
        return
      }
      if (userModel.isAuthUnionid && userModel.isBind != 1) {
        // 授权 && 未绑定
        this.memberDetail();
        return
      }
      if (userModel.isAuthUnionid && userModel.isBind == 1) {
        // 授权 && 已绑定
        this.data.successCb && this.data.successCb();
        return
      }
      // })
    },
    memberDetail() {
      ajaxService.memberDetail({}).then((res) => {
        let { data: { errcode, data, errmsg } } = res;
        if (errcode == 0) {
          memberService.setUserModel(userModel, data);
          if (userModel.isBind == 1) {
            this.setData({
              compShow: false,
            })
            this.data.successCb && this.data.successCb();
          } else {
            this.setData({
              compShow: true,
            })
          }
        } else {
          mainService.modal(errmsg);
        }
      })
    },
    hintHandle() {
      // 未阅读隐私条款的触发事件
      mainService.throttle(() => {
        mainService.toast('阅读<隐私条款>并勾选');
      }, 1000)
    },
    getphonenumberHandle(e) {
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        // @允许授权，请求后台，解密手机号
        console.log('允许授权');
        ajaxService.decrypt({
          encrypted_data: e.detail.encryptedData,
          iv: e.detail.iv,
        }).then((res) => {
          let { data: { errcode, data, errmsg } } = res;
          if (errcode == 0) {
            // @请求后台 使用手机号查询会员状态
            let mobile = data.purePhoneNumber;
            let app_encrypt_id = data.app_encrypt_id;
            ajaxService.memberRegister({
              mobile,
              app_encrypt_id,
              inviter: wx.getStorageSync('ant_share_unionid') ? wx.getStorageSync('ant_share_unionid') : '',
              registered_channel: wx.getStorageSync('ant_register_channel') ? wx.getStorageSync('ant_register_channel') : '',
              referrer_member_id: wx.getStorageSync('ant_share_memberid') ? wx.getStorageSync('ant_share_memberid') : 0,
            }).then((res) => {
              let { data: { errcode, data, errmsg } } = res;
              if (errcode == 0) {
                this.setData({
                  compShow: false,
                })
                // @请求后台 领取会员卡
                // memberService.getMemberCard(() => {
                //   if (memberService.isTriggerCard) {
                //     memberService.isTriggerCard = false;
                //     this.data.successCb && this.data.successCb();
                //   }
                // })
                this.data.successCb && this.data.successCb();
              } else {
                mainService.modal(errmsg);
              }
            })
          } else {
            mainService.modal(errmsg);
          }
        })
      } else {
        // 拒绝授权
        console.log('拒绝授权');
        this.data.failCb && this.data.failCb();
        this.setData({
          compShow: false,
        })
      }
    },
    showHandle(obj) {
      const successCb = obj.success, failCb = obj.fail;
      if (successCb && Object.prototype.toString.call(successCb) != '[object Function]') {
        throw new Error('注册组件的传参错误');
      }
      if (failCb && Object.prototype.toString.call(failCb) != '[object Function]') {
        throw new Error('注册组件的传参错误');
      }
      this.data.successCb = successCb ? successCb : function () {
        console.log('默认回调：成功入会');
      };
      this.data.failCb = failCb ? failCb : function () {
        console.log('默认回调：失败入会');
      };
      this.setData({
        compShow: true,
      })
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
    ruleHandle() {
      this.setData({
        checked: !this.data.checked
      })
    },
    jumpClausePrivacy() {
      mainService.link(pathModel.mc_clause_privacy);
    },
    jumpClauseUse() {
      mainService.link(pathModel.mc_clause_use);
    },
    submitHandle(e) {
      // 保存formid
      memberService.saveFormId(e);
    }
  }
})