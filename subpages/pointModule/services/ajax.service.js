import mainService from '../../../services/main.service';
import apiModel from '../../../models/api.model';

import mockService from './mock.service';

class AjaxService {
  getRecodeList(params) {
    return mainService.request({
      url: apiModel.pt_recode_list,
      params
    }).then(res => res.data);
  }
  getProductList(params) {
    return mainService.request({
      url: apiModel.pt_product_list,
      params
    }).then(res => res.data);
  }
  getProductDetail(params) {
    return mainService.request({
      url: apiModel.pt_product_detail,
      params
    }).then(res => res.data)
  }
  pointExchange(params) {
    return mainService.request({
      url: apiModel.pt_point_exchange,
      params,
      method: 'POST',
      header: 2,
    }).then(res => res.data)
  }
  getPointRecode(params) {
    return mainService.request({
      url: apiModel.pt_get_point_recode,
      params
    }).then(res => res.data)
  }
  getPointPrize(params) {
    return mainService.request({
      url: apiModel.pt_get_point_prize,
      params
    }).then(res => res.data)
  }
  getTurntableData(params, loadingType) {
    return mainService.request({
      url: apiModel.pt_turntable_index,
      params,
      loadingType
    }).then(res => res.data)
  }
  openPrize(params) {
    return mainService.request({
      url: apiModel.pt_open_prize,
      params
    }).then(res => res.data)
  }
  shareForFree(params) {
    return mainService.request({
      url: apiModel.pt_turntable_share,
      params,
      method: 'POST'
    }).then(res => res.data)
  }

}

export default new AjaxService();