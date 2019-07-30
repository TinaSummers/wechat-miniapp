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

  questionList(params, id){
    let url = apiModel.qs_list.replace('#', id);
    return mainService.request({
      url,
      params,
      method: 'GET',
      header: 1,
      loadingType: 1,
    });
  }

  questionReport(params){
    return mainService.request({
      url: apiModel.qs_report,
      params,
      method: 'POST',
      header: 1,
      loadingType: 1,
    });
  }

  sendPoint(params){
    return mainService.request({
      url: apiModel.qs_send_point,
      params,
      method: 'GET',
      header: 1,
      loadingType: 1,
    });
  }

}

export default new AjaxService();
