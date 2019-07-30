export default {
  title: '小地包的问卷调查', // 问卷调查名称
  id: '', // 问卷调查id
  questions: [
    {
      id: '1', // 题目id
      subject: '您的年薪是多少？？', // 题目名称
      choiced: 1, // 题目是否显示 0-不显示 1-显示
      required: '1', // 是否必填 0-非必填 1-必填
      type: '1', // 答题类型 1-单选（文本） 2-多选（文本） 3-单选（图片） 4-多选（图片） 5-input输入 6-picker选择器 7-textarea输入 8-单选（文本）+其他
      picker_mode: '', // picker的模式（date/time/selector） type==6
      picker_start: '', // picker开始时间 picker_mode==date || picker_mode==time
      picker_end: '', // picker结束时间 picker_mode==date || picker_mode==time
      value: '', // 值
      value_k: '', // picker的key值 picker_mode==selector
      value_other: '', // 其他的值 type==8
      options: [ // 选项集合
        {
          text: '潇洒江梅', // 选项key
          img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1750434062,2659185363&fm=27&gp=0.jpg', // 图片资源 type==3 || type==4
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '1', // 是否有跳转逻辑 0-无 1-有
          jump_type: '2', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
        {
          text: '雪压霜欺', // 选项key
          img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1750434062,2659185363&fm=27&gp=0.jpg', // 图片资源 type==3 || type==4
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
        {
          text: '冷落新诗', // 选项key
          img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1750434062,2659185363&fm=27&gp=0.jpg', // 图片资源 type==3 || type==4
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
      ],
    },
    {
      id: '2', // 题目id
      subject: '您的年薪是多少？？', // 题目名称
      choiced: 1, // 题目是否显示 0-不显示 1-显示
      required: '0', // 是否必填 0-非必填 1-必填
      type: '2', // 答题类型 1-单选（文本） 2-多选（文本） 3-单选（图片） 4-多选（图片） 5-input输入 6-picker选择器 7-textarea输入
      picker_mode: 'time', // picker的模式 date/time/selector
      picker_start: '', // picker_mode==date || picker_mode==time
      picker_end: '', // picker_mode==date || picker_mode==time
      value: '', // 值
      value_k: '', // key值 type==6 && picker_mode==selector
      options: [ // 选项集合
        {
          text: '潇洒江梅，向竹梢疏处，横两三枝', // 选项key
          img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1750434062,2659185363&fm=27&gp=0.jpg', // 图片资源 type==3 || type==4
          value: '1', // 选项值
          selected: 0, // 是否选中
          relation_need: '1', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
        {
          text: '东君也不爱惜，雪压霜欺', // 选项key
          img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1750434062,2659185363&fm=27&gp=0.jpg', // 图片资源 type==3 || type==4
          value: '2', // 选项值
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
        {
          text: '伤心故人去后，冷落新诗', // 选项key
          img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1750434062,2659185363&fm=27&gp=0.jpg', // 图片资源 type==3 || type==4
          value: '3', // 选项值
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
      ],
    },
    {
      id: '3', // 题目id
      subject: '您的年薪是多少？？', // 题目名称
      choiced: 1, // 题目是否显示 0-不显示 1-显示
      required: '0', // 是否必填 0-非必填 1-必填
      type: '3', // 答题类型 1-单选（文本） 2-多选（文本） 3-单选（图片） 4-多选（图片） 5-input输入 6-picker选择器 7-textarea输入
      picker_mode: 'time', // picker的模式 date/time/selector
      picker_start: '', // picker_mode==date || picker_mode==time
      picker_end: '', // picker_mode==date || picker_mode==time
      value: '', // 值
      value_k: '', // key值 type==6 && picker_mode==selector
      options: [ // 选项集合
        {
          text: '潇洒江梅', // 选项key
          img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1750434062,2659185363&fm=27&gp=0.jpg', // 图片资源 type==3 || type==4
          value: '1', // 选项值
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
        {
          text: '东君也不爱惜', // 选项key
          img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1750434062,2659185363&fm=27&gp=0.jpg', // 图片资源 type==3 || type==4
          value: '2', // 选项值
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
        {
          text: '冷落新诗', // 选项key
          img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1750434062,2659185363&fm=27&gp=0.jpg', // 图片资源 type==3 || type==4
          value: '3', // 选项值
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
        {
          text: '伤心故', // 选项key
          img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1750434062,2659185363&fm=27&gp=0.jpg', // 图片资源 type==3 || type==4
          value: '4', // 选项值
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
      ],
    },
    {
      id: '4', // 题目id
      subject: '您的年薪是多少？？', // 题目名称
      choiced: 1, // 题目是否显示 0-不显示 1-显示
      required: '0', // 是否必填 0-非必填 1-必填
      type: '4', // 答题类型 1-单选（文本） 2-多选（文本） 3-单选（图片） 4-多选（图片） 5-input输入 6-picker选择器 7-textarea输入
      picker_mode: 'time', // picker的模式 date/time/selector
      picker_start: '', // picker_mode==date || picker_mode==time
      picker_end: '', // picker_mode==date || picker_mode==time
      value: '', // 值
      value_k: '', // key值 type==6 && picker_mode==selector
      options: [ // 选项集合
        {
          text: '潇洒江梅', // 选项key
          img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1750434062,2659185363&fm=27&gp=0.jpg', // 图片资源 type==3 || type==4
          value: '1', // 选项值
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
        {
          text: '东君也不爱惜', // 选项key
          img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1750434062,2659185363&fm=27&gp=0.jpg', // 图片资源 type==3 || type==4
          value: '2', // 选项值
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
        {
          text: '冷落新诗', // 选项key
          img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1750434062,2659185363&fm=27&gp=0.jpg', // 图片资源 type==3 || type==4
          value: '3', // 选项值
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
        {
          text: '伤心故', // 选项key
          img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1750434062,2659185363&fm=27&gp=0.jpg', // 图片资源 type==3 || type==4
          value: '4', // 选项值
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
      ],
    },
    {
      id: '5', // 题目id
      subject: '您的年薪是多少？？', // 题目名称
      choiced: 1, // 题目是否显示 0-不显示 1-显示
      required: '0', // 是否必填 0-非必填 1-必填
      type: '5', // 答题类型 1-单选（文本） 2-多选（文本） 3-单选（图片） 4-多选（图片） 5-input输入 6-picker选择器 7-textarea输入
      picker_mode: '', // picker的模式 date/time/selector
      picker_start: '', // picker_mode==date || picker_mode==time
      picker_end: '', // picker_mode==date || picker_mode==time
      value: '', // 值
      value_k: '', // key值 type==6 && picker_mode==selector
    },
    {
      id: '6', // 题目id
      subject: '您的年薪是多少？？', // 题目名称
      choiced: 1, // 题目是否显示 0-不显示 1-显示
      required: '0', // 是否必填 0-非必填 1-必填
      type: '6', // 答题类型 1-单选（文本） 2-多选（文本） 3-单选（图片） 4-多选（图片） 5-input输入 6-picker选择器 7-textarea输入
      picker_mode: 'time', // picker的模式 date/time/selector
      picker_start: '', // picker_mode==date || picker_mode==time
      picker_end: '', // picker_mode==date || picker_mode==time
      value: '', // 值
      value_k: '', // key值 type==6 && picker_mode==selector
    },
    {
      id: '7', // 题目id
      subject: '您的年薪是多少？？', // 题目名称
      choiced: 1, // 题目是否显示 0-不显示 1-显示
      required: '0', // 是否必填 0-非必填 1-必填
      type: '7', // 答题类型 1-单选（文本） 2-多选（文本） 3-单选（图片） 4-多选（图片） 5-input输入 6-picker选择器 7-textarea输入
      picker_mode: '', // picker的模式 date/time/selector
      picker_start: '', // picker_mode==date || picker_mode==time
      picker_end: '', // picker_mode==date || picker_mode==time
      value: '', // 值
      value_k: '', // key值 type==6 && picker_mode==selector
    },
    {
      id: '8', // 题目id
      subject: '您的年薪是多少？？', // 题目名称
      choiced: 1, // 题目是否显示 0-不显示 1-显示
      required: '1', // 是否必填 0-非必填 1-必填
      type: '8', // 答题类型 1-单选（文本） 2-多选（文本） 3-单选（图片） 4-多选（图片） 5-input输入 6-picker选择器 7-textarea输入 8-单选（文本）+其他
      picker_mode: '', // picker的模式 date/time/selector
      picker_start: '', // picker_mode==date || picker_mode==time
      picker_end: '', // picker_mode==date || picker_mode==time
      value: '', // 值
      value_k: '', // key值 picker_mode==selector
      value_other: '', // 其他的值 type==8
      options: [ // 选项集合
        {
          text: '潇洒江梅', // 选项key
          img: '', // 图片资源 type==3 || type==4
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '1', // 是否有跳转逻辑 0-无 1-有
          jump_type: '2', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '7', // 跳转到的题目id jump_type==2
        },
        {
          text: '东君也不爱惜', // 选项key
          img: '', // 图片资源 type==3 || type==4
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
        {
          text: '伤心故人去后', // 选项key
          img: '', // 图片资源 type==3 || type==4
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
        {
          text: '其他', // 选项key
          img: '', // 图片资源 type==3 || type==4
          selected: 0, // 是否选中
          relation_need: '0', // 是否有关联逻辑 0-无 1-有
          relations: [], // 被关联题的id集合
          jump_need: '0', // 是否有跳转逻辑 0-无 1-有
          jump_type: '', // 跳转类型 1：直接提交[暂无] 2：跳转到指定题目
          jump_id: '', // 跳转到的题目id jump_type==2
        },
      ],
    },
  ]
}