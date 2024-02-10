import { getCurrentInstance, nextTick, resolveComponent, openBlock, createBlock, mergeProps, withCtx, createVNode } from "vue";
import Select from "../select/select.js";
import Tree from "../tree/tree.js";
import mixinsForm from "../../mixins/form.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "TreeSelect",
  components: { Select, Tree },
  emits: ["on-change", "update:modelValue", "on-open-change"],
  mixins: [mixinsForm],
  props: {
    modelValue: {
      type: [String, Number, Array]
    },
    data: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    loadData: {
      type: Function
    },
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? false : global.$VIEWUI.transfer;
      }
    }
  },
  data() {
    let value = this.modelValue;
    if (value === null) {
      if (this.multiple)
        value = [];
      else
        value = "";
    }
    return {
      currentValue: value,
      isChangeValueInTree: false,
      isValueChangeByTree: false,
      isValueNull: false
    };
  },
  watch: {
    modelValue(val) {
      if (this.isChangeValueInTree) {
        this.isChangeValueInTree = false;
      } else {
        let value = val;
        if (value === null) {
          this.isValueNull = true;
          if (this.multiple)
            value = [];
          else
            value = "";
        }
        this.currentValue = value;
        this.$refs.select.reset();
        this.handleUpdateTreeNodes(this.data, true);
      }
    },
    data() {
      if (this.isChangeValueInTree) {
        this.isChangeValueInTree = false;
      } else {
        this.$refs.select.reset();
        this.handleUpdateTreeNodes(this.data, true);
      }
    }
  },
  computed: {
    valueToArray() {
      return typeof this.currentValue === "object" ? this.currentValue : [this.currentValue];
    },
    isCheckboxUsable() {
      return this.multiple && this.showCheckbox;
    },
    transferClassName() {
      return this.transfer ? "ivu-tree-select-transfer" : "";
    },
    classes() {
      return {
        "ivu-tree-select-with-checkbox": this.showCheckbox
      };
    }
  },
  methods: {
    handleSelectNode(selectedNodes, currentNode) {
      if (this.multiple) {
        if (selectedNodes.length) {
          this.currentValue = selectedNodes.map((item) => item.value);
          this.handleUpdateSelectValue(currentNode.value, currentNode.title);
        } else {
          this.currentValue = [];
          this.handleUpdateSelectValue("", "");
        }
      } else {
        if (selectedNodes.length) {
          const node = selectedNodes[0];
          this.currentValue = node.value;
          this.handleUpdateSelectValue(node.value, node.title);
        } else {
          this.currentValue = "";
          this.handleUpdateSelectValue("", "");
        }
      }
      this.isChangeValueInTree = true;
      this.$emit("update:modelValue", this.currentValue);
      this.$emit("on-change", this.currentValue);
      this.handleFormItemChange("change", this.currentValue);
    },
    handleUpdateTreeNodes(data, isInit = false) {
      data.forEach((item) => {
        if (this.valueToArray.indexOf(item.value) >= 0) {
          if (this.isCheckboxUsable) {
            item.checked = true;
          } else {
            item.selected = true;
          }
          this.handleUpdateSelectValue(item.value, item.title);
        } else {
          if (this.isCheckboxUsable) {
            item.checked = false;
          } else {
            item.selected = false;
          }
        }
        if (item.children && item.children.length) {
          this.handleUpdateTreeNodes(item.children);
        }
      });
      if (isInit)
        this.$refs.select.isFocused = false;
    },
    handleUpdateSelectValue(value, label) {
      if (value === "") {
        this.$refs.select.reset();
      } else {
        this.isValueChangeByTree = true;
        this.$refs.select.onOptionClick({
          value,
          label
        });
      }
    },
    handleChange(value) {
      if (this.isValueChangeByTree) {
        this.isValueChangeByTree = false;
      } else {
        this.currentValue = value;
        if (this.isValueNull) {
          this.isValueNull = false;
          this.$emit("update:modelValue", null);
        } else {
          this.$emit("update:modelValue", value);
        }
        this.$emit("on-change", value);
        this.handleFormItemChange("change", value);
        this.$refs.select.reset();
        this.handleUpdateTreeNodes(this.data, true);
        nextTick(() => {
          this.isValueChangeByTree = false;
        });
      }
    },
    handleOpenChange(status) {
      this.$emit("on-open-change", status);
    }
  },
  mounted() {
    this.handleUpdateTreeNodes(this.data, true);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Tree = resolveComponent("Tree");
  const _component_Select = resolveComponent("Select");
  return openBlock(), createBlock(_component_Select, mergeProps({ ref: "select" }, _ctx.$attrs, {
    multiple: $props.multiple,
    class: ["ivu-tree-select", $options.classes],
    "transfer-class-name": $options.transferClassName,
    onOnChange: $options.handleChange,
    onOnOpenChange: $options.handleOpenChange,
    hideNotFound: "",
    transfer: $props.transfer
  }), {
    default: withCtx(() => [
      createVNode(_component_Tree, {
        data: $props.data,
        multiple: $props.multiple,
        onOnSelectChange: $options.handleSelectNode,
        onOnCheckChange: $options.handleSelectNode,
        "check-strictly": "",
        "show-checkbox": $props.multiple && $props.showCheckbox,
        "check-directly": "",
        "load-data": $props.loadData
      }, null, 8, ["data", "multiple", "onOnSelectChange", "onOnCheckChange", "show-checkbox", "load-data"])
    ]),
    _: 1
  }, 16, ["multiple", "class", "transfer-class-name", "onOnChange", "onOnOpenChange", "transfer"]);
}
var TreeSelect = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TreeSelect as default };
