import { getCurrentInstance, resolveComponent, openBlock, createBlock, Teleport, createVNode, Transition, withCtx, createElementBlock, normalizeStyle, createCommentVNode, createElementVNode, mergeProps, withModifiers, toDisplayString, normalizeClass, withDirectives, vShow } from "vue";
import { on, off } from "../../utils/dom.js";
import throttle from "lodash.throttle";
import { isClient } from "../../utils/index.js";
import Locale from "../../mixins/locale.js";
import Icon from "../icon/icon.js";
import KeyCode from "../../utils/keyCode.js";
import Spin from "../spin/spin2.js";
import { transferIndex, transferIncrease } from "../../utils/transfer-queue.js";
import Row from "../row/row.js";
import Col from "../col/col.js";
import { downloadFile } from "../../utils/assist.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "ImagePreview",
  mixins: [Locale],
  components: { Icon, Spin, Row, Col },
  inheritAttrs: false,
  emits: ["update:modelValue", "on-close", "on-switch"],
  props: {
    modelValue: {
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
    maskClosable: {
      type: Boolean,
      default: true
    },
    previewList: {
      type: Array,
      default() {
        return [];
      }
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    infinite: {
      type: Boolean,
      default: true
    },
    toolbar: {
      type: Array,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || !global.$VIEWUI.image || global.$VIEWUI.image.toolbar === "" ? ["zoomIn", "zoomOut", "original", "rotateLeft", "rotateRight", "download"] : global.$VIEWUI.image.toolbar;
      }
    }
  },
  data() {
    return {
      currentIndex: 0,
      scale: 1,
      degree: 0,
      translate: { x: 0, y: 0 },
      startX: 0,
      startY: 0,
      transition: true,
      original: false,
      prevOverflow: "",
      status: "loading",
      zIndex: 1e3,
      maskIndex: this.getMaskIndex(),
      downloading: false
    };
  },
  computed: {
    imgClasses() {
      return [
        "ivu-image-preview-image",
        {
          ["ivu-image-preview-grabbing"]: !this.transition,
          ["ivu-image-preview-hidden"]: this.status === "failed",
          ["ivu-image-preview-transition"]: this.transition,
          ["ivu-image-preview-limit"]: !this.original
        }
      ];
    },
    imageStyle() {
      let translateX = this.translate.x / this.scale;
      let translateY = this.translate.y / this.scale;
      const mod = this.degree % 360;
      if ([90, -270].includes(mod)) {
        [translateX, translateY] = [translateY, -translateX];
      }
      if ([180, -180].includes(mod)) {
        [translateX, translateY] = [-translateX, -translateY];
      }
      if ([270, -90].includes(mod)) {
        [translateX, translateY] = [-translateY, translateX];
      }
      return {
        transform: `
                        scale(${this.scale})
                        rotate(${this.degree}deg)
                        translate(${translateX}px, ${translateY}px)
                    `
      };
    },
    maskStyle() {
      return {
        zIndex: this.maskIndex + this.zIndex
      };
    },
    leftClasses() {
      return [
        "ivu-image-preview-arrow-left",
        {
          ["ivu-image-preview-arrow-disabled"]: this.hasLeftSwitchEnd
        }
      ];
    },
    rightClasses() {
      return [
        "ivu-image-preview-arrow-right",
        {
          ["ivu-image-preview-arrow-disabled"]: this.hasRightSwitchEnd
        }
      ];
    },
    hasRightSwitchEnd() {
      const { currentIndex, infinite, previewList } = this;
      const len = previewList.length;
      return infinite ? false : currentIndex >= len - 1;
    },
    hasLeftSwitchEnd() {
      const { currentIndex, infinite } = this;
      return infinite ? false : currentIndex === 0;
    },
    currentSrc() {
      return this.previewList[this.currentIndex];
    },
    failLang() {
      return this.t("i.image.fail");
    }
  },
  methods: {
    resetStyle() {
      this.scale = 1;
      this.degree = 0;
      this.translate.x = 0;
      this.translate.y = 0;
    },
    handleClose() {
      this.$emit("update:modelValue", false);
      this.$emit("on-close");
    },
    handleClickMask() {
      if (!this.maskClosable)
        return;
      this.handleClose();
    },
    handleSwitch(next) {
      if (next) {
        if (this.currentIndex + 1 === this.previewList.length) {
          if (this.infinite) {
            this.resetStyle();
            this.currentIndex = 0;
          }
        } else {
          this.resetStyle();
          this.currentIndex += 1;
        }
      } else {
        if (this.currentIndex === 0) {
          if (this.infinite) {
            this.resetStyle();
            this.currentIndex = this.previewList.length - 1;
          }
        } else {
          this.resetStyle();
          this.currentIndex -= 1;
        }
      }
      this.$emit("on-switch", { currentIndex: this.currentIndex });
    },
    handleOperation(val) {
      if (val === "zoomIn" && this.scale < 6)
        this.scale += 0.25;
      if (val === "zoomOut" && this.scale > 0.25)
        this.scale -= 0.25;
      if (val === "rotateLeft")
        this.degree -= 90;
      if (val === "rotateRight")
        this.degree += 90;
      if (val === "original") {
        this.original = !this.original;
        this.transition = false;
        this.resetStyle();
        setTimeout(() => {
          this.transition = true;
        }, 0);
      }
      if (val === "download") {
        this.downloading = true;
        downloadFile(this.previewList[this.currentIndex]).then(() => {
          this.downloading = false;
        }).catch(() => {
          this.downloading = false;
        });
      }
    },
    handleKeydown(event) {
      if (!this.modelValue)
        return;
      const { keyCode } = event;
      if (keyCode === KeyCode.LEFT)
        this.handleSwitch(false);
      if (keyCode === KeyCode.RIGHT)
        this.handleSwitch(true);
      if (keyCode === KeyCode.UP)
        this.handleOperation("zoomIn");
      if (keyCode === KeyCode.DOWN)
        this.handleOperation("zoomOut");
      if (keyCode === KeyCode.SPACE) {
        event.preventDefault();
        this.original = !this.original;
      }
    },
    handleKeyup(event) {
      if (!this.modelValue)
        return;
      const { keyCode } = event;
      if (keyCode === KeyCode.ESC)
        this.handleClose();
    },
    handleWheel(event) {
      if (!this.modelValue)
        return;
      const { deltaY } = event;
      this.handleOperation(deltaY < 0 ? "zoomIn" : "zoomOut");
    },
    handleMousedown(event) {
      const { pageX, pageY, which } = event;
      if (which !== 1)
        return;
      this.startX = pageX;
      this.startY = pageY;
      this.transition = false;
      on(document, "mousemove", this.handleMousemove);
      on(document, "mouseup", this.handleMouseup);
    },
    handleMousemove: throttle(function(event) {
      event.stopPropagation();
      const { pageX, pageY } = event;
      this.translate.x += pageX - this.startX;
      this.translate.y += pageY - this.startY;
      this.startX = pageX;
      this.startY = pageY;
    }),
    handleMouseup() {
      this.transition = true;
      off(document, "mousemove", this.handleMousemove);
      off(document, "mouseup", this.handleMouseup);
    },
    getBodyOverflow() {
      return isClient ? document.body.style.overflow : "";
    },
    setBodyOverflow(val) {
      if (!isClient)
        return;
      document.body.style.overflow = val;
    },
    handleImageLoad() {
      this.status = "loaded";
    },
    handleImageError() {
      this.status = "failed";
    },
    getMaskIndex() {
      transferIncrease();
      return transferIndex;
    }
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.currentIndex = this.initialIndex;
        this.resetStyle();
        this.original = false;
        this.prevOverflow = this.getBodyOverflow();
        this.setBodyOverflow("hidden");
        this.maskIndex = this.getMaskIndex();
      } else {
        this.setBodyOverflow(this.prevOverflow);
      }
    },
    currentIndex() {
      this.status = "loading";
    }
  },
  mounted() {
    on(document, "keydown", this.handleKeydown);
    on(document, "keyup", this.handleKeyup);
    on(document, "wheel", this.handleWheel);
  },
  beforeUnmount() {
    off(document, "keydown", this.handleKeydown);
    off(document, "keyup", this.handleKeyup);
    off(document, "wheel", this.handleWheel);
  }
};
const _hoisted_1 = {
  key: 1,
  class: "ivu-image-preview-fail"
};
const _hoisted_2 = ["src"];
const _hoisted_3 = /* @__PURE__ */ createElementVNode("path", {
  d: "M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z",
  "p-id": "7198",
  fill: "#ffffff"
}, null, -1);
const _hoisted_4 = /* @__PURE__ */ createElementVNode("path", {
  d: "M921 867L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z",
  "p-id": "7199",
  fill: "#ffffff"
}, null, -1);
const _hoisted_5 = [
  _hoisted_3,
  _hoisted_4
];
const _hoisted_6 = /* @__PURE__ */ createElementVNode("path", {
  d: "M637 443H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h312c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z",
  "p-id": "7413",
  fill: "#ffffff"
}, null, -1);
const _hoisted_7 = /* @__PURE__ */ createElementVNode("path", {
  d: "M921 867L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z",
  "p-id": "7414",
  fill: "#ffffff"
}, null, -1);
const _hoisted_8 = [
  _hoisted_6,
  _hoisted_7
];
const _hoisted_9 = /* @__PURE__ */ createElementVNode("path", {
  d: "M358.058667 128H156.970667A28.970667 28.970667 0 0 0 128 157.013333v202.837334c0 7.978667 6.528 14.506667 14.506667 14.506666h43.434666a14.506667 14.506667 0 0 0 14.506667-14.506666V200.448h157.610667a14.506667 14.506667 0 0 0 14.506666-14.506667V142.506667a14.506667 14.506667 0 0 0-14.506666-14.506667zM881.493333 649.642667h-43.434666a14.506667 14.506667 0 0 0-14.506667 14.506666v159.402667h-157.610667a14.506667 14.506667 0 0 0-14.506666 14.506667v43.434666c0 7.978667 6.570667 14.506667 14.506666 14.506667h201.088c16 0 28.970667-12.928 28.970667-29.013333v-202.837334a14.506667 14.506667 0 0 0-14.506667-14.506666zM358.058667 823.552H200.448v-159.402667a14.506667 14.506667 0 0 0-14.506667-14.506666H142.506667a14.506667 14.506667 0 0 0-14.506667 14.506666v202.88c0 16 12.970667 28.970667 29.013333 28.970667h201.045334a14.506667 14.506667 0 0 0 14.506666-14.506667v-43.434666a14.506667 14.506667 0 0 0-14.506666-14.506667zM866.986667 128h-201.088a14.506667 14.506667 0 0 0-14.506667 14.506667v43.434666c0 7.978667 6.570667 14.506667 14.506667 14.506667h157.610666v159.402667c0 7.978667 6.528 14.506667 14.506667 14.506666h43.434667a14.506667 14.506667 0 0 0 14.506666-14.506666V156.970667A28.928 28.928 0 0 0 866.986667 128z",
  "p-id": "26673",
  fill: "#ffffff"
}, null, -1);
const _hoisted_10 = [
  _hoisted_9
];
const _hoisted_11 = /* @__PURE__ */ createElementVNode("path", {
  d: "M864 128H160c-19.2 0-32 12.8-32 32v704c0 19.2 12.8 32 32 32h704c19.2 0 32-12.8 32-32V160c0-19.2-12.8-32-32-32z m-32 704H192V192h640v640z",
  "p-id": "1977",
  fill: "#ffffff"
}, null, -1);
const _hoisted_12 = /* @__PURE__ */ createElementVNode("path", {
  d: "M320 384v288c0 19.2 12.8 32 32 32s32-12.8 32-32V352c0-19.2-12.8-32-32-32h-32c-19.2 0-32 12.8-32 32s12.8 32 32 32zM640 384v288c0 19.2 12.8 32 32 32s32-12.8 32-32V352c0-19.2-12.8-32-32-32h-32c-19.2 0-32 12.8-32 32s12.8 32 32 32z",
  "p-id": "1978",
  fill: "#ffffff"
}, null, -1);
const _hoisted_13 = /* @__PURE__ */ createElementVNode("path", {
  d: "M512 384m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z",
  "p-id": "1979",
  fill: "#ffffff"
}, null, -1);
const _hoisted_14 = /* @__PURE__ */ createElementVNode("path", {
  d: "M512 640m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z",
  "p-id": "1980",
  fill: "#ffffff"
}, null, -1);
const _hoisted_15 = [
  _hoisted_11,
  _hoisted_12,
  _hoisted_13,
  _hoisted_14
];
const _hoisted_16 = /* @__PURE__ */ createElementVNode("path", {
  d: "M672 418H144c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32z m-44 402H188V494h440v326z m191.3-491.5c-78.8-100.7-196-153.6-314.6-154.2l-0.2-64c0-6.5-7.6-10.1-12.6-6.1l-128 101c-4 3.1-3.9 9.1 0 12.3L492 318.6c5.1 4 12.7 0.4 12.6-6.1v-63.9c12.9 0.1 25.9 0.9 38.8 2.5 42.1 5.2 82.1 18.2 119 38.7 38.1 21.2 71.2 49.7 98.4 84.3 27.1 34.7 46.7 73.7 58.1 115.8 11 40.7 14 82.7 8.9 124.8-0.7 5.4-1.4 10.8-2.4 16.1h74.9c14.8-103.6-11.3-213-81-302.3z",
  "p-id": "13309",
  fill: "#ffffff"
}, null, -1);
const _hoisted_17 = [
  _hoisted_16
];
const _hoisted_18 = /* @__PURE__ */ createElementVNode("path", {
  d: "M480.5 251.2c13-1.6 25.9-2.4 38.8-2.5v63.9c0 6.5 7.5 10.1 12.6 6.1L660 217.6c4-3.2 4-9.2 0-12.3l-128-101c-5.1-4-12.6-0.4-12.6 6.1l-0.2 64c-118.6 0.5-235.8 53.4-314.6 154.2-69.6 89.2-95.7 198.6-81.1 302.4h74.9c-0.9-5.3-1.7-10.7-2.4-16.1-5.1-42.1-2.1-84.1 8.9-124.8 11.4-42.2 31-81.1 58.1-115.8 27.2-34.7 60.3-63.2 98.4-84.3 37-20.6 76.9-33.6 119.1-38.8zM880 418H352c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32z m-44 402H396V494h440v326z",
  "p-id": "13522",
  fill: "#ffffff"
}, null, -1);
const _hoisted_19 = [
  _hoisted_18
];
const _hoisted_20 = /* @__PURE__ */ createElementVNode("path", {
  d: "M505.7 621c3.2 4.1 9.4 4.1 12.6 0l112-141.7c4.1-5.2 0.4-12.9-6.3-12.9h-72.1V120c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v346.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8z",
  "p-id": "8826",
  fill: "#ffffff"
}, null, -1);
const _hoisted_21 = /* @__PURE__ */ createElementVNode("path", {
  d: "M903 516h-64c-4.4 0-8 3.6-8 8v300c0 4.4-3.6 8-8 8H199c-4.4 0-8-3.6-8-8V524c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v372c0 8.8 7.2 16 16 16h768c8.8 0 16-7.2 16-16V524c0-4.4-3.6-8-8-8z",
  "p-id": "8827",
  fill: "#ffffff"
}, null, -1);
const _hoisted_22 = [
  _hoisted_20,
  _hoisted_21
];
const _hoisted_23 = {
  class: "ivu-image-preview-operations-item ivu-image-preview-operations-wait ivu-anim-loop",
  viewBox: "0 0 1024 1024",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  "p-id": "7816",
  width: "200",
  height: "200"
};
const _hoisted_24 = /* @__PURE__ */ createElementVNode("path", {
  d: "M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z",
  "p-id": "7817",
  fill: "#ffffff"
}, null, -1);
const _hoisted_25 = [
  _hoisted_24
];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Spin = resolveComponent("Spin");
  const _component_Col = resolveComponent("Col");
  const _component_Row = resolveComponent("Row");
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createBlock(Teleport, {
    to: "body",
    disabled: !$props.transfer
  }, [
    createVNode(Transition, { name: "fade" }, {
      default: withCtx(() => [
        $props.modelValue ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "ivu-image-preview-mask",
          style: normalizeStyle($options.maskStyle)
        }, null, 4)) : createCommentVNode("", true)
      ]),
      _: 1
    }),
    createVNode(Transition, { name: "fade" }, {
      default: withCtx(() => [
        $props.modelValue ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "ivu-image-preview-wrap",
          style: normalizeStyle($options.maskStyle)
        }, [
          createElementVNode("div", mergeProps({ class: "ivu-image-preview" }, _ctx.$attrs, {
            onClick: _cache[14] || (_cache[14] = withModifiers((...args) => $options.handleClickMask && $options.handleClickMask(...args), ["stop"]))
          }), [
            $data.status === "loading" ? (openBlock(), createBlock(_component_Spin, {
              key: 0,
              size: "large",
              class: "ivu-image-preview-loading"
            })) : $data.status === "failed" ? (openBlock(), createElementBlock("div", _hoisted_1, [
              createElementVNode("span", null, toDisplayString($options.failLang), 1)
            ])) : createCommentVNode("", true),
            (openBlock(), createElementBlock("img", {
              class: normalizeClass($options.imgClasses),
              style: normalizeStyle($options.imageStyle),
              src: $options.currentSrc,
              key: $data.currentIndex.toString(),
              onClick: _cache[0] || (_cache[0] = withModifiers(() => {
              }, ["stop"])),
              onMousedown: _cache[1] || (_cache[1] = withModifiers((...args) => $options.handleMousedown && $options.handleMousedown(...args), ["stop", "prevent"])),
              onLoad: _cache[2] || (_cache[2] = (...args) => $options.handleImageLoad && $options.handleImageLoad(...args)),
              onError: _cache[3] || (_cache[3] = (...args) => $options.handleImageError && $options.handleImageError(...args))
            }, null, 46, _hoisted_2)),
            $props.toolbar && $props.toolbar.length > 0 ? (openBlock(), createBlock(_component_Row, {
              key: 2,
              "class-name": "ivu-image-preview-operations",
              wrap: false,
              onClick: _cache[11] || (_cache[11] = withModifiers(() => {
              }, ["stop"]))
            }, {
              default: withCtx(() => [
                $props.toolbar.indexOf("zoomIn") > -1 ? (openBlock(), createBlock(_component_Col, {
                  key: 0,
                  flex: "1",
                  order: $props.toolbar.indexOf("zoomIn") + 1
                }, {
                  default: withCtx(() => [
                    (openBlock(), createElementBlock("svg", {
                      class: "ivu-image-preview-operations-item",
                      onClick: _cache[4] || (_cache[4] = withModifiers(($event) => $options.handleOperation("zoomIn"), ["stop"])),
                      viewBox: "0 0 1024 1024",
                      version: "1.1",
                      xmlns: "http://www.w3.org/2000/svg",
                      "p-id": "7197",
                      width: "200",
                      height: "200"
                    }, _hoisted_5))
                  ]),
                  _: 1
                }, 8, ["order"])) : createCommentVNode("", true),
                $props.toolbar.indexOf("zoomOut") > -1 ? (openBlock(), createBlock(_component_Col, {
                  key: 1,
                  flex: "1",
                  order: $props.toolbar.indexOf("zoomOut") + 1
                }, {
                  default: withCtx(() => [
                    (openBlock(), createElementBlock("svg", {
                      class: "ivu-image-preview-operations-item",
                      onClick: _cache[5] || (_cache[5] = withModifiers(($event) => $options.handleOperation("zoomOut"), ["stop"])),
                      viewBox: "0 0 1024 1024",
                      version: "1.1",
                      xmlns: "http://www.w3.org/2000/svg",
                      "p-id": "7412",
                      width: "200",
                      height: "200"
                    }, _hoisted_8))
                  ]),
                  _: 1
                }, 8, ["order"])) : createCommentVNode("", true),
                $props.toolbar.indexOf("original") > -1 ? (openBlock(), createBlock(_component_Col, {
                  key: 2,
                  flex: "1",
                  order: $props.toolbar.indexOf("original") + 1
                }, {
                  default: withCtx(() => [
                    withDirectives((openBlock(), createElementBlock("svg", {
                      class: "ivu-image-preview-operations-item",
                      onClick: _cache[6] || (_cache[6] = withModifiers(($event) => $options.handleOperation("original"), ["stop"])),
                      viewBox: "0 0 1024 1024",
                      version: "1.1",
                      xmlns: "http://www.w3.org/2000/svg",
                      "p-id": "26672",
                      width: "200",
                      height: "200"
                    }, _hoisted_10, 512)), [
                      [vShow, !this.original]
                    ]),
                    withDirectives((openBlock(), createElementBlock("svg", {
                      class: "ivu-image-preview-operations-item",
                      onClick: _cache[7] || (_cache[7] = withModifiers(($event) => $options.handleOperation("original"), ["stop"])),
                      viewBox: "0 0 1024 1024",
                      version: "1.1",
                      xmlns: "http://www.w3.org/2000/svg",
                      "p-id": "1976",
                      width: "200",
                      height: "200"
                    }, _hoisted_15, 512)), [
                      [vShow, this.original]
                    ])
                  ]),
                  _: 1
                }, 8, ["order"])) : createCommentVNode("", true),
                $props.toolbar.indexOf("rotateLeft") > -1 ? (openBlock(), createBlock(_component_Col, {
                  key: 3,
                  flex: "1",
                  order: $props.toolbar.indexOf("rotateLeft") + 1
                }, {
                  default: withCtx(() => [
                    (openBlock(), createElementBlock("svg", {
                      class: "ivu-image-preview-operations-item",
                      onClick: _cache[8] || (_cache[8] = withModifiers(($event) => $options.handleOperation("rotateLeft"), ["stop"])),
                      viewBox: "0 0 1024 1024",
                      version: "1.1",
                      xmlns: "http://www.w3.org/2000/svg",
                      "p-id": "13308",
                      width: "200",
                      height: "200"
                    }, _hoisted_17))
                  ]),
                  _: 1
                }, 8, ["order"])) : createCommentVNode("", true),
                $props.toolbar.indexOf("rotateRight") > -1 ? (openBlock(), createBlock(_component_Col, {
                  key: 4,
                  flex: "1",
                  order: $props.toolbar.indexOf("rotateRight") + 1
                }, {
                  default: withCtx(() => [
                    (openBlock(), createElementBlock("svg", {
                      class: "ivu-image-preview-operations-item",
                      onClick: _cache[9] || (_cache[9] = withModifiers(($event) => $options.handleOperation("rotateRight"), ["stop"])),
                      viewBox: "0 0 1024 1024",
                      version: "1.1",
                      xmlns: "http://www.w3.org/2000/svg",
                      "p-id": "13521",
                      width: "200",
                      height: "200"
                    }, _hoisted_19))
                  ]),
                  _: 1
                }, 8, ["order"])) : createCommentVNode("", true),
                $props.toolbar.indexOf("download") > -1 ? (openBlock(), createBlock(_component_Col, {
                  key: 5,
                  flex: "1",
                  order: $props.toolbar.indexOf("download") + 1
                }, {
                  default: withCtx(() => [
                    withDirectives((openBlock(), createElementBlock("svg", {
                      class: "ivu-image-preview-operations-item",
                      onClick: _cache[10] || (_cache[10] = withModifiers(($event) => $options.handleOperation("download"), ["stop"])),
                      viewBox: "0 0 1024 1024",
                      version: "1.1",
                      xmlns: "http://www.w3.org/2000/svg",
                      "p-id": "8825",
                      width: "200",
                      height: "200"
                    }, _hoisted_22, 512)), [
                      [vShow, !$data.downloading]
                    ]),
                    withDirectives((openBlock(), createElementBlock("svg", _hoisted_23, _hoisted_25, 512)), [
                      [vShow, $data.downloading]
                    ])
                  ]),
                  _: 1
                }, 8, ["order"])) : createCommentVNode("", true)
              ]),
              _: 1
            })) : createCommentVNode("", true),
            $props.previewList.length > 1 ? (openBlock(), createBlock(_component_Icon, {
              key: 3,
              class: normalizeClass($options.leftClasses),
              type: "ios-arrow-back",
              onClick: _cache[12] || (_cache[12] = withModifiers(($event) => $options.handleSwitch(false), ["stop"]))
            }, null, 8, ["class"])) : createCommentVNode("", true),
            $props.previewList.length > 1 ? (openBlock(), createBlock(_component_Icon, {
              key: 4,
              class: normalizeClass($options.rightClasses),
              type: "ios-arrow-forward",
              onClick: _cache[13] || (_cache[13] = withModifiers(($event) => $options.handleSwitch(true), ["stop"]))
            }, null, 8, ["class"])) : createCommentVNode("", true),
            createVNode(_component_Icon, {
              class: "ivu-image-preview-arrow-close",
              type: "md-close",
              onClick: withModifiers($options.handleClose, ["stop"])
            }, null, 8, ["onClick"])
          ], 16)
        ], 4)) : createCommentVNode("", true)
      ]),
      _: 1
    })
  ], 8, ["disabled"]);
}
var ImagePreview = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ImagePreview as default };
