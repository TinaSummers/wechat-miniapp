// 后台返回数据结构说明

let data = [
  {
    "logic_type": 2,   //逻辑类型，1：关联逻辑   2：跳转逻辑
    "config": {        //逻辑配置 
      "details": [
        {   //mode == 2 只有一项
          "choices": 0,  //选项(index) mode == 1的时候存在
          "redirect_type": "1"   //跳题类型 redirect_type：1 -- 不跳转，   2  -- 跳转到文末   3 -- 直接提交   4 -- 跳转到指定题目(根据related字段)
        }, 
        {
          "choices": 1,
          "redirect_type": 4,
          "related": "7"   //跳转到某题的id  redirect_type == 4存在
        }
      ],
      "mode": 1   //跳转类型  1 -- 按选项跳转     2 -- 无条件跳转
    }
  },
  {
    "logic_type": 1,    //逻辑类型，1：关联逻辑   2：跳转逻辑
    "config": {
      "related": 7,   //被关联题的ID 
      "choices": [0]  //关联选项的下标
    }
  },
  {
    "logic_type": 1,
    "config": {
      "related": 8,
      "choices": [0, 1, 2]
    }
  }
]