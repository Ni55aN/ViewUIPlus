import Breadcrumb from "../breadcrumb/breadcrumb.js";
import BreadcrumbItem from "../breadcrumb/breadcrumb-item.js";
import Divider from "../divider/divider.js";
import Icon from "../icon/icon.js";
import Tabs from "../tabs/tabs.js";
import TabPane from "../tabs/pane.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createVNode, withCtx, Fragment, renderList, createBlock, createTextVNode, toDisplayString, createCommentVNode, createElementVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "PageHeader",
  components: { Breadcrumb, BreadcrumbItem, Divider, Icon, Tabs, TabPane },
  emits: ["on-tab-change", "on-back"],
  props: {
    title: {
      type: String
    },
    back: {
      type: Boolean,
      default: false
    },
    logo: {
      type: String
    },
    action: {
      type: String
    },
    content: {
      type: String
    },
    extra: {
      type: String
    },
    breadcrumbList: {
      type: Array
    },
    hiddenBreadcrumb: {
      type: Boolean,
      default: false
    },
    tabList: {
      type: Array
    },
    tabActiveKey: {
      type: String
    },
    wide: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return {
        "ivu-page-header-wide": this.wide
      };
    }
  },
  methods: {
    handleTabChange(name) {
      const tab = this.tabList.find((item) => item.name === name);
      this.$emit("on-tab-change", JSON.parse(JSON.stringify(tab)));
    },
    handleBack() {
      this.$emit("on-back");
    }
  }
};
const _hoisted_1 = {
  key: 0,
  class: "ivu-page-header-breadcrumb"
};
const _hoisted_2 = { class: "ivu-page-header-detail" };
const _hoisted_3 = {
  key: 1,
  class: "ivu-page-header-logo"
};
const _hoisted_4 = ["src"];
const _hoisted_5 = { class: "ivu-page-header-main" };
const _hoisted_6 = { class: "ivu-page-header-row" };
const _hoisted_7 = {
  key: 1,
  class: "ivu-page-header-title"
};
const _hoisted_8 = {
  key: 2,
  class: "ivu-page-header-action"
};
const _hoisted_9 = { class: "ivu-page-header-row" };
const _hoisted_10 = {
  key: 0,
  class: "ivu-page-header-content"
};
const _hoisted_11 = {
  key: 1,
  class: "ivu-page-header-extra"
};
const _hoisted_12 = {
  key: 1,
  class: "ivu-page-header-tabs"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BreadcrumbItem = resolveComponent("BreadcrumbItem");
  const _component_Breadcrumb = resolveComponent("Breadcrumb");
  const _component_Icon = resolveComponent("Icon");
  const _component_Divider = resolveComponent("Divider");
  const _component_TabPane = resolveComponent("TabPane");
  const _component_Tabs = resolveComponent("Tabs");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["ivu-page-header", $options.classes])
  }, [
    _ctx.$slots.breadcrumb || !$props.hiddenBreadcrumb ? (openBlock(), createElementBlock("div", _hoisted_1, [
      renderSlot(_ctx.$slots, "breadcrumb", {}, () => [
        createVNode(_component_Breadcrumb, null, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList($props.breadcrumbList, (item, index) => {
              return openBlock(), createBlock(_component_BreadcrumbItem, {
                key: index,
                to: item.to,
                replace: item.replace,
                target: item.target
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(item.title), 1)
                ]),
                _: 2
              }, 1032, ["to", "replace", "target"]);
            }), 128))
          ]),
          _: 1
        })
      ])
    ])) : createCommentVNode("", true),
    createElementVNode("div", _hoisted_2, [
      $props.back || _ctx.$slots.back ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "ivu-page-header-back",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.handleBack && $options.handleBack(...args))
      }, [
        renderSlot(_ctx.$slots, "back", {}, () => [
          createVNode(_component_Icon, { type: "md-arrow-back" })
        ]),
        createVNode(_component_Divider, { type: "vertical" })
      ])) : createCommentVNode("", true),
      $props.logo || _ctx.$slots.logo ? (openBlock(), createElementBlock("div", _hoisted_3, [
        renderSlot(_ctx.$slots, "logo", {}, () => [
          createElementVNode("img", { src: $props.logo }, null, 8, _hoisted_4)
        ])
      ])) : createCommentVNode("", true),
      createElementVNode("div", _hoisted_5, [
        createElementVNode("div", _hoisted_6, [
          $props.back || _ctx.$slots.back ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "ivu-page-header-back",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.handleBack && $options.handleBack(...args))
          }, [
            renderSlot(_ctx.$slots, "back", {}, () => [
              createVNode(_component_Icon, { type: "md-arrow-back" })
            ]),
            createVNode(_component_Divider, { type: "vertical" })
          ])) : createCommentVNode("", true),
          $props.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", _hoisted_7, [
            renderSlot(_ctx.$slots, "title", {}, () => [
              createTextVNode(toDisplayString($props.title), 1)
            ])
          ])) : createCommentVNode("", true),
          $props.action || _ctx.$slots.action ? (openBlock(), createElementBlock("div", _hoisted_8, [
            renderSlot(_ctx.$slots, "action", {}, () => [
              createTextVNode(toDisplayString($props.action), 1)
            ])
          ])) : createCommentVNode("", true)
        ]),
        createElementVNode("div", _hoisted_9, [
          $props.content || _ctx.$slots.content ? (openBlock(), createElementBlock("div", _hoisted_10, [
            renderSlot(_ctx.$slots, "content", {}, () => [
              createTextVNode(toDisplayString($props.content), 1)
            ])
          ])) : createCommentVNode("", true),
          $props.extra || _ctx.$slots.extra ? (openBlock(), createElementBlock("div", _hoisted_11, [
            renderSlot(_ctx.$slots, "extra", {}, () => [
              createTextVNode(toDisplayString($props.extra), 1)
            ])
          ])) : createCommentVNode("", true)
        ])
      ])
    ]),
    $props.tabList && $props.tabList.length ? (openBlock(), createElementBlock("div", _hoisted_12, [
      createVNode(_component_Tabs, {
        animated: false,
        "model-value": $props.tabActiveKey,
        onOnClick: $options.handleTabChange
      }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.tabList, (item, index) => {
            return openBlock(), createBlock(_component_TabPane, {
              key: index,
              label: item.label,
              name: item.name
            }, null, 8, ["label", "name"]);
          }), 128))
        ]),
        _: 1
      }, 8, ["model-value", "onOnClick"])
    ])) : createCommentVNode("", true)
  ], 2);
}
var PageHeader = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { PageHeader as default };
