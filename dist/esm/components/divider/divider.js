import { oneOf } from "../../utils/assist.js";
import { openBlock, createElementBlock, normalizeClass, renderSlot, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-divider";
const _sfc_main = {
  name: "Divider",
  props: {
    type: {
      type: String,
      default: "horizontal",
      validator(value) {
        return oneOf(value, ["horizontal", "vertical"]);
      }
    },
    orientation: {
      type: String,
      default: "center",
      validator(value) {
        return oneOf(value, ["left", "right", "center"]);
      }
    },
    dashed: {
      type: Boolean,
      default: false
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "default"]);
      },
      default: "default"
    },
    plain: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasSlot() {
      return !!this.$slots.default;
    },
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.type}`,
        `${prefixCls}-${this.size}`,
        {
          [`${prefixCls}-with-text`]: this.hasSlot && this.orientation === "center",
          [`${prefixCls}-with-text-${this.orientation}`]: this.hasSlot,
          [`${prefixCls}-dashed`]: !!this.dashed,
          [`${prefixCls}-plain`]: this.plain
        }
      ];
    },
    slotClasses() {
      return [
        `${prefixCls}-inner-text`
      ];
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes)
  }, [
    $options.hasSlot ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass($options.slotClasses)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2)) : createCommentVNode("", true)
  ], 2);
}
var Divider = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Divider as default };
