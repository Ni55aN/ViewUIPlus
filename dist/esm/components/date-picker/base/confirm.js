import _sfc_main$1 from "../../button/button.js";
import Locale from "../../../mixins/locale.js";
import { isClient } from "../../../utils/index.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, withKeys, createBlock, withCtx, createTextVNode, toDisplayString, createCommentVNode, createVNode } from "vue";
import _export_sfc from "../../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-picker";
const _sfc_main = {
  mixins: [Locale],
  components: { iButton: _sfc_main$1 },
  emits: ["on-pick-clear", "on-pick-success", "on-pick-toggle-time"],
  inject: ["PickerInstance"],
  props: {
    showTime: {
      type: Boolean,
      default: false
    },
    isTime: {
      type: Boolean,
      default: false
    },
    timeDisabled: {
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
    timeClasses() {
      return `${prefixCls}-confirm-time`;
    },
    labels() {
      const labels = ["time", "clear", "ok"];
      const values = [this.isTime ? "selectDate" : "selectTime", "clear", "ok"];
      return labels.reduce((obj, key, i) => {
        obj[key] = this.t("i.datepicker." + values[i]);
        return obj;
      }, {});
    }
  },
  methods: {
    handleClear() {
      this.$emit("on-pick-clear");
    },
    handleSuccess() {
      this.$emit("on-pick-success");
    },
    handleToggleTime() {
      if (this.timeDisabled)
        return;
      this.$emit("on-pick-toggle-time");
      this.PickerInstance.handleOnFocusInput();
      this.PickerInstance.handleOnUpdatePopper();
    },
    handleTab(e) {
      const tabbables = [...this.$el.children];
      const expectedFocus = tabbables[e.shiftKey ? "shift" : "pop"]();
      if (isClient && document.activeElement === expectedFocus) {
        e.preventDefault();
        e.stopPropagation();
        this.PickerInstance.handleOnFocusInput();
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_button = resolveComponent("i-button");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass([$data.prefixCls + "-confirm"]),
    onKeydownCapture: _cache[0] || (_cache[0] = withKeys((...args) => $options.handleTab && $options.handleTab(...args), ["tab"]))
  }, [
    $props.showTime ? (openBlock(), createBlock(_component_i_button, {
      key: 0,
      class: normalizeClass($options.timeClasses),
      size: "small",
      type: "text",
      disabled: $props.timeDisabled,
      onClick: $options.handleToggleTime
    }, {
      default: withCtx(() => [
        createTextVNode(toDisplayString($options.labels.time), 1)
      ]),
      _: 1
    }, 8, ["class", "disabled", "onClick"])) : createCommentVNode("", true),
    createVNode(_component_i_button, {
      size: "small",
      class: "ivu-picker-confirm-btn-cancel",
      onClick: $options.handleClear,
      onKeydown: withKeys($options.handleClear, ["enter"])
    }, {
      default: withCtx(() => [
        createTextVNode(toDisplayString($options.labels.clear), 1)
      ]),
      _: 1
    }, 8, ["onClick", "onKeydown"]),
    createVNode(_component_i_button, {
      size: "small",
      type: "primary",
      onClick: $options.handleSuccess,
      onKeydown: withKeys($options.handleSuccess, ["enter"])
    }, {
      default: withCtx(() => [
        createTextVNode(toDisplayString($options.labels.ok), 1)
      ]),
      _: 1
    }, 8, ["onClick", "onKeydown"])
  ], 34);
}
var Confirm = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Confirm as default };
