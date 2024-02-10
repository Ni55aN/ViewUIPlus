import { nextTick, openBlock, createElementBlock, createElementVNode, normalizeClass, normalizeStyle, renderSlot, withDirectives, vShow } from "vue";
import { on, off } from "../../utils/dom.js";
import { isClient } from "../../utils/index.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-affix";
function getScroll(target, top) {
  const prop = top ? "pageYOffset" : "pageXOffset";
  const method = top ? "scrollTop" : "scrollLeft";
  let ret = target[prop];
  if (isClient && typeof ret !== "number") {
    ret = window.document.documentElement[method];
  }
  return ret;
}
function getOffset(element) {
  if (!isClient)
    return;
  const rect = element.getBoundingClientRect();
  const scrollTop = getScroll(window, true);
  const scrollLeft = getScroll(window);
  const docEl = window.document.body;
  const clientTop = docEl.clientTop || 0;
  const clientLeft = docEl.clientLeft || 0;
  return {
    top: rect.top + scrollTop - clientTop,
    left: rect.left + scrollLeft - clientLeft
  };
}
const _sfc_main = {
  name: "Affix",
  emits: ["on-change"],
  props: {
    offsetTop: {
      type: Number,
      default: 0
    },
    offsetBottom: {
      type: Number
    },
    useCapture: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      affix: false,
      styles: {},
      slot: false,
      slotStyle: {}
    };
  },
  computed: {
    offsetType() {
      let type = "top";
      if (this.offsetBottom >= 0) {
        type = "bottom";
      }
      return type;
    },
    classes() {
      return [
        {
          [`${prefixCls}`]: this.affix
        }
      ];
    }
  },
  mounted() {
    on(window, "scroll", this.handleScroll, this.useCapture);
    on(window, "resize", this.handleScroll, this.useCapture);
    nextTick(() => {
      this.handleScroll();
    });
  },
  beforeUnmount() {
    off(window, "scroll", this.handleScroll, this.useCapture);
    off(window, "resize", this.handleScroll, this.useCapture);
  },
  methods: {
    handleScroll() {
      if (!isClient)
        return;
      const affix = this.affix;
      const scrollTop = getScroll(window, true);
      const elOffset = getOffset(this.$el);
      const windowHeight = window.innerHeight;
      const elHeight = this.$el.getElementsByTagName("div")[0].offsetHeight;
      if (elOffset.top - this.offsetTop < scrollTop && this.offsetType == "top" && !affix) {
        this.affix = true;
        this.slotStyle = {
          width: this.$refs.point.clientWidth + "px",
          height: this.$refs.point.clientHeight + "px"
        };
        this.slot = true;
        this.styles = {
          top: `${this.offsetTop}px`,
          left: `${elOffset.left}px`,
          width: `${this.$el.offsetWidth}px`
        };
        this.$emit("on-change", true);
      } else if (elOffset.top - this.offsetTop > scrollTop && this.offsetType == "top" && affix) {
        this.slot = false;
        this.slotStyle = {};
        this.affix = false;
        this.styles = null;
        this.$emit("on-change", false);
      }
      if (elOffset.top + this.offsetBottom + elHeight > scrollTop + windowHeight && this.offsetType == "bottom" && !affix) {
        this.affix = true;
        this.styles = {
          bottom: `${this.offsetBottom}px`,
          left: `${elOffset.left}px`,
          width: `${this.$el.offsetWidth}px`
        };
        this.$emit("on-change", true);
      } else if (elOffset.top + this.offsetBottom + elHeight < scrollTop + windowHeight && this.offsetType == "bottom" && affix) {
        this.affix = false;
        this.styles = null;
        this.$emit("on-change", false);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    createElementVNode("div", {
      ref: "point",
      class: normalizeClass($options.classes),
      style: normalizeStyle($data.styles)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 6),
    withDirectives(createElementVNode("div", {
      style: normalizeStyle($data.slotStyle)
    }, null, 4), [
      [vShow, $data.slot]
    ])
  ]);
}
var Affix = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Affix as default };
