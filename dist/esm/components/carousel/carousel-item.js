import { nextTick, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from "vue";
import random from "../../utils/random_str.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-carousel-item";
const _sfc_main = {
  componentName: "carousel-item",
  name: "CarouselItem",
  inject: ["CarouselInstance"],
  data() {
    return {
      prefixCls,
      width: 0,
      height: "auto",
      left: 0,
      id: random(6)
    };
  },
  computed: {
    styles() {
      return {
        width: `${this.width}px`,
        height: `${this.height}`,
        left: `${this.left}px`
      };
    }
  },
  watch: {
    width(val) {
      if (val && this.CarouselInstance.loop) {
        nextTick(() => {
          this.CarouselInstance.initCopyTrackDom();
        });
      }
    },
    height(val) {
      if (val && this.CarouselInstance.loop) {
        nextTick(() => {
          this.CarouselInstance.initCopyTrackDom();
        });
      }
    }
  },
  methods: {
    addInstance() {
      const root = this.CarouselInstance;
      if (!root.carouselItemList)
        root.carouselItemList = [];
      root.carouselItemList.push({
        id: this.id,
        carouselItem: this
      });
    },
    removeInstance() {
      const root = this.CarouselInstance;
      if (!root.carouselItemList)
        return;
      const index = root.carouselItemList.findIndex((item) => item.id === this.id);
      root.carouselItemList.splice(index, 1);
    }
  },
  mounted() {
    this.addInstance();
    this.CarouselInstance.slotChange();
  },
  beforeUnmount() {
    this.removeInstance();
    this.CarouselInstance.slotChange();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($data.prefixCls),
    style: normalizeStyle($options.styles)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 6);
}
var CarouselItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CarouselItem as default };
