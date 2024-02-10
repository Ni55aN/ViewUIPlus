import { openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-layout";
const _sfc_main = {
  name: "Layout",
  data() {
    return {
      hasSider: false
    };
  },
  computed: {
    wrapClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-has-sider`]: this.hasSider
        }
      ];
    }
  },
  methods: {
    findSider() {
      return this.$slots.default().some((child) => child.type.name === "Sider");
    }
  },
  mounted() {
    this.hasSider = this.findSider();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.wrapClasses)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var Layout = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Layout as default };
