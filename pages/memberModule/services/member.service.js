import mainService from '../../../services/main.service';
import pathModel from '../../../models/path.model';
import ajaxService from './ajax.service';
import userModel from '../models/user.model';
import configModel from '../../../models/config.model';

/**
 * 授权流程：进入小程序，静默授权；页面节点唤起非静默授权组件；接口状态码30002唤起非静默授权组件；
 * 
 * 属性：
 * @param {string} backPath 授权/注册成功后的回跳路由
 * @param {object} backParams 授权/注册成功后的回跳参数
 * @param {boolean} isTriggerLogin 是否触发login API，小程序启动必须先调用login
 * @param {boolean} isTriggerCard 是否触发微信会员卡
 */
class MemberService {
  constructor() {
    this.backPath = '';
    this.backParams = {};
    this.isTriggerLogin = false;
    this.isTriggerCard = false;
  }

  /**
   * 初始化小程序
   * @param {function} cb 处理页面逻辑的回调
   */
  initMiniProgram(cb) {
    switch (this.isTriggerLogin) {
      case true:
        cb && cb();
        break;
      case false:
        mainService.login(() => {
          this.isTriggerLogin = true;
          cb && cb();
        });
        break;
    }
  }

  /**
   * 设置授权/注册成功后的回跳
   * @param {string} path  授权/注册成功后的回跳路由
   * @param {object} params 授权/注册成功后的回跳参数
   */
  setBackJump(path, params) {
    this.backPath = path !== undefined ? path : mainService.getCurrPage().path;
    this.backParams = params !== undefined ? params : mainService.getCurrPage().options;
  }

  /**
   * 配置user.model.js
   * @param {object} model 被设置的对象
   * @param {object} data 会员详情
   */
  setUserModel(model, data) {
    if (data) {
      // 是会员
      model.isMember = 1;
      model.isBind = 1;
      model.cardNum = data.number ? data.number : '';
      model.point = data.integral;
      model.expirePoint = data.expire_integral;
      model.memberid = data.id;
      model.vipType = data.vip_level_id;
      model.vipTypeName = data.vip_level;
      model.mobile = data.mobile;
    } else {
      // 非会员
      model.isMember = 0;
      model.isBind = 0;
    }
    console.log(model);
  }

  /**
   * 保存formId用于发送服务通知
   * @param {object} e form表单对象
   */
  saveFormId(e) {
    ajaxService.saveFormId({
      appid: configModel.miniAppid,
      openid: userModel.openid,
      formid: e.detail.formId,
    }).then(() => { })
  }

  /**
   * 会员卡领卡、开卡
   * @param {function} cb 领卡、开卡成功的回调 
   */
  getMemberCard(cb) {
    ajaxService.memberCard({}).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        let cardList = data.cardList; // 会员卡列表
        this.isTriggerCard = true;
        if (data.is_get_card == 1) {
          // 开卡 open
          userModel.isGetCard = 1;
          wx.openCard({
            cardList: cardList,
            success: (res) => {
              console.log('开卡');
              cb && cb();
            },
            fail: (res) => {
              console.log('不开卡');
              cb && cb();
            }
          })
        } else {
          // 领卡 add
          wx.addCard({
            cardList: cardList,
            success: (res) => {
              console.log('领卡');
              userModel.isGetCard = 1;
              cb && cb();
              this.getMemberCardReceive(res);
            },
            fail: (res) => {
              console.log('不领卡');
              cb && cb();
            }
          })
        }
      } else {
        mainService.modal(errmsg);
      }
    })
  }

  /**
   * 会员卡领卡通知
   * @param {object} res 开卡成功的回调信息
   */
  getMemberCardReceive(res) {
    ajaxService.memberCardReceive({
      card_id: res.cardList[0].cardId,
      card_code: res.cardList[0].code,
    }).then((res) => { })
  }

  /**
   * 会员卡开卡、领卡回调（用于注册页面，入会成功后的跳转）
   */
  getMemberCardCb() {
    if (this.isTriggerCard) {
      this.isTriggerCard = false;
      this.judgeTerminalPath();
    }
  }

  /**
   * 获取会员等级id
   * @param {function} cb 值的回调
   */
  getVipType(cb) {
    if (userModel.vipType) {
      cb && cb(userModel.vipType);
      return
    }
    ajaxService.memberDetail({}).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        this.setUserModel(userModel, data);
        cb && cb(userModel.vipType);
      } else {
        mainService.modal(errmsg);
      }
    })
  }

  /**
   * 获取会员绑定状态
   * @param {function} cb 值的回调
   */
  getMemberBindStatus(cb) {
    if (userModel.isBind == 1) {
      // 会员 && 已绑定
      cb && cb(userModel.isBind);
      return
    }
    ajaxService.memberDetail({}).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        this.setUserModel(userModel, data);
        cb && cb(userModel.isBind);
      } else {
        mainService.modal(errmsg);
      }
    })
  }

  /**
   * 获取用户手机号码
   * @param {function} cb 值的回调
   */
  getUserMobile(cb) {
    if (userModel.mobile) {
      // 会员 && 已绑定
      cb && cb(userModel.mobile);
      return
    }
    ajaxService.memberDetail({}).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        this.setUserModel(userModel, data);
        cb && cb(userModel.mobile);
      } else {
        mainService.modal(errmsg);
      }
    })
  }

  /**
   * 获取unionid授权状态
   * @param {function} cb 值的回调
   */
  getUnionidStatus(cb) {
    if (userModel.isAuthUnionid) {
      // 已授权
      cb && cb(userModel.isAuthUnionid);
      return
    }
    mainService.login(() => {
      cb && cb(userModel.isAuthUnionid);
    })
  }

  /**
   * 获取unionid
   * @param {function} cb 值的回调
   */
  getUnionid(cb) {
    if (userModel.unionid) {
      // 已授权
      cb && cb(userModel.unionid);
      return
    }
    mainService.login(() => {
      if (userModel.unionid) {
        // 已授权
        cb && cb(userModel.unionid);
        return
      }
      mainService.awakeAuthComponent({
        success: () => {
          cb && cb(userModel.unionid);
        },
        fail: () => { }
      })
    })
  }

  /**
   * 获取openid
   * @param {function} cb 值的回调
   */
  getOpenid(cb) {
    if (userModel.openid) {
      // 已授权
      cb && cb(userModel.openid);
      return
    }
    mainService.login(() => {
      cb && cb(userModel.openid);
    })
  }

  /**判断最终的页面跳转 */
  judgeTerminalPath() {
    if (!this.backPath) {
      // 返回路径不存在，判断页面栈
      if (getCurrentPages().length == 1) {
        // 页面栈的数量不满足返回条件
        let launch = wx.getLaunchOptionsSync();
        let path = launch.path[0] == "/" ? launch.path : `/${launch.path}`;
        let params = mainService.getRouteStrByObj(launch.query);
        wx.reLaunch({
          url: path + params,
        })
      } else {
        // 返回上一个路由
        wx.navigateBack();
      }
      return
    }
    let path = this.backPath[0] == "/" ? this.backPath : `/${this.backPath}`; // 路由
    let params = mainService.getRouteStrByObj(this.backParams); // 路由参数
    if (mainService.isTabPage(path)) {
      // tab页跳转
      mainService.link(path + params, 3);
    } else {
      // 普通跳转
      mainService.link(path + params, 1);
    }
    // 清空会跳数据
    this.setBackJump('', {});
  }

  /**
   * 获取会员信息
   * @param {function} cb 获取会员信息的回调
   */
  getMemberDetail(cb) {
    ajaxService.memberDetail({}).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        this.setUserModel(userModel, data);
        cb && cb(userModel);
      } else {
        mainService.modal(errmsg);
      }
    })
  }

}

export default new MemberService();
