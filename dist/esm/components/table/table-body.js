import { h } from "vue";
import TableTr from "./table-tr.js";
import TableCell from "./cell.js";
import Expand from "./expand.js";
import Mixin from "./mixin.js";
const _sfc_main = {
  name: "TableBody",
  mixins: [Mixin],
  components: { TableCell, Expand, TableTr },
  props: {
    prefixCls: String,
    styleObject: Object,
    columns: Array,
    data: Array,
    objData: Object,
    columnsWidth: Object,
    fixed: {
      type: [Boolean, String],
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    rowKey: {
      type: [Boolean, String],
      default: false
    }
  },
  computed: {
    expandRender() {
      let render = function() {
        return "";
      };
      for (let i = 0; i < this.columns.length; i++) {
        const column = this.columns[i];
        if (column.type && column.type === "expand") {
          if (column.render)
            render = column.render;
        }
      }
      return render;
    }
  },
  methods: {
    rowChecked(_index) {
      return this.objData[_index] && this.objData[_index]._isChecked;
    },
    rowDisabled(_index) {
      return this.objData[_index] && this.objData[_index]._isDisabled;
    },
    rowExpanded(_index) {
      return this.objData[_index] && this.objData[_index]._isExpanded;
    },
    rowStatusByRowKey(type, rowKey) {
      const data = this.$parent.getDataByRowKey(rowKey);
      return data[type];
    },
    handleMouseIn(_index, event, rowKey) {
      event.stopPropagation();
      this.$parent.handleMouseIn(_index, rowKey);
    },
    handleMouseOut(_index, event, rowKey) {
      event.stopPropagation();
      this.$parent.handleMouseOut(_index, rowKey);
    },
    clickCurrentRow(_index, event, rowKey) {
      this.$parent.clickCurrentRow(_index, rowKey);
    },
    dblclickCurrentRow(_index, event, rowKey) {
      event.stopPropagation();
      this.$parent.dblclickCurrentRow(_index, rowKey);
    },
    clickCell(row, column, key, event) {
      this.$parent.$emit("on-cell-click", row, column, row[key], event);
    },
    contextmenuCurrentRow(_index, event, rowKey) {
      event.stopPropagation();
      if (this.$parent.contextMenu)
        event.preventDefault();
      this.$parent.contextmenuCurrentRow(_index, rowKey, event);
    },
    selectStartCurrentRow() {
      if (this.$parent.contextMenu)
        ;
    },
    getSpan(row, column, rowIndex, columnIndex) {
      const fn = this.$parent.spanMethod;
      if (typeof fn === "function") {
        const result = fn({
          row,
          column,
          rowIndex,
          columnIndex
        });
        let rowspan = 1;
        let colspan = 1;
        if (Array.isArray(result)) {
          rowspan = result[0];
          colspan = result[1];
        } else if (typeof result === "object") {
          rowspan = result.rowspan;
          colspan = result.colspan;
        }
        return {
          rowspan,
          colspan
        };
      } else {
        return {};
      }
    },
    showWithSpan(row, column, rowIndex, columnIndex) {
      const result = this.getSpan(row, column, rowIndex, columnIndex);
      return !("rowspan" in result && result.rowspan === 0 || "colspan" in result && result.colspan === 0);
    },
    isTrShow(rowKey) {
      let status = true;
      let child;
      for (let i in this.objData) {
        const row = this.objData[i];
        const showChildren = row._isShowChildren;
        if (row._rowKey === rowKey) {
          status = status && showChildren;
          break;
        } else if (row.children && row.children.length) {
          child = this.getTrStatus(rowKey, row, status && showChildren);
          if (child[0] && child[0]._rowKey === rowKey) {
            return child[1];
          }
        }
      }
      return status;
    },
    getTrStatus(rowKey, data, parentStatus) {
      let status = parentStatus;
      let childData;
      if (data.children && data.children.length) {
        for (let i = 0; i < data.children.length; i++) {
          const row = data.children[i];
          const showChildren = row._isShowChildren;
          if (row._rowKey === rowKey) {
            childData = row;
            status = status && showChildren;
            break;
          } else if (row.children && row.children.length) {
            const child = this.getTrStatus(rowKey, row, status && showChildren);
            if (child[0] && child[0]._rowKey === rowKey) {
              return child;
            }
          }
        }
      }
      return [childData, status];
    },
    getLevel(rowKey) {
      let level;
      let child;
      for (let i = 0; i < this.data.length; i++) {
        const row = this.data[i];
        if (row[this.rowKey] === rowKey) {
          level = 0;
          break;
        } else if (row.children && row.children.length) {
          child = this.getChildLevel(row, rowKey, 1);
          if (child[0] && child[0][this.rowKey] === rowKey) {
            return child[1];
          }
        }
      }
      return level;
    },
    getChildLevel(data, rowKey, level) {
      let newLevel;
      let childData;
      if (data.children && data.children.length) {
        for (let i = 0; i < data.children.length; i++) {
          const row = data.children[i];
          if (row[this.rowKey] === rowKey) {
            childData = row;
            newLevel = level;
            break;
          } else if (row.children && row.children.length) {
            const child = this.getChildLevel(row, rowKey, level + 1);
            if (child[0] && child[0][this.rowKey] === rowKey) {
              return child;
            }
          }
        }
      }
      return [childData, newLevel];
    },
    getChildNode(h2, data, nodes) {
      if (data.children && data.children.length) {
        data.children.forEach((row, index) => {
          let $tds = [];
          this.columns.forEach((column, colIndex) => {
            if (this.showWithSpan(row, column, index, colIndex)) {
              const $tableCell = h2(TableCell, {
                fixed: this.fixed,
                "prefix-cls": this.prefixCls,
                row,
                column,
                "natural-index": index,
                index: row._index,
                checked: this.rowStatusByRowKey("_isChecked", row._rowKey),
                disabled: this.rowStatusByRowKey("_isDisabled", row._rowKey),
                expanded: this.rowStatusByRowKey("_isExpanded", row._rowKey),
                treeNode: true,
                treeLevel: this.getLevel(row._rowKey),
                key: column._columnKey
              });
              const $td = h2("td", {
                class: this.alignCls(column, row),
                ...this.getSpan(row, column, index, colIndex),
                onClick: (e) => this.clickCell(row, column, column.key, e)
              }, [$tableCell]);
              $tds.push($td);
            }
          });
          const trStyle = {};
          if (!this.isTrShow(data._rowKey))
            trStyle.display = "none";
          const $tableTr = h2(TableTr, {
            draggable: false,
            row,
            "prefix-cls": this.prefixCls,
            isChildren: true,
            style: trStyle,
            key: this.rowKey ? row._rowKey : index,
            onMouseenter: (e) => this.handleMouseIn(row._index, e, row._rowKey),
            onMouseleave: (e) => this.handleMouseOut(row._index, e, row._rowKey),
            onClick: (e) => this.clickCurrentRow(row._index, e, row._rowKey),
            onDblclick: (e) => this.dblclickCurrentRow(row._index, e, row._rowKey),
            onContextmenu: (e) => this.contextmenuCurrentRow(row._index, e, row._rowKey),
            onSelectstart: (e) => this.selectStartCurrentRow(row._index, e, row._rowKey)
          }, () => $tds);
          nodes.push($tableTr);
          if (row.children && row.children.length) {
            this.getChildNode(h2, row, nodes);
          }
        });
        return nodes;
      } else {
        return nodes;
      }
    }
  },
  render() {
    let $cols = [];
    this.columns.forEach((column) => {
      const $col = h("col", {
        width: this.setCellWidth(column)
      });
      $cols.push($col);
    });
    const $colgroup = h("colgroup", {}, $cols);
    let $tableTrs = [];
    this.data.forEach((row, index) => {
      let $tds = [];
      this.columns.forEach((column, colIndex) => {
        if (this.showWithSpan(row, column, index, colIndex)) {
          const $tableCell = h(TableCell, {
            fixed: this.fixed,
            "prefix-cls": this.prefixCls,
            row,
            column,
            "natural-index": index,
            index: row._index,
            checked: this.rowChecked(row._index),
            disabled: this.rowDisabled(row._index),
            expanded: this.rowExpanded(row._index),
            key: column._columnKey
          });
          const $td = h("td", {
            class: this.alignCls(column, row),
            ...this.getSpan(row, column, index, colIndex),
            onClick: (e) => this.clickCell(row, column, column.key, e)
          }, [$tableCell]);
          $tds.push($td);
        }
      });
      const $tableTr = h(TableTr, {
        draggable: this.draggable,
        row,
        "prefix-cls": this.prefixCls,
        key: this.rowKey ? row._rowKey : index,
        onMouseenter: (e) => this.handleMouseIn(row._index, e),
        onMouseleave: (e) => this.handleMouseOut(row._index, e),
        onClick: (e) => this.clickCurrentRow(row._index, e),
        onDblclick: (e) => this.dblclickCurrentRow(row._index, e),
        onContextmenu: (e) => this.contextmenuCurrentRow(row._index, e),
        onSelectstart: (e) => this.selectStartCurrentRow(row._index, e)
      }, () => $tds);
      $tableTrs.push($tableTr);
      if (this.rowExpanded(row._index)) {
        const $Expand = h(Expand, {
          row,
          render: this.expandRender,
          index: row._index,
          key: this.rowKey ? row._rowKey : index
        });
        const $td = h("td", {
          colspan: this.columns.length,
          class: this.prefixCls + "-expanded-cell"
        }, [$Expand]);
        const $tr = h("tr", {
          class: {
            [this.prefixCls + "-expanded-hidden"]: this.fixed
          }
        }, [$td]);
        $tableTrs.push($tr);
      }
      if (row.children && row.children.length) {
        const $childNodes = this.getChildNode(h, row, []);
        $childNodes.forEach((item) => {
          $tableTrs.push(item);
        });
      }
    });
    const $tbody = h("tbody", {
      class: this.prefixCls + "-tbody"
    }, [$tableTrs]);
    return h("table", {
      cellspacing: "0",
      cellpadding: "0",
      border: "0",
      style: this.styleObject
    }, [$colgroup, $tbody]);
  }
};
export { _sfc_main as default };
