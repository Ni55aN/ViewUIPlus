import Circle from "../circle/circle.js";
import { resolveComponent, openBlock, createElementBlock, createBlock, Fragment, renderSlot, normalizeClass, createTextVNode, toDisplayString, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "WordCount",
  components: { Circle },
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    total: {
      type: Number,
      default: 0
    },
    hideTotal: {
      type: Boolean,
      default: false
    },
    overflow: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    size: {
      type: [String, Number],
      default: 14
    }
  },
  computed: {
    isOverflow() {
      return this.value.length > this.total;
    },
    percent() {
      let percent = this.value.length / this.total * 100;
      if (percent > 100)
        percent = 100;
      return percent;
    },
    strokeColor() {
      return this.isOverflow ? "#ed4014" : "#2d8cf0";
    }
  }
};
const _hoisted_1 = { class: "ivu-word-count" };
const _hoisted_2 = {
  key: 0,
  class: "ivu-word-count-prefix"
};
const _hoisted_3 = {
  key: 1,
  class: "ivu-word-count-prefix ivu-word-count-overflow"
};
const _hoisted_4 = {
  key: 3,
  class: "ivu-word-count-overflow"
};
const _hoisted_5 = {
  key: 5,
  class: "ivu-word-count-suffix"
};
const _hoisted_6 = {
  key: 6,
  class: "ivu-word-count-suffix ivu-word-count-overflow"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Circle = resolveComponent("Circle");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    $props.circle ? (openBlock(), createBlock(_component_Circle, {
      key: 0,
      percent: $options.percent,
      size: $props.size,
      "stroke-color": $options.strokeColor
    }, null, 8, ["percent", "size", "stroke-color"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
      !$options.isOverflow ? (openBlock(), createElementBlock("span", _hoisted_2, [
        renderSlot(_ctx.$slots, "prefix")
      ])) : (openBlock(), createElementBlock("span", _hoisted_3, [
        renderSlot(_ctx.$slots, "prefix-overflow")
      ])),
      !$options.isOverflow || !$props.overflow ? (openBlock(), createElementBlock("span", {
        key: 2,
        class: normalizeClass({ "ivu-word-count-overflow": $options.isOverflow })
      }, [
        renderSlot(_ctx.$slots, "length", {
          length: $props.value.length
        }, () => [
          createTextVNode(toDisplayString($props.value.length), 1)
        ])
      ], 2)) : (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString($props.value.length - $props.total), 1)),
      !$props.hideTotal ? (openBlock(), createElementBlock(Fragment, { key: 4 }, [
        renderSlot(_ctx.$slots, "separator", {}, () => [
          createTextVNode(" / ")
        ]),
        renderSlot(_ctx.$slots, "total", { total: $props.total }, () => [
          createTextVNode(toDisplayString($props.total), 1)
        ])
      ], 64)) : createCommentVNode("", true),
      !$options.isOverflow ? (openBlock(), createElementBlock("span", _hoisted_5, [
        renderSlot(_ctx.$slots, "suffix")
      ])) : (openBlock(), createElementBlock("span", _hoisted_6, [
        renderSlot(_ctx.$slots, "suffix-overflow")
      ]))
    ], 64))
  ]);
}
var WordCount = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { WordCount as default };
