import { getCurrentInstance, nextTick, resolveComponent, resolveDirective, withDirectives, openBlock, createElementBlock, normalizeClass, createElementVNode, withModifiers, renderSlot, createVNode, withCtx } from "vue";
import Drop from "../select/dropdown.js";
import clickOutside from "../../directives/clickoutside.js";
import { oneOf, findComponentUpward } from "../../utils/assist.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-dropdown";
const _sfc_main = {
  name: "Dropdown",
  directives: { clickOutside },
  components: { Drop },
  emits: ["on-visible-change", "on-clickoutside", "on-click", "on-hover-click", "on-haschild-click"],
  props: {
    trigger: {
      validator(value) {
        return oneOf(value, ["click", "hover", "custom", "contextMenu"]);
      },
      default: "hover"
    },
    placement: {
      validator(value) {
        return oneOf(value, ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]);
      },
      default: "bottom"
    },
    visible: {
      type: Boolean,
      default: false
    },
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? false : global.$VIEWUI.transfer;
      }
    },
    transferClassName: {
      type: String
    },
    stopPropagation: {
      type: Boolean,
      default: false
    },
    capture: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI ? true : global.$VIEWUI.capture;
      }
    },
    eventsEnabled: {
      type: Boolean,
      default: false
    },
    boundariesElement: {
      default: "window"
    }
  },
  computed: {
    transition() {
      return ["bottom-start", "bottom", "bottom-end"].indexOf(this.placement) > -1 ? "slide-up" : "fade";
    },
    dropdownCls() {
      return {
        [prefixCls + "-transfer"]: this.transfer,
        [this.transferClassName]: this.transferClassName
      };
    },
    relClasses() {
      return [
        `${prefixCls}-rel`,
        {
          [`${prefixCls}-rel-user-select-none`]: this.trigger === "contextMenu"
        }
      ];
    }
  },
  data() {
    return {
      prefixCls,
      currentVisible: this.visible,
      timeout: null
    };
  },
  watch: {
    visible(val) {
      this.currentVisible = val;
    },
    currentVisible(val) {
      if (val) {
        this.$refs.drop.update();
      } else {
        this.$refs.drop.destroy();
      }
      this.$emit("on-visible-change", val);
    }
  },
  methods: {
    handleClick() {
      if (this.trigger === "custom")
        return false;
      if (this.trigger !== "click") {
        return false;
      }
      const $parent = this.hasParent();
      if (!$parent)
        this.currentVisible = !this.currentVisible;
    },
    handleRightClick() {
      if (this.trigger === "custom")
        return false;
      if (this.trigger !== "contextMenu") {
        return false;
      }
      this.currentVisible = !this.currentVisible;
    },
    handleMouseenter() {
      if (this.trigger === "custom")
        return false;
      if (this.trigger !== "hover") {
        return false;
      }
      if (this.timeout)
        clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.currentVisible = true;
      }, 250);
    },
    handleMouseleave() {
      if (this.trigger === "custom")
        return false;
      if (this.trigger !== "hover") {
        return false;
      }
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.currentVisible = false;
        }, 150);
      }
    },
    onClickoutside(e) {
      this.handleClose();
      this.handleRightClose();
      if (this.currentVisible)
        this.$emit("on-clickoutside", e);
    },
    handleClose() {
      if (this.trigger === "custom")
        return false;
      if (this.trigger !== "click") {
        return false;
      }
      this.currentVisible = false;
    },
    handleRightClose() {
      if (this.trigger === "custom")
        return false;
      if (this.trigger !== "contextMenu") {
        return false;
      }
      this.currentVisible = false;
    },
    hasParent() {
      const $parent = findComponentUpward(this, "Dropdown");
      if ($parent) {
        return $parent;
      } else {
        return false;
      }
    },
    handleHaschildClick() {
      nextTick(() => {
        if (this.trigger === "custom")
          return false;
        this.currentVisible = true;
      });
      const $parent = this.hasParent();
      if ($parent)
        $parent.handleHaschildClick();
    },
    handleItemClick(key) {
      if (this.stopPropagation)
        return;
      const $parent = this.hasParent();
      if ($parent)
        $parent.handleItemClick(key);
      else
        this.$emit("on-click", key);
    },
    handleHoverClick() {
      const $parent = this.hasParent();
      if ($parent) {
        nextTick(() => {
          if (this.trigger === "custom")
            return false;
          this.currentVisible = false;
        });
        $parent.handleHoverClick();
      } else {
        nextTick(() => {
          if (this.trigger === "custom")
            return false;
          this.currentVisible = false;
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Drop = resolveComponent("Drop");
  const _directive_click_outside = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("div", {
    class: normalizeClass([$data.prefixCls]),
    onMouseenter: _cache[2] || (_cache[2] = (...args) => $options.handleMouseenter && $options.handleMouseenter(...args)),
    onMouseleave: _cache[3] || (_cache[3] = (...args) => $options.handleMouseleave && $options.handleMouseleave(...args))
  }, [
    createElementVNode("div", {
      class: normalizeClass($options.relClasses),
      ref: "reference",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClick && $options.handleClick(...args)),
      onContextmenu: _cache[1] || (_cache[1] = withModifiers((...args) => $options.handleRightClick && $options.handleRightClick(...args), ["prevent"]))
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 34),
    createVNode(_component_Drop, {
      ref: "drop",
      visible: $data.currentVisible,
      classes: $options.dropdownCls,
      placement: $props.placement,
      eventsEnabled: $props.eventsEnabled,
      boundariesElement: $props.boundariesElement,
      transfer: $props.transfer,
      "transition-name": "transition-drop",
      onMouseenter: $options.handleMouseenter,
      onMouseleave: $options.handleMouseleave
    }, {
      default: withCtx(() => [
        renderSlot(_ctx.$slots, "list")
      ]),
      _: 3
    }, 8, ["visible", "classes", "placement", "eventsEnabled", "boundariesElement", "transfer", "onMouseenter", "onMouseleave"])
  ], 34)), [
    [_directive_click_outside, $options.onClickoutside]
  ]);
}
var Dropdown = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Dropdown as default };
