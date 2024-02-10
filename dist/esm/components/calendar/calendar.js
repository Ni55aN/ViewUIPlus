import ButtonGroup from "../button/button-group.js";
import _sfc_main$1 from "../button/button.js";
import RadioGroup from "../radio/radio-group.js";
import Radio from "../radio/radio.js";
import Icon from "../icon/icon.js";
import dayjs from "dayjs";
import { oneOf } from "../../utils/assist.js";
import CalendarMonth from "./month.js";
import CalendarYear from "./year.js";
import { resolveComponent, openBlock, createElementBlock, renderSlot, createElementVNode, createTextVNode, toDisplayString, Fragment, createVNode, withCtx, createBlock, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Calendar",
  components: { CalendarMonth, CalendarYear, ButtonGroup, Button: _sfc_main$1, RadioGroup, Radio, Icon },
  emits: ["on-type-change", "on-prev", "on-next", "on-today", "on-change", "update:modelValue", "on-cell-click", "on-cell-contextmenu"],
  provide() {
    return {
      CalendarInstance: this
    };
  },
  props: {
    modelValue: {
      type: [Date, String, Number]
    },
    type: {
      validator(value) {
        return oneOf(value, ["month", "year"]);
      },
      default: "month"
    },
    cellHeight: {
      type: Number,
      default: 100
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    headerType: {
      validator(value) {
        return oneOf(value, ["simple", "full"]);
      },
      default: "simple"
    },
    firstDayOfWeek: {
      validator(value) {
        return oneOf(value, [1, 2, 3, 4, 5, 6, 7]);
      },
      default: 1
    },
    hideType: {
      type: Boolean,
      default: false
    },
    locale: {
      type: Object,
      default() {
        return {
          today: "\u4ECA\u5929",
          type: {
            month: "\u6708",
            year: "\u5E74"
          },
          weekDays: ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"],
          months: ["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"]
        };
      }
    }
  },
  data() {
    const value = this.modelValue ? this.modelValue : new Date();
    return {
      currentValue: dayjs(value),
      mode: this.type
    };
  },
  watch: {
    modelValue(val) {
      const value = val ? val : new Date();
      this.currentValue = dayjs(value);
    },
    type(val) {
      this.mode = val;
    }
  },
  computed: {
    headerTitle() {
      if (this.mode === "month") {
        return this.currentValue.format("YYYY \u5E74 M \u6708");
      } else if (this.mode === "year") {
        return this.currentValue.format("YYYY \u5E74");
      }
    }
  },
  methods: {
    handleChangeType(type) {
      this.$emit("on-type-change", type);
    },
    handlePrev() {
      const firstDate = this.currentValue.format("YYYY-MM-01");
      let prevDate;
      if (this.mode === "month") {
        prevDate = dayjs(firstDate).subtract(1, "month");
      } else if (this.mode === "year") {
        prevDate = dayjs(firstDate).subtract(1, "year");
      }
      this.handleChangeDate(prevDate);
      this.$emit("on-prev");
    },
    handleNext() {
      const firstDate = this.currentValue.format("YYYY-MM-01");
      let nextDate;
      if (this.mode === "month") {
        nextDate = dayjs(firstDate).add(1, "month");
      } else if (this.mode === "year") {
        nextDate = dayjs(firstDate).add(1, "year");
      }
      this.handleChangeDate(nextDate);
      this.$emit("on-next");
    },
    handleToday() {
      const nowDate = dayjs(new Date());
      const today = nowDate.format("YYYY-MM-DD");
      const currentValue = this.currentValue.format("YYYY-MM-DD");
      if (today !== currentValue) {
        this.handleChangeDate(nowDate);
      }
      this.$emit("on-today");
    },
    handleChangeDate(val) {
      this.currentValue = val;
      const date = new Date(val.format("YYYY-MM-DD"));
      this.$emit("update:modelValue", date);
      this.$emit("on-change", date);
    }
  }
};
const _hoisted_1 = { class: "ivu-calendar" };
const _hoisted_2 = {
  key: 0,
  class: "ivu-calendar-header"
};
const _hoisted_3 = { class: "ivu-calendar-header-title" };
const _hoisted_4 = { class: "ivu-calendar-header-action" };
const _hoisted_5 = { class: "ivu-calendar-body" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_Button = resolveComponent("Button");
  const _component_ButtonGroup = resolveComponent("ButtonGroup");
  const _component_Radio = resolveComponent("Radio");
  const _component_RadioGroup = resolveComponent("RadioGroup");
  const _component_CalendarMonth = resolveComponent("CalendarMonth");
  const _component_CalendarYear = resolveComponent("CalendarYear");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    $props.showHeader ? (openBlock(), createElementBlock("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "header", {}, () => [
        createElementVNode("div", _hoisted_3, [
          renderSlot(_ctx.$slots, "headerTitle", {}, () => [
            createTextVNode(toDisplayString($options.headerTitle), 1)
          ])
        ]),
        createElementVNode("div", _hoisted_4, [
          $props.headerType === "simple" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createVNode(_component_ButtonGroup, null, {
              default: withCtx(() => [
                createVNode(_component_Button, { onClick: $options.handlePrev }, {
                  default: withCtx(() => [
                    createVNode(_component_Icon, { type: "ios-arrow-back" })
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_Button, { onClick: $options.handleToday }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString($props.locale.today), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_Button, { onClick: $options.handleNext }, {
                  default: withCtx(() => [
                    createVNode(_component_Icon, { type: "ios-arrow-forward" })
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ]),
              _: 1
            }),
            !$props.hideType ? (openBlock(), createBlock(_component_RadioGroup, {
              key: 0,
              modelValue: $data.mode,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.mode = $event),
              type: "button",
              class: "ivu-ml",
              onOnChange: $options.handleChangeType
            }, {
              default: withCtx(() => [
                createVNode(_component_Radio, { label: "month" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString($props.locale.type.month), 1)
                  ]),
                  _: 1
                }),
                createVNode(_component_Radio, { label: "year" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString($props.locale.type.year), 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["modelValue", "onOnChange"])) : createCommentVNode("", true)
          ], 64)) : $props.headerType === "full" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [], 64)) : createCommentVNode("", true)
        ])
      ])
    ])) : createCommentVNode("", true),
    createElementVNode("div", _hoisted_5, [
      $data.mode === "month" ? (openBlock(), createBlock(_component_CalendarMonth, {
        key: 0,
        date: $data.currentValue
      }, {
        month: withCtx(({ date, data }) => [
          renderSlot(_ctx.$slots, "month", {
            date,
            data
          })
        ]),
        _: 3
      }, 8, ["date"])) : $data.mode === "year" ? (openBlock(), createBlock(_component_CalendarYear, {
        key: 1,
        date: $data.currentValue
      }, {
        year: withCtx(({ month, data }) => [
          renderSlot(_ctx.$slots, "year", {
            month,
            data
          })
        ]),
        _: 3
      }, 8, ["date"])) : createCommentVNode("", true)
    ])
  ]);
}
var Calendar = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Calendar as default };
