import ajaxService from '../../services/ajax.service';
import mainService from '../../../../services/main.service'
import imgModel from '../../models/img.model';
import userModel from '../../models/user.model';
import pathModel from '../../../../models/path.model';
import memberService from '../../services/member.service';

Page({
  data: {
    imgModel: imgModel,
    userModel: userModel,
    loadingShow: false, // 加载是否展示
    zeroShow: false, // 是否无数据
    renderList: [],
    params: {
      // brandId: userModel.brandId,
      // shopId: userModel.shopId,
      page: 1,
      totalPage: 1,
      size: 20,
    },
    isEdit: false, // 是否编辑
    isAll: false, // 是否全选
    // 加入购物车
    tableData: {}, // 规格参数 数据
    show_jiarugouwuche: false,
    showList: false,
    choosedSystemSku: '', // 选中商品的 sku
    choosedProductedId: '', // 选中的商品id
    choosedIndex: 0, // 选中商品的下标
    choosedProductNum: 1, // 选中商品的修改前数量
    cartId: '', // 主键
    whereType: 1, //确认按钮出处
    navHeight: 0,
  },
  onLoad(options) {
    let navData = {
      navBackgroundInit: '#ffffff', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '我的收藏', // 标题文字-初始值
      titleTextRoll: '我的收藏', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 10, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 50, // 最大滚动间距（保持初始值，设置为0），单位px
    }
    this.selectComponent('#comp-nav-dynamic').setOptions(navData);
    this.setData({navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight()});

  },
  onShow() {
    memberService.initJudgeJump(() => {
      this.setData({
        renderList: [],
        [`params.page`]: 1,
        [`params.totalPage`]: 1,
      });
      this.getRenderList(1);
    });
    
  },
  getRenderList(type) {
    // type 1-筛选(初始进入) 2-下拉加载
    switch (type) {
      case 1:
        this.setData({
          zeroShow: false,
          renderList: [],
        })
        this.data.params.page = 1;
        this.data.params.totalPage = 1;
        break;
      case 2:
        if (this.data.params.page == this.data.params.totalPage) {
          setTimeout(() => {
            this.setData({
              loadingShow: false
            })
          }, 1500);
          return
        } else {
          this.data.params.page++;
        }
        break;
    }
    ajaxService.wishList(this.data.params).then(res => {
      setTimeout(() => {
        this.setData({
          loadingShow: false
        })
      }, 1500);
      
      // res = userModel.wishRes;//用于测试
      // let { errcode, errmsg, data  } = res;
      let { data: { errcode, errmsg, data } } = res;
      if (errcode == 0) {
        
        this.data.params.page = data.currentPage;
        this.data.params.totalPage = Math.ceil(data.count / this.data.params.size);
        this.data.renderList = this.data.renderList.concat(data.list);
        this.data.renderList.forEach((item, index) => {
          if (!item.hasOwnProperty('isSelect')) {
            item.isSelect = false;
          }
        })
        this.setData({
          renderList: this.data.renderList,
          zeroShow: this.data.renderList.length ? false : true,
        })
      } else {
        mainService.modal(errmsg);
      }
    })
  },
  toggleEdit(e) {
    let status = e.currentTarget.dataset.status;
    this.setData({
      isEdit: status == 0 ? true : false,
    })
  },
  toggleSelect(e) {
    let index = e.currentTarget.dataset.index;
    this.data.renderList[index].isSelect = !this.data.renderList[index].isSelect;
    this.data.isAll = true;
    for (let i = 0; i < this.data.renderList.length; i++) {
      let item = this.data.renderList[i];
      if (!item.isSelect) {
        this.data.isAll = false;
        break;
      }
    }
    this.setData({
      renderList: this.data.renderList,
      isAll: this.data.isAll
    })
  },
  allHandle() {
    // 全选
    if (this.data.isAll) {
      // 已全选
      this.data.isAll = false;
      this.data.renderList.forEach((item, index) => {
        item.isSelect = false;
      })
    } else {
      // 未全选
      this.data.isAll = true;
      this.data.renderList.forEach((item, index) => {
        item.isSelect = true;
      })
    }
    this.setData({
      renderList: this.data.renderList,
      isAll: this.data.isAll
    })
  },
  removeHandle() {
    // 批量移除
    let result = [];
    this.data.renderList.forEach((item, index) => {
      if (item.isSelect) {
        result.push(item.product_id);
      }
    })
    if (!result.length) {
      mainService.toast('至少选中一件商品');
      return
    }
    ajaxService.wishToggle({
      brandId: userModel.brandId,
      shopId: userModel.shopId,
      productId: result.join(',')
    }).then((res) => {
      // 删除对应商品
      let { data: { errcode, errmsg } } = res;
      if (errcode == 0) {
        result.forEach((value, key) => {
          this.data.renderList.forEach((item, index, arr) => {
            if (value == item.product_id) {
              arr.splice(index, 1);
            }
          })
        })
        this.setData({
          renderList: this.data.renderList,
          zeroShow: this.data.isAll ? true : false,
        })
      } else {
        mainService.toast(errmsg);
      }
    })
  },
  downPullHandle() {
    this.setData({
      params: this.data.params, // 更新数据渲染到页面
      loadingShow: true
    })
    this.getRenderList(2);
  },
  jumpGoodDetail(e) {
    let { currentTarget: { dataset: { index } } } = e;
    let goodDetail = this.data.renderList[index];
    if (goodDetail.shop_is_delete == 1) {
      mainService.toast('商品已删除');
      return
    }
    if (goodDetail.shop_is_delete == 0 && goodDetail.shop_is_sale != 2) {
      mainService.toast('商品已下架');
      return
    }
    let product_id = goodDetail.product_id;
    mainService.link(`${pathModel.shop_productDetail}?productId=${product_id}`);
  },
  addCart(e) {
    let { currentTarget: { dataset: { index } } } = e;
    let goodDetail = this.data.renderList[index];
    if (goodDetail.shop_is_delete == 1) {
      mainService.toast('商品已删除');
      return
    }
    if (goodDetail.shop_is_delete == 0 && goodDetail.shop_is_sale != 2) {
      mainService.toast('商品已下架');
      return
    }
    let product_id = goodDetail.product_id;
    ajaxService.productDetail({
      // brandId: userModel.brandId,
      // shopId: userModel.shopId,
      productId: product_id
    }).then(res => {
      let { data: { errcode, errmsg, data } } = res;
      if (errcode == 0) {
        this.setData({
          choosedProductedId: product_id,
          show_jiarugouwuche: true,
          showList: true,
          tableData: data
        })
      } else {
        mainService.modal(errmsg);
      }
    })
  },
  closed(e) {
    this.setData({
      show_jiarugouwuche: false,
      showList: false,
    })
  },
  confirmChoose(e) {
    ajaxService.cartAdd({
      // brandId: userModel.brandId,
      // shopId: userModel.shopId,
      ...e.detail
    }).then(res => {
      let { data: { errcode, errmsg, data } } = res;
      if (errcode == 200) {
        this.setData({
          show_jiarugouwuche: false,
          showList: false,
        })
        mainService.toast('成功加入购物车');
      } else {
        mainService.modal(errmsg);
      }
    })
  }
})