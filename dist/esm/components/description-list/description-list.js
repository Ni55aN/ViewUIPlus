import Row from "../row/row.js";
import { oneOf } from "../../utils/assist.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createTextVNode, toDisplayString, createCommentVNode, createVNode, withCtx } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "DescriptionList",
  components: { Row },
  provide() {
    return {
      DescriptionListInstance: this
    };
  },
  props: {
    layout: {
      validator(value) {
        return oneOf(value, ["horizontal", "vertical"]);
      },
      default: "horizontal"
    },
    title: {
      type: String
    },
    gutter: {
      type: Number,
      default: 32
    },
    col: {
      validator(value) {
        return oneOf(value, [1, 2, 3, 4]);
      },
      default: 3
    }
  }
};
const _hoisted_1 = {
  key: 0,
  class: "ivu-description-list-title"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Row = resolveComponent("Row");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["ivu-description-list", { "ivu-description-list-vertical": $props.layout === "vertical" }])
  }, [
    $props.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", _hoisted_1, [
      renderSlot(_ctx.$slots, "title", {}, () => [
        createTextVNode(toDisplayString($props.title), 1)
      ])
    ])) : createCommentVNode("", true),
    createVNode(_component_Row, { gutter: $props.gutter }, {
      default: withCtx(() => [
        renderSlot(_ctx.$slots, "default")
      ]),
      _: 3
    }, 8, ["gutter"])
  ], 2);
}
var DescriptionList = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { DescriptionList as default };
