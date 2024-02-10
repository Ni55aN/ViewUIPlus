import Icon from "../icon/icon.js";
import { oneOf } from "../../utils/assist.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, withModifiers, normalizeStyle, createCommentVNode, createElementVNode, renderSlot, createBlock } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-tag";
const initColorList = ["default", "primary", "success", "warning", "error", "blue", "green", "red", "yellow", "pink", "magenta", "volcano", "orange", "gold", "lime", "cyan", "geekblue", "purple"];
const colorList = ["pink", "magenta", "volcano", "orange", "gold", "lime", "cyan", "geekblue", "purple"];
const _sfc_main = {
  name: "Tag",
  components: { Icon },
  emits: ["on-change", "on-close"],
  props: {
    closable: {
      type: Boolean,
      default: false
    },
    checkable: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: "default"
    },
    type: {
      validator(value) {
        return oneOf(value, ["border", "dot"]);
      }
    },
    name: {
      type: [String, Number]
    },
    size: {
      validator(value) {
        return oneOf(value, ["default", "medium", "large"]);
      },
      default: "default"
    }
  },
  data() {
    return {
      isChecked: this.checked
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-size-${this.size}`,
        {
          [`${prefixCls}-${this.color}`]: !!this.color && oneOf(this.color, initColorList),
          [`${prefixCls}-${this.type}`]: !!this.type,
          [`${prefixCls}-closable`]: this.closable,
          [`${prefixCls}-checked`]: this.isChecked,
          [`${prefixCls}-checkable`]: this.checkable
        }
      ];
    },
    wraperStyles() {
      return oneOf(this.color, initColorList) ? {} : { background: this.isChecked ? this.defaultTypeColor : "transparent", borderWidth: "1px", borderStyle: "solid", borderColor: this.type !== "dot" && this.type !== "border" && this.isChecked ? this.borderColor : this.lineColor, color: this.lineColor };
    },
    textClasses() {
      return [
        `${prefixCls}-text`,
        this.type === "border" ? oneOf(this.color, initColorList) ? `${prefixCls}-color-${this.color}` : "" : "",
        this.type !== "dot" && this.type !== "border" && this.color !== "default" ? this.isChecked && colorList.indexOf(this.color) < 0 ? `${prefixCls}-color-white` : "" : ""
      ];
    },
    dotClasses() {
      return `${prefixCls}-dot-inner`;
    },
    iconClass() {
      if (this.type === "dot") {
        return "";
      } else if (this.type === "border") {
        return oneOf(this.color, initColorList) ? `${prefixCls}-color-${this.color}` : "";
      } else {
        return this.color !== void 0 ? this.color === "default" ? "" : "rgb(255, 255, 255)" : "";
      }
    },
    showDot() {
      return !!this.type && this.type === "dot";
    },
    lineColor() {
      if (this.type === "dot") {
        return "";
      } else if (this.type === "border") {
        return this.color !== void 0 ? oneOf(this.color, initColorList) ? "" : this.color : "";
      } else {
        return this.color !== void 0 ? this.color === "default" ? "" : "rgb(255, 255, 255)" : "";
      }
    },
    borderColor() {
      return this.color !== void 0 ? this.color === "default" ? "" : this.color : "";
    },
    dotColor() {
      return this.color !== void 0 ? oneOf(this.color, initColorList) ? "" : this.color : "";
    },
    textColorStyle() {
      return oneOf(this.color, initColorList) ? {} : this.type !== "dot" && this.type !== "border" ? this.isChecked ? { color: this.lineColor } : {} : { color: this.lineColor };
    },
    bgColorStyle() {
      return oneOf(this.color, initColorList) ? {} : { background: this.dotColor };
    },
    defaultTypeColor() {
      return this.type !== "dot" && this.type !== "border" ? this.color !== void 0 ? oneOf(this.color, initColorList) ? "" : this.color : "" : "";
    }
  },
  methods: {
    close(event) {
      if (this.name === void 0) {
        this.$emit("on-close", event);
      } else {
        this.$emit("on-close", event, this.name);
      }
    },
    check() {
      if (!this.checkable)
        return;
      const checked = !this.isChecked;
      this.isChecked = checked;
      if (this.name === void 0) {
        this.$emit("on-change", checked);
      } else {
        this.$emit("on-change", checked, this.name);
      }
    }
  },
  watch: {
    checked(val) {
      this.isChecked = val;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes),
    onClick: _cache[0] || (_cache[0] = withModifiers((...args) => $options.check && $options.check(...args), ["stop"])),
    style: normalizeStyle($options.wraperStyles)
  }, [
    $options.showDot ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass($options.dotClasses),
      style: normalizeStyle($options.bgColorStyle)
    }, null, 6)) : createCommentVNode("", true),
    createElementVNode("span", {
      class: normalizeClass($options.textClasses),
      style: normalizeStyle($options.textColorStyle)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 6),
    $props.closable ? (openBlock(), createBlock(_component_Icon, {
      key: 1,
      class: normalizeClass($options.iconClass),
      color: $options.lineColor,
      type: "ios-close",
      onClick: withModifiers($options.close, ["stop"])
    }, null, 8, ["class", "color", "onClick"])) : createCommentVNode("", true)
  ], 6);
}
var Tag = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Tag as default };
