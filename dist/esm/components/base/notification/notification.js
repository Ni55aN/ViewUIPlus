import Notice from "./notice.js";
import { transferIncrease, transferIndex } from "../../../utils/transfer-queue.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, normalizeStyle, createVNode, TransitionGroup, withCtx, Fragment, renderList, createBlock } from "vue";
import _export_sfc from "../../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-notification";
let seed = 0;
const now = Date.now();
function getUuid() {
  return "ivuNotification_" + now + "_" + seed++;
}
const _sfc_main = {
  components: { Notice },
  props: {
    prefixCls: {
      type: String,
      default: prefixCls
    },
    styles: {
      type: Object,
      default: function() {
        return {
          top: "65px",
          left: "50%"
        };
      }
    },
    content: {
      type: String
    },
    className: {
      type: String
    },
    transitionName: {
      type: String
    }
  },
  data() {
    return {
      notices: [],
      tIndex: this.handleGetIndex()
    };
  },
  computed: {
    classes() {
      return [
        `${this.prefixCls}`,
        {
          [`${this.className}`]: !!this.className
        }
      ];
    },
    wrapStyles() {
      let styles = Object.assign({}, this.styles);
      styles["z-index"] = 1010 + this.tIndex;
      return styles;
    }
  },
  methods: {
    add(notice) {
      const name = notice.name || getUuid();
      let _notice = Object.assign({
        styles: {
          right: "50%"
        },
        content: "",
        duration: 1.5,
        closable: false,
        name
      }, notice);
      this.notices.push(_notice);
      this.tIndex = this.handleGetIndex();
    },
    close(name) {
      const notices = this.notices;
      for (let i = 0; i < notices.length; i++) {
        if (notices[i].name === name) {
          this.notices.splice(i, 1);
          break;
        }
      }
    },
    closeAll() {
      this.notices = [];
    },
    handleGetIndex() {
      transferIncrease();
      return transferIndex;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Notice = resolveComponent("Notice");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes),
    style: normalizeStyle($options.wrapStyles)
  }, [
    createVNode(TransitionGroup, {
      name: $props.transitionName,
      appear: ""
    }, {
      default: withCtx(() => [
        (openBlock(true), createElementBlock(Fragment, null, renderList($data.notices, (notice) => {
          return openBlock(), createBlock(_component_Notice, {
            key: notice.name,
            "prefix-cls": $props.prefixCls,
            styles: notice.styles,
            type: notice.type,
            content: notice.content,
            duration: notice.duration,
            render: notice.render,
            "has-title": notice.hasTitle,
            withIcon: notice.withIcon,
            closable: notice.closable,
            name: notice.name,
            "transition-name": notice.transitionName,
            background: notice.background,
            "msg-type": notice.msgType,
            "on-close": notice.onClose
          }, null, 8, ["prefix-cls", "styles", "type", "content", "duration", "render", "has-title", "withIcon", "closable", "name", "transition-name", "background", "msg-type", "on-close"]);
        }), 128))
      ]),
      _: 1
    }, 8, ["name"])
  ], 6);
}
var Notification = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Notification as default };
