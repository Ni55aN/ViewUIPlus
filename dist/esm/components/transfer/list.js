import Search from "./search.js";
import Checkbox from "../checkbox/checkbox.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, createVNode, toDisplayString, createCommentVNode, Fragment, renderList, withModifiers, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "TransferList",
  components: { Search, Checkbox },
  inject: ["TransferInstance"],
  emits: ["on-checked-keys-change"],
  props: {
    prefixCls: String,
    data: Array,
    renderFormat: Function,
    checkedKeys: Array,
    listStyle: Object,
    title: [String, Number],
    filterable: Boolean,
    filterPlaceholder: String,
    filterMethod: Function,
    notFoundText: String,
    validKeysCount: Number
  },
  data() {
    return {
      showItems: [],
      query: "",
      showFooter: true
    };
  },
  watch: {
    data() {
      this.updateFilteredData();
    }
  },
  computed: {
    classes() {
      return [
        `${this.prefixCls}`,
        {
          [`${this.prefixCls}-with-footer`]: this.showFooter
        }
      ];
    },
    bodyClasses() {
      return [
        `${this.prefixCls}-body`,
        {
          [`${this.prefixCls}-body-with-search`]: this.filterable,
          [`${this.prefixCls}-body-with-footer`]: this.showFooter
        }
      ];
    },
    count() {
      const validKeysCount = this.validKeysCount;
      return (validKeysCount > 0 ? `${validKeysCount}/` : "") + `${this.data.length}`;
    },
    checkedAll() {
      return this.filterData.filter((data) => !data.disabled).length === this.validKeysCount && this.validKeysCount !== 0;
    },
    checkedAllDisabled() {
      return this.filterData.filter((data) => !data.disabled).length <= 0;
    },
    filterData() {
      return this.showItems.filter((item) => this.filterMethod(item, this.query));
    }
  },
  methods: {
    itemClasses(item) {
      return [
        `${this.prefixCls}-content-item`,
        {
          [`${this.prefixCls}-content-item-disabled`]: item.disabled
        }
      ];
    },
    showLabel(item) {
      return this.renderFormat(item);
    },
    isCheck(item) {
      return this.checkedKeys.some((key) => key === item.key);
    },
    select(item) {
      if (item.disabled)
        return;
      const index = this.checkedKeys.indexOf(item.key);
      index > -1 ? this.checkedKeys.splice(index, 1) : this.checkedKeys.push(item.key);
      this.TransferInstance.handleCheckedKeys();
    },
    updateFilteredData() {
      this.showItems = this.data;
    },
    toggleSelectAll(status) {
      const keys = status ? this.filterData.filter((data) => !data.disabled || this.checkedKeys.indexOf(data.key) > -1).map((data) => data.key) : this.filterData.filter((data) => data.disabled && this.checkedKeys.indexOf(data.key) > -1).map((data) => data.key);
      this.$emit("on-checked-keys-change", keys);
    },
    handleQueryClear() {
      this.query = "";
    },
    handleQueryChange(val) {
      this.query = val;
    }
  },
  created() {
    this.updateFilteredData();
  },
  mounted() {
    this.showFooter = this.$slots.default !== void 0;
  }
};
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["innerHTML"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Checkbox = resolveComponent("Checkbox");
  const _component_Search = resolveComponent("Search");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes),
    style: normalizeStyle($props.listStyle)
  }, [
    createElementVNode("div", {
      class: normalizeClass($props.prefixCls + "-header")
    }, [
      createVNode(_component_Checkbox, {
        modelValue: $options.checkedAll,
        disabled: $options.checkedAllDisabled,
        "onUpdate:modelValue": $options.toggleSelectAll
      }, null, 8, ["modelValue", "disabled", "onUpdate:modelValue"]),
      createElementVNode("span", {
        class: normalizeClass($props.prefixCls + "-header-title"),
        onClick: _cache[0] || (_cache[0] = ($event) => $options.toggleSelectAll(!$options.checkedAll))
      }, toDisplayString($props.title), 3),
      createElementVNode("span", {
        class: normalizeClass($props.prefixCls + "-header-count")
      }, toDisplayString($options.count), 3)
    ], 2),
    createElementVNode("div", {
      class: normalizeClass($options.bodyClasses)
    }, [
      $props.filterable ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass($props.prefixCls + "-body-search-wrapper")
      }, [
        createVNode(_component_Search, {
          "prefix-cls": $props.prefixCls + "-search",
          query: $data.query,
          onOnQueryClear: $options.handleQueryClear,
          onOnQueryChange: $options.handleQueryChange,
          placeholder: $props.filterPlaceholder
        }, null, 8, ["prefix-cls", "query", "onOnQueryClear", "onOnQueryChange", "placeholder"])
      ], 2)) : createCommentVNode("", true),
      createElementVNode("ul", {
        class: normalizeClass($props.prefixCls + "-content")
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($options.filterData, (item, index) => {
          return openBlock(), createElementBlock("li", {
            key: index,
            class: normalizeClass($options.itemClasses(item)),
            onClick: withModifiers(($event) => $options.select(item), ["prevent"])
          }, [
            createVNode(_component_Checkbox, {
              modelValue: $options.isCheck(item),
              disabled: item.disabled
            }, null, 8, ["modelValue", "disabled"]),
            createElementVNode("span", {
              innerHTML: $options.showLabel(item)
            }, null, 8, _hoisted_2)
          ], 10, _hoisted_1);
        }), 128)),
        createElementVNode("li", {
          class: normalizeClass($props.prefixCls + "-content-not-found")
        }, toDisplayString($props.notFoundText), 3)
      ], 2)
    ], 2),
    $data.showFooter ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass($props.prefixCls + "-footer")
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2)) : createCommentVNode("", true)
  ], 6);
}
var List = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { List as default };
