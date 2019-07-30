import imgModel from '../../models/img.model';
/**
 * 奖品（话费）组件
 * @param {object} item 券详情
 */

 Component({
     options: {
         multipleSlots: true, //在组件定义时的选项中启用多slot支持
     },
     properties: {
         item: {
             type: Object,
             value: null,
             observer(newValue, oldValue){
                 this.setData({
                     item: newValue
                 })
             }
         },
     },
     data: {
        imgModel,
        item: null,
     },
     attached(){

     },
     methods: {
         /**
          * 将日期转换成MM.dd
          * @param {string} date //字符串日期格式
          */
        _changeTime(date){
            let d = new Date(date.replace(/-/g, '/'));
            let month = d.getMonth() + 1;
            let day = d.getDate();
            return [month, day].map(this._formatNumber).join('.');
        },
        _formatNumber(n){
            n = n.toString();
            return n[1] ? n:'0'+n;
        },
     }
 })