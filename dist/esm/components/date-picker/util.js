import fecha from "../../utils/date.js";
const toDate = function(date) {
  let _date = new Date(date);
  if (isNaN(_date.getTime()) && typeof date === "string") {
    _date = date.split("-").map(Number);
    _date[1] += 1;
    _date = new Date(..._date);
  }
  if (isNaN(_date.getTime()))
    return null;
  return _date;
};
const clearHours = function(time) {
  const cloneDate = new Date(time);
  cloneDate.setHours(0, 0, 0, 0);
  return cloneDate.getTime();
};
const isInRange = (time, a, b) => {
  if (!a || !b)
    return false;
  const [start, end] = [a, b].sort();
  return time >= start && time <= end;
};
const formatDate = function(date, format) {
  date = toDate(date);
  if (!date)
    return "";
  return fecha.format(date, format || "yyyy-MM-dd");
};
const parseDate = function(string, format) {
  return fecha.parse(string, format || "yyyy-MM-dd");
};
const getDayCountOfMonth = function(year, month) {
  return new Date(year, month + 1, 0).getDate();
};
const siblingMonth = function(src, diff) {
  const temp = new Date(src);
  const newMonth = temp.getMonth() + diff;
  const newMonthDayCount = getDayCountOfMonth(temp.getFullYear(), newMonth);
  if (newMonthDayCount < temp.getDate()) {
    temp.setDate(newMonthDayCount);
  }
  temp.setMonth(newMonth);
  return temp;
};
const initTimeDate = function() {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
};
const formatDateLabels = function() {
  const formats = {
    yyyy: (date) => date.getFullYear(),
    m: (date) => date.getMonth() + 1,
    mm: (date) => ("0" + (date.getMonth() + 1)).slice(-2),
    mmm: (date, locale) => {
      const monthName = date.toLocaleDateString(locale, {
        month: "long"
      });
      return monthName.slice(0, 3);
    },
    Mmm: (date, locale) => {
      const monthName = date.toLocaleDateString(locale, {
        month: "long"
      });
      return (monthName[0].toUpperCase() + monthName.slice(1).toLowerCase()).slice(0, 3);
    },
    mmmm: (date, locale) => date.toLocaleDateString(locale, {
      month: "long"
    }),
    Mmmm: (date, locale) => {
      const monthName = date.toLocaleDateString(locale, {
        month: "long"
      });
      return monthName[0].toUpperCase() + monthName.slice(1).toLowerCase();
    }
  };
  const formatRegex = new RegExp(["yyyy", "Mmmm", "mmmm", "Mmm", "mmm", "mm", "m"].join("|"), "g");
  return function(locale, format, date) {
    const componetsRegex = /(\[[^\]]+\])([^\[\]]+)(\[[^\]]+\])/;
    const components = format.match(componetsRegex).slice(1);
    const separator = components[1];
    const labels = [components[0], components[2]].map((component) => {
      const label = component.replace(/\[[^\]]+\]/, (str) => {
        return str.slice(1, -1).replace(formatRegex, (match) => formats[match](date, locale));
      });
      return {
        label,
        type: component.indexOf("yy") != -1 ? "year" : "month"
      };
    });
    return {
      separator,
      labels
    };
  };
}();
const DEFAULT_FORMATS = {
  date: "yyyy-MM-dd",
  month: "yyyy-MM",
  year: "yyyy",
  datetime: "yyyy-MM-dd HH:mm:ss",
  time: "HH:mm:ss",
  timerange: "HH:mm:ss",
  daterange: "yyyy-MM-dd",
  datetimerange: "yyyy-MM-dd HH:mm:ss"
};
const DATE_FORMATTER = function(value, format) {
  return formatDate(value, format);
};
const DATE_PARSER = function(text, format) {
  return parseDate(text, format);
};
const RANGE_FORMATTER = function(value, format, RANGE_SEPARATOR) {
  if (Array.isArray(value) && value.length === 2) {
    const start = value[0];
    const end = value[1];
    if (start && end) {
      return formatDate(start, format) + RANGE_SEPARATOR + formatDate(end, format);
    }
  } else if (!Array.isArray(value) && value instanceof Date) {
    return formatDate(value, format);
  }
  return "";
};
const RANGE_PARSER = function(text, format, RANGE_SEPARATOR) {
  const array = Array.isArray(text) ? text : text.split(RANGE_SEPARATOR);
  if (array.length === 2) {
    const range1 = array[0];
    const range2 = array[1];
    return [
      range1 instanceof Date ? range1 : parseDate(range1, format),
      range2 instanceof Date ? range2 : parseDate(range2, format)
    ];
  }
  return [];
};
const TYPE_VALUE_RESOLVER_MAP = {
  default: {
    formatter(value) {
      if (!value)
        return "";
      return "" + value;
    },
    parser(text) {
      if (text === void 0 || text === "")
        return null;
      return text;
    }
  },
  date: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  datetime: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  daterange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  datetimerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  timerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  time: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  month: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  year: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  multiple: {
    formatter: (value, format) => {
      return value.filter(Boolean).map((date) => formatDate(date, format)).join(",");
    },
    parser: (value, format) => {
      const values = typeof value === "string" ? value.split(",") : value;
      return values.map((value2) => {
        if (value2 instanceof Date)
          return value2;
        if (typeof value2 === "string")
          value2 = value2.trim();
        else if (typeof value2 !== "number" && !value2)
          value2 = "";
        return parseDate(value2, format);
      });
    }
  },
  number: {
    formatter(value) {
      if (!value)
        return "";
      return "" + value;
    },
    parser(text) {
      let result = Number(text);
      if (!isNaN(text)) {
        return result;
      } else {
        return null;
      }
    }
  }
};
export { DEFAULT_FORMATS, TYPE_VALUE_RESOLVER_MAP, clearHours, formatDate, formatDateLabels, getDayCountOfMonth, initTimeDate, isInRange, parseDate, siblingMonth, toDate };
