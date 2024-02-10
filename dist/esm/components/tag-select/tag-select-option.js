import Tag from "../tag/tag.js";
import random from "../../utils/random_str.js";
import { resolveComponent, openBlock, createElementBlock, createVNode, mergeProps, withCtx, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "TagSelectOption",
  components: { Tag },
  inject: ["TagSelectInstance"],
  props: {
    name: {
      type: [String, Number],
      required: true
    },
    tagProps: {
      type: Object,
      default() {
        return {};
      }
    },
    color: {
      type: String,
      default: "primary"
    }
  },
  data() {
    return {
      checked: false,
      id: random(6)
    };
  },
  methods: {
    handleChange(checked) {
      this.checked = checked;
      this.TagSelectInstance.handleChangeTag(this.name);
    },
    addOption() {
      const target = this.TagSelectInstance;
      target.tagSelectOptionList.push({
        id: this.id,
        option: this
      });
    },
    removeOption() {
      const target = this.TagSelectInstance;
      const index = target.tagSelectOptionList.findIndex((item) => item.id === this.id);
      target.tagSelectOptionList.splice(index, 1);
    }
  },
  mounted() {
    this.addOption();
  },
  beforeUnmount() {
    this.removeOption();
  }
};
const _hoisted_1 = { class: "ivu-tag-select-option" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Tag = resolveComponent("Tag");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createVNode(_component_Tag, mergeProps({
      checkable: "",
      checked: $data.checked,
      onOnChange: $options.handleChange,
      color: $props.color
    }, $props.tagProps), {
      default: withCtx(() => [
        renderSlot(_ctx.$slots, "default")
      ]),
      _: 3
    }, 16, ["checked", "onOnChange", "color"])
  ]);
}
var TagSelectOption = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TagSelectOption as default };
