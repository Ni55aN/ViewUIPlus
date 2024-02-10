import { h } from "vue";
var Render = {
  name: "RenderCell",
  props: {
    render: Function
  },
  render() {
    return this.render(h);
  }
};
export { Render as default };
