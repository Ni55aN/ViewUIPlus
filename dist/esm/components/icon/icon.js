import { openBlock, createElementBlock, normalizeClass, normalizeStyle } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-icon";
const _sfc_main = {
  name: "Icon",
  props: {
    type: {
      type: String,
      default: ""
    },
    size: [Number, String],
    color: String,
    custom: {
      type: String,
      default: ""
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.type}`]: this.type !== "",
          [`${this.custom}`]: this.custom !== ""
        }
      ];
    },
    styles() {
      let style = {};
      if (this.size)
        style["font-size"] = `${this.size}px`;
      if (this.color)
        style.color = this.color;
      return style;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("i", {
    class: normalizeClass($options.classes),
    style: normalizeStyle($options.styles)
  }, null, 6);
}
var Icon = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Icon as default };
