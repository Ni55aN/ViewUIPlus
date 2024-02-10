import { h } from "vue";
var SliderMarker = {
  name: "SliderMarker",
  props: {
    mark: {
      type: [String, Object]
    }
  },
  render() {
    let label = typeof this.mark === "string" ? this.mark : [this.mark.label];
    return h("div", {
      class: "ivu-slider-marks-item",
      style: this.mark.style || {}
    }, label);
  }
};
export { SliderMarker as default };
