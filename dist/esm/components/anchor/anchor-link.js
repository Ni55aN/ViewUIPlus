import { inject, nextTick, openBlock, createElementBlock, normalizeClass, createElementVNode, withModifiers, toDisplayString, renderSlot } from "vue";
import random from "../../utils/random_str.js";
import { isClient } from "../../utils/index.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "AnchorLink",
  inject: ["AnchorInstance"],
  props: {
    href: String,
    title: String,
    scrollOffset: {
      type: Number,
      default() {
        return inject("AnchorInstance").scrollOffset;
      }
    }
  },
  data() {
    return {
      prefix: "ivu-anchor-link",
      id: random(6)
    };
  },
  computed: {
    anchorLinkClasses() {
      return [
        this.prefix,
        this.AnchorInstance.currentLink === this.href ? `${this.prefix}-active` : ""
      ];
    },
    linkTitleClasses() {
      return [
        `${this.prefix}-title`
      ];
    }
  },
  methods: {
    goAnchor() {
      this.currentLink = this.href;
      this.AnchorInstance.handleHashChange();
      this.AnchorInstance.handleScrollTo();
      this.AnchorInstance.$emit("on-select", this.href);
      const isRoute = this.$router;
      if (isRoute) {
        this.$router.push(this.href, () => {
        });
      } else {
        isClient && (window.location.href = this.href);
      }
    }
  },
  mounted() {
    this.AnchorInstance.addLink(this.id, this);
    nextTick(() => {
      this.AnchorInstance.init();
    });
  },
  beforeUnmount() {
    this.AnchorInstance.removeLink(this.id);
  }
};
const _hoisted_1 = ["href", "data-scroll-offset", "data-href", "title"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.anchorLinkClasses)
  }, [
    createElementVNode("a", {
      class: normalizeClass($options.linkTitleClasses),
      href: $props.href,
      "data-scroll-offset": $props.scrollOffset,
      "data-href": $props.href,
      onClick: _cache[0] || (_cache[0] = withModifiers((...args) => $options.goAnchor && $options.goAnchor(...args), ["prevent"])),
      title: $props.title
    }, toDisplayString($props.title), 11, _hoisted_1),
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var AnchorLink = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { AnchorLink as default };
