import { getCurrentInstance, resolveComponent, openBlock, createBlock, Teleport, createElementVNode, createVNode, Transition, withCtx, withDirectives, createElementBlock, normalizeClass, normalizeStyle, vShow, createCommentVNode, renderSlot, toDisplayString } from "vue";
import Icon from "../icon/icon.js";
import { oneOf } from "../../utils/assist.js";
import ScrollbarMixins from "../modal/mixins-scrollbar.js";
import { on, off } from "../../utils/dom.js";
import random from "../../utils/random_str.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-drawer";
const _sfc_main = {
  name: "Drawer",
  mixins: [ScrollbarMixins],
  components: { Icon },
  emits: ["on-close", "on-resize-width", "on-visible-change", "update:modelValue", "on-drag"],
  provide() {
    return {
      DrawerInstance: this
    };
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    width: {
      type: [Number, String],
      default: 256
    },
    height: {
      type: [Number, String],
      default: 256
    },
    closable: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    mask: {
      type: Boolean,
      default: true
    },
    maskStyle: {
      type: Object
    },
    styles: {
      type: Object
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    placement: {
      validator(value) {
        return oneOf(value, ["left", "right", "top", "bottom"]);
      },
      default: "right"
    },
    zIndex: {
      type: Number,
      default: 1e3
    },
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? true : global.$VIEWUI.transfer;
      }
    },
    className: {
      type: String
    },
    inner: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    beforeClose: Function
  },
  data() {
    return {
      prefixCls,
      visible: this.modelValue,
      wrapShow: false,
      showHead: true,
      canMove: false,
      dragWidth: this.width,
      dragHeight: this.height,
      wrapperWidth: this.width,
      wrapperHeight: this.height,
      wrapperLeft: 0,
      minWidth: 256,
      minHeight: 256,
      id: random(6),
      tableList: [],
      sliderList: []
    };
  },
  computed: {
    wrapClasses() {
      return [
        `${prefixCls}-wrap`,
        {
          [`${prefixCls}-hidden`]: !this.wrapShow,
          [`${this.className}`]: !!this.className,
          [`${prefixCls}-no-mask`]: !this.mask,
          [`${prefixCls}-wrap-inner`]: this.inner,
          [`${prefixCls}-wrap-dragging`]: this.canMove
        }
      ];
    },
    mainStyles() {
      let style = {};
      if (this.placement === "left" || this.placement === "right") {
        const width = parseInt(this.dragWidth);
        const styleWidth = {
          width: width <= 100 ? `${width}%` : `${width}px`
        };
        Object.assign(style, styleWidth);
      } else {
        const height = parseInt(this.dragHeight);
        const styleHeight = {
          height: height <= 100 ? `${height}%` : `${height}px`
        };
        Object.assign(style, styleHeight);
      }
      return style;
    },
    contentClasses() {
      return [
        `${prefixCls}-content`,
        {
          [`${prefixCls}-content-no-mask`]: !this.mask
        }
      ];
    },
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.placement}`,
        {
          [`${prefixCls}-no-header`]: !this.showHead,
          [`${prefixCls}-inner`]: this.inner
        }
      ];
    },
    maskClasses() {
      return [
        `${prefixCls}-mask`,
        {
          [`${prefixCls}-mask-inner`]: this.inner
        }
      ];
    },
    transitionName() {
      if (this.placement === "left" || this.placement === "right")
        return `move-${this.placement}`;
      else if (this.placement === "top")
        return "move-up";
      else
        return "move-down";
    }
  },
  methods: {
    close() {
      if (!this.beforeClose) {
        return this.handleClose();
      }
      const before = this.beforeClose();
      if (before && before.then) {
        before.then(() => {
          this.handleClose();
        });
      } else {
        this.handleClose();
      }
    },
    handleClose() {
      this.visible = false;
      this.$emit("update:modelValue", false);
      this.$emit("on-close");
    },
    handleMask() {
      if (this.maskClosable && this.mask) {
        this.close();
      }
    },
    handleWrapClick(event) {
      const className = event.target.getAttribute("class");
      if (className && className.indexOf(`${prefixCls}-wrap`) > -1)
        this.handleMask();
    },
    handleMousemove(event) {
      if (!this.canMove || !this.draggable)
        return;
      this.handleSetWrapperWidth();
      const left = event.pageX - this.wrapperLeft;
      let width = this.placement === "right" ? this.wrapperWidth - left : left;
      width = Math.max(width, parseFloat(this.minWidth));
      event.atMin = width === parseFloat(this.minWidth);
      if (width <= 100)
        width = width / this.wrapperWidth * 100;
      this.dragWidth = width;
      this.$emit("on-resize-width", parseInt(this.dragWidth));
      this.$emit("on-drag", "dragging", parseInt(this.dragWidth));
    },
    handleSetWrapperWidth() {
      const {
        width,
        left
      } = this.$refs.drawer.getBoundingClientRect();
      this.wrapperWidth = width;
      this.wrapperLeft = left;
    },
    handleMouseup() {
      if (!this.draggable)
        return;
      this.canMove = false;
      this.$emit("on-drag", "end");
    },
    handleTriggerMousedown() {
      this.canMove = true;
      window.getSelection().removeAllRanges();
      this.$emit("on-drag", "start");
    },
    addDrawer() {
      const root = this.$root;
      if (!root.drawerList)
        root.drawerList = [];
      root.drawerList.push({
        id: this.id,
        drawer: this
      });
    },
    removeDrawer() {
      const root = this.$root;
      if (!root.drawerList)
        return;
      const index = root.drawerList.findIndex((item) => item.id === this.id);
      root.drawerList.splice(index, 1);
    }
  },
  mounted() {
    if (this.visible) {
      this.wrapShow = true;
    }
    let showHead = true;
    if (this.$slots.header === void 0 && !this.title) {
      showHead = false;
    }
    this.showHead = showHead;
    this.addDrawer();
    on(document, "mousemove", this.handleMousemove);
    on(document, "mouseup", this.handleMouseup);
    this.handleSetWrapperWidth();
  },
  beforeUnmount() {
    this.removeDrawer();
    off(document, "mousemove", this.handleMousemove);
    off(document, "mouseup", this.handleMouseup);
    this.removeScrollEffect();
  },
  watch: {
    modelValue(val) {
      this.visible = val;
    },
    visible(val) {
      if (val === false) {
        this.timer = setTimeout(() => {
          this.wrapShow = false;
          const drawers = this.$root.drawerList.map((item) => item.drawer);
          const otherDrawers = drawers.filter((item) => item.id !== this.id);
          const isScrollDrawer = otherDrawers.some((item) => item.visible && !item.scrollable);
          if (!isScrollDrawer) {
            this.removeScrollEffect();
          }
        }, 300);
      } else {
        if (this.timer)
          clearTimeout(this.timer);
        this.wrapShow = true;
        if (!this.scrollable) {
          this.addScrollEffect();
        }
      }
      this.tableList.forEach((item) => {
        item.table.handleOnVisibleChange(val);
      });
      this.sliderList.forEach((item) => {
        item.slider.handleOnVisibleChange(val);
      });
      this.$emit("on-visible-change", val);
    },
    scrollable(val) {
      if (!val) {
        this.addScrollEffect();
      } else {
        this.removeScrollEffect();
      }
    },
    title(val) {
      if (this.$slots.header === void 0) {
        this.showHead = !!val;
      }
    },
    width(val) {
      this.dragWidth = val;
    },
    height(val) {
      this.dragHeight = val;
    }
  }
};
const _hoisted_1 = { ref: "drawer" };
const _hoisted_2 = /* @__PURE__ */ createElementVNode("div", { class: "ivu-drawer-drag-move-trigger" }, [
  /* @__PURE__ */ createElementVNode("div", { class: "ivu-drawer-drag-move-trigger-point" }, [
    /* @__PURE__ */ createElementVNode("i"),
    /* @__PURE__ */ createElementVNode("i"),
    /* @__PURE__ */ createElementVNode("i"),
    /* @__PURE__ */ createElementVNode("i"),
    /* @__PURE__ */ createElementVNode("i")
  ])
], -1);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createBlock(Teleport, {
    to: "body",
    disabled: !$props.transfer
  }, [
    createElementVNode("div", _hoisted_1, [
      createVNode(Transition, { name: "fade" }, {
        default: withCtx(() => [
          $props.mask ? withDirectives((openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass($options.maskClasses),
            style: normalizeStyle($props.maskStyle),
            onClick: _cache[0] || (_cache[0] = (...args) => $options.handleMask && $options.handleMask(...args))
          }, null, 6)), [
            [vShow, $data.visible]
          ]) : createCommentVNode("", true)
        ]),
        _: 1
      }),
      createElementVNode("div", {
        class: normalizeClass($options.wrapClasses),
        onClick: _cache[3] || (_cache[3] = (...args) => $options.handleWrapClick && $options.handleWrapClick(...args))
      }, [
        createVNode(Transition, { name: $options.transitionName }, {
          default: withCtx(() => [
            withDirectives(createElementVNode("div", {
              class: normalizeClass($options.classes),
              style: normalizeStyle($options.mainStyles)
            }, [
              createElementVNode("div", {
                class: normalizeClass($options.contentClasses),
                ref: "content"
              }, [
                $props.closable ? (openBlock(), createElementBlock("a", {
                  key: 0,
                  class: "ivu-drawer-close",
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.close && $options.close(...args))
                }, [
                  renderSlot(_ctx.$slots, "close", {}, () => [
                    createVNode(_component_Icon, { type: "ios-close" })
                  ])
                ])) : createCommentVNode("", true),
                $data.showHead ? (openBlock(), createElementBlock("div", {
                  key: 1,
                  class: normalizeClass([$data.prefixCls + "-header"])
                }, [
                  renderSlot(_ctx.$slots, "header", {}, () => [
                    createElementVNode("div", {
                      class: normalizeClass([$data.prefixCls + "-header-inner"])
                    }, toDisplayString($props.title), 3)
                  ])
                ], 2)) : createCommentVNode("", true),
                createElementVNode("div", {
                  class: normalizeClass([$data.prefixCls + "-body"]),
                  style: normalizeStyle($props.styles)
                }, [
                  renderSlot(_ctx.$slots, "default")
                ], 6)
              ], 2),
              $props.draggable && ($props.placement === "left" || $props.placement === "right") ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass(["ivu-drawer-drag", "ivu-drawer-drag-" + $props.placement]),
                onMousedown: _cache[2] || (_cache[2] = (...args) => $options.handleTriggerMousedown && $options.handleTriggerMousedown(...args))
              }, [
                renderSlot(_ctx.$slots, "trigger", {}, () => [
                  _hoisted_2
                ])
              ], 34)) : createCommentVNode("", true)
            ], 6), [
              [vShow, $data.visible]
            ])
          ]),
          _: 3
        }, 8, ["name"])
      ], 2)
    ], 512)
  ], 8, ["disabled"]);
}
var Drawer = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Drawer as default };
