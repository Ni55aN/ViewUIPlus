import { getCurrentInstance, resolveComponent, openBlock, createElementBlock, normalizeClass, normalizeStyle, createBlock, renderSlot } from "vue";
import Icon from "../icon/icon.js";
import { oneOf } from "../../utils/assist.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-avatar";
const sizeList = ["small", "large", "default"];
const _sfc_main = {
  name: "Avatar",
  components: { Icon },
  emits: ["on-error"],
  props: {
    shape: {
      validator(value) {
        return oneOf(value, ["circle", "square"]);
      },
      default: "circle"
    },
    size: {
      type: [String, Number],
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.size === "" ? "default" : global.$VIEWUI.size;
      }
    },
    src: {
      type: String
    },
    icon: {
      type: String
    },
    customIcon: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      prefixCls,
      scale: 1,
      childrenWidth: 0,
      isSlotShow: false,
      slotTemp: null
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.shape}`,
        {
          [`${prefixCls}-image`]: !!this.src,
          [`${prefixCls}-icon`]: !!this.icon || !!this.customIcon,
          [`${prefixCls}-${this.size}`]: oneOf(this.size, sizeList)
        }
      ];
    },
    styles() {
      let style = {};
      if (this.size && !oneOf(this.size, sizeList)) {
        style.width = `${this.size}px`;
        style.height = `${this.size}px`;
        style.lineHeight = `${this.size}px`;
        style.fontSize = `${this.size / 2}px`;
      }
      return style;
    },
    childrenStyle() {
      let style = {};
      if (this.isSlotShow) {
        style = {
          msTransform: `scale(${this.scale})`,
          WebkitTransform: `scale(${this.scale})`,
          transform: `scale(${this.scale})`,
          position: "absolute",
          display: "inline-block",
          left: `calc(50% - ${Math.round(this.childrenWidth / 2)}px)`
        };
      }
      return style;
    }
  },
  watch: {
    size(val, oldVal) {
      if (val !== oldVal)
        this.setScale();
    }
  },
  methods: {
    setScale() {
      this.isSlotShow = !this.src && !this.icon;
      if (this.$refs.children) {
        this.childrenWidth = this.$refs.children.offsetWidth;
        const avatarWidth = this.$el.getBoundingClientRect().width;
        if (avatarWidth - 8 < this.childrenWidth) {
          this.scale = (avatarWidth - 8) / this.childrenWidth;
        } else {
          this.scale = 1;
        }
      }
    },
    handleError(e) {
      this.$emit("on-error", e);
    }
  },
  beforeCreate() {
    this.slotTemp = this.$slots.default ? this.$slots.default() : null;
  },
  mounted() {
    this.setScale();
  },
  updated() {
    const slot = this.$slots.default ? this.$slots.default() : null;
    if (slot && slot !== this.slotTemp)
      this.setScale();
  }
};
const _hoisted_1 = ["src"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  return openBlock(), createElementBlock("span", {
    class: normalizeClass($options.classes),
    style: normalizeStyle($options.styles)
  }, [
    $props.src ? (openBlock(), createElementBlock("img", {
      key: 0,
      src: $props.src,
      onError: _cache[0] || (_cache[0] = (...args) => $options.handleError && $options.handleError(...args))
    }, null, 40, _hoisted_1)) : $props.icon || $props.customIcon ? (openBlock(), createBlock(_component_Icon, {
      key: 1,
      type: $props.icon,
      custom: $props.customIcon
    }, null, 8, ["type", "custom"])) : (openBlock(), createElementBlock("span", {
      key: 2,
      ref: "children",
      class: normalizeClass([$data.prefixCls + "-string"]),
      style: normalizeStyle($options.childrenStyle)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 6))
  ], 6);
}
var Avatar = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Avatar as default };
