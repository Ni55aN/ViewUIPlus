import HSAMixin from "./hsaMixin.js";
import Prefixes from "./prefixMixin.js";
import { clamp, getIncrement } from "./utils.js";
import { on, off } from "../../utils/dom.js";
import { openBlock, createElementBlock, normalizeClass, withKeys, createElementVNode, normalizeStyle } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Saturation",
  mixins: [HSAMixin, Prefixes],
  emits: ["change"],
  data() {
    const normalStep = 0.01;
    return {
      left: -normalStep,
      right: normalStep,
      up: normalStep,
      down: -normalStep,
      multiplier: 10,
      powerKey: "shiftKey"
    };
  },
  computed: {
    bgColorStyle() {
      return { background: `hsl(${this.value.hsv.h}, 100%, 50%)` };
    },
    pointerStyle() {
      return { top: `${-(this.value.hsv.v * 100) + 1 + 100}%`, left: `${this.value.hsv.s * 100}%` };
    }
  },
  methods: {
    change(h, s, v, a) {
      this.$emit("change", { h, s, v, a, source: "hsva" });
    },
    handleSlide(e, direction, key) {
      e.preventDefault();
      e.stopPropagation();
      const isPowerKey = e[this.powerKey];
      const increment = isPowerKey ? direction * this.multiplier : direction;
      const { h, s, v, a } = this.value.hsv;
      const saturation = clamp(s + getIncrement(key, ["left", "right"], increment), 0, 1);
      const bright = clamp(v + getIncrement(key, ["up", "down"], increment), 0, 1);
      this.change(h, saturation, bright, a);
    },
    handleChange(e) {
      e.preventDefault();
      e.stopPropagation();
      const { clientWidth, clientHeight } = this.$refs.container;
      const left = clamp(this.getLeft(e), 0, clientWidth);
      const top = clamp(this.getTop(e), 0, clientHeight);
      const saturation = left / clientWidth;
      const bright = clamp(1 - top / clientHeight, 0, 1);
      this.change(this.value.hsv.h, saturation, bright, this.value.hsv.a);
    },
    handleMouseDown(e) {
      HSAMixin.methods.handleMouseDown.call(this, e);
      on(window, "mouseup", this.handleChange);
    },
    unbindEventListeners(e) {
      HSAMixin.methods.unbindEventListeners.call(this, e);
      off(window, "mouseup", this.handleChange);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass([_ctx.prefixCls + "-saturation-wrapper"]),
    tabindex: "0",
    onKeydown: [
      _cache[1] || (_cache[1] = withKeys((...args) => _ctx.handleEscape && _ctx.handleEscape(...args), ["esc"])),
      _cache[3] || (_cache[3] = withKeys((...args) => _ctx.handleLeft && _ctx.handleLeft(...args), ["left"])),
      _cache[4] || (_cache[4] = withKeys((...args) => _ctx.handleRight && _ctx.handleRight(...args), ["right"])),
      _cache[5] || (_cache[5] = withKeys((...args) => _ctx.handleUp && _ctx.handleUp(...args), ["up"])),
      _cache[6] || (_cache[6] = withKeys((...args) => _ctx.handleDown && _ctx.handleDown(...args), ["down"]))
    ],
    onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$el.focus())
  }, [
    createElementVNode("div", {
      ref: "container",
      style: normalizeStyle($options.bgColorStyle),
      class: normalizeClass([_ctx.prefixCls + "-saturation"]),
      onMousedown: _cache[0] || (_cache[0] = (...args) => $options.handleMouseDown && $options.handleMouseDown(...args))
    }, [
      createElementVNode("div", {
        class: normalizeClass([_ctx.prefixCls + "-saturation--white"])
      }, null, 2),
      createElementVNode("div", {
        class: normalizeClass([_ctx.prefixCls + "-saturation--black"])
      }, null, 2),
      createElementVNode("div", {
        style: normalizeStyle($options.pointerStyle),
        class: normalizeClass([_ctx.prefixCls + "-saturation-pointer"])
      }, [
        createElementVNode("div", {
          class: normalizeClass([_ctx.prefixCls + "-saturation-circle"])
        }, null, 2)
      ], 6)
    ], 38)
  ], 34);
}
var Saturation = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Saturation as default };
