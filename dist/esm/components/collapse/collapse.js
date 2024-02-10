import { openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-collapse";
const _sfc_main = {
  name: "Collapse",
  emits: ["on-change", "update:modelValue"],
  provide() {
    return {
      CollapseInstance: this
    };
  },
  props: {
    accordion: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [Array, String]
    },
    simple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: this.modelValue,
      panelCount: 0
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-simple`]: this.simple
        }
      ];
    }
  },
  methods: {
    getActiveKey() {
      let activeKey = this.currentValue || [];
      const accordion = this.accordion;
      if (!Array.isArray(activeKey)) {
        activeKey = [activeKey];
      }
      if (accordion && activeKey.length > 1) {
        activeKey = [activeKey[0]];
      }
      for (let i = 0; i < activeKey.length; i++) {
        activeKey[i] = activeKey[i].toString();
      }
      return activeKey;
    },
    toggle(data) {
      const name = data.name.toString();
      let newActiveKey = [];
      if (this.accordion) {
        if (!data.isActive) {
          newActiveKey.push(name);
        }
      } else {
        let activeKey = this.getActiveKey();
        const nameIndex = activeKey.indexOf(name);
        if (data.isActive) {
          if (nameIndex > -1) {
            activeKey.splice(nameIndex, 1);
          }
        } else {
          if (nameIndex < 0) {
            activeKey.push(name);
          }
        }
        newActiveKey = activeKey;
      }
      this.currentValue = newActiveKey;
      this.$emit("update:modelValue", newActiveKey);
      this.$emit("on-change", newActiveKey);
    }
  },
  watch: {
    modelValue(val) {
      this.currentValue = val;
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
var Collapse = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Collapse as default };
