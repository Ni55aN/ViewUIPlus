import { on, off } from "../../utils/dom.js";
import { setMatchMedia, oneOf, dimensionMap } from "../../utils/assist.js";
import { isClient } from "../../utils/index.js";
import { openBlock, createElementBlock, normalizeClass, normalizeStyle, withDirectives, createElementVNode, vShow, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-layout-sider";
setMatchMedia();
const _sfc_main = {
  name: "Sider",
  emits: ["on-collapse", "update:modelValue"],
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    width: {
      type: [Number, String],
      default: 200
    },
    collapsedWidth: {
      type: [Number, String],
      default: 64
    },
    hideTrigger: {
      type: Boolean,
      default: false
    },
    breakpoint: {
      type: String,
      validator(val) {
        return oneOf(val, ["xs", "sm", "md", "lg", "xl", "xxl"]);
      }
    },
    collapsible: {
      type: Boolean,
      default: false
    },
    defaultCollapsed: {
      type: Boolean,
      default: false
    },
    reverseArrow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls,
      mediaMatched: false
    };
  },
  computed: {
    wrapClasses() {
      return [
        `${prefixCls}`,
        this.siderWidth ? "" : `${prefixCls}-zero-width`,
        this.modelValue ? `${prefixCls}-collapsed` : ""
      ];
    },
    wrapStyles() {
      return {
        width: `${this.siderWidth}px`,
        minWidth: `${this.siderWidth}px`,
        maxWidth: `${this.siderWidth}px`,
        flex: `0 0 ${this.siderWidth}px`
      };
    },
    triggerClasses() {
      return [
        `${prefixCls}-trigger`,
        this.modelValue ? `${prefixCls}-trigger-collapsed` : ""
      ];
    },
    childClasses() {
      return `${this.prefixCls}-children`;
    },
    zeroWidthTriggerClasses() {
      return [
        `${prefixCls}-zero-width-trigger`,
        this.reverseArrow ? `${prefixCls}-zero-width-trigger-left` : ""
      ];
    },
    triggerIconClasses() {
      return [
        "ivu-icon",
        `ivu-icon-ios-arrow-${this.reverseArrow ? "forward" : "back"}`,
        `${prefixCls}-trigger-icon`
      ];
    },
    siderWidth() {
      return this.collapsible ? this.modelValue ? this.mediaMatched ? 0 : parseInt(this.collapsedWidth) : parseInt(this.width) : this.width;
    },
    showZeroTrigger() {
      return this.collapsible ? this.mediaMatched && !this.hideTrigger || parseInt(this.collapsedWidth) === 0 && this.modelValue && !this.hideTrigger : false;
    },
    showBottomTrigger() {
      return this.collapsible ? !this.mediaMatched && !this.hideTrigger : false;
    }
  },
  methods: {
    toggleCollapse() {
      let modelValue = this.collapsible ? !this.modelValue : false;
      this.$emit("update:modelValue", modelValue);
    },
    matchMedia() {
      if (!isClient)
        return;
      let matchMedia;
      if (window.matchMedia) {
        matchMedia = window.matchMedia;
      }
      let mediaMatched = this.mediaMatched;
      this.mediaMatched = matchMedia(`(max-width: ${dimensionMap[this.breakpoint]})`).matches;
      if (this.mediaMatched !== mediaMatched) {
        this.$emit("update:modelValue", this.mediaMatched);
      }
    },
    onWindowResize() {
      this.matchMedia();
    }
  },
  watch: {
    modelValue(state) {
      this.$emit("on-collapse", state);
    }
  },
  mounted() {
    if (this.defaultCollapsed) {
      this.$emit("update:modelValue", this.defaultCollapsed);
    }
    if (this.breakpoint !== void 0) {
      on(window, "resize", this.onWindowResize);
      this.matchMedia();
    }
  },
  beforeUnmount() {
    if (this.breakpoint !== void 0) {
      off(window, "resize", this.onWindowResize);
    }
  }
};
const _hoisted_1 = /* @__PURE__ */ createElementVNode("i", { class: "ivu-icon ivu-icon-ios-menu" }, null, -1);
const _hoisted_2 = [
  _hoisted_1
];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.wrapClasses),
    style: normalizeStyle($options.wrapStyles)
  }, [
    withDirectives(createElementVNode("span", {
      onClick: _cache[0] || (_cache[0] = (...args) => $options.toggleCollapse && $options.toggleCollapse(...args)),
      class: normalizeClass($options.zeroWidthTriggerClasses)
    }, _hoisted_2, 2), [
      [vShow, $options.showZeroTrigger]
    ]),
    createElementVNode("div", {
      class: normalizeClass($options.childClasses)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2),
    renderSlot(_ctx.$slots, "trigger", {}, () => [
      withDirectives(createElementVNode("div", {
        class: normalizeClass($options.triggerClasses),
        onClick: _cache[1] || (_cache[1] = (...args) => $options.toggleCollapse && $options.toggleCollapse(...args)),
        style: normalizeStyle({ width: $options.siderWidth + "px" })
      }, [
        createElementVNode("i", {
          class: normalizeClass($options.triggerIconClasses)
        }, null, 2)
      ], 6), [
        [vShow, $options.showBottomTrigger]
      ])
    ])
  ], 6);
}
var Sider = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Sider as default };
