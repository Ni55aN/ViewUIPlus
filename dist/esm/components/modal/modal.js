import { getCurrentInstance, resolveComponent, openBlock, createBlock, Teleport, createVNode, Transition, withCtx, withDirectives, createElementBlock, normalizeClass, normalizeStyle, vShow, createCommentVNode, createElementVNode, mergeProps, renderSlot, toDisplayString, createTextVNode } from "vue";
import Icon from "../icon/icon.js";
import _sfc_main$1 from "../button/button.js";
import Locale from "../../mixins/locale.js";
import ScrollbarMixins from "./mixins-scrollbar.js";
import { on, off } from "../../utils/dom.js";
import { deepCopy } from "../../utils/assist.js";
import random from "../../utils/random_str.js";
import { isClient } from "../../utils/index.js";
import { transferIncrease, transferIndex, lastVisibleIndex, lastVisibleIncrease } from "../../utils/transfer-queue.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-modal";
const dragData = {
  x: null,
  y: null,
  dragX: null,
  dragY: null,
  dragging: false,
  rect: null
};
const _sfc_main = {
  inheritAttrs: false,
  name: "Modal",
  mixins: [Locale, ScrollbarMixins],
  components: { Icon, iButton: _sfc_main$1 },
  emits: ["on-cancel", "on-ok", "on-hidden", "on-visible-change", "update:modelValue"],
  provide() {
    return {
      ModalInstance: this
    };
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.modal.maskClosable === "" ? true : global.$VIEWUI.modal.maskClosable;
      }
    },
    title: {
      type: String
    },
    width: {
      type: [Number, String],
      default: 520
    },
    okText: {
      type: String
    },
    cancelText: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    },
    styles: {
      type: Object,
      default() {
        return {};
      }
    },
    className: {
      type: String
    },
    footerHide: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    transitionNames: {
      type: Array,
      default() {
        return ["ease", "fade"];
      }
    },
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? true : global.$VIEWUI.transfer;
      }
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    mask: {
      type: Boolean,
      default: true
    },
    draggable: {
      type: Boolean,
      default: false
    },
    sticky: {
      type: Boolean,
      default: false
    },
    stickyDistance: {
      type: Number,
      default: 10
    },
    resetDragPosition: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 1e3
    },
    beforeClose: Function,
    render: Function
  },
  data() {
    return {
      prefixCls,
      wrapShow: false,
      showHead: true,
      buttonLoading: false,
      visible: this.modelValue,
      dragData: deepCopy(dragData),
      modalIndex: this.handleGetModalIndex(),
      isMouseTriggerIn: false,
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
          [`${prefixCls}-no-mask`]: !this.showMask
        }
      ];
    },
    wrapStyles() {
      return {
        zIndex: this.modalIndex + this.zIndex
      };
    },
    maskClasses() {
      return `${prefixCls}-mask`;
    },
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-fullscreen`]: this.fullscreen,
          [`${prefixCls}-fullscreen-no-header`]: this.fullscreen && !this.showHead,
          [`${prefixCls}-fullscreen-no-footer`]: this.fullscreen && this.footerHide
        }
      ];
    },
    contentClasses() {
      return [
        `${prefixCls}-content`,
        {
          [`${prefixCls}-content-no-mask`]: !this.showMask,
          [`${prefixCls}-content-drag`]: this.draggable && !this.fullscreen,
          [`${prefixCls}-content-dragging`]: this.draggable && this.dragData.dragging
        }
      ];
    },
    mainStyles() {
      let style = {};
      const width = parseInt(this.width);
      const styleWidth = this.dragData.x !== null ? {
        top: 0
      } : {
        width: width <= 100 ? `${width}%` : `${width}px`
      };
      const customStyle = this.styles ? this.styles : {};
      Object.assign(style, styleWidth, customStyle);
      return style;
    },
    contentStyles() {
      let style = {};
      if (this.draggable && !this.fullscreen) {
        const customTop = this.styles.top ? parseFloat(this.styles.top) : 0;
        const customLeft = this.styles.left ? parseFloat(this.styles.left) : 0;
        if (this.dragData.x !== null)
          style.left = `${this.dragData.x - customLeft}px`;
        if (this.dragData.y !== null)
          style.top = `${this.dragData.y}px`;
        if (this.dragData.y !== null)
          style.top = `${this.dragData.y - customTop}px`;
        const width = parseInt(this.width);
        const styleWidth = {
          width: width <= 100 ? `${width}%` : `${width}px`
        };
        Object.assign(style, styleWidth);
      }
      return style;
    },
    localeOkText() {
      if (this.okText === void 0) {
        return this.t("i.modal.okText");
      } else {
        return this.okText;
      }
    },
    localeCancelText() {
      if (this.cancelText === void 0) {
        return this.t("i.modal.cancelText");
      } else {
        return this.cancelText;
      }
    },
    showMask() {
      return this.mask;
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
      this.$emit("on-cancel");
    },
    handleMask() {
      if (this.maskClosable && this.showMask) {
        this.close();
      }
    },
    handleWrapClick(event) {
      if (this.isMouseTriggerIn) {
        this.isMouseTriggerIn = false;
        return;
      }
      const className = event.target.getAttribute("class");
      if (className && className.indexOf(`${prefixCls}-wrap`) > -1)
        this.handleMask();
    },
    handleMousedown() {
      this.isMouseTriggerIn = true;
    },
    cancel() {
      this.close();
    },
    ok() {
      if (this.loading) {
        this.buttonLoading = true;
      } else {
        this.visible = false;
        this.$emit("update:modelValue", false);
      }
      this.$emit("on-ok");
    },
    EscClose(e) {
      if (this.visible && this.closable) {
        if (e.keyCode === 27) {
          const $Modals = this.$root.modalList.map((item) => item.modal).filter((item) => item.$data.visible && item.$props.closable);
          const $TopModal = $Modals.sort((a, b) => {
            return a.$data.modalIndex < b.$data.modalIndex ? 1 : -1;
          })[0];
          setTimeout(() => {
            $TopModal.close();
          }, 0);
        }
      }
    },
    animationFinish() {
      this.$emit("on-hidden");
    },
    handleMoveStart(event) {
      if (!this.draggable || this.fullscreen)
        return false;
      const $content = this.$refs.content;
      const rect = $content.getBoundingClientRect();
      this.dragData.rect = rect;
      this.dragData.x = rect.x || rect.left;
      this.dragData.y = rect.y || rect.top;
      const distance = {
        x: event.clientX,
        y: event.clientY
      };
      this.dragData.dragX = distance.x;
      this.dragData.dragY = distance.y;
      this.dragData.dragging = true;
      on(window, "mousemove", this.handleMoveMove);
      on(window, "mouseup", this.handleMoveEnd);
    },
    handleMoveMove(event) {
      if (!this.dragData.dragging || this.fullscreen)
        return false;
      const distance = {
        x: event.clientX,
        y: event.clientY
      };
      const diff_distance = {
        x: distance.x - this.dragData.dragX,
        y: distance.y - this.dragData.dragY
      };
      if (isClient && this.sticky) {
        const clientWidth = document.documentElement.clientWidth;
        const clientHeight = document.documentElement.clientHeight;
        if (this.dragData.x + diff_distance.x <= this.stickyDistance && diff_distance.x < 0) {
          this.dragData.x = 0;
        } else if (this.dragData.x + this.dragData.rect.width - clientWidth > -this.stickyDistance && diff_distance.x > 0) {
          this.dragData.x = clientWidth - this.dragData.rect.width;
        } else {
          this.dragData.x += diff_distance.x;
        }
        if (this.dragData.y + diff_distance.y <= this.stickyDistance && diff_distance.y < 0) {
          this.dragData.y = 0;
        } else if (this.dragData.y + this.dragData.rect.height - clientHeight > -this.stickyDistance && diff_distance.y > 0) {
          this.dragData.y = clientHeight - this.dragData.rect.height;
        } else {
          this.dragData.y += diff_distance.y;
        }
      } else {
        this.dragData.x += diff_distance.x;
        this.dragData.y += diff_distance.y;
      }
      this.dragData.dragX = distance.x;
      this.dragData.dragY = distance.y;
    },
    handleMoveEnd() {
      this.dragData.dragging = false;
      off(window, "mousemove", this.handleMoveMove);
      off(window, "mouseup", this.handleMoveEnd);
    },
    handleGetModalIndex() {
      transferIncrease();
      return transferIndex;
    },
    handleClickModal() {
      if (this.draggable) {
        if (lastVisibleIndex !== this.lastVisibleIndex) {
          this.lastVisibleIndex = lastVisibleIndex;
          return;
        }
        this.modalIndex = this.handleGetModalIndex();
      }
    },
    addModal() {
      const root = this.$root;
      if (!root.modalList)
        root.modalList = [];
      root.modalList.push({
        id: this.id,
        modal: this
      });
    },
    removeModal() {
      const root = this.$root;
      if (!root.modalList)
        return;
      const index = root.modalList.findIndex((item) => item.id === this.id);
      root.modalList.splice(index, 1);
    }
  },
  watch: {
    modelValue(val) {
      this.visible = val;
    },
    visible(val) {
      if (val === false) {
        this.buttonLoading = false;
        this.timer = setTimeout(() => {
          this.wrapShow = false;
          this.removeScrollEffect();
        }, 300);
      } else {
        if (this.lastVisible !== val) {
          this.modalIndex = this.handleGetModalIndex();
          lastVisibleIncrease();
        }
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
      this.lastVisible = val;
      this.lastVisibleIndex = lastVisibleIndex;
      if (val && this.resetDragPosition) {
        this.dragData = deepCopy(dragData);
      }
    },
    loading(val) {
      if (!val) {
        this.buttonLoading = false;
      }
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
    this.addModal();
    isClient && document.addEventListener("keydown", this.EscClose);
  },
  beforeUnmount() {
    this.removeModal();
    isClient && document.removeEventListener("keydown", this.EscClose);
    this.removeScrollEffect();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_i_button = resolveComponent("i-button");
  return openBlock(), createBlock(Teleport, {
    to: "body",
    disabled: !$props.transfer
  }, [
    createVNode(Transition, {
      name: $props.transitionNames[1]
    }, {
      default: withCtx(() => [
        $options.showMask ? withDirectives((openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass($options.maskClasses),
          style: normalizeStyle($options.wrapStyles),
          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleMask && $options.handleMask(...args))
        }, null, 6)), [
          [vShow, $data.visible]
        ]) : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["name"]),
    createElementVNode("div", {
      class: normalizeClass($options.wrapClasses),
      style: normalizeStyle($options.wrapStyles),
      onClick: _cache[5] || (_cache[5] = (...args) => $options.handleWrapClick && $options.handleWrapClick(...args))
    }, [
      createVNode(Transition, {
        name: $props.transitionNames[0],
        onAfterLeave: $options.animationFinish
      }, {
        default: withCtx(() => [
          withDirectives(createElementVNode("div", mergeProps(_ctx.$attrs, {
            class: $options.classes,
            style: $options.mainStyles,
            onMousedown: _cache[4] || (_cache[4] = (...args) => $options.handleMousedown && $options.handleMousedown(...args))
          }), [
            createElementVNode("div", {
              class: normalizeClass($options.contentClasses),
              ref: "content",
              style: normalizeStyle($options.contentStyles),
              onClick: _cache[3] || (_cache[3] = (...args) => $options.handleClickModal && $options.handleClickModal(...args))
            }, [
              $props.closable ? (openBlock(), createElementBlock("a", {
                key: 0,
                class: normalizeClass([$data.prefixCls + "-close"]),
                onClick: _cache[1] || (_cache[1] = (...args) => $options.close && $options.close(...args))
              }, [
                renderSlot(_ctx.$slots, "close", {}, () => [
                  createVNode(_component_Icon, { type: "ios-close" })
                ])
              ], 2)) : createCommentVNode("", true),
              $data.showHead ? (openBlock(), createElementBlock("div", {
                key: 1,
                class: normalizeClass([$data.prefixCls + "-header"]),
                onMousedown: _cache[2] || (_cache[2] = (...args) => $options.handleMoveStart && $options.handleMoveStart(...args))
              }, [
                renderSlot(_ctx.$slots, "header", {}, () => [
                  createElementVNode("div", {
                    class: normalizeClass([$data.prefixCls + "-header-inner"])
                  }, toDisplayString($props.title), 3)
                ])
              ], 34)) : createCommentVNode("", true),
              createElementVNode("div", {
                class: normalizeClass([$data.prefixCls + "-body"])
              }, [
                renderSlot(_ctx.$slots, "default")
              ], 2),
              !$props.footerHide ? (openBlock(), createElementBlock("div", {
                key: 2,
                class: normalizeClass([$data.prefixCls + "-footer"])
              }, [
                renderSlot(_ctx.$slots, "footer", {}, () => [
                  createVNode(_component_i_button, {
                    type: "text",
                    onClick: $options.cancel
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString($options.localeCancelText), 1)
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_i_button, {
                    type: "primary",
                    loading: $data.buttonLoading,
                    onClick: $options.ok
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString($options.localeOkText), 1)
                    ]),
                    _: 1
                  }, 8, ["loading", "onClick"])
                ])
              ], 2)) : createCommentVNode("", true)
            ], 6)
          ], 16), [
            [vShow, $data.visible]
          ])
        ]),
        _: 3
      }, 8, ["name", "onAfterLeave"])
    ], 6)
  ], 8, ["disabled"]);
}
var Modal = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Modal as default };
