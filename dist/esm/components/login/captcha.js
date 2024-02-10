import { h } from "vue";
import _sfc_main$1 from "../button/button.js";
import Input from "../input/input.js";
import Col from "../col/col.js";
import Row from "../row/row.js";
import FormItem from "../form/form-item.js";
import LoginItem from "./login-item.js";
const _sfc_main = {
  name: "Captcha",
  mixins: [LoginItem],
  emits: ["on-get-captcha"],
  props: {
    field: {
      type: [String, Array]
    },
    countDown: {
      type: Number,
      default: 60
    },
    text: {
      type: String
    },
    unitText: {
      type: String,
      default: "\u79D2"
    },
    beforeClick: Function
  },
  data() {
    return {
      className: "ivu-login-captcha",
      prefix: "ios-keypad-outline",
      placeholder: "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801",
      type: "text",
      buttonDisabled: false,
      limitCountDown: 0
    };
  },
  methods: {
    handleClickCaptcha() {
      if (this.field) {
        const fields = typeof this.field === "string" ? [this.field] : this.field;
        this.LoginInstance.handleValidate(fields, (status) => {
          if (status)
            this.handleBeforeGetCaptcha();
        });
      } else {
        this.handleBeforeGetCaptcha();
      }
    },
    handleBeforeGetCaptcha() {
      if (!this.beforeClick) {
        return this.handleGetCaptcha();
      }
      const before = this.beforeClick();
      if (before && before.then) {
        before.then(() => {
          this.handleGetCaptcha();
        });
      } else {
        this.handleGetCaptcha();
      }
    },
    handleGetCaptcha() {
      if (this.countDown > 0) {
        this.buttonDisabled = true;
        this.limitCountDown = this.countDown;
        this.handleCountDown();
      }
      this.$emit("on-get-captcha", this.LoginInstance.formValidate[this.prop], JSON.parse(JSON.stringify(this.LoginInstance.formValidate)));
    },
    handleCountDown() {
      this.timer = setTimeout(() => {
        this.limitCountDown--;
        if (this.limitCountDown === 0) {
          this.buttonDisabled = false;
          clearTimeout(this.timer);
        } else {
          this.handleCountDown();
        }
      }, 1e3);
    }
  },
  render() {
    const $attrs = this.$attrs;
    const finalProps = this.handleGetProps();
    const defaultButtonProps = {
      size: "large",
      type: "default",
      long: true,
      disabled: this.buttonDisabled
    };
    if ("size" in $attrs)
      defaultButtonProps.size = $attrs.size;
    if ("button-type" in $attrs)
      defaultButtonProps.type = $attrs["button-type"];
    let buttonSlot;
    if (this.$slots.text) {
      buttonSlot = this.$slots.text;
    } else if (this.limitCountDown !== 0) {
      buttonSlot = () => `${this.limitCountDown} ${this.unitText}`;
    } else if (this.text) {
      buttonSlot = () => this.text;
    } else {
      buttonSlot = () => "\u83B7\u53D6\u9A8C\u8BC1\u7801";
    }
    const $button = h(_sfc_main$1, {
      ...defaultButtonProps,
      onClick: this.handleClickCaptcha
    }, buttonSlot);
    const $input = h(Input, {
      ...finalProps,
      "onUpdate:modelValue": this.handleChange,
      "onOn-enter": this.handleEnter
    });
    const $colinput = h(Col, {
      span: 16
    }, () => [$input]);
    const $colbutton = h(Col, {
      span: 8
    }, () => [$button]);
    const $row = h(Row, {
      gutter: 8
    }, () => [$colinput, $colbutton]);
    const $formitem = h(FormItem, {
      prop: this.prop,
      rules: this.rules
    }, () => [$row]);
    return h("div", {
      class: this.className
    }, [$formitem]);
  },
  beforeUnmount() {
    if (this.timer)
      clearTimeout(this.timer);
  }
};
export { _sfc_main as default };
