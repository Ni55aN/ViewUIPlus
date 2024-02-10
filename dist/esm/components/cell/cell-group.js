import { openBlock, createElementBlock, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "CellGroup",
  emits: ["on-click"],
  provide() {
    return {
      CellGroupInstance: this
    };
  },
  methods: {
    handleClick(name) {
      this.$emit("on-click", name);
    }
  }
};
const _hoisted_1 = { class: "ivu-cell-group" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    renderSlot(_ctx.$slots, "default")
  ]);
}
var CellGroup = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CellGroup as default };
