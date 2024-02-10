import { getCurrentInstance, nextTick, resolveComponent, openBlock, createBlock, withCtx, renderSlot, createVNode, createElementBlock, Fragment, renderList, createTextVNode, toDisplayString } from "vue";
import Select from "../select/select.js";
import iOption from "../select/option.js";
import Input from "../input/input.js";
import { oneOf } from "../../utils/assist.js";
import mixinsForm from "../../mixins/form.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "AutoComplete",
  mixins: [mixinsForm],
  components: { iSelect: Select, iOption, iInput: Input },
  emits: ["update:modelValue", "on-change", "on-search", "on-select", "on-focus", "on-blur", "on-clear"],
  props: {
    modelValue: {
      type: [String, Number],
      default: ""
    },
    label: {
      type: [String, Number],
      default: ""
    },
    data: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "large", "default"]);
      },
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.size === "" ? "default" : global.$VIEWUI.size;
      }
    },
    icon: {
      type: String
    },
    filterMethod: {
      type: [Function, Boolean],
      default: false
    },
    placement: {
      validator(value) {
        return oneOf(value, ["top", "bottom", "top-start", "bottom-start", "top-end", "bottom-end"]);
      },
      default: "bottom-start"
    },
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? false : global.$VIEWUI.transfer;
      }
    },
    name: {
      type: String
    },
    elementId: {
      type: String
    },
    transferClassName: {
      type: String
    },
    capture: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI ? true : global.$VIEWUI.capture;
      }
    },
    eventsEnabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: this.modelValue,
      disableEmitChange: false
    };
  },
  computed: {
    inputIcon() {
      let icon = "";
      if (this.clearable && this.currentValue && !this.disabled) {
        icon = "ios-close-circle";
      } else if (this.icon) {
        icon = this.icon;
      }
      return icon;
    },
    filteredData() {
      if (this.filterMethod) {
        return this.data.filter((item) => this.filterMethod(this.currentValue, item));
      } else {
        return this.data;
      }
    }
  },
  watch: {
    modelValue(val) {
      if (this.currentValue !== val) {
        this.disableEmitChange = true;
      }
      this.currentValue = val;
    },
    currentValue(val) {
      this.$refs.select.setQuery(val);
      this.$emit("update:modelValue", val);
      if (this.disableEmitChange) {
        this.disableEmitChange = false;
        return;
      }
      this.$emit("on-change", val);
      this.handleFormItemChange("change", val);
    }
  },
  methods: {
    remoteMethod(query) {
      this.$emit("on-search", query);
    },
    handleSelect(option) {
      const val = option.value;
      if (val === void 0 || val === null)
        return;
      this.currentValue = val;
      this.$refs.input.blur();
      this.$emit("on-select", val);
    },
    handleFocus(event) {
      this.$emit("on-focus", event);
    },
    handleBlur(event) {
      this.$emit("on-blur", event);
    },
    handleClear() {
      if (!this.clearable)
        return;
      this.currentValue = "";
      this.$refs.select.reset();
      this.$emit("on-clear");
    },
    handleClickOutside() {
      nextTick(() => {
        this.$refs.input.blur();
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_input = resolveComponent("i-input");
  const _component_i_option = resolveComponent("i-option");
  const _component_i_select = resolveComponent("i-select");
  return openBlock(), createBlock(_component_i_select, {
    ref: "select",
    class: "ivu-auto-complete",
    label: $props.label,
    disabled: _ctx.itemDisabled,
    clearable: $props.clearable,
    placeholder: $props.placeholder,
    size: $props.size,
    placement: $props.placement,
    "model-value": $data.currentValue,
    "transfer-class-name": $props.transferClassName,
    filterable: "",
    remote: "",
    "auto-complete": "",
    "remote-method": $options.remoteMethod,
    onOnSelect: $options.handleSelect,
    onOnClickoutside: $options.handleClickOutside,
    transfer: $props.transfer,
    capture: $props.capture,
    eventsEnabled: $props.eventsEnabled
  }, {
    input: withCtx(() => [
      renderSlot(_ctx.$slots, "input", {}, () => [
        createVNode(_component_i_input, {
          "element-id": $props.elementId,
          ref: "input",
          modelValue: $data.currentValue,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.currentValue = $event),
          name: $props.name,
          placeholder: $props.placeholder,
          disabled: _ctx.itemDisabled,
          size: $props.size,
          icon: $options.inputIcon,
          onOnClick: $options.handleClear,
          onOnFocus: $options.handleFocus,
          onOnBlur: $options.handleBlur
        }, null, 8, ["element-id", "modelValue", "name", "placeholder", "disabled", "size", "icon", "onOnClick", "onOnFocus", "onOnBlur"])
      ])
    ]),
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default", {}, () => [
        (openBlock(true), createElementBlock(Fragment, null, renderList($options.filteredData, (item) => {
          return openBlock(), createBlock(_component_i_option, {
            value: item,
            key: item
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(item), 1)
            ]),
            _: 2
          }, 1032, ["value"]);
        }), 128))
      ])
    ]),
    _: 3
  }, 8, ["label", "disabled", "clearable", "placeholder", "size", "placement", "model-value", "transfer-class-name", "remote-method", "onOnSelect", "onOnClickoutside", "transfer", "capture", "eventsEnabled"]);
}
var AutoComplete = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { AutoComplete as default };
