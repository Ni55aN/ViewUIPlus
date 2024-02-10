import { getCurrentInstance, nextTick, resolveComponent, resolveDirective, withDirectives, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createBlock, withCtx, createVNode, resolveDynamicComponent, mergeProps } from "vue";
import Input from "../input/input.js";
import Drop from "../select/dropdown.js";
import Icon from "../icon/icon.js";
import { directive } from "../../directives/v-click-outside-x.js";
import { oneOf } from "../../utils/assist.js";
import { getDayCountOfMonth, TYPE_VALUE_RESOLVER_MAP, DEFAULT_FORMATS } from "./util.js";
import mixinsForm from "../../mixins/form.js";
import globalConfig from "../../mixins/globalConfig.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-date-picker";
const pickerPrefixCls = "ivu-picker";
const isEmptyArray = (val) => val.reduce((isEmpty, str) => isEmpty && !str || typeof str === "string" && str.trim() === "", true);
const keyValueMapper = {
  40: "up",
  39: "right",
  38: "down",
  37: "left"
};
const mapPossibleValues = (key, horizontal, vertical) => {
  if (key === "left")
    return horizontal * -1;
  if (key === "right")
    return horizontal * 1;
  if (key === "up")
    return vertical * 1;
  if (key === "down")
    return vertical * -1;
};
const pulseElement = (el) => {
  const pulseClass = "ivu-date-picker-btn-pulse";
  el.classList.add(pulseClass);
  setTimeout(() => el.classList.remove(pulseClass), 200);
};
const extractTime = (date) => {
  if (!date)
    return [0, 0, 0];
  return [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ];
};
const _sfc_main = {
  mixins: [mixinsForm, globalConfig],
  components: { iInput: Input, Drop, Icon },
  directives: { clickOutside: directive },
  emits: ["on-clickoutside", "on-clear", "on-change", "on-ok", "on-open-change", "update:modelValue"],
  provide() {
    return {
      PickerInstance: this
    };
  },
  props: {
    format: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    confirm: {
      type: Boolean,
      default: false
    },
    open: {
      type: Boolean,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    timePickerOptions: {
      type: Object,
      default: () => ({})
    },
    splitPanels: {
      type: Boolean,
      default: false
    },
    showWeekNumbers: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: Date
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "large", "default"]);
      },
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.size === "" ? "default" : global.$VIEWUI.size;
      }
    },
    placeholder: {
      type: String,
      default: ""
    },
    placement: {
      validator(value) {
        return oneOf(value, ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]);
      },
      default: "bottom-start"
    },
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? false : global.$VIEWUI.transfer;
      }
    },
    name: {
      type: String
    },
    elementId: {
      type: String
    },
    steps: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: [Date, String, Array]
    },
    options: {
      type: Object,
      default: () => ({})
    },
    separator: {
      type: String,
      default: " - "
    },
    capture: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI ? true : global.$VIEWUI.capture;
      }
    },
    transferClassName: {
      type: String
    },
    eventsEnabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const isRange = this.type.includes("range");
    const emptyArray = isRange ? [null, null] : [null];
    const initialValue = isEmptyArray((isRange ? this.modelValue : [this.modelValue]) || []) ? emptyArray : this.parseDate(this.modelValue);
    const focusedTime = initialValue.map(extractTime);
    return {
      prefixCls,
      showClose: false,
      visible: false,
      internalValue: initialValue,
      disableClickOutSide: false,
      disableCloseUnderTransfer: false,
      selectionMode: this.onSelectionModeChange(this.type),
      forceInputRerender: 1,
      isFocused: false,
      focusedDate: initialValue[0] || this.startDate || new Date(),
      focusedTime: {
        column: 0,
        picker: 0,
        time: focusedTime,
        active: false
      },
      internalFocus: false,
      isValueNull: false,
      timeSpinnerList: [],
      panelTableList: []
    };
  },
  computed: {
    wrapperClasses() {
      return [prefixCls, {
        [prefixCls + "-focused"]: this.isFocused
      }];
    },
    publicVModelValue() {
      if (this.multiple) {
        return this.internalValue.slice();
      } else {
        const isRange = this.type.includes("range");
        let val = this.internalValue.map((date) => date instanceof Date ? new Date(date) : date || "");
        if (this.type.match(/^time/))
          val = val.map(this.formatDate);
        return isRange || this.multiple ? val : val[0];
      }
    },
    publicStringValue() {
      const { formatDate, publicVModelValue, type } = this;
      if (type.match(/^time/))
        return publicVModelValue;
      if (this.multiple)
        return formatDate(publicVModelValue);
      return Array.isArray(publicVModelValue) ? publicVModelValue.map(formatDate) : formatDate(publicVModelValue);
    },
    opened() {
      return this.open === null ? this.visible : this.open;
    },
    transition() {
      const bottomPlaced = this.placement.match(/^bottom/);
      return bottomPlaced ? "slide-up" : "slide-down";
    },
    visualValue() {
      return this.formatDate(this.internalValue);
    },
    isConfirm() {
      return this.confirm || this.type === "datetime" || this.type === "datetimerange" || this.multiple;
    },
    arrowType() {
      const config = this.globalConfig;
      let type = "";
      if (this.type === "time" || this.type === "timerange") {
        type = "ios-time-outline";
        if (config) {
          if (config.timePicker.customIcon) {
            type = "";
          } else if (config.timePicker.icon) {
            type = config.timePicker.icon;
          }
        }
      } else {
        const config2 = this.globalConfig;
        type = "ios-calendar-outline";
        if (config2) {
          if (config2.datePicker.customIcon) {
            type = "";
          } else if (config2.datePicker.icon) {
            type = config2.datePicker.icon;
          }
        }
      }
      if (this.showClose)
        type = "ios-close-circle";
      return type;
    },
    customArrowType() {
      const config = this.globalConfig;
      let type = "";
      if (!this.showClose) {
        if (this.type === "time" || this.type === "timerange") {
          if (config) {
            if (config.timePicker.customIcon) {
              type = config.timePicker.customIcon;
            }
          }
        } else {
          if (config) {
            if (config.datePicker.customIcon) {
              type = config.datePicker.customIcon;
            }
          }
        }
      }
      return type;
    },
    arrowSize() {
      const config = this.globalConfig;
      let size = "";
      if (!this.showClose) {
        if (this.type === "time" || this.type === "timerange") {
          if (config) {
            if (config.timePicker.iconSize) {
              size = config.timePicker.iconSize;
            }
          }
        } else {
          if (config) {
            if (config.datePicker.iconSize) {
              size = config.datePicker.iconSize;
            }
          }
        }
      }
      return size;
    },
    dropdownCls() {
      return {
        [prefixCls + "-transfer"]: this.transfer,
        [this.transferClassName]: this.transferClassName
      };
    }
  },
  methods: {
    onSelectionModeChange(type) {
      if (type.match(/^date/))
        type = "date";
      this.selectionMode = oneOf(type, ["year", "month", "date", "time"]) && type;
      return this.selectionMode;
    },
    handleTransferClick() {
      if (this.transfer)
        this.disableCloseUnderTransfer = true;
    },
    handleClose(e) {
      if (this.disableCloseUnderTransfer) {
        this.disableCloseUnderTransfer = false;
        return false;
      }
      if (e && e.type === "mousedown" && this.visible) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (this.visible) {
        const pickerPanel = this.$refs.pickerPanel && this.$refs.pickerPanel.$el;
        if (e && pickerPanel && pickerPanel.contains(e.target))
          return;
        this.visible = false;
        e && e.preventDefault();
        e && e.stopPropagation();
        this.$emit("on-clickoutside", e);
        return;
      }
      this.isFocused = false;
      this.disableClickOutSide = false;
    },
    handleFocus(e) {
      if (this.readonly)
        return;
      this.isFocused = true;
      if (e && e.type === "focus")
        return;
      if (!this.itemDisabled) {
        this.visible = true;
      }
    },
    handleBlur(e) {
      if (this.internalFocus) {
        this.internalFocus = false;
        return;
      }
      if (this.visible) {
        e.preventDefault();
        return;
      }
      this.isFocused = false;
      this.onSelectionModeChange(this.type);
      this.internalValue = this.internalValue.slice();
      this.reset();
      this.$refs.pickerPanel.onToggleVisibility(false);
    },
    handleKeydown(e) {
      const keyCode = e.keyCode;
      if (keyCode === 9) {
        if (this.visible) {
          e.stopPropagation();
          e.preventDefault();
          if (this.isConfirm) {
            const selector = `.${pickerPrefixCls}-confirm > *`;
            const tabbable = this.$refs.drop.$el.querySelectorAll(selector);
            this.internalFocus = true;
            const element = [...tabbable][e.shiftKey ? "pop" : "shift"]();
            element.focus();
          } else {
            this.handleClose();
          }
        } else {
          this.focused = false;
        }
      }
      const arrows = [37, 38, 39, 40];
      if (!this.visible && arrows.includes(keyCode)) {
        this.visible = true;
        return;
      }
      if (keyCode === 27) {
        if (this.visible) {
          e.stopPropagation();
          this.handleClose();
        }
      }
      if (keyCode === 13) {
        const timePickers = this.timeSpinnerList.map((item) => item.timeSpinner);
        if (timePickers.length > 0) {
          const columnsPerPicker = timePickers[0].showSeconds ? 3 : 2;
          const pickerIndex = Math.floor(this.focusedTime.column / columnsPerPicker);
          const value = this.focusedTime.time[pickerIndex];
          timePickers[pickerIndex].chooseValue(value);
          return;
        }
        if (this.type.match(/range/)) {
          this.$refs.pickerPanel.handleRangePick(this.focusedDate, "date");
        } else {
          const panels = this.panelTableList.map((item) => item.panelTable);
          const compareDate = (d) => {
            const sliceIndex = ["year", "month", "date"].indexOf(this.type) + 1;
            return [d.getFullYear(), d.getMonth(), d.getDate()].slice(0, sliceIndex).join("-");
          };
          const dateIsValid = panels.find(({ cells }) => {
            return cells.find(({ date, disabled }) => compareDate(date) === compareDate(this.focusedDate) && !disabled);
          });
          if (dateIsValid)
            this.onPick(this.focusedDate, false, "date");
        }
      }
      if (!arrows.includes(keyCode))
        return;
      if (this.focusedTime.active)
        e.preventDefault();
      this.navigateDatePanel(keyValueMapper[keyCode], e.shiftKey);
    },
    reset() {
      this.$refs.pickerPanel.reset && this.$refs.pickerPanel.reset();
    },
    navigateTimePanel(direction) {
      this.focusedTime.active = true;
      const horizontal = direction.match(/left|right/);
      const vertical = direction.match(/up|down/);
      const timePickers = this.timeSpinnerList.map((item) => item.timeSpinner);
      const maxNrOfColumns = (timePickers[0].showSeconds ? 3 : 2) * timePickers.length;
      const column = ((currentColumn) => {
        const incremented = currentColumn + (horizontal ? direction === "left" ? -1 : 1 : 0);
        return (incremented + maxNrOfColumns) % maxNrOfColumns;
      })(this.focusedTime.column);
      const columnsPerPicker = maxNrOfColumns / timePickers.length;
      const pickerIndex = Math.floor(column / columnsPerPicker);
      const col = column % columnsPerPicker;
      if (horizontal) {
        const time = this.internalValue.map(extractTime);
        this.focusedTime = {
          ...this.focusedTime,
          column,
          time
        };
        timePickers.forEach((instance, i) => {
          if (i === pickerIndex)
            instance.updateFocusedTime(col, time[pickerIndex]);
          else
            instance.updateFocusedTime(-1, instance.focusedTime);
        });
      }
      if (vertical) {
        const increment = direction === "up" ? 1 : -1;
        const timeParts = ["hours", "minutes", "seconds"];
        const pickerPossibleValues = timePickers[pickerIndex][`${timeParts[col]}List`];
        const currentIndex = pickerPossibleValues.findIndex(({ text }) => this.focusedTime.time[pickerIndex][col] === text);
        const nextIndex = (currentIndex + increment + pickerPossibleValues.length) % pickerPossibleValues.length;
        const nextValue = pickerPossibleValues[nextIndex].text;
        const times = this.focusedTime.time.map((time, i) => {
          if (i !== pickerIndex)
            return time;
          time[col] = nextValue;
          return time;
        });
        this.focusedTime = {
          ...this.focusedTime,
          time: times
        };
        timePickers.forEach((instance, i) => {
          if (i === pickerIndex)
            instance.updateFocusedTime(col, times[i]);
          else
            instance.updateFocusedTime(-1, instance.focusedTime);
        });
      }
    },
    navigateDatePanel(direction, shift) {
      const timePickers = this.timeSpinnerList.map((item) => item.timeSpinner);
      if (timePickers.length > 0) {
        this.navigateTimePanel(direction, shift, timePickers);
        return;
      }
      if (shift) {
        if (this.type === "year") {
          this.focusedDate = new Date(
            this.focusedDate.getFullYear() + mapPossibleValues(direction, 0, 10),
            this.focusedDate.getMonth(),
            this.focusedDate.getDate()
          );
        } else {
          this.focusedDate = new Date(
            this.focusedDate.getFullYear() + mapPossibleValues(direction, 0, 1),
            this.focusedDate.getMonth() + mapPossibleValues(direction, 1, 0),
            this.focusedDate.getDate()
          );
        }
        const position = direction.match(/left|down/) ? "prev" : "next";
        const double = direction.match(/up|down/) ? "-double" : "";
        const button = this.$refs.drop.$el.querySelector(`.ivu-date-picker-${position}-btn-arrow${double}`);
        if (button)
          pulseElement(button);
        return;
      }
      const initialDate = this.focusedDate || this.internalValue && this.internalValue[0] || new Date();
      const focusedDate = new Date(initialDate);
      if (this.type.match(/^date/)) {
        const lastOfMonth = getDayCountOfMonth(initialDate.getFullYear(), initialDate.getMonth());
        const startDay = initialDate.getDate();
        const nextDay = focusedDate.getDate() + mapPossibleValues(direction, 1, 7);
        if (nextDay < 1) {
          if (direction.match(/left|right/)) {
            focusedDate.setMonth(focusedDate.getMonth() + 1);
            focusedDate.setDate(nextDay);
          } else {
            focusedDate.setDate(startDay + Math.floor((lastOfMonth - startDay) / 7) * 7);
          }
        } else if (nextDay > lastOfMonth) {
          if (direction.match(/left|right/)) {
            focusedDate.setMonth(focusedDate.getMonth() - 1);
            focusedDate.setDate(nextDay);
          } else {
            focusedDate.setDate(startDay % 7);
          }
        } else {
          focusedDate.setDate(nextDay);
        }
      }
      if (this.type.match(/^month/)) {
        focusedDate.setMonth(focusedDate.getMonth() + mapPossibleValues(direction, 1, 3));
      }
      if (this.type.match(/^year/)) {
        focusedDate.setFullYear(focusedDate.getFullYear() + mapPossibleValues(direction, 1, 3));
      }
      this.focusedDate = focusedDate;
    },
    handleInputChange(event) {
      const isArrayValue = this.type.includes("range") || this.multiple;
      const oldValue = this.visualValue;
      const newValue = event.target.value;
      const newDate = this.parseDate(newValue);
      const disabledDateFn = this.options && typeof this.options.disabledDate === "function" && this.options.disabledDate;
      const valueToTest = isArrayValue ? newDate : newDate[0];
      const isDisabled = disabledDateFn && disabledDateFn(valueToTest);
      const isValidDate = newDate.reduce((valid, date) => valid && date instanceof Date, true);
      if (newValue !== oldValue && !isDisabled && isValidDate) {
        this.emitChange(this.type);
        this.internalValue = newDate;
      } else {
        this.forceInputRerender++;
      }
    },
    handleInputMouseenter() {
      if (this.readonly || this.itemDisabled)
        return;
      if (this.visualValue && this.clearable) {
        this.showClose = true;
      }
    },
    handleInputMouseleave() {
      this.showClose = false;
    },
    handleIconClick(e) {
      if (this.showClose) {
        if (e)
          e.stopPropagation();
        this.handleClear();
      } else if (!this.itemDisabled) {
        this.handleFocus();
      }
    },
    handleClear() {
      this.visible = false;
      this.internalValue = this.internalValue.map(() => null);
      this.$emit("on-clear");
      this.handleFormItemChange("change", "");
      this.emitChange(this.type);
      this.reset();
      setTimeout(
        () => this.onSelectionModeChange(this.type),
        500
      );
    },
    emitChange(type) {
      nextTick(() => {
        this.$emit("on-change", this.publicStringValue, type);
        this.handleFormItemChange("change", this.publicStringValue);
      });
    },
    parseDate(val) {
      const isRange = this.type.includes("range");
      const type = this.type;
      const parser = (TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP["default"]).parser;
      const format = this.format || DEFAULT_FORMATS[type];
      const multipleParser = TYPE_VALUE_RESOLVER_MAP["multiple"].parser;
      if (val && type === "time" && !(val instanceof Date)) {
        val = parser(val, format, this.separator);
      } else if (this.multiple && val) {
        val = multipleParser(val, format, this.separator);
      } else if (isRange) {
        if (!val) {
          val = [null, null];
        } else {
          if (typeof val === "string") {
            val = parser(val, format, this.separator);
          } else if (type === "timerange") {
            val = parser(val, format, this.separator).map((v) => v || "");
          } else {
            const [start, end] = val;
            if (start instanceof Date && end instanceof Date) {
              val = val.map((date) => new Date(date));
            } else if (typeof start === "string" && typeof end === "string") {
              val = parser(val.join(this.separator), format, this.separator);
            } else if (!start || !end) {
              val = [null, null];
            }
          }
        }
      } else if (typeof val === "string" && type.indexOf("time") !== 0) {
        val = parser(val, format) || null;
      }
      return isRange || this.multiple ? val || [] : [val];
    },
    formatDate(value) {
      const format = DEFAULT_FORMATS[this.type];
      if (this.multiple) {
        const formatter = TYPE_VALUE_RESOLVER_MAP.multiple.formatter;
        return formatter(value, this.format || format, this.separator);
      } else {
        const { formatter } = TYPE_VALUE_RESOLVER_MAP[this.type] || TYPE_VALUE_RESOLVER_MAP["default"];
        return formatter(value, this.format || format, this.separator);
      }
    },
    onPick(dates, visible = false, type) {
      if (this.multiple) {
        const pickedTimeStamp = dates.getTime();
        const indexOfPickedDate = this.internalValue.findIndex((date) => date && date.getTime() === pickedTimeStamp);
        const allDates = [...this.internalValue, dates].filter(Boolean);
        const timeStamps = allDates.map((date) => date.getTime()).filter((ts, i, arr) => arr.indexOf(ts) === i && i !== indexOfPickedDate);
        this.internalValue = timeStamps.map((ts) => new Date(ts));
      } else {
        dates = this.parseDate(dates);
        this.internalValue = Array.isArray(dates) ? dates : [dates];
      }
      if (this.internalValue[0])
        this.focusedDate = this.internalValue[0];
      this.focusedTime = {
        ...this.focusedTime,
        time: this.internalValue.map(extractTime)
      };
      if (!this.isConfirm)
        this.onSelectionModeChange(this.type);
      if (!this.isConfirm)
        this.visible = !!visible;
      this.emitChange(type);
    },
    onPickSuccess() {
      this.visible = false;
      this.$emit("on-ok");
      this.focus();
      this.reset();
    },
    focus() {
      this.$refs.input && this.$refs.input.focus();
    },
    updatePopper() {
      this.$refs.drop.update();
    },
    handleOnFocusInput() {
      this.focus();
    },
    handleOnUpdatePopper() {
      this.updatePopper();
    }
  },
  watch: {
    visible(state) {
      if (state === false) {
        this.$refs.drop.destroy();
      }
      if (state)
        this.$refs.drop.update();
      this.$emit("on-open-change", state);
    },
    modelValue(val) {
      if (val === null)
        this.isValueNull = true;
      this.internalValue = this.parseDate(val);
    },
    open(val) {
      this.visible = val === true;
    },
    type(type) {
      this.onSelectionModeChange(type);
    },
    publicVModelValue(now, before) {
      const newValue = JSON.stringify(now);
      const oldValue = JSON.stringify(before);
      const shouldEmitInput = newValue !== oldValue || typeof now !== typeof before;
      if (shouldEmitInput) {
        if (this.isValueNull) {
          this.isValueNull = false;
          this.$emit("update:modelValue", null);
        } else {
          this.$emit("update:modelValue", now);
        }
      }
    }
  },
  mounted() {
    if (this.open !== null)
      this.visible = this.open;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_i_input = resolveComponent("i-input");
  const _component_Drop = resolveComponent("Drop");
  const _directive_click_outside = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("div", {
    class: normalizeClass($options.wrapperClasses)
  }, [
    createElementVNode("div", {
      ref: "reference",
      class: normalizeClass([$data.prefixCls + "-rel"])
    }, [
      renderSlot(_ctx.$slots, "default", {}, () => [
        (openBlock(), createBlock(_component_i_input, {
          key: $data.forceInputRerender,
          "element-id": $props.elementId,
          class: normalizeClass([$data.prefixCls + "-editor"]),
          readonly: !$props.editable || $props.readonly,
          disabled: _ctx.itemDisabled,
          size: $props.size,
          placeholder: $props.placeholder,
          "model-value": $options.visualValue,
          name: $props.name,
          ref: "input",
          onOnInputChange: $options.handleInputChange,
          onOnFocus: $options.handleFocus,
          onOnBlur: $options.handleBlur,
          onClick: $options.handleFocus,
          onKeydown: $options.handleKeydown,
          onMouseenter: $options.handleInputMouseenter,
          onMouseleave: $options.handleInputMouseleave
        }, {
          suffix: withCtx(() => [
            createVNode(_component_Icon, {
              onClick: $options.handleIconClick,
              type: $options.arrowType,
              custom: $options.customArrowType,
              size: $options.arrowSize
            }, null, 8, ["onClick", "type", "custom", "size"])
          ]),
          _: 1
        }, 8, ["element-id", "class", "readonly", "disabled", "size", "placeholder", "model-value", "name", "onOnInputChange", "onOnFocus", "onOnBlur", "onClick", "onKeydown", "onMouseenter", "onMouseleave"]))
      ])
    ], 2),
    createVNode(_component_Drop, {
      ref: "drop",
      visible: $options.opened,
      classes: $options.dropdownCls,
      placement: $props.placement,
      eventsEnabled: $props.eventsEnabled,
      transfer: $props.transfer,
      "transition-name": "transition-drop",
      onClick: $options.handleTransferClick
    }, {
      default: withCtx(() => [
        createElementVNode("div", null, [
          (openBlock(), createBlock(resolveDynamicComponent(_ctx.panel), mergeProps({
            ref: "pickerPanel",
            visible: $data.visible,
            showTime: _ctx.type === "datetime" || _ctx.type === "datetimerange",
            confirm: $options.isConfirm,
            selectionMode: $data.selectionMode,
            steps: $props.steps,
            format: $props.format,
            "model-value": $data.internalValue,
            "start-date": $props.startDate,
            "split-panels": $props.splitPanels,
            "show-week-numbers": $props.showWeekNumbers,
            "picker-type": _ctx.type,
            multiple: $props.multiple,
            "focused-date": $data.focusedDate,
            "time-picker-options": $props.timePickerOptions
          }, _ctx.ownPickerProps, {
            onOnPick: $options.onPick,
            onOnPickClear: $options.handleClear,
            onOnPickSuccess: $options.onPickSuccess,
            onOnPickClick: _cache[0] || (_cache[0] = ($event) => $data.disableClickOutSide = true),
            onOnSelectionModeChange: $options.onSelectionModeChange
          }), null, 16, ["visible", "showTime", "confirm", "selectionMode", "steps", "format", "model-value", "start-date", "split-panels", "show-week-numbers", "picker-type", "multiple", "focused-date", "time-picker-options", "onOnPick", "onOnPickClear", "onOnPickSuccess", "onOnSelectionModeChange"]))
        ])
      ]),
      _: 1
    }, 8, ["visible", "classes", "placement", "eventsEnabled", "transfer", "onClick"])
  ], 2)), [
    [
      _directive_click_outside,
      $options.handleClose,
      $props.capture,
      { mousedown: true }
    ],
    [
      _directive_click_outside,
      $options.handleClose,
      $props.capture,
      { touchstart: true }
    ],
    [_directive_click_outside, $options.handleClose, $props.capture]
  ]);
}
var Picker = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Picker as default };
