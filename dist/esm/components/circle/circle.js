import { oneOf } from "../../utils/assist.js";
import random from "../../utils/random_str.js";
import { openBlock, createElementBlock, normalizeStyle, normalizeClass, createElementVNode, createCommentVNode, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-chart-circle";
const _sfc_main = {
  name: "iCircle",
  props: {
    percent: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 120
    },
    strokeWidth: {
      type: Number,
      default: 6
    },
    strokeColor: {
      type: [String, Array],
      default: "#2d8cf0"
    },
    strokeLinecap: {
      validator(value) {
        return oneOf(value, ["square", "round"]);
      },
      default: "round"
    },
    trailWidth: {
      type: Number,
      default: 5
    },
    trailColor: {
      type: String,
      default: "#eaeef2"
    },
    dashboard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: `ivu-chart-circle-${random(3)}`
    };
  },
  computed: {
    circleSize() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`
      };
    },
    computedStrokeWidth() {
      return this.percent === 0 && this.dashboard ? 0 : this.strokeWidth;
    },
    radius() {
      return 50 - this.strokeWidth / 2;
    },
    pathString() {
      if (this.dashboard) {
        return `M 50,50 m 0,${this.radius}
                    a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}
                    a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius}`;
      } else {
        return `M 50,50 m 0,-${this.radius}
                    a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius}
                    a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}`;
      }
    },
    len() {
      return Math.PI * 2 * this.radius;
    },
    trailStyle() {
      let style = {};
      if (this.dashboard) {
        style = {
          "stroke-dasharray": `${this.len - 75}px ${this.len}px`,
          "stroke-dashoffset": `-${75 / 2}px`,
          "transition": "stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s"
        };
      }
      return style;
    },
    pathStyle() {
      let style = {};
      if (this.dashboard) {
        style = {
          "stroke-dasharray": `${this.percent / 100 * (this.len - 75)}px ${this.len}px`,
          "stroke-dashoffset": `-${75 / 2}px`,
          "transition": "stroke-dashoffset .3s ease 0s, stroke-dasharray .6s ease 0s, stroke .6s, stroke-width .06s ease .6s"
        };
      } else {
        style = {
          "stroke-dasharray": `${this.len}px ${this.len}px`,
          "stroke-dashoffset": `${(100 - this.percent) / 100 * this.len}px`,
          "transition": "stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease"
        };
      }
      return style;
    },
    wrapClasses() {
      return `${prefixCls}`;
    },
    innerClasses() {
      return `${prefixCls}-inner`;
    },
    strokeValue() {
      let color = this.strokeColor;
      if (typeof this.strokeColor !== "string") {
        color = `url(#${this.id})`;
      }
      return color;
    },
    showDefs() {
      return typeof this.strokeColor !== "string";
    }
  }
};
const _hoisted_1 = { viewBox: "0 0 100 100" };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = ["id"];
const _hoisted_4 = ["stop-color"];
const _hoisted_5 = ["stop-color"];
const _hoisted_6 = ["d", "stroke", "stroke-width", "stroke-linecap"];
const _hoisted_7 = ["d", "stroke-linecap", "stroke", "stroke-width"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    style: normalizeStyle($options.circleSize),
    class: normalizeClass($options.wrapClasses)
  }, [
    (openBlock(), createElementBlock("svg", _hoisted_1, [
      $options.showDefs ? (openBlock(), createElementBlock("defs", _hoisted_2, [
        createElementVNode("linearGradient", {
          id: $data.id,
          x1: "100%",
          y1: "0%",
          x2: "0%",
          y2: "0%"
        }, [
          createElementVNode("stop", {
            offset: "0%",
            "stop-color": $props.strokeColor[0]
          }, null, 8, _hoisted_4),
          createElementVNode("stop", {
            offset: "100%",
            "stop-color": $props.strokeColor[1]
          }, null, 8, _hoisted_5)
        ], 8, _hoisted_3)
      ])) : createCommentVNode("", true),
      createElementVNode("path", {
        d: $options.pathString,
        stroke: $props.trailColor,
        "stroke-width": $props.trailWidth,
        "fill-opacity": 0,
        style: normalizeStyle($options.trailStyle),
        "stroke-linecap": $props.strokeLinecap
      }, null, 12, _hoisted_6),
      createElementVNode("path", {
        d: $options.pathString,
        "stroke-linecap": $props.strokeLinecap,
        stroke: $options.strokeValue,
        "stroke-width": $options.computedStrokeWidth,
        "fill-opacity": "0",
        style: normalizeStyle($options.pathStyle)
      }, null, 12, _hoisted_7)
    ])),
    createElementVNode("div", {
      class: normalizeClass($options.innerClasses)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2)
  ], 6);
}
var Circle = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Circle as default };
