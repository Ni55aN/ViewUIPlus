import { getCurrentInstance, openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import { oneOf } from "../../utils/assist.js";
import mixinsForm from "../../mixins/form.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-checkbox-group";
const _sfc_main = {
  name: "CheckboxGroup",
  mixins: [mixinsForm],
  emits: ["update:modelValue", "on-change"],
  provide() {
    return {
      CheckboxGroupInstance: this
    };
  },
  props: {
    modelValue: {
      type: Array,
      default() {
        return [];
      }
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "large", "default"]);
      },
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.size === "" ? "default" : global.$VIEWUI.size;
      }
    }
  },
  data() {
    return {
      currentValue: this.modelValue || [],
      children: []
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`ivu-checkbox-${this.size}`]: !!this.size
        }
      ];
    }
  },
  methods: {
    change(data) {
      this.currentValue = data;
      this.$emit("update:modelValue", data);
      this.$emit("on-change", data);
      this.handleFormItemChange("change", data);
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
var CheckboxGroup = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CheckboxGroup as default };
