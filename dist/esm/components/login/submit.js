import { h } from "vue";
import _sfc_main$1 from "../button/button.js";
const _sfc_main = {
  name: "Submit",
  inject: ["LoginInstance"],
  props: {},
  methods: {
    handleSubmit() {
      this.LoginInstance.handleSubmit();
    }
  },
  render() {
    const defaultProps = {
      size: "large",
      type: "primary",
      long: true
    };
    const finalProps = Object.assign(defaultProps, this.$attrs);
    const $button = h(_sfc_main$1, {
      ...finalProps,
      onClick: this.handleSubmit
    }, this.$slots.default || (() => "\u767B\u5F55"));
    return h("div", {
      class: "ivu-login-submit"
    }, [$button]);
  }
};
export { _sfc_main as default };
