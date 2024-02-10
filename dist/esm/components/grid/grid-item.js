import { nextTick, openBlock, createElementBlock, normalizeStyle, createElementVNode, renderSlot } from "vue";
import { getStyle } from "../../utils/assist.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "GridItem",
  inject: ["GridInstance"],
  data() {
    return {
      height: 0
    };
  },
  computed: {
    col() {
      return this.GridInstance.col;
    },
    square() {
      return this.GridInstance.square;
    },
    styles() {
      const style = {
        width: `${100 / this.col}%`
      };
      if (this.height && this.square) {
        style.height = `${this.height}px`;
      }
      return style;
    },
    mainStyles() {
      return {
        padding: this.GridInstance.padding
      };
    }
  },
  watch: {
    col() {
      nextTick(() => {
        this.handleChangeHeight();
      });
    },
    square() {
      this.handleChangeHeight();
    },
    "GridInstance.resizeCount"() {
      this.handleChangeHeight();
    }
  },
  methods: {
    handleChangeHeight() {
      if (this.square) {
        const $col = this.$refs.col;
        this.height = parseFloat(getStyle($col, "width"));
      }
    }
  },
  mounted() {
    this.handleChangeHeight();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "ivu-grid-item",
    style: normalizeStyle($options.styles),
    ref: "col"
  }, [
    createElementVNode("div", {
      class: "ivu-grid-item-main",
      style: normalizeStyle($options.mainStyles)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 4)
  ], 4);
}
var GridItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { GridItem as default };
