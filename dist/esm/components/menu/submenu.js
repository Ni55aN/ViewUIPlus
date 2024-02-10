import Drop from "../select/dropdown.js";
import Icon from "../icon/icon.js";
import CollapseTransition from "../base/collapse-transition.js";
import { getStyle, findComponentUpward } from "../../utils/assist.js";
import random from "../../utils/random_str.js";
import mixin from "./mixin.js";
import globalConfig from "../../mixins/globalConfig.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, withModifiers, normalizeStyle, renderSlot, createVNode, createBlock, withCtx, withDirectives, vShow, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-menu";
const _sfc_main = {
  name: "Submenu",
  mixins: [mixin, globalConfig],
  components: { Icon, Drop, CollapseTransition },
  provide() {
    return {
      SubmenuInstance: this
    };
  },
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
      prefixCls,
      active: false,
      opened: false,
      dropWidth: parseFloat(getStyle(this.$el, "width")),
      id: random(6),
      childSubmenuList: []
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}-submenu`,
        {
          [`${prefixCls}-item-active`]: this.active && !this.hasParentSubmenu,
          [`${prefixCls}-opened`]: this.opened,
          [`${prefixCls}-submenu-disabled`]: this.disabled,
          [`${prefixCls}-submenu-has-parent-submenu`]: this.hasParentSubmenu,
          [`${prefixCls}-child-item-active`]: this.active
        }
      ];
    },
    accordion() {
      return this.menu.accordion;
    },
    dropStyle() {
      let style = {};
      if (this.dropWidth)
        style.minWidth = `${this.dropWidth}px`;
      return style;
    },
    titleStyle() {
      return this.hasParentSubmenu && this.mode !== "horizontal" ? {
        paddingLeft: 43 + (this.parentSubmenuNum - 1) * 24 + "px"
      } : {};
    },
    arrowType() {
      const config = this.globalConfig;
      let type = "ios-arrow-down";
      if (config) {
        if (config.menu.customArrow) {
          type = "";
        } else if (config.menu.arrow) {
          type = config.menu.arrow;
        }
      }
      return type;
    },
    customArrowType() {
      const config = this.globalConfig;
      let type = "";
      if (config) {
        if (config.menu.customArrow) {
          type = config.menu.customArrow;
        }
      }
      return type;
    },
    arrowSize() {
      const config = this.globalConfig;
      let size = "";
      if (config) {
        if (config.menu.arrowSize) {
          size = config.menu.arrowSize;
        }
      }
      return size;
    }
  },
  methods: {
    handleMouseenter() {
      if (this.disabled)
        return;
      if (this.mode === "vertical")
        return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.menu.updateOpenKeys(this.name);
        this.opened = true;
      }, 250);
    },
    handleMouseleave() {
      if (this.disabled)
        return;
      if (this.mode === "vertical")
        return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.menu.updateOpenKeys(this.name);
        this.opened = false;
      }, 150);
    },
    handleClick() {
      if (this.disabled)
        return;
      if (this.mode === "horizontal")
        return;
      const opened = this.opened;
      this.opened = !opened;
      this.menu.updateOpenKeys(this.name);
    },
    addSubmenu() {
      const root = this.MenuInstance;
      if (!root.submenuList)
        root.submenuList = [];
      root.submenuList.push({
        id: this.id,
        submenu: this
      });
      const parentSubmenu = findComponentUpward(this, "Submenu");
      if (parentSubmenu) {
        if (!parentSubmenu.childSubmenuList)
          parentSubmenu.childSubmenuList = [];
        parentSubmenu.childSubmenuList.push({
          id: this.id,
          submenu: this
        });
      }
    },
    removeSubmenu() {
      const root = this.MenuInstance;
      if (root.submenuList && root.submenuList.length) {
        const index = root.submenuList.findIndex((item) => item.id === this.id);
        root.submenuList.splice(index, 1);
      }
      const parentSubmenu = findComponentUpward(this, "Submenu");
      if (parentSubmenu) {
        if (parentSubmenu.childSubmenuList && parentSubmenu.childSubmenuList.length) {
          const index = parentSubmenu.childSubmenuList.findIndex((item) => item.id === this.id);
          parentSubmenu.childSubmenuList.splice(index, 1);
        }
      }
    },
    handleMenuItemSelect(name) {
      if (this.mode === "horizontal")
        this.opened = false;
      this.MenuInstance.handleMenuItemSelect(name);
    },
    handleUpdateActiveName(status) {
      if (findComponentUpward(this, "Submenu"))
        this.SubmenuInstance.handleUpdateActiveName(status);
      if (this.childSubmenuList && this.childSubmenuList.length) {
        this.childSubmenuList.map((item) => item.submenu).forEach((item) => {
          item.active = false;
        });
      }
      this.active = status;
    }
  },
  watch: {
    mode(val) {
      if (val === "horizontal") {
        this.$refs.drop.update();
      }
    },
    opened(val) {
      if (this.mode === "vertical")
        return;
      if (val) {
        this.dropWidth = parseFloat(getStyle(this.$el, "width"));
        this.$refs.drop.update();
      } else {
        this.$refs.drop.destroy();
      }
    }
  },
  mounted() {
    this.addSubmenu();
  },
  beforeUnmount() {
    this.removeSubmenu();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_collapse_transition = resolveComponent("collapse-transition");
  const _component_Drop = resolveComponent("Drop");
  return openBlock(), createElementBlock("li", {
    class: normalizeClass($options.classes),
    onMouseenter: _cache[1] || (_cache[1] = (...args) => $options.handleMouseenter && $options.handleMouseenter(...args)),
    onMouseleave: _cache[2] || (_cache[2] = (...args) => $options.handleMouseleave && $options.handleMouseleave(...args))
  }, [
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-submenu-title"]),
      ref: "reference",
      onClick: _cache[0] || (_cache[0] = withModifiers((...args) => $options.handleClick && $options.handleClick(...args), ["stop"])),
      style: normalizeStyle($options.titleStyle)
    }, [
      renderSlot(_ctx.$slots, "title"),
      createVNode(_component_Icon, {
        type: $options.arrowType,
        custom: $options.customArrowType,
        size: $options.arrowSize,
        class: normalizeClass([$data.prefixCls + "-submenu-title-icon"])
      }, null, 8, ["type", "custom", "size", "class"])
    ], 6),
    _ctx.mode === "vertical" ? (openBlock(), createBlock(_component_collapse_transition, {
      key: 0,
      ready: _ctx.menu.ready
    }, {
      default: withCtx(() => [
        withDirectives(createElementVNode("ul", {
          class: normalizeClass([$data.prefixCls])
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 2), [
          [vShow, $data.opened]
        ])
      ]),
      _: 3
    }, 8, ["ready"])) : createCommentVNode("", true),
    _ctx.mode === "horizontal" ? (openBlock(), createBlock(_component_Drop, {
      key: 1,
      ref: "drop",
      visible: $data.opened,
      placement: "bottom",
      "transition-name": "slide-up",
      styles: $options.dropStyle
    }, {
      default: withCtx(() => [
        createElementVNode("ul", {
          class: normalizeClass([$data.prefixCls + "-drop-list"])
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 2)
      ]),
      _: 3
    }, 8, ["visible", "styles"])) : createCommentVNode("", true)
  ], 34);
}
var Submenu = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Submenu as default };
