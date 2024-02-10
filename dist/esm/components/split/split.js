import { nextTick, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, normalizeStyle, renderSlot, createVNode } from "vue";
import { oneOf } from "../../utils/assist.js";
import { off, on } from "../../utils/dom.js";
import Trigger from "./trigger.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Split",
  components: { Trigger },
  emits: ["update:modelValue", "on-move-start", "on-moving", "on-move-end"],
  props: {
    modelValue: {
      type: [Number, String],
      default: 0.5
    },
    mode: {
      validator(value) {
        return oneOf(value, ["horizontal", "vertical"]);
      },
      default: "horizontal"
    },
    min: {
      type: [Number, String],
      default: "40px"
    },
    max: {
      type: [Number, String],
      default: "40px"
    }
  },
  data() {
    return {
      prefix: "ivu-split",
      offset: 0,
      oldOffset: 0,
      isMoving: false,
      computedMin: 0,
      computedMax: 0,
      currentValue: 0.5
    };
  },
  computed: {
    wrapperClasses() {
      return [
        `${this.prefix}-wrapper`,
        this.isMoving ? "no-select" : ""
      ];
    },
    paneClasses() {
      return [
        `${this.prefix}-pane`,
        {
          [`${this.prefix}-pane-moving`]: this.isMoving
        }
      ];
    },
    isHorizontal() {
      return this.mode === "horizontal";
    },
    anotherOffset() {
      return 100 - this.offset;
    },
    valueIsPx() {
      return typeof this.modelValue === "string";
    },
    offsetSize() {
      return this.isHorizontal ? "offsetWidth" : "offsetHeight";
    }
  },
  methods: {
    px2percent(numerator, denominator) {
      return parseFloat(numerator) / parseFloat(denominator);
    },
    getComputedThresholdValue(type) {
      let size = this.$refs.outerWrapper[this.offsetSize];
      if (this.valueIsPx)
        return typeof this[type] === "string" ? this[type] : size * this[type];
      else
        return typeof this[type] === "string" ? this.px2percent(this[type], size) : this[type];
    },
    getMin(value1, value2) {
      if (this.valueIsPx)
        return `${Math.min(parseFloat(value1), parseFloat(value2))}px`;
      else
        return Math.min(value1, value2);
    },
    getMax(value1, value2) {
      if (this.valueIsPx)
        return `${Math.max(parseFloat(value1), parseFloat(value2))}px`;
      else
        return Math.max(value1, value2);
    },
    getAnotherOffset(value) {
      let res = 0;
      if (this.valueIsPx)
        res = `${this.$refs.outerWrapper[this.offsetSize] - parseFloat(value)}px`;
      else
        res = 1 - value;
      return res;
    },
    handleMove(e) {
      let pageOffset = this.isHorizontal ? e.pageX : e.pageY;
      let offset = pageOffset - this.initOffset;
      let outerWidth = this.$refs.outerWrapper[this.offsetSize];
      let value = this.valueIsPx ? `${parseFloat(this.oldOffset) + offset}px` : this.px2percent(outerWidth * this.oldOffset + offset, outerWidth);
      let anotherValue = this.getAnotherOffset(value);
      if (parseFloat(value) <= parseFloat(this.computedMin))
        value = this.getMax(value, this.computedMin);
      if (parseFloat(anotherValue) <= parseFloat(this.computedMax))
        value = this.getAnotherOffset(this.getMax(anotherValue, this.computedMax));
      e.atMin = this.modelValue === this.computedMin;
      e.atMax = this.valueIsPx ? this.getAnotherOffset(this.modelValue) === this.computedMax : this.getAnotherOffset(this.modelValue).toFixed(5) === this.computedMax.toFixed(5);
      this.$emit("update:modelValue", value);
      this.$emit("on-moving", e);
    },
    handleUp() {
      this.isMoving = false;
      off(document, "mousemove", this.handleMove);
      off(document, "mouseup", this.handleUp);
      this.$emit("on-move-end");
    },
    handleMousedown(e) {
      this.initOffset = this.isHorizontal ? e.pageX : e.pageY;
      this.oldOffset = this.modelValue;
      this.isMoving = true;
      on(document, "mousemove", this.handleMove);
      on(document, "mouseup", this.handleUp);
      this.$emit("on-move-start");
    },
    computeOffset() {
      nextTick(() => {
        this.computedMin = this.getComputedThresholdValue("min");
        this.computedMax = this.getComputedThresholdValue("max");
        this.offset = (this.valueIsPx ? this.px2percent(this.modelValue, this.$refs.outerWrapper[this.offsetSize]) : this.modelValue) * 1e4 / 100;
      });
    }
  },
  watch: {
    modelValue(val) {
      if (val !== this.currentValue) {
        this.currentValue = val;
        this.computeOffset();
      }
    }
  },
  mounted() {
    nextTick(() => {
      this.computeOffset();
    });
    on(window, "resize", this.computeOffset);
  },
  beforeUnmount() {
    off(window, "resize", this.computeOffset);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_trigger = resolveComponent("trigger");
  return openBlock(), createElementBlock("div", {
    ref: "outerWrapper",
    class: normalizeClass($options.wrapperClasses)
  }, [
    $options.isHorizontal ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${$data.prefix}-horizontal`)
    }, [
      createElementVNode("div", {
        style: normalizeStyle({ right: `${$options.anotherOffset}%` }),
        class: normalizeClass(["left-pane", $options.paneClasses])
      }, [
        renderSlot(_ctx.$slots, "left")
      ], 6),
      createElementVNode("div", {
        class: normalizeClass(`${$data.prefix}-trigger-con`),
        style: normalizeStyle({ left: `${$data.offset}%` }),
        onMousedown: _cache[0] || (_cache[0] = (...args) => $options.handleMousedown && $options.handleMousedown(...args))
      }, [
        renderSlot(_ctx.$slots, "trigger", {}, () => [
          createVNode(_component_trigger, { mode: "vertical" })
        ])
      ], 38),
      createElementVNode("div", {
        style: normalizeStyle({ left: `${$data.offset}%` }),
        class: normalizeClass(["right-pane", $options.paneClasses])
      }, [
        renderSlot(_ctx.$slots, "right")
      ], 6)
    ], 2)) : (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(`${$data.prefix}-vertical`)
    }, [
      createElementVNode("div", {
        style: normalizeStyle({ bottom: `${$options.anotherOffset}%` }),
        class: normalizeClass(["top-pane", $options.paneClasses])
      }, [
        renderSlot(_ctx.$slots, "top")
      ], 6),
      createElementVNode("div", {
        class: normalizeClass(`${$data.prefix}-trigger-con`),
        style: normalizeStyle({ top: `${$data.offset}%` }),
        onMousedown: _cache[1] || (_cache[1] = (...args) => $options.handleMousedown && $options.handleMousedown(...args))
      }, [
        renderSlot(_ctx.$slots, "trigger", {}, () => [
          createVNode(_component_trigger, { mode: "horizontal" })
        ])
      ], 38),
      createElementVNode("div", {
        style: normalizeStyle({ top: `${$data.offset}%` }),
        class: normalizeClass(["bottom-pane", $options.paneClasses])
      }, [
        renderSlot(_ctx.$slots, "bottom")
      ], 6)
    ], 2))
  ], 2);
}
var Split = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Split as default };
