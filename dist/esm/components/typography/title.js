import { h } from "vue";
import _sfc_main$1 from "./base.js";
import baseProps from "./props.js";
import { oneOf } from "../../utils/assist.js";
const _sfc_main = {
  name: "Title",
  mixins: [baseProps],
  props: {
    level: {
      type: Number,
      validator(value) {
        return oneOf(value, [1, 2, 3, 4, 5, 6]);
      },
      default: 1
    }
  },
  render() {
    return h(_sfc_main$1, {
      ...this.$props,
      component: `h${this.level}`,
      ...this.commonEvents()
    }, this.commonSlots());
  }
};
export { _sfc_main as default };
