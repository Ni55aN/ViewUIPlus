import { h } from "vue";
import _sfc_main$1 from "./base.js";
import baseProps from "./props.js";
const _sfc_main = {
  name: "Link",
  mixins: [baseProps],
  render() {
    return h(_sfc_main$1, {
      ...this.$props,
      component: "a",
      ...this.commonEvents()
    }, this.commonSlots());
  }
};
export { _sfc_main as default };
