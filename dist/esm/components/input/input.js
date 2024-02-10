import { getCurrentInstance, nextTick, openBlock, createElementBlock, normalizeClass, Fragment, withDirectives, renderSlot, vShow, createCommentVNode, normalizeStyle, toDisplayString, createVNode, Transition, withCtx, createElementVNode, withKeys, createTextVNode } from "vue";
import { oneOf, findComponentUpward } from "../../utils/assist.js";
import calcTextareaHeight from "../../utils/calcTextareaHeight.js";
import mixinsForm from "../../mixins/form.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-input";
const _sfc_main = {
  name: "Input",
  mixins: [mixinsForm],
  emits: ["on-enter", "on-search", "on-keydown", "on-keypress", "on-keyup", "on-click", "on-focus", "on-blur", "on-change", "on-input-change", "on-clear", "update:modelValue"],
  props: {
    type: {
      validator(value) {
        return oneOf(value, ["text", "textarea", "password", "url", "email", "date", "number", "tel"]);
      },
      default: "text"
    },
    modelValue: {
      type: [String, Number],
      default: ""
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
    placeholder: {
      type: String,
      default: ""
    },
    maxlength: {
      type: [String, Number]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: String,
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    rows: {
      type: Number,
      default: 2
    },
    readonly: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    number: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    spellcheck: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: "off"
    },
    clearable: {
      type: Boolean,
      default: false
    },
    elementId: {
      type: String
    },
    wrap: {
      validator(value) {
        return oneOf(value, ["hard", "soft"]);
      },
      default: "soft"
    },
    prefix: {
      type: String,
      default: ""
    },
    suffix: {
      type: String,
      default: ""
    },
    search: {
      type: Boolean,
      default: false
    },
    enterButton: {
      type: [Boolean, String],
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    password: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentValue: this.modelValue,
      prefixCls,
      slotReady: false,
      textareaStyles: {},
      isOnComposition: false,
      showPassword: false,
      clearableIconOffset: 0
    };
  },
  computed: {
    currentType() {
      let type = this.type;
      if (type === "password" && this.password && this.showPassword)
        type = "text";
      return type;
    },
    prepend() {
      let state = false;
      if (this.type !== "textarea")
        state = this.$slots.prepend !== void 0;
      return state;
    },
    append() {
      let state = false;
      if (this.type !== "textarea")
        state = this.$slots.append !== void 0;
      return state;
    },
    showPrefix() {
      let state = false;
      if (this.type !== "textarea")
        state = this.prefix !== "" || this.$slots.prefix !== void 0;
      return state;
    },
    showSuffix() {
      let state = false;
      if (this.type !== "textarea")
        state = this.suffix !== "" || this.$slots.suffix !== void 0;
      return state;
    },
    wrapClasses() {
      return [
        `${prefixCls}-wrapper`,
        {
          [`${prefixCls}-wrapper-${this.size}`]: !!this.size,
          [`${prefixCls}-type-${this.type}`]: this.type,
          [`${prefixCls}-group`]: this.prepend || this.append || this.search && this.enterButton,
          [`${prefixCls}-group-${this.size}`]: (this.prepend || this.append || this.search && this.enterButton) && !!this.size,
          [`${prefixCls}-group-with-prepend`]: this.prepend,
          [`${prefixCls}-group-with-append`]: this.append || this.search && this.enterButton,
          [`${prefixCls}-hide-icon`]: this.append,
          [`${prefixCls}-with-search`]: this.search && this.enterButton,
          [`${prefixCls}-wrapper-disabled`]: this.itemDisabled
        }
      ];
    },
    inputClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-disabled`]: this.itemDisabled,
          [`${prefixCls}-no-border`]: !this.border,
          [`${prefixCls}-with-prefix`]: this.showPrefix,
          [`${prefixCls}-with-suffix`]: this.showSuffix || this.search && this.enterButton === false
        }
      ];
    },
    textareaClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-disabled`]: this.itemDisabled,
          [`${prefixCls}-no-border`]: !this.border
        }
      ];
    },
    upperLimit() {
      return this.maxlength;
    },
    textLength() {
      if (typeof this.modelValue === "number") {
        return String(this.modelValue).length;
      }
      return (this.modelValue || "").length;
    },
    clearableStyles() {
      const style = {};
      let offset = this.clearableIconOffset;
      if (offset)
        style.transform = `translateX(-${offset}px)`;
      return style;
    }
  },
  methods: {
    handleEnter(event) {
      this.$emit("on-enter", event);
      if (this.search)
        this.$emit("on-search", this.currentValue);
    },
    handleKeydown(event) {
      this.$emit("on-keydown", event);
    },
    handleKeypress(event) {
      this.$emit("on-keypress", event);
    },
    handleKeyup(event) {
      this.$emit("on-keyup", event);
    },
    handleIconClick(event) {
      this.$emit("on-click", event);
    },
    handleFocus(event) {
      this.$emit("on-focus", event);
    },
    handleBlur(event) {
      this.$emit("on-blur", event);
      if (!findComponentUpward(this, ["DatePicker", "TimePicker", "Cascader", "Search"])) {
        this.handleFormItemChange("blur", this.currentValue);
      }
    },
    handleComposition(event) {
      if (event.type === "compositionstart") {
        this.isOnComposition = true;
      }
      if (event.type === "compositionend") {
        this.isOnComposition = false;
        this.handleInput(event);
      }
    },
    handleInput(event) {
      if (this.isOnComposition)
        return;
      let value = event.target.value;
      if (this.number && value !== "")
        value = Number.isNaN(Number(value)) ? value : Number(value);
      this.$emit("update:modelValue", value);
      this.setCurrentValue(value);
      this.$emit("on-change", event);
    },
    handleChange(event) {
      this.$emit("on-input-change", event);
    },
    setCurrentValue(value) {
      if (value === this.currentValue)
        return;
      nextTick(() => {
        this.resizeTextarea();
      });
      this.currentValue = value;
      if (!findComponentUpward(this, ["DatePicker", "TimePicker", "Cascader", "Search"])) {
        this.handleFormItemChange("change", value);
      }
    },
    resizeTextarea() {
      const autosize = this.autosize;
      if (!autosize || this.type !== "textarea") {
        return false;
      }
      const minRows = autosize.minRows;
      const maxRows = autosize.maxRows;
      this.textareaStyles = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
    },
    focus(option) {
      const $el = this.type === "textarea" ? this.$refs.textarea : this.$refs.input;
      $el.focus(option);
      const { cursor } = option || {};
      if (cursor) {
        const len = $el.value.length;
        switch (cursor) {
          case "start":
            $el.setSelectionRange(0, 0);
            break;
          case "end":
            $el.setSelectionRange(len, len);
            break;
          default:
            $el.setSelectionRange(0, len);
        }
      }
    },
    blur() {
      if (this.type === "textarea") {
        this.$refs.textarea.blur();
      } else {
        this.$refs.input.blur();
      }
    },
    handleClear() {
      const e = { target: { value: "" } };
      this.$emit("update:modelValue", "");
      this.setCurrentValue("");
      this.$emit("on-change", e);
      this.$emit("on-clear");
    },
    handleSearch() {
      if (this.itemDisabled)
        return false;
      this.$refs.input.focus();
      this.$emit("on-search", this.currentValue);
    },
    handleToggleShowPassword() {
      if (this.itemDisabled)
        return false;
      this.showPassword = !this.showPassword;
      this.focus();
      const len = this.currentValue.length;
      setTimeout(() => {
        this.$refs.input.setSelectionRange(len, len);
      }, 0);
    },
    handleCalcIconOffset() {
      const $el = this.$el.querySelectorAll(".ivu-input-group-append")[0];
      if ($el) {
        this.clearableIconOffset = $el.offsetWidth;
      } else {
        this.clearableIconOffset = 0;
      }
    }
  },
  watch: {
    modelValue(val) {
      this.setCurrentValue(val);
    },
    type() {
      nextTick(this.handleCalcIconOffset);
    }
  },
  mounted() {
    this.slotReady = true;
    this.resizeTextarea();
    this.handleCalcIconOffset();
  },
  updated() {
    nextTick(this.handleCalcIconOffset);
  }
};
const _hoisted_1 = {
  key: 4,
  class: "ivu-input-suffix"
};
const _hoisted_2 = {
  key: 5,
  class: "ivu-input-word-count"
};
const _hoisted_3 = {
  key: 0,
  class: "ivu-icon ivu-icon-ios-eye-outline"
};
const _hoisted_4 = {
  key: 1,
  class: "ivu-icon ivu-icon-ios-eye-off-outline"
};
const _hoisted_5 = ["id", "autocomplete", "spellcheck", "type", "placeholder", "disabled", "maxlength", "readonly", "name", "value", "number", "autofocus"];
const _hoisted_6 = {
  key: 0,
  class: "ivu-icon ivu-icon-ios-search"
};
const _hoisted_7 = {
  key: 9,
  class: "ivu-input-prefix"
};
const _hoisted_8 = ["id", "wrap", "autocomplete", "spellcheck", "placeholder", "disabled", "rows", "maxlength", "readonly", "name", "value", "autofocus"];
const _hoisted_9 = {
  key: 0,
  class: "ivu-input-word-count"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.wrapClasses)
  }, [
    $props.type !== "textarea" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
      $options.prepend ? withDirectives((openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass([$data.prefixCls + "-group-prepend"])
      }, [
        renderSlot(_ctx.$slots, "prepend")
      ], 2)), [
        [vShow, $data.slotReady]
      ]) : createCommentVNode("", true),
      $props.clearable && $data.currentValue && !_ctx.itemDisabled ? (openBlock(), createElementBlock("i", {
        key: 1,
        class: normalizeClass(["ivu-icon", ["ivu-icon-ios-close-circle", $data.prefixCls + "-icon", $data.prefixCls + "-icon-clear", $data.prefixCls + "-icon-normal"]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClear && $options.handleClear(...args)),
        style: normalizeStyle($options.clearableStyles)
      }, null, 6)) : $props.icon ? (openBlock(), createElementBlock("i", {
        key: 2,
        class: normalizeClass(["ivu-icon", ["ivu-icon-" + $props.icon, $data.prefixCls + "-icon", $data.prefixCls + "-icon-normal"]]),
        onClick: _cache[1] || (_cache[1] = (...args) => $options.handleIconClick && $options.handleIconClick(...args))
      }, null, 2)) : $props.search && $props.enterButton === false ? (openBlock(), createElementBlock("i", {
        key: 3,
        class: normalizeClass(["ivu-icon ivu-icon-ios-search", [$data.prefixCls + "-icon", $data.prefixCls + "-icon-normal", $data.prefixCls + "-search-icon"]]),
        onClick: _cache[2] || (_cache[2] = (...args) => $options.handleSearch && $options.handleSearch(...args))
      }, null, 2)) : $options.showSuffix ? (openBlock(), createElementBlock("span", _hoisted_1, [
        renderSlot(_ctx.$slots, "suffix", {}, () => [
          $props.suffix ? (openBlock(), createElementBlock("i", {
            key: 0,
            class: normalizeClass(["ivu-icon", ["ivu-icon-" + $props.suffix]])
          }, null, 2)) : createCommentVNode("", true)
        ])
      ])) : $props.showWordLimit ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString($options.textLength) + "/" + toDisplayString($options.upperLimit), 1)) : $props.password ? (openBlock(), createElementBlock("span", {
        key: 6,
        class: "ivu-input-suffix",
        onClick: _cache[3] || (_cache[3] = (...args) => $options.handleToggleShowPassword && $options.handleToggleShowPassword(...args))
      }, [
        $data.showPassword ? (openBlock(), createElementBlock("i", _hoisted_3)) : (openBlock(), createElementBlock("i", _hoisted_4))
      ])) : createCommentVNode("", true),
      createVNode(Transition, { name: "fade" }, {
        default: withCtx(() => [
          !$props.icon ? (openBlock(), createElementBlock("i", {
            key: 0,
            class: normalizeClass(["ivu-icon ivu-icon-ios-loading ivu-load-loop", [$data.prefixCls + "-icon", $data.prefixCls + "-icon-validate"]])
          }, null, 2)) : createCommentVNode("", true)
        ]),
        _: 1
      }),
      createElementVNode("input", {
        id: $props.elementId,
        autocomplete: $props.autocomplete,
        spellcheck: $props.spellcheck,
        ref: "input",
        type: $options.currentType,
        class: normalizeClass($options.inputClasses),
        placeholder: $props.placeholder,
        disabled: _ctx.itemDisabled,
        maxlength: $props.maxlength,
        readonly: $props.readonly,
        name: $props.name,
        value: $data.currentValue,
        number: $props.number,
        autofocus: $props.autofocus,
        onKeyup: [
          _cache[4] || (_cache[4] = withKeys((...args) => $options.handleEnter && $options.handleEnter(...args), ["enter"])),
          _cache[5] || (_cache[5] = (...args) => $options.handleKeyup && $options.handleKeyup(...args))
        ],
        onKeypress: _cache[6] || (_cache[6] = (...args) => $options.handleKeypress && $options.handleKeypress(...args)),
        onKeydown: _cache[7] || (_cache[7] = (...args) => $options.handleKeydown && $options.handleKeydown(...args)),
        onFocus: _cache[8] || (_cache[8] = (...args) => $options.handleFocus && $options.handleFocus(...args)),
        onBlur: _cache[9] || (_cache[9] = (...args) => $options.handleBlur && $options.handleBlur(...args)),
        onCompositionstart: _cache[10] || (_cache[10] = (...args) => $options.handleComposition && $options.handleComposition(...args)),
        onCompositionupdate: _cache[11] || (_cache[11] = (...args) => $options.handleComposition && $options.handleComposition(...args)),
        onCompositionend: _cache[12] || (_cache[12] = (...args) => $options.handleComposition && $options.handleComposition(...args)),
        onInput: _cache[13] || (_cache[13] = (...args) => $options.handleInput && $options.handleInput(...args)),
        onChange: _cache[14] || (_cache[14] = (...args) => $options.handleChange && $options.handleChange(...args))
      }, null, 42, _hoisted_5),
      $options.append ? withDirectives((openBlock(), createElementBlock("div", {
        key: 7,
        class: normalizeClass([$data.prefixCls + "-group-append"])
      }, [
        renderSlot(_ctx.$slots, "append")
      ], 2)), [
        [vShow, $data.slotReady]
      ]) : $props.search && $props.enterButton ? (openBlock(), createElementBlock("div", {
        key: 8,
        class: normalizeClass([$data.prefixCls + "-group-append", $data.prefixCls + "-search"]),
        onClick: _cache[15] || (_cache[15] = (...args) => $options.handleSearch && $options.handleSearch(...args))
      }, [
        $props.enterButton === true ? (openBlock(), createElementBlock("i", _hoisted_6)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createTextVNode(toDisplayString($props.enterButton), 1)
        ], 64))
      ], 2)) : $options.showPrefix ? (openBlock(), createElementBlock("span", _hoisted_7, [
        renderSlot(_ctx.$slots, "prefix", {}, () => [
          $props.prefix ? (openBlock(), createElementBlock("i", {
            key: 0,
            class: normalizeClass(["ivu-icon", ["ivu-icon-" + $props.prefix]])
          }, null, 2)) : createCommentVNode("", true)
        ])
      ])) : createCommentVNode("", true)
    ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
      createElementVNode("textarea", {
        id: $props.elementId,
        wrap: $props.wrap,
        autocomplete: $props.autocomplete,
        spellcheck: $props.spellcheck,
        ref: "textarea",
        class: normalizeClass($options.textareaClasses),
        style: normalizeStyle($data.textareaStyles),
        placeholder: $props.placeholder,
        disabled: _ctx.itemDisabled,
        rows: $props.rows,
        maxlength: $props.maxlength,
        readonly: $props.readonly,
        name: $props.name,
        value: $data.currentValue,
        autofocus: $props.autofocus,
        onKeyup: [
          _cache[16] || (_cache[16] = withKeys((...args) => $options.handleEnter && $options.handleEnter(...args), ["enter"])),
          _cache[17] || (_cache[17] = (...args) => $options.handleKeyup && $options.handleKeyup(...args))
        ],
        onKeypress: _cache[18] || (_cache[18] = (...args) => $options.handleKeypress && $options.handleKeypress(...args)),
        onKeydown: _cache[19] || (_cache[19] = (...args) => $options.handleKeydown && $options.handleKeydown(...args)),
        onFocus: _cache[20] || (_cache[20] = (...args) => $options.handleFocus && $options.handleFocus(...args)),
        onBlur: _cache[21] || (_cache[21] = (...args) => $options.handleBlur && $options.handleBlur(...args)),
        onCompositionstart: _cache[22] || (_cache[22] = (...args) => $options.handleComposition && $options.handleComposition(...args)),
        onCompositionupdate: _cache[23] || (_cache[23] = (...args) => $options.handleComposition && $options.handleComposition(...args)),
        onCompositionend: _cache[24] || (_cache[24] = (...args) => $options.handleComposition && $options.handleComposition(...args)),
        onInput: _cache[25] || (_cache[25] = (...args) => $options.handleInput && $options.handleInput(...args))
      }, "\n            ", 46, _hoisted_8),
      $props.showWordLimit ? (openBlock(), createElementBlock("span", _hoisted_9, toDisplayString($options.textLength) + "/" + toDisplayString($options.upperLimit), 1)) : createCommentVNode("", true)
    ], 64))
  ], 2);
}
var Input = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Input as default };
