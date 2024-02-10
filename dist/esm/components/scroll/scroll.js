import throttle from "lodash.throttle";
import loader from "./loading-component.js";
import { off, on } from "../../utils/dom.js";
import Locale from "../../mixins/locale.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, normalizeStyle, createVNode, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-scroll";
const dragConfig = {
  sensitivity: 10,
  minimumStartDragOffset: 5
};
const noop = () => Promise.resolve();
const _sfc_main = {
  name: "Scroll",
  mixins: [Locale],
  components: { loader },
  props: {
    height: {
      type: [Number, String],
      default: 300
    },
    onReachTop: {
      type: Function
    },
    onReachBottom: {
      type: Function
    },
    onReachEdge: {
      type: Function
    },
    loadingText: {
      type: String
    },
    distanceToEdge: [Number, Array],
    stopSlide: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const distanceToEdge = this.calculateProximityThreshold();
    return {
      showTopLoader: false,
      showBottomLoader: false,
      showBodyLoader: false,
      lastScroll: 0,
      reachedTopScrollLimit: true,
      reachedBottomScrollLimit: false,
      topRubberPadding: 0,
      bottomRubberPadding: 0,
      rubberRollBackTimeout: false,
      isLoading: false,
      pointerTouchDown: null,
      touchScroll: false,
      handleScroll: () => {
      },
      pointerUpHandler: () => {
      },
      pointerMoveHandler: () => {
      },
      topProximityThreshold: distanceToEdge[0],
      bottomProximityThreshold: distanceToEdge[1]
    };
  },
  computed: {
    wrapClasses() {
      return `${prefixCls}-wrapper`;
    },
    scrollContainerClasses() {
      return [
        `${prefixCls}-container`,
        {
          [`${prefixCls}-container-loading`]: this.showBodyLoader && this.stopSlide
        }
      ];
    },
    slotContainerClasses() {
      return [
        `${prefixCls}-content`,
        {
          [`${prefixCls}-content-loading`]: this.showBodyLoader
        }
      ];
    },
    loaderClasses() {
      return `${prefixCls}-loader`;
    },
    wrapperPadding() {
      return {
        paddingTop: this.topRubberPadding + "px",
        paddingBottom: this.bottomRubberPadding + "px"
      };
    },
    localeLoadingText() {
      if (this.loadingText === void 0) {
        return this.t("i.select.loading");
      } else {
        return this.loadingText;
      }
    }
  },
  methods: {
    waitOneSecond() {
      return new Promise((resolve) => {
        setTimeout(resolve, 1e3);
      });
    },
    calculateProximityThreshold() {
      const dte = this.distanceToEdge;
      if (typeof dte == "undefined")
        return [20, 20];
      return Array.isArray(dte) ? dte : [dte, dte];
    },
    onCallback(dir) {
      this.isLoading = true;
      this.showBodyLoader = true;
      if (dir > 0) {
        this.showTopLoader = true;
        this.topRubberPadding = 20;
      } else {
        this.showBottomLoader = true;
        this.bottomRubberPadding = 20;
        let bottomLoaderHeight = 0;
        const container = this.$refs.scrollContainer;
        const initialScrollTop = container.scrollTop;
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            bottomLoaderHeight = Math.max(
              bottomLoaderHeight,
              this.$refs.bottomLoader.getBoundingClientRect().height
            );
            container.scrollTop = initialScrollTop + bottomLoaderHeight;
          }, i * 50);
        }
      }
      const callbacks = [this.waitOneSecond(), this.onReachEdge ? this.onReachEdge(dir) : noop()];
      callbacks.push(dir > 0 ? this.onReachTop ? this.onReachTop() : noop() : this.onReachBottom ? this.onReachBottom() : noop());
      let tooSlow = setTimeout(() => {
        this.reset();
      }, 5e3);
      Promise.all(callbacks).then(() => {
        clearTimeout(tooSlow);
        this.reset();
      });
    },
    reset() {
      [
        "showTopLoader",
        "showBottomLoader",
        "showBodyLoader",
        "isLoading",
        "reachedTopScrollLimit",
        "reachedBottomScrollLimit"
      ].forEach((prop) => this[prop] = false);
      this.lastScroll = 0;
      this.topRubberPadding = 0;
      this.bottomRubberPadding = 0;
      clearInterval(this.rubberRollBackTimeout);
      if (this.touchScroll) {
        setTimeout(() => {
          off(window, "touchend", this.pointerUpHandler);
          this.$refs.scrollContainer.removeEventListener("touchmove", this.pointerMoveHandler);
          this.touchScroll = false;
        }, 500);
      }
    },
    onWheel(event) {
      if (this.isLoading)
        return;
      const wheelDelta = event.wheelDelta ? event.wheelDelta : -(event.detail || event.deltaY);
      this.stretchEdge(wheelDelta);
    },
    stretchEdge(direction) {
      clearTimeout(this.rubberRollBackTimeout);
      if (!this.onReachEdge) {
        if (direction > 0) {
          if (!this.onReachTop)
            return;
        } else {
          if (!this.onReachBottom)
            return;
        }
      }
      this.rubberRollBackTimeout = setTimeout(() => {
        if (!this.isLoading)
          this.reset();
      }, 250);
      if (direction > 0 && this.reachedTopScrollLimit) {
        this.topRubberPadding += 5 - this.topRubberPadding / 5;
        if (this.topRubberPadding > this.topProximityThreshold)
          this.onCallback(1);
      } else if (direction < 0 && this.reachedBottomScrollLimit) {
        this.bottomRubberPadding += 6 - this.bottomRubberPadding / 4;
        if (this.bottomRubberPadding > this.bottomProximityThreshold)
          this.onCallback(-1);
      } else {
        this.onScroll();
      }
    },
    onScroll() {
      const el = this.$refs.scrollContainer;
      if (this.isLoading || !el)
        return;
      const scrollDirection = Math.sign(this.lastScroll - el.scrollTop);
      const displacement = el.scrollHeight - el.clientHeight - el.scrollTop;
      const topNegativeProximity = this.topProximityThreshold < 0 ? this.topProximityThreshold : 0;
      const bottomNegativeProximity = this.bottomProximityThreshold < 0 ? this.bottomProximityThreshold : 0;
      if (scrollDirection == -1 && displacement + bottomNegativeProximity <= dragConfig.sensitivity) {
        this.reachedBottomScrollLimit = true;
      } else if (scrollDirection >= 0 && el.scrollTop + topNegativeProximity <= 0) {
        this.reachedTopScrollLimit = true;
      } else {
        this.reachedTopScrollLimit = false;
        this.reachedBottomScrollLimit = false;
        this.lastScroll = el.scrollTop;
      }
    },
    getTouchCoordinates(e) {
      return {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      };
    },
    onPointerDown(e) {
      if (this.isLoading)
        return;
      if (e.type == "touchstart") {
        const container = this.$refs.scrollContainer;
        if (this.reachedTopScrollLimit)
          container.scrollTop = 5;
        else if (this.reachedBottomScrollLimit)
          container.scrollTop -= 5;
      }
      if (e.type == "touchstart" && this.$refs.scrollContainer.scrollTop == 0)
        this.$refs.scrollContainer.scrollTop = 5;
      this.pointerTouchDown = this.getTouchCoordinates(e);
      on(window, "touchend", this.pointerUpHandler);
      this.$refs.scrollContainer.parentElement.addEventListener("touchmove", (e2) => {
        e2.stopPropagation();
        this.pointerMoveHandler(e2);
      }, { passive: false, useCapture: true });
    },
    onPointerMove(e) {
      if (!this.pointerTouchDown)
        return;
      if (this.isLoading)
        return;
      const pointerPosition = this.getTouchCoordinates(e);
      const yDiff = pointerPosition.y - this.pointerTouchDown.y;
      this.stretchEdge(yDiff);
      if (!this.touchScroll) {
        const wasDragged = Math.abs(yDiff) > dragConfig.minimumStartDragOffset;
        if (wasDragged)
          this.touchScroll = true;
      }
    },
    onPointerUp() {
      this.pointerTouchDown = null;
    }
  },
  created() {
    this.handleScroll = throttle(this.onScroll, 150, { leading: false });
    this.pointerUpHandler = this.onPointerUp.bind(this);
    this.pointerMoveHandler = throttle(this.onPointerMove, 50, { leading: false });
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_loader = resolveComponent("loader");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.wrapClasses),
    style: { "touch-action": "none" }
  }, [
    createElementVNode("div", {
      class: normalizeClass($options.scrollContainerClasses),
      style: normalizeStyle({ height: $props.height + "px" }),
      onScroll: _cache[0] || (_cache[0] = (...args) => $data.handleScroll && $data.handleScroll(...args)),
      onWheel: _cache[1] || (_cache[1] = (...args) => $options.onWheel && $options.onWheel(...args)),
      onTouchstart: _cache[2] || (_cache[2] = (...args) => $options.onPointerDown && $options.onPointerDown(...args)),
      ref: "scrollContainer"
    }, [
      createElementVNode("div", {
        class: normalizeClass($options.loaderClasses),
        style: normalizeStyle({ paddingTop: $options.wrapperPadding.paddingTop }),
        ref: "toploader"
      }, [
        createVNode(_component_loader, {
          text: $options.localeLoadingText,
          active: $data.showTopLoader
        }, null, 8, ["text", "active"])
      ], 6),
      createElementVNode("div", {
        class: normalizeClass($options.slotContainerClasses),
        ref: "scrollContent"
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2),
      createElementVNode("div", {
        class: normalizeClass($options.loaderClasses),
        style: normalizeStyle({ paddingBottom: $options.wrapperPadding.paddingBottom }),
        ref: "bottomLoader"
      }, [
        createVNode(_component_loader, {
          text: $options.localeLoadingText,
          active: $data.showBottomLoader
        }, null, 8, ["text", "active"])
      ], 6)
    ], 38)
  ], 2);
}
var Scroll = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Scroll as default };
