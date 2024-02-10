import { openBlock, createElementBlock, toDisplayString } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}
const _sfc_main = {
  name: "CountDown",
  emits: ["on-end"],
  props: {
    format: {
      type: Function
    },
    target: {
      type: [Date, Number]
    },
    interval: {
      type: Number,
      default: 1e3
    }
  },
  data() {
    return {
      lastTime: ""
    };
  },
  methods: {
    initTime() {
      let lastTime = 0;
      let targetTime = 0;
      try {
        if (Object.prototype.toString.call(this.target) === "[object Date]") {
          targetTime = this.target.getTime();
        } else {
          targetTime = new Date(this.target).getTime();
        }
      } catch (e) {
        throw new Error("invalid target prop", e);
      }
      lastTime = targetTime - new Date().getTime();
      return lastTime < 0 ? 0 : lastTime;
    },
    tick() {
      let { lastTime } = this;
      this.timer = setTimeout(() => {
        if (lastTime < this.interval) {
          clearTimeout(this.timer);
          this.lastTime = 0;
          this.$emit("on-end");
        } else {
          lastTime -= this.interval;
          this.lastTime = lastTime;
          this.tick();
        }
      }, this.interval);
    },
    defaultFormat(time) {
      const hours = 60 * 60 * 1e3;
      const minutes = 60 * 1e3;
      const h = Math.floor(time / hours);
      const m = Math.floor((time - h * hours) / minutes);
      const s = Math.floor((time - h * hours - m * minutes) / 1e3);
      return `${fixedZero(h)}:${fixedZero(m)}:${fixedZero(s)}`;
    }
  },
  computed: {
    result() {
      const { format = this.defaultFormat } = this;
      return format(this.lastTime);
    }
  },
  watch: {
    target() {
      if (this.timer)
        clearTimeout(this.timer);
      this.lastTime = this.initTime();
      this.tick();
    }
  },
  created() {
    this.lastTime = this.initTime();
  },
  mounted() {
    this.tick();
  },
  beforeUnmount() {
    if (this.timer)
      clearTimeout(this.timer);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", null, toDisplayString($options.result), 1);
}
var CountDown = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CountDown as default };
