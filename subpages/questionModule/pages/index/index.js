import mainService from '../../../../services/main.service';
import ajaxService from '../../services/ajax.service';
import imgModel from '../../models/img.model';
import mockModel from '../../models/mock.model';
import memberService from '../../../../pages/memberModule/services/member.service';
import pathModel from '../../../../models/path.model';
import configModel from '../../../../models/config.model';

/**
 * 备注：
 * 关联题可以有多个被关联题，被关联题只能有一个关联题；
 * 跳题只能有一个被跳题，被跳题可以有多个跳题；
 * 
 * 逻辑实现：
 * 初始进入页面，获得数据originData, renderData，被关联题隐藏；
 * 选项改变后，记录每题的值，保存在resultList中；
 * 遍历originData, resultList，如果题目显示 && 有选中项，先处理关联逻辑再处理跳题逻辑，更新renderData；
 */
Page({
  data: {
    navHeight: 0,
    imgModel,
    originData: null, // 题库初始数据
    renderData: null, // 题库渲染数据
    resultList: [], // 保存题目的值集合
    currIndex: 0, // 当前题下标
    canSubmit: false, // 是否可答题
  },
  onLoad() {
    this.setNav();
    memberService.initMiniProgram(() => {
      this.judgeRegisterStatus();
    })
  },
  onShow() { },
  setNav() {
    this.selectComponent('#comp-nav-dynamic').setOptions({
      navBackgroundInit: '#ffffff', // 导航栏背景颜色-初始值
      navBackgroundRoll: '#ffffff', // 导航栏背景颜色-滚动值
      titleColorInit: '#000000', // 标题颜色-初始值
      titleColorRoll: '#000000', // 标题颜色-滚动值
      titleTextInit: '美丽问卷', // 标题文字-初始值
      titleTextRoll: '', // 标题文字-滚动值
      historyShow: true, // 历史图标是否显示
      scrollMin: 0, // 最小滚动间距（保持初始值，设置为0），单位px
      scrollMax: 0, // 最大滚动间距（保持初始值，设置为0），单位px
      homeShow: true, // 是否展示home图标
      homeJudgeStack: false, // home图标展示是否判断页面栈
      homePath: '/pages/memberModule/pages/index/index', // 默认的home页面
      homeColorInit: 'white', // home图标颜色-初始值 white / black
      homeColorRoll: '', // home图标颜色-滚动值 white / black
    })
    this.setData({
      navHeight: this.selectComponent('#comp-nav-dynamic').getNavHeight(),
    })
  },
  judgeRegisterStatus() {
    // 调用注册组件弹窗
    this.selectComponent('#comp-register').openHandle({
      success: () => {
        console.log('入会成功');
        this.getRenderData();
      }
    })
  },
  getRenderData() {
    // 获取renderData
    ajaxService.questionList({}, configModel.surveyId).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        if (data.submited) {
          mainService.modal('您已参与过该活动', '提示', () => {
            if (getCurrentPages().length < 2) {
              mainService.link(pathModel.mc_index, 3);
            } else {
              wx.navigateBack();
            }
          });
          return
        }
        this.initData(data.survey);
      } else {
        mainService.modal(errmsg);
      }
    })
    // 测试代码 start
    // this.setData({
    //   originData: mockModel,
    //   renderData: JSON.parse(JSON.stringify(mockModel)),
    // })
    // 测试代码 end
  },
  initData(data) {
    // 初始化Data
    const result = {};
    result.title = data.instruction;
    result.id = data.id;
    result.questions = [];
    data.questions.forEach((item, key, array) => {
      const question = {};
      question.id = item.question_id;
      question.subject = item.questions.question_title;
      question.choiced = 1;
      question.required = item.questions.required;
      item.questions.type == 1 && item.questions.mode == 1 && (question.type = 1);
      item.questions.type == 1 && item.questions.mode == 2 && (question.type = 2);
      item.questions.type == 3 && item.questions.mode == 1 && (question.type = 3);
      item.questions.type == 3 && item.questions.mode == 2 && (question.type = 4);
      item.questions.type == 2 && (question.type = 5);
      item.questions.type == 4 && (question.type = 6) && (question.picker_mode = 'date') && (question.placeholder = '请选择您的生日');
      item.questions.type == 7 && (question.type = 6) && (question.picker_mode = 'region') && (question.placeholder = '请选择您所在的省市区');
      item.questions.type == 1 && item.questions.mode == 3 && (question.type = 6) && (question.picker_mode = 'selector');
      item.questions.type == 6 && (question.type = 7);
      item.questions.type == 5 && (question.type = 8);
      question.picker_start = '';
      question.picker_end = '';
      question.value = '';
      question.value_k = '';
      question.options = [];
      if (question.type == 6 && question.picker_mode == 'date') {
        question.picker_start = '1900-01-01';
        question.picker_end = this.initDateEnd();
      }
      if ([1, 2, 3, 4, 8].indexOf(question.type) > -1 || (question.type == 6 && question.picker_mode == 'selector')) {
        // 选择题类型
        const options = [];
        JSON.parse(item.questions.options).forEach((v, k) => {
          const option = {};
          option.text = v.name;
          option.img = v.url;
          option.selected = 0;
          option.relation_need = 0;
          option.relations = [];
          option.jump_need = 0;
          option.jump_type = '';
          option.jump_id = '';
          options.push(option);
        })
        // 关联+跳题逻辑
        let logics = item.logics ? JSON.parse(item.logics) : [];
        logics.forEach((v, k) => {
          if (v.logic_type == 1) {
            // 关联逻辑
            v.config.choices.forEach((v2, k2) => {
              options[v2].relation_need = 1;
              options[v2].relations.push(v.config.related);
            })
          }
          if (v.logic_type == 2) {
            // 跳转逻辑
            if (v.config.mode == 1) {
              v.config.details.forEach((v2, k2) => {
                if (v2.redirect_type == 4) {
                  options.jump_need = 1;
                  options[v2.choices].jump_type = 2;
                  options[v2.choices].jump_id = v2.related;
                }
              })
            }
            if (v.config.mode == 2) {
              options.forEach((v2, k2) => {
                if (v.config.details[0].redirect_type == 4) {
                  // 跳转到指定题目
                  v2.jump_need = 1;
                  v2.jump_type = 2;
                  v2.jump_id = v.details[0].related;
                }
                if (v.config.details[0].redirect_type == 2) {
                  // 跳转到文末
                  v2.jump_need = 1;
                  v2.jump_type = 2;
                  v2.jump_id = array[array.length - 1].question_id;
                  console.log(v2.jump_id);
                }
              })
            }
          }
        })
        question.options = options;
      }
      result.questions.push(question);
    })
    // 隐藏关联题
    result.questions.forEach((item, key) => {
      item.options.forEach((v, k) => {
        if (v.relation_need == 1) {
          v.relations.forEach((v2, k2) => {
            result.questions.forEach((v3, k3) => {
              if (v2 == v3.id) {
                v3.choiced = 0;
              }
            })
          })
        }
      })
    })
    console.log(result);
    this.setData({
      originData: result,
      renderData: JSON.parse(JSON.stringify(result)),
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
    return `${year}-${month}-${day}`
  },
  chooseChange(e) {
    // 单选、多选事件
    let { currentTarget: { dataset: { index, i } } } = e;
    this.updateOptions(index, i);
    this.updateResultList();
    this.resetRenderData();
    this.judgeCanSubmit();
  },
  updateOptions(index, i) {
    // 重置选项状态
    // index-question下标 i-option下标
    let question = this.data.renderData.questions[index];
    if (question.type == 1 || question.type == 3 || question.type == 8) {
      // 单选
      question.options.forEach((item, key) => {
        item.selected = 0;
      })
      question.options[i].selected = 1;
      question.value = i;
    }
    if (question.type == 2 || question.type == 4) {
      // 多选
      question.options[i].selected = question.options[i].selected == 1 ? 0 : 1;
      let arr = [];
      question.options.forEach((item, key) => {
        if (item.selected == 1) {
          arr.push(key);
        }
      })
      question.value = arr.join(',');
    }
  },
  updateResultList() {
    // 更新resultList
    let result = [];
    this.data.renderData.questions.forEach((item, key) => {
      result.push({
        value: item.value + '',
        value_k: item.value_k,
      });
    })
    this.data.resultList = result;
    console.log(result, '===resultList');
  },
  resetRenderData() {
    // 重置renderData
    this.data.renderData = JSON.parse(JSON.stringify(this.data.originData));
    this.data.renderData.questions.forEach((item, key) => {
      let result = this.data.resultList[key];
      // 更新value / value_k / options
      item.value = result.value;
      item.value_k = result.value_k;
      if (item.type == 1 || item.type == 2 || item.type == 3 || item.type == 4 || item.type == 8) {
        // @选择题
        let valueArr = result.value.length ? result.value.split(',') : [];
        if (item.choiced == 1 && valueArr.length > 0) {
          // 题目显示 && 有选中的项
          valueArr.forEach((v, k) => {
            item.options[v].selected = 1;
          })
          // 先关联再跳题
          this.resetDataByRelation(item);
          this.resetDataByJump(item, key);
        }
      }
    })
    this.setData({
      renderData: this.data.renderData,
    })
  },
  resetDataByRelation(question) {
    // 更新渲染数据-关联逻辑
    question.options.forEach((item, key) => {
      if (item.relation_need == 1 && item.selected == 1) {
        item.relations.forEach((v, i) => {
          this.data.renderData.questions.forEach((v2, i2) => {
            if (v == v2.id) {
              v2.choiced = 1;
            }
          })
        })
      }
    })
  },
  resetDataByJump(question, currIndex) {
    // 更新渲染数据-跳题逻辑
    question.options.forEach((item, key) => {
      if (item.jump_need == 1 && item.selected == 1 && item.jump_type == 2) {
        let jumpIndex = this.getIndexById(item.jump_id);
        this.data.renderData.questions.forEach((v, k) => {
          if (k > currIndex && k < jumpIndex) {
            v.choiced = 0;
          }
          if (k == jumpIndex) {
            v.choiced = 1;
          }
        })
      }
    })
  },
  inputChange(e) {
    // input事件
    let { currentTarget: { dataset: { index } } } = e;
    let value = e.detail.value;
    this.setData({
      [`renderData.questions[${index}].value`]: value,
    })
  },
  inputChange_other(e) {
    // input事件
    let { currentTarget: { dataset: { index } } } = e;
    let value = e.detail.value;
    this.setData({
      [`renderData.questions[${index}].value_other`]: value,
    })
  },
  pickerChange(e) {
    // picker事件
    let { currentTarget: { dataset: { index } } } = e;
    let item = this.data.renderData.questions[index];
    let value = e.detail.value;  // mode=selector为下标值，其他为真实值
    if (item.picker_mode == 'selector') {
      this.setData({
        [`renderData.questions[${index}].value`]: value,
        [`renderData.questions[${index}].value_k`]: item.options[value].text,
      })
    } else {
      this.setData({
        [`renderData.questions[${index}].value`]: value,
      })
    }
  },
  getIndexById(id) {
    // 根据题目id获取下标
    let result = -1;
    this.data.renderData.questions.forEach((item, index) => {
      if (item.id == id) {
        result = index;
      }
    })
    return result;
  },
  nextHandle() {
    // 下一题事件回调
    if (!this.judgeCanNext(this.data.currIndex)) {
      return
    }
    this.getCurrIndex();
  },
  judgeCanNext(index) {
    // 判断是否可下一题
    let item = this.data.renderData.questions[index];
    if (item.choiced == 1 && item.required == 1 && !item.value.length) {
      mainService.toast('尚有未答的题');
      return false;
    }
    if (item.type == 8 && item.options[item.options.length - 1].selected == 1 && !item.value_other) {
      // 表单有其他选项单独处理
      mainService.toast('尚有未答的题');
      return false;
    }
    return true;
  },
  getCurrIndex() {
    // 获取下一题的下标
    let curr = this.data.currIndex;
    let next = 0;
    for (let i = curr + 1; i <= this.data.renderData.questions.length - 1; i++) {
      let item = this.data.renderData.questions[i];
      if (item.choiced == 1) {
        next = i;
        break;
      }
    }
    this.setData({
      currIndex: next,
    })
  },
  judgeCanSubmit() {
    // 判断是否可提交答案
    let canSubmit = true;
    let curr = this.data.currIndex;
    for (let i = curr + 1; i <= this.data.renderData.questions.length - 1; i++) {
      let item = this.data.renderData.questions[i];
      if (item.choiced == 1) {
        canSubmit = false;
      }
    }
    this.setData({
      canSubmit,
    })
  },
  submitHandle(e) {
    mainService.throttle(() => {
      this.submitHandleCb(e);
    }, 5000)
  },
  submitHandleCb(e) {
    // 判断是否完成答题
    if (!this.judgeCanNext(this.data.currIndex)) {
      return
    }
    memberService.saveFormId(e);
    // 获取parmas
    let params = [];
    for (let i = 0; i < this.data.renderData.questions.length; i++) {
      let item = this.data.renderData.questions[i];
      params.push({
        question_id: item.id,
        answer: item.value,
        enter_answer: item.value_other ? item.value_other : '',
      })
    }
    console.log(params);
    ajaxService.questionReport({
      survey_id: configModel.surveyId,
      status: 1,
      details: JSON.stringify(params),
    }).then((res) => {
      let { data: { errcode, data, errmsg } } = res;
      if (errcode == 0) {
        mainService.modal('提交成功！', '提示', () => {
          mainService.link(pathModel.mc_index, 3);
        });
      } else {
        mainService.modal(errmsg);
      }
    })
  },
})