var tracking = function () {
  const lifeCycleList = ['onLoad', 'onShow'], PAGE = Page;

  var addTracking = function (obj, item) {
    let originFun = obj[item];
    obj[item] = function(args) {
      console.log(`${item} tracking`);
      originFun.call(this, args);
    }
  }

  var pageRun = function (obj) {
    Object.keys(obj).forEach((item, key) => {
      if (lifeCycleList.includes(item)) {
        addTracking(obj, item);
      }
    })
    PAGE(obj);
  }

  Page = pageRun;
}

tracking()