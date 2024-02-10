import handleEscapeMixin from "./handleEscapeMixin.js";
import { getTouches } from "./utils.js";
import { on, off } from "../../utils/dom.js";
import { isClient } from "../../utils/index.js";
var HSAMixin = {
  mixins: [handleEscapeMixin],
  props: {
    focused: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: void 0
    }
  },
  created() {
    if (this.focused) {
      setTimeout(() => this.$el.focus(), 1);
    }
  },
  beforeUnmount() {
    this.unbindEventListeners();
  },
  methods: {
    handleLeft(e) {
      this.handleSlide(e, this.left, "left");
    },
    handleRight(e) {
      this.handleSlide(e, this.right, "right");
    },
    handleUp(e) {
      this.handleSlide(e, this.up, "up");
    },
    handleDown(e) {
      this.handleSlide(e, this.down, "down");
    },
    handleMouseDown(e) {
      this.ColorPickerInstance.handleOnDragging(true);
      this.handleChange(e, true);
      on(window, "mousemove", this.handleChange);
      on(window, "mouseup", this.handleMouseUp);
    },
    handleMouseUp() {
      this.unbindEventListeners();
    },
    unbindEventListeners() {
      off(window, "mousemove", this.handleChange);
      off(window, "mouseup", this.handleMouseUp);
      setTimeout(() => this.ColorPickerInstance.handleOnDragging(false), 1);
    },
    getLeft(e) {
      if (!isClient)
        return;
      const { container } = this.$refs;
      const xOffset = container.getBoundingClientRect().left + window.pageXOffset;
      const pageX = e.pageX || getTouches(e, "PageX");
      return pageX - xOffset;
    },
    getTop(e) {
      if (!isClient)
        return;
      const { container } = this.$refs;
      const yOffset = container.getBoundingClientRect().top + window.pageYOffset;
      const pageY = e.pageY || getTouches(e, "PageY");
      return pageY - yOffset;
    }
  }
};
export { HSAMixin as default };
