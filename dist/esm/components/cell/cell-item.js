import { openBlock, createElementBlock, createElementVNode, renderSlot, createTextVNode, toDisplayString } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "CellItem",
  props: {
    title: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    extra: {
      type: String,
      default: ""
    }
  }
};
const _hoisted_1 = { class: "ivu-cell-item" };
const _hoisted_2 = { class: "ivu-cell-icon" };
const _hoisted_3 = { class: "ivu-cell-main" };
const _hoisted_4 = { class: "ivu-cell-title" };
const _hoisted_5 = { class: "ivu-cell-label" };
const _hoisted_6 = { class: "ivu-cell-footer" };
const _hoisted_7 = { class: "ivu-cell-extra" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createElementVNode("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "icon")
    ]),
    createElementVNode("div", _hoisted_3, [
      createElementVNode("div", _hoisted_4, [
        renderSlot(_ctx.$slots, "default", {}, () => [
          createTextVNode(toDisplayString($props.title), 1)
        ])
      ]),
      createElementVNode("div", _hoisted_5, [
        renderSlot(_ctx.$slots, "label", {}, () => [
          createTextVNode(toDisplayString($props.label), 1)
        ])
      ])
    ]),
    createElementVNode("div", _hoisted_6, [
      createElementVNode("span", _hoisted_7, [
        renderSlot(_ctx.$slots, "extra", {}, () => [
          createTextVNode(toDisplayString($props.extra), 1)
        ])
      ])
    ])
  ]);
}
var CellItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CellItem as default };
