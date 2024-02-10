import { withDirectives, openBlock, createElementBlock, normalizeClass, createElementVNode, toDisplayString, renderSlot, vShow } from "vue";
import random from "../../utils/random_str.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-select-group";
const _sfc_main = {
  name: "OptionGroup",
  props: {
    label: {
      type: String,
      default: ""
    }
  },
  provide() {
    return {
      OptionGroupInstance: this
    };
  },
  inject: ["SelectInstance"],
  data() {
    return {
      prefixCls,
      hidden: false,
      id: random(6),
      optionList: []
    };
  },
  computed: {
    show() {
      return this.optionList.find((item) => item.proxy && item.proxy.isShow);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return withDirectives((openBlock(), createElementBlock("li", {
    class: normalizeClass([$data.prefixCls + "-wrap"])
  }, [
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-title"])
    }, toDisplayString($props.label), 3),
    createElementVNode("ul", null, [
      createElementVNode("li", {
        class: normalizeClass([$data.prefixCls]),
        ref: "options"
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2)
    ])
  ], 2)), [
    [vShow, $options.show]
  ]);
}
var OptionGroup = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { OptionGroup as default };
