import { h } from "vue";
var renderHeader = {
  name: "TableRenderHeader",
  props: {
    render: Function,
    column: Object,
    index: Number
  },
  render() {
    const params = {
      column: this.column,
      index: this.index
    };
    return this.render(h, params);
  }
};
export { renderHeader as default };
