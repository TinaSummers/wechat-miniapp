import interceptor from 'interceptor';
import mainService from '../../services/main.service';

interceptor(function (e, next) {
  const { mark: { auth, register } } = e;
  let page = mainService.getCurrPage().page;
  if (auth) {
    // 授权unionid拦截
    page.selectComponent('#comp-auth').openHandle({
      success: () => {
        console.log('拦截器，授权成功');
        next();
      },
      fail: () => {
        console.log('拦截器，授权失败');
      }
    })
    return
  }
  if (register) {
    // 注册拦截
    page.selectComponent('#comp-register').openHandle({
      success: () => {
        console.log('拦截器，入会成功');
        next();
      },
      fail: () => {
        console.log('拦截器，入会失败');
      }
    })
    return
  }
  // 其他场景不拦截
  next();
})
