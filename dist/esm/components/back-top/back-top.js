import { scrollTop } from "../../utils/assist.js";
import { on, off } from "../../utils/dom.js";
import { isClient } from "../../utils/index.js";
import { openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createElementVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-back-top";
const _sfc_main = {
  name: "BackTop",
  emits: ["on-click"],
  props: {
    height: {
      type: Number,
      default: 400
    },
    bottom: {
      type: Number,
      default: 30
    },
    right: {
      type: Number,
      default: 30
    },
    duration: {
      type: Number,
      default: 1e3
    }
  },
  data() {
    return {
      backTop: false
    };
  },
  mounted() {
    on(window, "scroll", this.handleScroll);
    on(window, "resize", this.handleScroll);
  },
  beforeUnmount() {
    off(window, "scroll", this.handleScroll);
    off(window, "resize", this.handleScroll);
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-show`]: this.backTop
        }
      ];
    },
    styles() {
      return {
        bottom: `${this.bottom}px`,
        right: `${this.right}px`
      };
    },
    innerClasses() {
      return `${prefixCls}-inner`;
    }
  },
  methods: {
    handleScroll() {
      if (!isClient)
        return;
      this.backTop = window.pageYOffset >= this.height;
    },
    back() {
      if (!isClient)
        return;
      const sTop = document.documentElement.scrollTop || document.body.scrollTop;
      scrollTop(window, sTop, 0, this.duration);
      this.$emit("on-click");
    }
  }
};
const _hoisted_1 = /* @__PURE__ */ createElementVNode("i", { class: "ivu-icon ivu-icon-ios-arrow-up" }, null, -1);
const _hoisted_2 = [
  _hoisted_1
];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes),
    style: normalizeStyle($options.styles),
    onClick: _cache[0] || (_cache[0] = (...args) => $options.back && $options.back(...args))
  }, [
    renderSlot(_ctx.$slots, "default", {}, () => [
      createElementVNode("div", {
        class: normalizeClass($options.innerClasses)
      }, _hoisted_2, 2)
    ])
  ], 6);
}
var BackTop = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { BackTop as default };
