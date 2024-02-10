import TabPane from "../tabs/pane.js";
import Icon from "../icon/icon.js";
import Badge from "../badge/badge.js";
import random from "../../utils/random_str.js";
import { resolveComponent, openBlock, createBlock, withCtx, createElementVNode, renderSlot, createElementBlock, createCommentVNode, toDisplayString, createVNode, createTextVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "NotificationTab",
  inject: ["NotificationInstance"],
  components: { TabPane, Icon },
  provide() {
    return {
      NotificationTabInstance: this
    };
  },
  props: {
    count: {
      type: Number
    },
    title: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    emptyText: {
      type: String,
      default: "\u76EE\u524D\u6CA1\u6709\u901A\u77E5"
    },
    emptyImage: {
      type: String,
      default: "https://file.iviewui.com/iview-pro/icon-no-message.svg"
    },
    loadedAll: {
      type: Boolean,
      default: true
    },
    showLoadedAll: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    scrollToLoad: {
      type: Boolean,
      default: true
    },
    showClear: {
      type: Boolean,
      default: true
    },
    showClearIcon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      customLabel: (h) => {
        return h("div", [
          h("span", this.title),
          h(Badge, {
            count: this.count
          })
        ]);
      },
      itemCount: 0,
      itemList: [],
      id: random(6)
    };
  },
  computed: {
    currentTitle() {
      const countType = this.NotificationInstance.countType;
      if (countType === "text") {
        const count = this.count ? `(${this.count})` : "";
        return `${this.title} ${count}`;
      } else if (countType === "badge") {
        return this.customLabel;
      }
    }
  },
  watch: {
    count: {
      handler() {
        this.NotificationInstance.handleGetCountAll();
      },
      immediate: true
    }
  },
  methods: {
    handleGetTabBaseInfo() {
      return {
        name: this.name,
        title: this.title
      };
    },
    handleGetItems() {
      const items = this.itemList.map((item) => item.item);
      this.itemCount = items.length;
    },
    handleItemClick(item) {
      this.NotificationInstance.handleItemClick(this.handleGetTabBaseInfo(), item);
    },
    handleClear() {
      this.NotificationInstance.handleClear(this.handleGetTabBaseInfo());
    },
    handleLoadMore() {
      this.NotificationInstance.handleLoadMore(this.handleGetTabBaseInfo());
    },
    handleScroll() {
      if (!this.scrollToLoad)
        return;
      const $scroll = this.$refs.scroll;
      const displacement = $scroll.scrollHeight - $scroll.clientHeight - $scroll.scrollTop;
      if (!this.loading && displacement === 0) {
        this.handleLoadMore();
      }
    },
    addTab() {
      const target = this.NotificationInstance;
      target.tabList.push({
        id: this.id,
        tab: this
      });
    },
    removeTab() {
      const target = this.NotificationInstance;
      const index = target.tabList.findIndex((item) => item.id === this.id);
      target.tabList.splice(index, 1);
    }
  },
  mounted() {
    this.addTab();
  },
  beforeUnmount() {
    this.removeTab();
  }
};
const _hoisted_1 = { class: "ivu-notifications-container-list" };
const _hoisted_2 = {
  key: 0,
  class: "ivu-notifications-tab-empty"
};
const _hoisted_3 = ["src"];
const _hoisted_4 = { class: "ivu-notifications-tab-empty-text" };
const _hoisted_5 = { class: "ivu-notifications-tab-loading" };
const _hoisted_6 = {
  key: 0,
  class: "ivu-notifications-tab-loading-item ivu-notifications-tab-loading-show"
};
const _hoisted_7 = {
  key: 2,
  class: "ivu-notifications-tab-loading-item ivu-notifications-tab-loading-all"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_TabPane = resolveComponent("TabPane");
  return openBlock(), createBlock(_component_TabPane, {
    label: $options.currentTitle,
    name: $props.name,
    ref: "tab",
    class: "ivu-notifications-tab"
  }, {
    default: withCtx(() => [
      createElementVNode("div", {
        class: "ivu-notifications-container",
        onScroll: _cache[1] || (_cache[1] = (...args) => $options.handleScroll && $options.handleScroll(...args)),
        ref: "scroll"
      }, [
        renderSlot(_ctx.$slots, "top"),
        createElementVNode("div", _hoisted_1, [
          renderSlot(_ctx.$slots, "default")
        ]),
        !$props.loading && $data.itemCount === 0 ? (openBlock(), createElementBlock("div", _hoisted_2, [
          renderSlot(_ctx.$slots, "empty", {}, () => [
            $props.emptyImage ? (openBlock(), createElementBlock("img", {
              key: 0,
              class: "ivu-notifications-tab-empty-img",
              src: $props.emptyImage
            }, null, 8, _hoisted_3)) : createCommentVNode("", true),
            createElementVNode("div", _hoisted_4, toDisplayString($props.emptyText), 1)
          ])
        ])) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_5, [
          $props.loading ? (openBlock(), createElementBlock("div", _hoisted_6, [
            renderSlot(_ctx.$slots, "loading", {}, () => [
              createVNode(_component_Icon, {
                type: "ios-loading",
                class: "ivu-load-loop"
              }),
              createTextVNode(" " + toDisplayString($options.NotificationInstance.locale.loading), 1)
            ])
          ])) : !$props.loadedAll ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: "ivu-notifications-tab-loading-item ivu-notifications-tab-loading-more",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.handleLoadMore && $options.handleLoadMore(...args))
          }, [
            renderSlot(_ctx.$slots, "load-more", {}, () => [
              createTextVNode(toDisplayString($options.NotificationInstance.locale.loadMore), 1)
            ])
          ])) : $props.showLoadedAll && $props.loadedAll ? (openBlock(), createElementBlock("div", _hoisted_7, [
            renderSlot(_ctx.$slots, "loaded-all", {}, () => [
              createTextVNode(toDisplayString($options.NotificationInstance.locale.loadedAll), 1)
            ])
          ])) : createCommentVNode("", true)
        ])
      ], 544),
      $props.showClear && $data.itemCount !== 0 ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "ivu-notifications-tab-clear",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.handleClear && $options.handleClear(...args))
      }, [
        renderSlot(_ctx.$slots, "clear", {}, () => [
          $props.showClearIcon ? (openBlock(), createBlock(_component_Icon, {
            key: 0,
            type: "md-done-all"
          })) : createCommentVNode("", true),
          createElementVNode("span", null, toDisplayString($options.NotificationInstance.locale.clear) + toDisplayString($props.title), 1)
        ])
      ])) : createCommentVNode("", true)
    ]),
    _: 3
  }, 8, ["label", "name"]);
}
var NotificationTab = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { NotificationTab as default };
