import { getCurrentInstance, resolveComponent, openBlock, createElementBlock, createVNode, withCtx, createBlock, withModifiers, createElementVNode, normalizeClass, renderSlot, createCommentVNode, mergeProps } from "vue";
import Dropdown from "../dropdown/dropdown.js";
import DropdownMenu from "../dropdown/dropdown-menu.js";
import Badge from "../badge/badge.js";
import Tabs from "../tabs/tabs.js";
import { oneOf } from "../../utils/assist.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Notification",
  components: { Dropdown, DropdownMenu, Badge, Tabs },
  emits: ["on-visible-change", "on-item-click", "on-clear", "on-load-more", "on-tab-change"],
  provide() {
    return {
      NotificationInstance: this
    };
  },
  props: {
    count: {
      type: Number
    },
    autoCount: {
      type: Boolean,
      default: false
    },
    countType: {
      validator(value) {
        return oneOf(value, ["text", "badge"]);
      },
      default: "text"
    },
    icon: {
      type: String,
      default: "md-notifications-outline"
    },
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? false : global.$VIEWUI.transfer;
      }
    },
    placement: {
      validator(value) {
        return oneOf(value, ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]);
      },
      default: "bottom"
    },
    badgeProps: {
      type: Object,
      default() {
        return {};
      }
    },
    clearClose: {
      type: Boolean,
      default: false
    },
    locale: {
      type: Object,
      default() {
        return {
          loadedAll: "\u52A0\u8F7D\u5B8C\u6BD5",
          loading: "\u52A0\u8F7D\u4E2D...",
          loadMore: "\u52A0\u8F7D\u66F4\u591A",
          clear: "\u6E05\u7A7A"
        };
      }
    },
    tab: {
      type: String
    },
    wide: {
      type: Boolean,
      default: false
    },
    transferClassName: {
      type: String
    }
  },
  data() {
    return {
      visible: false,
      countAll: 0,
      tabList: []
    };
  },
  computed: {
    finalCount() {
      return this.autoCount ? this.countAll : this.count;
    },
    transferClasses() {
      let classes = "ivu-notifications-transfer";
      if (this.transferClassName)
        classes += ` ${this.transferClassName}`;
      return classes;
    }
  },
  watch: {
    visible(val) {
      this.$emit("on-visible-change", val);
    }
  },
  methods: {
    handleVisibleChange(visible) {
      this.visible = visible;
    },
    handleClickOutside(e) {
      if (this.$refs.notice.contains(e.target))
        return;
      this.visible = false;
    },
    handleToggleOpen() {
      this.visible = !this.visible;
    },
    handleGetCountAll() {
      if (this.autoCount) {
        const $tabs = this.tabList.map((item) => item.tab);
        let countAll = 0;
        $tabs.forEach((item) => {
          if (item.count)
            countAll += item.count;
        });
        this.countAll = countAll;
      }
    },
    handleItemClick(tab, item) {
      this.$emit("on-item-click", tab, item);
    },
    handleClear(tab) {
      this.$emit("on-clear", tab);
      if (this.clearClose)
        this.handleClose();
    },
    handleLoadMore(tab) {
      this.$emit("on-load-more", tab);
    },
    handleClose() {
      this.visible = false;
    },
    handleTabChange(name) {
      const $tabs = this.tabList.map((item) => item.tab);
      let tabInfo = {};
      $tabs.forEach((item) => {
        const tab = item.$refs.tab;
        if (tab.currentName === name) {
          tabInfo = item.handleGetTabBaseInfo();
        }
      });
      this.$emit("on-tab-change", tabInfo);
    }
  }
};
const _hoisted_1 = {
  class: "ivu-notifications",
  ref: "notice"
};
const _hoisted_2 = { class: "ivu-notifications-tabs" };
const _hoisted_3 = {
  key: 0,
  class: "ivu-notifications-extra"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_Badge = resolveComponent("Badge");
  const _component_Tabs = resolveComponent("Tabs");
  const _component_DropdownMenu = resolveComponent("DropdownMenu");
  const _component_Dropdown = resolveComponent("Dropdown");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createVNode(_component_Dropdown, {
      trigger: "custom",
      visible: $data.visible,
      transfer: $props.transfer,
      placement: $props.placement,
      "transfer-class-name": $options.transferClasses,
      onOnVisibleChange: $options.handleVisibleChange,
      onOnClickoutside: $options.handleClickOutside
    }, {
      list: withCtx(() => [
        _ctx.$slots.default ? (openBlock(), createBlock(_component_DropdownMenu, {
          key: 0,
          onClick: _cache[1] || (_cache[1] = withModifiers(() => {
          }, ["stop"]))
        }, {
          default: withCtx(() => [
            createElementVNode("div", {
              class: normalizeClass(["ivu-notifications-list", { "ivu-notifications-list-wide": $props.wide }])
            }, [
              createElementVNode("div", _hoisted_2, [
                createVNode(_component_Tabs, {
                  animated: false,
                  "model-value": $props.tab,
                  onOnClick: $options.handleTabChange
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "default")
                  ]),
                  _: 3
                }, 8, ["model-value", "onOnClick"])
              ])
            ], 2),
            _ctx.$slots.extra ? (openBlock(), createElementBlock("div", _hoisted_3, [
              renderSlot(_ctx.$slots, "extra")
            ])) : createCommentVNode("", true)
          ]),
          _: 3
        })) : createCommentVNode("", true)
      ]),
      default: withCtx(() => [
        createElementVNode("div", {
          class: "ivu-notifications-rel",
          onClick: _cache[0] || (_cache[0] = withModifiers((...args) => $options.handleToggleOpen && $options.handleToggleOpen(...args), ["prevent", "stop"]))
        }, [
          createVNode(_component_Badge, mergeProps({ count: $options.finalCount }, $props.badgeProps), {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "icon", {}, () => [
                createVNode(_component_Icon, {
                  type: $props.icon,
                  size: "24"
                }, null, 8, ["type"])
              ])
            ]),
            _: 3
          }, 16, ["count"])
        ])
      ]),
      _: 3
    }, 8, ["visible", "transfer", "placement", "transfer-class-name", "onOnVisibleChange", "onOnClickoutside"])
  ], 512);
}
var Notification = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Notification as default };
