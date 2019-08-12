import ajaxService from './ajax.service';
import configModel from '../../../models/config.model';
import mainService from '../../../services/main.service';

class QuestionService {
  constructor(){
    this.isAnswer = false; // 是否答题
  }

  /**
   * 
   * @param {function} cb 获取答题状态的回调 true-已答题 false-未答题
   */
  getAnswerStatus(cb){
    if(this.isAnswer == 1){
      cb && cb(1);
      return
    }
    ajaxService.questionList({}, configModel.surveyId).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        cb && cb(data.submited);
      } else {
        mainService.modal(errmsg);
      }
    })
  }
}

export default new QuestionService();