import { oneOf } from "../../utils/assist.js";
import random from "../../utils/random_str.js";
import { openBlock, createElementBlock, normalizeClass, createElementVNode, toDisplayString, renderSlot, createTextVNode, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-steps";
const iconPrefixCls = "ivu-icon";
const _sfc_main = {
  name: "Step",
  inject: ["StepsInstance"],
  props: {
    status: {
      validator(value) {
        return oneOf(value, ["wait", "process", "finish", "error"]);
      }
    },
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String
    },
    icon: {
      type: String
    }
  },
  data() {
    return {
      prefixCls,
      id: random(6)
    };
  },
  computed: {
    wrapClasses() {
      return [
        `${prefixCls}-item`,
        `${prefixCls}-status-${this.currentStatus}`,
        {
          [`${prefixCls}-custom`]: !!this.icon || !!this.$slots.icon,
          [`${prefixCls}-next-error`]: this.nextError
        }
      ];
    },
    iconClasses() {
      let icon = "";
      if (this.icon) {
        icon = this.icon;
      } else {
        if (this.currentStatus === "finish") {
          icon = "ios-checkmark";
        } else if (this.currentStatus === "error") {
          icon = "ios-close";
        }
      }
      return [
        `${prefixCls}-icon`,
        `${iconPrefixCls}`,
        {
          [`${iconPrefixCls}-${icon}`]: icon !== ""
        }
      ];
    },
    stepNumber() {
      return this.StepsInstance.steps.findIndex((item) => item.id === this.id) + 1;
    },
    total() {
      return this.StepsInstance.direction === "horizontal" ? this.StepsInstance.steps.length : 1;
    },
    currentStatus() {
      let status = "";
      if (this.status) {
        status = this.status;
      } else {
        const StepsInstance = this.StepsInstance;
        const current = StepsInstance.current;
        const index = StepsInstance.steps.findIndex((item) => item.id === this.id);
        if (index === current) {
          if (StepsInstance.status !== "error") {
            status = "process";
          } else {
            status = "error";
          }
        } else if (index < current) {
          status = "finish";
        } else {
          status = "wait";
        }
      }
      return status;
    },
    nextError() {
      let status = false;
      const StepsInstance = this.StepsInstance;
      const index = StepsInstance.steps.findIndex((item) => item.id === this.id);
      if (index + 1 < StepsInstance.steps.length) {
        const nextStep = StepsInstance.steps[index + 1];
        if (nextStep.currentStatus === "error")
          status = true;
      }
      return status;
    }
  },
  beforeMount() {
    this.StepsInstance.addStep(this.id, this);
  },
  beforeUnmount() {
    this.StepsInstance.removeStep(this.id);
  }
};
const _hoisted_1 = /* @__PURE__ */ createElementVNode("i", null, null, -1);
const _hoisted_2 = [
  _hoisted_1
];
const _hoisted_3 = { key: 0 };
const _hoisted_4 = {
  key: 1,
  class: "ivu-steps-icon"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.wrapClasses)
  }, [
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-tail"])
    }, _hoisted_2, 2),
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-head"])
    }, [
      createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-head-inner"])
      }, [
        !$props.icon && !_ctx.$slots.icon && $options.currentStatus !== "finish" && $options.currentStatus !== "error" ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString($options.stepNumber), 1)) : _ctx.$slots.icon ? (openBlock(), createElementBlock("span", _hoisted_4, [
          renderSlot(_ctx.$slots, "icon")
        ])) : (openBlock(), createElementBlock("span", {
          key: 2,
          class: normalizeClass($options.iconClasses)
        }, null, 2))
      ], 2)
    ], 2),
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-main"])
    }, [
      createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-title"])
      }, [
        renderSlot(_ctx.$slots, "title", {}, () => [
          createTextVNode(toDisplayString($props.title), 1)
        ])
      ], 2),
      $props.content || _ctx.$slots.content ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass([$data.prefixCls + "-content"])
      }, [
        renderSlot(_ctx.$slots, "content", {}, () => [
          createTextVNode(toDisplayString($props.content), 1)
        ])
      ], 2)) : createCommentVNode("", true)
    ], 2)
  ], 2);
}
var Step = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Step as default };
