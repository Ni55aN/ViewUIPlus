import _sfc_main$1 from "../button/button.js";
import { oneOf } from "../../utils/assist.js";
import typeConfig from "./typeConfig.js";
import { resolveComponent, openBlock, createElementBlock, createElementVNode, normalizeStyle, renderSlot, createTextVNode, toDisplayString, createVNode, withCtx } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Exception",
  components: { Button: _sfc_main$1 },
  props: {
    type: {
      validator(value) {
        return oneOf(value, ["403", "404", "500", 403, 404, 500]);
      },
      default: "404"
    },
    title: {
      type: String
    },
    desc: {
      type: String
    },
    img: {
      type: String
    },
    imgColor: {
      type: Boolean,
      default: false
    },
    backText: {
      type: String,
      default: "\u8FD4\u56DE\u9996\u9875"
    },
    redirect: {
      type: String,
      default: "/"
    }
  },
  computed: {
    imgPath() {
      return this.img ? this.img : this.imgColor ? typeConfig[this.type].imgColor : typeConfig[this.type].img;
    },
    titleText() {
      return this.title ? this.title : typeConfig[this.type].title;
    },
    descText() {
      return this.desc ? this.desc : typeConfig[this.type].desc;
    }
  }
};
const _hoisted_1 = { class: "ivu-exception" };
const _hoisted_2 = { class: "ivu-exception-img" };
const _hoisted_3 = { class: "ivu-exception-content" };
const _hoisted_4 = { class: "ivu-exception-content-desc" };
const _hoisted_5 = { class: "ivu-exception-content-actions" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Button = resolveComponent("Button");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createElementVNode("div", _hoisted_2, [
      createElementVNode("div", {
        class: "ivu-exception-img-element",
        style: normalizeStyle({ "background-image": "url(" + $options.imgPath + ")" })
      }, null, 4)
    ]),
    createElementVNode("div", _hoisted_3, [
      createElementVNode("h1", null, [
        renderSlot(_ctx.$slots, "title", {}, () => [
          createTextVNode(toDisplayString($options.titleText), 1)
        ])
      ]),
      createElementVNode("div", _hoisted_4, [
        renderSlot(_ctx.$slots, "desc", {}, () => [
          createTextVNode(toDisplayString($options.descText), 1)
        ])
      ]),
      createElementVNode("div", _hoisted_5, [
        renderSlot(_ctx.$slots, "actions", {}, () => [
          createVNode(_component_Button, {
            to: $props.redirect,
            type: "primary",
            size: "large"
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString($props.backText), 1)
            ]),
            _: 1
          }, 8, ["to"])
        ])
      ])
    ])
  ]);
}
var Exception = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Exception as default };
