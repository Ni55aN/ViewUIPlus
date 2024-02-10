import Icon from "../icon/icon.js";
import { resolveComponent, openBlock, createElementBlock, renderSlot, Fragment, renderList, createBlock, createCommentVNode, createTextVNode, toDisplayString } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "GlobalFooter",
  components: { Icon },
  props: {
    links: {
      type: Array,
      default() {
        return [];
      }
    },
    copyright: {
      type: String
    }
  }
};
const _hoisted_1 = { class: "ivu-global-footer" };
const _hoisted_2 = {
  key: 0,
  class: "ivu-global-footer-links"
};
const _hoisted_3 = ["href", "target", "title"];
const _hoisted_4 = {
  key: 1,
  class: "ivu-global-footer-copyright"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createElementBlock("footer", _hoisted_1, [
    $props.links.length || _ctx.$slots.links ? (openBlock(), createElementBlock("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "links", {}, () => [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.links, (item) => {
          return openBlock(), createElementBlock("a", {
            href: item.href,
            target: item.blankTarget ? "_blank" : "_self",
            key: item.key,
            title: item.title
          }, [
            item.icon ? (openBlock(), createBlock(_component_Icon, {
              key: 0,
              type: item.icon
            }, null, 8, ["type"])) : item.customIcon ? (openBlock(), createBlock(_component_Icon, {
              key: 1,
              custom: item.customIcon
            }, null, 8, ["custom"])) : createCommentVNode("", true),
            createTextVNode(" " + toDisplayString(item.title), 1)
          ], 8, _hoisted_3);
        }), 128))
      ])
    ])) : createCommentVNode("", true),
    $props.copyright || _ctx.$slots.copyright ? (openBlock(), createElementBlock("div", _hoisted_4, [
      renderSlot(_ctx.$slots, "copyright", {}, () => [
        createTextVNode(toDisplayString($props.copyright), 1)
      ])
    ])) : createCommentVNode("", true)
  ]);
}
var GlobalFooter = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { GlobalFooter as default };
