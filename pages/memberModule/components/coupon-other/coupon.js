import imgModel from '../../models/img.model';
/**
 * 优惠券组件
 * @param {number} type 券状态 8-可使用 3-已使用 7-已过期
 * @param {object} item 券详情
 */

 Component({
     options: {
         multipleSlots: true, //在组件定义时的选项中启用多slot支持
     },
     properties: {
         type: {
             type: Number,
             value: 8,
         },
         item: {
             type: Object,
             value: null,
             observer(newValue, oldValue){
                 newValue.start_time = newValue.start_time && this._changeTime(newValue.start_time);
                 newValue.end_time = newValue.end_time && this._changeTime(newValue.end_time);
                 newValue.discount = Number.parseFloat(newValue.discount);
                 newValue.discount = ( (newValue.discount + '').indexOf('.') != -1 ) ? (newValue.discount*10) : newValue.discount;
                 this.setData({
                     item: newValue
                 })
             }
         },
     },
     data: {
        imgModel,
        type: 8,
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