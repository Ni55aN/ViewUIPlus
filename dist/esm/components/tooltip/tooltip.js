import { getCurrentInstance, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createBlock, Teleport, createVNode, Transition, withCtx, withDirectives, normalizeStyle, createTextVNode, toDisplayString, vShow } from "vue";
import Popper from "../base/popper.js";
import { oneOf } from "../../utils/assist.js";
import { transferIncrease, transferIndex } from "../../utils/transfer-queue.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-tooltip";
const _sfc_main = {
  name: "Tooltip",
  mixins: [Popper],
  props: {
    placement: {
      validator(value) {
        return oneOf(value, ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]);
      },
      default: "bottom"
    },
    content: {
      type: [String, Number],
      default: ""
    },
    delay: {
      type: Number,
      default: 100
    },
    disabled: {
      type: Boolean,
      default: false
    },
    controlled: {
      type: Boolean,
      default: false
    },
    always: {
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
      type: [String, Number]
    },
    transferClassName: {
      type: String
    }
  },
  data() {
    return {
      prefixCls,
      tIndex: this.handleGetIndex()
    };
  },
  computed: {
    innerStyles() {
      const styles = {};
      if (this.maxWidth)
        styles["max-width"] = `${this.maxWidth}px`;
      return styles;
    },
    innerClasses() {
      return [
        `${prefixCls}-inner`,
        {
          [`${prefixCls}-inner-with-width`]: !!this.maxWidth
        }
      ];
    },
    dropStyles() {
      let styles = {};
      if (this.transfer)
        styles["z-index"] = 1060 + this.tIndex;
      return styles;
    },
    dropdownCls() {
      return [
        `${prefixCls}-popper`,
        `${prefixCls}-${this.theme}`,
        {
          [prefixCls + "-transfer"]: this.transfer,
          [this.transferClassName]: this.transferClassName
        }
      ];
    }
  },
  watch: {
    content() {
      this.updatePopper();
    }
  },
  methods: {
    handleShowPopper() {
      if (this.timeout)
        clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.visible = true;
      }, this.delay);
      this.tIndex = this.handleGetIndex();
    },
    handleClosePopper() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        if (!this.controlled) {
          this.timeout = setTimeout(() => {
            this.visible = false;
          }, 100);
        }
      }
    },
    handleGetIndex() {
      transferIncrease();
      return transferIndex;
    }
  },
  mounted() {
    if (this.always) {
      this.updatePopper();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass([$data.prefixCls]),
    onMouseenter: _cache[2] || (_cache[2] = (...args) => $options.handleShowPopper && $options.handleShowPopper(...args)),
    onMouseleave: _cache[3] || (_cache[3] = (...args) => $options.handleClosePopper && $options.handleClosePopper(...args))
  }, [
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-rel"]),
      ref: "reference"
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2),
    (openBlock(), createBlock(Teleport, {
      to: "body",
      disabled: !$props.transfer
    }, [
      createVNode(Transition, { name: "fade" }, {
        default: withCtx(() => [
          withDirectives(createElementVNode("div", {
            ref: "popper",
            class: normalizeClass($options.dropdownCls),
            style: normalizeStyle($options.dropStyles),
            onMouseenter: _cache[0] || (_cache[0] = (...args) => $options.handleShowPopper && $options.handleShowPopper(...args)),
            onMouseleave: _cache[1] || (_cache[1] = (...args) => $options.handleClosePopper && $options.handleClosePopper(...args))
          }, [
            createElementVNode("div", {
              class: normalizeClass([$data.prefixCls + "-content"])
            }, [
              createElementVNode("div", {
                class: normalizeClass([$data.prefixCls + "-arrow"])
              }, null, 2),
              createElementVNode("div", {
                class: normalizeClass($options.innerClasses),
                style: normalizeStyle($options.innerStyles)
              }, [
                renderSlot(_ctx.$slots, "content", {}, () => [
                  createTextVNode(toDisplayString($props.content), 1)
                ])
              ], 6)
            ], 2)
          ], 38), [
            [vShow, !$props.disabled && (_ctx.visible || $props.always)]
          ])
        ]),
        _: 3
      })
    ], 8, ["disabled"]))
  ], 34);
}
var Tooltip = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Tooltip as default };
