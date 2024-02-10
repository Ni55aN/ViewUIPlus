import { getCurrentInstance, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createTextVNode, toDisplayString } from "vue";
import { oneOf } from "../../utils/assist.js";
import mixinsForm from "../../mixins/form.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-radio";
const _sfc_main = {
  name: "Radio",
  mixins: [mixinsForm],
  emits: ["update:modelValue", "on-change"],
  inject: {
    RadioGroupInstance: {
      default: null
    }
  },
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
    label: {
      type: [String, Number]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "large", "default"]);
      },
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.size === "" ? "default" : global.$VIEWUI.size;
      }
    },
    name: {
      type: String
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      groupName: this.name,
      parent: this.RadioGroupInstance,
      focusWrapper: false,
      focusInner: false
    };
  },
  computed: {
    wrapClasses() {
      return [
        `${prefixCls}-wrapper`,
        {
          [`${prefixCls}-group-item`]: this.group,
          [`${prefixCls}-wrapper-checked`]: this.currentValue,
          [`${prefixCls}-wrapper-disabled`]: this.itemDisabled,
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-focus`]: this.focusWrapper,
          [`${prefixCls}-border`]: this.border
        }
      ];
    },
    radioClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-checked`]: this.currentValue,
          [`${prefixCls}-disabled`]: this.itemDisabled
        }
      ];
    },
    innerClasses() {
      return [
        `${prefixCls}-inner`,
        {
          [`${prefixCls}-focus`]: this.focusInner
        }
      ];
    },
    inputClasses() {
      return `${prefixCls}-input`;
    },
    currentValue() {
      if (this.RadioGroupInstance) {
        return this.RadioGroupInstance.currentValue === this.label;
      } else {
        return this.modelValue === this.trueValue;
      }
    },
    group() {
      return !!this.RadioGroupInstance;
    }
  },
  mounted() {
    if (this.parent) {
      if (this.name && this.name !== this.parent.name) {
        if (console.warn) {
          console.warn("[View UI] Name does not match Radio Group name.");
        }
      } else {
        this.groupName = this.parent.name;
      }
    }
  },
  methods: {
    change(event) {
      if (this.itemDisabled) {
        return false;
      }
      const checked = event.target.checked;
      const value = checked ? this.trueValue : this.falseValue;
      this.$emit("update:modelValue", value);
      if (this.group) {
        if (this.label !== void 0) {
          this.parent.change({
            value: this.label,
            checked: this.modelValue
          });
        }
      } else {
        this.$emit("on-change", value);
        this.handleFormItemChange("change", value);
      }
    },
    onBlur() {
      this.focusWrapper = false;
      this.focusInner = false;
    },
    onFocus() {
      if (this.group && this.parent.type === "button") {
        this.focusWrapper = true;
      } else {
        this.focusInner = true;
      }
    }
  },
  watch: {
    modelValue(val) {
      if (val === this.trueValue || val === this.falseValue)
        ;
      else {
        throw "Value should be trueValue or falseValue.";
      }
    }
  }
};
const _hoisted_1 = ["disabled", "checked", "name"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("label", {
    class: normalizeClass($options.wrapClasses)
  }, [
    createElementVNode("span", {
      class: normalizeClass($options.radioClasses)
    }, [
      createElementVNode("span", {
        class: normalizeClass($options.innerClasses)
      }, null, 2),
      createElementVNode("input", {
        type: "radio",
        class: normalizeClass($options.inputClasses),
        disabled: _ctx.itemDisabled,
        checked: $options.currentValue,
        name: $data.groupName,
        onChange: _cache[0] || (_cache[0] = (...args) => $options.change && $options.change(...args)),
        onFocus: _cache[1] || (_cache[1] = (...args) => $options.onFocus && $options.onFocus(...args)),
        onBlur: _cache[2] || (_cache[2] = (...args) => $options.onBlur && $options.onBlur(...args))
      }, null, 42, _hoisted_1)
    ], 2),
    renderSlot(_ctx.$slots, "default", {}, () => [
      createTextVNode(toDisplayString($props.label), 1)
    ])
  ], 2);
}
var Radio = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Radio as default };
