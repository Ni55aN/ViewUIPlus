import Icon from "../icon/icon.js";
import { oneOf } from "../../utils/assist.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Trend",
  components: { Icon },
  props: {
    flag: {
      validator(value) {
        return oneOf(value, ["up", "down"]);
      }
    },
    colorful: {
      type: Boolean,
      default: true
    },
    reverseColor: {
      type: Boolean,
      default: false
    },
    textColor: {
      type: Boolean,
      default: false
    },
    showTitle: {
      type: [Boolean, String],
      default: false
    }
  },
  computed: {
    classes() {
      return [
        {
          ["ivu-trend-up"]: this.flag === "up",
          ["ivu-trend-down"]: this.flag === "down",
          ["ivu-trend-reverse-color"]: this.reverseColor,
          ["ivu-trend-colorful"]: this.colorful,
          ["ivu-trend-text-color"]: this.textColor
        }
      ];
    },
    flagType() {
      return this.flag === "up" ? "md-arrow-dropup" : this.flag === "down" ? "md-arrow-dropdown" : "";
    }
  }
};
const _hoisted_1 = { class: "ivu-trend-text" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["ivu-trend", $options.classes])
  }, [
    createElementVNode("span", _hoisted_1, [
      renderSlot(_ctx.$slots, "default")
    ]),
    createVNode(_component_Icon, {
      type: $options.flagType,
      class: "ivu-trend-flag"
    }, null, 8, ["type"])
  ], 2);
}
var Trend = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Trend as default };
