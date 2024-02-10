import Input from "../input/input.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, createVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Search",
  components: { Input },
  emits: ["on-query-change", "on-query-clear"],
  props: {
    prefixCls: String,
    placeholder: String,
    query: String
  },
  data() {
    return {
      currentQuery: this.query
    };
  },
  watch: {
    query(val) {
      this.currentQuery = val;
    },
    currentQuery(val) {
      this.$emit("on-query-change", val);
    }
  },
  computed: {
    icon() {
      return this.query === "" ? "ios-search" : "ios-close-circle";
    }
  },
  methods: {
    handleClick() {
      if (this.currentQuery === "")
        return;
      this.currentQuery = "";
      this.$emit("on-query-clear");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Input = resolveComponent("Input");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($props.prefixCls)
  }, [
    createVNode(_component_Input, {
      modelValue: $data.currentQuery,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.currentQuery = $event),
      size: "small",
      icon: $options.icon,
      placeholder: $props.placeholder,
      onOnClick: $options.handleClick
    }, null, 8, ["modelValue", "icon", "placeholder", "onOnClick"])
  ], 2);
}
var Search = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Search as default };
