import { findComponentsUpward } from "../../utils/assist.js";
var mixin = {
  inject: {
    MenuInstance: {
      default: null
    },
    SubmenuInstance: {
      default: null
    }
  },
  data() {
    return {
      menu: this.MenuInstance
    };
  },
  computed: {
    hasParentSubmenu() {
      return !!this.SubmenuInstance;
    },
    parentSubmenuNum() {
      return findComponentsUpward(this, "Submenu").length;
    },
    mode() {
      return this.MenuInstance.mode;
    }
  }
};
export { mixin as default };
