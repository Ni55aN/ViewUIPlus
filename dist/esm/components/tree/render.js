import { h } from "vue";
var Render = {
  name: "RenderCell",
  props: {
    render: Function,
    data: Object,
    node: Array
  },
  render() {
    const params = {
      root: this.node[0],
      node: this.node[1],
      data: this.data
    };
    return this.render(h, params);
  }
};
export { Render as default };
