import { addClass, removeClass } from "../utils/assist.js";
var lineClamp = {
  mounted(el, binding) {
    if (binding.value) {
      addClass(el, "ivu-line-clamp");
      el.style["-webkit-line-clamp"] = binding.value;
    }
  },
  updated(el, binding) {
    if (binding.value) {
      el.style["-webkit-line-clamp"] = binding.value;
    }
  },
  unmounted(el) {
    removeClass(el, "ivu-line-clamp");
    el.style["-webkit-line-clamp"] = null;
  }
};
export { lineClamp as default };
