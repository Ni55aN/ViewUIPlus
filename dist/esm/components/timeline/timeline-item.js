import { openBlock, createElementBlock, normalizeClass, createElementVNode, normalizeStyle, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-timeline";
const _sfc_main = {
  name: "TimelineItem",
  props: {
    color: {
      type: String,
      default: "blue"
    }
  },
  data() {
    return {
      dot: false
    };
  },
  mounted() {
    this.dot = !!this.$refs.dot.innerHTML.length;
  },
  computed: {
    itemClasses() {
      return `${prefixCls}-item`;
    },
    tailClasses() {
      return `${prefixCls}-item-tail`;
    },
    headClasses() {
      return [
        `${prefixCls}-item-head`,
        {
          [`${prefixCls}-item-head-custom`]: this.dot,
          [`${prefixCls}-item-head-${this.color}`]: this.headColorShow
        }
      ];
    },
    headColorShow() {
      return this.color === "blue" || this.color === "red" || this.color === "green";
    },
    customColor() {
      let style = {};
      if (this.color) {
        if (!this.headColorShow) {
          style = {
            "color": this.color,
            "border-color": this.color
          };
        }
      }
      return style;
    },
    contentClasses() {
      return `${prefixCls}-item-content`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("li", {
    class: normalizeClass($options.itemClasses)
  }, [
    createElementVNode("div", {
      class: normalizeClass($options.tailClasses)
    }, null, 2),
    createElementVNode("div", {
      class: normalizeClass($options.headClasses),
      style: normalizeStyle($options.customColor),
      ref: "dot"
    }, [
      renderSlot(_ctx.$slots, "dot")
    ], 6),
    createElementVNode("div", {
      class: normalizeClass($options.contentClasses)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2)
  ], 2);
}
var TimelineItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TimelineItem as default };
