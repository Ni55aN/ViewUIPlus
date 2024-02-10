import { getCurrentInstance } from "vue";
import { oneOf } from "../../utils/assist.js";
import mixinsLink from "../../mixins/link.js";
const defaultCopyConfig = {
  tooltips: ["\u590D\u5236", "\u590D\u5236\u6210\u529F"],
  showTip: false,
  successTip: "\u590D\u5236\u6210\u529F",
  errorTip: "\u590D\u5236\u5931\u8D25"
};
const defaultEditConfig = {
  tooltip: "\u7F16\u8F91",
  editing: false,
  maxlength: "",
  autosize: true,
  triggerType: "icon"
};
const defaultEllipsisConfig = {
  rows: 1,
  tooltip: false,
  suffix: false,
  expandable: false,
  symbol: "\u5C55\u5F00"
};
var baseProps = {
  emits: ["update:modelValue"],
  mixins: [mixinsLink],
  props: {
    type: {
      validator(value) {
        return oneOf(value, ["secondary", "success", "warning", "danger", ""]);
      },
      default: ""
    },
    copyable: {
      type: Boolean,
      default: false
    },
    copyText: {
      type: String,
      default: ""
    },
    copyConfig: {
      type: Object,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.typography.copyConfig === "" ? defaultCopyConfig : global.$VIEWUI.typography.copyConfig;
      }
    },
    editable: {
      type: Boolean,
      default: false
    },
    editConfig: {
      type: Object,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.typography.editConfig === "" ? defaultEditConfig : global.$VIEWUI.typography.editConfig;
      }
    },
    ellipsis: {
      type: Boolean,
      default: false
    },
    ellipsisConfig: {
      type: Object,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.typography.ellipsisConfig === "" ? defaultEllipsisConfig : global.$VIEWUI.typography.ellipsisConfig;
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    code: {
      type: Boolean,
      default: false
    },
    delete: {
      type: Boolean,
      default: false
    },
    keyboard: {
      type: Boolean,
      default: false
    },
    mark: {
      type: Boolean,
      default: false
    },
    strong: {
      type: Boolean,
      default: false
    },
    underline: {
      type: Boolean,
      default: false
    },
    italic: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: String,
      default: ""
    },
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? false : global.$VIEWUI.transfer;
      }
    },
    theme: {
      validator(value) {
        return oneOf(value, ["dark", "light"]);
      },
      default: "dark"
    },
    maxWidth: {
      type: [String, Number],
      default: 250
    },
    placement: {
      validator(value) {
        return oneOf(value, ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]);
      },
      default: "top"
    }
  },
  computed: {
    isHrefPattern() {
      const { to } = this;
      return !!to;
    },
    linkProps() {
      if (this.isHrefPattern) {
        const { linkUrl, target } = this;
        return { href: linkUrl, target };
      } else {
        return {};
      }
    },
    mergedCopyConfig() {
      return Object.assign({}, defaultCopyConfig, this.copyConfig);
    },
    mergedEditConfig() {
      return Object.assign({}, defaultEditConfig, this.editConfig);
    },
    mergedEllipsisConfig() {
      return Object.assign({}, defaultEllipsisConfig, this.ellipsisConfig);
    }
  },
  methods: {
    commonSlots() {
      const slots = {};
      if (this.$slots.default)
        slots.default = () => this.$slots.default();
      if (this.$slots.copyIcon)
        slots.copyIcon = (props) => this.$slots.copyIcon(props);
      if (this.$slots.editIcon)
        slots.editIcon = (props) => this.$slots.editIcon(props);
      if (this.$slots.enterIcon)
        slots.enterIcon = (props) => this.$slots.enterIcon(props);
      return slots;
    },
    commonEvents() {
      return {
        "onUpdate:modelValue": this.handleOnUpdateModelValue
      };
    },
    handleOnUpdateModelValue(value) {
      this.$emit("update:modelValue", value);
    }
  }
};
export { baseProps as default };
