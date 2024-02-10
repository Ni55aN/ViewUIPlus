import elementResizeDetectorMaker from "element-resize-detector";
import throttle from "lodash.throttle";
import { openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Grid",
  provide() {
    return {
      GridInstance: this
    };
  },
  props: {
    col: {
      type: Number,
      default: 3
    },
    square: {
      type: Boolean,
      default: false
    },
    padding: {
      type: String,
      default: "24px"
    },
    center: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    hover: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resizeCount: 0,
      handleResize: () => {
      }
    };
  },
  computed: {
    classes() {
      return {
        "ivu-grid-center": this.center,
        "ivu-grid-border": this.border,
        "ivu-grid-hover": this.hover
      };
    }
  },
  methods: {
    onResize() {
      this.resizeCount++;
    }
  },
  mounted() {
    this.handleResize = throttle(this.onResize, 150, { leading: false });
    this.observer = elementResizeDetectorMaker();
    this.observer.listenTo(this.$refs.grid, this.handleResize);
  },
  beforeUnmount() {
    this.observer.removeListener(this.$refs.grid, this.handleResize);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["ivu-grid", $options.classes]),
    ref: "grid"
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var Grid = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Grid as default };
