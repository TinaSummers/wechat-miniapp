/**
 * ajax请求集合
 */
import apiModel from '../../../models/api.model';
import mainService from '../../../services/main.service';

class AjaxService {
  saveFormId(params) {
    // 保存formid
    return mainService.request({
      url: apiModel.mc_save_formid,
      params,
      method: 'POST',
      header: 1,
      loadingType: 0,
    });
  }
}

export default new AjaxService();
