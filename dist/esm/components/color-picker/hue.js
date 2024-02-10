import HSAMixin from "./hsaMixin.js";
import Prefixes from "./prefixMixin.js";
import { clamp } from "./utils.js";
import { openBlock, createElementBlock, normalizeClass, withKeys, createElementVNode, normalizeStyle } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Hue",
  mixins: [HSAMixin, Prefixes],
  emits: ["change"],
  data() {
    const normalStep = 1 / 360 * 25;
    const jumpStep = 20 * normalStep;
    return {
      left: -normalStep,
      right: normalStep,
      up: jumpStep,
      down: -jumpStep,
      powerKey: "shiftKey",
      percent: clamp(this.value.hsl.h * 100 / 360, 0, 100)
    };
  },
  watch: {
    value() {
      this.percent = clamp(this.value.hsl.h * 100 / 360, 0, 100);
    }
  },
  methods: {
    change(percent) {
      this.percent = clamp(percent, 0, 100);
      const { h, s, l, a } = this.value.hsl;
      const newHue = clamp(percent / 100 * 360, 0, 360);
      if (h !== newHue) {
        this.$emit("change", { h: newHue, s, l, a, source: "hsl" });
      }
    },
    handleSlide(e, direction) {
      e.preventDefault();
      e.stopPropagation();
      if (e[this.powerKey]) {
        this.change(direction < 0 ? 0 : 100);
        return;
      }
      this.change(this.percent + direction);
    },
    handleChange(e) {
      e.preventDefault();
      e.stopPropagation();
      const left = this.getLeft(e);
      if (left < 0) {
        this.change(0);
        return;
      }
      const { clientWidth } = this.$refs.container;
      if (left > clientWidth) {
        this.change(100);
        return;
      }
      this.change(left * 100 / clientWidth);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass([_ctx.prefixCls + "-hue"]),
    tabindex: "0",
    onClick: _cache[3] || (_cache[3] = ($event) => _ctx.$el.focus()),
    onKeydown: [
      _cache[4] || (_cache[4] = withKeys((...args) => _ctx.handleEscape && _ctx.handleEscape(...args), ["esc"])),
      _cache[5] || (_cache[5] = withKeys((...args) => _ctx.handleLeft && _ctx.handleLeft(...args), ["left"])),
      _cache[6] || (_cache[6] = withKeys((...args) => _ctx.handleRight && _ctx.handleRight(...args), ["right"])),
      _cache[7] || (_cache[7] = withKeys((...args) => _ctx.handleUp && _ctx.handleUp(...args), ["up"])),
      _cache[8] || (_cache[8] = withKeys((...args) => _ctx.handleDown && _ctx.handleDown(...args), ["down"]))
    ]
  }, [
    createElementVNode("div", {
      ref: "container",
      class: normalizeClass([_ctx.prefixCls + "-hue-container"]),
      onMousedown: _cache[0] || (_cache[0] = (...args) => _ctx.handleMouseDown && _ctx.handleMouseDown(...args)),
      onTouchmove: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args)),
      onTouchstart: _cache[2] || (_cache[2] = (...args) => $options.handleChange && $options.handleChange(...args))
    }, [
      createElementVNode("div", {
        style: normalizeStyle({ top: 0, left: `${$data.percent}%` }),
        class: normalizeClass([_ctx.prefixCls + "-hue-pointer"])
      }, [
        createElementVNode("div", {
          class: normalizeClass([_ctx.prefixCls + "-hue-picker"])
        }, null, 2)
      ], 6)
    ], 34)
  ], 34);
}
var Hue = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Hue as default };
