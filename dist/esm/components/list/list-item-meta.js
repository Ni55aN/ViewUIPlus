import Avatar from "../avatar/avatar.js";
import { resolveComponent, openBlock, createElementBlock, renderSlot, createVNode, createCommentVNode, createElementVNode, createTextVNode, toDisplayString } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "ListItemMeta",
  components: { Avatar },
  props: {
    avatar: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  }
};
const _hoisted_1 = { class: "ivu-list-item-meta" };
const _hoisted_2 = {
  key: 0,
  class: "ivu-list-item-meta-avatar"
};
const _hoisted_3 = { class: "ivu-list-item-meta-content" };
const _hoisted_4 = {
  key: 0,
  class: "ivu-list-item-meta-title"
};
const _hoisted_5 = {
  key: 1,
  class: "ivu-list-item-meta-description"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Avatar = resolveComponent("Avatar");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    $props.avatar || _ctx.$slots.avatar ? (openBlock(), createElementBlock("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "avatar", {}, () => [
        createVNode(_component_Avatar, { src: $props.avatar }, null, 8, ["src"])
      ])
    ])) : createCommentVNode("", true),
    createElementVNode("div", _hoisted_3, [
      $props.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", _hoisted_4, [
        renderSlot(_ctx.$slots, "title", {}, () => [
          createTextVNode(toDisplayString($props.title), 1)
        ])
      ])) : createCommentVNode("", true),
      $props.description || _ctx.$slots.description ? (openBlock(), createElementBlock("div", _hoisted_5, [
        renderSlot(_ctx.$slots, "description", {}, () => [
          createTextVNode(toDisplayString($props.description), 1)
        ])
      ])) : createCommentVNode("", true)
    ])
  ]);
}
var ListItemMeta = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ListItemMeta as default };
