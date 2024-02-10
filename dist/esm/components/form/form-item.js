import AsyncValidator from "async-validator";
import { openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createTextVNode, toDisplayString, createCommentVNode, createElementVNode, createVNode, Transition, withCtx } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-form-item";
function getPropByPath(obj, path) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, ".$1");
  path = path.replace(/^\./, "");
  let keyArr = path.split(".");
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    let key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      throw new Error("[View UI warn]: please transfer a valid prop path to form item!");
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj[keyArr[i]]
  };
}
const _sfc_main = {
  name: "FormItem",
  inject: ["FormInstance"],
  provide() {
    return {
      FormItemInstance: this
    };
  },
  props: {
    label: {
      type: String,
      default: ""
    },
    labelWidth: {
      type: Number
    },
    prop: {
      type: String
    },
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: [Object, Array]
    },
    error: {
      type: String
    },
    validateStatus: {
      type: Boolean
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    labelFor: {
      type: String
    }
  },
  data() {
    return {
      prefixCls,
      isRequired: false,
      validateState: "",
      validateMessage: "",
      validateDisabled: false,
      validator: {}
    };
  },
  watch: {
    error: {
      handler(val) {
        this.validateMessage = val;
        this.validateState = val ? "error" : "";
      },
      immediate: true
    },
    validateStatus(val) {
      this.validateState = val;
    },
    rules() {
      this.setRules();
    },
    required(n, o) {
      this.isRequired = n;
      if (o && !n) {
        this.resetField();
      }
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-required`]: this.required || this.isRequired,
          [`${prefixCls}-error`]: this.validateState === "error",
          [`${prefixCls}-validating`]: this.validateState === "validating"
        }
      ];
    },
    fieldValue() {
      const model = this.FormInstance.model;
      if (!model || !this.prop) {
        return;
      }
      let path = this.prop;
      if (path.indexOf(":") !== -1) {
        path = path.replace(/:/, ".");
      }
      return getPropByPath(model, path).v;
    },
    labelStyles() {
      let style = {};
      const labelWidth = this.labelWidth === 0 || this.labelWidth ? this.labelWidth : this.FormInstance.labelWidth;
      if (labelWidth || labelWidth === 0) {
        style.width = `${labelWidth}px`;
      }
      return style;
    },
    contentStyles() {
      let style = {};
      const labelWidth = this.labelWidth === 0 || this.labelWidth ? this.labelWidth : this.FormInstance.labelWidth;
      if (labelWidth || labelWidth === 0) {
        style.marginLeft = `${labelWidth}px`;
      }
      return style;
    }
  },
  methods: {
    setRules() {
      let rules = this.getRules();
      if (rules.length && this.required) {
        return;
      } else if (rules.length) {
        rules.every((rule) => {
          this.isRequired = rule.required;
        });
      } else if (this.required) {
        this.isRequired = this.required;
      }
    },
    getRules() {
      let formRules = this.FormInstance.rules;
      const selfRules = this.rules;
      formRules = formRules ? formRules[this.prop] : [];
      return [].concat(selfRules || formRules || []);
    },
    getFilteredRule(trigger) {
      const rules = this.getRules();
      return rules.filter((rule) => !rule.trigger || rule.trigger.indexOf(trigger) !== -1);
    },
    validate(trigger, callback = function() {
    }) {
      let rules = this.getFilteredRule(trigger);
      if (!rules || rules.length === 0) {
        if (!this.required) {
          callback();
          return true;
        } else {
          rules = [{ required: true }];
        }
      }
      this.validateState = "validating";
      let descriptor = {};
      descriptor[this.prop] = rules;
      const validator = new AsyncValidator(descriptor);
      let model = {};
      model[this.prop] = this.fieldValue;
      validator.validate(model, { firstFields: true }, (errors) => {
        this.validateState = !errors ? "success" : "error";
        this.validateMessage = errors ? errors[0].message : "";
        callback(this.validateMessage);
        this.FormInstance && this.FormInstance.$emit("on-validate", this.prop, !errors, this.validateMessage || null);
      });
      this.validateDisabled = false;
    },
    resetField() {
      this.validateState = "";
      this.validateMessage = "";
      let model = this.FormInstance.model;
      let value = this.fieldValue;
      let path = this.prop;
      if (path.indexOf(":") !== -1) {
        path = path.replace(/:/, ".");
      }
      let prop = getPropByPath(model, path);
      if (Array.isArray(value) && this.initialValue !== null) {
        this.validateDisabled = true;
        prop.o[prop.k] = [].concat(this.initialValue);
      } else {
        this.validateDisabled = true;
        prop.o[prop.k] = this.initialValue;
      }
    },
    onFieldBlur() {
      this.validate("blur");
    },
    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false;
        return;
      }
      this.validate("change");
    },
    formBlur() {
      this.onFieldBlur();
    },
    formChange() {
      this.onFieldChange();
    }
  },
  mounted() {
    if (this.prop) {
      this.FormInstance.addField(this);
      Object.defineProperty(this, "initialValue", {
        value: this.fieldValue
      });
      this.setRules();
    }
  },
  beforeUnmount() {
    this.FormInstance.removeField(this);
  }
};
const _hoisted_1 = ["for"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes)
  }, [
    $props.label || _ctx.$slots.label ? (openBlock(), createElementBlock("label", {
      key: 0,
      class: normalizeClass([$data.prefixCls + "-label"]),
      for: $props.labelFor,
      style: normalizeStyle($options.labelStyles)
    }, [
      renderSlot(_ctx.$slots, "label", {}, () => [
        createTextVNode(toDisplayString($props.label) + toDisplayString($options.FormInstance.colon), 1)
      ])
    ], 14, _hoisted_1)) : createCommentVNode("", true),
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-content"]),
      style: normalizeStyle($options.contentStyles)
    }, [
      renderSlot(_ctx.$slots, "default"),
      createVNode(Transition, { name: "fade" }, {
        default: withCtx(() => [
          $data.validateState === "error" && $props.showMessage && $options.FormInstance.showMessage ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass([$data.prefixCls + "-error-tip"])
          }, toDisplayString($data.validateMessage), 3)) : createCommentVNode("", true)
        ]),
        _: 1
      })
    ], 6)
  ], 2);
}
var FormItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { FormItem as default };
