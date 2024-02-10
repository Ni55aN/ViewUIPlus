import Picker from "../picker.js";
import DatePickerPanel from "../panel/Date/date.js";
import RangeDatePickerPanel from "../panel/Date/date-range.js";
import { oneOf } from "../../../utils/assist.js";
var DatePicker = {
  name: "CalendarPicker",
  mixins: [Picker],
  props: {
    type: {
      validator(value) {
        return oneOf(value, ["year", "month", "date", "daterange", "datetime", "datetimerange"]);
      },
      default: "date"
    }
  },
  components: { DatePickerPanel, RangeDatePickerPanel },
  computed: {
    panel() {
      const isRange = this.type === "daterange" || this.type === "datetimerange";
      return isRange ? "RangeDatePickerPanel" : "DatePickerPanel";
    },
    ownPickerProps() {
      return this.options;
    }
  }
};
export { DatePicker as default };
