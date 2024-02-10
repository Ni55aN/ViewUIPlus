import { h } from "vue";
var Expand = {
  name: "TableExpand",
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null
    }
  },
  render() {
    const params = {
      row: this.row,
      index: this.index
    };
    if (this.column)
      params.column = this.column;
    return this.render(h, params);
  }
};
export { Expand as default };
