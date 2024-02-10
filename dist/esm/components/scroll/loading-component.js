import Spin from "../spin/spin2.js";
import Icon from "../icon/icon.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, createVNode, withCtx, toDisplayString, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-scroll";
const _sfc_main = {
  props: ["text", "active", "spinnerHeight"],
  components: { Spin, Icon },
  computed: {
    wrapperClasses() {
      return [
        `${prefixCls}-loader-wrapper`,
        {
          [`${prefixCls}-loader-wrapper-active`]: this.active
        }
      ];
    },
    spinnerClasses() {
      return `${prefixCls}-spinner`;
    },
    iconClasses() {
      return `${prefixCls}-spinner-icon`;
    },
    textClasses() {
      return `${prefixCls}-loader-text`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_Spin = resolveComponent("Spin");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.wrapperClasses)
  }, [
    createElementVNode("div", {
      class: normalizeClass($options.spinnerClasses)
    }, [
      createVNode(_component_Spin, { fix: "" }, {
        default: withCtx(() => [
          createVNode(_component_Icon, {
            type: "ios-loading",
            size: "18",
            class: normalizeClass($options.iconClasses)
          }, null, 8, ["class"]),
          $props.text ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass($options.textClasses)
          }, toDisplayString($props.text), 3)) : createCommentVNode("", true)
        ]),
        _: 1
      })
    ], 2)
  ], 2);
}
var loader = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { loader as default };
