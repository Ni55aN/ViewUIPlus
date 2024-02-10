import { getCurrentInstance, nextTick, resolveComponent, resolveDirective, withDirectives, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createVNode, toDisplayString, vShow, withModifiers, withCtx, Fragment, renderList } from "vue";
import Input from "../input/input.js";
import Drop from "../select/dropdown.js";
import Icon from "../icon/icon.js";
import Caspanel from "./caspanel.js";
import clickOutside from "../../directives/clickoutside.js";
import { oneOf, deepCopy } from "../../utils/assist.js";
import Locale from "../../mixins/locale.js";
import mixinsForm from "../../mixins/form.js";
import globalConfig from "../../mixins/globalConfig.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-cascader";
const selectPrefixCls = "ivu-select";
const _sfc_main = {
  name: "Cascader",
  mixins: [Locale, mixinsForm, globalConfig],
  components: { iInput: Input, Drop, Icon, Caspanel },
  directives: { clickOutside },
  emits: ["on-change", "on-visible-change", "update:modelValue"],
  provide() {
    return {
      CascaderInstance: this
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    modelValue: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
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
    trigger: {
      validator(value) {
        return oneOf(value, ["click", "hover"]);
      },
      default: "click"
    },
    changeOnSelect: {
      type: Boolean,
      default: false
    },
    renderFormat: {
      type: Function,
      default(label) {
        return label.join(" / ");
      }
    },
    loadData: {
      type: Function
    },
    filterable: {
      type: Boolean,
      default: false
    },
    notFoundText: {
      type: String
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
    capture: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI ? true : global.$VIEWUI.capture;
      }
    },
    transferClassName: {
      type: String
    },
    eventsEnabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls,
      selectPrefixCls,
      visible: false,
      selected: [],
      tmpSelected: [],
      updatingValue: false,
      currentValue: this.modelValue || [],
      query: "",
      validDataStr: "",
      isLoadedChildren: false,
      isValueNull: false,
      caspanelList: []
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-show-clear`]: this.showCloseIcon,
          [`${prefixCls}-size-${this.size}`]: !!this.size,
          [`${prefixCls}-visible`]: this.visible,
          [`${prefixCls}-disabled`]: this.itemDisabled,
          [`${prefixCls}-not-found`]: this.filterable && this.query !== "" && !this.querySelections.length
        }
      ];
    },
    showCloseIcon() {
      return this.currentValue && this.currentValue.length && this.clearable && !this.itemDisabled;
    },
    displayRender() {
      let label = [];
      for (let i = 0; i < this.selected.length; i++) {
        label.push(this.selected[i].label);
      }
      return this.renderFormat(label, this.selected);
    },
    displayInputRender() {
      return this.filterable ? "" : this.displayRender;
    },
    localePlaceholder() {
      if (this.placeholder === void 0) {
        return this.t("i.select.placeholder");
      } else {
        return this.placeholder;
      }
    },
    inputPlaceholder() {
      return this.filterable && this.currentValue.length ? null : this.localePlaceholder;
    },
    localeNotFoundText() {
      if (this.notFoundText === void 0) {
        return this.t("i.select.noMatch");
      } else {
        return this.notFoundText;
      }
    },
    querySelections() {
      let selections = [];
      function getSelections(arr, label, value) {
        const cloneArr = deepCopy(arr);
        for (let i = 0; i < cloneArr.length; i++) {
          let item = cloneArr[i];
          item.__label = label ? label + " / " + item.label : item.label;
          item.__value = value ? value + "," + item.value : item.value;
          if (item.children && item.children.length) {
            getSelections(item.children, item.__label, item.__value);
            delete item.__label;
            delete item.__value;
          } else {
            selections.push({
              label: item.__label,
              value: item.__value,
              display: item.__label,
              item,
              disabled: !!item.disabled
            });
          }
        }
      }
      getSelections(this.data);
      selections = selections.filter((item) => {
        return item.label ? item.label.indexOf(this.query) > -1 : false;
      }).map((item) => {
        item.display = item.display.replace(new RegExp(this.query, "g"), `<span>${this.query}</span>`);
        return item;
      });
      return selections;
    },
    arrowType() {
      const config = this.globalConfig;
      let type = "ios-arrow-down";
      if (config) {
        if (config.cascader.customArrow) {
          type = "";
        } else if (config.cascader.arrow) {
          type = config.cascader.arrow;
        }
      }
      return type;
    },
    customArrowType() {
      const config = this.globalConfig;
      let type = "";
      if (config) {
        if (config.cascader.customArrow) {
          type = config.cascader.customArrow;
        }
      }
      return type;
    },
    arrowSize() {
      const config = this.globalConfig;
      let size = "";
      if (config) {
        if (config.cascader.arrowSize) {
          size = config.cascader.arrowSize;
        }
      }
      return size;
    },
    dropdownCls() {
      return {
        [prefixCls + "-transfer"]: this.transfer,
        [this.transferClassName]: this.transferClassName
      };
    }
  },
  methods: {
    clearSelect() {
      if (this.itemDisabled)
        return false;
      const oldVal = JSON.stringify(this.currentValue);
      this.currentValue = this.selected = this.tmpSelected = [];
      this.handleClose();
      this.emitValue(this.currentValue, oldVal);
      this.caspanelList.forEach((item) => {
        item.caspanel.handleOnClear();
      });
    },
    handleClose() {
      this.visible = false;
    },
    toggleOpen() {
      if (this.itemDisabled)
        return false;
      if (this.visible) {
        if (!this.filterable)
          this.handleClose();
      } else {
        this.onFocus();
      }
    },
    onFocus() {
      this.visible = true;
      if (!this.currentValue.length) {
        this.caspanelList.forEach((item) => {
          item.caspanel.handleOnClear();
        });
      }
    },
    updateResult(result) {
      this.tmpSelected = result;
    },
    updateSelected(init = false, changeOnSelectDataChange = false) {
      if (!this.changeOnSelect || init || changeOnSelectDataChange) {
        this.caspanelList.forEach((item) => {
          item.caspanel.handleOnFindSelected({
            value: this.currentValue
          });
        });
      }
    },
    emitValue(val, oldVal) {
      if (JSON.stringify(val) !== oldVal) {
        this.$emit("on-change", this.currentValue, JSON.parse(JSON.stringify(this.selected)));
        nextTick(() => {
          this.handleFormItemChange("change", {
            value: this.currentValue,
            selected: JSON.parse(JSON.stringify(this.selected))
          });
        });
      }
    },
    handleInput(event) {
      this.query = event.target.value;
    },
    handleSelectItem(index) {
      const item = this.querySelections[index];
      if (item.item.disabled)
        return false;
      this.query = "";
      this.$refs.input.currentValue = "";
      const oldVal = JSON.stringify(this.currentValue);
      this.currentValue = item.value.split(",");
      setTimeout(() => {
        this.emitValue(this.currentValue, oldVal);
        this.handleClose();
      }, 0);
    },
    handleFocus() {
      this.$refs.input.focus();
    },
    getValidData(data) {
      const cloneData = deepCopy(data);
      function deleteData(item) {
        const new_item = Object.assign({}, item);
        if ("loading" in new_item) {
          delete new_item.loading;
        }
        if ("__value" in new_item) {
          delete new_item.__value;
        }
        if ("__label" in new_item) {
          delete new_item.__label;
        }
        if ("children" in new_item && new_item.children.length) {
          new_item.children = new_item.children.map((i) => deleteData(i));
        }
        return new_item;
      }
      return cloneData.map((item) => deleteData(item));
    },
    handleOnResultChange(params) {
      const lastValue = params.lastValue;
      const changeOnSelect = params.changeOnSelect;
      const fromInit = params.fromInit;
      if (lastValue || changeOnSelect) {
        const oldVal = JSON.stringify(this.currentValue);
        this.selected = this.tmpSelected;
        let newVal = [];
        this.selected.forEach((item) => {
          newVal.push(item.value);
        });
        if (!fromInit) {
          this.updatingValue = true;
          this.currentValue = newVal;
          this.emitValue(this.currentValue, oldVal);
        }
      }
      if (lastValue && !fromInit) {
        this.handleClose();
      }
    }
  },
  created() {
    this.validDataStr = JSON.stringify(this.getValidData(this.data));
  },
  mounted() {
    this.updateSelected(true);
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.currentValue.length) {
          this.updateSelected();
        }
        if (this.transfer) {
          this.$refs.drop.update();
        }
        this.$refs.drop.handleOnUpdatePopper();
      } else {
        if (this.filterable) {
          this.query = "";
          this.$refs.input.currentValue = "";
        }
        if (this.transfer) {
          this.$refs.drop.destroy();
        }
        this.$refs.drop.handleOnDestroyPopper();
      }
      this.$emit("on-visible-change", val);
    },
    modelValue(val) {
      if (val === null)
        this.isValueNull = true;
      this.currentValue = val || [];
      if (val === null || !val.length)
        this.selected = [];
    },
    currentValue() {
      if (this.isValueNull) {
        this.isValueNull = false;
        this.$emit("update:modelValue", null);
      } else {
        this.$emit("update:modelValue", this.currentValue);
      }
      if (this.updatingValue) {
        this.updatingValue = false;
        return;
      }
      this.updateSelected(true);
    },
    data: {
      deep: true,
      handler() {
        const validDataStr = JSON.stringify(this.getValidData(this.data));
        if (validDataStr !== this.validDataStr) {
          this.validDataStr = validDataStr;
          if (!this.isLoadedChildren) {
            nextTick(() => this.updateSelected(false, this.changeOnSelect));
          }
          this.isLoadedChildren = false;
        }
      }
    }
  }
};
const _hoisted_1 = ["name", "value"];
const _hoisted_2 = ["onClick", "innerHTML"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_input = resolveComponent("i-input");
  const _component_Icon = resolveComponent("Icon");
  const _component_Caspanel = resolveComponent("Caspanel");
  const _component_Drop = resolveComponent("Drop");
  const _directive_click_outside = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes)
  }, [
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-rel"]),
      onClick: _cache[1] || (_cache[1] = (...args) => $options.toggleOpen && $options.toggleOpen(...args)),
      ref: "reference"
    }, [
      createElementVNode("input", {
        type: "hidden",
        name: $props.name,
        value: $data.currentValue
      }, null, 8, _hoisted_1),
      renderSlot(_ctx.$slots, "default", {}, () => [
        createVNode(_component_i_input, {
          "element-id": $props.elementId,
          ref: "input",
          readonly: !$props.filterable,
          disabled: _ctx.itemDisabled,
          modelValue: $options.displayInputRender,
          onOnChange: $options.handleInput,
          size: $props.size,
          placeholder: $options.inputPlaceholder
        }, null, 8, ["element-id", "readonly", "disabled", "modelValue", "onOnChange", "size", "placeholder"]),
        withDirectives(createElementVNode("div", {
          class: normalizeClass([$data.prefixCls + "-label"]),
          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleFocus && $options.handleFocus(...args))
        }, toDisplayString($options.displayRender), 3), [
          [vShow, $props.filterable && $data.query === ""]
        ]),
        withDirectives(createVNode(_component_Icon, {
          type: "ios-close-circle",
          class: normalizeClass([$data.prefixCls + "-arrow"]),
          onClick: withModifiers($options.clearSelect, ["stop"])
        }, null, 8, ["class", "onClick"]), [
          [vShow, $options.showCloseIcon]
        ]),
        createVNode(_component_Icon, {
          type: $options.arrowType,
          custom: $options.customArrowType,
          size: $options.arrowSize,
          class: normalizeClass([$data.prefixCls + "-arrow"])
        }, null, 8, ["type", "custom", "size", "class"])
      ])
    ], 2),
    createVNode(_component_Drop, {
      ref: "drop",
      visible: $data.visible,
      classes: $options.dropdownCls,
      eventsEnabled: $props.eventsEnabled,
      "transition-name": "transition-drop",
      transfer: $props.transfer
    }, {
      default: withCtx(() => [
        createElementVNode("div", null, [
          withDirectives(createVNode(_component_Caspanel, {
            ref: "caspanel",
            "prefix-cls": $data.prefixCls,
            data: $props.data,
            disabled: _ctx.itemDisabled,
            "change-on-select": $props.changeOnSelect,
            trigger: $props.trigger
          }, null, 8, ["prefix-cls", "data", "disabled", "change-on-select", "trigger"]), [
            [vShow, !$props.filterable || $props.filterable && $data.query === ""]
          ]),
          withDirectives(createElementVNode("div", {
            class: normalizeClass([$data.prefixCls + "-dropdown"])
          }, [
            createElementVNode("ul", {
              class: normalizeClass([$data.selectPrefixCls + "-dropdown-list"])
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($options.querySelections, (item, index) => {
                return openBlock(), createElementBlock("li", {
                  class: normalizeClass([$data.selectPrefixCls + "-item", {
                    [$data.selectPrefixCls + "-item-disabled"]: item.disabled
                  }]),
                  key: index,
                  onClick: ($event) => $options.handleSelectItem(index),
                  innerHTML: item.display
                }, null, 10, _hoisted_2);
              }), 128))
            ], 2)
          ], 2), [
            [vShow, $props.filterable && $data.query !== "" && $options.querySelections.length]
          ]),
          withDirectives(createElementVNode("ul", {
            class: normalizeClass([$data.prefixCls + "-not-found-tip"])
          }, [
            createElementVNode("li", null, toDisplayString($options.localeNotFoundText), 1)
          ], 2), [
            [vShow, $props.filterable && $data.query !== "" && !$options.querySelections.length || !$props.data.length]
          ])
        ])
      ]),
      _: 1
    }, 8, ["visible", "classes", "eventsEnabled", "transfer"])
  ], 2)), [
    [_directive_click_outside, $options.handleClose]
  ]);
}
var Cascader = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Cascader as default };
