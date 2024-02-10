import _sfc_main$1 from "../button/button.js";
import Icon from "../icon/icon.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, Fragment, createVNode, withCtx, toDisplayString, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Operation",
  components: { Button: _sfc_main$1, Icon },
  inject: ["TransferInstance"],
  props: {
    prefixCls: String,
    operations: Array,
    leftActive: Boolean,
    rightActive: Boolean,
    reverseOperation: Boolean
  },
  methods: {
    moveToLeft() {
      this.TransferInstance.moveTo("left");
    },
    moveToRight() {
      this.TransferInstance.moveTo("right");
    }
  }
};
const _hoisted_1 = { key: 0 };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = { key: 0 };
const _hoisted_4 = { key: 0 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_Button = resolveComponent("Button");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($props.prefixCls + "-operation")
  }, [
    $props.reverseOperation ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
      createVNode(_component_Button, {
        type: "primary",
        size: "small",
        disabled: !$props.leftActive,
        onClick: $options.moveToRight
      }, {
        default: withCtx(() => [
          $props.operations[1] ? (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString($props.operations[1]), 1)) : createCommentVNode("", true),
          createVNode(_component_Icon, { type: "ios-arrow-forward" })
        ]),
        _: 1
      }, 8, ["disabled", "onClick"]),
      createVNode(_component_Button, {
        type: "primary",
        size: "small",
        disabled: !$props.rightActive,
        onClick: $options.moveToLeft
      }, {
        default: withCtx(() => [
          createVNode(_component_Icon, { type: "ios-arrow-back" }),
          $props.operations[0] ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString($props.operations[0]), 1)) : createCommentVNode("", true)
        ]),
        _: 1
      }, 8, ["disabled", "onClick"])
    ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
      createVNode(_component_Button, {
        type: "primary",
        size: "small",
        disabled: !$props.rightActive,
        onClick: $options.moveToLeft
      }, {
        default: withCtx(() => [
          createVNode(_component_Icon, { type: "ios-arrow-back" }),
          $props.operations[0] ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString($props.operations[0]), 1)) : createCommentVNode("", true)
        ]),
        _: 1
      }, 8, ["disabled", "onClick"]),
      createVNode(_component_Button, {
        type: "primary",
        size: "small",
        disabled: !$props.leftActive,
        onClick: $options.moveToRight
      }, {
        default: withCtx(() => [
          $props.operations[1] ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString($props.operations[1]), 1)) : createCommentVNode("", true),
          createVNode(_component_Icon, { type: "ios-arrow-forward" })
        ]),
        _: 1
      }, 8, ["disabled", "onClick"])
    ], 64))
  ], 2);
}
var Operation = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Operation as default };
