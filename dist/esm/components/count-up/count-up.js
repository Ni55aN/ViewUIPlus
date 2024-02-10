import CountUp$1 from "countup.js";
import { openBlock, createElementBlock } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "CountUp",
  props: {
    start: {
      type: Number,
      required: false,
      default: 0
    },
    end: {
      type: Number,
      required: true
    },
    decimals: {
      type: Number,
      required: false,
      default: 0
    },
    duration: {
      type: Number,
      required: false,
      default: 2
    },
    options: {
      type: Object,
      required: false,
      default() {
        return {};
      }
    },
    callback: {
      type: Function,
      required: false,
      default: () => {
      }
    }
  },
  data() {
    return {
      CountUp: null
    };
  },
  watch: {
    end(value) {
      if (this.CountUp && this.CountUp.update) {
        this.CountUp.update(value);
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (!this.CountUp) {
        this.CountUp = new CountUp$1(
          this.$el,
          this.start,
          this.end,
          this.decimals,
          this.duration,
          this.options
        );
        this.CountUp.start(() => {
          this.callback(this.CountUp);
        });
      }
    },
    destroy() {
      this.CountUp = null;
    }
  },
  beforeUnmounted() {
    this.destroy();
  },
  start(callback) {
    if (this.CountUp && this.CountUp.start) {
      this.CountUp.start(() => {
        callback && callback(this.CountUp);
      });
    }
  },
  pauseResume() {
    if (this.CountUp && this.CountUp.pauseResume) {
      this.CountUp.pauseResume();
    }
  },
  reset() {
    if (this.CountUp && this.CountUp.reset) {
      this.CountUp.reset();
    }
  },
  update(newEndVal) {
    if (this.CountUp && this.CountUp.update) {
      this.CountUp.update(newEndVal);
    }
  }
};
const _hoisted_1 = { class: "ivu-count-up" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", _hoisted_1);
}
var CountUp = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CountUp as default };
