import mixinsForm from "../../mixins/form.js";
import { typeOf, findComponentUpward } from "../../utils/assist.js";
import random from "../../utils/random_str.js";
import { getCurrentInstance, nextTick, withDirectives, openBlock, createElementBlock, normalizeClass, withModifiers, renderSlot, createTextVNode, toDisplayString, vShow } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-select-item";
const _sfc_main = {
  name: "iOption",
  componentName: "select-item",
  mixins: [mixinsForm],
  emits: ["on-select-selected"],
  inject: {
    SelectInstance: {
      default: null
    },
    OptionGroupInstance: {
      default: null
    }
  },
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    label: {
      type: [String, Number]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tag: {
      type: [String, Number]
    }
  },
  data() {
    return {
      searchLabel: "",
      autoComplete: false,
      id: random(6),
      instance: null
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-disabled`]: this.itemDisabled,
          [`${prefixCls}-selected`]: this.selected && !this.autoComplete,
          [`${prefixCls}-focus`]: this.isFocused
        }
      ];
    },
    showLabel() {
      return this.label ? this.label : this.value;
    },
    optionLabel() {
      return this.label || this.$el && this.$el.textContent;
    },
    isFocused() {
      const SelectInstance = this.SelectInstance;
      let slotOptions = SelectInstance.slotOptions || [];
      const focusIndex = SelectInstance.focusIndex;
      const defaultSlot = SelectInstance.$slots.default;
      if (this.autoComplete && defaultSlot) {
        slotOptions = [];
        let vNodes = defaultSlot();
        while (vNodes.length > 0) {
          const vNode = vNodes.shift();
          if (vNode.type && typeof vNode.type === "object" && vNode.type.name === "iOption") {
            slotOptions.push(vNode);
          } else {
            if (Array.isArray(vNode.children)) {
              vNodes = vNodes.concat(vNode.children);
            }
          }
        }
      }
      const focusOption = slotOptions[focusIndex];
      return focusOption && focusOption.props && focusOption.props.value === this.value;
    },
    isShow() {
      const SelectInstance = this.SelectInstance;
      const filterable = SelectInstance.filterable;
      const query = SelectInstance.query.toLowerCase().trim();
      const filterByLabel = SelectInstance.filterByLabel;
      const slotOptionsMap = SelectInstance.slotOptionsMap;
      const { props } = slotOptionsMap.get(this.value) || { props: {} };
      const label = this.label || this.$el && this.$el.textContent;
      let filterOption = (label || props.value || "").toLowerCase();
      if (filterByLabel) {
        filterOption = (label || "").toLowerCase();
      }
      const showFilterOption = filterOption.includes(query);
      return !filterable || filterable && (showFilterOption || !SelectInstance.filterQueryChange) || typeOf(SelectInstance.remoteMethod) === "function";
    },
    selected() {
      const SelectInstance = this.SelectInstance;
      const values = SelectInstance.values || [];
      return values.find((item) => item.value === this.value);
    }
  },
  methods: {
    select() {
      if (this.itemDisabled)
        return false;
      this.SelectInstance.handleOnSelectSelected({
        value: this.value,
        label: this.optionLabel,
        tag: this.tag
      });
    },
    addOption() {
      const select = this.SelectInstance;
      const group = this.OptionGroupInstance;
      const { id, value, instance } = this;
      if (group) {
        group.optionList.push({
          ...instance,
          id,
          tag: "option"
        });
      }
      if (select) {
        select.slotOptions.push({
          ...instance,
          id,
          tag: "option"
        });
        select.slotOptionsMap.set(value, instance);
        const { modelValue } = select;
        (modelValue && modelValue.length || typeOf(modelValue) === "number") && select.lazyUpdateValue(true);
      }
    },
    removeOption() {
      const group = this.OptionGroupInstance;
      const select = this.SelectInstance;
      const { id, value } = this;
      if (group) {
        const index = group.optionList.findIndex((item) => item.id === id);
        index !== -1 && group.optionList.splice(index, 1);
      }
      if (select) {
        const select2 = this.SelectInstance;
        const index = select2.slotOptions.findIndex((item) => item.id === id);
        index !== -1 && select2.slotOptions.splice(index, 1);
        select2.slotOptionsMap.has(value) && select2.slotOptionsMap.delete(value);
      }
    }
  },
  created() {
    this.instance = getCurrentInstance();
  },
  mounted() {
    this.addOption();
    const Select = findComponentUpward(this, "iSelect");
    if (Select) {
      this.autoComplete = Select.autoComplete;
    }
  },
  beforeUnmount() {
    nextTick(() => {
      this.removeOption();
      this.instance = null;
    });
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return withDirectives((openBlock(), createElementBlock("li", {
    class: normalizeClass($options.classes),
    onClick: _cache[0] || (_cache[0] = withModifiers((...args) => $options.select && $options.select(...args), ["stop"])),
    onMousedown: _cache[1] || (_cache[1] = withModifiers(() => {
    }, ["prevent"]))
  }, [
    renderSlot(_ctx.$slots, "default", {}, () => [
      createTextVNode(toDisplayString($options.showLabel), 1)
    ])
  ], 34)), [
    [vShow, $options.isShow]
  ]);
}
var iOption = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { iOption as default };
