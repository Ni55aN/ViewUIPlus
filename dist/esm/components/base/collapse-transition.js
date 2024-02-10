import { defineComponent, openBlock, createBlock, Transition, toHandlers, withCtx, renderSlot } from "vue";
import { addClass, removeClass } from "../../utils/assist.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "CollapseTransition",
  props: {
    ready: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    return {
      on: {
        beforeEnter(el) {
          if (!props.ready)
            return;
          addClass(el, "collapse-transition");
          if (!el.dataset)
            el.dataset = {};
          el.dataset.oldPaddingTop = el.style.paddingTop;
          el.dataset.oldPaddingBottom = el.style.paddingBottom;
          el.style.height = "0";
          el.style.paddingTop = 0;
          el.style.paddingBottom = 0;
        },
        enter(el) {
          if (!props.ready)
            return;
          el.dataset.oldOverflow = el.style.overflow;
          if (el.scrollHeight !== 0) {
            el.style.height = el.scrollHeight + "px";
            el.style.paddingTop = el.dataset.oldPaddingTop;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
          } else {
            el.style.height = "";
            el.style.paddingTop = el.dataset.oldPaddingTop;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
          }
          el.style.overflow = "hidden";
        },
        afterEnter(el) {
          if (!props.ready)
            return;
          removeClass(el, "collapse-transition");
          el.style.height = "";
          el.style.overflow = el.dataset.oldOverflow;
        },
        beforeLeave(el) {
          if (!props.ready)
            return;
          if (!el.dataset)
            el.dataset = {};
          el.dataset.oldPaddingTop = el.style.paddingTop;
          el.dataset.oldPaddingBottom = el.style.paddingBottom;
          el.dataset.oldOverflow = el.style.overflow;
          el.style.height = el.scrollHeight + "px";
          el.style.overflow = "hidden";
        },
        leave(el) {
          if (!props.ready)
            return;
          if (el.scrollHeight !== 0) {
            addClass(el, "collapse-transition");
            el.style.height = 0;
            el.style.paddingTop = 0;
            el.style.paddingBottom = 0;
          }
        },
        afterLeave(el) {
          if (!props.ready)
            return;
          removeClass(el, "collapse-transition");
          el.style.height = "";
          el.style.overflow = el.dataset.oldOverflow;
          el.style.paddingTop = el.dataset.oldPaddingTop;
          el.style.paddingBottom = el.dataset.oldPaddingBottom;
        }
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, toHandlers(_ctx.on), {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3
  }, 16);
}
var CollapseTransition = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CollapseTransition as default };
