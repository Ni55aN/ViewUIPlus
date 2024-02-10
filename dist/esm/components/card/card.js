import Icon from "../icon/icon.js";
import mixinsLink from "../../mixins/link.js";
import { resolveComponent, openBlock, createBlock, resolveDynamicComponent, mergeProps, withCtx, createElementBlock, normalizeClass, renderSlot, createCommentVNode, createElementVNode, toDisplayString, normalizeStyle } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-card";
const defaultPadding = 16;
const _sfc_main = {
  name: "Card",
  mixins: [mixinsLink],
  components: { Icon },
  props: {
    bordered: {
      type: Boolean,
      default: true
    },
    disHover: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: Boolean,
      default: false
    },
    padding: {
      type: Number,
      default: defaultPadding
    },
    title: {
      type: String
    },
    icon: {
      type: String
    }
  },
  data() {
    return {
      showHead: true,
      showExtra: true
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-bordered`]: this.bordered && !this.shadow,
          [`${prefixCls}-dis-hover`]: this.disHover || this.shadow,
          [`${prefixCls}-shadow`]: this.shadow
        }
      ];
    },
    headClasses() {
      return `${prefixCls}-head`;
    },
    extraClasses() {
      return `${prefixCls}-extra`;
    },
    bodyClasses() {
      return `${prefixCls}-body`;
    },
    bodyStyles() {
      if (this.padding !== defaultPadding) {
        return {
          padding: `${this.padding}px`
        };
      } else {
        return "";
      }
    },
    isHrefPattern() {
      const { to } = this;
      return !!to;
    },
    tagName() {
      const { isHrefPattern } = this;
      return isHrefPattern ? "a" : "div";
    },
    tagProps() {
      const { isHrefPattern } = this;
      if (isHrefPattern) {
        const { linkUrl, target } = this;
        return { href: linkUrl, target };
      } else {
        return {};
      }
    }
  },
  methods: {
    handleClickLink(event) {
      if (!this.isHrefPattern)
        return;
      const openInNewWindow = event.ctrlKey || event.metaKey;
      this.handleCheckClick(event, openInNewWindow);
    }
  },
  mounted() {
    this.showHead = this.title || this.$slots.title !== void 0;
    this.showExtra = this.$slots.extra !== void 0;
  }
};
const _hoisted_1 = { key: 0 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createBlock(resolveDynamicComponent($options.tagName), mergeProps({ class: $options.classes }, $options.tagProps, { onClick: $options.handleClickLink }), {
    default: withCtx(() => [
      $data.showHead ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass($options.headClasses)
      }, [
        renderSlot(_ctx.$slots, "title", {}, () => [
          $props.title ? (openBlock(), createElementBlock("p", _hoisted_1, [
            $props.icon ? (openBlock(), createBlock(_component_Icon, {
              key: 0,
              type: $props.icon
            }, null, 8, ["type"])) : createCommentVNode("", true),
            createElementVNode("span", null, toDisplayString($props.title), 1)
          ])) : createCommentVNode("", true)
        ])
      ], 2)) : createCommentVNode("", true),
      $data.showExtra ? (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass($options.extraClasses)
      }, [
        renderSlot(_ctx.$slots, "extra")
      ], 2)) : createCommentVNode("", true),
      createElementVNode("div", {
        class: normalizeClass($options.bodyClasses),
        style: normalizeStyle($options.bodyStyles)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 6)
    ]),
    _: 3
  }, 16, ["class", "onClick"]);
}
var Card = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Card as default };
