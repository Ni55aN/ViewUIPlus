import TimeSpinner from "../../base/time-spinner.js";
import Confirm from "../../base/confirm.js";
import Options from "../../time-mixins.js";
import Mixin from "../panel-mixin.js";
import Locale from "../../../../mixins/locale.js";
import { initTimeDate } from "../../util.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, withModifiers, createElementVNode, toDisplayString, createCommentVNode, createVNode, createBlock } from "vue";
import _export_sfc from "../../../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-picker-panel";
const timePrefixCls = "ivu-time-picker";
const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
const mergeDateHMS = (date, hours, minutes, seconds) => {
  const newDate = new Date(date.getTime());
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  newDate.setSeconds(seconds);
  return newDate;
};
const unique = (el, i, arr) => arr.indexOf(el) === i;
const returnFalse = () => false;
const _sfc_main = {
  name: "TimePickerPanel",
  mixins: [Mixin, Locale, Options],
  components: { TimeSpinner, Confirm },
  emits: ["on-pick"],
  props: {
    disabledDate: {
      type: Function,
      default: returnFalse
    },
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
    return {
      prefixCls,
      timePrefixCls,
      date: this.modelValue[0] || initTimeDate(),
      showDate: false
    };
  },
  computed: {
    showSeconds() {
      return !!(this.format || "").match(/ss/);
    },
    visibleDate() {
      const date = this.date;
      const month = date.getMonth() + 1;
      const tYear = this.t("i.datepicker.year");
      const tMonth = this.t(`i.datepicker.month${month}`);
      return `${date.getFullYear()}${tYear} ${tMonth}`;
    },
    timeSlots() {
      if (!this.modelValue[0])
        return [];
      return ["getHours", "getMinutes", "getSeconds"].map((slot) => this.date[slot]());
    },
    disabledHMS() {
      const disabledTypes = ["disabledHours", "disabledMinutes", "disabledSeconds"];
      if (this.disabledDate === returnFalse || !this.modelValue[0]) {
        const disabled = disabledTypes.reduce(
          (obj, type) => (obj[type] = this[type], obj),
          {}
        );
        return disabled;
      } else {
        const slots = [24, 60, 60];
        const disabled = ["Hours", "Minutes", "Seconds"].map((type) => this[`disabled${type}`]);
        const disabledHMS = disabled.map((preDisabled, j) => {
          const slot = slots[j];
          const toDisable = preDisabled;
          for (let i = 0; i < slot; i += this.steps[j] || 1) {
            const hms = this.timeSlots.map((slot2, x) => x === j ? i : slot2);
            const testDateTime = mergeDateHMS(this.date, ...hms);
            if (this.disabledDate(testDateTime, true))
              toDisable.push(i);
          }
          return toDisable.filter(unique);
        });
        return disabledTypes.reduce(
          (obj, type, i) => (obj[type] = disabledHMS[i], obj),
          {}
        );
      }
    }
  },
  watch: {
    modelValue(dates) {
      let newVal = dates[0] || initTimeDate();
      newVal = new Date(newVal);
      this.date = newVal;
    }
  },
  methods: {
    handleChange(date, emit = true) {
      const newDate = new Date(this.date);
      Object.keys(date).forEach(
        (type) => newDate[`set${capitalize(type)}`](date[type])
      );
      if (emit)
        this.$emit("on-pick", newDate, "time");
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
    class: normalizeClass([$data.prefixCls + "-body-wrapper"]),
    onMousedown: _cache[0] || (_cache[0] = withModifiers(() => {
    }, ["prevent"]))
  }, [
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-body"])
    }, [
      $data.showDate ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass([$data.timePrefixCls + "-header"])
      }, toDisplayString($options.visibleDate), 3)) : createCommentVNode("", true),
      createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-content"])
      }, [
        createVNode(_component_time_spinner, {
          ref: "timeSpinner",
          "show-seconds": $options.showSeconds,
          steps: $props.steps,
          hours: $options.timeSlots[0],
          minutes: $options.timeSlots[1],
          seconds: $options.timeSlots[2],
          "disabled-hours": $options.disabledHMS.disabledHours,
          "disabled-minutes": $options.disabledHMS.disabledMinutes,
          "disabled-seconds": $options.disabledHMS.disabledSeconds,
          "hide-disabled-options": _ctx.hideDisabledOptions,
          onOnChange: $options.handleChange,
          onOnPickClick: _ctx.handlePickClick
        }, null, 8, ["show-seconds", "steps", "hours", "minutes", "seconds", "disabled-hours", "disabled-minutes", "disabled-seconds", "hide-disabled-options", "onOnChange", "onOnPickClick"])
      ], 2),
      _ctx.confirm ? (openBlock(), createBlock(_component_Confirm, {
        key: 1,
        onOnPickClear: _ctx.handlePickClear,
        onOnPickSuccess: _ctx.handlePickSuccess
      }, null, 8, ["onOnPickClear", "onOnPickSuccess"])) : createCommentVNode("", true)
    ], 2)
  ], 34);
}
var TimePickerPanel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TimePickerPanel as default };
