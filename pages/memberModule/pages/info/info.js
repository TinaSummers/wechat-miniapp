import mainService from '../../../../services/main.service'
import memberService from '../../services/member.service';
import ajaxService from '../../services/ajax.service';
import imgModel from '../../models/img.model';
import userModel from '../../models/user.model';
import pathModel from '../../../../models/path.model';
import animationService from '../../services/animation.service';

Page({
  data: {
    pageShow: false, // 页面是否显示
    imgModel,
    userModel,
    avatar: '',
    formItems: [
      { name: '姓名', key: 'name', disabled: 0, value: '', placeholder: '请输入姓名', ele: 'input', type: 'text', choiced: '1', reg: '^[a-zA-Z\u4e00-\u9fa5][a-zA-Z\u4e00-\u9fa5· ]{0,}$', must: 1, tip: '请填写姓名', },
      { name: '手机号', mark: '(不可修改)', key: 'mobile', disabled: 1, value: '', placeholder: '请输入手机号码', ele: 'input', type: 'number', choiced: '1', reg: '^[1][3-9]\\d{9}$|^([5|6|7|8|9])\\d{7}$|^[0][9]\\d{8}$|^[6]([8|6])\\d{5}$', must: 1, tip: '请填写正确的手机号码', },
      { name: '生日', mark: '(提交后不可修改)', key: 'birthday', disabled: 0, value: '', placeholder: '请选择', ele: 'picker', type: 'date', choiced: '1', reg: '\\S', must: 1, tip: '请选择生日', },
      { name: '性别', key: 'gender', disabled: 0, value: '', value_k: '', placeholder: '请选择', ele: 'picker', type: 'selector', items: [{ k: '男', v: '1' }, { k: '女', v: '2' }], choiced: '1', reg: '\\S', must: 0, tip: '请选择性别', },
      // { name: '出生日期', mark: '(提交后不可修改)', key: 'birthday', disabled: 0, value: '', placeholder: '请选择', ele: 'picker', type: 'date', choiced: '1', reg: '\\S', must: 1, tip: '请选择生日', },
      { name: '身高(cm)', key: 'parameter1', disabled: 0, value: '', placeholder: '请输入身高', ele: 'input', type: 'text', choiced: '1', reg: '^\\d*$', must: 0, tip: '身高只能是数字', },
      { name: '体重(kg)', key: 'parameter2', disabled: 0, value: '', placeholder: '请输入体重', ele: 'input', type: 'text', choiced: '1', reg: '^\\d*$', must: 0, tip: '体重只能是数字', },
    ],
    date_start: '1900-01-01', // 设置生日最小时间
    date_end: '', // 设置生日最大时间
    checked: true, // 是否阅读条款
    time_gap: 30, // 倒计时间间隔
    time_show: 0, // 当前倒计时间
    errorText: '', // 提示文本

    isShowToast: false,
    isShowToast2: false,
  },
  onLoad() {
    this.setNav();
    this.initDateEnd();
    memberService.initMiniProgram(() => {
      this.setData({
        pageShow: true,
      })
      this.selectComponent('#comp-register').openHandle({
        success: () => {
          console.log('入会成功');
          this.initFormItems();
        },
        fail: () => {
          console.log('入会失败');
          wx.navigateBack();
        }
      })
    });
  },
  onShow() { },
  setNav() {
    this.selectComponent('#comp-nav-dynamic').setOptions({
      navBackgroundInit: 'transparent', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '个人资料', // 标题文字-初始值
      titleTextRoll: '', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 0, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 0, // 最大滚动间距（保持初始值，设置为0），单位px
    })
  },
  initDateEnd() {
    // 格式化当前日期
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    month = month >= 10 ? month : `0${month}`;
    let day = now.getDate();
    day = day >= 10 ? day : `0${day}`;
    this.setData({
      date_end: `${year}-${month}-${day}`
    });
  },
  initFormItems() {
    // 初始化formItems
    ajaxService.memberDetail({}).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if(errcode == 0){
        this.data.formItems.forEach((item, key, arr) => {
          if (data.hasOwnProperty(item.key)) {
            item.value = data[item.key] ? data[item.key] : '';
            if (item.type == "selector") {
              item.items.forEach((value, index) => {
                if (item.value == value.v) {
                  item.value_k = value.k;
                }
              })
            }
          }
        })
        if(this.data.formItems[2].value){
          this.data.formItems[2].disabled = 1;
        }
        this.setData({
          formItems: this.data.formItems,
        })
      }else{  
        mainService.modal(errmsg);
      }
    })
  },
  inputHandle(e) {
    // input[text/number]
    let value = e.detail.value;
    let index = e.currentTarget.dataset.index;
    let item = this.data.formItems[index];
    item.value = value;
    this.setData({
      formItems: this.data.formItems,
    })
  },
  formChange(e) {
    // picker[selector|date] radio textarea
    let value = e.detail.value;  // selector为下标值，其他为真实值
    let index = e.currentTarget.dataset.index;
    let item = this.data.formItems[index];
    let type = item.type;
    if (type == 'selector') {
      item.value = item.items[value].v;
      item.value_k = item.items[value].k;
    } else {
      item.value = value;
    }
    this.setData({
      formItems: this.data.formItems
    })
  },
  ruleHandle() {
    this.setData({
      checked: !this.data.checked
    })
  },
  jumpPage(e) {
    let pathname = e.currentTarget.dataset.pathname;
    if (pathname) {
      mainService.link(pathModel[pathname]);
    }
  },
  submitHandle(e) {
    this.setData({isShowToast: true});
    animationService.animationSlideupShow(this, 'slide_up', -15, 1);
    // mainService.throttle(() => {
    //   this.submitHandleCb(e);
    // }, 1000);
  },
  submitHandle2(e) {
    mainService.throttle(() => {
      this.submitHandleCb(e);
      this.hideToast();
    }, 1000);
  },
  hideToast(){
    animationService.animationSlideupShow(this, 'slide_up', 15, 0);
    setTimeout(() => {
      this.setData({isShowToast: false});
    }, 350);
  },
  hideToast2(){
    animationService.animationSlideupShow(this, 'slide_up2', 15, 0);
    setTimeout(() => {
      this.setData({isShowToast2: false});
    }, 350);
  },
  submitHandleCb(e) {
    memberService.saveFormId(e);
    let formItems = this.data.formItems;
    for (let i = 0; i < formItems.length; i++) {
      let item = formItems[i];
      item.value += '';
      item.value = item.value.replace(/(^\s*)|(\s*$)/g, "");
      if (item.choiced == 1) {
        if (item.must == 1) {
          // 必填项验证
          if (!new RegExp(item.reg).test(item.value)) {
            this.setData({
              errorText: item.tip
            })
            return
          }
        } else {
          // 非必填项验证
          if (item.value && !new RegExp(item.reg).test(item.value)) {
            this.setData({
              errorText: item.tip
            })
            return
          }
        }
      }
    }
    if (!this.data.checked) {
      this.setData({
        errorText: '请阅读并同意《用户协议》'
      })
      return
    }
    this.setData({
      errorText: ''
    })
    // 获取params
    let params = {};
    formItems.forEach((item, key) => {
      if (item.choiced == 1 && item.value) {
        params[item.key] = item.value;
      }
    });
    console.log(params);
    // 请求后台
    ajaxService.memberUpdate({ ...params }).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        // mainService.toast('更新成功');
        // setTimeout(() => {
        //   wx.navigateBack();
        // }, 1000);
        this.setData({isShowToast2: true});
        animationService.animationSlideupShow(this, 'slide_up2', -15, 1);
      } else {
        mainService.modal(errmsg);
      }
    })
  },
  onBack(){
    this.hideToast2();
    wx.navigateBack();
  },
  // 切换头像
changeAvatar() {
    let that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res.tempFilePaths + "修改页面")
        let avatar = res.tempFilePaths[0];
        that.setData({
          avatar
        })
        
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  onPageScroll(e) { },
  onShareAppMessage() {
    return mainService.shareInfo();
  }
})