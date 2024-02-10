import { t } from "../locale/index.js";
var Locale = {
  methods: {
    t(...args) {
      return t.apply(this, args);
    }
  }
};
export { Locale as default };
