import Select from "../select/select.js";
import iOption from "../select/option.js";
import Locale from "../../mixins/locale.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, createVNode, withCtx, Fragment, renderList, createBlock, createTextVNode, toDisplayString, createCommentVNode, createElementVNode, withKeys } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-page";
function isValueNumber(value) {
  return /^[1-9][0-9]*$/.test(value + "");
}
const _sfc_main = {
  name: "PageOption",
  mixins: [Locale],
  components: { iSelect: Select, iOption },
  emits: ["on-size", "on-page"],
  props: {
    pageSizeOpts: Array,
    showSizer: Boolean,
    showElevator: Boolean,
    current: Number,
    _current: Number,
    pageSize: Number,
    allPages: Number,
    isSmall: Boolean,
    placement: String,
    transfer: Boolean,
    disabled: Boolean,
    eventsEnabled: Boolean
  },
  data() {
    return {
      currentPageSize: this.pageSize
    };
  },
  watch: {
    pageSize(val) {
      this.currentPageSize = val;
    }
  },
  computed: {
    size() {
      return this.isSmall ? "small" : "default";
    },
    optsClasses() {
      return [
        `${prefixCls}-options`
      ];
    },
    sizerClasses() {
      return [
        `${prefixCls}-options-sizer`
      ];
    },
    ElevatorClasses() {
      return [
        `${prefixCls}-options-elevator`
      ];
    }
  },
  methods: {
    changeSize() {
      this.$emit("on-size", this.currentPageSize);
    },
    changePage(event) {
      let val = event.target.value.trim();
      let page = 0;
      if (isValueNumber(val)) {
        val = Number(val);
        if (val != this.current) {
          const allPages = this.allPages;
          if (val > allPages) {
            page = allPages;
          } else {
            page = val;
          }
        }
      } else {
        page = 1;
      }
      if (page) {
        this.$emit("on-page", page);
        event.target.value = page;
      }
    }
  }
};
const _hoisted_1 = ["value", "disabled"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_option = resolveComponent("i-option");
  const _component_i_select = resolveComponent("i-select");
  return $props.showSizer || $props.showElevator ? (openBlock(), createElementBlock("div", {
    key: 0,
    class: normalizeClass($options.optsClasses)
  }, [
    $props.showSizer ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass($options.sizerClasses)
    }, [
      createVNode(_component_i_select, {
        modelValue: $data.currentPageSize,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.currentPageSize = $event),
        size: $options.size,
        placement: $props.placement,
        transfer: $props.transfer,
        disabled: $props.disabled,
        eventsEnabled: $props.eventsEnabled,
        onOnChange: $options.changeSize
      }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.pageSizeOpts, (item) => {
            return openBlock(), createBlock(_component_i_option, {
              key: item,
              value: item,
              style: { "text-align": "center" }
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(item) + " " + toDisplayString(_ctx.t("i.page.page")), 1)
              ]),
              _: 2
            }, 1032, ["value"]);
          }), 128))
        ]),
        _: 1
      }, 8, ["modelValue", "size", "placement", "transfer", "disabled", "eventsEnabled", "onOnChange"])
    ], 2)) : createCommentVNode("", true),
    $props.showElevator ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass($options.ElevatorClasses)
    }, [
      createTextVNode(toDisplayString(_ctx.t("i.page.goto")) + " ", 1),
      createElementVNode("input", {
        type: "text",
        value: $props._current,
        autocomplete: "off",
        spellcheck: "false",
        disabled: $props.disabled,
        onKeyup: _cache[1] || (_cache[1] = withKeys((...args) => $options.changePage && $options.changePage(...args), ["enter"]))
      }, null, 40, _hoisted_1),
      createTextVNode(" " + toDisplayString(_ctx.t("i.page.p")), 1)
    ], 2)) : createCommentVNode("", true)
  ], 2)) : createCommentVNode("", true);
}
var Options = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Options as default };
