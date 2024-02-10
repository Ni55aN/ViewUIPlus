import Icon from "../../../icon/icon.js";
import DateTable from "../../base/date-table.js";
import YearTable from "../../base/year-table.js";
import MonthTable from "../../base/month-table.js";
import RangeTimePickerPanel from "../Time/time-range.js";
import Confirm from "../../base/confirm.js";
import { initTimeDate, toDate, formatDateLabels } from "../../util.js";
import datePanelLabel from "./date-panel-label.js";
import Mixin from "../panel-mixin.js";
import DateMixin from "./date-panel-mixin.js";
import Locale from "../../../../mixins/locale.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, withModifiers, Fragment, renderList, toDisplayString, createCommentVNode, createElementVNode, withDirectives, createVNode, vShow, createBlock, resolveDynamicComponent, mergeProps } from "vue";
import _export_sfc from "../../../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-picker-panel";
const datePrefixCls = "ivu-date-picker";
const dateSorter = (a, b) => {
  if (!a || !b)
    return 0;
  return a.getTime() - b.getTime();
};
const _sfc_main = {
  name: "RangeDatePickerPanel",
  mixins: [Mixin, Locale, DateMixin],
  components: { Icon, DateTable, YearTable, MonthTable, TimePicker: RangeTimePickerPanel, Confirm, datePanelLabel },
  props: {
    splitPanels: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const [minDate, maxDate] = this.modelValue.map((date) => date || initTimeDate());
    const leftPanelDate = this.startDate ? this.startDate : minDate;
    return {
      prefixCls,
      datePrefixCls,
      dates: this.modelValue,
      rangeState: { from: this.modelValue[0], to: this.modelValue[1], selecting: minDate && !maxDate },
      currentView: this.selectionMode || "range",
      leftPickerTable: `${this.selectionMode}-table`,
      rightPickerTable: `${this.selectionMode}-table`,
      leftPanelDate,
      rightPanelDate: new Date(leftPanelDate.getFullYear(), leftPanelDate.getMonth() + 1, 1)
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}-body-wrapper`,
        `${datePrefixCls}-with-range`,
        {
          [`${prefixCls}-with-sidebar`]: this.shortcuts.length,
          [`${datePrefixCls}-with-week-numbers`]: this.showWeekNumbers
        }
      ];
    },
    panelBodyClasses() {
      return [
        prefixCls + "-body",
        {
          [prefixCls + "-body-time"]: this.showTime,
          [prefixCls + "-body-date"]: !this.showTime
        }
      ];
    },
    leftDatePanelLabel() {
      return this.panelLabelConfig("left");
    },
    rightDatePanelLabel() {
      return this.panelLabelConfig("right");
    },
    leftDatePanelView() {
      return this.leftPickerTable.split("-").shift();
    },
    rightDatePanelView() {
      return this.rightPickerTable.split("-").shift();
    },
    timeDisabled() {
      return !(this.dates[0] && this.dates[1]);
    },
    preSelecting() {
      const tableType = `${this.currentView}-table`;
      return {
        left: this.leftPickerTable !== tableType,
        right: this.rightPickerTable !== tableType
      };
    },
    panelPickerHandlers() {
      return {
        left: this.preSelecting.left ? this.handlePreSelection.bind(this, "left") : this.handleRangePick,
        right: this.preSelecting.right ? this.handlePreSelection.bind(this, "right") : this.handleRangePick
      };
    }
  },
  watch: {
    modelValue(newVal) {
      const minDate = newVal[0] ? toDate(newVal[0]) : null;
      const maxDate = newVal[1] ? toDate(newVal[1]) : null;
      this.dates = [minDate, maxDate].sort(dateSorter);
      this.rangeState = {
        from: this.dates[0],
        to: this.dates[1],
        selecting: false
      };
      this.setPanelDates(this.startDate || this.dates[0] || new Date());
    },
    currentView(currentView) {
      const leftMonth = this.leftPanelDate.getMonth();
      const rightMonth = this.rightPanelDate.getMonth();
      const isSameYear = this.leftPanelDate.getFullYear() === this.rightPanelDate.getFullYear();
      if (currentView === "date" && isSameYear && leftMonth === rightMonth) {
        this.changePanelDate("right", "Month", 1);
      }
      if (currentView === "month" && isSameYear) {
        this.changePanelDate("right", "FullYear", 1);
      }
      if (currentView === "year" && isSameYear) {
        this.changePanelDate("right", "FullYear", 10);
      }
    },
    selectionMode(type) {
      this.currentView = type || "range";
    },
    focusedDate(date) {
      this.setPanelDates(date || new Date());
    }
  },
  methods: {
    reset() {
      this.currentView = this.selectionMode;
      this.leftPickerTable = `${this.currentView}-table`;
      this.rightPickerTable = `${this.currentView}-table`;
    },
    setPanelDates(leftPanelDate) {
      this.leftPanelDate = leftPanelDate;
      const rightPanelDate = new Date(leftPanelDate.getFullYear(), leftPanelDate.getMonth() + 1, 1);
      const splitRightPanelDate = this.dates[1] ? this.dates[1].getTime() : this.dates[1];
      this.rightPanelDate = this.splitPanels ? new Date(Math.max(splitRightPanelDate, rightPanelDate.getTime())) : rightPanelDate;
    },
    panelLabelConfig(direction) {
      const locale = this.t("i.locale");
      const datePanelLabel2 = this.t("i.datepicker.datePanelLabel");
      const handler = (type) => {
        const fn = type == "month" ? this.showMonthPicker : this.showYearPicker;
        return () => fn(direction);
      };
      const date = this[`${direction}PanelDate`];
      const { labels, separator } = formatDateLabels(locale, datePanelLabel2, date);
      return {
        separator,
        labels: labels.map((obj) => (obj.handler = handler(obj.type), obj))
      };
    },
    prevYear(panel) {
      const increment = this.currentView === "year" ? -10 : -1;
      this.changePanelDate(panel, "FullYear", increment);
    },
    nextYear(panel) {
      const increment = this.currentView === "year" ? 10 : 1;
      this.changePanelDate(panel, "FullYear", increment);
    },
    prevMonth(panel) {
      this.changePanelDate(panel, "Month", -1);
    },
    nextMonth(panel) {
      this.changePanelDate(panel, "Month", 1);
    },
    changePanelDate(panel, type, increment, updateOtherPanel = true) {
      const current = new Date(this[`${panel}PanelDate`]);
      if (type === "FullYear")
        current[`set${type}`](current[`get${type}`]() + increment);
      else
        current[`set${type}`](current[`get${type}`]() + increment, 1);
      this[`${panel}PanelDate`] = current;
      if (!updateOtherPanel)
        return;
      if (this.splitPanels) {
        const otherPanel = panel === "left" ? "right" : "left";
        if (panel === "left" && this.leftPanelDate >= this.rightPanelDate) {
          this.changePanelDate(otherPanel, type, 1);
        }
        if (panel === "right" && this.rightPanelDate <= this.leftPanelDate) {
          this.changePanelDate(otherPanel, type, -1);
        }
      } else {
        const otherPanel = panel === "left" ? "right" : "left";
        const currentDate = this[`${otherPanel}PanelDate`];
        const temp = new Date(currentDate);
        if (type === "Month") {
          const nextMonthLastDate = new Date(
            temp.getFullYear(),
            temp.getMonth() + increment + 1,
            0
          ).getDate();
          temp.setDate(Math.min(nextMonthLastDate, temp.getDate()));
        }
        temp[`set${type}`](temp[`get${type}`]() + increment);
        this[`${otherPanel}PanelDate`] = temp;
      }
    },
    showYearPicker(panel) {
      this[`${panel}PickerTable`] = "year-table";
    },
    showMonthPicker(panel) {
      this[`${panel}PickerTable`] = "month-table";
    },
    handlePreSelection(panel, value) {
      this[`${panel}PanelDate`] = value;
      const currentViewType = this[`${panel}PickerTable`];
      if (currentViewType === "year-table")
        this[`${panel}PickerTable`] = "month-table";
      else
        this[`${panel}PickerTable`] = `${this.currentView}-table`;
      if (!this.splitPanels) {
        const otherPanel = panel === "left" ? "right" : "left";
        this[`${otherPanel}PanelDate`] = value;
        const increment = otherPanel === "left" ? -1 : 1;
        this.changePanelDate(otherPanel, "Month", increment, false);
      }
    },
    handleRangePick(val, type) {
      if (this.rangeState.selecting || this.currentView === "time") {
        if (this.currentView === "time") {
          this.dates = val;
        } else {
          const [minDate, maxDate] = [this.rangeState.from, val].sort(dateSorter);
          this.dates = [minDate, maxDate];
          this.rangeState = {
            from: minDate,
            to: maxDate,
            selecting: false
          };
        }
        this.handleConfirm(false, type || "date");
      } else {
        this.rangeState = {
          from: val,
          to: null,
          selecting: true
        };
      }
    },
    handleChangeRange(val) {
      this.rangeState.to = val;
    }
  }
};
const _hoisted_1 = ["onClick"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_date_panel_label = resolveComponent("date-panel-label");
  const _component_time_picker = resolveComponent("time-picker");
  const _component_Confirm = resolveComponent("Confirm");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes),
    onMousedown: _cache[8] || (_cache[8] = withModifiers(() => {
    }, ["prevent"]))
  }, [
    _ctx.shortcuts.length ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass([$data.prefixCls + "-sidebar"])
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.shortcuts, (shortcut) => {
        return openBlock(), createElementBlock("div", {
          class: normalizeClass([$data.prefixCls + "-shortcut"]),
          key: shortcut.text,
          onClick: ($event) => _ctx.handleShortcutClick(shortcut)
        }, toDisplayString(shortcut.text), 11, _hoisted_1);
      }), 128))
    ], 2)) : createCommentVNode("", true),
    createElementVNode("div", {
      class: normalizeClass($options.panelBodyClasses)
    }, [
      withDirectives(createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-content", $data.prefixCls + "-content-left"])
      }, [
        withDirectives(createElementVNode("div", {
          class: normalizeClass([$data.datePrefixCls + "-header"])
        }, [
          createElementVNode("span", {
            class: normalizeClass(_ctx.iconBtnCls("prev", "-double")),
            onClick: _cache[0] || (_cache[0] = ($event) => $options.prevYear("left"))
          }, [
            createVNode(_component_Icon, { type: "ios-arrow-back" })
          ], 2),
          $data.leftPickerTable === "date-table" ? withDirectives((openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(_ctx.iconBtnCls("prev")),
            onClick: _cache[1] || (_cache[1] = ($event) => $options.prevMonth("left"))
          }, [
            createVNode(_component_Icon, { type: "ios-arrow-back" })
          ], 2)), [
            [vShow, $data.currentView === "date"]
          ]) : createCommentVNode("", true),
          createVNode(_component_date_panel_label, {
            "date-panel-label": $options.leftDatePanelLabel,
            "current-view": $options.leftDatePanelView,
            "date-prefix-cls": $data.datePrefixCls
          }, null, 8, ["date-panel-label", "current-view", "date-prefix-cls"]),
          $props.splitPanels || $data.leftPickerTable !== "date-table" ? (openBlock(), createElementBlock("span", {
            key: 1,
            class: normalizeClass(_ctx.iconBtnCls("next", "-double")),
            onClick: _cache[2] || (_cache[2] = ($event) => $options.nextYear("left"))
          }, [
            createVNode(_component_Icon, { type: "ios-arrow-forward" })
          ], 2)) : createCommentVNode("", true),
          $props.splitPanels && $data.leftPickerTable === "date-table" ? withDirectives((openBlock(), createElementBlock("span", {
            key: 2,
            class: normalizeClass(_ctx.iconBtnCls("next")),
            onClick: _cache[3] || (_cache[3] = ($event) => $options.nextMonth("left"))
          }, [
            createVNode(_component_Icon, { type: "ios-arrow-forward" })
          ], 2)), [
            [vShow, $data.currentView === "date"]
          ]) : createCommentVNode("", true)
        ], 2), [
          [vShow, $data.currentView !== "time"]
        ]),
        $data.currentView !== "time" ? (openBlock(), createBlock(resolveDynamicComponent($data.leftPickerTable), {
          key: 0,
          ref: "leftYearTable",
          "table-date": $data.leftPanelDate,
          "selection-mode": "range",
          "disabled-date": _ctx.disabledDate,
          "range-state": $data.rangeState,
          "show-week-numbers": _ctx.showWeekNumbers,
          "model-value": $options.preSelecting.left ? [$data.dates[0]] : $data.dates,
          "focused-date": _ctx.focusedDate,
          onOnChangeRange: $options.handleChangeRange,
          onOnPick: $options.panelPickerHandlers.left,
          onOnPickClick: _ctx.handlePickClick
        }, null, 40, ["table-date", "disabled-date", "range-state", "show-week-numbers", "model-value", "focused-date", "onOnChangeRange", "onOnPick", "onOnPickClick"])) : createCommentVNode("", true)
      ], 2), [
        [vShow, !_ctx.isTime]
      ]),
      withDirectives(createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-content", $data.prefixCls + "-content-right"])
      }, [
        withDirectives(createElementVNode("div", {
          class: normalizeClass([$data.datePrefixCls + "-header"])
        }, [
          $props.splitPanels || $data.rightPickerTable !== "date-table" ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(_ctx.iconBtnCls("prev", "-double")),
            onClick: _cache[4] || (_cache[4] = ($event) => $options.prevYear("right"))
          }, [
            createVNode(_component_Icon, { type: "ios-arrow-back" })
          ], 2)) : createCommentVNode("", true),
          $props.splitPanels && $data.rightPickerTable === "date-table" ? withDirectives((openBlock(), createElementBlock("span", {
            key: 1,
            class: normalizeClass(_ctx.iconBtnCls("prev")),
            onClick: _cache[5] || (_cache[5] = ($event) => $options.prevMonth("right"))
          }, [
            createVNode(_component_Icon, { type: "ios-arrow-back" })
          ], 2)), [
            [vShow, $data.currentView === "date"]
          ]) : createCommentVNode("", true),
          createVNode(_component_date_panel_label, {
            "date-panel-label": $options.rightDatePanelLabel,
            "current-view": $options.rightDatePanelView,
            "date-prefix-cls": $data.datePrefixCls
          }, null, 8, ["date-panel-label", "current-view", "date-prefix-cls"]),
          createElementVNode("span", {
            class: normalizeClass(_ctx.iconBtnCls("next", "-double")),
            onClick: _cache[6] || (_cache[6] = ($event) => $options.nextYear("right"))
          }, [
            createVNode(_component_Icon, { type: "ios-arrow-forward" })
          ], 2),
          $data.rightPickerTable === "date-table" ? withDirectives((openBlock(), createElementBlock("span", {
            key: 2,
            class: normalizeClass(_ctx.iconBtnCls("next")),
            onClick: _cache[7] || (_cache[7] = ($event) => $options.nextMonth("right"))
          }, [
            createVNode(_component_Icon, { type: "ios-arrow-forward" })
          ], 2)), [
            [vShow, $data.currentView === "date"]
          ]) : createCommentVNode("", true)
        ], 2), [
          [vShow, $data.currentView !== "time"]
        ]),
        $data.currentView !== "time" ? (openBlock(), createBlock(resolveDynamicComponent($data.rightPickerTable), {
          key: 0,
          ref: "rightYearTable",
          "table-date": $data.rightPanelDate,
          "selection-mode": "range",
          "range-state": $data.rangeState,
          "disabled-date": _ctx.disabledDate,
          "show-week-numbers": _ctx.showWeekNumbers,
          "model-value": $options.preSelecting.right ? [$data.dates[$data.dates.length - 1]] : $data.dates,
          "focused-date": _ctx.focusedDate,
          onOnChangeRange: $options.handleChangeRange,
          onOnPick: $options.panelPickerHandlers.right,
          onOnPickClick: _ctx.handlePickClick
        }, null, 40, ["table-date", "range-state", "disabled-date", "show-week-numbers", "model-value", "focused-date", "onOnChangeRange", "onOnPick", "onOnPickClick"])) : createCommentVNode("", true)
      ], 2), [
        [vShow, !_ctx.isTime]
      ]),
      withDirectives(createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-content"])
      }, [
        $data.currentView === "time" ? (openBlock(), createBlock(_component_time_picker, mergeProps({
          key: 0,
          ref: "timePicker",
          "model-value": $data.dates,
          format: _ctx.format,
          "time-disabled": $options.timeDisabled
        }, _ctx.timePickerOptions, {
          onOnPick: $options.handleRangePick,
          onOnPickClick: _ctx.handlePickClick,
          onOnPickClear: _ctx.handlePickClear,
          onOnPickSuccess: _ctx.handlePickSuccess,
          onOnPickToggleTime: _ctx.handleToggleTime
        }), null, 16, ["model-value", "format", "time-disabled", "onOnPick", "onOnPickClick", "onOnPickClear", "onOnPickSuccess", "onOnPickToggleTime"])) : createCommentVNode("", true)
      ], 2), [
        [vShow, _ctx.isTime]
      ]),
      _ctx.confirm ? (openBlock(), createBlock(_component_Confirm, {
        key: 0,
        "show-time": _ctx.showTime,
        "is-time": _ctx.isTime,
        "time-disabled": $options.timeDisabled,
        onOnPickToggleTime: _ctx.handleToggleTime,
        onOnPickClear: _ctx.handlePickClear,
        onOnPickSuccess: _ctx.handlePickSuccess
      }, null, 8, ["show-time", "is-time", "time-disabled", "onOnPickToggleTime", "onOnPickClear", "onOnPickSuccess"])) : createCommentVNode("", true)
    ], 2)
  ], 34);
}
var RangeDatePickerPanel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { RangeDatePickerPanel as default };
