import { getCurrentInstance, nextTick, resolveComponent, resolveDirective, withDirectives, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createBlock, Teleport, createVNode, Transition, withCtx, normalizeStyle, createTextVNode, toDisplayString, createCommentVNode, vShow } from "vue";
import Popper from "../base/popper.js";
import _sfc_main$1 from "../button/button.js";
import clickOutside from "../../directives/clickoutside.js";
import { oneOf } from "../../utils/assist.js";
import { transferIncrease, transferIndex } from "../../utils/transfer-queue.js";
import Locale from "../../mixins/locale.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-poptip";
const _sfc_main = {
  name: "Poptip",
  mixins: [Popper, Locale],
  emits: ["on-ok", "on-cancel"],
  directives: { clickOutside },
  components: { iButton: _sfc_main$1 },
  props: {
    trigger: {
      validator(value) {
        return oneOf(value, ["click", "focus", "hover"]);
      },
      default: "click"
    },
    placement: {
      validator(value) {
        return oneOf(value, ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]);
      },
      default: "top"
    },
    title: {
      type: [String, Number]
    },
    content: {
      type: [String, Number],
      default: ""
    },
    width: {
      type: [String, Number]
    },
    confirm: {
      type: Boolean,
      default: false
    },
    okText: {
      type: String
    },
    cancelText: {
      type: String
    },
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? false : global.$VIEWUI.transfer;
      }
    },
    popperClass: {
      type: String
    },
    wordWrap: {
      type: Boolean,
      default: false
    },
    padding: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    capture: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI ? false : global.$VIEWUI.capture;
      }
    },
    transferClassName: {
      type: String
    }
  },
  data() {
    return {
      prefixCls,
      showTitle: true,
      isInput: false,
      disableCloseUnderTransfer: false,
      tIndex: this.handleGetIndex()
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-confirm`]: this.confirm
        }
      ];
    },
    popperClasses() {
      return [
        `${prefixCls}-popper`,
        {
          [`${prefixCls}-confirm`]: this.transfer && this.confirm,
          [`${this.popperClass}`]: !!this.popperClass,
          [prefixCls + "-transfer"]: this.transfer,
          [this.transferClassName]: this.transferClassName
        }
      ];
    },
    styles() {
      let style = {};
      if (this.width) {
        style.width = `${this.width}px`;
      }
      if (this.transfer)
        style["z-index"] = 1060 + this.tIndex;
      return style;
    },
    localeOkText() {
      if (this.okText === void 0) {
        return this.t("i.poptip.okText");
      } else {
        return this.okText;
      }
    },
    localeCancelText() {
      if (this.cancelText === void 0) {
        return this.t("i.poptip.cancelText");
      } else {
        return this.cancelText;
      }
    },
    contentClasses() {
      return [
        `${prefixCls}-body-content`,
        {
          [`${prefixCls}-body-content-word-wrap`]: this.wordWrap
        }
      ];
    },
    contentPaddingStyle() {
      const styles = {};
      if (this.padding !== "")
        styles["padding"] = this.padding;
      return styles;
    }
  },
  methods: {
    handleClick() {
      if (this.disabled)
        return;
      if (this.confirm) {
        this.visible = !this.visible;
        return true;
      }
      if (this.trigger !== "click") {
        return false;
      }
      this.visible = !this.visible;
    },
    handleTransferClick() {
      if (this.transfer)
        this.disableCloseUnderTransfer = true;
    },
    handleClose() {
      if (this.disableCloseUnderTransfer) {
        this.disableCloseUnderTransfer = false;
        return false;
      }
      if (this.confirm) {
        this.visible = false;
        return true;
      }
      if (this.trigger !== "click") {
        return false;
      }
      this.visible = false;
    },
    handleFocus(fromInput = true) {
      if (this.disabled)
        return;
      if (this.trigger !== "focus" || this.confirm || this.isInput && !fromInput) {
        return false;
      }
      this.visible = true;
    },
    handleBlur(fromInput = true) {
      if (this.trigger !== "focus" || this.confirm || this.isInput && !fromInput) {
        return false;
      }
      this.visible = false;
    },
    handleMouseenter() {
      if (this.disabled)
        return;
      if (this.trigger !== "hover" || this.confirm) {
        return false;
      }
      if (this.enterTimer)
        clearTimeout(this.enterTimer);
      this.enterTimer = setTimeout(() => {
        this.visible = true;
      }, 100);
    },
    handleMouseleave() {
      if (this.trigger !== "hover" || this.confirm) {
        return false;
      }
      if (this.enterTimer) {
        clearTimeout(this.enterTimer);
        this.enterTimer = setTimeout(() => {
          this.visible = false;
        }, 100);
      }
    },
    cancel() {
      this.visible = false;
      this.$emit("on-cancel");
    },
    ok() {
      this.visible = false;
      this.$emit("on-ok");
    },
    getInputChildren() {
      const $input = this.$refs.reference.querySelectorAll("input");
      const $textarea = this.$refs.reference.querySelectorAll("textarea");
      let $children = null;
      if ($input.length) {
        $children = $input[0];
      } else if ($textarea.length) {
        $children = $textarea[0];
      }
      return $children;
    },
    handleGetIndex() {
      transferIncrease();
      return transferIndex;
    },
    handleIndexIncrease() {
      this.tIndex = this.handleGetIndex();
    }
  },
  mounted() {
    if (!this.confirm) {
      this.showTitle = this.$slots.title !== void 0 || this.title;
    }
    if (this.trigger === "focus") {
      nextTick(() => {
        const $children = this.getInputChildren();
        if ($children) {
          this.isInput = true;
          $children.addEventListener("focus", this.handleFocus, false);
          $children.addEventListener("blur", this.handleBlur, false);
        }
      });
    }
  },
  beforeUnmount() {
    const $children = this.getInputChildren();
    if ($children) {
      $children.removeEventListener("focus", this.handleFocus, false);
      $children.removeEventListener("blur", this.handleBlur, false);
    }
  }
};
const _hoisted_1 = /* @__PURE__ */ createElementVNode("i", { class: "ivu-icon ivu-icon-ios-help-circle" }, null, -1);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_button = resolveComponent("i-button");
  const _directive_click_outside = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes),
    onMouseenter: _cache[6] || (_cache[6] = (...args) => $options.handleMouseenter && $options.handleMouseenter(...args)),
    onMouseleave: _cache[7] || (_cache[7] = (...args) => $options.handleMouseleave && $options.handleMouseleave(...args))
  }, [
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-rel"]),
      ref: "reference",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClick && $options.handleClick(...args)),
      onMousedown: _cache[1] || (_cache[1] = ($event) => $options.handleFocus(false)),
      onMouseup: _cache[2] || (_cache[2] = ($event) => $options.handleBlur(false))
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 34),
    (openBlock(), createBlock(Teleport, {
      to: "body",
      disabled: !$props.transfer
    }, [
      createVNode(Transition, { name: "fade" }, {
        default: withCtx(() => [
          withDirectives(createElementVNode("div", {
            class: normalizeClass($options.popperClasses),
            style: normalizeStyle($options.styles),
            ref: "popper",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.handleTransferClick && $options.handleTransferClick(...args)),
            onMouseenter: _cache[4] || (_cache[4] = (...args) => $options.handleMouseenter && $options.handleMouseenter(...args)),
            onMouseleave: _cache[5] || (_cache[5] = (...args) => $options.handleMouseleave && $options.handleMouseleave(...args))
          }, [
            createElementVNode("div", {
              class: normalizeClass([$data.prefixCls + "-content"])
            }, [
              createElementVNode("div", {
                class: normalizeClass([$data.prefixCls + "-arrow"])
              }, null, 2),
              $props.confirm ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass([$data.prefixCls + "-inner"])
              }, [
                createElementVNode("div", {
                  class: normalizeClass([$data.prefixCls + "-body"])
                }, [
                  _hoisted_1,
                  createElementVNode("div", {
                    class: normalizeClass([$data.prefixCls + "-body-message"])
                  }, [
                    renderSlot(_ctx.$slots, "title", {}, () => [
                      createTextVNode(toDisplayString($props.title), 1)
                    ])
                  ], 2)
                ], 2),
                createElementVNode("div", {
                  class: normalizeClass([$data.prefixCls + "-footer"])
                }, [
                  createVNode(_component_i_button, {
                    type: "text",
                    size: "small",
                    onClick: $options.cancel
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString($options.localeCancelText), 1)
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_i_button, {
                    type: "primary",
                    size: "small",
                    onClick: $options.ok
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString($options.localeOkText), 1)
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ], 2)
              ], 2)) : createCommentVNode("", true),
              !$props.confirm ? (openBlock(), createElementBlock("div", {
                key: 1,
                class: normalizeClass([$data.prefixCls + "-inner"])
              }, [
                $data.showTitle ? (openBlock(), createElementBlock("div", {
                  key: 0,
                  class: normalizeClass([$data.prefixCls + "-title"]),
                  style: normalizeStyle($options.contentPaddingStyle),
                  ref: "title"
                }, [
                  renderSlot(_ctx.$slots, "title", {}, () => [
                    createElementVNode("div", {
                      class: normalizeClass([$data.prefixCls + "-title-inner"])
                    }, toDisplayString($props.title), 3)
                  ])
                ], 6)) : createCommentVNode("", true),
                createElementVNode("div", {
                  class: normalizeClass([$data.prefixCls + "-body"]),
                  style: normalizeStyle($options.contentPaddingStyle)
                }, [
                  createElementVNode("div", {
                    class: normalizeClass($options.contentClasses)
                  }, [
                    renderSlot(_ctx.$slots, "content", {}, () => [
                      createElementVNode("div", {
                        class: normalizeClass([$data.prefixCls + "-body-content-inner"])
                      }, toDisplayString($props.content), 3)
                    ])
                  ], 2)
                ], 6)
              ], 2)) : createCommentVNode("", true)
            ], 2)
          ], 38), [
            [vShow, _ctx.visible]
          ])
        ]),
        _: 3
      })
    ], 8, ["disabled"]))
  ], 34)), [
    [_directive_click_outside, $options.handleClose]
  ]);
}
var Poptip = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Poptip as default };
