import Row from "../row/row.js";
import Col from "../col/col.js";
import Input from "../input/input.js";
import Table from "../table/table.js";
import { deepCopy } from "../../utils/assist.js";
import { resolveComponent, openBlock, createElementBlock, createBlock, withCtx, createVNode, renderSlot, mergeProps, createCommentVNode, Fragment } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "TablePaste",
  components: { Row, Col, Input, Table },
  emits: ["on-change", "on-error", "on-success"],
  props: {
    value: {
      type: String
    },
    inputProps: {
      type: Object,
      default() {
        return {};
      }
    },
    tableProps: {
      type: Object,
      default() {
        return {};
      }
    },
    hideTable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: "",
      tableColumns: [],
      tableData: []
    };
  },
  watch: {
    value: {
      handler(content) {
        this.handleResolveContent(content);
      },
      immediate: true
    }
  },
  methods: {
    handleContentChange(e) {
      const content = e.target.value.trim();
      this.$emit("on-change", content);
      this.handleResolveContent(content);
    },
    handleResolveContent(content) {
      let rows = [];
      if (content !== "" && content !== void 0) {
        rows = content.split(/[\n\u0085\u2028\u2029]|\r\n?/g).map((row) => {
          return row.split("	");
        });
      }
      const errorIndex = this.handleGetErrorIndex(rows);
      const tableData = this.contentToTable(rows);
      this.tableColumns = tableData.columns;
      this.tableData = tableData.data;
      if (errorIndex.length) {
        this.$emit("on-error", tableData, errorIndex);
      } else {
        this.$emit("on-success", tableData);
      }
    },
    handleGetErrorIndex(rows) {
      const array = deepCopy(rows);
      const errorIndex = [];
      if (array.length) {
        const colLen = array[0].length;
        array.forEach((item, index) => {
          if (item.length !== colLen)
            errorIndex.push(index);
        });
      }
      return errorIndex;
    },
    contentToTable(rows) {
      const array = deepCopy(rows);
      let columns = [];
      let tableData = [];
      if (array.length > 1) {
        let titles = array.shift();
        columns = titles.map((item, index) => {
          return {
            title: item,
            key: `key${index}`
          };
        });
        tableData = array.map((item) => {
          const res = {};
          item.forEach((col, i) => {
            res[`key${i}`] = col;
          });
          return res;
        });
      }
      return {
        columns,
        data: tableData
      };
    }
  }
};
const _hoisted_1 = { class: "ivu-table-paste" };
const _hoisted_2 = {
  key: 0,
  class: "ivu-table-paste-input"
};
const _hoisted_3 = {
  key: 0,
  class: "ivu-table-paste-input"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Input = resolveComponent("Input");
  const _component_Col = resolveComponent("Col");
  const _component_Table = resolveComponent("Table");
  const _component_Row = resolveComponent("Row");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    !$props.hideTable ? (openBlock(), createBlock(_component_Row, {
      key: 0,
      gutter: 32
    }, {
      default: withCtx(() => [
        createVNode(_component_Col, { span: "12" }, {
          default: withCtx(() => [
            $props.value !== void 0 || !_ctx.$slots.default ? (openBlock(), createElementBlock("div", _hoisted_2, [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createVNode(_component_Input, mergeProps({
                  modelValue: $data.content,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.content = $event),
                  type: "textarea"
                }, $props.inputProps, { onOnChange: $options.handleContentChange }), null, 16, ["modelValue", "onOnChange"])
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 3
        }),
        createVNode(_component_Col, { span: "12" }, {
          default: withCtx(() => [
            createVNode(_component_Table, mergeProps({
              columns: $data.tableColumns,
              data: $data.tableData
            }, $props.tableProps), null, 16, ["columns", "data"])
          ]),
          _: 1
        })
      ]),
      _: 3
    })) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
      $props.value !== void 0 || !_ctx.$slots.default ? (openBlock(), createElementBlock("div", _hoisted_3, [
        renderSlot(_ctx.$slots, "default", {}, () => [
          createVNode(_component_Input, mergeProps({
            modelValue: $data.content,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.content = $event),
            type: "textarea"
          }, $props.inputProps, { onOnChange: $options.handleContentChange }), null, 16, ["modelValue", "onOnChange"])
        ])
      ])) : createCommentVNode("", true)
    ], 64))
  ]);
}
var TablePaste = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TablePaste as default };
