import { oneOf } from "../../utils/assist.js";
import { openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-form";
const _sfc_main = {
  name: "iForm",
  emits: ["on-validate"],
  provide() {
    return {
      FormInstance: this
    };
  },
  props: {
    model: {
      type: Object
    },
    rules: {
      type: Object
    },
    labelWidth: {
      type: Number
    },
    labelPosition: {
      validator(value) {
        return oneOf(value, ["left", "right", "top"]);
      },
      default: "right"
    },
    inline: {
      type: Boolean,
      default: false
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    autocomplete: {
      validator(value) {
        return oneOf(value, ["on", "off"]);
      },
      default: "off"
    },
    hideRequiredMark: {
      type: Boolean,
      default: false
    },
    labelColon: {
      type: [Boolean, String],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fields: []
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-label-${this.labelPosition}`,
        {
          [`${prefixCls}-inline`]: this.inline,
          [`${prefixCls}-hide-required-mark`]: this.hideRequiredMark
        }
      ];
    },
    colon() {
      let colon = "";
      if (this.labelColon) {
        colon = typeof this.labelColon === "boolean" ? ":" : this.labelColon;
      }
      return colon;
    }
  },
  methods: {
    resetFields() {
      this.fields.forEach((field) => {
        field.resetField();
      });
    },
    validate(callback) {
      return new Promise((resolve) => {
        let valid = true;
        let count = 0;
        if (this.fields.length === 0) {
          resolve(valid);
          if (typeof callback === "function") {
            callback(valid);
          }
        }
        this.fields.forEach((field) => {
          field.validate("", (errors) => {
            if (errors) {
              valid = false;
            }
            if (++count === this.fields.length) {
              resolve(valid);
              if (typeof callback === "function") {
                callback(valid);
              }
            }
          });
        });
      });
    },
    validateField(prop, cb) {
      const field = this.fields.filter((field2) => field2.prop === prop)[0];
      if (!field) {
        throw new Error("[View UI warn]: must call validateField with valid prop string!");
      }
      field.validate("", cb);
    },
    addField(field) {
      if (field)
        this.fields.push(field);
    },
    removeField(field) {
      if (field.prop)
        this.fields.splice(this.fields.indexOf(field), 1);
    }
  },
  watch: {
    rules() {
      this.validate();
    }
  }
};
const _hoisted_1 = ["autocomplete"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("form", {
    class: normalizeClass($options.classes),
    autocomplete: $props.autocomplete
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 10, _hoisted_1);
}
var Form = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Form as default };
