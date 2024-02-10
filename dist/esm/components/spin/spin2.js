import { getCurrentInstance, openBlock, createBlock, Transition, withCtx, createElementBlock, normalizeClass, createElementVNode, renderSlot, createCommentVNode } from "vue";
import { oneOf } from "../../utils/assist.js";
import ScrollbarMixins from "../modal/mixins-scrollbar.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-spin";
const _sfc_main = {
  name: "Spin",
  mixins: [ScrollbarMixins],
  props: {
    size: {
      validator(value) {
        return oneOf(value, ["small", "large", "default"]);
      },
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.size === "" ? "default" : global.$VIEWUI.size;
      }
    },
    fix: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showText: false,
      visible: false
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-fix`]: this.fix,
          [`${prefixCls}-show-text`]: this.showText,
          [`${prefixCls}-fullscreen`]: this.fullscreen
        }
      ];
    },
    mainClasses() {
      return `${prefixCls}-main`;
    },
    dotClasses() {
      return `${prefixCls}-dot`;
    },
    textClasses() {
      return `${prefixCls}-text`;
    },
    fullscreenVisible() {
      if (this.fullscreen) {
        return this.visible;
      } else {
        return true;
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.addScrollEffect();
      } else {
        this.removeScrollEffect();
      }
    }
  },
  mounted() {
    this.showText = !!this.$slots.default && this.$slots.default().some((item) => item.children && item.children.length);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, { name: "fade" }, {
    default: withCtx(() => [
      $options.fullscreenVisible && $props.show ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass($options.classes)
      }, [
        createElementVNode("div", {
          class: normalizeClass($options.mainClasses)
        }, [
          createElementVNode("span", {
            class: normalizeClass($options.dotClasses)
          }, null, 2),
          createElementVNode("div", {
            class: normalizeClass($options.textClasses)
          }, [
            renderSlot(_ctx.$slots, "default")
          ], 2)
        ], 2)
      ], 2)) : createCommentVNode("", true)
    ]),
    _: 3
  });
}
var Spin = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Spin as default };
