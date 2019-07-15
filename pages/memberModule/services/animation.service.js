
class AnimationService{
  constructor(){

  }

  //渐入，渐出实现 
  /**
   * @param {Object} that page页实例
   * @param String param 动画名称
   * @parma Integer opacity 透明度值
   */
  animationShow(that, param, opacity) {
    let animation = wx.createAnimation({
      //持续时间500ms
      duration: 500,
      timingFunction: 'ease',
    });
    animation.opacity(opacity).step()
    //将param转换为key
    let json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  }

  //滑动渐入渐出
  /**
   * @param {Object} that page页实例
   * @param String param 动画名称
   * @param Integer px 滑动距离
   * @parma Integer opacity 透明度值
   */
  animationSlideupShow(that, param, px, opacity) {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    animation.translateY(px).opacity(opacity).step()
    //将param转换为key
    let json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  }

}

export default new AnimationService();

