import { getCurrentInstance, resolveComponent, resolveDirective, withDirectives, openBlock, createElementBlock, normalizeClass, createElementVNode, createVNode, withKeys, vShow, normalizeStyle, withCtx, Transition, createCommentVNode, createBlock, Fragment, createTextVNode, toDisplayString } from "vue";
import tinycolor from "tinycolor2";
import { directive } from "../../directives/v-click-outside-x.js";
import Drop from "../select/dropdown.js";
import RecommendColors from "./recommend-colors.js";
import Saturation from "./saturation.js";
import Hue from "./hue.js";
import Alpha from "./alpha.js";
import Input from "../input/input.js";
import _sfc_main$1 from "../button/button.js";
import Icon from "../icon/icon.js";
import Locale from "../../mixins/locale.js";
import globalConfig from "../../mixins/globalConfig.js";
import { oneOf } from "../../utils/assist.js";
import mixinsForm from "../../mixins/form.js";
import Prefixes from "./prefixMixin.js";
import { changeColor, toRGBAString } from "./utils.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "ColorPicker",
  components: { Drop, RecommendColors, Saturation, Hue, Alpha, iInput: Input, iButton: _sfc_main$1, Icon },
  directives: { clickOutside: directive },
  mixins: [Locale, Prefixes, mixinsForm, globalConfig],
  emits: ["on-active-change", "on-open-change", "on-change", "on-pick-success", "on-pick-clear", "update:modelValue"],
  provide() {
    return {
      ColorPickerInstance: this
    };
  },
  props: {
    modelValue: {
      type: String,
      default: void 0
    },
    hue: {
      type: Boolean,
      default: true
    },
    alpha: {
      type: Boolean,
      default: false
    },
    recommend: {
      type: Boolean,
      default: false
    },
    format: {
      type: String,
      validator(value) {
        return oneOf(value, ["hsl", "hsv", "hex", "rgb"]);
      },
      default: void 0
    },
    colors: {
      type: Array,
      default() {
        return [];
      }
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
    hideDropDown: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      validator(value) {
        return oneOf(value, [
          "top",
          "top-start",
          "top-end",
          "bottom",
          "bottom-start",
          "bottom-end",
          "left",
          "left-start",
          "left-end",
          "right",
          "right-start",
          "right-end"
        ]);
      },
      default: "bottom"
    },
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? false : global.$VIEWUI.transfer;
      }
    },
    name: {
      type: String,
      default: void 0
    },
    editable: {
      type: Boolean,
      default: true
    },
    capture: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI ? true : global.$VIEWUI.capture;
      }
    },
    transferClassName: {
      type: String
    },
    eventsEnabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      val: changeColor(this.modelValue || ""),
      currentValue: this.modelValue || "",
      dragging: false,
      visible: false,
      recommendedColor: [
        "#2d8cf0",
        "#19be6b",
        "#ff9900",
        "#ed4014",
        "#00b5ff",
        "#19c919",
        "#f9e31c",
        "#ea1a1a",
        "#9b1dea",
        "#00c2b1",
        "#ac7a33",
        "#1d35ea",
        "#8bc34a",
        "#f16b62",
        "#ea4ca3",
        "#0d94aa",
        "#febd79",
        "#5d4037",
        "#00bcd4",
        "#f06292",
        "#cddc39",
        "#607d8b",
        "#000000",
        "#ffffff"
      ]
    };
  },
  computed: {
    arrowClasses() {
      return [
        `${this.inputPrefixCls}-icon`,
        `${this.inputPrefixCls}-icon-normal`
      ];
    },
    transition() {
      return oneOf(this.placement, ["bottom-start", "bottom", "bottom-end"]) ? "slide-up" : "fade";
    },
    saturationColors: {
      get() {
        return this.val;
      },
      set(newVal) {
        this.val = newVal;
        this.$emit("on-active-change", this.formatColor);
      }
    },
    classes() {
      return [
        `${this.prefixCls}`,
        {
          [`${this.prefixCls}-transfer`]: this.transfer
        }
      ];
    },
    wrapClasses() {
      return [
        `${this.prefixCls}-rel`,
        `${this.prefixCls}-${this.size}`,
        `${this.inputPrefixCls}-wrapper`,
        `${this.inputPrefixCls}-wrapper-${this.size}`,
        {
          [`${this.prefixCls}-disabled`]: this.itemDisabled
        }
      ];
    },
    inputClasses() {
      return [
        `${this.prefixCls}-input`,
        `${this.inputPrefixCls}`,
        `${this.inputPrefixCls}-${this.size}`,
        {
          [`${this.prefixCls}-focused`]: this.visible,
          [`${this.prefixCls}-disabled`]: this.itemDisabled
        }
      ];
    },
    dropClasses() {
      return {
        [`${this.transferPrefixCls}-no-max-height`]: true,
        [`${this.prefixCls}-transfer`]: this.transfer,
        [`${this.prefixCls}-hide-drop`]: this.hideDropDown,
        [this.transferClassName]: this.transferClassName
      };
    },
    displayedColorStyle() {
      return { backgroundColor: toRGBAString(this.visible ? this.saturationColors.rgba : tinycolor(this.modelValue).toRgb()) };
    },
    formatColor() {
      const { format, saturationColors } = this;
      if (format) {
        if (format === "hsl") {
          return tinycolor(saturationColors.hsl).toHslString();
        }
        if (format === "hsv") {
          return tinycolor(saturationColors.hsv).toHsvString();
        }
        if (format === "hex") {
          return saturationColors.hex;
        }
        if (format === "rgb") {
          return toRGBAString(saturationColors.rgba);
        }
      } else if (this.alpha) {
        return toRGBAString(saturationColors.rgba);
      }
      return saturationColors.hex;
    },
    confirmColorClasses() {
      return [
        `${this.prefixCls}-confirm-color`,
        {
          [`${this.prefixCls}-confirm-color-editable`]: this.editable
        }
      ];
    },
    arrowType() {
      const config = this.globalConfig;
      let type = "ios-arrow-down";
      if (config) {
        if (config.colorPicker.customArrow) {
          type = "";
        } else if (config.colorPicker.arrow) {
          type = config.colorPicker.arrow;
        }
      }
      return type;
    },
    customArrowType() {
      const config = this.globalConfig;
      let type = "";
      if (config) {
        if (config.colorPicker.customArrow) {
          type = config.colorPicker.customArrow;
        }
      }
      return type;
    },
    arrowSize() {
      const config = this.globalConfig;
      let size = "";
      if (config) {
        if (config.colorPicker.arrowSize) {
          size = config.colorPicker.arrowSize;
        }
      }
      return size;
    }
  },
  watch: {
    modelValue(newVal) {
      this.val = changeColor(newVal || "");
    },
    visible(val) {
      this.val = changeColor(this.modelValue || "");
      this.$refs.drop[val ? "update" : "destroy"]();
      this.$emit("on-open-change", Boolean(val));
    }
  },
  methods: {
    setDragging(value) {
      this.dragging = value;
    },
    handleClose(event) {
      if (this.visible) {
        if (this.dragging || event.type === "mousedown") {
          if (this.$refs.editColorInput && event.target !== this.$refs.editColorInput.$el.querySelector("input")) {
            event.preventDefault();
          }
          return;
        }
        if (this.transfer) {
          const $el = this.$refs.drop.$refs.drop;
          if ($el === event.target || $el.contains(event.target)) {
            return;
          }
        }
        this.closer(event);
        return;
      }
      this.visible = false;
    },
    toggleVisible() {
      if (this.itemDisabled) {
        return;
      }
      this.visible = !this.visible;
      this.$refs.input.focus();
    },
    childChange(data) {
      this.colorChange(data);
    },
    colorChange(data, oldHue) {
      this.oldHue = this.saturationColors.hsl.h;
      this.saturationColors = changeColor(data, oldHue || this.oldHue);
    },
    closer(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.visible = false;
      this.$refs.input.focus();
    },
    handleButtons(event, value) {
      this.currentValue = value;
      this.$emit("update:modelValue", value);
      this.$emit("on-change", value);
      this.handleFormItemChange("change", value);
      this.closer(event);
    },
    handleSuccess(event) {
      this.handleButtons(event, this.formatColor);
      this.$emit("on-pick-success");
    },
    handleClear(event) {
      this.handleButtons(event, "");
      this.$emit("on-pick-clear");
    },
    handleSelectColor(color) {
      this.val = changeColor(color);
      this.$emit("on-active-change", this.formatColor);
    },
    handleEditColor(event) {
      const value = event.target.value;
      this.handleSelectColor(value);
    },
    handleFirstTab(event) {
      if (event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        this.$refs.ok.$el.focus();
      }
    },
    handleLastTab(event) {
      if (!event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        this.$refs.saturation.$el.focus();
      }
    },
    onTab(event) {
      if (this.visible) {
        event.preventDefault();
      }
    },
    onEscape(event) {
      if (this.visible) {
        this.closer(event);
      }
    },
    onArrow(event) {
      if (!this.visible) {
        event.preventDefault();
        event.stopPropagation();
        this.visible = true;
      }
    },
    handleOnEscapeKeydown(e) {
      this.closer(e);
    },
    handleOnDragging(value) {
      this.setDragging(value);
    }
  }
};
const _hoisted_1 = ["name", "value"];
const _hoisted_2 = ["tabindex"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_Saturation = resolveComponent("Saturation");
  const _component_Hue = resolveComponent("Hue");
  const _component_Alpha = resolveComponent("Alpha");
  const _component_recommend_colors = resolveComponent("recommend-colors");
  const _component_i_input = resolveComponent("i-input");
  const _component_i_button = resolveComponent("i-button");
  const _component_Drop = resolveComponent("Drop");
  const _directive_click_outside = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes)
  }, [
    createElementVNode("div", {
      ref: "reference",
      class: normalizeClass($options.wrapClasses),
      onClick: _cache[4] || (_cache[4] = (...args) => $options.toggleVisible && $options.toggleVisible(...args))
    }, [
      createElementVNode("input", {
        name: $props.name,
        value: $data.currentValue,
        type: "hidden"
      }, null, 8, _hoisted_1),
      createVNode(_component_Icon, {
        type: $options.arrowType,
        custom: $options.customArrowType,
        size: $options.arrowSize,
        class: normalizeClass($options.arrowClasses)
      }, null, 8, ["type", "custom", "size", "class"]),
      createElementVNode("div", {
        ref: "input",
        tabindex: _ctx.itemDisabled ? void 0 : 0,
        class: normalizeClass($options.inputClasses),
        onKeydown: [
          _cache[0] || (_cache[0] = withKeys((...args) => $options.onTab && $options.onTab(...args), ["tab"])),
          _cache[1] || (_cache[1] = withKeys((...args) => $options.onEscape && $options.onEscape(...args), ["esc"])),
          _cache[2] || (_cache[2] = withKeys((...args) => $options.onArrow && $options.onArrow(...args), ["up"])),
          _cache[3] || (_cache[3] = withKeys((...args) => $options.onArrow && $options.onArrow(...args), ["down"]))
        ]
      }, [
        createElementVNode("div", {
          class: normalizeClass([_ctx.prefixCls + "-color"])
        }, [
          withDirectives(createElementVNode("div", {
            class: normalizeClass([_ctx.prefixCls + "-color-empty"])
          }, [
            createElementVNode("i", {
              class: normalizeClass([_ctx.iconPrefixCls, _ctx.iconPrefixCls + "-ios-close"])
            }, null, 2)
          ], 2), [
            [vShow, $props.modelValue === "" && !$data.visible]
          ]),
          withDirectives(createElementVNode("div", {
            style: normalizeStyle($options.displayedColorStyle)
          }, null, 4), [
            [vShow, $props.modelValue || $data.visible]
          ])
        ], 2)
      ], 42, _hoisted_2)
    ], 2),
    createVNode(_component_Drop, {
      ref: "drop",
      visible: $data.visible,
      placement: $props.placement,
      transfer: $props.transfer,
      classes: $options.dropClasses,
      eventsEnabled: $props.eventsEnabled,
      "transition-name": "transition-drop"
    }, {
      default: withCtx(() => [
        createVNode(Transition, { name: "fade" }, {
          default: withCtx(() => [
            $data.visible ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass([_ctx.prefixCls + "-picker"])
            }, [
              createElementVNode("div", {
                class: normalizeClass([_ctx.prefixCls + "-picker-wrapper"])
              }, [
                createElementVNode("div", {
                  class: normalizeClass([_ctx.prefixCls + "-picker-panel"])
                }, [
                  createVNode(_component_Saturation, {
                    ref: "saturation",
                    value: $options.saturationColors,
                    focused: $data.visible,
                    onChange: $options.childChange,
                    onKeydown: withKeys($options.handleFirstTab, ["tab"])
                  }, null, 8, ["value", "focused", "onChange", "onKeydown"])
                ], 2),
                $props.hue ? (openBlock(), createElementBlock("div", {
                  key: 0,
                  class: normalizeClass([_ctx.prefixCls + "-picker-hue-slider"])
                }, [
                  createVNode(_component_Hue, {
                    value: $options.saturationColors,
                    onChange: $options.childChange
                  }, null, 8, ["value", "onChange"])
                ], 2)) : createCommentVNode("", true),
                $props.alpha ? (openBlock(), createElementBlock("div", {
                  key: 1,
                  class: normalizeClass([_ctx.prefixCls + "-picker-alpha-slider"])
                }, [
                  createVNode(_component_Alpha, {
                    value: $options.saturationColors,
                    onChange: $options.childChange
                  }, null, 8, ["value", "onChange"])
                ], 2)) : createCommentVNode("", true),
                $props.colors.length ? (openBlock(), createBlock(_component_recommend_colors, {
                  key: 2,
                  list: $props.colors,
                  class: normalizeClass([_ctx.prefixCls + "-picker-colors"]),
                  onPickerColor: $options.handleSelectColor
                }, null, 8, ["list", "class", "onPickerColor"])) : createCommentVNode("", true),
                !$props.colors.length && $props.recommend ? (openBlock(), createBlock(_component_recommend_colors, {
                  key: 3,
                  list: $data.recommendedColor,
                  class: normalizeClass([_ctx.prefixCls + "-picker-colors"]),
                  onPickerColor: $options.handleSelectColor
                }, null, 8, ["list", "class", "onPickerColor"])) : createCommentVNode("", true)
              ], 2),
              createElementVNode("div", {
                class: normalizeClass([_ctx.prefixCls + "-confirm"])
              }, [
                createElementVNode("span", {
                  class: normalizeClass($options.confirmColorClasses)
                }, [
                  $props.editable ? (openBlock(), createBlock(_component_i_input, {
                    key: 0,
                    ref: "editColorInput",
                    modelValue: $options.formatColor,
                    size: "small",
                    onOnEnter: $options.handleEditColor,
                    onOnBlur: $options.handleEditColor
                  }, null, 8, ["modelValue", "onOnEnter", "onOnBlur"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                    createTextVNode(toDisplayString($options.formatColor), 1)
                  ], 64))
                ], 2),
                createVNode(_component_i_button, {
                  class: normalizeClass([_ctx.prefixCls + "-confirm-btn-cancel"]),
                  ref: "clear",
                  tabindex: 0,
                  size: "small",
                  onClick: $options.handleClear,
                  onKeydown: [
                    withKeys($options.handleClear, ["enter"]),
                    withKeys($options.closer, ["esc"])
                  ]
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.t("i.datepicker.clear")), 1)
                  ]),
                  _: 1
                }, 8, ["class", "onClick", "onKeydown"]),
                createVNode(_component_i_button, {
                  ref: "ok",
                  tabindex: 0,
                  size: "small",
                  type: "primary",
                  onClick: $options.handleSuccess,
                  onKeydown: [
                    withKeys($options.handleLastTab, ["tab"]),
                    withKeys($options.handleSuccess, ["enter"]),
                    withKeys($options.closer, ["esc"])
                  ]
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.t("i.datepicker.ok")), 1)
                  ]),
                  _: 1
                }, 8, ["onClick", "onKeydown"])
              ], 2)
            ], 2)) : createCommentVNode("", true)
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["visible", "placement", "transfer", "classes", "eventsEnabled"])
  ], 2)), [
    [_directive_click_outside, $options.handleClose, $props.capture]
  ]);
}
var ColorPicker = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ColorPicker as default };
