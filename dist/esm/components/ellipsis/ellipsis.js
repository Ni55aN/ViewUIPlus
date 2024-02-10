import { getCurrentInstance, nextTick, resolveComponent, openBlock, createElementBlock, renderSlot, Fragment, createBlock, withCtx, createElementVNode, toDisplayString, withDirectives, createTextVNode, vShow } from "vue";
import Tooltip from "../tooltip/tooltip.js";
import { oneOf, getStyle } from "../../utils/assist.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const getStrFullLength = (str = "") => str.split("").reduce((pre, cur) => {
  const charCode = cur.charCodeAt(0);
  if (charCode >= 0 && charCode <= 128) {
    return pre + 1;
  }
  return pre + 2;
}, 0);
const cutStrByFullLength = (str = "", maxLength) => {
  let showLength = 0;
  return str.split("").reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1;
    } else {
      showLength += 2;
    }
    if (showLength <= maxLength) {
      return pre + cur;
    }
    return pre;
  }, "");
};
const _sfc_main = {
  name: "Ellipsis",
  components: { Tooltip },
  emits: ["on-show", "on-hide"],
  props: {
    text: {
      type: String
    },
    height: {
      type: Number
    },
    lines: {
      type: Number
    },
    length: {
      type: Number
    },
    fullWidthRecognition: {
      type: Boolean,
      default: false
    },
    autoResize: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: Boolean,
      default: false
    },
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? false : global.$VIEWUI.transfer;
      }
    },
    theme: {
      validator(value) {
        return oneOf(value, ["dark", "light"]);
      },
      default: "dark"
    },
    maxWidth: {
      type: [String, Number],
      default: 250
    },
    placement: {
      validator(value) {
        return oneOf(value, ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]);
      },
      default: "bottom"
    }
  },
  data() {
    return {
      oversize: false,
      computedReady: false,
      computedText: ""
    };
  },
  watch: {
    disabled() {
      this.init();
    },
    text() {
      this.init();
    },
    height() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (!this.disabled) {
        this.computeText();
        this.limitShow();
      }
    },
    computeText() {
      this.oversize = false;
      this.computedReady = false;
      nextTick(() => {
        let $text = this.$refs.text;
        let $el = this.$el;
        let $more = this.$refs.more;
        let n = 1e3;
        let text = this.text;
        let height = this.height;
        if (!height && this.lines) {
          const lineHeight = parseInt(getStyle($el, "lineHeight"), 10);
          height = lineHeight * this.lines;
        }
        if ($text) {
          if (this.length) {
            const textLength = this.fullWidthRecognition ? getStrFullLength(text) : text.length;
            if (textLength > this.length) {
              this.oversize = true;
              $more.style.display = "inline-block";
              text = this.fullWidthRecognition ? cutStrByFullLength(text, this.length) : text.slice(0, this.length);
            }
          } else {
            if ($el.offsetHeight > height) {
              this.oversize = true;
              $more.style.display = "inline-block";
              while ($el.offsetHeight > height && n > 0) {
                if ($el.offsetHeight > height * 3) {
                  $text.innerText = text = text.substring(0, Math.floor(text.length / 2));
                } else {
                  $text.innerText = text = text.substring(0, text.length - 1);
                }
                n--;
              }
            }
          }
        }
        this.computedText = text;
      });
    },
    limitShow() {
      this.computedReady = true;
      nextTick(() => {
        let $text = this.$refs.text;
        let $el = this.$el;
        if ($text) {
          $text.innerText = this.computedText;
          if ($el.offsetHeight > this.height) {
            this.$emit("on-hide");
          } else {
            this.$emit("on-show");
          }
        }
      });
    }
  }
};
const _hoisted_1 = { class: "ivu-ellipsis" };
const _hoisted_2 = {
  class: "ivu-ellipsis-more",
  ref: "more"
};
const _hoisted_3 = {
  class: "ivu-ellipsis-more",
  ref: "more"
};
const _hoisted_4 = {
  key: 1,
  class: "ivu-ellipsis-hidden"
};
const _hoisted_5 = {
  class: "ivu-ellipsis-more",
  ref: "more"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Tooltip = resolveComponent("Tooltip");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    renderSlot(_ctx.$slots, "prefix", { class: "ivu-ellipsis-prefix" }),
    $data.computedReady ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
      $props.tooltip ? (openBlock(), createBlock(_component_Tooltip, {
        key: 0,
        content: $props.text,
        theme: $props.theme,
        "max-width": $props.maxWidth,
        placement: $props.placement,
        transfer: $props.transfer
      }, {
        default: withCtx(() => [
          createElementVNode("span", {
            class: "ivu-ellipsis-text",
            ref: "text"
          }, toDisplayString($props.text), 513),
          withDirectives(createElementVNode("span", _hoisted_2, [
            renderSlot(_ctx.$slots, "more", {}, () => [
              createTextVNode("...")
            ])
          ], 512), [
            [vShow, $data.oversize]
          ]),
          renderSlot(_ctx.$slots, "suffix", { class: "ivu-ellipsis-suffix" })
        ]),
        _: 3
      }, 8, ["content", "theme", "max-width", "placement", "transfer"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
        createElementVNode("span", {
          class: "ivu-ellipsis-text",
          ref: "text"
        }, toDisplayString($props.text), 513),
        withDirectives(createElementVNode("span", _hoisted_3, [
          renderSlot(_ctx.$slots, "more", {}, () => [
            createTextVNode("...")
          ])
        ], 512), [
          [vShow, $data.oversize]
        ]),
        renderSlot(_ctx.$slots, "suffix", { class: "ivu-ellipsis-suffix" })
      ], 64))
    ], 64)) : (openBlock(), createElementBlock("div", _hoisted_4, [
      createElementVNode("span", {
        class: "ivu-ellipsis-text",
        ref: "text"
      }, toDisplayString($props.text), 513),
      withDirectives(createElementVNode("span", _hoisted_5, [
        renderSlot(_ctx.$slots, "more", {}, () => [
          createTextVNode("...")
        ])
      ], 512), [
        [vShow, $data.oversize]
      ]),
      renderSlot(_ctx.$slots, "suffix", { class: "ivu-ellipsis-suffix" })
    ]))
  ]);
}
var Ellipsis = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Ellipsis as default };
