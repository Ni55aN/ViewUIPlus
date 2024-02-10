import { findComponentUpward } from "../../utils/assist.js";
import { openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-dropdown-item";
const _sfc_main = {
  name: "DropdownItem",
  props: {
    name: {
      type: [String, Number]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    divided: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-selected`]: this.selected,
          [`${prefixCls}-divided`]: this.divided
        }
      ];
    }
  },
  methods: {
    handleClick() {
      if (this.disabled)
        return;
      const $parent = findComponentUpward(this, "Dropdown");
      const hasChildren = this.$parent && this.$parent.$options.name === "Dropdown";
      if (hasChildren) {
        this.$parent.handleHaschildClick();
      } else {
        if ($parent && $parent.$options.name === "Dropdown") {
          $parent.handleHoverClick();
        }
      }
      $parent.handleItemClick(this.name);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("li", {
    class: normalizeClass($options.classes),
    onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClick && $options.handleClick(...args))
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var DropdownItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { DropdownItem as default };
