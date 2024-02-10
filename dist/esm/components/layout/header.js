import { openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-layout";
const _sfc_main = {
  name: "Header",
  computed: {
    wrapClasses() {
      return `${prefixCls}-header`;
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
var Header = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Header as default };
