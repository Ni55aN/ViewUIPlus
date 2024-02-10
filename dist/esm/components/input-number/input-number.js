import { getCurrentInstance, nextTick, openBlock, createElementBlock, normalizeClass, createElementVNode, createCommentVNode, withModifiers } from "vue";
import { oneOf, findComponentUpward } from "../../utils/assist.js";
import mixinsForm from "../../mixins/form.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-input-number";
const iconPrefixCls = "ivu-icon";
function addNum(num1, num2) {
  let sq1, sq2, m;
  try {
    sq1 = num1.toString().split(".")[1].length;
  } catch (e) {
    sq1 = 0;
  }
  try {
    sq2 = num2.toString().split(".")[1].length;
  } catch (e) {
    sq2 = 0;
  }
  m = Math.pow(10, Math.max(sq1, sq2));
  return (Math.round(num1 * m) + Math.round(num2 * m)) / m;
}
const _sfc_main = {
  name: "InputNumber",
  mixins: [mixinsForm],
  emits: ["on-change", "on-focus", "on-blur", "update:modelValue"],
  props: {
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    step: {
      type: Number,
      default: 1
    },
    activeChange: {
      type: Boolean,
      default: true
    },
    modelValue: {
      type: Number,
      default: 1
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
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    name: {
      type: String
    },
    precision: {
      type: Number
    },
    elementId: {
      type: String
    },
    formatter: {
      type: Function
    },
    parser: {
      type: Function
    },
    placeholder: {
      type: String,
      default: ""
    },
    controlsOutside: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      focused: false,
      upDisabled: false,
      downDisabled: false,
      currentValue: this.modelValue
    };
  },
  computed: {
    wrapClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-disabled`]: this.itemDisabled,
          [`${prefixCls}-focused`]: this.focused,
          [`${prefixCls}-controls-outside`]: this.controlsOutside
        }
      ];
    },
    handlerClasses() {
      return `${prefixCls}-handler-wrap`;
    },
    upClasses() {
      return [
        `${prefixCls}-handler`,
        `${prefixCls}-handler-up`,
        {
          [`${prefixCls}-handler-up-disabled`]: this.upDisabled
        }
      ];
    },
    innerUpClasses() {
      return `${prefixCls}-handler-up-inner ${iconPrefixCls} ${iconPrefixCls}-ios-arrow-up`;
    },
    downClasses() {
      return [
        `${prefixCls}-handler`,
        `${prefixCls}-handler-down`,
        {
          [`${prefixCls}-handler-down-disabled`]: this.downDisabled
        }
      ];
    },
    innerDownClasses() {
      return `${prefixCls}-handler-down-inner ${iconPrefixCls} ${iconPrefixCls}-ios-arrow-down`;
    },
    inputWrapClasses() {
      return `${prefixCls}-input-wrap`;
    },
    inputClasses() {
      return `${prefixCls}-input`;
    },
    precisionValue() {
      if (!this.currentValue)
        return this.currentValue;
      return this.precision ? this.currentValue.toFixed(this.precision) : this.currentValue;
    },
    formatterValue() {
      if (this.formatter && this.precisionValue !== null) {
        return this.formatter(this.precisionValue);
      } else {
        return this.precisionValue;
      }
    }
  },
  methods: {
    preventDefault(e) {
      e.preventDefault();
    },
    up(e) {
      const targetVal = Number(e.target.value);
      if (this.upDisabled && isNaN(targetVal)) {
        return false;
      }
      this.changeStep("up", e);
    },
    down(e) {
      const targetVal = Number(e.target.value);
      if (this.downDisabled && isNaN(targetVal)) {
        return false;
      }
      this.changeStep("down", e);
    },
    changeStep(type, e) {
      if (this.itemDisabled || this.readonly) {
        return false;
      }
      const targetVal = Number(e.target.value);
      let val = Number(this.currentValue);
      const step = Number(this.step);
      if (isNaN(val)) {
        return false;
      }
      if (!isNaN(targetVal)) {
        if (type === "up") {
          if (addNum(targetVal, step) <= this.max) {
            val = targetVal;
          } else {
            return false;
          }
        } else if (type === "down") {
          if (addNum(targetVal, -step) >= this.min) {
            val = targetVal;
          } else {
            return false;
          }
        }
      }
      if (type === "up") {
        val = addNum(val, step);
      } else if (type === "down") {
        val = addNum(val, -step);
      }
      this.setValue(val);
    },
    setValue(val) {
      if (val && !isNaN(this.precision))
        val = Number(Number(val).toFixed(this.precision));
      const { min, max } = this;
      if (val !== null) {
        if (val > max) {
          val = max;
        } else if (val < min) {
          val = min;
        }
      }
      nextTick(() => {
        this.currentValue = val;
        this.$emit("update:modelValue", val);
        this.$emit("on-change", val);
        this.handleFormItemChange("change", val);
      });
    },
    focus(event) {
      this.focused = true;
      this.$emit("on-focus", event);
    },
    blur() {
      this.focused = false;
      this.$emit("on-blur");
      if (!findComponentUpward(this, ["DatePicker", "TimePicker", "Cascader", "Search"])) {
        this.handleFormItemChange("blur", this.currentValue);
      }
    },
    keyDown(e) {
      if (e.keyCode === 38) {
        e.preventDefault();
        this.up(e);
      } else if (e.keyCode === 40) {
        e.preventDefault();
        this.down(e);
      }
    },
    change(event) {
      if (event.type === "change" && this.activeChange)
        return;
      if (event.type === "input" && !this.activeChange)
        return;
      let val = event.target.value.trim();
      if (this.parser) {
        val = this.parser(val);
      }
      const isEmptyString = val.length === 0;
      if (isEmptyString) {
        this.setValue(null);
        return;
      }
      if (event.type === "input" && val.match(/^\-?\.?$|\.$/))
        return;
      val = Number(val);
      if (!isNaN(val)) {
        this.currentValue = val;
        this.setValue(val);
      } else {
        event.target.value = this.currentValue;
      }
    },
    changeVal(val) {
      val = Number(val);
      if (!isNaN(val)) {
        const step = this.step;
        this.upDisabled = val + step > this.max;
        this.downDisabled = val - step < this.min;
      } else {
        this.upDisabled = true;
        this.downDisabled = true;
      }
    }
  },
  mounted() {
    this.changeVal(this.currentValue);
  },
  watch: {
    modelValue(val) {
      this.currentValue = val;
    },
    currentValue(val) {
      this.changeVal(val);
    },
    min() {
      this.changeVal(this.currentValue);
    },
    max() {
      this.changeVal(this.currentValue);
    }
  }
};
const _hoisted_1 = /* @__PURE__ */ createElementVNode("i", { class: "ivu-icon ivu-icon-ios-remove" }, null, -1);
const _hoisted_2 = [
  _hoisted_1
];
const _hoisted_3 = /* @__PURE__ */ createElementVNode("i", { class: "ivu-icon ivu-icon-ios-add" }, null, -1);
const _hoisted_4 = [
  _hoisted_3
];
const _hoisted_5 = ["id", "disabled", "autofocus", "readonly", "name", "value", "placeholder"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.wrapClasses)
  }, [
    !$props.controlsOutside ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass($options.handlerClasses)
    }, [
      createElementVNode("a", {
        onClick: _cache[1] || (_cache[1] = (...args) => $options.up && $options.up(...args)),
        class: normalizeClass($options.upClasses)
      }, [
        createElementVNode("span", {
          class: normalizeClass($options.innerUpClasses),
          onClick: _cache[0] || (_cache[0] = (...args) => $options.preventDefault && $options.preventDefault(...args))
        }, null, 2)
      ], 2),
      createElementVNode("a", {
        onClick: _cache[3] || (_cache[3] = (...args) => $options.down && $options.down(...args)),
        class: normalizeClass($options.downClasses)
      }, [
        createElementVNode("span", {
          class: normalizeClass($options.innerDownClasses),
          onClick: _cache[2] || (_cache[2] = (...args) => $options.preventDefault && $options.preventDefault(...args))
        }, null, 2)
      ], 2)
    ], 2)) : createCommentVNode("", true),
    $props.controlsOutside ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(["ivu-input-number-controls-outside-btn ivu-input-number-controls-outside-down", { "ivu-input-number-controls-outside-btn-disabled": $data.downDisabled }]),
      onClick: _cache[4] || (_cache[4] = (...args) => $options.down && $options.down(...args))
    }, _hoisted_2, 2)) : createCommentVNode("", true),
    $props.controlsOutside ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass(["ivu-input-number-controls-outside-btn ivu-input-number-controls-outside-up", { "ivu-input-number-controls-outside-btn-disabled": $data.upDisabled }]),
      onClick: _cache[5] || (_cache[5] = (...args) => $options.up && $options.up(...args))
    }, _hoisted_4, 2)) : createCommentVNode("", true),
    createElementVNode("div", {
      class: normalizeClass($options.inputWrapClasses)
    }, [
      createElementVNode("input", {
        id: $props.elementId,
        class: normalizeClass($options.inputClasses),
        disabled: _ctx.itemDisabled,
        autocomplete: "off",
        spellcheck: "false",
        autofocus: $props.autofocus,
        onFocus: _cache[6] || (_cache[6] = (...args) => $options.focus && $options.focus(...args)),
        onBlur: _cache[7] || (_cache[7] = (...args) => $options.blur && $options.blur(...args)),
        onKeydown: _cache[8] || (_cache[8] = withModifiers((...args) => $options.keyDown && $options.keyDown(...args), ["stop"])),
        onInput: _cache[9] || (_cache[9] = (...args) => $options.change && $options.change(...args)),
        onMouseup: _cache[10] || (_cache[10] = (...args) => $options.preventDefault && $options.preventDefault(...args)),
        onChange: _cache[11] || (_cache[11] = (...args) => $options.change && $options.change(...args)),
        readonly: $props.readonly || !$props.editable,
        name: $props.name,
        value: $options.formatterValue,
        placeholder: $props.placeholder
      }, null, 42, _hoisted_5)
    ], 2)
  ], 2);
}
var InputNumber = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { InputNumber as default };
