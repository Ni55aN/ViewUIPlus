import { oneOf } from "../../utils/assist.js";
import { openBlock, createElementBlock, normalizeClass, renderSlot, withDirectives, createElementVNode, normalizeStyle, vShow, createTextVNode, toDisplayString, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const initColorList = ["blue", "green", "red", "yellow", "pink", "magenta", "volcano", "orange", "gold", "lime", "cyan", "geekblue", "purple"];
const prefixCls = "ivu-badge";
const _sfc_main = {
  name: "Badge",
  props: {
    count: Number,
    dot: {
      type: Boolean,
      default: false
    },
    overflowCount: {
      type: [Number, String],
      default: 99
    },
    className: String,
    showZero: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ""
    },
    status: {
      validator(value) {
        return oneOf(value, ["success", "processing", "default", "error", "warning"]);
      }
    },
    type: {
      validator(value) {
        return oneOf(value, ["success", "primary", "normal", "error", "warning", "info"]);
      }
    },
    offset: {
      type: Array
    },
    color: {
      type: String
    }
  },
  computed: {
    classes() {
      return `${prefixCls}`;
    },
    dotClasses() {
      return `${prefixCls}-dot`;
    },
    countClasses() {
      return [
        `${prefixCls}-count`,
        {
          [`${this.className}`]: !!this.className,
          [`${prefixCls}-count-alone`]: this.alone,
          [`${prefixCls}-count-${this.type}`]: !!this.type
        }
      ];
    },
    customCountClasses() {
      return [
        `${prefixCls}-count`,
        `${prefixCls}-count-custom`,
        {
          [`${this.className}`]: !!this.className
        }
      ];
    },
    statusClasses() {
      return [
        `${prefixCls}-status-dot`,
        {
          [`${prefixCls}-status-${this.status}`]: !!this.status,
          [`${prefixCls}-status-${this.color}`]: !!this.color && oneOf(this.color, initColorList)
        }
      ];
    },
    statusStyles() {
      return oneOf(this.color, initColorList) ? {} : { backgroundColor: this.color };
    },
    styles() {
      const style = {};
      if (this.offset && this.offset.length === 2) {
        style["margin-top"] = `${this.offset[0]}px`;
        style["margin-right"] = `${this.offset[1]}px`;
      }
      return style;
    },
    finalCount() {
      if (this.text !== "")
        return this.text;
      return parseInt(this.count) >= parseInt(this.overflowCount) ? `${this.overflowCount}+` : this.count;
    },
    badge() {
      let status = false;
      if (this.count) {
        status = !(parseInt(this.count) === 0);
      }
      if (this.dot) {
        status = true;
        if (this.count !== null) {
          if (parseInt(this.count) === 0) {
            status = false;
          }
        }
      }
      if (this.text !== "")
        status = true;
      return status || this.showZero;
    },
    hasCount() {
      if (this.count || this.text !== "")
        return true;
      if (this.showZero && parseInt(this.count) === 0)
        return true;
      else
        return false;
    },
    alone() {
      return this.$slots.default === void 0;
    }
  }
};
const _hoisted_1 = { class: "ivu-badge-status-text" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return $props.dot ? (openBlock(), createElementBlock("span", {
    key: 0,
    class: normalizeClass($options.classes),
    ref: "badge"
  }, [
    renderSlot(_ctx.$slots, "default"),
    withDirectives(createElementVNode("sup", {
      class: normalizeClass($options.dotClasses),
      style: normalizeStyle($options.styles)
    }, null, 6), [
      [vShow, $options.badge]
    ])
  ], 2)) : $props.status || $props.color ? (openBlock(), createElementBlock("span", {
    key: 1,
    class: normalizeClass([$options.classes, "ivu-badge-status"]),
    ref: "badge"
  }, [
    createElementVNode("span", {
      class: normalizeClass($options.statusClasses),
      style: normalizeStyle($options.statusStyles)
    }, null, 6),
    createElementVNode("span", _hoisted_1, [
      renderSlot(_ctx.$slots, "text", {}, () => [
        createTextVNode(toDisplayString($props.text), 1)
      ])
    ])
  ], 2)) : (openBlock(), createElementBlock("span", {
    key: 2,
    class: normalizeClass($options.classes),
    ref: "badge"
  }, [
    renderSlot(_ctx.$slots, "default"),
    _ctx.$slots.count ? (openBlock(), createElementBlock("sup", {
      key: 0,
      style: normalizeStyle($options.styles),
      class: normalizeClass($options.customCountClasses)
    }, [
      renderSlot(_ctx.$slots, "count")
    ], 6)) : $options.hasCount ? withDirectives((openBlock(), createElementBlock("sup", {
      key: 1,
      style: normalizeStyle($options.styles),
      class: normalizeClass($options.countClasses)
    }, [
      renderSlot(_ctx.$slots, "text", {}, () => [
        createTextVNode(toDisplayString($options.finalCount), 1)
      ])
    ], 6)), [
      [vShow, $options.badge]
    ]) : createCommentVNode("", true)
  ], 2));
}
var Badge = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Badge as default };
