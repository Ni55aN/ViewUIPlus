import dayjs from "dayjs";
import chunk from "lodash.chunk";
import events from "./events.js";
import { openBlock, createElementBlock, createElementVNode, Fragment, renderList, withModifiers, normalizeClass, normalizeStyle, toDisplayString, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "CalendarYear",
  mixins: [events],
  inject: ["CalendarInstance"],
  props: {
    date: Object
  },
  data() {
    return {};
  },
  computed: {
    months() {
      let months = [];
      const firstMonth = dayjs(this.date.format("YYYY-01-01"));
      for (let i = 0; i < 12; i++) {
        const day = firstMonth.add(i, "month");
        months.push({
          text: day.format("YYYY-MM"),
          month: this.CalendarInstance.locale.months[i],
          type: "current"
        });
      }
      return months;
    },
    chunkMonths() {
      return chunk(this.months, 3);
    },
    dayStyles() {
      let style = {};
      if (this.CalendarInstance.cellHeight !== 100) {
        style.height = `${this.CalendarInstance.cellHeight}px`;
      }
      return style;
    },
    currentMonth() {
      return this.date.format("YYYY-MM");
    }
  },
  methods: {
    handleClickDate(date) {
      this.CalendarInstance.handleChangeDate(dayjs(date));
    }
  }
};
const _hoisted_1 = {
  class: "ivu-calendar-table ivu-calendar-table-year",
  cellspacing: "0",
  cellpadding: "0"
};
const _hoisted_2 = ["onClick", "onContextmenu"];
const _hoisted_3 = ["onClick"];
const _hoisted_4 = { class: "ivu-calendar-table-day-title" };
const _hoisted_5 = { class: "ivu-calendar-table-day-slot" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("table", _hoisted_1, [
    createElementVNode("tbody", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($options.chunkMonths, (item, index) => {
        return openBlock(), createElementBlock("tr", { key: index }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(item, (month) => {
            return openBlock(), createElementBlock("td", {
              key: month.text,
              onClick: ($event) => _ctx.handleCellClick(month),
              onContextmenu: withModifiers(($event) => _ctx.handleCellContextmenu(month), ["prevent"])
            }, [
              createElementVNode("div", {
                class: normalizeClass(["ivu-calendar-table-day", { "ivu-calendar-table-day-current": month.text === $options.currentMonth }]),
                style: normalizeStyle($options.dayStyles),
                onClick: ($event) => $options.handleClickDate(month.text)
              }, [
                createElementVNode("div", _hoisted_4, toDisplayString(month.month), 1),
                createElementVNode("div", _hoisted_5, [
                  renderSlot(_ctx.$slots, "year", {
                    month: new Date(month.month),
                    data: { type: month.type + "-year", month: month.text, selected: month.text === $options.currentMonth }
                  })
                ])
              ], 14, _hoisted_3)
            ], 40, _hoisted_2);
          }), 128))
        ]);
      }), 128))
    ])
  ]);
}
var CalendarYear = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CalendarYear as default };
