import memberService from '../../services/member.service';
import imgModel from '../../models/img.model';
import mainService from '../../../../services/main.service';
import ajaxService from '../../services/ajax.service';
import configModel from '../../../../models/config.model';
import pathModel from '../../../../models/path.model';

Page({
  data: {
    imgModel,
    navHeight: 0, // nav高度
    renderList: [], // 渲染列表
    loadingShow: false, // 是否显示加载
    zeroShow: false, // 是否显示无数据状态
    hasMore: true, // 是否仍有列表数据
    cityGroup: [
      { placeholder: '省', range: [], key: 'province', value: '' },
      { placeholder: '市', range: [], key: 'city', value: '' },
      { placeholder: '区', range: [], key: 'district', value: '' },
    ],
    labelGroup: [],
    params_city: {
      appid: configModel.publicAppid, // 公众号appid 
      select: 'province', //  province city district
      condition: '', // 当前选项name
    },
    params: {
      latitude: '',
      longitude: '',
      page: 1, // 当前页
      page_size: 10, // 每页展示数量
      appid: configModel.publicAppid, // 公众号appid 
      keywords: '', // 关键词
      province: '', // 省
      city: '', // 市
      district: '', // 区
      label_ids: '', // 门店id（授权地址用）
      'labels[]': '', // 门店id（未授权地址用）
      label_name: '', // 门店名称（与请求无关）
    },
  },
  onLoad() {
    this.setNav();
    memberService.initMiniProgram(() => {
      this.getLocation();
      this.getProvinceCity(0);
      this.getLabel();
    });
  },
  onShow() { },
  setNav() {
    this.selectComponent('#comp-nav-dynamic').setOptions({
      navBackgroundInit: '#ffffff', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 文本颜色-初始值 16进制
      titleColorRoll: '#000000', // 文本颜色-滚动值 16进制
      titleTextInit: '合作机构', // 标题文字-初始值
      titleTextRoll: '', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 50, // 最小滚动间距，单位px
      scrollMax: 200, // 最大滚动间距，单位px
      homeShow: true, // home图标是否显示
      homeJudgeStack: true, // home图标显示是否判断页面栈
      homeColorInit: 'black', // home图标颜色-初始值 white / black
      homeColorRoll: '', // home图标颜色-滚动值 white / black
    })
    this.setData({
      navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight(),
    })
  },
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.data.params.latitude = res.latitude;
        this.data.params.longitude = res.longitude;
        this.getRenderList(1);
      },
      fail: (res) => {
        this.getRenderList(1);
      }
    })
  },
  tencentToBaidu(lat, lng) {
    // 经纬度-腾讯转换百度
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = parseFloat(lng);
    var y = parseFloat(lat);
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    lng = z * Math.cos(theta) + 0.0065;
    lat = z * Math.sin(theta) + 0.006;
    return {
      latitude: lat,
      longitude: lng,
    }
  },
  baiduToTencent(lat, lng) {
    // 经纬度-百度转换腾讯
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng - 0.0065;
    let y = lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    let lngs = z * Math.cos(theta);
    let lats = z * Math.sin(theta);
    return {
      latitude: lats,
      longitude: lngs,
    }
  },
  getRenderList(status) {
    // status 1-筛选(初始进入) 2-下拉加载
    this.data.params.province = this.data.cityGroup[0].value;
    this.data.params.city = this.data.cityGroup[1].value;
    this.data.params.district = this.data.cityGroup[2].value;
    if (!this.data.params['labels[]']) {
      delete this.data.params['labels[]'];
    }
    switch (status) {
      case 1:
        this.setData({
          zeroShow: false,
          hasMore: true,
          renderList: [],
        })
        this.data.params.page = 1;
        break;
      case 2:
        if (!this.data.hasMore) {
          setTimeout(() => {
            this.setData({
              loadingShow: false,
            })
          }, 1500);
          return
        }
        this.data.params.page++;
        break;
    }
    ajaxService.storeList(this.data.params).then((res) => {
      setTimeout(() => {
        this.setData({
          loadingShow: false
        })
      }, 1500);
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        let arr = [];
        for (let key in data.stores) {
          let item = data.stores[key];
          if (item.distance && item.distance - 0 >= 1000) {
            item.distance_km = (new Number(item.distance) / 1000).toFixed(2);
          }
          if (item.distance && item.distance - 0 < 1000) {
            item.distance = item.distance.toFixed(0);
          }
          arr.push(item);
        }
        this.data.hasMore = arr.length > 0 ? true : false;
        this.data.renderList = this.data.renderList.concat(arr);
        this.setData({
          renderList: this.data.renderList,
          hasMore: this.data.hasMore,
          zeroShow: this.data.renderList.length ? false : true,
        })
      } else {
        mainService.modal(errmsg);
      }
    })
  },
  downPullHandle() {
    mainService.throttle(() => {
      this.setData({
        loadingShow: true,
      })
      this.getRenderList(2);
    })
  },
  openLocation(e) {
    let { currentTarget: { dataset: { item } } } = e;
    // wx.openLocation({
    //   latitude: item.latitude,
    //   longitude: item.longitude,
    //   scale: 17,
    //   name: item.business_name,
    //   address: item.address,
    // })
    wx.setStorageSync('storeDetail', item);
    mainService.link(`${pathModel.mc_store_detail}`);
  },
  getProvinceCity(index) {
    // index：当前cityGroup下标
    this.data.params_city.select = this.data.cityGroup[index].key;
    if (index - 1 >= 0) {
      // 非省
      this.data.params_city.condition = this.data.cityGroup[index - 1].value;
    } else {
      // 省
      this.data.params_city.condition = '';
    }
    ajaxService.storeOfCity(this.data.params_city).then((res) => {
      let { data: { data, errcode, errmsg } } = res;
      if (errcode == 0) {
        this.setData({
          [`cityGroup[${index}].range`]: data
        })
      } else {
        mainService.modal(errmsg);
      }
    });
  },
  getLabel() {
    ajaxService.storeOfLabel({
      appid: configModel.publicAppid, // 公众号appid 
    }).then((res) => {
      let { data: { data, errcode, errmsg } } = res;
      if (errcode == 0) {
        data.unshift({ id: '', title: '全部机构' });
        this.setData({
          labelGroup: data,
        })
      } else {
        // mainService.modal(errmsg);
      }
    })
  },
  areaChange(e) {
    let value = e.detail.value;  // selector为下标值
    let index = e.currentTarget.dataset.index; // cityGroup的列
    let result = this.data.cityGroup[index].range[value]; // 当前value
    this.data.cityGroup[index].value = result ? result : '';
    this.data.cityGroup.forEach((item, key) => {
      if (key > index) {
        item.value = '';
        this.getProvinceCity(key);
      }
    })
    this.setData({
      cityGroup: this.data.cityGroup
    })
    this.getRenderList(1);
  },
  labelChange(e) {
    let value = e.detail.value;  // selector为下标值
    let id = this.data.labelGroup[value].id; // id
    let name = this.data.labelGroup[value].title; // name
    this.data.params['labels[]'] = id;
    this.data.params['label_ids'] = id;
    this.setData({
      [`params.label_name`]: name,
    })
    this.getRenderList(1);
  },
  inputHandle(e) {
    this.data.params.keywords = e.detail.value;
  },
  searchHandle(e) {
    mainService.debounce(() => {
      this.getRenderList(1);
    }, 1000);
  },
  onShareAppMessage() {
    return mainService.shareInfo();
  },
})
