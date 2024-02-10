import { clearHours } from "../util.js";
import { deepCopy } from "../../../utils/assist.js";
import Locale from "../../../mixins/locale.js";
import mixin from "./mixin.js";
import prefixCls from "./prefixCls.js";
import { openBlock, createElementBlock, normalizeClass, Fragment, renderList, createElementVNode, toDisplayString } from "vue";
import _export_sfc from "../../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  mixins: [Locale, mixin],
  props: {},
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-month`
      ];
    },
    cells() {
      let cells = [];
      const cell_tmpl = {
        text: "",
        selected: false,
        disabled: false
      };
      const tableYear = this.tableDate.getFullYear();
      const selectedDays = this.dates.filter(Boolean).map((date) => clearHours(new Date(date.getFullYear(), date.getMonth(), 1)));
      const focusedDate = clearHours(new Date(this.focusedDate.getFullYear(), this.focusedDate.getMonth(), 1));
      for (let i = 0; i < 12; i++) {
        const cell = deepCopy(cell_tmpl);
        cell.date = new Date(tableYear, i, 1);
        cell.text = this.tCell(i + 1);
        const day = clearHours(cell.date);
        cell.disabled = typeof this.disabledDate === "function" && this.disabledDate(cell.date) && this.selectionMode === "month";
        cell.selected = selectedDays.includes(day);
        cell.focused = day === focusedDate;
        cells.push(cell);
      }
      return cells;
    }
  },
  methods: {
    getCellCls(cell) {
      return [
        `${prefixCls}-cell`,
        {
          [`${prefixCls}-cell-selected`]: cell.selected,
          [`${prefixCls}-cell-disabled`]: cell.disabled,
          [`${prefixCls}-cell-focused`]: cell.focused,
          [`${prefixCls}-cell-range`]: cell.range && !cell.start && !cell.end
        }
      ];
    },
    tCell(nr) {
      return this.t(`i.datepicker.months.m${nr}`);
    }
  }
};
const _hoisted_1 = ["onClick", "onMouseenter"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes)
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.cells, (cell) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass($options.getCellCls(cell)),
        key: cell.text,
        onClick: ($event) => _ctx.handleClick(cell, $event),
        onMouseenter: ($event) => _ctx.handleMouseMove(cell)
      }, [
        createElementVNode("em", null, toDisplayString(cell.text), 1)
      ], 42, _hoisted_1);
    }), 128))
  ], 2);
}
var MonthTable = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { MonthTable as default };
