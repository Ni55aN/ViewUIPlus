import Icon from "../icon/icon.js";
import { oneOf } from "../../utils/assist.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, normalizeStyle, toDisplayString, createCommentVNode, renderSlot, createVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-progress";
const _sfc_main = {
  name: "Progress",
  components: { Icon },
  props: {
    percent: {
      type: Number,
      default: 0
    },
    successPercent: {
      type: Number,
      default: 0
    },
    status: {
      validator(value) {
        return oneOf(value, ["normal", "active", "wrong", "success"]);
      },
      default: "normal"
    },
    hideInfo: {
      type: Boolean,
      default: false
    },
    strokeWidth: {
      type: Number,
      default: 10
    },
    vertical: {
      type: Boolean,
      default: false
    },
    strokeColor: {
      type: [String, Array]
    },
    textInside: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentStatus: this.status
    };
  },
  computed: {
    isStatus() {
      return this.currentStatus === "wrong" || this.currentStatus === "success";
    },
    statusIcon() {
      let type = "";
      switch (this.currentStatus) {
        case "wrong":
          type = "ios-close-circle";
          break;
        case "success":
          type = "ios-checkmark-circle";
          break;
      }
      return type;
    },
    bgStyle() {
      const style = this.vertical ? {
        height: `${this.percent}%`,
        width: `${this.strokeWidth}px`
      } : {
        width: `${this.percent}%`,
        height: `${this.strokeWidth}px`
      };
      if (this.strokeColor) {
        if (typeof this.strokeColor === "string") {
          style["background-color"] = this.strokeColor;
        } else {
          style["background-image"] = `linear-gradient(to right, ${this.strokeColor[0]} 0%, ${this.strokeColor[1]} 100%)`;
        }
      }
      return style;
    },
    successBgStyle() {
      return this.vertical ? {
        height: `${this.successPercent}%`,
        width: `${this.strokeWidth}px`
      } : {
        width: `${this.successPercent}%`,
        height: `${this.strokeWidth}px`
      };
    },
    wrapClasses() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.currentStatus}`,
        {
          [`${prefixCls}-show-info`]: !this.hideInfo && !this.textInside,
          [`${prefixCls}-vertical`]: this.vertical
        }
      ];
    },
    textClasses() {
      return `${prefixCls}-text`;
    },
    textInnerClasses() {
      return `${prefixCls}-text-inner`;
    },
    outerClasses() {
      return `${prefixCls}-outer`;
    },
    innerClasses() {
      return `${prefixCls}-inner`;
    },
    bgClasses() {
      return `${prefixCls}-bg`;
    },
    successBgClasses() {
      return `${prefixCls}-success-bg`;
    }
  },
  created() {
    this.handleStatus();
  },
  methods: {
    handleStatus(isDown) {
      if (isDown) {
        this.currentStatus = "normal";
        this.$emit("on-status-change", "normal");
      } else {
        if (parseInt(this.percent, 10) === 100) {
          this.currentStatus = "success";
          this.$emit("on-status-change", "success");
        }
      }
    }
  },
  watch: {
    percent(val, oldVal) {
      if (val < oldVal) {
        this.handleStatus(true);
      } else {
        this.handleStatus();
      }
    },
    status(val) {
      this.currentStatus = val;
    }
  }
};
const _hoisted_1 = {
  key: 0,
  class: "ivu-progress-inner-text"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.wrapClasses)
  }, [
    createElementVNode("div", {
      class: normalizeClass($options.outerClasses)
    }, [
      createElementVNode("div", {
        class: normalizeClass($options.innerClasses)
      }, [
        createElementVNode("div", {
          class: normalizeClass($options.bgClasses),
          style: normalizeStyle($options.bgStyle)
        }, [
          $props.textInside ? (openBlock(), createElementBlock("div", _hoisted_1, toDisplayString($props.percent) + "%", 1)) : createCommentVNode("", true)
        ], 6),
        createElementVNode("div", {
          class: normalizeClass($options.successBgClasses),
          style: normalizeStyle($options.successBgStyle)
        }, null, 6)
      ], 2)
    ], 2),
    !$props.hideInfo && !$props.textInside ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass($options.textClasses)
    }, [
      renderSlot(_ctx.$slots, "default", {}, () => [
        $options.isStatus ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass($options.textInnerClasses)
        }, [
          createVNode(_component_Icon, { type: $options.statusIcon }, null, 8, ["type"])
        ], 2)) : (openBlock(), createElementBlock("span", {
          key: 1,
          class: normalizeClass($options.textInnerClasses)
        }, toDisplayString($props.percent) + "% ", 3))
      ])
    ], 2)) : createCommentVNode("", true)
  ], 2);
}
var iProgress = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { iProgress as default };
