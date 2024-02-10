import Locale from "../../mixins/locale.js";
import mixinsForm from "../../mixins/form.js";
import { openBlock, createElementBlock, normalizeClass, createElementVNode, Fragment, renderList, createTextVNode, toDisplayString, withDirectives, renderSlot, vShow, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-rate";
const _sfc_main = {
  name: "Rate",
  mixins: [Locale, mixinsForm],
  emits: ["update:modelValue", "on-change"],
  props: {
    count: {
      type: Number,
      default: 5
    },
    modelValue: {
      type: Number,
      default: 0
    },
    allowHalf: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showText: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    clearable: {
      type: Boolean,
      default: false
    },
    character: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    customIcon: {
      type: String,
      default: ""
    }
  },
  data() {
    const value = this.modelValue || 0;
    return {
      prefixCls,
      hoverIndex: -1,
      isHover: false,
      isHalf: this.allowHalf && value.toString().indexOf(".") >= 0,
      currentValue: value
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-disabled`]: this.itemDisabled
        }
      ];
    },
    iconClasses() {
      return [
        "ivu-icon",
        {
          [`ivu-icon-${this.icon}`]: this.icon !== "",
          [`${this.customIcon}`]: this.customIcon !== ""
        }
      ];
    },
    showCharacter() {
      return this.character !== "" || this.icon !== "" || this.customIcon !== "";
    }
  },
  watch: {
    modelValue(val) {
      this.currentValue = val || 0;
    },
    currentValue(val) {
      this.setHalf(val);
    }
  },
  methods: {
    starCls(value) {
      const hoverIndex = this.hoverIndex;
      const currentIndex = this.isHover ? hoverIndex : this.currentValue;
      let full = false;
      let isLast = false;
      if (currentIndex >= value)
        full = true;
      if (this.isHover) {
        isLast = currentIndex === value;
      } else {
        isLast = Math.ceil(this.currentValue) === value;
      }
      return [
        {
          [`${prefixCls}-star`]: !this.showCharacter,
          [`${prefixCls}-star-chart`]: this.showCharacter,
          [`${prefixCls}-star-full`]: !isLast && full || isLast && !this.isHalf,
          [`${prefixCls}-star-half`]: isLast && this.isHalf,
          [`${prefixCls}-star-zero`]: !full
        }
      ];
    },
    handleMousemove(value, event) {
      if (this.itemDisabled)
        return;
      this.isHover = true;
      if (this.allowHalf) {
        const type = event.target.getAttribute("type") || false;
        this.isHalf = type === "half";
      } else {
        this.isHalf = false;
      }
      this.hoverIndex = value;
    },
    handleMouseleave() {
      if (this.itemDisabled)
        return;
      this.isHover = false;
      this.setHalf(this.currentValue);
      this.hoverIndex = -1;
    },
    setHalf(val) {
      this.isHalf = this.allowHalf && val.toString().indexOf(".") >= 0;
    },
    handleClick(value) {
      if (this.itemDisabled)
        return;
      if (this.isHalf)
        value -= 0.5;
      if (this.clearable && Math.abs(value - this.currentValue) < 0.01) {
        value = 0;
      }
      this.currentValue = value;
      this.$emit("update:modelValue", value);
      this.$emit("on-change", value);
      this.handleFormItemChange("change", value);
    }
  }
};
const _hoisted_1 = ["name", "value"];
const _hoisted_2 = ["onMousemove", "onClick"];
const _hoisted_3 = { key: 0 };
const _hoisted_4 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes),
    onMouseleave: _cache[0] || (_cache[0] = (...args) => $options.handleMouseleave && $options.handleMouseleave(...args))
  }, [
    createElementVNode("input", {
      type: "hidden",
      name: $props.name,
      value: $data.currentValue
    }, null, 8, _hoisted_1),
    (openBlock(true), createElementBlock(Fragment, null, renderList($props.count, (item) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass($options.starCls(item)),
        onMousemove: ($event) => $options.handleMousemove(item, $event),
        key: item,
        onClick: ($event) => $options.handleClick(item)
      }, [
        !$options.showCharacter ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass([$data.prefixCls + "-star-content"]),
          type: "half"
        }, null, 2)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createElementVNode("span", {
            class: normalizeClass([$data.prefixCls + "-star-first"]),
            type: "half"
          }, [
            $props.character !== "" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode(toDisplayString($props.character), 1)
            ], 64)) : (openBlock(), createElementBlock("i", {
              key: 1,
              class: normalizeClass($options.iconClasses),
              type: "half"
            }, null, 2))
          ], 2),
          createElementVNode("span", {
            class: normalizeClass([$data.prefixCls + "-star-second"])
          }, [
            $props.character !== "" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode(toDisplayString($props.character), 1)
            ], 64)) : (openBlock(), createElementBlock("i", {
              key: 1,
              class: normalizeClass($options.iconClasses)
            }, null, 2))
          ], 2)
        ], 64))
      ], 42, _hoisted_2);
    }), 128)),
    $props.showText ? withDirectives((openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass([$data.prefixCls + "-text"])
    }, [
      renderSlot(_ctx.$slots, "default", {}, () => [
        createElementVNode("span", null, toDisplayString($data.currentValue), 1),
        createTextVNode(),
        $data.currentValue <= 1 ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(_ctx.t("i.rate.star")), 1)) : (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(_ctx.t("i.rate.stars")), 1))
      ])
    ], 2)), [
      [vShow, $data.currentValue > 0]
    ]) : createCommentVNode("", true)
  ], 34);
}
var Rate = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Rate as default };
