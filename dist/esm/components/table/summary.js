import Mixin from "./mixin.js";
import { openBlock, createElementBlock, createElementVNode, normalizeStyle, Fragment, renderList, normalizeClass, toDisplayString } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "TableSummary",
  mixins: [Mixin],
  props: {
    prefixCls: String,
    styleObject: Object,
    columns: Array,
    data: Object,
    columnsWidth: Object,
    fixed: {
      type: [Boolean, String],
      default: false
    }
  },
  methods: {
    cellCls(column) {
      return [
        {
          ["ivu-table-hidden"]: this.fixed === "left" && column.fixed !== "left" || this.fixed === "right" && column.fixed !== "right" || !this.fixed && column.fixed && (column.fixed === "left" || column.fixed === "right")
        }
      ];
    }
  }
};
const _hoisted_1 = { style: { "overflow": "hidden" } };
const _hoisted_2 = ["width"];
const _hoisted_3 = { class: "ivu-table-row" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createElementVNode("table", {
      class: "ivu-table-summary",
      cellspacing: "0",
      cellpadding: "0",
      border: "0",
      style: normalizeStyle($props.styleObject)
    }, [
      createElementVNode("colgroup", null, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.columns, (column, index) => {
          return openBlock(), createElementBlock("col", {
            key: index,
            width: _ctx.setCellWidth(column)
          }, null, 8, _hoisted_2);
        }), 128))
      ]),
      createElementVNode("tbody", {
        class: normalizeClass([$props.prefixCls + "-tbody"])
      }, [
        createElementVNode("tr", _hoisted_3, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.columns, (column, index) => {
            return openBlock(), createElementBlock("td", {
              key: index,
              class: normalizeClass(_ctx.alignCls(column))
            }, [
              createElementVNode("div", {
                class: normalizeClass(["ivu-table-cell", $options.cellCls(column)])
              }, [
                createElementVNode("span", null, toDisplayString($props.data[column.key].value), 1)
              ], 2)
            ], 2);
          }), 128))
        ])
      ], 2)
    ], 4)
  ]);
}
var tableSummary = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { tableSummary as default };
