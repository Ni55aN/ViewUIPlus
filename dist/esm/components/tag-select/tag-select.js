import Tag from "../tag/tag.js";
import Icon from "../icon/icon.js";
import mixinsForm from "../../mixins/form.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, createVNode, withCtx, createTextVNode, createCommentVNode, renderSlot, toDisplayString, createBlock } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "TagSelect",
  mixins: [mixinsForm],
  components: { Tag, Icon },
  emits: ["on-change", "on-checked-all", "update:modelValue"],
  provide() {
    return {
      TagSelectInstance: this
    };
  },
  props: {
    modelValue: {
      type: Array,
      default() {
        return [];
      }
    },
    expandable: {
      type: Boolean,
      default: false
    },
    hideCheckAll: {
      type: Boolean,
      default: false
    },
    locale: {
      type: Object,
      default() {
        return {
          collapseText: "\u6536\u8D77",
          expandText: "\u5C55\u5F00"
        };
      }
    }
  },
  data() {
    return {
      currentValue: this.modelValue,
      checkedAll: false,
      expand: false,
      tagSelectOptionList: []
    };
  },
  computed: {
    classes() {
      return {
        "ivu-tag-select-with-expanded": this.expandable,
        "ivu-tag-select-expanded": this.expand
      };
    }
  },
  watch: {
    modelValue(val) {
      this.currentValue = val;
      this.handleUpdateTags();
    }
  },
  methods: {
    handleUpdateTags() {
      let checkedAll = true;
      const tags = this.tagSelectOptionList.map((item) => item.option);
      tags.forEach((tag) => {
        if (this.currentValue.indexOf(tag.name) >= 0) {
          tag.checked = true;
        } else {
          tag.checked = false;
          checkedAll = false;
        }
      });
      this.checkedAll = checkedAll;
    },
    handleChangeTag(name) {
      const checkedNames = [];
      let checkedAll = true;
      const tags = this.tagSelectOptionList.map((item) => item.option);
      tags.forEach((tag) => {
        if (tag.checked) {
          checkedNames.push(tag.name);
        } else {
          checkedAll = false;
        }
      });
      this.currentValue = checkedNames;
      this.$emit("update:modelValue", checkedNames);
      this.$emit("on-change", [...checkedNames], name);
      this.handleFormItemChange("change", name);
      if (name) {
        this.checkedAll = checkedAll;
      }
    },
    handleCheckAll(checked) {
      this.checkedAll = checked;
      const tags = this.tagSelectOptionList.map((item) => item.option);
      tags.forEach((tag) => {
        tag.checked = checked;
      });
      this.handleChangeTag();
      this.$emit("on-checked-all", checked);
    },
    handleToggleExpand() {
      this.expand = !this.expand;
    }
  },
  mounted() {
    this.handleUpdateTags();
  }
};
const _hoisted_1 = {
  key: 0,
  class: "ivu-tag-select-option"
};
const _hoisted_2 = { key: 0 };
const _hoisted_3 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Tag = resolveComponent("Tag");
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["ivu-tag-select", $options.classes])
  }, [
    !$props.hideCheckAll ? (openBlock(), createElementBlock("div", _hoisted_1, [
      createVNode(_component_Tag, {
        checkable: "",
        checked: $data.checkedAll,
        onOnChange: $options.handleCheckAll,
        color: "primary"
      }, {
        default: withCtx(() => [
          createTextVNode("\u5168\u90E8")
        ]),
        _: 1
      }, 8, ["checked", "onOnChange"])
    ])) : createCommentVNode("", true),
    renderSlot(_ctx.$slots, "default"),
    $props.expandable ? (openBlock(), createElementBlock("a", {
      key: 1,
      class: "ivu-tag-select-expand-btn",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.handleToggleExpand && $options.handleToggleExpand(...args))
    }, [
      $data.expand ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString($props.locale.collapseText), 1)) : (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString($props.locale.expandText), 1)),
      $data.expand ? (openBlock(), createBlock(_component_Icon, {
        key: 2,
        type: "ios-arrow-up"
      })) : (openBlock(), createBlock(_component_Icon, {
        key: 3,
        type: "ios-arrow-down"
      }))
    ])) : createCommentVNode("", true)
  ], 2);
}
var TagSelect = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TagSelect as default };
