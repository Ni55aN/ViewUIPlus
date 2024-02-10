import Icon from "../icon/icon.js";
import globalConfig from "../../mixins/globalConfig.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, createTextVNode, toDisplayString, createBlock, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Casitem",
  components: { Icon },
  mixins: [globalConfig],
  props: {
    data: Object,
    prefixCls: String,
    tmpItem: Object
  },
  computed: {
    classes() {
      return [
        `${this.prefixCls}-menu-item`,
        {
          [`${this.prefixCls}-menu-item-active`]: this.tmpItem.value === this.data.value,
          [`${this.prefixCls}-menu-item-disabled`]: this.data.disabled
        }
      ];
    },
    showArrow() {
      return this.data.children && this.data.children.length || "loading" in this.data && !this.data.loading;
    },
    showLoading() {
      return "loading" in this.data && this.data.loading;
    },
    arrowType() {
      const config = this.globalConfig;
      let type = "ios-arrow-forward";
      if (config) {
        if (config.cascader.customItemArrow) {
          type = "";
        } else if (config.cascader.itemArrow) {
          type = config.cascader.itemArrow;
        }
      }
      return type;
    },
    customArrowType() {
      const config = this.globalConfig;
      let type = "";
      if (config) {
        if (config.cascader.customItemArrow) {
          type = config.cascader.customItemArrow;
        }
      }
      return type;
    },
    arrowSize() {
      const config = this.globalConfig;
      let size = "";
      if (config) {
        if (config.cascader.itemArrowSize) {
          size = config.cascader.itemArrowSize;
        }
      }
      return size;
    }
  }
};
const _hoisted_1 = {
  key: 1,
  class: "ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-cascader-menu-item-loading"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createElementBlock("li", {
    class: normalizeClass($options.classes)
  }, [
    createTextVNode(toDisplayString($props.data.label) + " ", 1),
    $options.showArrow ? (openBlock(), createBlock(_component_Icon, {
      key: 0,
      type: $options.arrowType,
      custom: $options.customArrowType,
      size: $options.arrowSize
    }, null, 8, ["type", "custom", "size"])) : createCommentVNode("", true),
    $options.showLoading ? (openBlock(), createElementBlock("i", _hoisted_1)) : createCommentVNode("", true)
  ], 2);
}
var Casitem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Casitem as default };
