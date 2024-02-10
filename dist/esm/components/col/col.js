import { openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-col";
function parseFlex(flex) {
  if (typeof flex === "number") {
    return `${flex} ${flex} auto`;
  }
  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
    return `0 0 ${flex}`;
  }
  return flex;
}
const _sfc_main = {
  name: "iCol",
  inject: ["RowInstance"],
  props: {
    span: [Number, String],
    order: [Number, String],
    offset: [Number, String],
    push: [Number, String],
    pull: [Number, String],
    className: String,
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object],
    xxl: [Number, Object],
    flex: {
      type: [Number, String],
      default: ""
    }
  },
  computed: {
    gutter() {
      return this.RowInstance.gutter;
    },
    classes() {
      let classList = [
        `${prefixCls}`,
        {
          [`${prefixCls}-span-${this.span}`]: this.span,
          [`${prefixCls}-order-${this.order}`]: this.order,
          [`${prefixCls}-offset-${this.offset}`]: this.offset,
          [`${prefixCls}-push-${this.push}`]: this.push,
          [`${prefixCls}-pull-${this.pull}`]: this.pull,
          [`${this.className}`]: !!this.className
        }
      ];
      ["xs", "sm", "md", "lg", "xl", "xxl"].forEach((size) => {
        if (typeof this[size] === "number") {
          classList.push(`${prefixCls}-span-${size}-${this[size]}`);
        } else if (typeof this[size] === "object") {
          let props = this[size];
          Object.keys(props).forEach((prop) => {
            classList.push(
              prop !== "span" ? `${prefixCls}-${size}-${prop}-${props[prop]}` : `${prefixCls}-span-${size}-${props[prop]}`
            );
          });
        }
      });
      return classList;
    },
    styles() {
      let style = {};
      if (this.gutter !== 0) {
        style = {
          paddingLeft: this.gutter / 2 + "px",
          paddingRight: this.gutter / 2 + "px"
        };
      }
      if (this.flex) {
        style.flex = parseFlex(this.flex);
      }
      return style;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes),
    style: normalizeStyle($options.styles)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 6);
}
var Col = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Col as default };
