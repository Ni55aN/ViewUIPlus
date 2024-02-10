import { getCurrentInstance, resolveComponent, openBlock, createElementBlock, normalizeClass, Fragment, renderList, createBlock, withCtx, createVNode, normalizeStyle, renderSlot, createTextVNode, toDisplayString, createCommentVNode } from "vue";
import Avatar from "../avatar/avatar.js";
import Tooltip from "../tooltip/tooltip.js";
import { oneOf } from "../../utils/assist.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "AvatarList",
  components: { Avatar, Tooltip },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    shape: {
      validator(value) {
        return oneOf(value, ["circle", "square"]);
      },
      default: "circle"
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "large", "default"]);
      },
      default: "default"
    },
    excessStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    max: {
      type: Number
    },
    tooltip: {
      type: Boolean,
      default: true
    },
    placement: {
      validator(value) {
        return oneOf(value, ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]);
      },
      default: "top"
    },
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? false : global.$VIEWUI.transfer;
      }
    }
  },
  computed: {
    currentList() {
      const len = this.list.length;
      const max = this.max;
      if (len <= max) {
        return [...this.list];
      } else {
        return [...this.list].slice(0, max);
      }
    }
  }
};
const _hoisted_1 = {
  key: 0,
  class: "ivu-avatar-list-item ivu-avatar-list-item-excess"
};
const _hoisted_2 = {
  key: 1,
  class: "ivu-avatar-list-item ivu-avatar-list-item-excess"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Avatar = resolveComponent("Avatar");
  const _component_Tooltip = resolveComponent("Tooltip");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["ivu-avatar-list", "ivu-avatar-list-" + $props.size])
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.currentList, (item, index) => {
      return openBlock(), createElementBlock("div", {
        class: "ivu-avatar-list-item",
        key: index
      }, [
        $props.tooltip && item.tip ? (openBlock(), createBlock(_component_Tooltip, {
          key: 0,
          content: item.tip,
          placement: $props.placement,
          transfer: $props.transfer
        }, {
          default: withCtx(() => [
            createVNode(_component_Avatar, {
              src: item.src,
              size: $props.size,
              shape: $props.shape
            }, null, 8, ["src", "size", "shape"])
          ]),
          _: 2
        }, 1032, ["content", "placement", "transfer"])) : (openBlock(), createBlock(_component_Avatar, {
          key: 1,
          src: item.src,
          size: $props.size,
          shape: $props.shape
        }, null, 8, ["src", "size", "shape"]))
      ]);
    }), 128)),
    _ctx.$slots.extra ? (openBlock(), createElementBlock("div", _hoisted_1, [
      createVNode(_component_Avatar, {
        size: $props.size,
        shape: $props.shape,
        style: normalizeStyle($props.excessStyle)
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "extra")
        ]),
        _: 3
      }, 8, ["size", "shape", "style"])
    ])) : $props.list.length > $props.max ? (openBlock(), createElementBlock("div", _hoisted_2, [
      createVNode(_component_Avatar, {
        size: $props.size,
        shape: $props.shape,
        style: normalizeStyle($props.excessStyle)
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "excess", {}, () => [
            createTextVNode("+" + toDisplayString($props.list.length - $props.max), 1)
          ])
        ]),
        _: 3
      }, 8, ["size", "shape", "style"])
    ])) : createCommentVNode("", true)
  ], 2);
}
var AvatarList = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { AvatarList as default };
