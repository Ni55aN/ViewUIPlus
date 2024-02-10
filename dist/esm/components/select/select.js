import { getCurrentInstance, nextTick, resolveComponent, resolveDirective, withDirectives, openBlock, createElementBlock, normalizeClass, createElementVNode, withKeys, withModifiers, renderSlot, createVNode, withCtx, toDisplayString, vShow, createTextVNode, createCommentVNode } from "vue";
import Drop from "./dropdown.js";
import Icon from "../icon/icon.js";
import SelectHead from "./select-head.js";
import { directive } from "../../directives/v-click-outside-x.js";
import { oneOf } from "../../utils/assist.js";
import mixinsForm from "../../mixins/form.js";
import Locale from "../../mixins/locale.js";
import { isClient } from "../../utils/index.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-select";
const checkValuesNotEqual = (value, publicValue, values) => {
  const strValue = JSON.stringify(value);
  const strPublic = JSON.stringify(publicValue);
  const strValues = JSON.stringify(values.map((item) => {
    return item.value;
  }));
  return strValue !== strPublic || strValue !== strValues || strValues !== strPublic;
};
const ANIMATION_TIMEOUT = 300;
const _sfc_main = {
  name: "iSelect",
  mixins: [Locale, mixinsForm],
  components: { Drop, SelectHead, Icon },
  directives: { clickOutside: directive },
  emits: ["on-set-default-options", "on-clear", "on-clickoutside", "on-select", "on-create", "on-change", "on-query-change", "on-open-change", "update:modelValue"],
  provide() {
    return {
      SelectInstance: this
    };
  },
  props: {
    modelValue: {
      type: [String, Number, Array],
      default: ""
    },
    label: {
      type: [String, Number, Array],
      default: ""
    },
    defaultLabel: {
      type: [String, Number, Array],
      default: ""
    },
    multiple: {
      type: Boolean,
      default: false
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
    filterable: {
      type: Boolean,
      default: false
    },
    filterMethod: {
      type: Function
    },
    remoteMethod: {
      type: Function
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
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
    labelInValue: {
      type: Boolean,
      default: false
    },
    notFoundText: {
      type: String
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
    autoComplete: {
      type: Boolean,
      default: false
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
    prefix: {
      type: String
    },
    maxTagCount: {
      type: Number
    },
    maxTagPlaceholder: {
      type: Function
    },
    allowCreate: {
      type: Boolean,
      default: false
    },
    capture: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI ? true : global.$VIEWUI.capture;
      }
    },
    filterByLabel: {
      type: Boolean,
      default: false
    },
    eventsEnabled: {
      type: Boolean,
      default: false
    },
    hideNotFound: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (!this.remote && this.slotOptions.length > 0) {
      this.values = this.getInitialValue().map((value) => {
        if (typeof value !== "number" && !value)
          return null;
        return this.getOptionData(value);
      }).filter(Boolean);
    }
    this.checkUpdateStatus();
    if (this.remote && this.modelValue && this.defaultLabel) {
      if (!this.multiple) {
        this.query = this.defaultLabel;
        if (this.modelValue && this.defaultLabel) {
          this.values.push({
            label: this.defaultLabel,
            value: this.modelValue
          });
        }
      } else if (this.multiple && this.defaultLabel instanceof Array && this.modelValue.length === this.defaultLabel.length) {
        const values = this.modelValue.map((item, index) => {
          return {
            value: item,
            label: this.defaultLabel[index]
          };
        });
        setTimeout(() => {
          this.values = values;
        });
      }
    }
  },
  data() {
    return {
      prefixCls,
      values: [],
      dropDownWidth: 0,
      visible: false,
      focusIndex: -1,
      isFocused: false,
      query: "",
      initialLabel: this.label,
      hasMouseHoverHead: false,
      slotOptions: [],
      caretPosition: -1,
      lastRemoteQuery: "",
      unchangedQuery: true,
      hasExpectedValue: false,
      isTyping: false,
      preventRemoteCall: false,
      filterQueryChange: false,
      slotOptionsMap: /* @__PURE__ */ new Map(),
      isLocking: false
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-visible`]: this.visible,
          [`${prefixCls}-disabled`]: this.itemDisabled,
          [`${prefixCls}-multiple`]: this.multiple,
          [`${prefixCls}-single`]: !this.multiple,
          [`${prefixCls}-${this.size}`]: !!this.size
        }
      ];
    },
    dropdownCls() {
      return {
        [prefixCls + "-dropdown-transfer"]: this.transfer,
        [prefixCls + "-multiple"]: this.multiple && this.transfer,
        ["ivu-auto-complete"]: this.autoComplete,
        [this.transferClassName]: this.transferClassName
      };
    },
    selectionCls() {
      return {
        [`${prefixCls}-selection`]: !this.autoComplete,
        [`${prefixCls}-selection-focused`]: this.isFocused
      };
    },
    localeNotFoundText() {
      if (typeof this.notFoundText === "undefined") {
        return this.t("i.select.noMatch");
      } else {
        return this.notFoundText;
      }
    },
    localeLoadingText() {
      if (typeof this.loadingText === "undefined") {
        return this.t("i.select.loading");
      } else {
        return this.loadingText;
      }
    },
    showCreateItem() {
      let state = false;
      const { allowCreate, query, slotOptions } = this;
      if (allowCreate && query !== "") {
        state = true;
        const findSlotItem = (slotOptions || []).find((item) => item.proxy && item.proxy.showLabel === query);
        if (findSlotItem)
          state = false;
      }
      return state;
    },
    transitionName() {
      return this.placement === "bottom" ? "slide-up" : "slide-down";
    },
    dropVisible() {
      let status = true;
      const noOptions = this.slotOptions.length === 0;
      if (!this.loading && this.remote && this.query === "" && noOptions)
        status = false;
      if (this.autoComplete && noOptions)
        status = false;
      return this.visible && status;
    },
    showNotFoundLabel() {
      const { loading, remote, slotOptions, hideNotFound } = this;
      const options = slotOptions || [];
      const filterOptions = options.find((item) => item.proxy.isShow);
      return (options.length === 0 || !filterOptions) && (!remote || remote && !loading) && !hideNotFound;
    },
    publicValue() {
      return this.multiple ? this.values.map((option) => option.value) : (this.values[0] || {}).value;
    },
    canBeCleared() {
      const uiStateMatch = this.hasMouseHoverHead;
      const qualifiesForClear = !this.multiple && !this.itemDisabled && this.clearable;
      return uiStateMatch && qualifiesForClear && this.reset;
    },
    selectTabindex() {
      return this.itemDisabled || this.filterable ? -1 : 0;
    },
    remote() {
      return typeof this.remoteMethod === "function";
    }
  },
  methods: {
    setQuery(query) {
      if (query) {
        this.onQueryChange(query);
        return;
      }
      if (query === null) {
        this.onQueryChange("");
        this.values = [];
        this.lastRemoteQuery = "";
      }
    },
    clearSingleSelect() {
      if (!this.multiple)
        this.$emit("update:modelValue", "");
      this.$emit("on-clear");
      this.hideMenu();
      if (this.clearable)
        this.reset();
    },
    getOptionData(value) {
      const optionItem = this.slotOptions.find(({ props }) => props.value === value);
      if (!optionItem)
        return null;
      const { optionLabel, disabled } = optionItem.proxy || {};
      return {
        value,
        label: optionLabel,
        disabled
      };
    },
    getInitialValue() {
      const { multiple, remote, modelValue } = this;
      let initialValue = Array.isArray(modelValue) ? modelValue : [modelValue];
      if (!multiple && (typeof initialValue[0] === "undefined" || String(initialValue[0]).trim() === "" && !Number.isFinite(initialValue[0])))
        initialValue = [];
      if (remote && !multiple && modelValue) {
        const data = this.getOptionData(modelValue);
        this.query = data ? data.label : String(modelValue);
      }
      return initialValue.filter((item) => {
        return Boolean(item) || item === 0;
      });
    },
    validateOption({ children, elm, propsData }) {
      const value = propsData.value;
      const label = propsData.label || "";
      const textContent = elm && elm.textContent || (children || []).reduce((str, node) => {
        const nodeText = node.elm ? node.elm.textContent : node.text;
        return `${str} ${nodeText}`;
      }, "") || "";
      const stringValues = this.filterByLabel ? [label].toString() : [value, label, textContent].toString();
      const query = this.query.toLowerCase().trim();
      return stringValues.toLowerCase().includes(query);
    },
    toggleMenu(e, force) {
      if (this.itemDisabled) {
        return false;
      }
      this.visible = typeof force !== "undefined" ? force : !this.visible;
      if (this.visible) {
        this.dropDownWidth = this.$el.getBoundingClientRect().width;
        this.$refs.dropdown.handleOnUpdatePopper();
      }
    },
    hideMenu() {
      this.toggleMenu(null, false);
      this.isTyping = false;
      setTimeout(() => this.unchangedQuery = true, ANIMATION_TIMEOUT);
    },
    onClickOutside(event) {
      if (this.visible) {
        if (event.type === "mousedown") {
          event.preventDefault();
          return;
        }
        if (this.transfer) {
          const $el = this.$refs.dropdown.$refs.drop;
          if ($el === event.target || $el.contains(event.target)) {
            return;
          }
        }
        if (this.filterable) {
          const input = this.$el.querySelector('input[type="text"]');
          this.caretPosition = input.selectionStart;
          nextTick(() => {
            const caretPosition = this.caretPosition === -1 ? input.value.length : this.caretPosition;
            input.setSelectionRange(caretPosition, caretPosition);
          });
        }
        if (!this.autoComplete)
          event.stopPropagation();
        event.preventDefault();
        this.hideMenu();
        this.isFocused = true;
        this.$emit("on-clickoutside", event);
      } else {
        this.caretPosition = -1;
        this.isFocused = false;
      }
    },
    reset() {
      this.query = "";
      this.focusIndex = -1;
      this.unchangedQuery = true;
      this.values = [];
      this.filterQueryChange = false;
    },
    handleKeydown(e) {
      const key = e.key || e.code;
      const keyCode = e.keyCode || e.which;
      if (key === "Backspace" || keyCode === 8) {
        return;
      }
      if (this.visible) {
        e.preventDefault();
        if (key === "Tab") {
          e.stopPropagation();
        }
        if (key === "Escape") {
          e.stopPropagation();
          this.hideMenu();
        }
        if (key === "ArrowUp") {
          this.navigateOptions(-1);
        }
        if (key === "ArrowDown") {
          this.navigateOptions(1);
        }
        if (key === "Enter") {
          if (this.focusIndex === -1)
            return this.hideMenu();
          const optionComponent = this.slotOptions[this.focusIndex];
          if (optionComponent) {
            const option = this.getOptionData(optionComponent.props.value);
            this.onOptionClick(option);
          } else {
            this.hideMenu();
          }
        }
      } else {
        const keysThatCanOpenSelect = ["ArrowUp", "ArrowDown"];
        if (keysThatCanOpenSelect.includes(e.key))
          this.toggleMenu(null, true);
      }
    },
    navigateOptions(direction) {
      const slotOptions = this.slotOptions;
      const optionsLength = slotOptions.length - 1;
      if (optionsLength < 0)
        return;
      let index = this.focusIndex + direction;
      if (index < 0)
        index = optionsLength;
      if (index > optionsLength)
        index = 0;
      let nearestActiveOption;
      let firseIndex = null;
      if (direction > 0) {
        nearestActiveOption = -1;
        for (let i = 0; i < slotOptions.length; i++) {
          const { proxy } = slotOptions[i];
          const optionIsActive = !proxy.disabled;
          if (optionIsActive)
            nearestActiveOption = i;
          if (proxy.isShow && firseIndex === null) {
            firseIndex = i;
          } else if (!proxy.isShow) {
            nearestActiveOption = i;
            continue;
          }
          if (nearestActiveOption >= index)
            break;
        }
      } else {
        nearestActiveOption = slotOptions.length;
        for (let i = optionsLength; i >= 0; i--) {
          const { proxy } = slotOptions[i];
          const optionIsActive = !proxy.disabled;
          if (optionIsActive)
            nearestActiveOption = i;
          if (proxy.isShow && firseIndex === null) {
            firseIndex = i;
          } else if (!proxy.isShow) {
            nearestActiveOption = i;
            continue;
          }
          if (nearestActiveOption <= index)
            break;
        }
      }
      const activeSlotsOption = slotOptions[nearestActiveOption];
      index = !activeSlotsOption.proxy.isShow ? firseIndex : nearestActiveOption;
      this.focusIndex = index;
    },
    onOptionClick(option) {
      if (this.multiple) {
        if (this.remote)
          this.lastRemoteQuery = this.lastRemoteQuery || this.query;
        else
          this.lastRemoteQuery = "";
        const valueIsSelected = this.values.find(({ value }) => value === option.value);
        if (valueIsSelected) {
          this.values = this.values.filter(({ value }) => value !== option.value);
        } else {
          this.values = this.values.concat(option);
        }
        this.isFocused = true;
      } else {
        this.query = String(option.label).trim();
        this.values = [option];
        this.lastRemoteQuery = "";
        this.hideMenu();
      }
      this.focusIndex = this.slotOptions.findIndex((opt) => {
        if (!opt)
          return false;
        return opt.props.value === option.value;
      });
      if (this.filterable) {
        const inputField = this.$el.querySelector('input[type="text"]');
        if (!this.autoComplete)
          nextTick(() => inputField.focus());
      }
      this.$emit("on-select", option);
      this.$refs.dropdown.handleOnUpdatePopper();
      setTimeout(() => {
        this.filterQueryChange = false;
      }, ANIMATION_TIMEOUT);
    },
    onQueryChange(query) {
      this.isTyping = true;
      if (query.length > 0 && query !== this.query) {
        if (isClient && this.autoComplete) {
          let isInputFocused = document.hasFocus && document.hasFocus() && document.activeElement === this.$el.querySelector("input");
          this.visible = isInputFocused;
        } else {
          this.visible = true;
        }
      }
      this.query = query;
      this.unchangedQuery = this.visible;
      this.filterQueryChange = true;
    },
    toggleHeaderFocus({ type }) {
      if (this.itemDisabled) {
        return;
      }
      this.isFocused = type === "focus";
    },
    checkUpdateStatus() {
      if (this.getInitialValue().length > 0 && this.slotOptions.length === 0) {
        this.hasExpectedValue = true;
      }
    },
    handleCreateItem() {
      if (this.allowCreate && this.query !== "" && this.showCreateItem) {
        const query = this.query;
        this.$emit("on-create", query);
        this.query = "";
        const option = {
          value: query,
          label: query,
          tag: void 0
        };
        this.$refs.dropdown.handleOnUpdatePopper();
        setTimeout(() => {
          this.onOptionClick(option);
        });
      }
    },
    handleOnSelectSelected(options) {
      this.onOptionClick(options);
    },
    focus() {
      if (this.filterable) {
        this.$refs.selectHead.$refs.input.focus();
        this.toggleMenu();
      }
    },
    lazyUpdateValue(checked) {
      const { getInitialValue, isLocking, defaultLabel, remote, modelValue, values } = this;
      const hasDefaultLabel = !!(defaultLabel && defaultLabel.length);
      const hasModelValue = !!(modelValue && modelValue.length);
      if ((hasModelValue || values.length || hasDefaultLabel) && remote && checked)
        return;
      if (isLocking)
        return;
      this.isLocking = true;
      nextTick(() => {
        this.values = getInitialValue().map(this.getOptionData).filter(Boolean);
        this.isLocking = false;
      });
    }
  },
  watch: {
    modelValue(value) {
      const { publicValue, values } = this;
      this.checkUpdateStatus();
      if (value === "") {
        this.values = [];
        this.query = "";
      } else if (checkValuesNotEqual(value, publicValue, values)) {
        this.lazyUpdateValue();
        if (!this.multiple)
          this.handleFormItemChange("change", this.publicValue);
      }
    },
    values(now, before) {
      const newValue = JSON.stringify(now);
      const oldValue = JSON.stringify(before);
      let vModelValue = this.publicValue;
      const shouldEmitInput = newValue !== oldValue && vModelValue !== this.modelValue;
      if (shouldEmitInput) {
        let emitValue = this.publicValue;
        if (this.labelInValue) {
          if (this.multiple) {
            emitValue = this.values;
          } else {
            emitValue = this.values[0];
          }
        }
        if (Array.isArray(vModelValue) && !vModelValue.length && this.modelValue === null)
          vModelValue = null;
        else if (vModelValue === void 0 && this.modelValue === null)
          vModelValue = null;
        this.$emit("update:modelValue", vModelValue);
        this.$emit("on-change", emitValue);
        this.handleFormItemChange("change", emitValue);
      }
    },
    query(query) {
      this.focusIndex = -1;
      this.$emit("on-query-change", query);
      const { remoteMethod, lastRemoteQuery } = this;
      const hasValidQuery = query !== "" && (query !== lastRemoteQuery || !lastRemoteQuery);
      const shouldCallRemoteMethod = remoteMethod && hasValidQuery && !this.preventRemoteCall;
      this.preventRemoteCall = false;
      if (shouldCallRemoteMethod) {
        const promise = this.remoteMethod(query);
        this.initialLabel = "";
        if (promise && promise.then) {
          promise.then((options) => {
            if (options)
              this.options = options;
          });
        }
      }
      if (this.visible) {
        this.$refs.dropdown.handleOnUpdatePopper();
      }
      if (query !== "" && this.remote)
        this.lastRemoteQuery = query;
    },
    isFocused(focused) {
      const el = this.filterable ? this.$el.querySelector('input[type="text"]') : this.$el;
      el[this.isFocused ? "focus" : "blur"]();
      const [selectedOption] = this.values;
      if (selectedOption && this.filterable && !this.multiple && !focused) {
        const selectedLabel = String(selectedOption.label || selectedOption.value).trim();
        if (selectedLabel && this.query !== selectedLabel) {
          this.preventRemoteCall = true;
          this.query = selectedLabel;
        }
      }
    },
    focusIndex(index) {
      if (index < 0 || this.autoComplete)
        return;
      if (this.slotOptions[index]) {
        const optionInstance = this.slotOptions[index].proxy;
        const $itemEle = optionInstance.$el;
        const $drop = this.$refs.dropdown.$refs.drop;
        let bottomOverflowDistance = $itemEle.getBoundingClientRect().bottom - $drop.getBoundingClientRect().bottom;
        let topOverflowDistance = $itemEle.getBoundingClientRect().top - $drop.getBoundingClientRect().top;
        if (bottomOverflowDistance > 0) {
          $drop.scrollTop += bottomOverflowDistance;
        }
        if (topOverflowDistance < 0) {
          $drop.scrollTop += topOverflowDistance;
        }
      }
    },
    dropVisible(open) {
      if (open) {
        this.$refs.dropdown.handleOnUpdatePopper();
      } else {
        this.$refs.dropdown.handleOnDestroyPopper();
      }
    },
    visible(state) {
      this.$emit("on-open-change", state);
    }
  }
};
const _hoisted_1 = ["tabindex"];
const _hoisted_2 = ["name", "value"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_select_head = resolveComponent("select-head");
  const _component_Icon = resolveComponent("Icon");
  const _component_Drop = resolveComponent("Drop");
  const _directive_click_outside = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes)
  }, [
    createElementVNode("div", {
      ref: "reference",
      class: normalizeClass($options.selectionCls),
      tabindex: $options.selectTabindex,
      onBlur: _cache[2] || (_cache[2] = (...args) => $options.toggleHeaderFocus && $options.toggleHeaderFocus(...args)),
      onFocus: _cache[3] || (_cache[3] = (...args) => $options.toggleHeaderFocus && $options.toggleHeaderFocus(...args)),
      onClick: _cache[4] || (_cache[4] = (...args) => $options.toggleMenu && $options.toggleMenu(...args)),
      onKeydown: [
        _cache[5] || (_cache[5] = withKeys((...args) => $options.handleKeydown && $options.handleKeydown(...args), ["esc"])),
        _cache[6] || (_cache[6] = withKeys((...args) => $options.handleKeydown && $options.handleKeydown(...args), ["enter"])),
        _cache[7] || (_cache[7] = withKeys(withModifiers((...args) => $options.handleKeydown && $options.handleKeydown(...args), ["prevent"]), ["up"])),
        _cache[8] || (_cache[8] = withKeys(withModifiers((...args) => $options.handleKeydown && $options.handleKeydown(...args), ["prevent"]), ["down"])),
        _cache[9] || (_cache[9] = withKeys((...args) => $options.handleKeydown && $options.handleKeydown(...args), ["tab"])),
        _cache[10] || (_cache[10] = withKeys((...args) => $options.handleKeydown && $options.handleKeydown(...args), ["delete"]))
      ],
      onMouseenter: _cache[11] || (_cache[11] = ($event) => $data.hasMouseHoverHead = true),
      onMouseleave: _cache[12] || (_cache[12] = ($event) => $data.hasMouseHoverHead = false)
    }, [
      renderSlot(_ctx.$slots, "input", {}, () => [
        createElementVNode("input", {
          type: "hidden",
          name: $props.name,
          value: $options.publicValue
        }, null, 8, _hoisted_2),
        createVNode(_component_select_head, {
          ref: "selectHead",
          filterable: $props.filterable,
          multiple: $props.multiple,
          values: $data.values,
          clearable: $options.canBeCleared,
          prefix: $props.prefix,
          disabled: _ctx.itemDisabled,
          remote: $options.remote,
          "input-element-id": $props.elementId,
          "initial-label": $data.initialLabel,
          placeholder: $props.placeholder,
          "query-prop": $data.query,
          "max-tag-count": $props.maxTagCount,
          "max-tag-placeholder": $props.maxTagPlaceholder,
          "allow-create": $props.allowCreate,
          "show-create-item": $options.showCreateItem,
          onOnQueryChange: $options.onQueryChange,
          onOnInputFocus: _cache[0] || (_cache[0] = ($event) => $data.isFocused = true),
          onOnInputBlur: _cache[1] || (_cache[1] = ($event) => $data.isFocused = false),
          onOnClear: $options.clearSingleSelect,
          onOnEnter: $options.handleCreateItem
        }, {
          prefix: withCtx(() => [
            renderSlot(_ctx.$slots, "prefix")
          ]),
          _: 3
        }, 8, ["filterable", "multiple", "values", "clearable", "prefix", "disabled", "remote", "input-element-id", "initial-label", "placeholder", "query-prop", "max-tag-count", "max-tag-placeholder", "allow-create", "show-create-item", "onOnQueryChange", "onOnClear", "onOnEnter"])
      ])
    ], 42, _hoisted_1),
    createVNode(_component_Drop, {
      ref: "dropdown",
      classes: $options.dropdownCls,
      visible: $options.dropVisible,
      placement: $props.placement,
      eventsEnabled: $props.eventsEnabled,
      transfer: $props.transfer,
      "transition-name": "transition-drop"
    }, {
      default: withCtx(() => [
        withDirectives(createElementVNode("ul", {
          class: normalizeClass([$data.prefixCls + "-not-found"])
        }, [
          createElementVNode("li", null, toDisplayString($options.localeNotFoundText), 1)
        ], 2), [
          [vShow, $options.showNotFoundLabel && !$props.allowCreate]
        ]),
        !$options.remote || $options.remote && !$props.loading ? (openBlock(), createElementBlock("ul", {
          key: 0,
          class: normalizeClass($data.prefixCls + "-dropdown-list")
        }, [
          $options.showCreateItem ? (openBlock(), createElementBlock("li", {
            key: 0,
            class: normalizeClass($data.prefixCls + "-item"),
            onClick: _cache[13] || (_cache[13] = (...args) => $options.handleCreateItem && $options.handleCreateItem(...args))
          }, [
            createTextVNode(toDisplayString($data.query) + " ", 1),
            createVNode(_component_Icon, {
              type: "md-return-left",
              class: normalizeClass($data.prefixCls + "-item-enter")
            }, null, 8, ["class"])
          ], 2)) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "default")
        ], 2)) : (openBlock(), createElementBlock("ul", {
          key: 1,
          class: normalizeClass($data.prefixCls + "-dropdown-list")
        }, [
          $options.showCreateItem ? (openBlock(), createElementBlock("li", {
            key: 0,
            class: normalizeClass($data.prefixCls + "-item"),
            onClick: _cache[14] || (_cache[14] = (...args) => $options.handleCreateItem && $options.handleCreateItem(...args))
          }, [
            createTextVNode(toDisplayString($data.query) + " ", 1),
            createVNode(_component_Icon, {
              type: "md-return-left",
              class: normalizeClass($data.prefixCls + "-item-enter")
            }, null, 8, ["class"])
          ], 2)) : createCommentVNode("", true)
        ], 2)),
        withDirectives(createElementVNode("ul", {
          class: normalizeClass([$data.prefixCls + "-loading"])
        }, toDisplayString($options.localeLoadingText), 3), [
          [vShow, $props.loading]
        ])
      ]),
      _: 3
    }, 8, ["classes", "visible", "placement", "eventsEnabled", "transfer"])
  ], 2)), [
    [_directive_click_outside, $options.onClickOutside, $props.capture],
    [
      _directive_click_outside,
      $options.onClickOutside,
      $props.capture,
      { mousedown: true }
    ],
    [
      _directive_click_outside,
      $options.onClickOutside,
      $props.capture,
      { touchstart: true }
    ]
  ]);
}
var Select = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Select as default };
