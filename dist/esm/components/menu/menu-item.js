import { findComponentUpward } from "../../utils/assist.js";
import random from "../../utils/random_str.js";
import mixin from "./mixin.js";
import mixinsLink from "../../mixins/link.js";
import { openBlock, createElementBlock, normalizeClass, withModifiers, normalizeStyle, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-menu";
const _sfc_main = {
  name: "MenuItem",
  mixins: [mixin, mixinsLink],
  props: {
    name: {
      type: [String, Number],
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: false,
      id: random(6)
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}-item`,
        {
          [`${prefixCls}-item-active`]: this.active,
          [`${prefixCls}-item-selected`]: this.active,
          [`${prefixCls}-item-disabled`]: this.disabled
        }
      ];
    },
    itemStyle() {
      return this.hasParentSubmenu && this.mode !== "horizontal" ? {
        paddingLeft: 43 + (this.parentSubmenuNum - 1) * 24 + "px"
      } : {};
    }
  },
  methods: {
    handleClickItem(event, new_window = false) {
      if (this.disabled)
        return;
      if (new_window || this.target === "_blank") {
        this.handleCheckClick(event, new_window);
        let parentMenu = findComponentUpward(this, "Menu");
        if (parentMenu)
          parentMenu.handleEmitSelectEvent(this.name);
      } else {
        let parent = findComponentUpward(this, "Submenu");
        if (parent) {
          this.SubmenuInstance.handleMenuItemSelect(this.name);
        } else {
          this.MenuInstance.handleMenuItemSelect(this.name);
        }
        this.handleCheckClick(event, new_window);
      }
    },
    handleUpdateActiveName(name) {
      if (this.name === name) {
        this.active = true;
        if (this.SubmenuInstance)
          this.SubmenuInstance.handleUpdateActiveName(name);
      } else {
        this.active = false;
      }
    },
    addMenuItem() {
      const root = this.MenuInstance;
      if (!root.menuItemList)
        root.menuItemList = [];
      root.menuItemList.push({
        id: this.id,
        menuitem: this
      });
    },
    removeMenuItem() {
      const root = this.MenuInstance;
      if (root.menuItemList && root.menuItemList.length) {
        const index = root.menuItemList.findIndex((item) => item.id === this.id);
        root.menuItemList.splice(index, 1);
      }
    }
  },
  mounted() {
    this.addMenuItem();
  },
  beforeUnmount() {
    this.removeMenuItem();
  }
};
const _hoisted_1 = ["href", "target"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.to ? (openBlock(), createElementBlock("a", {
    key: 0,
    href: _ctx.linkUrl,
    target: _ctx.target,
    class: normalizeClass($options.classes),
    onClick: [
      _cache[0] || (_cache[0] = withModifiers(($event) => $options.handleClickItem($event, false), ["exact"])),
      _cache[1] || (_cache[1] = withModifiers(($event) => $options.handleClickItem($event, true), ["ctrl"])),
      _cache[2] || (_cache[2] = withModifiers(($event) => $options.handleClickItem($event, true), ["meta"]))
    ],
    style: normalizeStyle($options.itemStyle)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 14, _hoisted_1)) : (openBlock(), createElementBlock("li", {
    key: 1,
    class: normalizeClass($options.classes),
    onClick: _cache[3] || (_cache[3] = withModifiers((...args) => $options.handleClickItem && $options.handleClickItem(...args), ["stop"])),
    style: normalizeStyle($options.itemStyle)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 6));
}
var MenuItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { MenuItem as default };
