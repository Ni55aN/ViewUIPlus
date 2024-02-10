import { oneOf } from "../../utils/assist.js";
import SkeletonItem from "./skeleton-item.js";
import Row from "../row/row.js";
import Col from "../col/col.js";
import { resolveComponent, openBlock, createElementBlock, mergeProps, renderSlot, createVNode, withCtx, createBlock, normalizeClass, createCommentVNode, Fragment, renderList, normalizeProps } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-skeleton";
const _sfc_main = {
  name: "Skeleton",
  components: { SkeletonItem, Row, Col },
  provide() {
    return {
      SkeletonInstance: this
    };
  },
  props: {
    animated: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    paragraph: {
      validator(value) {
        if (typeof value === "number") {
          return value >= 1;
        }
        return typeof value.rows === "number" && value.rows >= 1;
      },
      type: [Number, Object],
      default: 3
    },
    title: {
      validator(value) {
        if (typeof value === "object") {
          if (value.width)
            return ["number", "string"].includes(typeof value.width);
        }
        return true;
      },
      type: [Boolean, Object],
      default: true
    },
    avatar: {
      validator(value) {
        if (typeof value === "object") {
          if (value.type)
            return oneOf(value.type, ["circle", "square"]);
          if (value.size)
            return oneOf(value.size, ["small", "large", "default"]);
        }
        return true;
      },
      type: [Boolean, Object],
      default: false
    }
  },
  data() {
    return {
      prefixCls
    };
  },
  computed: {
    classes() {
      return [
        prefixCls,
        {
          [prefixCls + "-with-title"]: this.showTitle,
          [prefixCls + "-with-avatar"]: this.showAvatar
        }
      ];
    },
    rows() {
      if (typeof this.paragraph === "number") {
        return this.paragraph;
      }
      return this.paragraph.rows;
    },
    rowsCount() {
      return this.rows + Number(this.showTitle);
    },
    showTitle() {
      return Boolean(this.title);
    },
    titleWidth() {
      if (typeof this.title === "object" && this.title.width) {
        return typeof this.title.width === "string" ? this.title.width : `${this.title.width}px`;
      }
      return "";
    },
    showAvatar() {
      return Boolean(this.avatar);
    },
    avatarType() {
      if (typeof this.avatar === "object" && this.avatar.type)
        return this.avatar.type;
      return "circle";
    },
    avatarSize() {
      if (typeof this.avatar === "object" && this.avatar.size)
        return this.avatar.size;
      return !this.$VIEWUI || this.$VIEWUI.size === "" ? "default" : this.$VIEWUI.size;
    }
  },
  methods: {
    rowClasses(row) {
      return [
        prefixCls + "-item-inner",
        {
          [prefixCls + "-item-round"]: this.round,
          [prefixCls + "-item-title"]: this.showTitle && row === 1
        }
      ];
    },
    rowWidth(row) {
      if (this.showTitle && row === 1) {
        return this.titleWidth || "38%";
      }
      if (typeof this.paragraph === "object") {
        if (typeof this.paragraph.width === "string") {
          return this.paragraph.width;
        }
        if (typeof this.paragraph.width === "number") {
          return `${this.paragraph.width}px`;
        }
        const index = row - 1 - Number(this.showTitle);
        if (Array.isArray(this.paragraph.width) && this.paragraph.width[index]) {
          if (typeof this.paragraph.width[index] === "number") {
            return `${this.paragraph.width[index]}px`;
          } else {
            return this.paragraph.width[index];
          }
        }
      }
      return row === this.rowsCount ? "62%" : "100%";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SkeletonItem = resolveComponent("SkeletonItem");
  const _component_Col = resolveComponent("Col");
  const _component_Row = resolveComponent("Row");
  return $props.loading ? (openBlock(), createElementBlock("div", mergeProps({ key: 0 }, _ctx.$attrs, { class: $options.classes }), [
    $props.loading ? renderSlot(_ctx.$slots, "template", { key: 0 }, () => [
      createVNode(_component_Row, null, {
        default: withCtx(() => [
          $options.showAvatar ? (openBlock(), createBlock(_component_Col, {
            key: 0,
            flex: "0"
          }, {
            default: withCtx(() => [
              createVNode(_component_SkeletonItem, {
                type: $options.avatarType,
                size: $options.avatarSize,
                animated: $props.animated,
                class: normalizeClass($data.prefixCls + "-item-avatar")
              }, null, 8, ["type", "size", "animated", "class"])
            ]),
            _: 1
          })) : createCommentVNode("", true),
          createVNode(_component_Col, { flex: "1" }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList($options.rowsCount, (row) => {
                return openBlock(), createBlock(_component_SkeletonItem, {
                  key: row,
                  class: normalizeClass($options.rowClasses(row)),
                  animated: $props.animated,
                  width: $options.rowWidth(row),
                  block: ""
                }, null, 8, ["class", "animated", "width"]);
              }), 128))
            ]),
            _: 1
          })
        ]),
        _: 1
      })
    ]) : createCommentVNode("", true)
  ], 16)) : renderSlot(_ctx.$slots, "default", normalizeProps(mergeProps({ key: 1 }, _ctx.$attrs)));
}
var Skeleton = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Skeleton as default };
