import { nextTick, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, createVNode, normalizeStyle, renderSlot, createCommentVNode, Fragment, renderList } from "vue";
import Icon from "../icon/icon.js";
import { oneOf, getStyle } from "../../utils/assist.js";
import { on, off } from "../../utils/dom.js";
import { isClient } from "../../utils/index.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-carousel";
const _sfc_main = {
  name: "Carousel",
  provide() {
    return {
      CarouselInstance: this
    };
  },
  components: { Icon },
  emits: ["on-change", "on-click", "update:modelValue"],
  props: {
    arrow: {
      type: String,
      default: "hover",
      validator(value) {
        return oneOf(value, ["hover", "always", "never"]);
      }
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    autoplaySpeed: {
      type: Number,
      default: 2e3
    },
    loop: {
      type: Boolean,
      default: false
    },
    easing: {
      type: String,
      default: "ease"
    },
    dots: {
      type: String,
      default: "inside",
      validator(value) {
        return oneOf(value, ["inside", "outside", "none"]);
      }
    },
    radiusDot: {
      type: Boolean,
      default: false
    },
    trigger: {
      type: String,
      default: "click",
      validator(value) {
        return oneOf(value, ["click", "hover"]);
      }
    },
    modelValue: {
      type: Number,
      default: 0
    },
    height: {
      type: [String, Number],
      default: "auto",
      validator(value) {
        return value === "auto" || Object.prototype.toString.call(value) === "[object Number]";
      }
    }
  },
  data() {
    return {
      prefixCls,
      listWidth: 0,
      trackWidth: 0,
      trackOffset: 0,
      trackCopyOffset: 0,
      showCopyTrack: false,
      slides: [],
      slideInstances: [],
      timer: null,
      ready: false,
      currentIndex: this.modelValue,
      trackIndex: this.modelValue,
      copyTrackIndex: this.modelValue,
      hideTrackPos: -1,
      carouselItemList: []
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`
      ];
    },
    trackStyles() {
      const visibleStyle = this.trackIndex === -1 ? "hidden" : "visible";
      return {
        width: `${this.trackWidth}px`,
        transform: `translate3d(${-this.trackOffset}px, 0px, 0px)`,
        transition: `transform 500ms ${this.easing}`,
        visibility: visibleStyle
      };
    },
    copyTrackStyles() {
      return {
        width: `${this.trackWidth}px`,
        transform: `translate3d(${-this.trackCopyOffset}px, 0px, 0px)`,
        transition: `transform 500ms ${this.easing}`,
        position: "absolute"
      };
    },
    arrowClasses() {
      return [
        `${prefixCls}-arrow`,
        `${prefixCls}-arrow-${this.arrow}`
      ];
    },
    dotsClasses() {
      return [
        `${prefixCls}-dots`,
        `${prefixCls}-dots-${this.dots}`
      ];
    }
  },
  methods: {
    findChild(cb) {
      if (this.carouselItemList.length) {
        this.carouselItemList.forEach((item) => {
          cb(item.carouselItem);
        });
      }
    },
    initCopyTrackDom() {
      nextTick(() => {
        this.$refs.copyTrack.innerHTML = this.$refs.originTrack.innerHTML;
      });
    },
    updateSlides(init) {
      let slides = [];
      let index = 1;
      this.findChild((child) => {
        slides.push({
          $el: child.$el
        });
        child.index = index++;
        if (init) {
          this.slideInstances.push(child);
        }
      });
      this.slides = slides;
      this.updatePos();
    },
    updatePos() {
      this.findChild((child) => {
        child.width = this.listWidth;
        child.height = typeof this.height === "number" ? `${this.height}px` : this.height;
      });
      this.trackWidth = (this.slides.length || 0) * this.listWidth;
    },
    slotChange() {
      nextTick(() => {
        this.slides = [];
        this.slideInstances = [];
        this.updateSlides(true, true);
        this.updatePos();
        this.updateOffset();
      });
    },
    handleResize() {
      this.listWidth = parseInt(getStyle(this.$el, "width"));
      this.updatePos();
      this.updateOffset();
    },
    updateTrackPos(index) {
      if (this.showCopyTrack) {
        this.trackIndex = index;
      } else {
        this.copyTrackIndex = index;
      }
    },
    updateTrackIndex(index) {
      if (this.showCopyTrack) {
        this.copyTrackIndex = index;
      } else {
        this.trackIndex = index;
      }
      this.currentIndex = index;
    },
    add(offset) {
      let slidesLen = this.slides.length;
      if (this.loop) {
        if (offset > 0) {
          this.hideTrackPos = -1;
        } else {
          this.hideTrackPos = slidesLen;
        }
        this.updateTrackPos(this.hideTrackPos);
      }
      const oldIndex = this.showCopyTrack ? this.copyTrackIndex : this.trackIndex;
      let index = oldIndex + offset;
      while (index < 0)
        index += slidesLen;
      if ((offset > 0 && index === slidesLen || offset < 0 && index === slidesLen - 1) && this.loop) {
        this.showCopyTrack = !this.showCopyTrack;
        this.trackIndex += offset;
        this.copyTrackIndex += offset;
      } else {
        if (!this.loop)
          index = index % this.slides.length;
        this.updateTrackIndex(index);
      }
      this.currentIndex = index === this.slides.length ? 0 : index;
      this.$emit("on-change", oldIndex, this.currentIndex);
      this.$emit("update:modelValue", this.currentIndex);
    },
    arrowEvent(offset) {
      this.setAutoplay();
      this.add(offset);
    },
    dotsEvent(event, n) {
      let curIndex = this.showCopyTrack ? this.copyTrackIndex : this.trackIndex;
      const oldCurrentIndex = this.currentIndex;
      if (event === this.trigger && curIndex !== n) {
        this.updateTrackIndex(n);
        this.$emit("on-change", oldCurrentIndex, this.currentIndex);
        this.$emit("update:modelValue", n);
        this.setAutoplay();
      }
    },
    setAutoplay() {
      if (!isClient)
        return;
      window.clearInterval(this.timer);
      if (this.autoplay) {
        this.timer = window.setInterval(() => {
          this.add(1);
        }, this.autoplaySpeed);
      }
    },
    updateOffset() {
      nextTick(() => {
        let ofs = this.copyTrackIndex > 0 ? -1 : 1;
        this.trackOffset = this.trackIndex * this.listWidth;
        this.trackCopyOffset = this.copyTrackIndex * this.listWidth + ofs;
      });
    },
    handleClick(type) {
      this.$emit("on-click", this[type]);
    }
  },
  watch: {
    autoplay() {
      this.setAutoplay();
    },
    autoplaySpeed() {
      this.setAutoplay();
    },
    trackIndex() {
      this.updateOffset();
    },
    copyTrackIndex() {
      this.updateOffset();
    },
    height() {
      this.updatePos();
    },
    modelValue(val) {
      this.updateTrackIndex(val);
      this.setAutoplay();
    }
  },
  mounted() {
    this.updateSlides(true);
    this.handleResize();
    this.setAutoplay();
    on(window, "resize", this.handleResize);
  },
  beforeUnmount() {
    off(window, "resize", this.handleResize);
  }
};
const _hoisted_1 = ["onClick", "onMouseover"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes)
  }, [
    createElementVNode("button", {
      type: "button",
      class: normalizeClass([$options.arrowClasses, "left"]),
      onClick: _cache[0] || (_cache[0] = ($event) => $options.arrowEvent(-1))
    }, [
      createVNode(_component_Icon, { type: "ios-arrow-back" })
    ], 2),
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-list"])
    }, [
      createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-track", $data.showCopyTrack ? "" : "higher"]),
        style: normalizeStyle($options.trackStyles),
        ref: "originTrack",
        onClick: _cache[1] || (_cache[1] = ($event) => $options.handleClick("currentIndex"))
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 6),
      $props.loop ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass([$data.prefixCls + "-track", $data.showCopyTrack ? "higher" : ""]),
        style: normalizeStyle($options.copyTrackStyles),
        ref: "copyTrack",
        onClick: _cache[2] || (_cache[2] = ($event) => $options.handleClick("copyTrackIndex"))
      }, null, 6)) : createCommentVNode("", true)
    ], 2),
    createElementVNode("button", {
      type: "button",
      class: normalizeClass([$options.arrowClasses, "right"]),
      onClick: _cache[3] || (_cache[3] = ($event) => $options.arrowEvent(1))
    }, [
      createVNode(_component_Icon, { type: "ios-arrow-forward" })
    ], 2),
    createElementVNode("ul", {
      class: normalizeClass($options.dotsClasses)
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($data.slides.length, (n) => {
        return openBlock(), createElementBlock("li", {
          key: n,
          class: normalizeClass([n - 1 === $data.currentIndex ? $data.prefixCls + "-active" : ""]),
          onClick: ($event) => $options.dotsEvent("click", n - 1),
          onMouseover: ($event) => $options.dotsEvent("hover", n - 1)
        }, [
          createElementVNode("button", {
            type: "button",
            class: normalizeClass([$props.radiusDot ? "radius" : ""])
          }, null, 2)
        ], 42, _hoisted_1);
      }), 128))
    ], 2)
  ], 2);
}
var Carousel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Carousel as default };
