import { getCurrentInstance, resolveComponent, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, createTextVNode, toDisplayString, renderSlot, Fragment, createCommentVNode, createVNode } from "vue";
import { oneOf } from "../../utils/assist.js";
import Options from "./options.js";
import Locale from "../../mixins/locale.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-page";
const _sfc_main = {
  name: "Page",
  mixins: [Locale],
  components: { Options },
  emits: ["update:modelValue", "on-change", "on-prev", "on-next", "on-page-size-change"],
  props: {
    modelValue: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizeOpts: {
      type: Array,
      default() {
        return [10, 20, 30, 40];
      }
    },
    placement: {
      validator(value) {
        return oneOf(value, ["top", "bottom"]);
      },
      default: "bottom"
    },
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? false : global.$VIEWUI.transfer;
      }
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "default"]);
      }
    },
    simple: {
      type: Boolean,
      default: false
    },
    showTotal: {
      type: Boolean,
      default: false
    },
    showElevator: {
      type: Boolean,
      default: false
    },
    showSizer: {
      type: Boolean,
      default: false
    },
    className: {
      type: String
    },
    styles: {
      type: Object
    },
    prevText: {
      type: String,
      default: ""
    },
    nextText: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    eventsEnabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls,
      currentPage: this.modelValue,
      currentPageSize: this.pageSize
    };
  },
  watch: {
    total(val) {
      let maxPage = Math.ceil(val / this.currentPageSize);
      if (maxPage < this.currentPage) {
        this.currentPage = maxPage === 0 ? 1 : maxPage;
      }
    },
    modelValue(val) {
      this.currentPage = val;
    },
    pageSize(val) {
      this.currentPageSize = val;
    }
  },
  computed: {
    isSmall() {
      return this.size === "small";
    },
    allPages() {
      const allPage = Math.ceil(this.total / this.currentPageSize);
      return allPage === 0 ? 1 : allPage;
    },
    simpleWrapClasses() {
      return [
        `${prefixCls}`,
        `${prefixCls}-simple`,
        {
          [`${this.className}`]: !!this.className
        }
      ];
    },
    simplePagerClasses() {
      return `${prefixCls}-simple-pager`;
    },
    wrapClasses() {
      return [
        `${prefixCls}`,
        {
          [`${this.className}`]: !!this.className,
          [`${prefixCls}-with-disabled`]: this.disabled,
          "mini": this.size === "small"
        }
      ];
    },
    prevClasses() {
      return [
        `${prefixCls}-prev`,
        {
          [`${prefixCls}-disabled`]: this.currentPage === 1 || this.disabled,
          [`${prefixCls}-custom-text`]: this.prevText !== ""
        }
      ];
    },
    nextClasses() {
      return [
        `${prefixCls}-next`,
        {
          [`${prefixCls}-disabled`]: this.currentPage === this.allPages || this.disabled,
          [`${prefixCls}-custom-text`]: this.nextText !== ""
        }
      ];
    },
    firstPageClasses() {
      return [
        `${prefixCls}-item`,
        {
          [`${prefixCls}-item-active`]: this.currentPage === 1
        }
      ];
    },
    lastPageClasses() {
      return [
        `${prefixCls}-item`,
        {
          [`${prefixCls}-item-active`]: this.currentPage === this.allPages
        }
      ];
    }
  },
  methods: {
    changePage(page) {
      if (this.disabled)
        return;
      if (this.currentPage != page) {
        this.currentPage = page;
        this.$emit("update:modelValue", page);
        this.$emit("on-change", page);
      }
    },
    prev() {
      if (this.disabled)
        return;
      const current = this.currentPage;
      if (current <= 1) {
        return false;
      }
      this.changePage(current - 1);
      this.$emit("on-prev", current - 1);
    },
    next() {
      if (this.disabled)
        return;
      const current = this.currentPage;
      if (current >= this.allPages) {
        return false;
      }
      this.changePage(current + 1);
      this.$emit("on-next", current + 1);
    },
    fastPrev() {
      if (this.disabled)
        return;
      const page = this.currentPage - 5;
      if (page > 0) {
        this.changePage(page);
      } else {
        this.changePage(1);
      }
    },
    fastNext() {
      if (this.disabled)
        return;
      const page = this.currentPage + 5;
      if (page > this.allPages) {
        this.changePage(this.allPages);
      } else {
        this.changePage(page);
      }
    },
    onSize(pageSize) {
      if (this.disabled)
        return;
      this.currentPageSize = pageSize;
      this.$emit("on-page-size-change", pageSize);
      this.changePage(1);
    },
    onPage(page) {
      if (this.disabled)
        return;
      this.changePage(page);
    },
    keyDown(e) {
      const key = e.keyCode;
      const condition = key >= 48 && key <= 57 || key >= 96 && key <= 105 || key === 8 || key === 37 || key === 39;
      if (!condition) {
        e.preventDefault();
      }
    },
    keyUp(e) {
      const key = e.keyCode;
      const val = parseInt(e.target.value);
      if (key === 38) {
        this.prev();
      } else if (key === 40) {
        this.next();
      } else if (key === 13) {
        let page = 1;
        if (val > this.allPages) {
          page = this.allPages;
        } else if (val <= 0 || !val) {
          page = 1;
        } else {
          page = val;
        }
        e.target.value = page;
        this.changePage(page);
      }
    }
  }
};
const _hoisted_1 = ["title"];
const _hoisted_2 = /* @__PURE__ */ createElementVNode("a", null, [
  /* @__PURE__ */ createElementVNode("i", { class: "ivu-icon ivu-icon-ios-arrow-back" })
], -1);
const _hoisted_3 = [
  _hoisted_2
];
const _hoisted_4 = ["title"];
const _hoisted_5 = ["value", "disabled"];
const _hoisted_6 = /* @__PURE__ */ createElementVNode("span", null, "/", -1);
const _hoisted_7 = ["title"];
const _hoisted_8 = /* @__PURE__ */ createElementVNode("a", null, [
  /* @__PURE__ */ createElementVNode("i", { class: "ivu-icon ivu-icon-ios-arrow-forward" })
], -1);
const _hoisted_9 = [
  _hoisted_8
];
const _hoisted_10 = ["title"];
const _hoisted_11 = {
  key: 1,
  class: "ivu-icon ivu-icon-ios-arrow-back"
};
const _hoisted_12 = /* @__PURE__ */ createElementVNode("a", null, "1", -1);
const _hoisted_13 = [
  _hoisted_12
];
const _hoisted_14 = ["title"];
const _hoisted_15 = /* @__PURE__ */ createElementVNode("a", null, [
  /* @__PURE__ */ createElementVNode("i", { class: "ivu-icon ivu-icon-ios-arrow-back" }),
  /* @__PURE__ */ createElementVNode("i", { class: "ivu-icon ivu-icon-ios-more" })
], -1);
const _hoisted_16 = [
  _hoisted_15
];
const _hoisted_17 = ["title"];
const _hoisted_18 = ["title"];
const _hoisted_19 = ["title"];
const _hoisted_20 = ["title"];
const _hoisted_21 = ["title"];
const _hoisted_22 = ["title"];
const _hoisted_23 = ["title"];
const _hoisted_24 = ["title"];
const _hoisted_25 = /* @__PURE__ */ createElementVNode("a", null, [
  /* @__PURE__ */ createElementVNode("i", { class: "ivu-icon ivu-icon-ios-arrow-forward" }),
  /* @__PURE__ */ createElementVNode("i", { class: "ivu-icon ivu-icon-ios-more" })
], -1);
const _hoisted_26 = [
  _hoisted_25
];
const _hoisted_27 = ["title"];
const _hoisted_28 = ["title"];
const _hoisted_29 = {
  key: 1,
  class: "ivu-icon ivu-icon-ios-arrow-forward"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Options = resolveComponent("Options");
  return $props.simple ? (openBlock(), createElementBlock("ul", {
    key: 0,
    class: normalizeClass($options.simpleWrapClasses),
    style: normalizeStyle($props.styles)
  }, [
    createElementVNode("li", {
      title: _ctx.t("i.page.prev"),
      class: normalizeClass($options.prevClasses),
      onClick: _cache[0] || (_cache[0] = (...args) => $options.prev && $options.prev(...args))
    }, _hoisted_3, 10, _hoisted_1),
    createElementVNode("div", {
      class: normalizeClass($options.simplePagerClasses),
      title: $data.currentPage + "/" + $options.allPages
    }, [
      createElementVNode("input", {
        type: "text",
        value: $data.currentPage,
        autocomplete: "off",
        spellcheck: "false",
        disabled: $props.disabled,
        onKeydown: _cache[1] || (_cache[1] = (...args) => $options.keyDown && $options.keyDown(...args)),
        onKeyup: _cache[2] || (_cache[2] = (...args) => $options.keyUp && $options.keyUp(...args)),
        onChange: _cache[3] || (_cache[3] = (...args) => $options.keyUp && $options.keyUp(...args))
      }, null, 40, _hoisted_5),
      _hoisted_6,
      createTextVNode(" " + toDisplayString($options.allPages), 1)
    ], 10, _hoisted_4),
    createElementVNode("li", {
      title: _ctx.t("i.page.next"),
      class: normalizeClass($options.nextClasses),
      onClick: _cache[4] || (_cache[4] = (...args) => $options.next && $options.next(...args))
    }, _hoisted_9, 10, _hoisted_7)
  ], 6)) : (openBlock(), createElementBlock("ul", {
    key: 1,
    class: normalizeClass($options.wrapClasses),
    style: normalizeStyle($props.styles)
  }, [
    $props.showTotal ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass([$data.prefixCls + "-total"])
    }, [
      renderSlot(_ctx.$slots, "default", {}, () => [
        createTextVNode(toDisplayString(_ctx.t("i.page.total")) + " " + toDisplayString($props.total) + " ", 1),
        $props.total <= 1 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createTextVNode(toDisplayString(_ctx.t("i.page.item")), 1)
        ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createTextVNode(toDisplayString(_ctx.t("i.page.items")), 1)
        ], 64))
      ])
    ], 2)) : createCommentVNode("", true),
    createElementVNode("li", {
      title: _ctx.t("i.page.prev"),
      class: normalizeClass($options.prevClasses),
      onClick: _cache[5] || (_cache[5] = (...args) => $options.prev && $options.prev(...args))
    }, [
      createElementVNode("a", null, [
        $props.prevText !== "" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createTextVNode(toDisplayString($props.prevText), 1)
        ], 64)) : (openBlock(), createElementBlock("i", _hoisted_11))
      ])
    ], 10, _hoisted_10),
    createElementVNode("li", {
      title: "1",
      class: normalizeClass($options.firstPageClasses),
      onClick: _cache[6] || (_cache[6] = ($event) => $options.changePage(1))
    }, _hoisted_13, 2),
    $data.currentPage > 5 ? (openBlock(), createElementBlock("li", {
      key: 1,
      title: _ctx.t("i.page.prev5"),
      class: normalizeClass([$data.prefixCls + "-item-jump-prev"]),
      onClick: _cache[7] || (_cache[7] = (...args) => $options.fastPrev && $options.fastPrev(...args))
    }, _hoisted_16, 10, _hoisted_14)) : createCommentVNode("", true),
    $data.currentPage === 5 ? (openBlock(), createElementBlock("li", {
      key: 2,
      title: $data.currentPage - 3,
      class: normalizeClass([$data.prefixCls + "-item"]),
      onClick: _cache[8] || (_cache[8] = ($event) => $options.changePage($data.currentPage - 3))
    }, [
      createElementVNode("a", null, toDisplayString($data.currentPage - 3), 1)
    ], 10, _hoisted_17)) : createCommentVNode("", true),
    $data.currentPage - 2 > 1 ? (openBlock(), createElementBlock("li", {
      key: 3,
      title: $data.currentPage - 2,
      class: normalizeClass([$data.prefixCls + "-item"]),
      onClick: _cache[9] || (_cache[9] = ($event) => $options.changePage($data.currentPage - 2))
    }, [
      createElementVNode("a", null, toDisplayString($data.currentPage - 2), 1)
    ], 10, _hoisted_18)) : createCommentVNode("", true),
    $data.currentPage - 1 > 1 ? (openBlock(), createElementBlock("li", {
      key: 4,
      title: $data.currentPage - 1,
      class: normalizeClass([$data.prefixCls + "-item"]),
      onClick: _cache[10] || (_cache[10] = ($event) => $options.changePage($data.currentPage - 1))
    }, [
      createElementVNode("a", null, toDisplayString($data.currentPage - 1), 1)
    ], 10, _hoisted_19)) : createCommentVNode("", true),
    $data.currentPage != 1 && $data.currentPage != $options.allPages ? (openBlock(), createElementBlock("li", {
      key: 5,
      title: $data.currentPage,
      class: normalizeClass([$data.prefixCls + "-item", $data.prefixCls + "-item-active"])
    }, [
      createElementVNode("a", null, toDisplayString($data.currentPage), 1)
    ], 10, _hoisted_20)) : createCommentVNode("", true),
    $data.currentPage + 1 < $options.allPages ? (openBlock(), createElementBlock("li", {
      key: 6,
      title: $data.currentPage + 1,
      class: normalizeClass([$data.prefixCls + "-item"]),
      onClick: _cache[11] || (_cache[11] = ($event) => $options.changePage($data.currentPage + 1))
    }, [
      createElementVNode("a", null, toDisplayString($data.currentPage + 1), 1)
    ], 10, _hoisted_21)) : createCommentVNode("", true),
    $data.currentPage + 2 < $options.allPages ? (openBlock(), createElementBlock("li", {
      key: 7,
      title: $data.currentPage + 2,
      class: normalizeClass([$data.prefixCls + "-item"]),
      onClick: _cache[12] || (_cache[12] = ($event) => $options.changePage($data.currentPage + 2))
    }, [
      createElementVNode("a", null, toDisplayString($data.currentPage + 2), 1)
    ], 10, _hoisted_22)) : createCommentVNode("", true),
    $options.allPages - $data.currentPage === 4 ? (openBlock(), createElementBlock("li", {
      key: 8,
      title: $data.currentPage + 3,
      class: normalizeClass([$data.prefixCls + "-item"]),
      onClick: _cache[13] || (_cache[13] = ($event) => $options.changePage($data.currentPage + 3))
    }, [
      createElementVNode("a", null, toDisplayString($data.currentPage + 3), 1)
    ], 10, _hoisted_23)) : createCommentVNode("", true),
    $options.allPages - $data.currentPage >= 5 ? (openBlock(), createElementBlock("li", {
      key: 9,
      title: _ctx.t("i.page.next5"),
      class: normalizeClass([$data.prefixCls + "-item-jump-next"]),
      onClick: _cache[14] || (_cache[14] = (...args) => $options.fastNext && $options.fastNext(...args))
    }, _hoisted_26, 10, _hoisted_24)) : createCommentVNode("", true),
    $options.allPages > 1 ? (openBlock(), createElementBlock("li", {
      key: 10,
      title: $options.allPages,
      class: normalizeClass($options.lastPageClasses),
      onClick: _cache[15] || (_cache[15] = ($event) => $options.changePage($options.allPages))
    }, [
      createElementVNode("a", null, toDisplayString($options.allPages), 1)
    ], 10, _hoisted_27)) : createCommentVNode("", true),
    createElementVNode("li", {
      title: _ctx.t("i.page.next"),
      class: normalizeClass($options.nextClasses),
      onClick: _cache[16] || (_cache[16] = (...args) => $options.next && $options.next(...args))
    }, [
      createElementVNode("a", null, [
        $props.nextText !== "" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createTextVNode(toDisplayString($props.nextText), 1)
        ], 64)) : (openBlock(), createElementBlock("i", _hoisted_29))
      ])
    ], 10, _hoisted_28),
    createVNode(_component_Options, {
      "show-sizer": $props.showSizer,
      "page-size": $data.currentPageSize,
      "page-size-opts": $props.pageSizeOpts,
      placement: $props.placement,
      transfer: $props.transfer,
      "show-elevator": $props.showElevator,
      _current: $data.currentPage,
      current: $data.currentPage,
      disabled: $props.disabled,
      "all-pages": $options.allPages,
      "is-small": $options.isSmall,
      eventsEnabled: $props.eventsEnabled,
      onOnSize: $options.onSize,
      onOnPage: $options.onPage
    }, null, 8, ["show-sizer", "page-size", "page-size-opts", "placement", "transfer", "show-elevator", "_current", "current", "disabled", "all-pages", "is-small", "eventsEnabled", "onOnSize", "onOnPage"])
  ], 6));
}
var Page = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Page as default };
