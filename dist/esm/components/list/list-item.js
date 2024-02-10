import { openBlock, createElementBlock, normalizeClass, Fragment, createElementVNode, renderSlot, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "ListItem",
  inject: ["ListInstance"],
  props: {},
  computed: {
    itemLayout() {
      return this.ListInstance.itemLayout;
    },
    isItemContainsTextNode() {
      let result;
      this.$slots.default().forEach((item) => {
        if (typeof item === "string") {
          result = true;
        }
      });
      return result;
    },
    isFlexMode() {
      const extra = this.$slots.extra;
      if (this.itemLayout === "vertical") {
        return !!extra;
      }
      return !this.isItemContainsTextNode;
    },
    classes() {
      return [
        {
          "ivu-list-item-no-flex": !this.isFlexMode
        }
      ];
    }
  }
};
const _hoisted_1 = { class: "ivu-list-item-main" };
const _hoisted_2 = {
  key: 0,
  class: "ivu-list-item-action"
};
const _hoisted_3 = { class: "ivu-list-item-extra" };
const _hoisted_4 = {
  key: 0,
  class: "ivu-list-item-action"
};
const _hoisted_5 = { class: "ivu-list-item-extra" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("li", {
    class: normalizeClass(["ivu-list-item", $options.classes])
  }, [
    $options.itemLayout === "vertical" && _ctx.$slots.extra ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
      createElementVNode("div", _hoisted_1, [
        renderSlot(_ctx.$slots, "default"),
        _ctx.$slots.action ? (openBlock(), createElementBlock("ul", _hoisted_2, [
          renderSlot(_ctx.$slots, "action")
        ])) : createCommentVNode("", true)
      ]),
      createElementVNode("div", _hoisted_3, [
        renderSlot(_ctx.$slots, "extra")
      ])
    ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
      renderSlot(_ctx.$slots, "default"),
      _ctx.$slots.action ? (openBlock(), createElementBlock("ul", _hoisted_4, [
        renderSlot(_ctx.$slots, "action")
      ])) : createCommentVNode("", true),
      createElementVNode("div", _hoisted_5, [
        renderSlot(_ctx.$slots, "extra")
      ])
    ], 64))
  ], 2);
}
var ListItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ListItem as default };
