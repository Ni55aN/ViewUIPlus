import HSAMixin from "./hsaMixin.js";
import Prefixes from "./prefixMixin.js";
import { clamp, toRGBAString } from "./utils.js";
import { openBlock, createElementBlock, normalizeClass, withKeys, createElementVNode, normalizeStyle } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Alpha",
  mixins: [HSAMixin, Prefixes],
  emits: ["change"],
  data() {
    const normalStep = 1;
    const jumpStep = 10;
    return {
      left: -normalStep,
      right: normalStep,
      up: jumpStep,
      down: -jumpStep,
      powerKey: "shiftKey"
    };
  },
  computed: {
    gradientStyle() {
      const { r, g, b } = this.value.rgba;
      const start = toRGBAString({ r, g, b, a: 0 });
      const finish = toRGBAString({ r, g, b, a: 1 });
      return { background: `linear-gradient(to right, ${start} 0%, ${finish} 100%)` };
    }
  },
  methods: {
    change(newAlpha) {
      const { h, s, l } = this.value.hsl;
      const { a } = this.value;
      if (a !== newAlpha) {
        this.$emit("change", { h, s, l, a: newAlpha, source: "rgba" });
      }
    },
    handleSlide(e, direction) {
      e.preventDefault();
      e.stopPropagation();
      this.change(clamp(e[this.powerKey] ? direction : Math.round(this.value.hsl.a * 100 + direction) / 100, 0, 1));
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
        this.change(1);
        return;
      }
      this.change(Math.round(left * 100 / clientWidth) / 100);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass([_ctx.prefixCls + "-alpha"]),
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
      class: normalizeClass([_ctx.prefixCls + "-alpha-checkboard-wrap"])
    }, [
      createElementVNode("div", {
        class: normalizeClass([_ctx.prefixCls + "-alpha-checkerboard"])
      }, null, 2)
    ], 2),
    createElementVNode("div", {
      style: normalizeStyle($options.gradientStyle),
      class: normalizeClass([_ctx.prefixCls + "-alpha-gradient"])
    }, null, 6),
    createElementVNode("div", {
      ref: "container",
      class: normalizeClass([_ctx.prefixCls + "-alpha-container"]),
      onMousedown: _cache[0] || (_cache[0] = (...args) => _ctx.handleMouseDown && _ctx.handleMouseDown(...args)),
      onTouchmove: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args)),
      onTouchstart: _cache[2] || (_cache[2] = (...args) => $options.handleChange && $options.handleChange(...args))
    }, [
      createElementVNode("div", {
        style: normalizeStyle({ top: 0, left: `${_ctx.value.a * 100}%` }),
        class: normalizeClass([_ctx.prefixCls + "-alpha-pointer"])
      }, [
        createElementVNode("div", {
          class: normalizeClass([_ctx.prefixCls + "-alpha-picker"])
        }, null, 2)
      ], 6)
    ], 34)
  ], 34);
}
var Alpha = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Alpha as default };
