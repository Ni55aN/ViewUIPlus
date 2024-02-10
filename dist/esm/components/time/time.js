import { oneOf } from "../../utils/assist.js";
import Locale from "../../mixins/locale.js";
import Time$1 from "./time2.js";
import { isClient } from "../../utils/index.js";
import dayjs from "dayjs";
import { openBlock, createElementBlock, normalizeClass, toDisplayString } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-time";
const _sfc_main = {
  name: "Time",
  mixins: [Locale],
  props: {
    time: {
      type: [Number, Date, String],
      required: true
    },
    type: {
      type: String,
      validator(value) {
        return oneOf(value, ["relative", "date", "datetime"]);
      },
      default: "relative"
    },
    hash: {
      type: String,
      default: ""
    },
    interval: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {
      date: ""
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-with-hash`]: this.hash
        }
      ];
    }
  },
  watch: {
    time() {
      this.setTime();
    }
  },
  methods: {
    handleClick() {
      if (isClient && this.hash !== "")
        window.location.hash = this.hash;
    },
    setTime() {
      const type = typeof this.time;
      let time;
      if (type === "number") {
        const timestamp = this.time.toString().length > 10 ? this.time : this.time * 1e3;
        time = new Date(timestamp).getTime();
      } else if (type === "object") {
        time = this.time.getTime();
      } else if (type === "string") {
        time = dayjs(this.time).valueOf();
      }
      if (this.type === "relative") {
        this.date = Time$1(time, this.t);
      } else {
        const date = new Date(this.time);
        const year = date.getFullYear();
        const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        const minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        const second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        if (this.type === "datetime") {
          this.date = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        } else if (this.type === "date") {
          this.date = `${year}-${month}-${day}`;
        }
      }
    }
  },
  mounted() {
    this.setTime();
    if (this.interval !== 0) {
      this.timer = setInterval(() => {
        this.setTime();
      }, 1e3 * this.interval);
    }
  },
  beforeUnmount() {
    if (this.timer)
      clearInterval(this.timer);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", {
    class: normalizeClass($options.classes),
    onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClick && $options.handleClick(...args))
  }, toDisplayString($data.date), 3);
}
var Time = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Time as default };
