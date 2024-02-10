import { openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-layout";
const _sfc_main = {
  name: "Content",
  computed: {
    wrapClasses() {
      return `${prefixCls}-content`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.wrapClasses)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var Content = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Content as default };
