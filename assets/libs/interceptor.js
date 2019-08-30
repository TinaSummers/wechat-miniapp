/**
 * 页面事件拦截器 by golan 20190821
 */
export default function interceptor() {
  let FILTER = ["onLoad", "onShow", "onHide", "onReady", "onUnload", "onShareAppMessage"], PAGE = Page, COMPONENT = Component, HOOK = arguments.length ? arguments[0] : void 0,
    bindContext = function (key, args, hook) {
      if (args[key]) {
        let originMethod = args[key];
        args[key] = function (...args2) {
          if (hook && args2[0] && args2[0].currentTarget) {
            hook.call(this, args2[0], () => {
              return originMethod.apply(this, args2);
            });
          } else {
            return originMethod.apply(this, args2);
          }
        };
      }
    },
    jackPage = function (args) {
      Object.keys(args).forEach((key) => {
        switch (true) {
          case FILTER.includes(key): break;
          case '[object Function]' !== {}.toString.call(args[key]): break;
          default: bindContext(key, args, HOOK);
        }
      })
      PAGE(args);
    },
    jackComponent = function (args) {
      Object.keys(args.methods).forEach((key) => {
        switch (true) {
          case '[object Function]' !== {}.toString.call(args.methods[key]): break;
          default: bindContext(key, args.methods, HOOK);
        }
      })
      COMPONENT(args);
    }
  return Page = jackPage, Component = jackComponent, void 0;
} 