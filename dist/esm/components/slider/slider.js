import { nextTick, resolveComponent, openBlock, createElementBlock, normalizeClass, createBlock, createCommentVNode, createElementVNode, withModifiers, normalizeStyle, Fragment, renderList, createVNode, withCtx, withKeys } from "vue";
import InputNumber from "../input-number/input-number.js";
import Tooltip from "../tooltip/tooltip.js";
import SliderMarker from "./marker.js";
import { oneOf, getStyle } from "../../utils/assist.js";
import random from "../../utils/random_str.js";
import { on, off } from "../../utils/dom.js";
import mixinsForm from "../../mixins/form.js";
import elementResizeDetectorMaker from "element-resize-detector";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-slider";
const _sfc_main = {
  name: "Slider",
  mixins: [mixinsForm],
  emits: ["update:modelValue", "on-input", "on-change"],
  components: { InputNumber, Tooltip, SliderMarker },
  inject: {
    ModalInstance: {
      default: null
    },
    DrawerInstance: {
      default: null
    }
  },
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    range: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [Number, Array],
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showInput: {
      type: Boolean,
      default: false
    },
    inputSize: {
      type: String,
      default: "default",
      validator(value) {
        return oneOf(value, ["small", "large", "default"]);
      }
    },
    showStops: {
      type: Boolean,
      default: false
    },
    tipFormat: {
      type: Function,
      default(val) {
        return val;
      }
    },
    showTip: {
      type: String,
      default: "hover",
      validator(value) {
        return oneOf(value, ["hover", "always", "never"]);
      }
    },
    name: {
      type: String
    },
    activeChange: {
      type: Boolean,
      default: true
    },
    marks: {
      type: Object
    }
  },
  data() {
    let val = this.checkLimits(Array.isArray(this.modelValue) ? this.modelValue : [this.modelValue]);
    if (this.range && this.modelValue === null)
      val = [0, 0];
    return {
      prefixCls,
      currentValue: val,
      dragging: false,
      pointerDown: "",
      startX: 0,
      currentX: 0,
      startPos: 0,
      oldValue: [...val],
      valueIndex: {
        min: 0,
        max: 1
      },
      sliderWidth: 0,
      isValueNull: false,
      id: random(6)
    };
  },
  watch: {
    modelValue(val) {
      if (val === null)
        this.isValueNull = true;
      val = this.checkLimits(Array.isArray(val) ? val : [val]);
      if (!this.dragging && (val[0] !== this.currentValue[0] || val[1] !== this.currentValue[1])) {
        if (this.isValueNull && this.range)
          this.currentValue = [0, 0];
        else
          this.currentValue = val;
      }
    },
    exportValue(values) {
      nextTick(() => {
        this.$refs.minTooltip.updatePopper();
        if (this.range) {
          this.$refs.maxTooltip.updatePopper();
        }
      });
      const value = this.range ? values : values[0];
      if (this.isValueNull) {
        this.isValueNull = false;
        this.$emit("update:modelValue", null);
      } else {
        this.$emit("update:modelValue", value);
      }
      this.$emit("on-input", value);
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-input`]: this.showInput && !this.range,
          [`${prefixCls}-range`]: this.range,
          [`${prefixCls}-disabled`]: this.itemDisabled
        }
      ];
    },
    minButtonClasses() {
      return [
        `${prefixCls}-button`,
        {
          [`${prefixCls}-button-dragging`]: this.pointerDown === "min"
        }
      ];
    },
    maxButtonClasses() {
      return [
        `${prefixCls}-button`,
        {
          [`${prefixCls}-button-dragging`]: this.pointerDown === "max"
        }
      ];
    },
    exportValue() {
      const decimalCases = (String(this.step).split(".")[1] || "").length;
      return this.currentValue.map((nr) => Number(nr.toFixed(decimalCases)));
    },
    minPosition() {
      const val = this.currentValue;
      return (val[0] - this.min) / this.valueRange * 100;
    },
    maxPosition: function() {
      const val = this.currentValue;
      return (val[1] - this.min) / this.valueRange * 100;
    },
    barStyle() {
      const style = {
        width: (this.currentValue[0] - this.min) / this.valueRange * 100 + "%"
      };
      if (this.range) {
        style.left = (this.currentValue[0] - this.min) / this.valueRange * 100 + "%";
        style.width = (this.currentValue[1] - this.currentValue[0]) / this.valueRange * 100 + "%";
      }
      return style;
    },
    stops() {
      let stopCount = this.valueRange / this.step;
      let result = [];
      let stepWidth = 100 * this.step / this.valueRange;
      for (let i = 1; i < stopCount; i++) {
        result.push(i * stepWidth);
      }
      return result;
    },
    markList() {
      if (!this.marks)
        return [];
      const marksKeys = Object.keys(this.marks);
      return marksKeys.map(parseFloat).sort((a, b) => a - b).filter((point) => point <= this.max && point >= this.min).map((point) => ({
        point,
        position: (point - this.min) * 100 / (this.max - this.min),
        mark: this.marks[point]
      }));
    },
    tipDisabled() {
      return this.tipFormat(this.currentValue[0]) === null || this.showTip === "never";
    },
    valueRange() {
      return this.max - this.min;
    },
    firstPosition() {
      return this.currentValue[0];
    },
    secondPosition() {
      return this.currentValue[1];
    }
  },
  methods: {
    getPointerX(e) {
      return e.type.indexOf("touch") !== -1 ? e.touches[0].clientX : e.clientX;
    },
    checkLimits([min, max]) {
      min = Math.max(this.min, min);
      min = Math.min(this.max, min);
      max = Math.max(this.min, min, max);
      max = Math.min(this.max, max);
      return [min, max];
    },
    getCurrentValue(event, type) {
      if (this.itemDisabled) {
        return;
      }
      const index = this.valueIndex[type];
      if (typeof index === "undefined") {
        return;
      }
      return this.currentValue[index];
    },
    onKeyLeft(event, type) {
      const value = this.getCurrentValue(event, type);
      if (Number.isFinite(value)) {
        this.changeButtonPosition(value - this.step, type);
      }
    },
    onKeyRight(event, type) {
      const value = this.getCurrentValue(event, type);
      if (Number.isFinite(value)) {
        this.changeButtonPosition(value + this.step, type);
      }
    },
    onPointerDown(event, type) {
      if (this.itemDisabled)
        return;
      event.preventDefault();
      this.pointerDown = type;
      this.onPointerDragStart(event);
      on(window, "mousemove", this.onPointerDrag);
      on(window, "touchmove", this.onPointerDrag);
      on(window, "mouseup", this.onPointerDragEnd);
      on(window, "touchend", this.onPointerDragEnd);
    },
    onPointerDragStart(event) {
      this.dragging = false;
      this.startX = this.getPointerX(event);
      this.startPos = this[`${this.pointerDown}Position`] * this.valueRange / 100 + this.min;
    },
    onPointerDrag(event) {
      this.dragging = true;
      this.$refs[`${this.pointerDown}Tooltip`].visible = true;
      this.currentX = this.getPointerX(event);
      const diff = (this.currentX - this.startX) / this.sliderWidth * this.valueRange;
      this.changeButtonPosition(this.startPos + diff);
    },
    onPointerDragEnd() {
      if (this.dragging) {
        this.dragging = false;
        this.$refs[`${this.pointerDown}Tooltip`].visible = false;
        this.emitChange();
      }
      this.pointerDown = "";
      off(window, "mousemove", this.onPointerDrag);
      off(window, "touchmove", this.onPointerDrag);
      off(window, "mouseup", this.onPointerDragEnd);
      off(window, "touchend", this.onPointerDragEnd);
    },
    changeButtonPosition(newPos, forceType) {
      const type = forceType || this.pointerDown;
      const index = type === "min" ? 0 : 1;
      if (type === "min")
        newPos = this.checkLimits([newPos, this.max])[0];
      else
        newPos = this.checkLimits([this.min, newPos])[1];
      const modulus = this.handleDecimal(newPos, this.step);
      const value = this.currentValue;
      value[index] = newPos - modulus;
      if (this.range) {
        if (type === "min" && value[0] > value[1])
          value[1] = value[0];
        if (type === "max" && value[0] > value[1])
          value[0] = value[1];
      }
      this.currentValue = [...value];
      if (!this.dragging) {
        if (this.currentValue[index] !== this.oldValue[index]) {
          this.emitChange();
          this.oldValue[index] = this.currentValue[index];
        }
      }
    },
    handleDecimal(pos, step) {
      if (step < 1) {
        let sl = step.toString(), multiple = 1, m;
        try {
          m = sl.split(".")[1].length;
        } catch (e) {
          m = 0;
        }
        multiple = Math.pow(10, m);
        return pos * multiple % (step * multiple) / multiple;
      } else
        return pos % step;
    },
    emitChange() {
      const value = this.range ? this.exportValue : this.exportValue[0];
      this.$emit("on-change", value);
      this.handleFormItemChange("change", value);
    },
    sliderClick(event) {
      if (this.itemDisabled)
        return;
      const currentX = this.getPointerX(event);
      const sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
      let newPos = (currentX - sliderOffsetLeft) / this.sliderWidth * this.valueRange + this.min;
      let regularNewPos = newPos / this.valueRange * 100;
      if (!this.range || regularNewPos <= this.minPosition)
        this.changeButtonPosition(newPos, "min");
      else if (regularNewPos >= this.maxPosition)
        this.changeButtonPosition(newPos, "max");
      else
        this.changeButtonPosition(newPos, newPos - this.firstPosition <= this.secondPosition - newPos ? "min" : "max");
    },
    handleInputChange(val) {
      this.currentValue = [val === 0 ? 0 : val || this.min, this.currentValue[1]];
      this.emitChange();
    },
    handleFocus(type) {
      this.$refs[`${type}Tooltip`].handleShowPopper();
    },
    handleBlur(type) {
      this.$refs[`${type}Tooltip`].handleClosePopper();
    },
    handleSetSliderWidth() {
      this.sliderWidth = parseInt(getStyle(this.$refs.slider, "width"), 10);
    },
    handleOnVisibleChange(val) {
      if (val && this.showTip === "always") {
        this.$refs.minTooltip.doDestroy();
        if (this.range) {
          this.$refs.maxTooltip.doDestroy();
        }
        nextTick(() => {
          this.$refs.minTooltip.updatePopper();
          if (this.range) {
            this.$refs.maxTooltip.updatePopper();
          }
        });
      }
    },
    addSlider(instance) {
      const target = this[instance];
      if (!target)
        return;
      if (!target.sliderList)
        target.sliderList = [];
      target.sliderList.push({
        id: this.id,
        slider: this
      });
    },
    removeSlider(instance) {
      const target = this[instance];
      if (!target || !target.sliderList)
        return;
      const index = target.sliderList.findIndex((item) => item.id === this.id);
      target.sliderList.splice(index, 1);
    }
  },
  mounted() {
    this.addSlider("ModalInstance");
    this.addSlider("DrawerInstance");
    this.observer = elementResizeDetectorMaker();
    this.observer.listenTo(this.$refs.slider, this.handleSetSliderWidth);
  },
  beforeUnmount() {
    this.removeSlider("ModalInstance");
    this.removeSlider("DrawerInstance");
    this.observer.removeListener(this.$refs.slider, this.handleSetSliderWidth);
  }
};
const _hoisted_1 = ["name", "value"];
const _hoisted_2 = { class: "ivu-slider-marks" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Input_number = resolveComponent("Input-number");
  const _component_SliderMarker = resolveComponent("SliderMarker");
  const _component_Tooltip = resolveComponent("Tooltip");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes)
  }, [
    !$props.range && $props.showInput ? (openBlock(), createBlock(_component_Input_number, {
      key: 0,
      min: $props.min,
      size: $props.inputSize,
      max: $props.max,
      step: $props.step,
      modelValue: $options.exportValue[0],
      disabled: _ctx.itemDisabled,
      "active-change": $props.activeChange,
      onOnChange: $options.handleInputChange
    }, null, 8, ["min", "size", "max", "step", "modelValue", "disabled", "active-change", "onOnChange"])) : createCommentVNode("", true),
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-wrap"]),
      ref: "slider",
      onClick: _cache[19] || (_cache[19] = withModifiers((...args) => $options.sliderClick && $options.sliderClick(...args), ["self"]))
    }, [
      createElementVNode("input", {
        type: "hidden",
        name: $props.name,
        value: $options.exportValue
      }, null, 8, _hoisted_1),
      createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-bar"]),
        style: normalizeStyle($options.barStyle),
        onClick: _cache[0] || (_cache[0] = withModifiers((...args) => $options.sliderClick && $options.sliderClick(...args), ["self"]))
      }, null, 6),
      $props.showStops ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList($options.stops, (item) => {
        return openBlock(), createElementBlock("div", {
          class: normalizeClass([$data.prefixCls + "-stop"]),
          key: item,
          style: normalizeStyle({ "left": item + "%" }),
          onClick: _cache[1] || (_cache[1] = withModifiers((...args) => $options.sliderClick && $options.sliderClick(...args), ["self"]))
        }, null, 6);
      }), 128)) : createCommentVNode("", true),
      $options.markList.length > 0 ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($options.markList, (item, key) => {
          return openBlock(), createElementBlock("div", {
            key,
            class: normalizeClass([$data.prefixCls + "-stop"]),
            style: normalizeStyle({ "left": item.position + "%" }),
            onClick: _cache[2] || (_cache[2] = withModifiers((...args) => $options.sliderClick && $options.sliderClick(...args), ["self"]))
          }, null, 6);
        }), 128)),
        createElementVNode("div", _hoisted_2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($options.markList, (item, key) => {
            return openBlock(), createBlock(_component_SliderMarker, {
              key,
              mark: item.mark,
              style: normalizeStyle({ "left": item.position + "%" }),
              onClick: $options.sliderClick
            }, null, 8, ["mark", "style", "onClick"]);
          }), 128))
        ])
      ], 64)) : createCommentVNode("", true),
      createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-button-wrap"]),
        style: normalizeStyle({ left: $options.minPosition + "%" }),
        onTouchstart: _cache[9] || (_cache[9] = ($event) => $options.onPointerDown($event, "min")),
        onMousedown: _cache[10] || (_cache[10] = ($event) => $options.onPointerDown($event, "min"))
      }, [
        createVNode(_component_Tooltip, {
          controlled: $data.pointerDown === "min",
          placement: "top",
          content: $props.tipFormat($options.exportValue[0]),
          disabled: $options.tipDisabled,
          always: $props.showTip === "always",
          ref: "minTooltip"
        }, {
          default: withCtx(() => [
            createElementVNode("div", {
              class: normalizeClass($options.minButtonClasses),
              tabindex: "0",
              onFocus: _cache[3] || (_cache[3] = ($event) => $options.handleFocus("min")),
              onBlur: _cache[4] || (_cache[4] = ($event) => $options.handleBlur("min")),
              onKeydown: [
                _cache[5] || (_cache[5] = withKeys(($event) => $options.onKeyLeft($event, "min"), ["left"])),
                _cache[6] || (_cache[6] = withKeys(($event) => $options.onKeyLeft($event, "min"), ["down"])),
                _cache[7] || (_cache[7] = withKeys(($event) => $options.onKeyRight($event, "min"), ["right"])),
                _cache[8] || (_cache[8] = withKeys(($event) => $options.onKeyRight($event, "min"), ["up"]))
              ]
            }, null, 34)
          ]),
          _: 1
        }, 8, ["controlled", "content", "disabled", "always"])
      ], 38),
      $props.range ? (openBlock(), createElementBlock("div", {
        key: 2,
        class: normalizeClass([$data.prefixCls + "-button-wrap"]),
        style: normalizeStyle({ left: $options.maxPosition + "%" }),
        onTouchstart: _cache[17] || (_cache[17] = ($event) => $options.onPointerDown($event, "max")),
        onMousedown: _cache[18] || (_cache[18] = ($event) => $options.onPointerDown($event, "max"))
      }, [
        createVNode(_component_Tooltip, {
          controlled: $data.pointerDown === "max",
          placement: "top",
          content: $props.tipFormat($options.exportValue[1]),
          disabled: $options.tipDisabled,
          always: $props.showTip === "always",
          ref: "maxTooltip"
        }, {
          default: withCtx(() => [
            createElementVNode("div", {
              class: normalizeClass($options.maxButtonClasses),
              tabindex: "0",
              onFocus: _cache[11] || (_cache[11] = ($event) => $options.handleFocus("max")),
              onBlur: _cache[12] || (_cache[12] = ($event) => $options.handleBlur("max")),
              onKeydown: [
                _cache[13] || (_cache[13] = withKeys(($event) => $options.onKeyLeft($event, "max"), ["left"])),
                _cache[14] || (_cache[14] = withKeys(($event) => $options.onKeyLeft($event, "max"), ["down"])),
                _cache[15] || (_cache[15] = withKeys(($event) => $options.onKeyRight($event, "max"), ["right"])),
                _cache[16] || (_cache[16] = withKeys(($event) => $options.onKeyRight($event, "max"), ["up"]))
              ]
            }, null, 34)
          ]),
          _: 1
        }, 8, ["controlled", "content", "disabled", "always"])
      ], 38)) : createCommentVNode("", true)
    ], 2)
  ], 2);
}
var Slider = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Slider as default };
