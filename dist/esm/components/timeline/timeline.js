import { openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-timeline";
const _sfc_main = {
  name: "Timeline",
  props: {
    pending: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-pending`]: this.pending
        }
      ];
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("ul", {
    class: normalizeClass($options.classes)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var Timeline = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Timeline as default };
