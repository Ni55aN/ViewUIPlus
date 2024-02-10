import { nextTick, getCurrentInstance, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, withModifiers, createBlock, createCommentVNode, Fragment, createTextVNode, toDisplayString, createVNode, withCtx, renderList } from "vue";
import Checkbox from "../checkbox/checkbox.js";
import Icon from "../icon/icon.js";
import Render from "./render.js";
import CollapseTransition from "../base/collapse-transition.js";
import { findComponentUpward } from "../../utils/assist.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-tree";
const _sfc_main = {
  name: "TreeNode",
  inject: ["TreeInstance"],
  components: { Checkbox, Icon, CollapseTransition, Render },
  props: {
    data: {
      type: Object,
      default: () => {
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    childrenKey: {
      type: String,
      default: "children"
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    appear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls,
      appearByClickArrow: false,
      globalConfig: {}
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}-children`
      ];
    },
    selectedCls() {
      return [
        {
          [`${prefixCls}-node-selected`]: this.data.selected
        }
      ];
    },
    arrowClasses() {
      return [
        `${prefixCls}-arrow`,
        {
          [`${prefixCls}-arrow-disabled`]: this.data.disabled,
          [`${prefixCls}-arrow-open`]: this.data.expand
        }
      ];
    },
    titleClasses() {
      return [
        `${prefixCls}-title`,
        {
          [`${prefixCls}-title-selected`]: this.data.selected
        }
      ];
    },
    showArrow() {
      return this.data[this.childrenKey] && this.data[this.childrenKey].length || "loading" in this.data && !this.data.loading;
    },
    showLoading() {
      return "loading" in this.data && this.data.loading;
    },
    isParentRender() {
      const Tree = findComponentUpward(this, "Tree");
      return Tree && Tree.render;
    },
    parentRender() {
      const Tree = findComponentUpward(this, "Tree");
      if (Tree && Tree.render) {
        return Tree.render;
      } else {
        return null;
      }
    },
    node() {
      const Tree = findComponentUpward(this, "Tree");
      if (Tree) {
        return [Tree.flatState, Tree.flatState.find((item) => item.nodeKey === this.data.nodeKey)];
      } else {
        return [];
      }
    },
    children() {
      return this.data[this.childrenKey];
    },
    arrowType() {
      const config = this.globalConfig;
      let type = "ios-arrow-forward";
      if (config) {
        if (config.tree.customArrow) {
          type = "";
        } else if (config.tree.arrow) {
          type = config.tree.arrow;
        }
      }
      return type;
    },
    customArrowType() {
      const config = this.globalConfig;
      let type = "";
      if (config) {
        if (config.tree.customArrow) {
          type = config.tree.customArrow;
        }
      }
      return type;
    },
    arrowSize() {
      const config = this.globalConfig;
      let size = "";
      if (config) {
        if (config.tree.arrowSize) {
          size = config.tree.arrowSize;
        }
      }
      return size;
    }
  },
  methods: {
    handleExpand() {
      const item = this.data;
      this.appearByClickArrow = true;
      if (item[this.childrenKey].length === 0) {
        const tree = findComponentUpward(this, "Tree");
        if (tree && tree.loadData) {
          this.data.loading = true;
          tree.loadData(item, (children) => {
            this.data.loading = false;
            if (children.length) {
              this.data[this.childrenKey] = children;
              nextTick(() => this.handleExpand());
            }
          });
          return;
        }
      }
      if (item[this.childrenKey] && item[this.childrenKey].length) {
        this.data.expand = !this.data.expand;
        this.TreeInstance.handleToggleExpand(this.data);
      }
    },
    handleClickNode() {
      if (this.TreeInstance.expandNode) {
        if (this.showArrow)
          this.handleExpand();
      } else if (this.TreeInstance.selectNode) {
        this.handleSelect();
      }
    },
    handleSelect() {
      if (this.data.disabled)
        return;
      if (this.TreeInstance.showCheckbox && this.TreeInstance.checkDirectly) {
        this.handleCheck();
      } else {
        this.TreeInstance.handleOnSelected(this.data.nodeKey);
      }
    },
    handleCheck() {
      if (this.data.disabled)
        return;
      const changes = {
        checked: !this.data.checked && !this.data.indeterminate,
        nodeKey: this.data.nodeKey
      };
      this.TreeInstance.handleOnCheck(changes);
    },
    handleContextmenu(data, event) {
      if (data.contextmenu) {
        event.preventDefault();
        this.TreeInstance.handleOnContextmenu({ data, event });
      }
    },
    handlePreventSelect(data, event) {
      if (data.contextmenu) {
        event.preventDefault();
      }
    }
  },
  created() {
    const instance = getCurrentInstance();
    this.globalConfig = instance.appContext.config.globalProperties.$VIEWUI;
  }
};
const _hoisted_1 = {
  key: 0,
  class: "ivu-tree-expand"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_Checkbox = resolveComponent("Checkbox");
  const _component_Render = resolveComponent("Render");
  const _component_TreeNode = resolveComponent("TreeNode");
  const _component_collapse_transition = resolveComponent("collapse-transition");
  return openBlock(), createElementBlock("ul", {
    class: normalizeClass($options.classes)
  }, [
    createElementVNode("li", {
      onContextmenu: _cache[2] || (_cache[2] = withModifiers(($event) => $options.handleContextmenu($props.data, $event), ["stop"])),
      onSelectstart: _cache[3] || (_cache[3] = withModifiers(($event) => $options.handlePreventSelect($props.data, $event), ["stop"]))
    }, [
      createElementVNode("span", {
        class: normalizeClass($options.arrowClasses),
        onClick: _cache[0] || (_cache[0] = (...args) => $options.handleExpand && $options.handleExpand(...args))
      }, [
        $options.showArrow ? (openBlock(), createBlock(_component_Icon, {
          key: 0,
          type: $options.arrowType,
          custom: $options.customArrowType,
          size: $options.arrowSize
        }, null, 8, ["type", "custom", "size"])) : createCommentVNode("", true),
        $options.showLoading ? (openBlock(), createBlock(_component_Icon, {
          key: 1,
          type: "ios-loading",
          class: "ivu-load-loop"
        })) : createCommentVNode("", true)
      ], 2),
      $props.showCheckbox ? (openBlock(), createBlock(_component_Checkbox, {
        key: 0,
        "model-value": $props.data.checked,
        indeterminate: $props.data.indeterminate,
        disabled: $props.data.disabled || $props.data.disableCheckbox,
        onClick: withModifiers($options.handleCheck, ["prevent"])
      }, null, 8, ["model-value", "indeterminate", "disabled", "onClick"])) : createCommentVNode("", true),
      createElementVNode("span", {
        class: normalizeClass($options.titleClasses),
        onClick: _cache[1] || (_cache[1] = (...args) => $options.handleClickNode && $options.handleClickNode(...args))
      }, [
        $props.data.render ? (openBlock(), createBlock(_component_Render, {
          key: 0,
          render: $props.data.render,
          data: $props.data,
          node: $options.node
        }, null, 8, ["render", "data", "node"])) : $options.isParentRender ? (openBlock(), createBlock(_component_Render, {
          key: 1,
          render: $options.parentRender,
          data: $props.data,
          node: $options.node
        }, null, 8, ["render", "data", "node"])) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
          createTextVNode(toDisplayString($props.data.title), 1)
        ], 64))
      ], 2),
      createVNode(_component_collapse_transition, { appear: $props.appear }, {
        default: withCtx(() => [
          $props.data.expand ? (openBlock(), createElementBlock("div", _hoisted_1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($options.children, (item, i) => {
              return openBlock(), createBlock(_component_TreeNode, {
                appear: $data.appearByClickArrow,
                key: i,
                data: item,
                multiple: $props.multiple,
                "show-checkbox": $props.showCheckbox,
                "children-key": $props.childrenKey
              }, null, 8, ["appear", "data", "multiple", "show-checkbox", "children-key"]);
            }), 128))
          ])) : createCommentVNode("", true)
        ]),
        _: 1
      }, 8, ["appear"])
    ], 32)
  ], 2);
}
var TreeNode = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TreeNode as default };
