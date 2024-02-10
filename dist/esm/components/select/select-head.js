import { nextTick, resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createBlock, createCommentVNode, Fragment, renderList, createElementVNode, toDisplayString, withModifiers, createTextVNode, withDirectives, vShow, normalizeStyle, withKeys, vModelText } from "vue";
import Icon from "../icon/icon.js";
import Locale from "../../mixins/locale.js";
import globalConfig from "../../mixins/globalConfig.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-select";
const _sfc_main = {
  name: "iSelectHead",
  mixins: [Locale, globalConfig],
  components: { Icon },
  emits: ["on-input-focus", "on-input-blur", "on-keydown", "on-enter", "on-clear", "on-query-change"],
  inject: ["SelectInstance"],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    remote: {
      type: Boolean,
      default: false
    },
    initialLabel: {
      type: [String, Number, Array]
    },
    values: {
      type: Array,
      default: () => []
    },
    clearable: {
      type: [Function, Boolean],
      default: false
    },
    inputElementId: {
      type: String
    },
    placeholder: {
      type: String
    },
    queryProp: {
      type: String,
      default: ""
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
      type: Boolean
    },
    showCreateItem: {
      type: Boolean
    }
  },
  data() {
    return {
      prefixCls,
      query: "",
      inputLength: 20,
      remoteInitialLabel: this.initialLabel,
      preventRemoteCall: false
    };
  },
  computed: {
    singleDisplayClasses() {
      const { filterable, multiple, showPlaceholder } = this;
      return [{
        [prefixCls + "-head-with-prefix"]: this.showPrefix,
        [prefixCls + "-placeholder"]: showPlaceholder && !filterable,
        [prefixCls + "-selected-value"]: !showPlaceholder && !multiple && !filterable
      }];
    },
    singleDisplayValue() {
      if (this.multiple && this.values.length > 0 || this.filterable)
        return "";
      return `${this.selectedSingle}` || this.localePlaceholder;
    },
    showPlaceholder() {
      let status = false;
      if (!this.multiple) {
        const value = this.values[0];
        if (typeof value === "undefined" || String(value).trim() === "") {
          status = !this.remoteInitialLabel;
        }
      } else {
        if (!this.values.length > 0) {
          status = true;
        }
      }
      return status;
    },
    resetSelect() {
      return !this.showPlaceholder && this.clearable;
    },
    inputStyle() {
      let style = {};
      if (this.multiple) {
        if (this.showPlaceholder) {
          style.width = "100%";
        } else {
          style.width = `${this.inputLength}px`;
        }
      }
      return style;
    },
    localePlaceholder() {
      if (this.placeholder === void 0) {
        return this.t("i.select.placeholder");
      } else {
        return this.placeholder;
      }
    },
    selectedSingle() {
      const selected = this.values[0];
      return selected ? selected.label : this.remoteInitialLabel || "";
    },
    selectedMultiple() {
      const values = this.multiple ? this.values : [];
      return values.filter((item, index) => this.maxTagCount === void 0 || index < this.maxTagCount);
    },
    headCls() {
      return {
        [`${prefixCls}-head-flex`]: this.filterable && this.showPrefix
      };
    },
    arrowType() {
      const config = this.globalConfig;
      let type = "ios-arrow-down";
      if (config) {
        if (config.select.customArrow) {
          type = "";
        } else if (config.select.arrow) {
          type = config.select.arrow;
        }
      }
      return type;
    },
    customArrowType() {
      const config = this.globalConfig;
      let type = "";
      if (config) {
        if (config.select.customArrow) {
          type = config.select.customArrow;
        }
      }
      return type;
    },
    showPrefix() {
      const prefix = this.$slots.prefix && this.$slots.prefix();
      let visible = false;
      if (prefix) {
        visible = prefix[0].children.length > 0;
      }
      return visible || this.prefix;
    },
    arrowSize() {
      const config = this.globalConfig;
      let size = "";
      if (config) {
        if (config.select.arrowSize) {
          size = config.select.arrowSize;
        }
      }
      return size;
    }
  },
  methods: {
    onInputFocus() {
      this.$emit("on-input-focus");
    },
    onInputBlur() {
      if (this.showCreateItem)
        return;
      if (!this.values.length)
        this.query = "";
      this.$emit("on-input-blur");
    },
    removeTag(value) {
      if (this.disabled)
        return false;
      this.SelectInstance.handleOnSelectSelected(value);
    },
    resetInputState() {
      this.inputLength = this.$refs.input.value.length * 12 + 20;
      this.$emit("on-keydown");
    },
    handleInputDelete(e) {
      const targetValue = e.target.value;
      if (this.multiple && this.selectedMultiple.length && this.query === "" && targetValue === "") {
        this.removeTag(this.selectedMultiple[this.selectedMultiple.length - 1]);
      }
    },
    handleInputEnter(e) {
      this.$emit("on-enter");
      if (this.showCreateItem) {
        e.stopPropagation();
      }
    },
    onHeaderClick(e) {
      if (this.filterable && e.target === this.$el) {
        this.$refs.input.focus();
      }
    },
    onClear() {
      this.$emit("on-clear");
    }
  },
  watch: {
    values([value]) {
      if (!this.filterable)
        return;
      this.preventRemoteCall = true;
      if (this.multiple) {
        this.query = "";
        this.preventRemoteCall = false;
        return;
      }
      if (typeof value === "undefined" || value === "" || value === null)
        this.query = "";
      else
        this.query = value.label;
      nextTick(() => this.preventRemoteCall = false);
    },
    query(val) {
      if (this.preventRemoteCall) {
        this.preventRemoteCall = false;
        return;
      }
      this.$emit("on-query-change", val);
    },
    queryProp(query) {
      if (query !== this.query)
        this.query = query;
    }
  }
};
const _hoisted_1 = {
  key: 1,
  class: "ivu-tag ivu-tag-checked"
};
const _hoisted_2 = { class: "ivu-tag-text ivu-select-max-tag" };
const _hoisted_3 = ["id", "disabled", "placeholder"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createElementBlock("div", {
    onClick: _cache[6] || (_cache[6] = (...args) => $options.onHeaderClick && $options.onHeaderClick(...args)),
    class: normalizeClass($options.headCls)
  }, [
    $options.showPrefix ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass([$data.prefixCls + "-prefix"])
    }, [
      renderSlot(_ctx.$slots, "prefix", {}, () => [
        $props.prefix ? (openBlock(), createBlock(_component_Icon, {
          key: 0,
          type: $props.prefix
        }, null, 8, ["type"])) : createCommentVNode("", true)
      ])
    ], 2)) : createCommentVNode("", true),
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.selectedMultiple, (item, index) => {
      return openBlock(), createElementBlock("div", {
        class: "ivu-tag ivu-tag-checked",
        key: index
      }, [
        createElementVNode("span", {
          class: normalizeClass(["ivu-tag-text", { "ivu-select-multiple-tag-hidden": item.disabled }])
        }, toDisplayString(item.tag !== void 0 ? item.tag : item.label), 3),
        !item.disabled ? (openBlock(), createBlock(_component_Icon, {
          key: 0,
          type: "ios-close",
          onClick: withModifiers(($event) => $options.removeTag(item), ["stop"])
        }, null, 8, ["onClick"])) : createCommentVNode("", true)
      ]);
    }), 128)),
    $props.maxTagCount !== void 0 && $props.values.length > $props.maxTagCount ? (openBlock(), createElementBlock("div", _hoisted_1, [
      createElementVNode("span", _hoisted_2, [
        $props.maxTagPlaceholder ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createTextVNode(toDisplayString($props.maxTagPlaceholder($props.values.length - $props.maxTagCount)), 1)
        ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createTextVNode("+ " + toDisplayString($props.values.length - $props.maxTagCount) + "...", 1)
        ], 64))
      ])
    ])) : createCommentVNode("", true),
    withDirectives(createElementVNode("span", {
      class: normalizeClass($options.singleDisplayClasses)
    }, toDisplayString($options.singleDisplayValue), 3), [
      [vShow, $options.singleDisplayValue]
    ]),
    $props.filterable ? withDirectives((openBlock(), createElementBlock("input", {
      key: 2,
      id: $props.inputElementId,
      type: "text",
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.query = $event),
      disabled: $props.disabled,
      class: normalizeClass([$data.prefixCls + "-input"]),
      placeholder: $options.showPlaceholder ? $options.localePlaceholder : "",
      style: normalizeStyle($options.inputStyle),
      autocomplete: "off",
      spellcheck: "false",
      onKeydown: [
        _cache[1] || (_cache[1] = (...args) => $options.resetInputState && $options.resetInputState(...args)),
        _cache[2] || (_cache[2] = withKeys((...args) => $options.handleInputDelete && $options.handleInputDelete(...args), ["delete"])),
        _cache[3] || (_cache[3] = withKeys((...args) => $options.handleInputEnter && $options.handleInputEnter(...args), ["enter"]))
      ],
      onFocus: _cache[4] || (_cache[4] = (...args) => $options.onInputFocus && $options.onInputFocus(...args)),
      onBlur: _cache[5] || (_cache[5] = (...args) => $options.onInputBlur && $options.onInputBlur(...args)),
      ref: "input"
    }, null, 46, _hoisted_3)), [
      [vModelText, $data.query]
    ]) : createCommentVNode("", true),
    $options.resetSelect ? (openBlock(), createBlock(_component_Icon, {
      key: 3,
      type: "ios-close-circle",
      class: normalizeClass([$data.prefixCls + "-arrow"]),
      onClick: withModifiers($options.onClear, ["stop"])
    }, null, 8, ["class", "onClick"])) : createCommentVNode("", true),
    !$options.resetSelect && !$props.remote ? (openBlock(), createBlock(_component_Icon, {
      key: 4,
      type: $options.arrowType,
      custom: $options.customArrowType,
      size: $options.arrowSize,
      class: normalizeClass([$data.prefixCls + "-arrow"])
    }, null, 8, ["type", "custom", "size", "class"])) : createCommentVNode("", true)
  ], 2);
}
var SelectHead = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { SelectHead as default };
