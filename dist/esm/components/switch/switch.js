import { getCurrentInstance, openBlock, createElementBlock, normalizeClass, normalizeStyle, withKeys, createElementVNode, renderSlot, createCommentVNode } from "vue";
import { oneOf } from "../../utils/assist.js";
import mixinsForm from "../../mixins/form.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-switch";
const _sfc_main = {
  name: "iSwitch",
  mixins: [mixinsForm],
  emits: ["update:modelValue", "on-change"],
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: false
    },
    trueValue: {
      type: [String, Number, Boolean],
      default: true
    },
    falseValue: {
      type: [String, Number, Boolean],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      validator(value) {
        return oneOf(value, ["large", "small", "default"]);
      },
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.size === "" ? "default" : global.$VIEWUI.size;
      }
    },
    name: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    },
    trueColor: {
      type: String
    },
    falseColor: {
      type: String
    },
    beforeChange: Function
  },
  data() {
    return {
      currentValue: this.modelValue
    };
  },
  computed: {
    wrapClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-checked`]: this.currentValue === this.trueValue,
          [`${prefixCls}-disabled`]: this.itemDisabled,
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-loading`]: this.loading
        }
      ];
    },
    wrapStyles() {
      let style = {};
      if (this.trueColor && this.currentValue === this.trueValue) {
        style["border-color"] = this.trueColor;
        style["background-color"] = this.trueColor;
      } else if (this.falseColor && this.currentValue === this.falseValue) {
        style["border-color"] = this.falseColor;
        style["background-color"] = this.falseColor;
      }
      return style;
    },
    innerClasses() {
      return `${prefixCls}-inner`;
    }
  },
  methods: {
    handleToggle() {
      const checked = this.currentValue === this.trueValue ? this.falseValue : this.trueValue;
      this.currentValue = checked;
      this.$emit("update:modelValue", checked);
      this.$emit("on-change", checked);
      this.handleFormItemChange("change", checked);
    },
    toggle(event) {
      event.preventDefault();
      if (this.itemDisabled || this.loading) {
        return false;
      }
      if (!this.beforeChange) {
        return this.handleToggle();
      }
      const before = this.beforeChange();
      if (before && before.then) {
        before.then(() => {
          this.handleToggle();
        });
      } else {
        this.handleToggle();
      }
    }
  },
  watch: {
    modelValue(val) {
      if (val !== this.trueValue && val !== this.falseValue && val !== null) {
        throw "Value should be trueValue or falseValue.";
      }
      this.currentValue = val;
    }
  }
};
const _hoisted_1 = ["name", "value"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", {
    tabindex: "0",
    class: normalizeClass($options.wrapClasses),
    style: normalizeStyle($options.wrapStyles),
    onClick: _cache[0] || (_cache[0] = (...args) => $options.toggle && $options.toggle(...args)),
    onKeydown: _cache[1] || (_cache[1] = withKeys((...args) => $options.toggle && $options.toggle(...args), ["space"]))
  }, [
    createElementVNode("input", {
      type: "hidden",
      name: $props.name,
      value: $data.currentValue
    }, null, 8, _hoisted_1),
    createElementVNode("span", {
      class: normalizeClass($options.innerClasses)
    }, [
      $data.currentValue === $props.trueValue ? renderSlot(_ctx.$slots, "open", { key: 0 }) : createCommentVNode("", true),
      $data.currentValue === $props.falseValue ? renderSlot(_ctx.$slots, "close", { key: 1 }) : createCommentVNode("", true)
    ], 2)
  ], 38);
}
var Switch = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Switch as default };
