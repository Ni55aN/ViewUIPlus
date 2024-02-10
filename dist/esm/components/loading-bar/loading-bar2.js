import { openBlock, createBlock, Transition, withCtx, withDirectives, createElementVNode, normalizeClass, normalizeStyle, vShow } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-loading-bar";
const _sfc_main = {
  name: "LoadingBar",
  props: {
    color: {
      type: String,
      default: "primary"
    },
    failedColor: {
      type: String,
      default: "error"
    },
    height: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      percent: 0,
      status: "success",
      show: false
    };
  },
  computed: {
    classes() {
      return `${prefixCls}`;
    },
    innerClasses() {
      return [
        `${prefixCls}-inner`,
        {
          [`${prefixCls}-inner-color-primary`]: this.color === "primary" && this.status === "success",
          [`${prefixCls}-inner-failed-color-error`]: this.failedColor === "error" && this.status === "error"
        }
      ];
    },
    outerStyles() {
      return {
        height: `${this.height}px`
      };
    },
    styles() {
      let style = {
        width: `${this.percent}%`,
        height: `${this.height}px`
      };
      if (this.color !== "primary" && this.status === "success") {
        style.backgroundColor = this.color;
      }
      if (this.failedColor !== "error" && this.status === "error") {
        style.backgroundColor = this.failedColor;
      }
      return style;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, { name: "fade" }, {
    default: withCtx(() => [
      withDirectives(createElementVNode("div", {
        class: normalizeClass($options.classes),
        style: normalizeStyle($options.outerStyles)
      }, [
        createElementVNode("div", {
          class: normalizeClass($options.innerClasses),
          style: normalizeStyle($options.styles)
        }, null, 6)
      ], 6), [
        [vShow, $data.show]
      ])
    ]),
    _: 1
  });
}
var LoadingBar = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { LoadingBar as default };
