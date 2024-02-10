import { oneOf } from "../../utils/assist.js";
import { openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-row";
const _sfc_main = {
  name: "Row",
  provide() {
    return {
      RowInstance: this
    };
  },
  props: {
    type: {
      validator(value) {
        return oneOf(value, ["flex"]);
      }
    },
    align: {
      validator(value) {
        return oneOf(value, ["top", "middle", "bottom"]);
      }
    },
    justify: {
      validator(value) {
        return oneOf(value, ["start", "end", "center", "space-around", "space-between"]);
      }
    },
    gutter: {
      type: Number,
      default: 0
    },
    className: String,
    wrap: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.type}`]: !!this.type,
          [`${prefixCls}-${this.type}-${this.align}`]: !!this.align && this.type,
          [`${prefixCls}-${this.type}-${this.justify}`]: !!this.justify && this.type,
          [`${prefixCls}-${this.align}`]: !!this.align,
          [`${prefixCls}-${this.justify}`]: !!this.justify,
          [`${this.className}`]: !!this.className,
          [`${prefixCls}-no-wrap`]: !this.wrap
        }
      ];
    },
    styles() {
      let style = {};
      if (this.gutter !== 0) {
        style = {
          marginLeft: this.gutter / -2 + "px",
          marginRight: this.gutter / -2 + "px"
        };
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
var Row = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Row as default };
