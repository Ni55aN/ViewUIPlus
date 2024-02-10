import { openBlock, createElementBlock, normalizeClass, createElementVNode, setBlockTracking, Fragment, renderList } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Trigger",
  props: {
    mode: String
  },
  data() {
    return {
      prefix: "ivu-split-trigger",
      initOffset: 0
    };
  },
  computed: {
    isVertical() {
      return this.mode === "vertical";
    },
    classes() {
      return [
        this.prefix,
        this.isVertical ? `${this.prefix}-vertical` : `${this.prefix}-horizontal`
      ];
    },
    barConClasses() {
      return [
        `${this.prefix}-bar-con`,
        this.isVertical ? "vertical" : "horizontal"
      ];
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes)
  }, [
    createElementVNode("div", {
      class: normalizeClass($options.barConClasses)
    }, [
      _cache[0] || (setBlockTracking(-1), _cache[0] = (openBlock(), createElementBlock(Fragment, null, renderList(8, (i) => {
        return createElementVNode("i", {
          class: normalizeClass(`${$data.prefix}-bar`),
          key: `trigger-${i}`
        }, null, 2);
      }), 64)), setBlockTracking(1), _cache[0])
    ], 2)
  ], 2);
}
var Trigger = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Trigger as default };
