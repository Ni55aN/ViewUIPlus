import Trend from "../trend/trend.js";
import { oneOf } from "../../utils/assist.js";
import { resolveComponent, openBlock, createElementBlock, renderSlot, createTextVNode, toDisplayString, createCommentVNode, createElementVNode, normalizeStyle, createVNode, withCtx } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "NumberInfo",
  components: { Trend },
  props: {
    title: {
      type: String
    },
    subTitle: {
      type: String
    },
    total: {
      type: [String, Number]
    },
    subTotal: {
      type: [String, Number]
    },
    status: {
      validator(value) {
        return oneOf(value, ["up", "down"]);
      }
    },
    gap: {
      type: [String, Number],
      default: 8
    }
  },
  computed: {
    valueStyle() {
      return {
        "margin-top": this.gap + "px"
      };
    }
  }
};
const _hoisted_1 = { class: "ivu-number-info" };
const _hoisted_2 = {
  key: 0,
  class: "ivu-number-info-title"
};
const _hoisted_3 = {
  key: 1,
  class: "ivu-number-info-subTitle"
};
const _hoisted_4 = { class: "ivu-number-info-total" };
const _hoisted_5 = {
  key: 0,
  class: "ivu-number-info-subTotal"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Trend = resolveComponent("Trend");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    $props.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "title", {}, () => [
        createTextVNode(toDisplayString($props.title), 1)
      ])
    ])) : createCommentVNode("", true),
    $props.subTitle || _ctx.$slots.subTitle ? (openBlock(), createElementBlock("div", _hoisted_3, [
      renderSlot(_ctx.$slots, "subTitle", {}, () => [
        createTextVNode(toDisplayString($props.subTitle), 1)
      ])
    ])) : createCommentVNode("", true),
    createElementVNode("div", {
      class: "ivu-number-info-value",
      style: normalizeStyle($options.valueStyle)
    }, [
      createElementVNode("span", _hoisted_4, [
        renderSlot(_ctx.$slots, "total", {}, () => [
          createTextVNode(toDisplayString($props.total), 1)
        ])
      ]),
      $props.subTotal || _ctx.$slots.subTotal ? (openBlock(), createElementBlock("span", _hoisted_5, [
        renderSlot(_ctx.$slots, "subTotal", {}, () => [
          createVNode(_component_Trend, { flag: $props.status }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString($props.subTotal), 1)
            ]),
            _: 1
          }, 8, ["flag"])
        ])
      ])) : createCommentVNode("", true)
    ], 4)
  ]);
}
var NumberInfo = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { NumberInfo as default };
