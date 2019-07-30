import memberService from '../../services/member.service';
import mainService from '../../../../services/main.service';
import ajaxService from '../../services/ajax.service';
import adModel from './ad.model';
import pathModel from '../../../../models/path.model';

/**
 * 广告位组件
 * @param {number} position 广告位id
 * @param {number} width 广告位宽度
 * @param {number} height 广告位高度
 */
Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    // 组件的对外属性
    position: {
      type: Number,
      value: 1,
    },
    width: {
      type: Number,
      value: 750,
    },
    height: {
      type: Number,
      value: 300,
    },
  },
  data: {
    renderDetail: null, // 广告位详情
  },
  attached() {
    this.getAdList(() => {
      this.getRenderDetail();
    });
  },
  methods: {
    getAdList(cb) {
      // 获取广告列表
      if (!wx.getStorageSync('sessionid')) {
        return
      }
      if (adModel.adList.length) {
        cb && cb();
        return
      }
      ajaxService.adList({}).then(res => {
        let { data: { errcode, errmsg, data } } = res;
        if (errcode == 200) {
          // 将后台数据转换成组件数据结构
          let obj = {};
          data.forEach((item, key) => {
            obj.id = item.ad_position_id;
            obj.imgUrl = item.pic;
            switch (item.interaction_type - 0) {
              case 1: // 小程序页面 
                obj.jumpType = 2;
                if (item.page_name_id == 2) {
                  // 商品筛选页面
                  obj.miniUrl = `${item.mini_url}?id=&name=商品列表&keyword=`;
                  return
                }
                if (item.page_name_id == 3) {
                  // 商品列表页
                  let id = '';
                  let name = '';
                  if (item.group.hasOwnProperty('group_id3')) {
                    id = item.group.group_id3;
                    name = item.group.group_name3;
                  } else if (item.group.hasOwnProperty('group_id2')) {
                    id = item.group.group_id2;
                    name = item.group.group_name2;
                  } else if (item.group.hasOwnProperty('group_id1')) {
                    id = item.group.group_id1;
                    name = item.group.group_name1;
                  }
                  obj.miniUrl = `${pathModel.shop_productList}?id=${id}&name=${name}&keyword=`;
                  return
                }
                obj.miniUrl = item.mini_url;
                break;
              case 2: // 自定义页面
                if (new RegExp('^(http|https)').test(item.url)) {
                  // h5内嵌页
                  obj.jumpType = 3;
                  obj.h5Url = item.url;
                } else {
                  // 小程序页面
                  obj.jumpType = 2;
                  obj.miniUrl = item.url;
                }
                break;
              case 3: // 商品详情页
                obj.jumpType = 2;
                obj.miniUrl = `${pathModel.shop_productDetail}?productId=${item.product_id}`;
                break;
              case 10:
                obj.jumpType = 1;
                break;
            }
          })
        } else {
          mainService.modal(errmsg);
        }
      })
    },
    getRenderDetail() {
      // 获取渲染详情
      let result = null;
      adModel.adList.forEach((item, key) => {
        if (this.data.position == item.id) {
          result = item;
        }
      })
      this.setData({
        renderDetail: result
      })
    },
    jumpHandle() {
      let item = this.data.renderDetail;
      let jumpType = item.jumpType; // 跳转类型 1-无 2-跳转小程序内部页面 3-跳转H5
      switch (jumpType) {
        case 1:
          break;
        case 2:
          let miniUrl = item.miniUrl;
          if (!miniUrl) {
            return
          }
          miniUrl = miniUrl[0] == '/' ? miniUrl : '/' + miniUrl;
          let path = miniUrl.split('?')[0];
          if (mainService.isTabPage(path)) {
            mainService.link(miniUrl, 3);
          } else {
            mainService.link(miniUrl);
          }
          break;
        case 3:
          let h5Url = item.h5Url;
          if (!h5Url) {
            return
          }
          wx.setStorageSync('webviewUrl', h5Url);
          mainService.link(pathModel.mc_webview);
          break;
      }
    },
  }
})