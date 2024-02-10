import { clearHours, isInRange } from "../util.js";
import Locale from "../../../mixins/locale.js";
import jsCalendar from "js-calendar";
import mixin from "./mixin.js";
import prefixCls from "./prefixCls.js";
import { openBlock, createElementBlock, normalizeClass, createElementVNode, Fragment, renderList, toDisplayString } from "vue";
import _export_sfc from "../../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  mixins: [Locale, mixin],
  props: {
    showWeekNumbers: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-show-week-numbers`]: this.showWeekNumbers
        }
      ];
    },
    calendar() {
      const weekStartDay = Number(this.t("i.datepicker.weekStartDay"));
      return new jsCalendar.Generator({ onlyDays: !this.showWeekNumbers, weekStart: weekStartDay });
    },
    headerDays() {
      const weekStartDay = Number(this.t("i.datepicker.weekStartDay"));
      const translatedDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((item) => {
        return this.t("i.datepicker.weeks." + item);
      });
      const weekDays = translatedDays.splice(weekStartDay, 7 - weekStartDay).concat(translatedDays.splice(0, weekStartDay));
      return this.showWeekNumbers ? [""].concat(weekDays) : weekDays;
    },
    cells() {
      const tableYear = this.tableDate.getFullYear();
      const tableMonth = this.tableDate.getMonth();
      const today = clearHours(new Date());
      const selectedDays = this.dates.filter(Boolean).map(clearHours);
      const [minDay, maxDay] = this.dates.map(clearHours);
      const rangeStart = this.rangeState.from && clearHours(this.rangeState.from);
      const rangeEnd = this.rangeState.to && clearHours(this.rangeState.to);
      const isRange = this.selectionMode === "range";
      const disabledTestFn = typeof this.disabledDate === "function" && this.disabledDate;
      return this.calendar(tableYear, tableMonth, (cell) => {
        if (cell.date instanceof Date)
          cell.date.setTime(cell.date.getTime() + cell.date.getTimezoneOffset() * 6e4 + 480 * 60 * 1e3);
        const time = cell.date && clearHours(cell.date);
        const dateIsInCurrentMonth = cell.date && tableMonth === cell.date.getMonth();
        return {
          ...cell,
          type: time === today ? "today" : cell.type,
          selected: dateIsInCurrentMonth && selectedDays.includes(time),
          disabled: cell.date && disabledTestFn && disabledTestFn(new Date(time)),
          range: dateIsInCurrentMonth && isRange && isInRange(time, rangeStart, rangeEnd),
          start: dateIsInCurrentMonth && isRange && time === minDay,
          end: dateIsInCurrentMonth && isRange && time === maxDay
        };
      }).cells.slice(this.showWeekNumbers ? 8 : 0);
    }
  },
  methods: {
    getCellCls(cell) {
      return [
        `${prefixCls}-cell`,
        {
          [`${prefixCls}-cell-selected`]: cell.selected || cell.start || cell.end,
          [`${prefixCls}-cell-disabled`]: cell.disabled,
          [`${prefixCls}-cell-today`]: cell.type === "today",
          [`${prefixCls}-cell-prev-month`]: cell.type === "prevMonth",
          [`${prefixCls}-cell-next-month`]: cell.type === "nextMonth",
          [`${prefixCls}-cell-week-label`]: cell.type === "weekLabel",
          [`${prefixCls}-cell-range`]: cell.range && !cell.start && !cell.end,
          [`${prefixCls}-focused`]: clearHours(cell.date) === clearHours(this.focusedDate)
        }
      ];
    }
  }
};
const _hoisted_1 = { class: "ivu-date-picker-cells-header" };
const _hoisted_2 = ["onClick", "onMouseenter"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes)
  }, [
    createElementVNode("div", _hoisted_1, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($options.headerDays, (day) => {
        return openBlock(), createElementBlock("span", { key: day }, toDisplayString(day), 1);
      }), 128))
    ]),
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.cells, (cell, i) => {
      return openBlock(), createElementBlock("span", {
        key: String(cell.date) + i,
        class: normalizeClass($options.getCellCls(cell)),
        onClick: ($event) => _ctx.handleClick(cell, $event),
        onMouseenter: ($event) => _ctx.handleMouseMove(cell)
      }, [
        createElementVNode("em", null, toDisplayString(cell.desc), 1)
      ], 42, _hoisted_2);
    }), 128))
  ], 2);
}
var DateTable = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { DateTable as default };
