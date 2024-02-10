import { openBlock, createElementBlock, renderSlot, createTextVNode, toDisplayString, createCommentVNode, createElementVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "FooterToolbar",
  props: {
    extra: {
      type: String
    }
  }
};
const _hoisted_1 = { class: "ivu-footer-toolbar" };
const _hoisted_2 = {
  key: 0,
  class: "ivu-footer-toolbar-left"
};
const _hoisted_3 = { class: "ivu-footer-toolbar-right" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    $props.extra || _ctx.$slots.extra ? (openBlock(), createElementBlock("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "extra", {}, () => [
        createTextVNode(toDisplayString($props.extra), 1)
      ])
    ])) : createCommentVNode("", true),
    createElementVNode("div", _hoisted_3, [
      renderSlot(_ctx.$slots, "default")
    ])
  ]);
}
var FooterToolbar = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { FooterToolbar as default };
