import { nextTick, resolveComponent, openBlock, createElementBlock, normalizeClass, Fragment, renderList, createBlock, toDisplayString, createCommentVNode, createElementVNode, normalizeStyle, createVNode, withCtx, renderSlot } from "vue";
import TreeNode from "./node.js";
import Dropdown from "../dropdown/dropdown.js";
import DropdownMenu from "../dropdown/dropdown-menu.js";
import Locale from "../../mixins/locale.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-tree";
const _sfc_main = {
  name: "Tree",
  mixins: [Locale],
  components: { TreeNode, Dropdown, DropdownMenu },
  emits: ["on-select-change", "on-check-change", "on-contextmenu", "on-toggle-expand"],
  provide() {
    return {
      TreeInstance: this
    };
  },
  props: {
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
    checkStrictly: {
      type: Boolean,
      default: false
    },
    checkDirectly: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String
    },
    childrenKey: {
      type: String,
      default: "children"
    },
    loadData: {
      type: Function
    },
    render: {
      type: Function
    },
    selectNode: {
      type: Boolean,
      default: true
    },
    expandNode: {
      type: Boolean,
      default: false
    },
    autoCloseContextmenu: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      prefixCls,
      stateTree: this.data,
      flatState: [],
      contextMenuVisible: false,
      contextMenuStyles: {
        top: 0,
        left: 0
      }
    };
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.stateTree = this.data;
        this.flatState = this.compileFlatState();
        this.rebuildTree();
      }
    }
  },
  computed: {
    localeEmptyText() {
      if (typeof this.emptyText === "undefined") {
        return this.t("i.tree.emptyText");
      } else {
        return this.emptyText;
      }
    }
  },
  methods: {
    compileFlatState() {
      let keyCounter = 0;
      let childrenKey = this.childrenKey;
      const flatTree = [];
      function flattenChildren(node, parent) {
        node.nodeKey = keyCounter++;
        flatTree[node.nodeKey] = { node, nodeKey: node.nodeKey };
        if (typeof parent != "undefined") {
          flatTree[node.nodeKey].parent = parent.nodeKey;
          flatTree[parent.nodeKey][childrenKey].push(node.nodeKey);
        }
        if (node[childrenKey]) {
          flatTree[node.nodeKey][childrenKey] = [];
          node[childrenKey].forEach((child) => flattenChildren(child, node));
        }
      }
      this.stateTree.forEach((rootNode) => {
        flattenChildren(rootNode);
      });
      return flatTree;
    },
    updateTreeUp(nodeKey) {
      const parentKey = this.flatState[nodeKey].parent;
      if (typeof parentKey == "undefined" || this.checkStrictly)
        return;
      const node = this.flatState[nodeKey].node;
      const parent = this.flatState[parentKey].node;
      if (node.checked == parent.checked && node.indeterminate == parent.indeterminate)
        return;
      if (node.checked == true) {
        parent.checked = parent[this.childrenKey].every((node2) => node2.checked);
        parent.indeterminate = !parent.checked;
      } else {
        parent.checked = false;
        parent.indeterminate = parent[this.childrenKey].some((node2) => node2.checked || node2.indeterminate);
      }
      this.updateTreeUp(parentKey);
    },
    rebuildTree() {
      const checkedNodes = this.getCheckedNodes();
      checkedNodes.forEach((node) => {
        this.updateTreeDown(node, { checked: true });
        const parentKey = this.flatState[node.nodeKey].parent;
        if (!parentKey && parentKey !== 0)
          return;
        const parent = this.flatState[parentKey].node;
        const childHasCheckSetter = typeof node.checked != "undefined" && node.checked;
        if (childHasCheckSetter && parent.checked != node.checked) {
          this.updateTreeUp(node.nodeKey);
        }
      });
    },
    getSelectedNodes() {
      return this.flatState.filter((obj) => obj.node.selected).map((obj) => obj.node);
    },
    getCheckedNodes() {
      return this.flatState.filter((obj) => obj.node.checked).map((obj) => obj.node);
    },
    getCheckedAndIndeterminateNodes() {
      return this.flatState.filter((obj) => obj.node.checked || obj.node.indeterminate).map((obj) => obj.node);
    },
    updateTreeDown(node, changes = {}) {
      if (this.checkStrictly)
        return;
      for (let key in changes) {
        node[key] = changes[key];
      }
      if (node[this.childrenKey]) {
        node[this.childrenKey].forEach((child) => {
          this.updateTreeDown(child, changes);
        });
      }
    },
    handleSelect(nodeKey) {
      if (!this.flatState[nodeKey])
        return;
      const node = this.flatState[nodeKey].node;
      if (!this.multiple) {
        const currentSelectedKey = this.flatState.findIndex((obj) => obj.node.selected);
        if (currentSelectedKey >= 0 && currentSelectedKey !== nodeKey)
          this.flatState[currentSelectedKey].node.selected = false;
      }
      node.selected = !node.selected;
      this.$emit("on-select-change", this.getSelectedNodes(), node);
    },
    handleCheck({ checked, nodeKey }) {
      if (!this.flatState[nodeKey])
        return;
      const node = this.flatState[nodeKey].node;
      node.checked = checked;
      node.indeterminate = false;
      this.updateTreeUp(nodeKey);
      this.updateTreeDown(node, { checked, indeterminate: false });
      this.$emit("on-check-change", this.getCheckedNodes(), node);
    },
    handleContextmenu({ data, event }) {
      if (this.contextMenuVisible)
        this.handleClickContextMenuOutside();
      nextTick(() => {
        const $TreeWrap = this.$refs.treeWrap;
        const TreeBounding = $TreeWrap.getBoundingClientRect();
        const position = {
          left: `${event.clientX - TreeBounding.left}px`,
          top: `${event.clientY - TreeBounding.top}px`
        };
        this.contextMenuStyles = position;
        this.contextMenuVisible = true;
        this.$emit("on-contextmenu", data, event, position);
      });
    },
    handleClickContextMenuOutside() {
      this.contextMenuVisible = false;
    },
    handleOnCheck(param) {
      this.handleCheck(param);
    },
    handleOnSelected(param) {
      this.handleSelect(param);
    },
    handleToggleExpand(node) {
      this.$emit("on-toggle-expand", node);
    },
    handleOnContextmenu(param) {
      this.handleContextmenu(param);
    },
    closeContextMenu() {
      this.handleClickContextMenuOutside();
    },
    handleClickDropdownItem() {
      if (this.autoCloseContextmenu)
        this.closeContextMenu();
    }
  },
  created() {
    this.flatState = this.compileFlatState();
    this.rebuildTree();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TreeNode = resolveComponent("TreeNode");
  const _component_DropdownMenu = resolveComponent("DropdownMenu");
  const _component_Dropdown = resolveComponent("Dropdown");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($data.prefixCls),
    ref: "treeWrap"
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($data.stateTree, (item, i) => {
      return openBlock(), createBlock(_component_TreeNode, {
        key: i,
        data: item,
        visible: "",
        multiple: $props.multiple,
        "show-checkbox": $props.showCheckbox,
        "children-key": $props.childrenKey
      }, null, 8, ["data", "multiple", "show-checkbox", "children-key"]);
    }), 128)),
    !$data.stateTree.length ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass([$data.prefixCls + "-empty"])
    }, toDisplayString($options.localeEmptyText), 3)) : createCommentVNode("", true),
    createElementVNode("div", {
      class: "ivu-tree-context-menu",
      style: normalizeStyle($data.contextMenuStyles)
    }, [
      createVNode(_component_Dropdown, {
        trigger: "custom",
        visible: $data.contextMenuVisible,
        transfer: "",
        onOnClick: $options.handleClickDropdownItem,
        onOnClickoutside: $options.handleClickContextMenuOutside
      }, {
        list: withCtx(() => [
          createVNode(_component_DropdownMenu, null, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "contextMenu")
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["visible", "onOnClick", "onOnClickoutside"])
    ], 4)
  ], 2);
}
var Tree = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Tree as default };
