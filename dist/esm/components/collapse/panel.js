import Icon from "../icon/icon.js";
import CollapseTransition from "../base/collapse-transition.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, createBlock, createCommentVNode, renderSlot, withCtx, withDirectives, vShow } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-collapse";
const _sfc_main = {
  name: "Panel",
  components: { Icon, CollapseTransition },
  inject: ["CollapseInstance"],
  props: {
    name: {
      type: String
    },
    hideArrow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      index: 0,
      mounted: false
    };
  },
  computed: {
    itemClasses() {
      return [
        `${prefixCls}-item`,
        {
          [`${prefixCls}-item-active`]: this.isActive
        }
      ];
    },
    headerClasses() {
      return `${prefixCls}-header`;
    },
    contentClasses() {
      return `${prefixCls}-content`;
    },
    boxClasses() {
      return `${prefixCls}-content-box`;
    },
    isActive() {
      const activeKey = this.CollapseInstance.getActiveKey();
      const name = this.name || this.index.toString();
      return activeKey.indexOf(name) > -1;
    }
  },
  methods: {
    setIndex() {
      this.index = this.CollapseInstance.panelCount + 1;
      this.CollapseInstance.panelCount = this.index;
    },
    toggle() {
      this.CollapseInstance.toggle({
        name: this.name || this.index,
        isActive: this.isActive
      });
    }
  },
  mounted() {
    this.setIndex();
    this.mounted = true;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_collapse_transition = resolveComponent("collapse-transition");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.itemClasses)
  }, [
    createElementVNode("div", {
      class: normalizeClass($options.headerClasses),
      onClick: _cache[0] || (_cache[0] = (...args) => $options.toggle && $options.toggle(...args))
    }, [
      !$props.hideArrow ? (openBlock(), createBlock(_component_Icon, {
        key: 0,
        type: "ios-arrow-forward"
      })) : createCommentVNode("", true),
      renderSlot(_ctx.$slots, "default")
    ], 2),
    $data.mounted ? (openBlock(), createBlock(_component_collapse_transition, { key: 0 }, {
      default: withCtx(() => [
        withDirectives(createElementVNode("div", {
          class: normalizeClass($options.contentClasses)
        }, [
          createElementVNode("div", {
            class: normalizeClass($options.boxClasses)
          }, [
            renderSlot(_ctx.$slots, "content")
          ], 2)
        ], 2), [
          [vShow, $options.isActive]
        ])
      ]),
      _: 3
    })) : createCommentVNode("", true)
  ], 2);
}
var Panel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Panel as default };
