import { oneOf } from "../../utils/assist.js";
import { openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-steps";
const _sfc_main = {
  name: "Steps",
  provide() {
    return {
      StepsInstance: this
    };
  },
  props: {
    current: {
      type: Number,
      default: 0
    },
    status: {
      validator(value) {
        return oneOf(value, ["wait", "process", "finish", "error"]);
      },
      default: "process"
    },
    size: {
      validator(value) {
        return oneOf(value, ["small"]);
      }
    },
    direction: {
      validator(value) {
        return oneOf(value, ["horizontal", "vertical"]);
      },
      default: "horizontal"
    }
  },
  data() {
    return {
      steps: []
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.direction}`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size
        }
      ];
    },
    children() {
      return this.steps.map((item) => item.step);
    }
  },
  methods: {
    addStep(id, step) {
      this.steps.push({ id, step });
    },
    removeStep(id) {
      const stepIndex = this.steps.findIndex((item) => item.id === id);
      this.steps.splice(stepIndex, 1);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var Steps = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Steps as default };
