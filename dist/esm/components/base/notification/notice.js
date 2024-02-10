import Render from "../render.js";
import { isClient } from "../../../utils/index.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, normalizeStyle, Fragment, createElementVNode, createVNode, createCommentVNode } from "vue";
import _export_sfc from "../../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  components: {
    RenderCell: Render
  },
  props: {
    prefixCls: {
      type: String,
      default: ""
    },
    duration: {
      type: Number,
      default: 1.5
    },
    type: {
      type: String
    },
    content: {
      type: String,
      default: ""
    },
    withIcon: Boolean,
    render: {
      type: Function
    },
    hasTitle: Boolean,
    styles: {
      type: Object,
      default: function() {
        return {
          right: "50%"
        };
      }
    },
    closable: {
      type: Boolean,
      default: false
    },
    className: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    onClose: {
      type: Function
    },
    transitionName: {
      type: String
    },
    background: {
      type: Boolean,
      default: false
    },
    msgType: {
      type: String
    }
  },
  data() {
    return {
      withDesc: false
    };
  },
  computed: {
    baseClass() {
      return `${this.prefixCls}-notice`;
    },
    renderFunc() {
      return this.render || function() {
      };
    },
    classes() {
      return [
        this.baseClass,
        {
          [`${this.className}`]: !!this.className,
          [`${this.baseClass}-closable`]: this.closable,
          [`${this.baseClass}-with-desc`]: this.withDesc,
          [`${this.baseClass}-with-background`]: this.background
        }
      ];
    },
    contentClasses() {
      return [
        `${this.baseClass}-content`,
        this.render !== void 0 ? `${this.baseClass}-content-with-render` : ""
      ];
    },
    messageContentClasses() {
      return [
        `${this.baseClass}-content`,
        {
          [`${this.baseClass}-content-${this.msgType}`]: this.msgType,
          [`${this.baseClass}-content-background`]: this.background
        }
      ];
    },
    contentWithIcon() {
      return [
        this.withIcon ? `${this.prefixCls}-content-with-icon` : "",
        !this.hasTitle && this.withIcon ? `${this.prefixCls}-content-with-render-notitle` : ""
      ];
    },
    messageClasses() {
      return [
        `${this.baseClass}-content`,
        this.render !== void 0 ? `${this.baseClass}-content-with-render` : ""
      ];
    }
  },
  methods: {
    clearCloseTimer() {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
        this.closeTimer = null;
      }
    },
    close() {
      this.clearCloseTimer();
      this.onClose();
      this.$parent.$parent.close(this.name);
    },
    handleEnter(el) {
      if (this.type === "message") {
        el.style.height = el.scrollHeight + "px";
      }
    },
    handleLeave(el) {
      if (this.type === "message") {
        if (isClient && document.getElementsByClassName("ivu-message-notice").length !== 1) {
          el.style.height = 0;
          el.style.paddingTop = 0;
          el.style.paddingBottom = 0;
        }
      }
    }
  },
  mounted() {
    this.handleEnter(this.$el);
    this.clearCloseTimer();
    if (this.duration !== 0) {
      this.closeTimer = setTimeout(() => {
        this.close();
      }, this.duration * 1e3);
    }
    if (this.prefixCls === "ivu-notice") {
      let desc = this.$refs.content.querySelectorAll(`.${this.prefixCls}-desc`)[0];
      this.withDesc = this.render ? true : desc ? desc.innerHTML !== "" : false;
    }
  },
  beforeUnmount() {
    this.handleLeave(this.$el);
    this.clearCloseTimer();
  }
};
const _hoisted_1 = ["innerHTML"];
const _hoisted_2 = /* @__PURE__ */ createElementVNode("i", { class: "ivu-icon ivu-icon-ios-close" }, null, -1);
const _hoisted_3 = [
  _hoisted_2
];
const _hoisted_4 = ["innerHTML"];
const _hoisted_5 = /* @__PURE__ */ createElementVNode("i", { class: "ivu-icon ivu-icon-ios-close" }, null, -1);
const _hoisted_6 = [
  _hoisted_5
];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_render_cell = resolveComponent("render-cell");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes),
    style: normalizeStyle($props.styles)
  }, [
    $props.type === "notice" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
      createElementVNode("div", {
        class: normalizeClass($options.contentClasses),
        ref: "content",
        innerHTML: $props.content
      }, null, 10, _hoisted_1),
      createElementVNode("div", {
        class: normalizeClass($options.contentWithIcon)
      }, [
        createVNode(_component_render_cell, { render: $options.renderFunc }, null, 8, ["render"])
      ], 2),
      $props.closable ? (openBlock(), createElementBlock("a", {
        key: 0,
        class: normalizeClass([$options.baseClass + "-close"]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options.close && $options.close(...args))
      }, _hoisted_3, 2)) : createCommentVNode("", true)
    ], 64)) : createCommentVNode("", true),
    $props.type === "message" ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass($options.messageContentClasses),
      ref: "content"
    }, [
      createElementVNode("div", {
        class: normalizeClass([$options.baseClass + "-content-text"]),
        innerHTML: $props.content
      }, null, 10, _hoisted_4),
      createElementVNode("div", {
        class: normalizeClass([$options.baseClass + "-content-text"])
      }, [
        createVNode(_component_render_cell, { render: $options.renderFunc }, null, 8, ["render"])
      ], 2),
      $props.closable ? (openBlock(), createElementBlock("a", {
        key: 0,
        class: normalizeClass([$options.baseClass + "-close"]),
        onClick: _cache[1] || (_cache[1] = (...args) => $options.close && $options.close(...args))
      }, _hoisted_6, 2)) : createCommentVNode("", true)
    ], 2)) : createCommentVNode("", true)
  ], 6);
}
var Notice = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Notice as default };
