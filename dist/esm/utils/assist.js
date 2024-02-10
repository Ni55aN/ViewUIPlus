import { isClient } from "./index.js";
function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}
let cached;
function getScrollBarSize(fresh) {
  if (isClient && (fresh || cached === void 0)) {
    const inner = document.createElement("div");
    inner.style.width = "100%";
    inner.style.height = "200px";
    const outer = document.createElement("div");
    const outerStyle = outer.style;
    outerStyle.position = "absolute";
    outerStyle.top = 0;
    outerStyle.left = 0;
    outerStyle.pointerEvents = "none";
    outerStyle.visibility = "hidden";
    outerStyle.width = "200px";
    outerStyle.height = "150px";
    outerStyle.overflow = "hidden";
    outer.appendChild(inner);
    document.body.appendChild(outer);
    const widthContained = inner.offsetWidth;
    outer.style.overflow = "scroll";
    let widthScroll = inner.offsetWidth;
    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth;
    }
    document.body.removeChild(outer);
    cached = widthContained - widthScroll;
  }
  return cached;
}
const MutationObserver = isClient ? window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || false : false;
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
function camelCase(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, "Moz$1");
}
function getStyle(element, styleName) {
  if (!isClient)
    return;
  if (!element || !styleName)
    return null;
  styleName = camelCase(styleName);
  if (styleName === "float") {
    styleName = "cssFloat";
  }
  try {
    const computed = document.defaultView.getComputedStyle(element, "");
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return element.style[styleName];
  }
}
function firstUpperCase(str) {
  return str.toString()[0].toUpperCase() + str.toString().slice(1);
}
function typeOf(obj) {
  const toString = Object.prototype.toString;
  const map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object"
  };
  return map[toString.call(obj)];
}
function deepCopy(data) {
  const t = typeOf(data);
  let o;
  if (t === "array") {
    o = [];
  } else if (t === "object") {
    o = {};
  } else {
    return data;
  }
  if (t === "array") {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]));
    }
  } else if (t === "object") {
    for (let i in data) {
      o[i] = deepCopy(data[i]);
    }
  }
  return o;
}
function scrollTop(el, from = 0, to, duration = 500, endCallback) {
  if (!isClient)
    return;
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
      return window.setTimeout(callback, 1e3 / 60);
    };
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / duration * 50);
  function scroll(start, end, step2) {
    if (start === end) {
      endCallback && endCallback();
      return;
    }
    let d = start + step2 > end ? end : start + step2;
    if (start > end) {
      d = start - step2 < end ? end : start - step2;
    }
    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step2));
  }
  scroll(from, to, step);
}
function findComponentUpward(context, componentName, componentNames) {
  if (typeof componentName === "string") {
    componentNames = [componentName];
  } else {
    componentNames = componentName;
  }
  let parent = context.$parent;
  let name = parent.$options.name;
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent;
    if (parent)
      name = parent.$options.name;
  }
  return parent;
}
function findComponentsUpward(context, componentName) {
  let parents = [];
  const parent = context.$parent;
  if (parent) {
    if (parent.$options.name === componentName)
      parents.push(parent);
    return parents.concat(findComponentsUpward(parent, componentName));
  } else {
    return [];
  }
}
const trim = function(string) {
  return (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
};
function hasClass(el, cls) {
  if (!el || !cls)
    return false;
  if (cls.indexOf(" ") !== -1)
    throw new Error("className should not contain space.");
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
  }
}
function addClass(el, cls) {
  if (!el)
    return;
  let curClass = el.className;
  const classes = (cls || "").split(" ");
  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName)
      continue;
    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += " " + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}
function removeClass(el, cls) {
  if (!el || !cls)
    return;
  const classes = cls.split(" ");
  let curClass = " " + el.className + " ";
  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName)
      continue;
    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(" " + clsName + " ", " ");
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}
const dimensionMap = {
  xs: "480px",
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1600px"
};
function setMatchMedia() {
  if (!isClient)
    return;
  const matchMediaPolyfill = (mediaQuery) => {
    return {
      media: mediaQuery,
      matches: false,
      on() {
      },
      off() {
      }
    };
  };
  window.matchMedia = window.matchMedia || matchMediaPolyfill;
}
const sharpMatcherRegx = /#([^#]+)$/;
async function downloadFile(url, name = "unnamed") {
  if (!isClient)
    return Promise.reject();
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    if (!blob)
      return Promise.reject();
    const localUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", localUrl);
    a.setAttribute("download", name);
    a.click();
    URL.revokeObjectURL(localUrl);
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}
export { MutationObserver, addClass, deepCopy, dimensionMap, downloadFile, findComponentUpward, findComponentsUpward, firstUpperCase, getScrollBarSize, getStyle, hasClass, oneOf, removeClass, scrollTop, setMatchMedia, sharpMatcherRegx, typeOf };
