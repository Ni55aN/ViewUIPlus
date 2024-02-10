import random from "../../utils/random_str.js";
import { withDirectives, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, vShow } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-tabs-tabpane";
const _sfc_main = {
  name: "TabPane",
  inject: ["TabsInstance"],
  props: {
    name: {
      type: String
    },
    label: {
      type: [String, Function],
      default: ""
    },
    icon: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: null
    },
    tab: {
      type: String
    },
    index: {
      type: Number
    },
    contextMenu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls,
      show: true,
      currentName: this.name,
      id: random(6)
    };
  },
  computed: {
    contentStyle() {
      return {
        visibility: this.TabsInstance.activeKey !== this.currentName ? "hidden" : "visible"
      };
    }
  },
  methods: {
    updateNav() {
      this.TabsInstance.updateNav();
    },
    addPane() {
      const root = this.TabsInstance;
      if (!root.paneList)
        root.paneList = [];
      root.paneList.push({
        id: this.id,
        pane: this
      });
    },
    removePane() {
      const root = this.TabsInstance;
      if (root.paneList && root.paneList.length) {
        const index = root.paneList.findIndex((item) => item.id === this.id);
        root.paneList.splice(index, 1);
      }
    }
  },
  watch: {
    name(val) {
      this.currentName = val;
      this.updateNav();
    },
    label(val) {
      if (typeof val !== "function")
        this.updateNav();
    },
    icon() {
      this.updateNav();
    },
    disabled() {
      this.updateNav();
    }
  },
  mounted() {
    this.addPane();
    this.updateNav();
  },
  beforeUnmount() {
    this.removePane();
    this.updateNav();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return withDirectives((openBlock(), createElementBlock("div", {
    class: normalizeClass($data.prefixCls),
    style: normalizeStyle($options.contentStyle)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 6)), [
    [vShow, $data.show]
  ]);
}
var TabPane = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TabPane as default };
