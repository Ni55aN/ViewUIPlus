import mixinsLink from "../../mixins/link.js";
import { openBlock, createElementBlock, normalizeClass, withModifiers, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-breadcrumb-item";
const _sfc_main = {
  name: "BreadcrumbItem",
  mixins: [mixinsLink],
  inject: ["BreadcrumbInstance"],
  props: {},
  data() {
    return {
      showSeparator: false
    };
  },
  computed: {
    linkClasses() {
      return `${prefixCls}-link`;
    },
    separatorClasses() {
      return `${prefixCls}-separator`;
    },
    separator() {
      return this.BreadcrumbInstance.separator;
    }
  },
  mounted() {
    this.showSeparator = this.$slots.separator !== void 0;
  }
};
const _hoisted_1 = ["href", "target"];
const _hoisted_2 = ["innerHTML"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", null, [
    _ctx.to ? (openBlock(), createElementBlock("a", {
      key: 0,
      href: _ctx.linkUrl,
      target: _ctx.target,
      class: normalizeClass($options.linkClasses),
      onClick: [
        _cache[0] || (_cache[0] = withModifiers(($event) => _ctx.handleCheckClick($event, false), ["exact"])),
        _cache[1] || (_cache[1] = withModifiers(($event) => _ctx.handleCheckClick($event, true), ["ctrl"])),
        _cache[2] || (_cache[2] = withModifiers(($event) => _ctx.handleCheckClick($event, true), ["meta"]))
      ]
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 10, _hoisted_1)) : (openBlock(), createElementBlock("span", {
      key: 1,
      class: normalizeClass($options.linkClasses)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2)),
    !$data.showSeparator ? (openBlock(), createElementBlock("span", {
      key: 2,
      class: normalizeClass($options.separatorClasses),
      innerHTML: $options.separator
    }, null, 10, _hoisted_2)) : (openBlock(), createElementBlock("span", {
      key: 3,
      class: normalizeClass($options.separatorClasses)
    }, [
      renderSlot(_ctx.$slots, "separator")
    ], 2))
  ]);
}
var BreadcrumbItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { BreadcrumbItem as default };
