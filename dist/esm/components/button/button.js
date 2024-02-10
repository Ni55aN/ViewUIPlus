import { getCurrentInstance, h } from "vue";
import Icon from "../icon/icon.js";
import { oneOf } from "../../utils/assist.js";
import mixinsLink from "../../mixins/link.js";
import mixinsForm from "../../mixins/form.js";
const prefixCls = "ivu-btn";
const _sfc_main = {
  name: "Button",
  mixins: [mixinsLink, mixinsForm],
  components: { Icon },
  emits: ["click"],
  props: {
    type: {
      validator(value) {
        return oneOf(value, ["default", "primary", "dashed", "text", "info", "success", "warning", "error"]);
      },
      default: "default"
    },
    shape: {
      validator(value) {
        return oneOf(value, ["circle", "circle-outline"]);
      }
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "large", "default"]);
      },
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.size === "" ? "default" : global.$VIEWUI.size;
      }
    },
    loading: Boolean,
    disabled: Boolean,
    htmlType: {
      default: "button",
      validator(value) {
        return oneOf(value, ["button", "submit", "reset"]);
      }
    },
    icon: {
      type: String,
      default: ""
    },
    customIcon: {
      type: String,
      default: ""
    },
    long: {
      type: Boolean,
      default: false
    },
    ghost: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showSlot() {
      return !!this.$slots.default;
    },
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.type}`,
        {
          [`${prefixCls}-long`]: this.long,
          [`${prefixCls}-${this.shape}`]: !!this.shape,
          [`${prefixCls}-${this.size}`]: this.size !== "default",
          [`${prefixCls}-loading`]: this.loading != null && this.loading,
          [`${prefixCls}-icon-only`]: !this.showSlot && (!!this.icon || !!this.customIcon || this.loading),
          [`${prefixCls}-ghost`]: this.ghost
        }
      ];
    },
    isHrefPattern() {
      const { to } = this;
      return !!to;
    },
    tagName() {
      const { isHrefPattern } = this;
      return isHrefPattern ? "a" : "button";
    },
    tagProps() {
      const { isHrefPattern } = this;
      if (isHrefPattern) {
        const { linkUrl, target } = this;
        return { href: linkUrl, target };
      } else {
        const { htmlType } = this;
        return { type: htmlType };
      }
    }
  },
  methods: {
    handleClickLink(event) {
      this.$emit("click", event);
      const openInNewWindow = event.ctrlKey || event.metaKey;
      this.handleCheckClick(event, openInNewWindow);
    }
  },
  render() {
    let tag;
    if (this.tagName === "button")
      tag = "button";
    else if (this.tagName === "a")
      tag = "a";
    let slots = [];
    if (this.loading) {
      slots.push(h(Icon, {
        class: "ivu-load-loop",
        type: "ios-loading"
      }));
    }
    if ((this.icon || this.customIcon) && !this.loading) {
      slots.push(h(Icon, {
        type: this.icon,
        custom: this.customIcon
      }));
    }
    if (this.$slots.default) {
      slots.push(h("span", {
        ref: "slot"
      }, this.$slots.default()));
    }
    return h(tag, {
      class: this.classes,
      disabled: this.itemDisabled,
      onClick: this.handleClickLink,
      ...this.tagProps
    }, slots);
  }
};
export { _sfc_main as default };
