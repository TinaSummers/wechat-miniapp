import mainService from '../../../services/main.service';
import pathModel from '../../../models/path.model';
import ajaxService from './ajax.service';
import userModel from '../models/user.model';
import configModel from '../../../models/config.model';

/**
 * 授权入会流程：
 * 1、进入小程序，未授权unionid，跳转到开屏页，强制授权；
 * 2、入会节点：
 *    商城首页：非会员弹出注册组件，如果用户拒绝入会，不再弹出组件；待小程序进程关闭后，可再弹出组件；
 *    会员首页：非会员弹出注册组件，如果用户拒绝入会，跳转到商城首页；
 * 3、会员首页：有3种状态值，非会员 + 会员未领卡 + 会员已领卡
 * 
 * 属性：
 * @param {Array} limitRoute 守卫路由集合（路由别名）；栗子：会员权限
 * @param {string} back_path 授权/注册成功后的回跳路由 栗子：/page/index/index
 * @param {object} back_params 授权/注册成功后的回跳路由参数
 * @param {boolean} isTriggerLogin 是否触发login API，小程序启动必须先调用login
 * @param {boolean} isTriggerCard 是否触发会员卡组件
 */
class MemberService {
  constructor() {
    this.limitRoute = [];
    this.back_path = '';
    this.back_params = {};
    this.isTriggerLogin = false;
    this.isTriggerCard = false;
  }

  /**
   * 判断页面跳转的初始方法
   * @param {function} cb 处理页面逻辑的回调函数 
   */
  initJudgeJump(cb) {
    if (!this.isTriggerLogin) {
      // 未调用login接口
      mainService.login(() => {
        this.isTriggerLogin = true;
        if (!userModel.isAuthUnionid) {
          // 未非静默授权
          this.setBackJump();
          mainService.link(pathModel.mc_screen);
          return
        }
        this.routeGuard(cb);
      });
    } else {
      this.routeGuard(cb);
    }
  }

  /**
   * 路由守卫
   * @param {function} cb 处理页面逻辑的回调函数
   */
  routeGuard(cb) {
    // 1、判断当前路由是否在路由守卫集合中
    let path = mainService.getCurrPage().path;
    let isLimit = false;
    this.limitRoute.forEach((item, key) => {
      if (path == pathModel[item]) {
        isLimit = true;
      }
    })
    if (!isLimit) {
      cb && cb();
      return
    }
    // 2、在守卫集合中，判断权限
    if (userModel.isBind) {
      cb && cb();
      return
    }
    // 3、请求后台，再次判断权限
    ajaxService.memberDetail({}).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        this.setUserModel(userModel, data);
        if (userModel.isBind) {
          cb && cb();
          return
        }
        // 非会员
        console.log('非会员');
      } else {
        mainService.modal(errmsg);
      }
    })
  }

  /**
   * 设置授权/注册成功后的回跳路由、参数
   * @param {string} path  授权/注册成功后的回跳路由 栗子：/page/index/index
   * @param {object} params 授权/注册成功后的回跳路由参数
   */
  setBackJump(path, params) {
    this.back_path = path !== undefined ? path : mainService.getCurrPage().path;
    this.back_params = params !== undefined ? params : mainService.getCurrPage().options;
  }

  /**
   * 配置user.model.js
   * @param {object} model 需要被设置的数据对象  
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
    } else {
      // 非会员
      model.isMember = 0;
      model.isBind = 0;
    }
    console.log(model);
  }

  /**
   * 保存formId，用于发送模板消息
   * @param {object} e form表单对象
   */
  saveFormId(e) {
    console.log(e.detail.formId, '====formid');
    ajaxService.saveFormId({
      appid: configModel.miniAppid,
      openid: userModel.openid,
      formid: e.detail.formId,
    }).then((res) => { })
  }

  /**
   * 会员领卡、开卡（通用方案）
   * @param {function} cb 领卡成功的回调 
   */
  getMemberCard(cb) {
    ajaxService.memberCard({}).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        let cardList = data.cardList; // 卡列表
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
        this.setUserModel(data);
        cb && cb(userModel.vipType);
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
    }).then((res) => {

    })
  }

  /**会员开卡、领卡回调 */
  getMemberCardCb() {
    if (this.isTriggerCard) {
      this.isTriggerCard = false;
      this.judgeTerminalPath();
    }
  }

  /**
   * 获取会员、绑定状态
   * @param {function} cb 获取会员信息的回调
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
    if (userModel.isAuthUnionid) {
      // 已授权
      cb && cb(userModel.unionid);
      return
    }
    mainService.login(() => {
      if (userModel.isAuthUnionid) {
        // 已授权
        cb && cb(userModel.unionid);
        return
      }
      this.setBackJump();
      mainService.link(pathModel.mc_screen);
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
    if (!this.back_path) {
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
    let path = this.back_path[0] == "/" ? this.back_path : `/${this.back_path}`; // 路由
    let params = mainService.getRouteStrByObj(this.back_params); // 路由参数
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
   * 根据经纬度获取shopid
   * @param {function} cb 更新shopid后的回调
   */
  getShopidByPosition(cb) {
    if (userModel.isGetShopid == 1) {
      cb && cb({
        latitude: userModel.latitude,
        longitude: userModel.longitude,
      });
      return
    }
    function _getShopid(latitude, longitude) {
      ajaxService.getShopid({
        latitude,
        longitude,
      }).then((res) => {
        let { data: { errcode, data, errmsg } } = res;
        if (errcode == 200) {
          configModel.shopId = data.id;
          userModel.isGetShopid = 1;
          userModel.latitude = latitude;
          userModel.longitude = longitude;
          cb && cb({
            latitude,
            longitude,
          });
          console.log(configModel);
        } else {
          mainService.modal(errmsg);
        }
      })
    }
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        let { latitude, longitude } = res;
        _getShopid.call(this, latitude, longitude);
      },
      fail: (res) => {
        wx.request({
          url: `https://apis.map.qq.com/ws/location/v1/ip?key=${configModel.mapKey}`,
          success: (e) => {
            let { data: { result: { location: { lat, lng } } } } = e;
            _getShopid.call(this, lat, lng);
          }
        });
      }
    })
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
