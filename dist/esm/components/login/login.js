import Form from "../form/form.js";
import { resolveComponent, openBlock, createElementBlock, createVNode, withModifiers, withCtx, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Login",
  components: { Form },
  emits: ["on-submit"],
  provide() {
    return {
      LoginInstance: this
    };
  },
  props: {},
  data() {
    return {
      formValidate: {}
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        this.$emit("on-submit", valid, JSON.parse(JSON.stringify(this.formValidate)));
      });
    },
    handleValidate(fields, cb) {
      let status = true;
      fields.forEach((field) => {
        this.$refs.form.validateField(field, (valid) => {
          if (valid)
            status = false;
        });
      });
      cb(status);
    }
  }
};
const _hoisted_1 = { class: "ivu-login" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Form = resolveComponent("Form");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createVNode(_component_Form, {
      ref: "form",
      model: $data.formValidate,
      onSubmit: _cache[0] || (_cache[0] = withModifiers(() => {
      }, ["prevent"]))
    }, {
      default: withCtx(() => [
        renderSlot(_ctx.$slots, "default")
      ]),
      _: 3
    }, 8, ["model"])
  ]);
}
var Login = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Login as default };
