import Row from "../row/row.js";
import Col from "../col/col.js";
import Avatar from "../avatar/avatar.js";
import Tag from "../tag/tag.js";
import Time from "../time/time.js";
import { oneOf } from "../../utils/assist.js";
import random from "../../utils/random_str.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createVNode, normalizeProps, guardReactiveProps, withCtx, createBlock, normalizeStyle, createCommentVNode, createElementVNode, createTextVNode, toDisplayString, mergeProps } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "NotificationItem",
  inject: ["NotificationTabInstance", "NotificationInstance"],
  components: { Row, Col, Avatar, Tag, Time },
  emits: ["on-item-click"],
  props: {
    rowProps: {
      type: Object,
      default() {
        return {
          type: "flex",
          justify: "center",
          align: "middle"
        };
      }
    },
    read: {
      type: [Boolean, Number],
      default: false
    },
    icon: {
      type: String
    },
    customIcon: {
      type: String
    },
    iconColor: {
      type: String
    },
    iconSize: {
      validator(value) {
        return oneOf(value, ["small", "default", "large"]);
      },
      default: "default"
    },
    avatar: {
      type: String
    },
    avatarShape: {
      validator(value) {
        return oneOf(value, ["circle", "square"]);
      },
      default: "circle"
    },
    title: {
      type: String
    },
    content: {
      type: String
    },
    time: {
      type: [Number, Date, String]
    },
    timeProps: {
      type: Object,
      default() {
        return {};
      }
    },
    tag: {
      type: String
    },
    tagProps: {
      type: Object,
      default() {
        return {};
      }
    },
    clickClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: random(6)
    };
  },
  computed: {
    classes() {
      return {
        "ivu-notifications-item-unread": this.read === false || this.read === 0
      };
    },
    contentSpan() {
      return this.icon || this.customIcon || this.avatar || this.$slots.avatar ? 20 : 24;
    },
    iconStyle() {
      let style = {};
      if (this.iconColor) {
        style = {
          "background-color": this.iconColor
        };
      }
      return style;
    }
  },
  methods: {
    handleClick() {
      this.$emit("on-item-click", this.$attrs);
      this.NotificationTabInstance.handleItemClick(this.$attrs);
      if (this.clickClose) {
        this.NotificationInstance.handleClose();
      }
    },
    addItem() {
      const target = this.NotificationTabInstance;
      target.itemList.push({
        id: this.id,
        item: this
      });
    },
    removeItem() {
      const target = this.NotificationTabInstance;
      const index = target.itemList.findIndex((item) => item.id === this.id);
      target.itemList.splice(index, 1);
    }
  },
  mounted() {
    this.addItem();
    this.NotificationTabInstance.handleGetItems();
  },
  unmounted() {
    this.NotificationTabInstance.handleGetItems();
  },
  beforeUnmount() {
    this.removeItem();
  }
};
const _hoisted_1 = { class: "ivu-notifications-item-title" };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = {
  key: 0,
  class: "ivu-notifications-item-tag"
};
const _hoisted_4 = {
  key: 0,
  class: "ivu-notifications-item-desc"
};
const _hoisted_5 = {
  key: 1,
  class: "ivu-notifications-item-time"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Avatar = resolveComponent("Avatar");
  const _component_Col = resolveComponent("Col");
  const _component_Tag = resolveComponent("Tag");
  const _component_Time = resolveComponent("Time");
  const _component_Row = resolveComponent("Row");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["ivu-notifications-item", $options.classes]),
    onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClick && $options.handleClick(...args))
  }, [
    renderSlot(_ctx.$slots, "default", {}, () => [
      createVNode(_component_Row, normalizeProps(guardReactiveProps($props.rowProps)), {
        default: withCtx(() => [
          $props.icon || $props.customIcon || $props.avatar || _ctx.$slots.avatar ? (openBlock(), createBlock(_component_Col, {
            key: 0,
            span: "4",
            class: "ivu-notifications-item-icon"
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "avatar", {}, () => [
                $props.icon ? (openBlock(), createBlock(_component_Avatar, {
                  key: 0,
                  icon: $props.icon,
                  shape: $props.avatarShape,
                  size: $props.iconSize,
                  style: normalizeStyle($options.iconStyle)
                }, null, 8, ["icon", "shape", "size", "style"])) : $props.customIcon ? (openBlock(), createBlock(_component_Avatar, {
                  key: 1,
                  "custom-icon": $props.customIcon,
                  shape: $props.avatarShape,
                  size: $props.iconSize,
                  style: normalizeStyle($options.iconStyle)
                }, null, 8, ["custom-icon", "shape", "size", "style"])) : $props.avatar ? (openBlock(), createBlock(_component_Avatar, {
                  key: 2,
                  src: $props.avatar,
                  shape: $props.avatarShape,
                  size: $props.iconSize,
                  style: normalizeStyle($options.iconStyle)
                }, null, 8, ["src", "shape", "size", "style"])) : createCommentVNode("", true)
              ])
            ]),
            _: 3
          })) : createCommentVNode("", true),
          createVNode(_component_Col, {
            span: $options.contentSpan,
            class: "ivu-notifications-item-content"
          }, {
            default: withCtx(() => [
              createElementVNode("div", _hoisted_1, [
                $props.title || _ctx.$slots.title ? (openBlock(), createElementBlock("h4", _hoisted_2, [
                  renderSlot(_ctx.$slots, "title", {}, () => [
                    createTextVNode(toDisplayString($props.title), 1)
                  ]),
                  $props.tag ? (openBlock(), createElementBlock("div", _hoisted_3, [
                    createVNode(_component_Tag, normalizeProps(guardReactiveProps($props.tagProps)), {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString($props.tag), 1)
                      ]),
                      _: 1
                    }, 16)
                  ])) : createCommentVNode("", true)
                ])) : createCommentVNode("", true)
              ]),
              $props.content || _ctx.$slots.content ? (openBlock(), createElementBlock("div", _hoisted_4, [
                renderSlot(_ctx.$slots, "content", {}, () => [
                  createTextVNode(toDisplayString($props.content), 1)
                ])
              ])) : createCommentVNode("", true),
              $props.time || _ctx.$slots.time ? (openBlock(), createElementBlock("div", _hoisted_5, [
                renderSlot(_ctx.$slots, "time", {}, () => [
                  createVNode(_component_Time, mergeProps({ time: $props.time }, $props.timeProps), null, 16, ["time"])
                ])
              ])) : createCommentVNode("", true)
            ]),
            _: 3
          }, 8, ["span"])
        ]),
        _: 3
      }, 16)
    ])
  ], 2);
}
var NotificationItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { NotificationItem as default };
