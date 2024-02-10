import { getCurrentInstance, h } from "vue";
import Input from "../input/input.js";
import FormItem from "../form/form-item.js";
import defaultValidateMessage from "./default_validate_message.js";
var LoginItem = {
  inject: ["LoginInstance"],
  emits: ["on-change"],
  props: {
    rules: {
      type: [Object, Array],
      default() {
        const componentName = getCurrentInstance().type.name;
        return [
          {
            required: true,
            message: defaultValidateMessage[componentName],
            trigger: "change"
          }
        ];
      }
    },
    value: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    enterToSubmit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prop: ""
    };
  },
  methods: {
    handleChange(val) {
      this.LoginInstance.formValidate[this.prop] = val;
      this.$emit("on-change", val);
    },
    handleEnter() {
      if (this.enterToSubmit)
        this.LoginInstance.handleSubmit();
    },
    handleSetValue() {
      const $props = this.$props;
      if ($props.value) {
        this.LoginInstance.formValidate[this.prop] = $props.value;
      }
    },
    handleGetProps() {
      const $props = this.$props;
      let name = $props.name;
      const defaultProps = {
        prefix: this.prefix,
        placeholder: this.placeholder,
        type: this.type,
        size: "large",
        modelValue: this.LoginInstance.formValidate[this.prop]
      };
      if (name)
        defaultProps.name = name;
      return Object.assign(defaultProps, this.$attrs);
    }
  },
  render() {
    const finalProps = this.handleGetProps();
    const $input = h(Input, {
      ...finalProps,
      "onUpdate:modelValue": this.handleChange,
      "onOn-enter": this.handleEnter
    });
    const $formitem = h(FormItem, {
      prop: this.prop,
      rules: this.rules
    }, () => [$input]);
    return h("div", {
      class: this.className
    }, [$formitem]);
  },
  created() {
    const name = this.name;
    const formValidate = Object.assign({}, this.LoginInstance.formValidate);
    formValidate[name] = "";
    this.LoginInstance.formValidate = formValidate;
    this.prop = name;
    this.handleSetValue();
  }
};
export { LoginItem as default };
