import { nextTick, openBlock, createBlock, Teleport, createVNode, Transition, withCtx, withDirectives, createElementVNode, mergeProps, withModifiers, renderSlot, vShow } from "vue";
import { getStyle } from "../../utils/assist.js";
import Popper from "popper.js/dist/umd/popper.js";
import { transferIncrease, transferIndex } from "../../utils/transfer-queue.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Drop",
  emits: ["mouseenter", "mouseleave", "click"],
  props: {
    placement: {
      type: String,
      default: "bottom-start"
    },
    className: {
      type: String
    },
    transfer: {
      type: Boolean
    },
    eventsEnabled: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean
    },
    classes: {
      type: Object,
      default: () => {
      }
    },
    styles: {
      type: Object,
      default: () => {
      }
    },
    transitionName: {
      type: String,
      default: "transition-drop"
    },
    boundariesElement: {
      default: "window"
    }
  },
  data() {
    return {
      popper: null,
      width: "",
      popperStatus: false,
      tIndex: this.handleGetIndex()
    };
  },
  computed: {
    mergedStyle() {
      let style = {};
      if (this.width)
        style.minWidth = `${this.width}px`;
      if (this.transfer)
        style["z-index"] = 1060 + this.tIndex;
      return Object.assign({}, this.styles, style);
    },
    mergedClass() {
      return Object.assign({}, this.classes, {
        [this.className]: this.className
      });
    }
  },
  methods: {
    update() {
      nextTick(() => {
        if (this.popper) {
          this.popper.update();
          this.popperStatus = true;
        } else {
          this.popper = new Popper(this.$parent.$refs.reference, this.$refs.drop, {
            eventsEnabled: this.eventsEnabled,
            placement: this.placement,
            modifiers: {
              computeStyle: {
                gpuAcceleration: false
              },
              preventOverflow: {
                boundariesElement: this.boundariesElement
              }
            },
            onCreate: () => {
              this.resetTransformOrigin();
              nextTick(this.popper.update());
            },
            onUpdate: () => {
              this.resetTransformOrigin();
            }
          });
        }
        if (this.$parent.$options.name === "iSelect") {
          this.width = parseInt(getStyle(this.$parent.$el, "width"));
        }
        this.tIndex = this.handleGetIndex();
      });
    },
    destroy() {
      if (this.popper) {
        setTimeout(() => {
          if (this.popper && !this.popperStatus) {
            this.popper.popper.style.display = "none";
            this.popper.destroy();
            this.popper = null;
          }
          this.popperStatus = false;
        }, 300);
      }
    },
    resetTransformOrigin() {
      if (!this.popper)
        return;
      let x_placement = this.popper.popper.getAttribute("x-placement");
      let placementStart = x_placement.split("-")[0];
      let placementEnd = x_placement.split("-")[1];
      const leftOrRight = x_placement === "left" || x_placement === "right";
      if (!leftOrRight) {
        this.popper.popper.style.transformOrigin = placementStart === "bottom" || placementStart !== "top" && placementEnd === "start" ? "center top" : "center bottom";
      }
    },
    handleGetIndex() {
      transferIncrease();
      return transferIndex;
    },
    handleMouseenter(e) {
      this.$emit("mouseenter", e);
    },
    handleMouseleave(e) {
      this.$emit("mouseleave", e);
    },
    handleOnUpdatePopper() {
      this.update();
    },
    handleOnDestroyPopper() {
      this.destroy();
    },
    handleClick(event) {
      this.$emit("click", event);
    }
  },
  beforeUnmount() {
    if (this.popper) {
      this.popper.destroy();
      this.popper = null;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Teleport, {
    to: "body",
    disabled: !$props.transfer
  }, [
    createVNode(Transition, { name: $props.transitionName }, {
      default: withCtx(() => [
        withDirectives(createElementVNode("div", mergeProps({
          class: ["ivu-select-dropdown", $options.mergedClass],
          ref: "drop",
          style: $options.mergedStyle
        }, _ctx.$attrs, {
          onMouseenter: _cache[0] || (_cache[0] = (...args) => $options.handleMouseenter && $options.handleMouseenter(...args)),
          onMouseleave: _cache[1] || (_cache[1] = (...args) => $options.handleMouseleave && $options.handleMouseleave(...args)),
          onClick: _cache[2] || (_cache[2] = withModifiers((...args) => $options.handleClick && $options.handleClick(...args), ["stop"]))
        }), [
          renderSlot(_ctx.$slots, "default")
        ], 16), [
          [vShow, $props.visible]
        ])
      ]),
      _: 3
    }, 8, ["name"])
  ], 8, ["disabled"]);
}
var Drop = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Drop as default };
