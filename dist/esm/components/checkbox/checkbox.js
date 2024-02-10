import { getCurrentInstance, openBlock, createElementBlock, normalizeClass, createElementVNode, withDirectives, vModelCheckbox, renderSlot, createTextVNode, toDisplayString, createCommentVNode } from "vue";
import { oneOf } from "../../utils/assist.js";
import mixinsForm from "../../mixins/form.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-checkbox";
const _sfc_main = {
  name: "Checkbox",
  mixins: [mixinsForm],
  emits: ["update:modelValue", "on-change"],
  inject: {
    CheckboxGroupInstance: {
      default: null
    }
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
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
      type: [String, Number, Boolean]
    },
    indeterminate: {
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
      showSlot: true,
      focusInner: false,
      model: []
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
          [`${prefixCls}-border`]: this.border
        }
      ];
    },
    checkboxClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-checked`]: this.currentValue,
          [`${prefixCls}-disabled`]: this.itemDisabled,
          [`${prefixCls}-indeterminate`]: this.indeterminate
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
      if (this.CheckboxGroupInstance) {
        return this.CheckboxGroupInstance.modelValue.indexOf(this.label) >= 0;
      } else {
        return this.modelValue === this.trueValue;
      }
    },
    group() {
      return !!this.CheckboxGroupInstance;
    }
  },
  mounted() {
    if (!this.CheckboxGroupInstance)
      this.showSlot = this.$slots.default !== void 0;
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
        this.CheckboxGroupInstance.change(this.model);
      } else {
        this.$emit("on-change", value);
        this.handleFormItemChange("change", value);
      }
    },
    onBlur() {
      this.focusInner = false;
    },
    onFocus() {
      this.focusInner = true;
    }
  },
  watch: {
    modelValue(val) {
      if (val === this.trueValue || val === this.falseValue)
        ;
      else {
        throw "Value should be trueValue or falseValue.";
      }
    },
    "CheckboxGroupInstance.modelValue": {
      handler(val) {
        this.model = val || [];
      },
      immediate: true
    }
  }
};
const _hoisted_1 = ["disabled", "value", "name"];
const _hoisted_2 = ["disabled", "checked", "name"];
const _hoisted_3 = {
  key: 0,
  class: "ivu-checkbox-label-text"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("label", {
    class: normalizeClass($options.wrapClasses)
  }, [
    createElementVNode("span", {
      class: normalizeClass($options.checkboxClasses)
    }, [
      createElementVNode("span", {
        class: normalizeClass($options.innerClasses)
      }, null, 2),
      $options.group ? withDirectives((openBlock(), createElementBlock("input", {
        key: 0,
        type: "checkbox",
        class: normalizeClass($options.inputClasses),
        disabled: _ctx.itemDisabled,
        value: $props.label,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.model = $event),
        name: $props.name,
        onChange: _cache[1] || (_cache[1] = (...args) => $options.change && $options.change(...args)),
        onFocus: _cache[2] || (_cache[2] = (...args) => $options.onFocus && $options.onFocus(...args)),
        onBlur: _cache[3] || (_cache[3] = (...args) => $options.onBlur && $options.onBlur(...args))
      }, null, 42, _hoisted_1)), [
        [vModelCheckbox, $data.model]
      ]) : (openBlock(), createElementBlock("input", {
        key: 1,
        type: "checkbox",
        class: normalizeClass($options.inputClasses),
        disabled: _ctx.itemDisabled,
        checked: $options.currentValue,
        name: $props.name,
        onChange: _cache[4] || (_cache[4] = (...args) => $options.change && $options.change(...args)),
        onFocus: _cache[5] || (_cache[5] = (...args) => $options.onFocus && $options.onFocus(...args)),
        onBlur: _cache[6] || (_cache[6] = (...args) => $options.onBlur && $options.onBlur(...args))
      }, null, 42, _hoisted_2))
    ], 2),
    $data.showSlot ? (openBlock(), createElementBlock("span", _hoisted_3, [
      renderSlot(_ctx.$slots, "default", {}, () => [
        createTextVNode(toDisplayString($props.label), 1)
      ])
    ])) : createCommentVNode("", true)
  ], 2);
}
var Checkbox = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Checkbox as default };
