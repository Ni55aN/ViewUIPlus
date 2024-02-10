import { getCurrentInstance, resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createTextVNode, toDisplayString, createCommentVNode, createElementVNode, createBlock, withCtx } from "vue";
import "../spin/index.js";
import { oneOf } from "../../utils/assist.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
import Spin from "../spin/spin2.js";
const prefixCls = "ivu-list";
const _sfc_main = {
  name: "List",
  provide() {
    return {
      ListInstance: this
    };
  },
  components: { Spin },
  props: {
    border: {
      type: Boolean,
      default: false
    },
    itemLayout: {
      validator(value) {
        return oneOf(value, ["horizontal", "vertical"]);
      },
      default: "horizontal"
    },
    header: {
      type: String,
      default: ""
    },
    footer: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "large", "default"]);
      },
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.size === "" ? "default" : global.$VIEWUI.size;
      }
    },
    split: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.size}`,
        `${prefixCls}-${this.itemLayout}`,
        {
          [`${prefixCls}-bordered`]: this.border,
          [`${prefixCls}-split`]: this.split
        }
      ];
    }
  },
  methods: {}
};
const _hoisted_1 = {
  key: 0,
  class: "ivu-list-header"
};
const _hoisted_2 = { class: "ivu-list-container" };
const _hoisted_3 = { class: "ivu-list-items" };
const _hoisted_4 = {
  key: 2,
  class: "ivu-list-footer"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Spin = resolveComponent("Spin");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes)
  }, [
    $props.header || _ctx.$slots.header ? (openBlock(), createElementBlock("div", _hoisted_1, [
      renderSlot(_ctx.$slots, "header", {}, () => [
        createTextVNode(toDisplayString($props.header), 1)
      ])
    ])) : createCommentVNode("", true),
    createElementVNode("div", _hoisted_2, [
      createElementVNode("ul", _hoisted_3, [
        renderSlot(_ctx.$slots, "default")
      ])
    ]),
    $props.loading ? (openBlock(), createBlock(_component_Spin, {
      key: 1,
      fix: "",
      size: "large"
    }, {
      default: withCtx(() => [
        renderSlot(_ctx.$slots, "spin")
      ]),
      _: 3
    })) : createCommentVNode("", true),
    $props.footer || _ctx.$slots.footer ? (openBlock(), createElementBlock("div", _hoisted_4, [
      renderSlot(_ctx.$slots, "footer", {}, () => [
        createTextVNode(toDisplayString($props.footer), 1)
      ])
    ])) : createCommentVNode("", true)
  ], 2);
}
var List = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { List as default };
