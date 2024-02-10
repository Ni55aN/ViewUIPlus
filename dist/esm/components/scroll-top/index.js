import { isClient } from "../../utils/index.js";
function requestAnimation(task) {
  if (isClient && "requestAnimationFrame" in window) {
    return window.requestAnimationFrame(task);
  }
  setTimeout(task, 16);
}
function index(el, settings, callback) {
  if (!el) {
    return;
  }
  if (typeof settings === "function") {
    callback = settings;
    settings = null;
  }
  if (!settings) {
    settings = {};
  }
  settings.time = isNaN(settings.time) ? 500 : settings.time;
  const from = el.scrollTop;
  const to = settings.to || 0;
  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / settings.time * 50);
  function scroll(start, end, step2) {
    if (start === end) {
      callback && callback();
      return;
    }
    let d = start + step2 > end ? end : start + step2;
    if (start > end) {
      d = start - step2 < end ? end : start - step2;
    }
    el.scrollTop = d;
    requestAnimation(() => scroll(d, end, step2));
  }
  scroll(from, to, step);
}
export { index as default };
