import interceptor from 'interceptor';
import mainService from '../../services/main.service';

interceptor(function (e, next) {
  const auth = e.currentTarget && e.currentTarget.dataset.mark == 'auth';
  const register = e.currentTarget && e.currentTarget.dataset.mark == 'register';
  if (auth) {
    // 授权unionid拦截
    mainService.awakeAuthComponent({
      success: () => {
        next();
      },
      fail: () => { }
    })
    return
  }
  if (register) {
    // 注册拦截
    mainService.awakeRegisterComponent({
      success: () => {
        next();
      },
      fail: () => { }
    })
    return
  }
  // 其他场景不拦截
  next();
})
