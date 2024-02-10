import dayjs from "dayjs";
import chunk from "lodash.chunk";
import events from "./events.js";
import { openBlock, createElementBlock, createElementVNode, Fragment, renderList, toDisplayString, withModifiers, normalizeClass, normalizeStyle, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "CalendarMonth",
  mixins: [events],
  inject: ["CalendarInstance"],
  props: {
    date: Object
  },
  data() {
    return {
      firstDayOfWeek: this.CalendarInstance.firstDayOfWeek,
      weekDays: this.CalendarInstance.locale.weekDays
    };
  },
  computed: {
    finalWeekDays() {
      return this.weekDays.slice(this.firstDayOfWeek).concat(this.weekDays.slice(0, this.firstDayOfWeek));
    },
    days() {
      let days = [];
      const firstDate = dayjs(this.date.format("YYYY-MM-01"));
      const firstDay = firstDate.day();
      const firstDayOfWeek = this.firstDayOfWeek;
      const prevMonthDaysCount = firstDayOfWeek <= firstDay ? firstDay - firstDayOfWeek : 7 - (firstDayOfWeek - firstDay);
      for (let i = 0; i < prevMonthDaysCount; i++) {
        const day = firstDate.subtract(prevMonthDaysCount - i, "day");
        const date = {
          text: day.format("YYYY-MM-DD"),
          date: day.format("D"),
          type: "prev"
        };
        days.push(date);
      }
      const daysInMonth = firstDate.daysInMonth();
      for (let i = 0; i < daysInMonth; i++) {
        const day = firstDate.add(i, "day");
        const date = {
          text: day.format("YYYY-MM-DD"),
          date: day.format("D"),
          type: "current"
        };
        days.push(date);
      }
      const nextMonthDaysCount = 42 - days.length;
      const nextMonthFirstDay = firstDate.add(1, "month");
      for (let i = 0; i < nextMonthDaysCount; i++) {
        const day = nextMonthFirstDay.add(i, "day");
        const date = {
          text: day.format("YYYY-MM-DD"),
          date: day.format("D"),
          type: "next"
        };
        days.push(date);
      }
      return days;
    },
    chunkDays() {
      return chunk(this.days, 7);
    },
    dayStyles() {
      let style = {};
      if (this.CalendarInstance.cellHeight !== 100) {
        style.height = `${this.CalendarInstance.cellHeight}px`;
      }
      return style;
    },
    currentDate() {
      return this.date.format("YYYY-MM-DD");
    }
  },
  methods: {
    handleClickDate(date) {
      this.CalendarInstance.handleChangeDate(dayjs(date));
    }
  }
};
const _hoisted_1 = {
  class: "ivu-calendar-table",
  cellspacing: "0",
  cellpadding: "0"
};
const _hoisted_2 = ["onClick", "onContextmenu"];
const _hoisted_3 = ["onClick"];
const _hoisted_4 = { class: "ivu-calendar-table-day-title" };
const _hoisted_5 = { class: "ivu-calendar-table-day-slot" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("table", _hoisted_1, [
    createElementVNode("thead", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($options.finalWeekDays, (item) => {
        return openBlock(), createElementBlock("th", { key: item }, toDisplayString(item), 1);
      }), 128))
    ]),
    createElementVNode("tbody", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($options.chunkDays, (item, index) => {
        return openBlock(), createElementBlock("tr", { key: index }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(item, (date) => {
            return openBlock(), createElementBlock("td", {
              key: date.text,
              onClick: ($event) => _ctx.handleCellClick(date),
              onContextmenu: withModifiers(($event) => _ctx.handleCellContextmenu(date), ["prevent"])
            }, [
              createElementVNode("div", {
                class: normalizeClass(["ivu-calendar-table-day", { "ivu-calendar-table-day-other": date.type !== "current", "ivu-calendar-table-day-current": date.text === $options.currentDate }]),
                style: normalizeStyle($options.dayStyles),
                onClick: ($event) => $options.handleClickDate(date.text)
              }, [
                createElementVNode("div", _hoisted_4, toDisplayString(date.date), 1),
                createElementVNode("div", _hoisted_5, [
                  renderSlot(_ctx.$slots, "month", {
                    date: new Date(date.date),
                    data: { type: date.type + "-month", day: date.text, selected: date.text === $options.currentDate }
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
var CalendarMonth = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CalendarMonth as default };
