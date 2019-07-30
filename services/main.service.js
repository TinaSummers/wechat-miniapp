/**
 * 项目主服务类
 */
import apiModel from '../models/api.model';
import configModel from '../models/config.model';
import pathModel from '../models/path.model';
import barcode from '../assets/libs/barcode';
import qrcode from '../assets/libs/qrcode';
import userModel from '../pages/memberModule/models/user.model';
import memberService from '../pages/memberModule/services/member.service';

class MainService {
  constructor() {
    this.header_json = { 'content-type': 'application/json' };
    this.header_form = { 'content-type': 'application/x-www-form-urlencoded' };
    this.throttle = this.throttleFn(); // 节流
    this.debounce = this.debounceFn(); // 防抖
    this.lastJumpUrl = ''; // 记录上一次页面跳转url
    this.tabRoute = ['hm_index', 'mc_index']; // 底部tabber路由集合（路由别名）
  }

  /**
   * 表单信息错误 / 结果提示
   * @param {string} title 提示文本
   * @param {number} time 弹窗展示时间
   */
  toast(title, time = 2000) {
    setTimeout(() => {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: time
      })
    }, 300)
  }

  /**
   * 后台报错
   * @param {string} content 提示文本
   * @param {string} title 提示标题
   * @param {function} confirmCb 确定的回调
   */
  modal(content, title = '提示', confirmCb) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      // confirmColor: '#f09196',
      success: function (res) {
        if (res.confirm) {
          confirmCb && confirmCb();
        }
      }
    })
  }

  /**
   * 询问用户意见
   * @param {string} content 提示文本
   * @param {function} confirmCb 确定的回调
   * @param {function} cancelCb 取消的回调
   */
  confirm(content, confirmCb, cancelCb) {
    wx.showModal({
      title: '提示',
      content: content,
      // confirmColor: '#f09196',
      success: function (res) {
        if (res.confirm) {
          confirmCb && confirmCb();
        } else if (res.cancel) {
          cancelCb && cancelCb();
        }
      }
    })
  }

  /**
   * 节流适用场景：表单提交
   * @param {function} handler 进行防抖的函数
   * @param {number} wait 等待时间ms
   */
  throttleFn() {
    var lastTime = 0;
    return function (handler, wait = 1000) {
      var nowTime = new Date().getTime();
      if (nowTime - lastTime > wait) {
        handler && handler();
        lastTime = nowTime;
      }
    }
  }

  /**
   * 防抖适用场景：搜索框
   * @param {function} handler 进行防抖的函数
   * @param {number} delay 等待时间ms
   */
  debounceFn() {
    var timer = null;
    return function (handler, delay = 1000) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        handler && handler();
      }, delay);
    }
  }

  /**
   * 生成条形码
   * @param {string} id canvas的id名称
   * @param {string} code 条形码文本 
   * @param {number} width 条形码宽度rpx
   * @param {number} height 条形码高度rpx
   */
  getBarcode(id, code, width, height) {
    function convertLength(length) {
      return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
    }
    barcode.code128(wx.createCanvasContext(id), code, convertLength(width), convertLength(height));
  }

  /**
   * 生成二维码
   * @param {string} id canvas的id名称
   * @param {string} code 条形码文本 
   * @param {number} width 条形码宽度px
   * @param {number} height 条形码高度px
   */
  getQrcode(id, code, width, height) {
    qrcode({ width: width, height: height, canvasId: id, text: code, typeNumber: 6 });
  }

  /**
   * 生成条形码 && 二维码
   * @param {string} code 需要制作的码
   * @param {function} cb 制作成功的回调
   */
  qrcodeBarcode(code, cb) {
    this.request({
      url: apiModel.mc_qrcode_barcode,
      params: { info: code },
      method: 'GET',
      header: 1,
      loadingType: 0,
    }).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        cb && cb({
          qrcode: data.qr_code,
          barcode: data.bar_code,
        });
      } else {
        mainService.modal(errmsg);
      }
    })
  }

  /**
   * 判断当前页是否是tabber页
   * @param {string} url 当前页面的路径
   */
  isTabPage(url) {
    let isTab = false;
    let path = url.split('?')[0];
    path = path[0] == '/' ? path : '/' + path;
    this.tabRoute.forEach((item, key) => {
      if (path == pathModel[item]) {
        isTab = true;
      }
    })
    return isTab;
  }

  /**分享内容 */
  shareInfo() {
    return {
      title: '狂奔的小马扎',
      path: 'pages/homeModule/pages/index/index',
      imageUrl: '/assets/images/share.jpg',
    }
  }

  /**判断屏幕大小 */
  judgeBigScreen() {
    let result = false;
    const res = wx.getSystemInfoSync();
    const rate = res.windowHeight / res.windowWidth;
    let limit = res.windowHeight == res.screenHeight ? 1.8 : 1.65; // 临界判断值
    if (rate > limit) {
      result = true;
    }
    return result;
  }

  /**获取当前页面参数 */
  getCurrPage() {
    const page = getCurrentPages()[getCurrentPages().length - 1];
    const path = '/' + (page.route || page.__route__);
    const options = page.options;
    return {
      path,
      options,
    }
  }

  /**
   * 请求后台
   * @param {string} url 请求地址
   * @param {object} params 请求参数
   * @param {string} method 请求方式 GET POST
   * @param {number} header 请求头 1-application/json 2-application/x-www-form-urlencoded
   * @param {number} loadingType 加载类型 0-无 1-showLoading 2-showNavigationBarLoading
   * @param {string} responseType 响应数据类型 text
  **/
  request(config) {
    let target = {
      url: '',
      params: {},
      method: 'GET',
      header: 1,
      loadingType: 1,
      responseType: 'text',
    };
    Object.assign(target, config);
    let resolveArr = []; // 外层的resolve集合
    let requestNum = 0; // 请求次数
    function closure() {
      return new Promise((resolve, reject) => {
        // 判断加载类型
        if (target.loadingType == 1) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
        }
        if (target.loadingType == 2) {
          wx.showNavigationBarLoading();
        }
        target.params.templateid = configModel.templateId;
        target.params.template_id = configModel.templateId;
        target.params.session_id = wx.getStorageSync('sessionid');
        target.params.sessionid = wx.getStorageSync('sessionid');
        target.params.sessionId = wx.getStorageSync('sessionid');
        target.params.token = wx.getStorageSync('sessionid');
        target.params.organization_id = configModel.organizationId;
        target.params.brand_id = configModel.brandId;
        target.params.brandId = configModel.brandId;
        target.params.shop_id = configModel.shopId;
        target.params.shopId = configModel.shopId;
        target.params.ecrmSource = configModel.ecrmSource;
        wx.request({
          url: target.url,
          method: target.method,
          data: target.params,
          header: target.header == 1 ? this.header_json : target.header == 2 ? this.header_form : {},
          responseType: target.responseType,
          success: (res) => {
            console.log(res, `@${target.url}`);
            let { data, data: { errcode } } = res;
            if (res.statusCode != 200) {
              this.modal('网络开小差~~');
              return
            }
            if (errcode == 30002) {
              // 接口需要unionid && unionid不存在
              userModel.isAuthUnionid = false;
              configModel.needUnionid = 1;
              memberService.setBackJump();
              this.link(pathModel.mc_screen);
              return
            }
            if (errcode == 30001) {
              // session过期
              if (requestNum >= 1) {
                this.modal('session获取失败');
                return
              }
              requestNum++;
              resolveArr.push(resolve);
              this.login(() => {
                if (!wx.getStorageSync('sessionid')) {
                  memberService.setBackJump();
                  this.link(pathModel.mc_screen);
                } else {
                  closure.call(this);
                }
              })
              return
            }
            resolve(res);
            if (resolveArr.length) {
              resolveArr.forEach((item, key) => {
                item(res);
              })
              resolveArr = [];
            }
          },
          fail: (err) => {
            reject(err);
          },
          complete: () => {
            if (target.loadingType == 1) {
              wx.hideLoading();
            }
            if (target.loadingType == 2) {
              wx.hideNavigationBarLoading();
            }
          },
        });
      })
    }
    return closure.call(this);
  }

  /**
   * 授权-login
   * @param {function} cb 调用成功的回调
   */
  login(cb) {
    wx.login({
      success: (data) => {
        let { code } = data;
        wx.request({
          url: apiModel.mc_login,
          method: 'GET',
          header: this.header_form,
          data: {
            code,
            templateid: configModel.templateId,
            organization_id: configModel.organizationId,
            old_session_id: wx.getStorageSync('sessionid'),
            need_unionid: configModel.needUnionid,
            appid: configModel.miniAppid,
          },
          success: (res) => {
            console.log(res, `@${apiModel.mc_login}`);
            if (res.statusCode != 200) {
              this.modal('网络开小差~~');
              return
            }
            let { data, data: { code } } = res;
            if (code == 200) {
              // 登录成功
              wx.setStorageSync('sessionid', data.miniapp_session_id);
              wx.setStorageSync('sessionid_temp', data.miniapp_session_id);
              userModel.isAuthUnionid = data.allow_auth == 1 ? true : false;
              userModel.openid = data.openid;
              userModel.unionid = data.unionid ? data.unionid : '';
              cb && cb();
              getApp().etrack.applyUser({
                'openId': userModel.openid,
                'unionId': userModel.unionid,
              })
              return
            }
            if (code == 201) {
              // 需要userinfo授权
              wx.setStorageSync('sessionid_temp', data.temp_miniapp_auth_token);
              userModel.isAuthUnionid = false;
              cb && cb();
              return
            }
          },
          complete: () => { },
        })
      }
    })
  }

  /**
   * 授权-userinfo
   * @param {object} detail 用户信息加密数据
   * @param {function} cb 调用成功的回调
   */
  getUserInfo(detail, cb) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let { encryptedData, iv } = detail;
    wx.request({
      url: apiModel.mc_userinfo,
      method: 'POST',
      header: this.header_form,
      data: {
        encryptedData,
        iv,
        appid: configModel.miniAppid,
        templateid: configModel.templateId,
        organization_id: configModel.organizationId,
        temp_miniapp_auth_token: wx.getStorageSync('sessionid_temp'),
      },
      success: (res) => {
        if (res.statusCode != 200) {
          this.modal('网络开小差~~');
          return;
        }
        let { data, data: { miniapp_session_id, code } } = res;
        if (code == 200) {
          // 授权成功
          wx.setStorageSync('sessionid', miniapp_session_id);
          userModel.isAuthUnionid = true;
          userModel.openid = data.openid;
          userModel.unionid = data.unionid ? data.unionid : '';
          cb && cb();
          getApp().etrack.applyUser({
            'openId': userModel.openid,
            'unionId': userModel.unionid,
          })
        } else {
          // 处理长时间停留在授权页导致session过期的问题
          this.login(() => {
            this.getUserInfo(detail, cb);
          })
        }
      },
      complete: () => {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
      },
    })
  }

  /**
   * 页面跳转
   * @param {string} url 跳转页面url
   * @param {number} type 跳转类型 1:redirectTo 2-reLaunch 3-switchTab 默认-navigateTo
   */
  link(url, type) {
    if (this.lastJumpUrl === url) {
      console.log(url, '=====页面重复跳转');
      setTimeout(() => {
        this.lastJumpUrl = '';
      }, 1000);
      return
    }
    this.lastJumpUrl = url;
    function callback() {
      this.lastJumpUrl = '';
    }
    if (type === 1) {
      wx.redirectTo({
        url,
        complete: () => {
          callback.call(this);
        },
      });
    } else if (type === 2) {
      wx.reLaunch({
        url,
        complete: () => {
          callback.call(this);
        },
      });
    } else if (type === 3) {
      wx.switchTab({
        url,
        complete: () => {
          callback.call(this);
        },
      });
    } else {
      wx.navigateTo({
        url,
        complete: () => {
          callback.call(this);
        },
      });
    }
  }

  /**
   * 根据图片宽度获取图片的自适应高度
   * @param {object} e 加载图片的e对象
   * @param {number} width 图片宽度（单位：rpx）
   */
  getImageHeightByWidth(e, width) {
    var real_width = e.detail.width; // 图片-真实宽
    var real_height = e.detail.height; // 图片-真实高
    return width * real_height / real_width; // 图片-小程序高
  }

  /**
   * 根据毫秒获取当前的date参数 ms-毫秒值
   * @param {string} ms 毫秒
   */
  getDateByMilliSecond(ms) {
    let monthGroup = '一,二,三,四,五,六,七,八,九,十,十一,十二'.split(',');
    let weekGroup = '日,一,二,三,四,五,六,'.split(',');
    let date = new Date(ms);
    let year = date.getFullYear(); // 年
    let month = date.getMonth() + 1; // 月
    let month_china = monthGroup[month - 1];
    let day = date.getDate(); // 日
    let week = date.getDay(); // 一周中的某一天
    let week_china = weekGroup[week];
    let hour = date.getHours();
    let minute = date.getMinutes();
    return {
      year,
      month: month >= 10 ? month : '0' + month,
      month_china,
      day: day >= 10 ? day : '0' + day,
      week,
      week_china,
      hour: hour >= 10 ? hour : '0' + hour,
      minute: minute >= 10 ? minute : '0' + minute,
      ms,
    }
  }

  /**
   * 上传图片
   * @param {object} obj 上传图片的配置信息
   * obj属性说明：
   * {string} url 开发者服务器地址
   * {string} filePath 要上传文件资源的路径
   * {string} name 文件对应的key，开发者在服务端可以通过这个key获取文件的二进制内容
   * {object} formData HTTP请求中其他额外的formdata
   * {function} success 回调函数
   */
  uploadFile(obj) {
    let target = {
      url: '',
      filePath: '',
      name: '',
      formData: '',
      success: '',
    };
    Object.assign(target, obj);
    wx.showNavigationBarLoading();
    wx.uploadFile({
      url: obj.url,
      filePath: obj.filePath,
      name: obj.name,
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: obj.formData,
      success(res) {
        obj.success && obj.success(res);
      },
      complete() {
        wx.hideNavigationBarLoading();
      }
    })
  }

  /**
   * 路由参数对象 转换成 拼接字符串
   * @param {object} obj 路由参数
   */
  getRouteStrByObj(obj) {
    let result = '';
    for (let key in obj) {
      let value = obj[key];
      if (result) {
        result += `&${key}=${value}`;
      } else {
        result += `?${key}=${value}`;
      }
    }
    return result
  }

}

export default new MainService();



