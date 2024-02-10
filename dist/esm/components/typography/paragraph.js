import { h } from "vue";
import _sfc_main$1 from "./base.js";
import baseProps from "./props.js";
const _sfc_main = {
  name: "Paragraph",
  mixins: [baseProps],
  render() {
    return h(_sfc_main$1, {
      ...this.$props,
      component: "div",
      ...this.commonEvents()
    }, this.commonSlots());
  }
};
export { _sfc_main as default };
