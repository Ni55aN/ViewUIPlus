import mixin from "./mixin.js";
import { openBlock, createElementBlock, normalizeClass, createElementVNode, normalizeStyle, toDisplayString, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-menu";
const _sfc_main = {
  name: "MenuGroup",
  mixins: [mixin],
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      prefixCls
    };
  },
  computed: {
    groupStyle() {
      return this.hasParentSubmenu && this.mode !== "horizontal" ? {
        paddingLeft: 43 + (this.parentSubmenuNum - 1) * 28 + "px"
      } : {};
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("li", {
    class: normalizeClass([$data.prefixCls + "-item-group"])
  }, [
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-item-group-title"]),
      style: normalizeStyle($options.groupStyle)
    }, toDisplayString($props.title), 7),
    createElementVNode("ul", null, [
      renderSlot(_ctx.$slots, "default")
    ])
  ], 2);
}
var MenuGroup = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { MenuGroup as default };
