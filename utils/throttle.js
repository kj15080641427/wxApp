//  function throttle(fn, gapTime) {
//   if (gapTime == null || gapTime == undefined) {
//     gapTime = 1500
//   }

//   let _lastTime = null
//   return function () {
//     let _nowTime = + new Date()
//     if (_nowTime - _lastTime > gapTime || !_lastTime) {
//       fn()
//       _lastTime = _nowTime
//     }
//   }
// }
function throttle(method, delay, mustRunDelay) {
  var timer = null, args = arguments;
  var start = 0, now = 0;
  return function () {
    var context = this;
    now = Date.now();
    if (!start) {
      start = now;
    }
    if (now - start >= mustRunDelay) {
      method.apply(context, args);
      start = Date.now();
    } else {
      clearTimeout(timer);
      timer = setTimeout(function () {
        method.apply(context, args);
      }, delay);
    }

  }
}
module.exports={
  throttle: throttle
}