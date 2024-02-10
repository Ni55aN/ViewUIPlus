import Numeral$1 from "numeral";
import { openBlock, createElementBlock, renderSlot, createTextVNode, toDisplayString } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Numeral",
  emits: ["on-change"],
  props: {
    value: {
      type: [String, Number]
    },
    format: {
      type: String
    },
    prefix: {
      type: [String, Number]
    },
    suffix: {
      type: [String, Number]
    }
  },
  data() {
    return {
      currentValue: ""
    };
  },
  watch: {
    value() {
      this.init();
    },
    format() {
      this.init();
    }
  },
  methods: {
    init() {
      if (this.value !== void 0) {
        const num = Numeral$1(this.value);
        if (this.format) {
          this.currentValue = num.format(this.format);
        } else {
          this.currentValue = num.value();
        }
        this.$emit("on-change", this.currentValue);
      }
    },
    getValue() {
      return this.currentValue;
    }
  },
  mounted() {
    this.init();
  }
};
const _hoisted_1 = { class: "ivu-numeral" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", _hoisted_1, [
    renderSlot(_ctx.$slots, "prefix", {}, () => [
      createTextVNode(toDisplayString($props.prefix), 1)
    ]),
    createTextVNode(toDisplayString($data.currentValue), 1),
    renderSlot(_ctx.$slots, "suffix", {}, () => [
      createTextVNode(toDisplayString($props.suffix), 1)
    ])
  ]);
}
var Numeral = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Numeral as default };
