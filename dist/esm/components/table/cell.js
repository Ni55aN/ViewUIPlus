import Expand from "./expand.js";
import TableSlot from "./slot.js";
import Icon from "../icon/icon.js";
import Checkbox from "../checkbox/checkbox.js";
import Tooltip from "../tooltip/tooltip.js";
import { isClient } from "../../utils/index.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, toDisplayString, createCommentVNode, createBlock, withModifiers, normalizeStyle, Fragment, withCtx, createElementVNode, createVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "TableCell",
  components: { Icon, Checkbox, TableExpand: Expand, TableSlot, Tooltip },
  inject: ["TableInstance"],
  props: {
    prefixCls: String,
    row: Object,
    column: Object,
    naturalIndex: Number,
    index: Number,
    checked: Boolean,
    disabled: Boolean,
    expanded: Boolean,
    fixed: {
      type: [Boolean, String],
      default: false
    },
    treeNode: Boolean,
    treeLevel: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      renderType: "",
      uid: -1,
      context: this.$parent.$parent.$parent.currentContext,
      showTooltip: false
    };
  },
  computed: {
    classes() {
      return [
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-hidden`]: !this.fixed && this.column.fixed && (this.column.fixed === "left" || this.column.fixed === "right"),
          [`${this.prefixCls}-cell-ellipsis`]: this.column.ellipsis || false,
          [`${this.prefixCls}-cell-with-expand`]: this.renderType === "expand",
          [`${this.prefixCls}-cell-with-selection`]: this.renderType === "selection"
        }
      ];
    },
    expandCls() {
      return [
        `${this.prefixCls}-cell-expand`,
        {
          [`${this.prefixCls}-cell-expand-expanded`]: this.expanded
        }
      ];
    },
    showChildren() {
      let status = false;
      if (this.renderType === "html" || this.renderType === "normal" || this.renderType === "render" || this.renderType === "slot") {
        const data = this.row;
        if (data.children && data.children.length || "_loading" in data) {
          if (this.column.tree)
            status = true;
        }
      }
      return status;
    },
    showTreeNode() {
      let status = false;
      if (this.renderType === "html" || this.renderType === "normal" || this.renderType === "render" || this.renderType === "slot") {
        if (this.column.tree && this.treeNode)
          status = true;
      }
      return status;
    },
    showLevel() {
      let status = false;
      if (this.renderType === "html" || this.renderType === "normal" || this.renderType === "render" || this.renderType === "slot") {
        if (this.column.tree && this.treeNode)
          status = true;
      }
      return status;
    },
    treeLevelStyle() {
      return {
        "padding-left": this.treeLevel * this.TableInstance.indentSize + "px"
      };
    },
    childrenExpand() {
      const data = this.TableInstance.getDataByRowKey(this.row._rowKey);
      return data._isShowChildren;
    },
    childrenLoading() {
      const data = this.TableInstance.getDataByRowKey(this.row._rowKey);
      return "_loading" in data && data._loading;
    }
  },
  methods: {
    toggleSelect() {
      if (this.treeNode) {
        this.$parent.$parent.$parent.toggleSelect(this.index, this.row._rowKey);
      } else {
        this.$parent.$parent.$parent.toggleSelect(this.index);
      }
    },
    toggleExpand() {
      this.$parent.$parent.$parent.toggleExpand(this.index);
    },
    handleClick() {
    },
    handleTooltipIn() {
      if (!isClient)
        return;
      const $content = this.$refs.content;
      let range = document.createRange();
      range.setStart($content, 0);
      range.setEnd($content, $content.childNodes.length);
      const rangeWidth = range.getBoundingClientRect().width;
      this.showTooltip = rangeWidth > $content.offsetWidth;
      range = null;
    },
    handleToggleTree() {
      this.$parent.$parent.$parent.toggleTree(this.row._rowKey);
    }
  },
  created() {
    if (this.column.type === "index") {
      this.renderType = "index";
    } else if (this.column.type === "selection") {
      this.renderType = "selection";
    } else if (this.column.type === "html") {
      this.renderType = "html";
    } else if (this.column.type === "expand") {
      this.renderType = "expand";
    } else if (this.column.render) {
      this.renderType = "render";
    } else if (this.column.slot) {
      this.renderType = "slot";
    } else {
      this.renderType = "normal";
    }
  }
};
const _hoisted_1 = { key: 0 };
const _hoisted_2 = {
  key: 4,
  class: "ivu-table-cell-tree ivu-table-cell-tree-empty"
};
const _hoisted_3 = ["innerHTML"];
const _hoisted_4 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Checkbox = resolveComponent("Checkbox");
  const _component_Icon = resolveComponent("Icon");
  const _component_Tooltip = resolveComponent("Tooltip");
  const _component_table_expand = resolveComponent("table-expand");
  const _component_table_slot = resolveComponent("table-slot");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes),
    ref: "cell"
  }, [
    $data.renderType === "index" ? (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString($props.column.indexMethod ? $props.column.indexMethod($props.row, $props.naturalIndex) : $props.naturalIndex + 1), 1)) : createCommentVNode("", true),
    $data.renderType === "selection" ? (openBlock(), createBlock(_component_Checkbox, {
      key: 1,
      "model-value": $props.checked,
      onClick: withModifiers($options.handleClick, ["stop"]),
      onOnChange: $options.toggleSelect,
      disabled: $props.disabled
    }, null, 8, ["model-value", "onClick", "onOnChange", "disabled"])) : createCommentVNode("", true),
    $options.showLevel ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: "ivu-table-cell-tree-level",
      style: normalizeStyle($options.treeLevelStyle)
    }, null, 4)) : createCommentVNode("", true),
    $options.showChildren ? (openBlock(), createElementBlock("div", {
      key: 3,
      class: normalizeClass(["ivu-table-cell-tree", { "ivu-table-cell-tree-loading": $options.childrenLoading }]),
      onClick: _cache[0] || (_cache[0] = withModifiers((...args) => $options.handleToggleTree && $options.handleToggleTree(...args), ["prevent", "stop"]))
    }, [
      $options.childrenLoading ? (openBlock(), createBlock(_component_Icon, {
        key: 0,
        type: "ios-loading",
        class: "ivu-load-loop"
      })) : !$options.childrenExpand ? (openBlock(), createBlock(_component_Icon, {
        key: 1,
        type: "ios-add"
      })) : (openBlock(), createBlock(_component_Icon, {
        key: 2,
        type: "ios-remove"
      }))
    ], 2)) : $options.showTreeNode ? (openBlock(), createElementBlock("div", _hoisted_2)) : createCommentVNode("", true),
    $data.renderType === "html" ? (openBlock(), createElementBlock("span", {
      key: 5,
      innerHTML: $props.row[$props.column.key]
    }, null, 8, _hoisted_3)) : createCommentVNode("", true),
    $data.renderType === "normal" ? (openBlock(), createElementBlock(Fragment, { key: 6 }, [
      $props.column.tooltip ? (openBlock(), createBlock(_component_Tooltip, {
        key: 0,
        transfer: "",
        content: $props.row[$props.column.key],
        theme: $props.column.tooltipTheme ? $props.column.tooltipTheme : $options.TableInstance.tooltipTheme,
        disabled: !$data.showTooltip,
        "max-width": $props.column.tooltipMaxWidth ? $props.column.tooltipMaxWidth : $options.TableInstance.tooltipMaxWidth,
        class: "ivu-table-cell-tooltip"
      }, {
        default: withCtx(() => [
          createElementVNode("span", {
            ref: "content",
            onMouseenter: _cache[1] || (_cache[1] = (...args) => $options.handleTooltipIn && $options.handleTooltipIn(...args)),
            class: "ivu-table-cell-tooltip-content"
          }, toDisplayString($props.row[$props.column.key]), 545)
        ]),
        _: 1
      }, 8, ["content", "theme", "disabled", "max-width"])) : (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString($props.row[$props.column.key]), 1))
    ], 64)) : createCommentVNode("", true),
    $data.renderType === "expand" && !$props.row._disableExpand ? (openBlock(), createElementBlock("div", {
      key: 7,
      class: normalizeClass($options.expandCls),
      onClick: _cache[2] || (_cache[2] = (...args) => $options.toggleExpand && $options.toggleExpand(...args))
    }, [
      createVNode(_component_Icon, { type: "ios-arrow-forward" })
    ], 2)) : createCommentVNode("", true),
    $data.renderType === "render" ? (openBlock(), createBlock(_component_table_expand, {
      key: 8,
      row: $props.row,
      column: $props.column,
      index: $props.index,
      render: $props.column.render
    }, null, 8, ["row", "column", "index", "render"])) : createCommentVNode("", true),
    $data.renderType === "slot" ? (openBlock(), createBlock(_component_table_slot, {
      key: 9,
      row: $props.row,
      column: $props.column,
      display: $props.column.display || "block",
      index: $props.index
    }, null, 8, ["row", "column", "display", "index"])) : createCommentVNode("", true)
  ], 2);
}
var TableCell = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TableCell as default };
