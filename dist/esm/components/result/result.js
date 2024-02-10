import Icon from "../icon/icon.js";
import { oneOf } from "../../utils/assist.js";
import { resolveComponent, openBlock, createElementBlock, createElementVNode, normalizeClass, createBlock, createCommentVNode, renderSlot, createTextVNode, toDisplayString } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Result",
  components: { Icon },
  props: {
    type: {
      validator(value) {
        return oneOf(value, ["success", "error", "warning"]);
      }
    },
    title: {
      type: String
    },
    desc: {
      type: String
    },
    extra: {
      type: String
    }
  },
  computed: {
    iconClasses() {
      return {
        "ivu-result-icon-success": this.type === "success",
        "ivu-result-icon-error": this.type === "error",
        "ivu-result-icon-warning": this.type === "warning"
      };
    }
  }
};
const _hoisted_1 = { class: "ivu-result" };
const _hoisted_2 = {
  key: 0,
  class: "ivu-result-title"
};
const _hoisted_3 = {
  key: 1,
  class: "ivu-result-desc"
};
const _hoisted_4 = {
  key: 2,
  class: "ivu-result-extra"
};
const _hoisted_5 = {
  key: 3,
  class: "ivu-result-actions"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createElementVNode("div", {
      class: normalizeClass(["ivu-result-icon", $options.iconClasses])
    }, [
      $props.type === "success" ? (openBlock(), createBlock(_component_Icon, {
        key: 0,
        type: "ios-checkmark"
      })) : createCommentVNode("", true),
      $props.type === "error" ? (openBlock(), createBlock(_component_Icon, {
        key: 1,
        type: "ios-close"
      })) : createCommentVNode("", true),
      $props.type === "warning" ? (openBlock(), createBlock(_component_Icon, {
        key: 2,
        type: "ios-information"
      })) : createCommentVNode("", true)
    ], 2),
    $props.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "title", {}, () => [
        createTextVNode(toDisplayString($props.title), 1)
      ])
    ])) : createCommentVNode("", true),
    $props.desc || _ctx.$slots.desc ? (openBlock(), createElementBlock("div", _hoisted_3, [
      renderSlot(_ctx.$slots, "desc", {}, () => [
        createTextVNode(toDisplayString($props.desc), 1)
      ])
    ])) : createCommentVNode("", true),
    $props.extra || _ctx.$slots.extra ? (openBlock(), createElementBlock("div", _hoisted_4, [
      renderSlot(_ctx.$slots, "extra", {}, () => [
        createTextVNode(toDisplayString($props.extra), 1)
      ])
    ])) : createCommentVNode("", true),
    _ctx.$slots.actions ? (openBlock(), createElementBlock("div", _hoisted_5, [
      renderSlot(_ctx.$slots, "actions")
    ])) : createCommentVNode("", true)
  ]);
}
var Result = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Result as default };
