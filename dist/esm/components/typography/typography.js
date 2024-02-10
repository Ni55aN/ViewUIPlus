import { openBlock, createElementBlock, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Typography"
};
const _hoisted_1 = { class: "ivu-typography" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("article", _hoisted_1, [
    renderSlot(_ctx.$slots, "default")
  ]);
}
var Typography = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Typography as default };
