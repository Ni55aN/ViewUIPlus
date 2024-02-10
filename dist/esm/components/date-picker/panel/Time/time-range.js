import TimeSpinner from "../../base/time-spinner.js";
import Confirm from "../../base/confirm.js";
import Options from "../../time-mixins.js";
import Mixin from "../panel-mixin.js";
import Locale from "../../../../mixins/locale.js";
import { initTimeDate, formatDateLabels } from "../../util.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, withModifiers, createElementVNode, Fragment, createTextVNode, toDisplayString, createVNode, createBlock, createCommentVNode } from "vue";
import _export_sfc from "../../../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-picker-panel";
const timePrefixCls = "ivu-time-picker";
const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
const _sfc_main = {
  name: "RangeTimePickerPanel",
  mixins: [Mixin, Locale, Options],
  components: { TimeSpinner, Confirm },
  emits: ["on-pick"],
  props: {
    steps: {
      type: Array,
      default: () => []
    },
    format: {
      type: String,
      default: "HH:mm:ss"
    },
    modelValue: {
      type: Array,
      required: true
    }
  },
  data() {
    const [dateStart, dateEnd] = this.modelValue.slice();
    return {
      prefixCls,
      timePrefixCls,
      showDate: false,
      dateStart: dateStart || initTimeDate(),
      dateEnd: dateEnd || initTimeDate()
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}-body-wrapper`,
        `${timePrefixCls}-with-range`,
        {
          [`${timePrefixCls}-with-seconds`]: this.showSeconds
        }
      ];
    },
    showSeconds() {
      return !!(this.format || "").match(/ss/);
    },
    leftDatePanelLabel() {
      return this.panelLabelConfig(this.date);
    },
    rightDatePanelLabel() {
      return this.panelLabelConfig(this.dateEnd);
    }
  },
  watch: {
    modelValue(dates) {
      const [dateStart, dateEnd] = dates.slice();
      this.dateStart = dateStart || initTimeDate();
      this.dateEnd = dateEnd || initTimeDate();
    }
  },
  methods: {
    panelLabelConfig(date) {
      const locale = this.t("i.locale");
      const datePanelLabel = this.t("i.datepicker.datePanelLabel");
      const { labels, separator } = formatDateLabels(locale, datePanelLabel, date || initTimeDate());
      return [labels[0].label, separator, labels[1].label].join("");
    },
    handleChange(start, end, emit = true) {
      const dateStart = new Date(this.dateStart);
      let dateEnd = new Date(this.dateEnd);
      Object.keys(start).forEach((type) => {
        dateStart[`set${capitalize(type)}`](start[type]);
      });
      Object.keys(end).forEach((type) => {
        dateEnd[`set${capitalize(type)}`](end[type]);
      });
      if (dateEnd < dateStart)
        dateEnd = dateStart;
      if (emit)
        this.$emit("on-pick", [dateStart, dateEnd], "time");
    },
    handleStartChange(date) {
      this.handleChange(date, {});
    },
    handleEndChange(date) {
      this.handleChange({}, date);
    },
    updateScroll() {
      this.$refs.timeSpinner.updateScroll();
      this.$refs.timeSpinnerEnd.updateScroll();
    }
  },
  mounted() {
    if (this.$parent && this.$parent.$options.name === "DatePicker")
      this.showDate = true;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_time_spinner = resolveComponent("time-spinner");
  const _component_Confirm = resolveComponent("Confirm");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes),
    onMousedown: _cache[0] || (_cache[0] = withModifiers(() => {
    }, ["prevent"]))
  }, [
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-body"])
    }, [
      createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-content", $data.prefixCls + "-content-left"])
      }, [
        createElementVNode("div", {
          class: normalizeClass([$data.timePrefixCls + "-header"])
        }, [
          $data.showDate ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createTextVNode(toDisplayString($options.leftDatePanelLabel), 1)
          ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createTextVNode(toDisplayString(_ctx.t("i.datepicker.startTime")), 1)
          ], 64))
        ], 2),
        createVNode(_component_time_spinner, {
          ref: "timeSpinner",
          steps: $props.steps,
          "show-seconds": $options.showSeconds,
          hours: $props.modelValue[0] && $data.dateStart.getHours(),
          minutes: $props.modelValue[0] && $data.dateStart.getMinutes(),
          seconds: $props.modelValue[0] && $data.dateStart.getSeconds(),
          "disabled-hours": _ctx.disabledHours,
          "disabled-minutes": _ctx.disabledMinutes,
          "disabled-seconds": _ctx.disabledSeconds,
          "hide-disabled-options": _ctx.hideDisabledOptions,
          onOnChange: $options.handleStartChange,
          onOnPickClick: _ctx.handlePickClick
        }, null, 8, ["steps", "show-seconds", "hours", "minutes", "seconds", "disabled-hours", "disabled-minutes", "disabled-seconds", "hide-disabled-options", "onOnChange", "onOnPickClick"])
      ], 2),
      createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-content", $data.prefixCls + "-content-right"])
      }, [
        createElementVNode("div", {
          class: normalizeClass([$data.timePrefixCls + "-header"])
        }, [
          $data.showDate ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createTextVNode(toDisplayString($options.rightDatePanelLabel), 1)
          ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createTextVNode(toDisplayString(_ctx.t("i.datepicker.endTime")), 1)
          ], 64))
        ], 2),
        createVNode(_component_time_spinner, {
          ref: "timeSpinnerEnd",
          steps: $props.steps,
          "show-seconds": $options.showSeconds,
          hours: $props.modelValue[1] && $data.dateEnd.getHours(),
          minutes: $props.modelValue[1] && $data.dateEnd.getMinutes(),
          seconds: $props.modelValue[1] && $data.dateEnd.getSeconds(),
          "disabled-hours": _ctx.disabledHours,
          "disabled-minutes": _ctx.disabledMinutes,
          "disabled-seconds": _ctx.disabledSeconds,
          "hide-disabled-options": _ctx.hideDisabledOptions,
          onOnChange: $options.handleEndChange,
          onOnPickClick: _ctx.handlePickClick
        }, null, 8, ["steps", "show-seconds", "hours", "minutes", "seconds", "disabled-hours", "disabled-minutes", "disabled-seconds", "hide-disabled-options", "onOnChange", "onOnPickClick"])
      ], 2),
      _ctx.confirm ? (openBlock(), createBlock(_component_Confirm, {
        key: 0,
        onOnPickClear: _ctx.handlePickClear,
        onOnPickSuccess: _ctx.handlePickSuccess
      }, null, 8, ["onOnPickClear", "onOnPickSuccess"])) : createCommentVNode("", true)
    ], 2)
  ], 34);
}
var RangeTimePickerPanel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { RangeTimePickerPanel as default };
