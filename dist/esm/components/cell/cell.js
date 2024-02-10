import CellItem from "./cell-item.js";
import Icon from "../icon/icon.js";
import mixinsLink from "../../mixins/link.js";
import globalConfig from "../../mixins/globalConfig.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, withModifiers, createVNode, withCtx, renderSlot, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-cell";
const _sfc_main = {
  name: "Cell",
  inject: ["CellGroupInstance"],
  mixins: [mixinsLink, globalConfig],
  components: { CellItem, Icon },
  props: {
    name: {
      type: [String, Number]
    },
    title: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    extra: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-selected`]: this.selected,
          [`${prefixCls}-with-link`]: this.to
        }
      ];
    },
    arrowType() {
      const config = this.globalConfig;
      let type = "ios-arrow-forward";
      if (config) {
        if (config.cell.customArrow) {
          type = "";
        } else if (config.cell.arrow) {
          type = config.cell.arrow;
        }
      }
      return type;
    },
    customArrowType() {
      const config = this.globalConfig;
      let type = "";
      if (config) {
        if (config.cell.customArrow) {
          type = config.cell.customArrow;
        }
      }
      return type;
    },
    arrowSize() {
      const config = this.globalConfig;
      let size = "";
      if (config) {
        if (config.cell.arrowSize) {
          size = config.cell.arrowSize;
        }
      }
      return size;
    }
  },
  methods: {
    handleClickItem(event, new_window) {
      this.CellGroupInstance.handleClick(this.name);
      this.handleCheckClick(event, new_window);
    }
  }
};
const _hoisted_1 = ["href", "target"];
const _hoisted_2 = {
  key: 2,
  class: "ivu-cell-arrow"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_CellItem = resolveComponent("CellItem");
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes)
  }, [
    _ctx.to ? (openBlock(), createElementBlock("a", {
      key: 0,
      href: _ctx.linkUrl,
      target: _ctx.target,
      class: "ivu-cell-link",
      onClick: [
        _cache[0] || (_cache[0] = withModifiers(($event) => $options.handleClickItem($event, false), ["exact"])),
        _cache[1] || (_cache[1] = withModifiers(($event) => $options.handleClickItem($event, true), ["ctrl"])),
        _cache[2] || (_cache[2] = withModifiers(($event) => $options.handleClickItem($event, true), ["meta"]))
      ]
    }, [
      createVNode(_component_CellItem, {
        title: $props.title,
        label: $props.label,
        extra: $props.extra
      }, {
        icon: withCtx(() => [
          renderSlot(_ctx.$slots, "icon")
        ]),
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        extra: withCtx(() => [
          renderSlot(_ctx.$slots, "extra")
        ]),
        label: withCtx(() => [
          renderSlot(_ctx.$slots, "label")
        ]),
        _: 3
      }, 8, ["title", "label", "extra"])
    ], 8, _hoisted_1)) : (openBlock(), createElementBlock("div", {
      key: 1,
      class: "ivu-cell-link",
      onClick: _cache[3] || (_cache[3] = (...args) => $options.handleClickItem && $options.handleClickItem(...args))
    }, [
      createVNode(_component_CellItem, {
        title: $props.title,
        label: $props.label,
        extra: $props.extra
      }, {
        icon: withCtx(() => [
          renderSlot(_ctx.$slots, "icon")
        ]),
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        extra: withCtx(() => [
          renderSlot(_ctx.$slots, "extra")
        ]),
        label: withCtx(() => [
          renderSlot(_ctx.$slots, "label")
        ]),
        _: 3
      }, 8, ["title", "label", "extra"])
    ])),
    _ctx.to ? (openBlock(), createElementBlock("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "arrow", {}, () => [
        createVNode(_component_Icon, {
          type: $options.arrowType,
          custom: $options.customArrowType,
          size: $options.arrowSize
        }, null, 8, ["type", "custom", "size"])
      ])
    ])) : createCommentVNode("", true)
  ], 2);
}
var Cell = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Cell as default };
