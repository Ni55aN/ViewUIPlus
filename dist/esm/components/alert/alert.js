import Icon from "../icon/icon.js";
import { oneOf } from "../../utils/assist.js";
import { resolveComponent, openBlock, createBlock, Transition, withCtx, createElementBlock, normalizeClass, renderSlot, createVNode, createCommentVNode, createElementVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-alert";
const _sfc_main = {
  name: "Alert",
  components: { Icon },
  props: {
    type: {
      validator(value) {
        return oneOf(value, ["success", "info", "warning", "error"]);
      },
      default: "info"
    },
    closable: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    banner: {
      type: Boolean,
      default: false
    },
    fade: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      closed: false,
      desc: false
    };
  },
  computed: {
    wrapClasses() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.type}`,
        {
          [`${prefixCls}-with-icon`]: this.showIcon,
          [`${prefixCls}-with-desc`]: this.desc,
          [`${prefixCls}-with-banner`]: this.banner
        }
      ];
    },
    messageClasses() {
      return `${prefixCls}-message`;
    },
    descClasses() {
      return `${prefixCls}-desc`;
    },
    closeClasses() {
      return `${prefixCls}-close`;
    },
    iconClasses() {
      return `${prefixCls}-icon`;
    },
    iconType() {
      let type = "";
      switch (this.type) {
        case "success":
          type = "ios-checkmark-circle";
          break;
        case "info":
          type = "ios-information-circle";
          break;
        case "warning":
          type = "ios-alert";
          break;
        case "error":
          type = "ios-close-circle";
          break;
      }
      if (this.desc)
        type += "-outline";
      return type;
    }
  },
  methods: {
    close(e) {
      this.closed = true;
      this.$emit("on-close", e);
    }
  },
  mounted() {
    this.desc = this.$slots.desc !== void 0;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createBlock(Transition, {
    name: $props.fade ? "fade" : ""
  }, {
    default: withCtx(() => [
      !$data.closed ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass($options.wrapClasses)
      }, [
        $props.showIcon ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass($options.iconClasses)
        }, [
          renderSlot(_ctx.$slots, "icon", {}, () => [
            createVNode(_component_Icon, { type: $options.iconType }, null, 8, ["type"])
          ])
        ], 2)) : createCommentVNode("", true),
        createElementVNode("span", {
          class: normalizeClass($options.messageClasses)
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 2),
        createElementVNode("span", {
          class: normalizeClass($options.descClasses)
        }, [
          renderSlot(_ctx.$slots, "desc")
        ], 2),
        $props.closable ? (openBlock(), createElementBlock("a", {
          key: 1,
          class: normalizeClass($options.closeClasses),
          onClick: _cache[0] || (_cache[0] = (...args) => $options.close && $options.close(...args))
        }, [
          renderSlot(_ctx.$slots, "close", {}, () => [
            createVNode(_component_Icon, { type: "ios-close" })
          ])
        ], 2)) : createCommentVNode("", true)
      ], 2)) : createCommentVNode("", true)
    ]),
    _: 3
  }, 8, ["name"]);
}
var Alert = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Alert as default };
