import handleEscapeMixin from "./handleEscapeMixin.js";
import Prefixes from "./prefixMixin.js";
import { clamp } from "./utils.js";
import { openBlock, createElementBlock, withKeys, Fragment, renderList, createElementVNode, normalizeClass, normalizeStyle, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "RecommendedColors",
  mixins: [handleEscapeMixin, Prefixes],
  emits: ["picker-color", "change"],
  props: {
    list: {
      type: Array,
      default: void 0
    }
  },
  data() {
    const columns = 12;
    const rows = Math.ceil(this.list.length / columns);
    const normalStep = 1;
    return {
      left: -normalStep,
      right: normalStep,
      up: -normalStep,
      down: normalStep,
      powerKey: "shiftKey",
      grid: { x: 1, y: 1 },
      rows,
      columns
    };
  },
  computed: {
    hideClass() {
      return `${this.prefixCls}-hide`;
    },
    linearIndex() {
      return this.getLinearIndex(this.grid);
    },
    currentCircle() {
      return this.$refs[`color-circle-${this.linearIndex}`][0];
    }
  },
  methods: {
    getLinearIndex(grid) {
      return this.columns * (grid.y - 1) + grid.x - 1;
    },
    getMaxLimit(axis) {
      return axis === "x" ? this.columns : this.rows;
    },
    handleArrow(e, axis, direction) {
      e.preventDefault();
      e.stopPropagation();
      this.blurColor();
      const grid = { ...this.grid };
      if (e[this.powerKey]) {
        if (direction < 0) {
          grid[axis] = 1;
        } else {
          grid[axis] = this.getMaxLimit(axis);
        }
      } else {
        grid[axis] += direction;
      }
      const index = this.getLinearIndex(grid);
      if (index >= 0 && index < this.list.length) {
        this.grid[axis] = clamp(grid[axis], 1, this.getMaxLimit(axis));
      }
      this.focusColor();
    },
    blurColor() {
      this.currentCircle.classList.add(this.hideClass);
    },
    focusColor() {
      this.currentCircle.classList.remove(this.hideClass);
    },
    handleEnter(e) {
      this.handleClick(e, this.currentCircle);
    },
    handleClick(e, circle) {
      e.preventDefault();
      e.stopPropagation();
      this.$refs.reference.focus();
      const target = circle || e.target;
      const colorId = target.dataset.colorId || target.parentElement.dataset.colorId;
      if (colorId) {
        this.blurColor();
        const id = Number(colorId) + 1;
        this.grid.x = id % this.columns || this.columns;
        this.grid.y = Math.ceil(id / this.columns);
        this.focusColor();
        this.$emit("picker-color", this.list[colorId]);
        this.$emit("change", { hex: this.list[colorId], source: "hex" });
      }
    },
    lineBreak(list, index) {
      if (!index) {
        return false;
      }
      const nextIndex = index + 1;
      return nextIndex < list.length && nextIndex % this.columns === 0;
    }
  }
};
const _hoisted_1 = ["data-color-id"];
const _hoisted_2 = { key: 0 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    ref: "reference",
    tabindex: "0",
    onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClick && $options.handleClick(...args)),
    onKeydown: [
      _cache[1] || (_cache[1] = withKeys((...args) => _ctx.handleEscape && _ctx.handleEscape(...args), ["esc"])),
      _cache[2] || (_cache[2] = withKeys((...args) => $options.handleEnter && $options.handleEnter(...args), ["enter"])),
      _cache[3] || (_cache[3] = withKeys(($event) => $options.handleArrow($event, "x", $data.left), ["left"])),
      _cache[4] || (_cache[4] = withKeys(($event) => $options.handleArrow($event, "x", $data.right), ["right"])),
      _cache[5] || (_cache[5] = withKeys(($event) => $options.handleArrow($event, "y", $data.up), ["up"])),
      _cache[6] || (_cache[6] = withKeys(($event) => $options.handleArrow($event, "y", $data.down), ["down"]))
    ],
    onBlur: _cache[7] || (_cache[7] = (...args) => $options.blurColor && $options.blurColor(...args)),
    onFocus: _cache[8] || (_cache[8] = (...args) => $options.focusColor && $options.focusColor(...args))
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($props.list, (item, index) => {
      return openBlock(), createElementBlock(Fragment, {
        key: item + ":" + index
      }, [
        createElementVNode("div", {
          class: normalizeClass([_ctx.prefixCls + "-picker-colors-wrapper"])
        }, [
          createElementVNode("div", { "data-color-id": index }, [
            createElementVNode("div", {
              style: normalizeStyle({ background: item }),
              class: normalizeClass([_ctx.prefixCls + "-picker-colors-wrapper-color"])
            }, null, 6),
            createElementVNode("div", {
              ref_for: true,
              ref: "color-circle-" + index,
              class: normalizeClass([_ctx.prefixCls + "-picker-colors-wrapper-circle", $options.hideClass])
            }, null, 2)
          ], 8, _hoisted_1)
        ], 2),
        $options.lineBreak($props.list, index) ? (openBlock(), createElementBlock("br", _hoisted_2)) : createCommentVNode("", true)
      ], 64);
    }), 128))
  ], 544);
}
var RecommendColors = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { RecommendColors as default };
