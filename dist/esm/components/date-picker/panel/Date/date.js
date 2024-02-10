import { nextTick, resolveComponent, openBlock, createElementBlock, normalizeClass, withModifiers, Fragment, renderList, toDisplayString, createCommentVNode, createElementVNode, withDirectives, createVNode, vShow, createBlock, resolveDynamicComponent, mergeProps } from "vue";
import Icon from "../../../icon/icon.js";
import DateTable from "../../base/date-table.js";
import YearTable from "../../base/year-table.js";
import MonthTable from "../../base/month-table.js";
import TimePickerPanel from "../Time/time.js";
import Confirm from "../../base/confirm.js";
import datePanelLabel from "./date-panel-label.js";
import Mixin from "../panel-mixin.js";
import DateMixin from "./date-panel-mixin.js";
import Locale from "../../../../mixins/locale.js";
import { formatDateLabels, siblingMonth } from "../../util.js";
import _export_sfc from "../../../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-picker-panel";
const datePrefixCls = "ivu-date-picker";
const _sfc_main = {
  name: "DatePickerPanel",
  mixins: [Mixin, Locale, DateMixin],
  components: { Icon, DateTable, YearTable, MonthTable, TimePicker: TimePickerPanel, Confirm, datePanelLabel },
  emits: ["on-selection-mode-change", "on-pick"],
  props: {
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const { selectionMode, modelValue } = this;
    const dates = modelValue.slice().sort();
    return {
      prefixCls,
      datePrefixCls,
      currentView: selectionMode || "date",
      pickerTable: this.getTableType(selectionMode),
      dates,
      panelDate: this.startDate || dates[0] || new Date()
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}-body-wrapper`,
        {
          [`${prefixCls}-with-sidebar`]: this.shortcuts.length
        }
      ];
    },
    panelPickerHandlers() {
      return this.pickerTable === `${this.currentView}-table` ? this.handlePick : this.handlePreSelection;
    },
    datePanelLabel() {
      const locale = this.t("i.locale");
      const datePanelLabel2 = this.t("i.datepicker.datePanelLabel");
      const date = this.panelDate;
      const { labels, separator } = formatDateLabels(locale, datePanelLabel2, date);
      const handler = (type) => {
        return () => this.pickerTable = this.getTableType(type);
      };
      return {
        separator,
        labels: labels.map((obj) => (obj.handler = handler(obj.type), obj))
      };
    },
    timeDisabled() {
      return !this.dates[0];
    }
  },
  watch: {
    modelValue(newVal) {
      this.dates = newVal;
      const panelDate = this.multiple ? this.dates[this.dates.length - 1] : this.startDate || this.dates[0];
      this.panelDate = panelDate || new Date();
    },
    currentView(currentView) {
      this.$emit("on-selection-mode-change", currentView);
      if (this.currentView === "time") {
        nextTick(() => {
          const spinner = this.$refs.timePicker.$refs.timeSpinner;
          spinner.updateScroll();
        });
      }
    },
    selectionMode(type) {
      this.currentView = type;
      this.pickerTable = this.getTableType(type);
    },
    focusedDate(date) {
      const isDifferentYear = date.getFullYear() !== this.panelDate.getFullYear();
      const isDifferentMonth = isDifferentYear || date.getMonth() !== this.panelDate.getMonth();
      if (isDifferentYear || isDifferentMonth) {
        if (!this.multiple)
          this.panelDate = date;
      }
    }
  },
  methods: {
    reset() {
      this.currentView = this.selectionMode;
      this.pickerTable = this.getTableType(this.currentView);
    },
    changeYear(dir) {
      if (this.selectionMode === "year" || this.pickerTable === "year-table") {
        this.panelDate = new Date(this.panelDate.getFullYear() + dir * 10, 0, 1);
      } else {
        this.panelDate = siblingMonth(this.panelDate, dir * 12);
      }
    },
    getTableType(currentView) {
      return currentView.match(/^time/) ? "time-picker" : `${currentView}-table`;
    },
    changeMonth(dir) {
      this.panelDate = siblingMonth(this.panelDate, dir);
    },
    handlePreSelection(value) {
      this.panelDate = value;
      if (this.pickerTable === "year-table")
        this.pickerTable = "month-table";
      else
        this.pickerTable = this.getTableType(this.currentView);
    },
    handlePick(value, type) {
      const { selectionMode, panelDate } = this;
      if (selectionMode === "year")
        value = new Date(value.getFullYear(), 0, 1);
      else if (selectionMode === "month")
        value = new Date(panelDate.getFullYear(), value.getMonth(), 1);
      else
        value = new Date(value);
      this.dates = [value];
      this.$emit("on-pick", value, false, type || selectionMode);
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
    onMousedown: _cache[4] || (_cache[4] = withModifiers(() => {
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
      class: normalizeClass([$data.prefixCls + "-body"])
    }, [
      withDirectives(createElementVNode("div", {
        class: normalizeClass([$data.datePrefixCls + "-header"])
      }, [
        createElementVNode("span", {
          class: normalizeClass(_ctx.iconBtnCls("prev", "-double")),
          onClick: _cache[0] || (_cache[0] = ($event) => $options.changeYear(-1))
        }, [
          createVNode(_component_Icon, { type: "ios-arrow-back" })
        ], 2),
        $data.pickerTable === "date-table" ? withDirectives((openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(_ctx.iconBtnCls("prev")),
          onClick: _cache[1] || (_cache[1] = ($event) => $options.changeMonth(-1))
        }, [
          createVNode(_component_Icon, { type: "ios-arrow-back" })
        ], 2)), [
          [vShow, $data.currentView === "date"]
        ]) : createCommentVNode("", true),
        createVNode(_component_date_panel_label, {
          "date-panel-label": $options.datePanelLabel,
          "current-view": $data.pickerTable.split("-").shift(),
          "date-prefix-cls": $data.datePrefixCls
        }, null, 8, ["date-panel-label", "current-view", "date-prefix-cls"]),
        createElementVNode("span", {
          class: normalizeClass(_ctx.iconBtnCls("next", "-double")),
          onClick: _cache[2] || (_cache[2] = ($event) => $options.changeYear(1))
        }, [
          createVNode(_component_Icon, { type: "ios-arrow-forward" })
        ], 2),
        $data.pickerTable === "date-table" ? withDirectives((openBlock(), createElementBlock("span", {
          key: 1,
          class: normalizeClass(_ctx.iconBtnCls("next")),
          onClick: _cache[3] || (_cache[3] = ($event) => $options.changeMonth(1))
        }, [
          createVNode(_component_Icon, { type: "ios-arrow-forward" })
        ], 2)), [
          [vShow, $data.currentView === "date"]
        ]) : createCommentVNode("", true)
      ], 2), [
        [vShow, $data.currentView !== "time"]
      ]),
      createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-content"])
      }, [
        $data.currentView !== "time" ? (openBlock(), createBlock(resolveDynamicComponent($data.pickerTable), {
          key: 0,
          ref: "pickerTable",
          "table-date": $data.panelDate,
          "show-week-numbers": _ctx.showWeekNumbers,
          "model-value": $data.dates,
          "selection-mode": _ctx.selectionMode,
          "disabled-date": _ctx.disabledDate,
          "focused-date": _ctx.focusedDate,
          onOnPick: $options.panelPickerHandlers,
          onOnPickClick: _ctx.handlePickClick
        }, null, 40, ["table-date", "show-week-numbers", "model-value", "selection-mode", "disabled-date", "focused-date", "onOnPick", "onOnPickClick"])) : createCommentVNode("", true)
      ], 2),
      withDirectives(createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-content"])
      }, [
        $data.currentView === "time" ? (openBlock(), createBlock(_component_time_picker, mergeProps({
          key: 0,
          ref: "timePicker",
          "model-value": $data.dates,
          format: _ctx.format,
          "time-disabled": $options.timeDisabled,
          "disabled-date": _ctx.disabledDate,
          "focused-date": _ctx.focusedDate
        }, _ctx.timePickerOptions, {
          onOnPick: $options.handlePick,
          onOnPickClick: _ctx.handlePickClick,
          onOnPickClear: _ctx.handlePickClear,
          onOnPickSuccess: _ctx.handlePickSuccess,
          onOnPickToggleTime: _ctx.handleToggleTime
        }), null, 16, ["model-value", "format", "time-disabled", "disabled-date", "focused-date", "onOnPick", "onOnPickClick", "onOnPickClear", "onOnPickSuccess", "onOnPickToggleTime"])) : createCommentVNode("", true)
      ], 2), [
        [vShow, _ctx.isTime]
      ]),
      _ctx.confirm ? (openBlock(), createBlock(_component_Confirm, {
        key: 0,
        "show-time": _ctx.showTime,
        "is-time": _ctx.isTime,
        onOnPickToggleTime: _ctx.handleToggleTime,
        onOnPickClear: _ctx.handlePickClear,
        onOnPickSuccess: _ctx.handlePickSuccess
      }, null, 8, ["show-time", "is-time", "onOnPickToggleTime", "onOnPickClear", "onOnPickSuccess"])) : createCommentVNode("", true)
    ], 2)
  ], 34);
}
var DatePickerPanel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { DatePickerPanel as default };
