import { getCurrentInstance, nextTick, resolveComponent, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createCommentVNode, createVNode, withDirectives, vShow, createBlock, withCtx } from "vue";
import tableHead from "./table-head.js";
import _sfc_main$1 from "./table-body.js";
import tableSummary from "./summary.js";
import Dropdown from "../dropdown/dropdown.js";
import DropdownMenu from "../dropdown/dropdown-menu.js";
import Spin from "../spin/spin2.js";
import { oneOf, getScrollBarSize, deepCopy, getStyle } from "../../utils/assist.js";
import { on, off } from "../../utils/dom.js";
import random from "../../utils/random_str.js";
import csv from "../../utils/csv.js";
import csv$1 from "./export-csv.js";
import Locale from "../../mixins/locale.js";
import elementResizeDetectorMaker from "element-resize-detector";
import { getAllColumns, convertColumnOrder, getRandomStr, convertToRows } from "./util.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-table";
let rowKey = 1;
let columnKey = 1;
const _sfc_main = {
  name: "Table",
  mixins: [Locale],
  components: { tableHead, tableBody: _sfc_main$1, tableSummary, Spin, Dropdown, DropdownMenu },
  emits: ["on-current-change", "on-row-click", "on-row-dblclick", "on-contextmenu", "on-select", "on-select-cancel", "on-selection-change", "on-expand", "on-expand-tree", "on-select-all", "on-select-all-cancel", "on-sort-change", "on-filter-change", "on-drag-drop", "on-cell-click", "on-column-width-resize"],
  provide() {
    return {
      TableInstance: this
    };
  },
  inject: {
    TabsInstance: {
      default: null
    },
    ModalInstance: {
      default: null
    },
    DrawerInstance: {
      default: null
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "large", "default"]);
      },
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.size === "" ? "default" : global.$VIEWUI.size;
      }
    },
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    maxHeight: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default() {
        return "";
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    tooltipTheme: {
      validator(value) {
        return oneOf(value, ["dark", "light"]);
      },
      default: "dark"
    },
    tooltipMaxWidth: {
      type: Number,
      default: 300
    },
    rowKey: {
      type: [Boolean, String],
      default: false
    },
    spanMethod: {
      type: Function
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    summaryMethod: {
      type: Function
    },
    sumText: {
      type: String
    },
    indentSize: {
      type: Number,
      default: 16
    },
    loadData: {
      type: Function
    },
    updateShowChildren: {
      type: Boolean,
      default: false
    },
    contextMenu: {
      type: Boolean,
      default: false
    },
    showContextMenu: {
      type: Boolean,
      default: false
    },
    fixedShadow: {
      validator(value) {
        return oneOf(value, ["auto", "show", "hide"]);
      },
      default: "show"
    },
    autoCloseContextmenu: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const colsWithId = this.makeColumnsId(this.columns);
    return {
      ready: false,
      tableWidth: 0,
      columnsWidth: {},
      prefixCls,
      compiledUids: [],
      objData: this.makeObjData(),
      rebuildData: [],
      cloneColumns: this.makeColumns(colsWithId),
      columnRows: this.makeColumnRows(false, colsWithId),
      leftFixedColumnRows: this.makeColumnRows("left", colsWithId),
      rightFixedColumnRows: this.makeColumnRows("right", colsWithId),
      allColumns: getAllColumns(colsWithId),
      showSlotHeader: true,
      showSlotFooter: true,
      bodyHeight: 0,
      scrollBarWidth: getScrollBarSize(),
      currentContext: this.context,
      cloneData: deepCopy(this.data),
      showVerticalScrollBar: false,
      showHorizontalScrollBar: false,
      headerWidth: 0,
      headerHeight: 0,
      showResizeLine: false,
      contextMenuVisible: false,
      contextMenuStyles: {
        top: 0,
        left: 0
      },
      scrollOnTheLeft: false,
      scrollOnTheRight: false,
      id: random(6)
    };
  },
  computed: {
    localeNoDataText() {
      if (this.noDataText === void 0) {
        return this.t("i.table.noDataText");
      } else {
        return this.noDataText;
      }
    },
    localeNoFilteredDataText() {
      if (this.noFilteredDataText === void 0) {
        return this.t("i.table.noFilteredDataText");
      } else {
        return this.noFilteredDataText;
      }
    },
    localeSumText() {
      if (this.sumText === void 0) {
        return this.t("i.table.sumText");
      } else {
        return this.sumText;
      }
    },
    wrapClasses() {
      return [
        `${prefixCls}-wrapper`,
        {
          [`${prefixCls}-hide`]: !this.ready,
          [`${prefixCls}-with-header`]: this.showSlotHeader,
          [`${prefixCls}-with-footer`]: this.showSlotFooter,
          [`${prefixCls}-with-summary`]: this.showSummary,
          [`${prefixCls}-wrapper-with-border`]: this.border
        }
      ];
    },
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-border`]: this.border,
          [`${prefixCls}-stripe`]: this.stripe,
          [`${prefixCls}-with-fixed-top`]: !!this.height
        }
      ];
    },
    fixedTableClasses() {
      return [
        `${prefixCls}-fixed`,
        {
          [`${prefixCls}-fixed-shadow`]: this.fixedShadow === "show" || this.fixedShadow === "auto" && !this.scrollOnTheLeft
        }
      ];
    },
    fixedRightTableClasses() {
      return [
        `${prefixCls}-fixed-right`,
        {
          [`${prefixCls}-fixed-shadow`]: this.fixedShadow === "show" || this.fixedShadow === "auto" && !this.scrollOnTheRight
        }
      ];
    },
    fixedHeaderClasses() {
      return [
        `${prefixCls}-fixed-header`,
        {
          [`${prefixCls}-fixed-header-with-empty`]: !this.rebuildData.length
        }
      ];
    },
    styles() {
      let style = {};
      let summaryHeight = 0;
      if (this.showSummary) {
        if (this.size === "small")
          summaryHeight = 40;
        else if (this.size === "large")
          summaryHeight = 60;
        else
          summaryHeight = 48;
      }
      if (this.height) {
        let height = parseInt(this.height) + summaryHeight;
        style.height = `${height}px`;
      }
      if (this.maxHeight) {
        const maxHeight = parseInt(this.maxHeight) + summaryHeight;
        style.maxHeight = `${maxHeight}px`;
      }
      if (this.width)
        style.width = `${this.width}px`;
      return style;
    },
    tableStyle() {
      let style = {};
      if (this.tableWidth !== 0) {
        let width = "";
        if (this.bodyHeight === 0) {
          width = this.tableWidth;
        } else {
          width = this.tableWidth - (this.showVerticalScrollBar ? this.scrollBarWidth : 0);
        }
        style.width = `${width}px`;
      }
      return style;
    },
    tableHeaderStyle() {
      let style = {};
      if (this.tableWidth !== 0) {
        let width = "";
        width = this.tableWidth;
        style.width = `${width}px`;
      }
      return style;
    },
    fixedTableStyle() {
      let style = {};
      let width = 0;
      this.leftFixedColumns.forEach((col) => {
        if (col.fixed && col.fixed === "left")
          width += col._width;
      });
      style.width = `${width}px`;
      return style;
    },
    fixedRightTableStyle() {
      let style = {};
      let width = 0;
      this.rightFixedColumns.forEach((col) => {
        if (col.fixed && col.fixed === "right")
          width += col._width;
      });
      style.width = `${width}px`;
      style.right = `${this.showVerticalScrollBar ? this.scrollBarWidth : 0}px`;
      return style;
    },
    fixedRightHeaderStyle() {
      let style = {};
      let width = 0;
      let height = this.headerHeight + 1;
      if (this.showVerticalScrollBar) {
        width = this.scrollBarWidth;
      }
      style.width = `${width}px`;
      style.height = `${height}px`;
      return style;
    },
    bodyStyle() {
      let style = {};
      if (this.bodyHeight !== 0) {
        const height = this.bodyHeight;
        if (this.height) {
          style.height = `${height}px`;
        } else if (this.maxHeight) {
          style.maxHeight = `${height}px`;
        }
      }
      return style;
    },
    fixedBodyStyle() {
      let style = {};
      if (this.bodyHeight !== 0) {
        let height = this.bodyHeight - (this.showHorizontalScrollBar ? this.scrollBarWidth : 0);
        const bodyHeight = this.showHorizontalScrollBar ? `${height}px` : `${height - 1}px`;
        if (this.height)
          style.height = bodyHeight;
        else if (this.maxHeight)
          style.maxHeight = bodyHeight;
      }
      return style;
    },
    leftFixedColumns() {
      return convertColumnOrder(this.cloneColumns, "left");
    },
    rightFixedColumns() {
      return convertColumnOrder(this.cloneColumns, "right");
    },
    isLeftFixed() {
      return this.columns.some((col) => col.fixed && col.fixed === "left");
    },
    isRightFixed() {
      return this.columns.some((col) => col.fixed && col.fixed === "right");
    },
    summaryData() {
      if (!this.showSummary)
        return {};
      let sums = {};
      if (this.summaryMethod) {
        sums = this.summaryMethod({ columns: this.cloneColumns, data: this.rebuildData });
      } else {
        this.cloneColumns.forEach((column, index) => {
          const key = column.key;
          if (index === 0) {
            sums[key] = {
              key: column.key,
              value: this.localeSumText
            };
            return;
          }
          const values = this.rebuildData.map((item) => Number(item[column.key]));
          const precisions = [];
          let notNumber = true;
          values.forEach((value) => {
            if (!isNaN(value)) {
              notNumber = false;
              let decimal = ("" + value).split(".")[1];
              precisions.push(decimal ? decimal.length : 0);
            }
          });
          const precision = Math.max.apply(null, precisions);
          if (!notNumber) {
            const currentValue = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return parseFloat((prev + curr).toFixed(Math.min(precision, 20)));
              } else {
                return prev;
              }
            }, 0);
            sums[key] = {
              key: column.key,
              value: currentValue
            };
          } else {
            sums[key] = {
              key: column.key,
              value: ""
            };
          }
        });
      }
      return sums;
    }
  },
  methods: {
    rowClsName(index) {
      return this.rowClassName(this.data[index], index);
    },
    handleResize() {
      let tableWidth = this.$el.offsetWidth - 1;
      let columnsWidth = {};
      let sumMinWidth = 0;
      let hasWidthColumns = [];
      let noWidthColumns = [];
      let noMaxWidthColumns = [];
      this.cloneColumns.forEach((col) => {
        if (col.width) {
          hasWidthColumns.push(col);
        } else {
          noWidthColumns.push(col);
          if (col.minWidth) {
            sumMinWidth += col.minWidth;
          }
          if (col.maxWidth)
            ;
          else {
            noMaxWidthColumns.push(col);
          }
        }
        col._width = null;
      });
      let unUsableWidth = hasWidthColumns.map((cell) => cell.width).reduce((a, b) => a + b, 0);
      let usableWidth = tableWidth - unUsableWidth - sumMinWidth - (this.showVerticalScrollBar ? this.scrollBarWidth : 0) - 1;
      let usableLength = noWidthColumns.length;
      let columnWidth = 0;
      if (usableWidth > 0 && usableLength > 0) {
        columnWidth = parseInt(usableWidth / usableLength);
      }
      for (let i = 0; i < this.cloneColumns.length; i++) {
        const column = this.cloneColumns[i];
        let width = columnWidth + (column.minWidth ? column.minWidth : 0);
        if (column.width) {
          width = column.width;
        } else {
          if (column._width) {
            width = column._width;
          } else {
            if (column.minWidth > width) {
              width = column.minWidth;
            } else if (column.maxWidth < width) {
              width = column.maxWidth;
            }
            if (usableWidth > 0) {
              usableWidth -= width - (column.minWidth ? column.minWidth : 0);
              usableLength--;
              if (usableLength > 0) {
                columnWidth = parseInt(usableWidth / usableLength);
              } else {
                columnWidth = 0;
              }
            } else {
              columnWidth = 0;
            }
          }
        }
        column._width = width;
        columnsWidth[column._index] = {
          width
        };
      }
      if (usableWidth > 0) {
        usableLength = noMaxWidthColumns.length;
        columnWidth = parseInt(usableWidth / usableLength);
        for (let i = 0; i < noMaxWidthColumns.length; i++) {
          const column = noMaxWidthColumns[i];
          let width = column._width + columnWidth;
          if (usableLength > 1) {
            usableLength--;
            usableWidth -= columnWidth;
            columnWidth = parseInt(usableWidth / usableLength);
          } else {
            columnWidth = 0;
          }
          column._width = width;
          columnsWidth[column._index] = {
            width
          };
        }
      }
      this.tableWidth = this.cloneColumns.map((cell) => cell._width).reduce((a, b) => a + b, 0) + (this.showVerticalScrollBar ? this.scrollBarWidth : 0) + 1;
      this.columnsWidth = columnsWidth;
      this.fixedHeader();
      if (this.fixedShadow === "auto") {
        nextTick(() => {
          const $body = this.$refs.body;
          this.scrollOnTheLeft = $body.scrollLeft === 0;
          this.scrollOnTheRight = $body.scrollWidth === $body.scrollLeft + $body.clientWidth;
        });
      }
    },
    handleMouseIn(_index, rowKey2) {
      if (this.disabledHover)
        return;
      const objData = rowKey2 ? this.getDataByRowKey(rowKey2) : this.objData[_index];
      if (objData._isHover)
        return;
      objData._isHover = true;
    },
    handleMouseOut(_index, rowKey2) {
      if (this.disabledHover)
        return;
      const objData = rowKey2 ? this.getDataByRowKey(rowKey2) : this.objData[_index];
      objData._isHover = false;
    },
    handleCurrentRow(type, _index, rowKey2) {
      const objData = rowKey2 ? this.getDataByRowKey(rowKey2) : this.objData[_index];
      let oldData = null;
      let oldIndex = -1;
      for (let i in this.objData) {
        if (this.objData[i]._isHighlight) {
          oldIndex = parseInt(i);
          this.objData[i]._isHighlight = false;
          break;
        } else if (this.objData[i].children && this.objData[i].children.length) {
          const resetData = this.handleResetChildrenRow(this.objData[i]);
          if (resetData)
            oldData = JSON.parse(JSON.stringify(resetData));
        }
      }
      if (type === "highlight")
        objData._isHighlight = true;
      if (oldIndex >= 0) {
        oldData = JSON.parse(JSON.stringify(this.cloneData[oldIndex]));
      }
      const newData = type === "highlight" ? rowKey2 ? JSON.parse(JSON.stringify(this.getBaseDataByRowKey(rowKey2))) : JSON.parse(JSON.stringify(this.cloneData[_index])) : null;
      this.$emit("on-current-change", newData, oldData);
    },
    handleResetChildrenRow(objData) {
      let data = null;
      if (objData.children && objData.children.length) {
        for (let i = 0; i < objData.children.length; i++) {
          const item = objData.children[i];
          if (item._isHighlight) {
            item._isHighlight = false;
            data = item;
            break;
          } else if (item.children && item.children.length) {
            data = this.handleResetChildrenRow(item);
          }
        }
      }
      return data;
    },
    highlightCurrentRow(_index, rowKey2) {
      const objData = rowKey2 ? this.getDataByRowKey(rowKey2) : this.objData[_index];
      if (!this.highlightRow || objData._isHighlight)
        return;
      this.handleCurrentRow("highlight", _index, rowKey2);
    },
    clearCurrentRow() {
      if (!this.highlightRow)
        return;
      this.handleCurrentRow("clear");
    },
    clickCurrentRow(_index, rowKey2) {
      this.highlightCurrentRow(_index, rowKey2);
      if (rowKey2) {
        this.$emit("on-row-click", JSON.parse(JSON.stringify(this.getBaseDataByRowKey(rowKey2))));
      } else {
        this.$emit("on-row-click", JSON.parse(JSON.stringify(this.cloneData[_index])), _index);
      }
    },
    dblclickCurrentRow(_index, rowKey2) {
      this.highlightCurrentRow(_index, rowKey2);
      if (rowKey2) {
        this.$emit("on-row-dblclick", JSON.parse(JSON.stringify(this.getBaseDataByRowKey(rowKey2))));
      } else {
        this.$emit("on-row-dblclick", JSON.parse(JSON.stringify(this.cloneData[_index])), _index);
      }
    },
    contextmenuCurrentRow(_index, rowKey2, event) {
      if (this.contextMenuVisible)
        this.handleClickContextMenuOutside();
      nextTick(() => {
        const $TableWrap = this.$refs.tableWrap;
        const TableBounding = $TableWrap.getBoundingClientRect();
        const position = {
          left: `${event.clientX - TableBounding.left}px`,
          top: `${event.clientY - TableBounding.top}px`
        };
        this.contextMenuStyles = position;
        this.contextMenuVisible = true;
        if (rowKey2) {
          this.$emit("on-contextmenu", JSON.parse(JSON.stringify(this.getBaseDataByRowKey(rowKey2))), event, position);
        } else {
          this.$emit("on-contextmenu", JSON.parse(JSON.stringify(this.cloneData[_index])), event, position);
        }
      });
    },
    getSelection() {
      let selectionIndexes = [];
      let selectionRowKeys = [];
      for (let i in this.objData) {
        const objData = this.objData[i];
        if (objData._isChecked)
          selectionIndexes.push(parseInt(i));
        if (objData.children && objData.children.length) {
          selectionRowKeys = selectionRowKeys.concat(this.getSelectionChildrenRowKeys(objData, selectionRowKeys));
        }
      }
      selectionRowKeys = [...new Set(selectionRowKeys)];
      let selection = [];
      this.data.forEach((item, index) => {
        if (selectionIndexes.indexOf(index) > -1) {
          selection = selection.concat(item);
        }
        if (item.children && item.children.length && selectionRowKeys.length) {
          selection = selection.concat(this.getSelectionChildren(item, selection, selectionRowKeys));
        }
      });
      selection = [...new Set(selection)];
      return JSON.parse(JSON.stringify(selection));
    },
    getSelectionChildrenRowKeys(objData, selectionRowKeys) {
      if (objData.children && objData.children.length) {
        objData.children.forEach((item) => {
          if (item._isChecked)
            selectionRowKeys.push(item._rowKey);
          if (item.children && item.children.length) {
            selectionRowKeys = selectionRowKeys.concat(this.getSelectionChildrenRowKeys(item, selectionRowKeys));
          }
        });
      }
      return selectionRowKeys;
    },
    getSelectionChildren(data, selection, selectionRowKeys) {
      if (data.children && data.children.length) {
        data.children.forEach((item) => {
          if (selectionRowKeys.indexOf(item[this.rowKey]) > -1) {
            selection = selection.concat(item);
          }
          if (item.children && item.children.length) {
            selection = selection.concat(this.getSelectionChildren(item, selection, selectionRowKeys));
          }
        });
      }
      return selection;
    },
    toggleSelect(_index, rowKey2) {
      let data = {};
      if (rowKey2) {
        data = this.getDataByRowKey(rowKey2);
      } else {
        for (let i in this.objData) {
          if (parseInt(i) === _index) {
            data = this.objData[i];
            break;
          }
        }
      }
      const status = !data._isChecked;
      data._isChecked = status;
      const selection = this.getSelection();
      const selectedData = rowKey2 ? this.getBaseDataByRowKey(rowKey2, this.data) : this.data[_index];
      this.$emit(status ? "on-select" : "on-select-cancel", selection, JSON.parse(JSON.stringify(selectedData)));
      this.$emit("on-selection-change", selection);
    },
    toggleExpand(_index) {
      let data = {};
      for (let i in this.objData) {
        if (parseInt(i) === _index) {
          data = this.objData[i];
          break;
        }
      }
      const status = !data._isExpanded;
      this.objData[_index]._isExpanded = status;
      this.$emit("on-expand", JSON.parse(JSON.stringify(this.cloneData[_index])), status);
      if (this.height || this.maxHeight) {
        nextTick(() => this.fixedBody());
      }
    },
    toggleTree(rowKey2) {
      const data = this.getDataByRowKey(rowKey2);
      if ("_loading" in data && data._loading)
        return;
      if ("_loading" in data && !data._loading && data.children.length === 0) {
        const sourceData = this.getBaseDataByRowKey(rowKey2, this.data);
        sourceData._loading = true;
        this.loadData(sourceData, (children) => {
          sourceData._loading = false;
          if (children.length) {
            sourceData.children = children;
            nextTick(() => {
              const newData = this.getDataByRowKey(rowKey2);
              newData._isShowChildren = !newData._isShowChildren;
              this.updateDataStatus(rowKey2, "_showChildren", newData._isShowChildren);
            });
          }
        });
        return;
      }
      data._isShowChildren = !data._isShowChildren;
      if (this.updateShowChildren)
        this.updateDataStatus(rowKey2, "_showChildren", data._isShowChildren);
      this.$emit("on-expand-tree", rowKey2, data._isShowChildren);
    },
    updateDataStatus(rowKey2, key, value) {
      const data = this.getBaseDataByRowKey(rowKey2, this.data);
      data[key] = value;
    },
    getDataByRowKey(rowKey2, objData = this.objData) {
      let data = null;
      for (let i in objData) {
        const thisData = objData[i];
        if (thisData._rowKey === rowKey2) {
          data = thisData;
          break;
        } else if (thisData.children && thisData.children.length) {
          data = this.getChildrenByRowKey(rowKey2, thisData);
          if (data) {
            break;
          }
        }
      }
      return data;
    },
    getChildrenByRowKey(rowKey2, objData) {
      let data = null;
      if (objData.children && objData.children.length) {
        for (let i = 0; i < objData.children.length; i++) {
          const item = objData.children[i];
          if (item._rowKey === rowKey2) {
            data = item;
            break;
          } else if (item.children && item.children.length) {
            data = this.getChildrenByRowKey(rowKey2, item);
            if (data) {
              break;
            }
          }
        }
      }
      return data;
    },
    getBaseDataByRowKey(rowKey2, sourceData = this.cloneData) {
      let data = null;
      for (let i = 0; i < sourceData.length; i++) {
        const thisData = sourceData[i];
        if (thisData[this.rowKey] === rowKey2) {
          data = thisData;
          break;
        } else if (thisData.children && thisData.children.length) {
          data = this.getChildrenDataByRowKey(rowKey2, thisData);
          if (data && data[this.rowKey] === rowKey2)
            return data;
        }
      }
      return data;
    },
    getChildrenDataByRowKey(rowKey2, cloneData) {
      let data = null;
      if (cloneData.children && cloneData.children.length) {
        for (let i = 0; i < cloneData.children.length; i++) {
          const item = cloneData.children[i];
          if (item[this.rowKey] === rowKey2) {
            data = item;
            break;
          } else if (item.children && item.children.length) {
            data = this.getChildrenDataByRowKey(rowKey2, item);
            if (data) {
              break;
            }
          }
        }
      }
      return data;
    },
    selectAll(status) {
      for (const data of this.rebuildData) {
        const objData = this.objData[data._index];
        if (!objData._isDisabled) {
          objData._isChecked = status;
        }
        if (data.children && data.children.length) {
          this.selectAllChildren(objData, status);
        }
      }
      const selection = this.getSelection();
      if (status) {
        this.$emit("on-select-all", selection);
      } else {
        this.$emit("on-select-all-cancel", selection);
      }
      this.$emit("on-selection-change", selection);
    },
    selectAllChildren(data, status) {
      if (data.children && data.children.length) {
        data.children.map((item) => {
          if (!item._isDisabled) {
            item._isChecked = status;
          }
          if (item.children && item.children.length) {
            this.selectAllChildren(item, status);
          }
        });
      }
    },
    fixedHeader() {
      if (this.height || this.maxHeight) {
        nextTick(() => {
          const titleHeight = parseInt(getStyle(this.$refs.title, "height")) || 0;
          const headerHeight = parseInt(getStyle(this.$refs.header, "height")) || 0;
          const footerHeight = parseInt(getStyle(this.$refs.footer, "height")) || 0;
          if (this.height) {
            this.bodyHeight = this.height - titleHeight - headerHeight - footerHeight;
          } else if (this.maxHeight) {
            this.bodyHeight = this.maxHeight - titleHeight - headerHeight - footerHeight;
          }
          nextTick(() => this.fixedBody());
        });
      } else {
        this.bodyHeight = 0;
        nextTick(() => this.fixedBody());
      }
    },
    fixedBody() {
      if (this.$refs.header) {
        this.headerWidth = this.$refs.header.children[0].offsetWidth;
        this.headerHeight = this.$refs.header.children[0].offsetHeight;
      }
      if (!this.$refs.tbody || !this.data || this.data.length === 0) {
        this.showVerticalScrollBar = false;
      } else {
        let bodyContentEl = this.$refs.tbody.$el;
        let bodyEl = bodyContentEl.parentElement;
        let bodyContentHeight = bodyContentEl.offsetHeight;
        let bodyHeight = bodyEl.offsetHeight;
        this.showHorizontalScrollBar = bodyEl.offsetWidth < bodyContentEl.offsetWidth + (this.showVerticalScrollBar ? this.scrollBarWidth : 0);
        this.showVerticalScrollBar = this.bodyHeight ? bodyHeight - (this.showHorizontalScrollBar ? this.scrollBarWidth : 0) < bodyContentHeight : false;
        if (this.showVerticalScrollBar) {
          bodyEl.classList.add(this.prefixCls + "-overflowY");
        } else {
          bodyEl.classList.remove(this.prefixCls + "-overflowY");
        }
        if (this.showHorizontalScrollBar) {
          bodyEl.classList.add(this.prefixCls + "-overflowX");
        } else {
          bodyEl.classList.remove(this.prefixCls + "-overflowX");
        }
      }
    },
    hideColumnFilter() {
      this.cloneColumns.forEach((col) => col._filterVisible = false);
    },
    handleBodyScroll(event) {
      this.scrollOnTheLeft = event.target.scrollLeft === 0;
      this.scrollOnTheRight = event.target.scrollWidth === event.target.scrollLeft + event.target.clientWidth;
      if (this.showHeader)
        this.$refs.header.scrollLeft = event.target.scrollLeft;
      if (this.isLeftFixed)
        this.$refs.fixedBody.scrollTop = event.target.scrollTop;
      if (this.isRightFixed)
        this.$refs.fixedRightBody.scrollTop = event.target.scrollTop;
      if (this.showSummary && this.$refs.summary)
        this.$refs.summary.$el.scrollLeft = event.target.scrollLeft;
      this.hideColumnFilter();
    },
    handleFixedMousewheel(event) {
      let deltaY = event.deltaY;
      if (!deltaY && event.detail) {
        deltaY = event.detail * 40;
      }
      if (!deltaY && event.wheelDeltaY) {
        deltaY = -event.wheelDeltaY;
      }
      if (!deltaY && event.wheelDelta) {
        deltaY = -event.wheelDelta;
      }
      if (!deltaY)
        return;
      const body = this.$refs.body;
      const currentScrollTop = body.scrollTop;
      if (deltaY < 0 && currentScrollTop !== 0) {
        event.preventDefault();
      }
      if (deltaY > 0 && body.scrollHeight - body.clientHeight > currentScrollTop) {
        event.preventDefault();
      }
      let step = 0;
      let timeId = setInterval(() => {
        step += 5;
        if (deltaY > 0) {
          body.scrollTop += 2;
        } else {
          body.scrollTop -= 2;
        }
        if (step >= Math.abs(deltaY)) {
          clearInterval(timeId);
        }
      }, 5);
    },
    handleMouseWheel(event) {
      const deltaX = event.deltaX;
      const $body = this.$refs.body;
      if (deltaX > 0) {
        $body.scrollLeft = $body.scrollLeft + 10;
      } else {
        $body.scrollLeft = $body.scrollLeft - 10;
      }
    },
    sortData(data, type, index) {
      const key = this.cloneColumns[index].key;
      data.sort((a, b) => {
        if (this.cloneColumns[index].sortMethod) {
          return this.cloneColumns[index].sortMethod(a[key], b[key], type);
        } else {
          if (type === "asc") {
            return a[key] > b[key] ? 1 : -1;
          } else if (type === "desc") {
            return a[key] < b[key] ? 1 : -1;
          }
        }
      });
      for (let i = 0; i < data.length; i++) {
        if (data[i].children && data[i].children.length) {
          data[i].children = this.sortData(data[i].children, type, index);
        }
      }
      return data;
    },
    handleSort(_index, type) {
      const index = this.GetOriginalIndex(_index);
      this.cloneColumns.forEach((col) => col._sortType = "normal");
      const key = this.cloneColumns[index].key;
      if (this.cloneColumns[index].sortable !== "custom") {
        if (type === "normal") {
          this.rebuildData = this.makeDataWithFilter();
        } else {
          this.rebuildData = this.sortData(this.rebuildData, type, index);
        }
      }
      this.cloneColumns[index]._sortType = type;
      this.$emit("on-sort-change", {
        column: JSON.parse(JSON.stringify(this.allColumns[this.cloneColumns[index]._index])),
        key,
        order: type
      });
    },
    handleFilterHide(index) {
      if (!this.cloneColumns[index]._isFiltered)
        this.cloneColumns[index]._filterChecked = [];
    },
    filterData(data, column) {
      return data.filter((row) => {
        if (typeof column.filterRemote === "function")
          return true;
        let status = !column._filterChecked.length;
        for (let i = 0; i < column._filterChecked.length; i++) {
          status = column.filterMethod(column._filterChecked[i], row);
          if (status)
            break;
        }
        return status;
      });
    },
    filterOtherData(data, index) {
      let column = this.cloneColumns[index];
      if (typeof column.filterRemote === "function") {
        column.filterRemote.call(this.$parent, column._filterChecked, column.key, column);
      }
      this.cloneColumns.forEach((col, colIndex) => {
        if (colIndex !== index) {
          data = this.filterData(data, col);
        }
      });
      return data;
    },
    handleFilter(index) {
      const column = this.cloneColumns[index];
      let filterData = this.makeDataWithSort();
      filterData = this.filterOtherData(filterData, index);
      this.rebuildData = this.filterData(filterData, column);
      this.cloneColumns[index]._isFiltered = true;
      this.cloneColumns[index]._filterVisible = false;
      this.$emit("on-filter-change", column);
    },
    GetOriginalIndex(_index) {
      return this.cloneColumns.findIndex((item) => item._index === _index);
    },
    handleFilterSelect(_index, value) {
      const index = this.GetOriginalIndex(_index);
      this.cloneColumns[index]._filterChecked = [value];
      this.handleFilter(index);
    },
    handleFilterReset(_index) {
      const index = this.GetOriginalIndex(_index);
      this.cloneColumns[index]._isFiltered = false;
      this.cloneColumns[index]._filterVisible = false;
      this.cloneColumns[index]._filterChecked = [];
      let filterData = this.makeDataWithSort();
      filterData = this.filterOtherData(filterData, index);
      this.rebuildData = filterData;
      this.$emit("on-filter-change", this.cloneColumns[index]);
    },
    makeData() {
      let data = deepCopy(this.data);
      data.forEach((row, index) => {
        row._index = index;
        row._rowKey = typeof this.rowKey === "string" ? row[this.rowKey] : rowKey++;
        if (row.children && row.children.length) {
          row.children = this.makeChildrenData(row);
        }
      });
      return data;
    },
    makeChildrenData(data) {
      if (data.children && data.children.length) {
        return data.children.map((row, index) => {
          const newRow = deepCopy(row);
          newRow._index = index;
          newRow._rowKey = typeof this.rowKey === "string" ? newRow[this.rowKey] : rowKey++;
          if (newRow.children && newRow.children.length) {
            newRow.children = this.makeChildrenData(newRow);
          }
          return newRow;
        });
      } else {
        return data;
      }
    },
    makeDataWithSort() {
      let data = this.makeData();
      let sortType = "normal";
      let sortIndex = -1;
      let isCustom = false;
      for (let i = 0; i < this.cloneColumns.length; i++) {
        if (this.cloneColumns[i]._sortType !== "normal") {
          sortType = this.cloneColumns[i]._sortType;
          sortIndex = i;
          isCustom = this.cloneColumns[i].sortable === "custom";
          break;
        }
      }
      if (sortType !== "normal" && !isCustom)
        data = this.sortData(data, sortType, sortIndex);
      return data;
    },
    makeDataWithFilter() {
      let data = this.makeData();
      this.cloneColumns.forEach((col) => data = this.filterData(data, col));
      return data;
    },
    makeDataWithSortAndFilter() {
      let data = this.makeDataWithSort();
      this.cloneColumns.forEach((col) => data = this.filterData(data, col));
      return data;
    },
    makeObjBaseData(row) {
      const newRow = deepCopy(row);
      if (typeof this.rowKey === "string") {
        newRow._rowKey = newRow[this.rowKey];
      }
      newRow._isHover = false;
      if (newRow._disabled) {
        newRow._isDisabled = newRow._disabled;
      } else {
        newRow._isDisabled = false;
      }
      if (newRow._checked) {
        newRow._isChecked = newRow._checked;
      } else {
        newRow._isChecked = false;
      }
      if (newRow._expanded) {
        newRow._isExpanded = newRow._expanded;
      } else {
        newRow._isExpanded = false;
      }
      if (newRow._highlight) {
        newRow._isHighlight = newRow._highlight;
      } else {
        newRow._isHighlight = false;
      }
      return newRow;
    },
    makeObjData() {
      let data = {};
      this.data.forEach((row, index) => {
        const newRow = this.makeObjBaseData(row);
        if (newRow.children && newRow.children.length) {
          if (newRow._showChildren) {
            newRow._isShowChildren = newRow._showChildren;
          } else {
            newRow._isShowChildren = false;
          }
          newRow.children = this.makeChildrenObjData(newRow);
        }
        data[index] = newRow;
      });
      return data;
    },
    makeChildrenObjData(data) {
      if (data.children && data.children.length) {
        return data.children.map((row) => {
          const newRow = this.makeObjBaseData(row);
          if (newRow._showChildren) {
            newRow._isShowChildren = newRow._showChildren;
          } else {
            newRow._isShowChildren = false;
          }
          if (newRow.children && newRow.children.length) {
            newRow.children = this.makeChildrenObjData(newRow);
          }
          return newRow;
        });
      } else {
        return data;
      }
    },
    makeColumnsId(columns) {
      const cloneColumns = deepCopy(columns);
      return cloneColumns.map((item) => {
        if ("children" in item)
          this.makeColumnsId(item.children);
        item.__id = getRandomStr(6);
        return item;
      });
    },
    makeColumns(cols) {
      let columns = deepCopy(getAllColumns(cols));
      let left = [];
      let right = [];
      let center = [];
      columns.forEach((column, index) => {
        column._index = index;
        column._columnKey = columnKey++;
        column.width = parseInt(column.width);
        column._width = column.width ? column.width : "";
        column._sortType = "normal";
        column._filterVisible = false;
        column._isFiltered = false;
        column._filterChecked = [];
        if ("filterMultiple" in column) {
          column._filterMultiple = column.filterMultiple;
        } else {
          column._filterMultiple = true;
        }
        if ("filteredValue" in column) {
          column._filterChecked = column.filteredValue;
          column._isFiltered = true;
        }
        if ("sortType" in column) {
          column._sortType = column.sortType;
        }
        if (column.fixed && column.fixed === "left") {
          left.push(column);
        } else if (column.fixed && column.fixed === "right") {
          right.push(column);
        } else {
          center.push(column);
        }
      });
      return left.concat(center).concat(right);
    },
    makeColumnRows(fixedType, cols) {
      return convertToRows(cols, fixedType);
    },
    exportCsv(params) {
      if (params.filename) {
        if (params.filename.indexOf(".csv") === -1) {
          params.filename += ".csv";
        }
      } else {
        params.filename = "table.csv";
      }
      let columns = [];
      let datas = [];
      if (params.columns && params.data) {
        columns = params.columns;
        datas = params.data;
      } else {
        columns = this.allColumns;
        if (!("original" in params))
          params.original = true;
        datas = params.original ? this.data : this.rebuildData;
      }
      let noHeader = false;
      if ("noHeader" in params)
        noHeader = params.noHeader;
      const data = csv(columns, datas, params, noHeader);
      if (params.callback)
        params.callback(data);
      else
        csv$1.download(params.filename, data);
    },
    dragAndDrop(a, b) {
      this.$emit("on-drag-drop", a, b);
    },
    handleClickContextMenuOutside() {
      this.contextMenuVisible = false;
    },
    handleOnVisibleChange(val) {
      if (val) {
        nextTick(() => {
          this.handleResize();
        });
      }
    },
    addTable(instance) {
      const target = this[instance];
      if (!target)
        return;
      if (!target.tableList)
        target.tableList = [];
      target.tableList.push({
        id: this.id,
        table: this
      });
    },
    removeTable(instance) {
      const target = this[instance];
      if (!target || !target.tableList)
        return;
      const index = target.tableList.findIndex((item) => item.id === this.id);
      target.tableList.splice(index, 1);
    },
    closeContextMenu() {
      this.handleClickContextMenuOutside();
    },
    handleClickDropdownItem() {
      if (this.autoCloseContextmenu)
        this.closeContextMenu();
    }
  },
  created() {
    if (!this.context)
      this.currentContext = this.$parent;
    this.showSlotHeader = this.$slots.header !== void 0;
    this.showSlotFooter = this.$slots.footer !== void 0;
    this.rebuildData = this.makeDataWithSortAndFilter();
  },
  mounted() {
    this.addTable("TabsInstance");
    this.addTable("ModalInstance");
    this.addTable("DrawerInstance");
    this.handleResize();
    nextTick(() => this.ready = true);
    on(window, "resize", this.handleResize);
    this.observer = elementResizeDetectorMaker();
    this.observer.listenTo(this.$el, this.handleResize);
  },
  beforeUnmount() {
    this.removeTable("TabsInstance");
    this.removeTable("ModalInstance");
    this.removeTable("DrawerInstance");
    off(window, "resize", this.handleResize);
    this.observer.removeAllListeners(this.$el);
    this.observer.uninstall(this.$el);
    this.observer = null;
  },
  watch: {
    data: {
      handler() {
        const oldDataLen = this.rebuildData.length;
        this.objData = this.makeObjData();
        this.rebuildData = this.makeDataWithSortAndFilter();
        this.handleResize();
        if (!oldDataLen) {
          this.fixedHeader();
        }
        setTimeout(() => {
          this.cloneData = deepCopy(this.data);
        }, 0);
      },
      deep: true
    },
    columns: {
      handler() {
        const colsWithId = this.makeColumnsId(this.columns);
        this.allColumns = getAllColumns(colsWithId);
        this.cloneColumns = this.makeColumns(colsWithId);
        this.columnRows = this.makeColumnRows(false, colsWithId);
        this.leftFixedColumnRows = this.makeColumnRows("left", colsWithId);
        this.rightFixedColumnRows = this.makeColumnRows("right", colsWithId);
        this.rebuildData = this.makeDataWithSortAndFilter();
        this.handleResize();
      },
      deep: true
    },
    height() {
      this.handleResize();
    },
    maxHeight() {
      this.handleResize();
    },
    showHorizontalScrollBar() {
      this.handleResize();
    },
    showVerticalScrollBar() {
      this.handleResize();
    }
  }
};
const _hoisted_1 = {
  cellspacing: "0",
  cellpadding: "0",
  border: "0"
};
const _hoisted_2 = ["innerHTML"];
const _hoisted_3 = ["innerHTML"];
const _hoisted_4 = {
  class: "ivu-table-resize-line",
  ref: "resizeLine"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_table_head = resolveComponent("table-head");
  const _component_table_body = resolveComponent("table-body");
  const _component_table_summary = resolveComponent("table-summary");
  const _component_DropdownMenu = resolveComponent("DropdownMenu");
  const _component_Dropdown = resolveComponent("Dropdown");
  const _component_Spin = resolveComponent("Spin");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.wrapClasses),
    style: normalizeStyle($options.styles),
    ref: "tableWrap"
  }, [
    createElementVNode("div", {
      class: normalizeClass($options.classes)
    }, [
      $data.showSlotHeader ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass([$data.prefixCls + "-title"]),
        ref: "title"
      }, [
        renderSlot(_ctx.$slots, "header")
      ], 2)) : createCommentVNode("", true),
      $props.showHeader ? (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass([$data.prefixCls + "-header"]),
        ref: "header",
        onMousewheel: _cache[0] || (_cache[0] = (...args) => $options.handleMouseWheel && $options.handleMouseWheel(...args))
      }, [
        createVNode(_component_table_head, {
          "prefix-cls": $data.prefixCls,
          styleObject: $options.tableHeaderStyle,
          columns: $data.cloneColumns,
          "column-rows": $data.columnRows,
          "obj-data": $data.objData,
          "columns-width": $data.columnsWidth,
          data: $data.rebuildData
        }, null, 8, ["prefix-cls", "styleObject", "columns", "column-rows", "obj-data", "columns-width", "data"])
      ], 34)) : createCommentVNode("", true),
      withDirectives(createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-body"]),
        style: normalizeStyle($options.bodyStyle),
        ref: "body",
        onScroll: _cache[1] || (_cache[1] = (...args) => $options.handleBodyScroll && $options.handleBodyScroll(...args))
      }, [
        createVNode(_component_table_body, {
          ref: "tbody",
          draggable: $props.draggable,
          "prefix-cls": $data.prefixCls,
          styleObject: $options.tableStyle,
          columns: $data.cloneColumns,
          data: $data.rebuildData,
          "row-key": $props.rowKey,
          "columns-width": $data.columnsWidth,
          "obj-data": $data.objData
        }, null, 8, ["draggable", "prefix-cls", "styleObject", "columns", "data", "row-key", "columns-width", "obj-data"])
      ], 38), [
        [vShow, !(!!$options.localeNoDataText && (!$props.data || $props.data.length === 0) || !!$options.localeNoFilteredDataText && (!$data.rebuildData || $data.rebuildData.length === 0))]
      ]),
      $props.showSummary && ($props.data && $props.data.length) ? (openBlock(), createBlock(_component_table_summary, {
        key: 2,
        ref: "summary",
        "prefix-cls": $data.prefixCls,
        styleObject: $options.tableStyle,
        columns: $data.cloneColumns,
        data: $options.summaryData,
        "columns-width": $data.columnsWidth
      }, null, 8, ["prefix-cls", "styleObject", "columns", "data", "columns-width"])) : createCommentVNode("", true),
      withDirectives(createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-tip"]),
        style: normalizeStyle($options.bodyStyle),
        onScroll: _cache[2] || (_cache[2] = (...args) => $options.handleBodyScroll && $options.handleBodyScroll(...args))
      }, [
        createElementVNode("table", _hoisted_1, [
          createElementVNode("tbody", null, [
            createElementVNode("tr", null, [
              createElementVNode("td", {
                style: normalizeStyle({ "height": $options.bodyStyle.height, "width": `${$data.headerWidth}px` })
              }, [
                !$props.data || $props.data.length === 0 ? (openBlock(), createElementBlock("span", {
                  key: 0,
                  innerHTML: $options.localeNoDataText
                }, null, 8, _hoisted_2)) : (openBlock(), createElementBlock("span", {
                  key: 1,
                  innerHTML: $options.localeNoFilteredDataText
                }, null, 8, _hoisted_3))
              ], 4)
            ])
          ])
        ])
      ], 38), [
        [vShow, !!$options.localeNoDataText && (!$props.data || $props.data.length === 0) || !!$options.localeNoFilteredDataText && (!$data.rebuildData || $data.rebuildData.length === 0)]
      ]),
      $options.isLeftFixed ? (openBlock(), createElementBlock("div", {
        key: 3,
        class: normalizeClass($options.fixedTableClasses),
        style: normalizeStyle($options.fixedTableStyle)
      }, [
        $props.showHeader ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass($options.fixedHeaderClasses)
        }, [
          createVNode(_component_table_head, {
            fixed: "left",
            "prefix-cls": $data.prefixCls,
            styleObject: $options.fixedTableStyle,
            columns: $options.leftFixedColumns,
            "column-rows": $data.columnRows,
            "fixed-column-rows": $data.leftFixedColumnRows,
            "obj-data": $data.objData,
            "columns-width": $data.columnsWidth,
            data: $data.rebuildData
          }, null, 8, ["prefix-cls", "styleObject", "columns", "column-rows", "fixed-column-rows", "obj-data", "columns-width", "data"])
        ], 2)) : createCommentVNode("", true),
        createElementVNode("div", {
          class: normalizeClass([$data.prefixCls + "-fixed-body"]),
          style: normalizeStyle($options.fixedBodyStyle),
          ref: "fixedBody",
          onMousewheel: _cache[3] || (_cache[3] = (...args) => $options.handleFixedMousewheel && $options.handleFixedMousewheel(...args)),
          "on:DOMMouseScroll": _cache[4] || (_cache[4] = (...args) => $options.handleFixedMousewheel && $options.handleFixedMousewheel(...args))
        }, [
          createVNode(_component_table_body, {
            fixed: "left",
            draggable: $props.draggable,
            "prefix-cls": $data.prefixCls,
            styleObject: $options.fixedTableStyle,
            columns: $options.leftFixedColumns,
            data: $data.rebuildData,
            "row-key": $props.rowKey,
            "columns-width": $data.columnsWidth,
            "obj-data": $data.objData
          }, null, 8, ["draggable", "prefix-cls", "styleObject", "columns", "data", "row-key", "columns-width", "obj-data"])
        ], 38),
        $props.showSummary && ($props.data && $props.data.length) ? (openBlock(), createBlock(_component_table_summary, {
          key: 1,
          fixed: "left",
          "prefix-cls": $data.prefixCls,
          styleObject: $options.fixedTableStyle,
          columns: $options.leftFixedColumns,
          data: $options.summaryData,
          "columns-width": $data.columnsWidth,
          style: normalizeStyle({ "margin-top": $data.showHorizontalScrollBar ? $data.scrollBarWidth + "px" : 0 })
        }, null, 8, ["prefix-cls", "styleObject", "columns", "data", "columns-width", "style"])) : createCommentVNode("", true)
      ], 6)) : createCommentVNode("", true),
      $options.isRightFixed ? (openBlock(), createElementBlock("div", {
        key: 4,
        class: normalizeClass($options.fixedRightTableClasses),
        style: normalizeStyle($options.fixedRightTableStyle)
      }, [
        $props.showHeader ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass($options.fixedHeaderClasses)
        }, [
          createVNode(_component_table_head, {
            fixed: "right",
            "prefix-cls": $data.prefixCls,
            styleObject: $options.fixedRightTableStyle,
            columns: $options.rightFixedColumns,
            "column-rows": $data.columnRows,
            "fixed-column-rows": $data.rightFixedColumnRows,
            "obj-data": $data.objData,
            "columns-width": $data.columnsWidth,
            data: $data.rebuildData
          }, null, 8, ["prefix-cls", "styleObject", "columns", "column-rows", "fixed-column-rows", "obj-data", "columns-width", "data"])
        ], 2)) : createCommentVNode("", true),
        createElementVNode("div", {
          class: normalizeClass([$data.prefixCls + "-fixed-body"]),
          style: normalizeStyle($options.fixedBodyStyle),
          ref: "fixedRightBody",
          onMousewheel: _cache[5] || (_cache[5] = (...args) => $options.handleFixedMousewheel && $options.handleFixedMousewheel(...args)),
          "on:DOMMouseScroll": _cache[6] || (_cache[6] = (...args) => $options.handleFixedMousewheel && $options.handleFixedMousewheel(...args))
        }, [
          createVNode(_component_table_body, {
            fixed: "right",
            draggable: $props.draggable,
            "prefix-cls": $data.prefixCls,
            styleObject: $options.fixedRightTableStyle,
            columns: $options.rightFixedColumns,
            data: $data.rebuildData,
            "row-key": $props.rowKey,
            "columns-width": $data.columnsWidth,
            "obj-data": $data.objData
          }, null, 8, ["draggable", "prefix-cls", "styleObject", "columns", "data", "row-key", "columns-width", "obj-data"])
        ], 38),
        $props.showSummary && ($props.data && $props.data.length) ? (openBlock(), createBlock(_component_table_summary, {
          key: 1,
          fixed: "right",
          "prefix-cls": $data.prefixCls,
          styleObject: $options.fixedRightTableStyle,
          columns: $options.rightFixedColumns,
          data: $options.summaryData,
          "columns-width": $data.columnsWidth,
          style: normalizeStyle({ "margin-top": $data.showHorizontalScrollBar ? $data.scrollBarWidth + "px" : 0 })
        }, null, 8, ["prefix-cls", "styleObject", "columns", "data", "columns-width", "style"])) : createCommentVNode("", true)
      ], 6)) : createCommentVNode("", true),
      $options.isRightFixed ? (openBlock(), createElementBlock("div", {
        key: 5,
        class: normalizeClass([$data.prefixCls + "-fixed-right-header"]),
        style: normalizeStyle($options.fixedRightHeaderStyle)
      }, null, 6)) : createCommentVNode("", true),
      $data.showSlotFooter ? (openBlock(), createElementBlock("div", {
        key: 6,
        class: normalizeClass([$data.prefixCls + "-footer"]),
        ref: "footer"
      }, [
        renderSlot(_ctx.$slots, "footer")
      ], 2)) : createCommentVNode("", true)
    ], 2),
    withDirectives(createElementVNode("div", _hoisted_4, null, 512), [
      [vShow, $data.showResizeLine]
    ]),
    $props.showContextMenu ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: "ivu-table-context-menu",
      style: normalizeStyle($data.contextMenuStyles)
    }, [
      createVNode(_component_Dropdown, {
        trigger: "custom",
        visible: $data.contextMenuVisible,
        transfer: "",
        onOnClick: $options.handleClickDropdownItem,
        onOnClickoutside: $options.handleClickContextMenuOutside
      }, {
        list: withCtx(() => [
          createVNode(_component_DropdownMenu, null, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "contextMenu")
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["visible", "onOnClick", "onOnClickoutside"])
    ], 4)) : createCommentVNode("", true),
    createVNode(_component_Spin, {
      fix: "",
      size: "large",
      show: $props.loading
    }, {
      default: withCtx(() => [
        renderSlot(_ctx.$slots, "loading")
      ]),
      _: 3
    }, 8, ["show"])
  ], 6);
}
var Table = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Table as default };
