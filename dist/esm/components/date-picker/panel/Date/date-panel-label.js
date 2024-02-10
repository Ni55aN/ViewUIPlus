import { openBlock, createElementBlock, withDirectives, normalizeClass, toDisplayString, vShow, createCommentVNode, Fragment, createTextVNode } from "vue";
import _export_sfc from "../../../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  props: {
    datePanelLabel: Object,
    currentView: String,
    datePrefixCls: String
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", null, [
    $props.datePanelLabel ? withDirectives((openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass([$props.datePrefixCls + "-header-label"]),
      onClick: _cache[0] || (_cache[0] = (...args) => $props.datePanelLabel.labels[0].handler && $props.datePanelLabel.labels[0].handler(...args))
    }, toDisplayString($props.datePanelLabel.labels[0].label), 3)), [
      [vShow, $props.datePanelLabel.labels[0].type === "year" || $props.currentView === "date"]
    ]) : createCommentVNode("", true),
    $props.datePanelLabel && $props.currentView === "date" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
      createTextVNode(toDisplayString($props.datePanelLabel.separator), 1)
    ], 64)) : createCommentVNode("", true),
    $props.datePanelLabel ? withDirectives((openBlock(), createElementBlock("span", {
      key: 2,
      class: normalizeClass([$props.datePrefixCls + "-header-label"]),
      onClick: _cache[1] || (_cache[1] = (...args) => $props.datePanelLabel.labels[1].handler && $props.datePanelLabel.labels[1].handler(...args))
    }, toDisplayString($props.datePanelLabel.labels[1].label), 3)), [
      [vShow, $props.datePanelLabel.labels[1].type === "year" || $props.currentView === "date"]
    ]) : createCommentVNode("", true)
  ]);
}
var datePanelLabel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { datePanelLabel as default };
