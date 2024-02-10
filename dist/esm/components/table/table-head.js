import CheckboxGroup from "../checkbox/checkbox-group.js";
import Checkbox from "../checkbox/checkbox.js";
import Poptip from "../poptip/poptip.js";
import _sfc_main$1 from "../button/button.js";
import renderHeader from "./header.js";
import Mixin from "./mixin.js";
import Locale from "../../mixins/locale.js";
import { isClient } from "../../utils/index.js";
import { resolveComponent, openBlock, createElementBlock, normalizeStyle, createElementVNode, Fragment, renderList, createCommentVNode, normalizeClass, toDisplayString, createBlock, createSlots, withCtx, createVNode, createTextVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "TableHead",
  mixins: [Mixin, Locale],
  components: { CheckboxGroup, Checkbox, Poptip, iButton: _sfc_main$1, renderHeader },
  props: {
    prefixCls: String,
    styleObject: Object,
    columns: Array,
    objData: Object,
    data: Array,
    columnsWidth: Object,
    fixed: {
      type: [Boolean, String],
      default: false
    },
    columnRows: Array,
    fixedColumnRows: Array
  },
  data() {
    return {
      draggingColumn: null,
      dragging: false,
      dragState: {}
    };
  },
  computed: {
    styles() {
      const style = Object.assign({}, this.styleObject);
      const width = parseInt(this.styleObject.width);
      style.width = `${width}px`;
      return style;
    },
    isSelectAll() {
      let isSelectAll = true;
      if (!this.data.length)
        isSelectAll = false;
      let isAllDisabledAndUnSelected = true;
      for (let i in this.objData) {
        const objData = this.objData[i];
        if (!objData._isChecked && !objData._isDisabled) {
          isSelectAll = false;
          break;
        } else if (objData.children && objData.children.length) {
          isSelectAll = this.isChildrenSelected(objData, isSelectAll);
        }
        if (!(objData._isDisabled && !objData._isChecked)) {
          isAllDisabledAndUnSelected = false;
        } else if (objData.children && objData.children.length) {
          isAllDisabledAndUnSelected = this.isChildrenAllDisabledAndUnSelected(objData, isAllDisabledAndUnSelected);
        }
      }
      if (isAllDisabledAndUnSelected)
        isSelectAll = false;
      return isSelectAll;
    },
    headRows() {
      const isGroup = this.columnRows.length > 1;
      if (isGroup) {
        return this.fixed ? this.fixedColumnRows : this.columnRows;
      } else {
        return [this.columns];
      }
    },
    isSelectDisabled() {
      let isSelectDisabled = true;
      if (this.data.length) {
        for (let i in this.objData) {
          const objData = this.objData[i];
          if (!objData._isDisabled) {
            isSelectDisabled = false;
          } else if (objData.children && objData.children.length) {
            isSelectDisabled = this.isChildrenDisabled(objData, isSelectDisabled);
          }
        }
      }
      return isSelectDisabled;
    }
  },
  methods: {
    cellClasses(column) {
      return [
        `${this.prefixCls}-cell`,
        {
          [`${this.prefixCls}-hidden`]: !this.fixed && column.fixed && (column.fixed === "left" || column.fixed === "right"),
          [`${this.prefixCls}-cell-with-selection`]: column.type === "selection"
        }
      ];
    },
    scrollBarCellClass() {
      let hasRightFixed = false;
      for (let i in this.headRows) {
        for (let j in this.headRows[i]) {
          if (this.headRows[i][j].fixed === "right") {
            hasRightFixed = true;
            break;
          }
          if (hasRightFixed)
            break;
        }
      }
      return [
        {
          [`${this.prefixCls}-hidden`]: hasRightFixed
        }
      ];
    },
    itemClasses(column, item) {
      return [
        `${this.prefixCls}-filter-select-item`,
        {
          [`${this.prefixCls}-filter-select-item-selected`]: column._filterChecked[0] === item.value
        }
      ];
    },
    itemAllClasses(column) {
      return [
        `${this.prefixCls}-filter-select-item`,
        {
          [`${this.prefixCls}-filter-select-item-selected`]: !column._filterChecked.length
        }
      ];
    },
    selectAll() {
      const status = !this.isSelectAll;
      this.$parent.selectAll(status);
    },
    handleSort(index, type) {
      const column = this.columns.find((item) => item._index === index);
      const _index = column._index;
      if (column._sortType === type) {
        type = "normal";
      }
      this.$parent.handleSort(_index, type);
    },
    handleSortByHead(index) {
      const column = this.columns.find((item) => item._index === index);
      if (column.sortable) {
        const type = column._sortType;
        if (type === "normal") {
          this.handleSort(index, "asc");
        } else if (type === "asc") {
          this.handleSort(index, "desc");
        } else {
          this.handleSort(index, "normal");
        }
      }
    },
    handleFilter(index) {
      this.$parent.handleFilter(index);
    },
    handleSelect(index, value) {
      this.$parent.handleFilterSelect(index, value);
    },
    handleReset(index) {
      this.$parent.handleFilterReset(index);
    },
    handleFilterHide(index) {
      this.$parent.handleFilterHide(index);
    },
    getColumn(rowIndex, index) {
      const isGroup = this.columnRows.length > 1;
      if (isGroup) {
        const id = this.headRows[rowIndex][index].__id;
        return this.columns.filter((item) => item.__id === id)[0];
      } else {
        return this.headRows[rowIndex][index];
      }
    },
    handleMouseDown(column, event) {
      if (this.$isServer)
        return;
      if (isClient && this.draggingColumn) {
        this.dragging = true;
        const table = this.$parent;
        const tableEl = table.$el;
        const tableLeft = tableEl.getBoundingClientRect().left;
        const columnEl = this.$el.querySelector(`th.ivu-table-column-${column.__id}`);
        const columnRect = columnEl.getBoundingClientRect();
        const minLeft = columnRect.left - tableLeft + 30;
        table.showResizeLine = true;
        this.dragState = {
          startMouseLeft: event.clientX,
          startLeft: columnRect.right - tableLeft,
          startColumnLeft: columnRect.left - tableLeft,
          tableLeft
        };
        const resizeProxy = table.$refs.resizeLine;
        resizeProxy.style.left = this.dragState.startLeft + "px";
        document.onselectstart = function() {
          return false;
        };
        document.ondragstart = function() {
          return false;
        };
        const handleMouseMove = (event2) => {
          const deltaLeft = event2.clientX - this.dragState.startMouseLeft;
          const proxyLeft = this.dragState.startLeft + deltaLeft;
          resizeProxy.style.left = Math.max(minLeft, proxyLeft) + "px";
        };
        const handleMouseUp = () => {
          if (this.dragging) {
            const {
              startColumnLeft,
              startLeft
            } = this.dragState;
            const finalLeft = parseInt(resizeProxy.style.left, 10);
            const columnWidth = finalLeft - startColumnLeft;
            const _column = table.allColumns.find((item) => item.__id === column.__id);
            if (_column) {
              _column.width = columnWidth;
              column.width = columnWidth;
              table.handleResize();
            }
            table.$emit("on-column-width-resize", _column.width, startLeft - startColumnLeft, column, event);
            isClient && (document.body.style.cursor = "");
            this.dragging = false;
            this.draggingColumn = null;
            this.dragState = {};
            table.showResizeLine = false;
          }
          if (!isClient)
            return;
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
          document.onselectstart = null;
          document.ondragstart = null;
        };
        if (!isClient)
          return;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    },
    handleMouseMove(column, event) {
      let target = event.target;
      while (target && target.tagName !== "TH") {
        target = target.parentNode;
      }
      if (!column || !column.resizable)
        return;
      if (isClient && !this.dragging) {
        let rect = target.getBoundingClientRect();
        const bodyStyle = document.body.style;
        if (rect.width > 12 && rect.right - event.pageX < 8) {
          bodyStyle.cursor = "col-resize";
          this.draggingColumn = column;
        } else if (!this.dragging) {
          bodyStyle.cursor = "";
          this.draggingColumn = null;
        }
      }
    },
    handleMouseOut() {
      if (this.$isServer)
        return;
      isClient && (document.body.style.cursor = "");
    },
    isChildrenSelected(objData, isSelectAll) {
      let status = isSelectAll;
      if (objData.children && objData.children.length) {
        objData.children.forEach((row) => {
          if (!row._isChecked && !row._isDisabled) {
            status = false;
          } else if (row.children && row.children.length) {
            status = this.isChildrenSelected(row, status);
          }
        });
      }
      return status;
    },
    isChildrenAllDisabledAndUnSelected(objData, isAllDisabledAndUnSelected) {
      let status = isAllDisabledAndUnSelected;
      if (objData.children && objData.children.length) {
        objData.children.forEach((row) => {
          if (!(row._isDisabled && !row._isChecked)) {
            status = false;
          } else if (row.children && row.children.length) {
            status = this.isChildrenAllDisabledAndUnSelected(row, status);
          }
        });
      }
      return status;
    },
    isChildrenDisabled(objData, isSelectDisabled) {
      let status = isSelectDisabled;
      if (objData.children && objData.children.length) {
        objData.children.forEach((row) => {
          if (!row._isDisabled) {
            status = false;
          } else if (row.children && row.children.length) {
            status = this.isChildrenDisabled(row, status);
          }
        });
      }
      return status;
    }
  }
};
const _hoisted_1 = ["width"];
const _hoisted_2 = ["width"];
const _hoisted_3 = ["colspan", "rowspan"];
const _hoisted_4 = { key: 0 };
const _hoisted_5 = ["onClick"];
const _hoisted_6 = ["onClick"];
const _hoisted_7 = ["onClick"];
const _hoisted_8 = ["onMousedown", "onMousemove"];
const _hoisted_9 = ["rowspan"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_render_header = resolveComponent("render-header");
  const _component_Checkbox = resolveComponent("Checkbox");
  const _component_checkbox = resolveComponent("checkbox");
  const _component_checkbox_group = resolveComponent("checkbox-group");
  const _component_i_button = resolveComponent("i-button");
  const _component_Poptip = resolveComponent("Poptip");
  return openBlock(), createElementBlock("table", {
    cellspacing: "0",
    cellpadding: "0",
    border: "0",
    style: normalizeStyle($options.styles)
  }, [
    createElementVNode("colgroup", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($props.columns, (column, index) => {
        return openBlock(), createElementBlock("col", {
          key: index,
          width: _ctx.setCellWidth(column)
        }, null, 8, _hoisted_1);
      }), 128)),
      _ctx.$parent.showVerticalScrollBar ? (openBlock(), createElementBlock("col", {
        key: 0,
        width: _ctx.$parent.scrollBarWidth
      }, null, 8, _hoisted_2)) : createCommentVNode("", true)
    ]),
    createElementVNode("thead", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($options.headRows, (cols, rowIndex) => {
        return openBlock(), createElementBlock("tr", { key: rowIndex }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(cols, (column, index) => {
            return openBlock(), createElementBlock("th", {
              key: index,
              colspan: column.colSpan,
              rowspan: column.rowSpan,
              class: normalizeClass(_ctx.alignCls(column))
            }, [
              createElementVNode("div", {
                class: normalizeClass($options.cellClasses(column))
              }, [
                column.type === "expand" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                  !column.renderHeader ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(column.title || ""), 1)) : (openBlock(), createBlock(_component_render_header, {
                    key: 1,
                    render: column.renderHeader,
                    column,
                    index
                  }, null, 8, ["render", "column", "index"]))
                ], 64)) : column.type === "selection" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                  !column.hideSelectAll ? (openBlock(), createBlock(_component_Checkbox, {
                    key: 0,
                    "model-value": $options.isSelectAll,
                    disabled: $options.isSelectDisabled,
                    onOnChange: $options.selectAll
                  }, null, 8, ["model-value", "disabled", "onOnChange"])) : createCommentVNode("", true)
                ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
                  !column.renderHeader ? (openBlock(), createElementBlock("span", {
                    key: 0,
                    class: normalizeClass({ [$props.prefixCls + "-cell-sort"]: column.sortable }),
                    onClick: ($event) => column.sortable && $options.handleSortByHead($options.getColumn(rowIndex, index)._index)
                  }, toDisplayString(column.title || "#"), 11, _hoisted_5)) : (openBlock(), createBlock(_component_render_header, {
                    key: 1,
                    render: column.renderHeader,
                    column,
                    index
                  }, null, 8, ["render", "column", "index"])),
                  column.sortable ? (openBlock(), createElementBlock("span", {
                    key: 2,
                    class: normalizeClass([$props.prefixCls + "-sort"])
                  }, [
                    createElementVNode("i", {
                      class: normalizeClass(["ivu-icon ivu-icon-md-arrow-dropup", { on: $options.getColumn(rowIndex, index)._sortType === "asc" }]),
                      onClick: ($event) => $options.handleSort($options.getColumn(rowIndex, index)._index, "asc")
                    }, null, 10, _hoisted_6),
                    createElementVNode("i", {
                      class: normalizeClass(["ivu-icon ivu-icon-md-arrow-dropdown", { on: $options.getColumn(rowIndex, index)._sortType === "desc" }]),
                      onClick: ($event) => $options.handleSort($options.getColumn(rowIndex, index)._index, "desc")
                    }, null, 10, _hoisted_7)
                  ], 2)) : createCommentVNode("", true),
                  _ctx.isPopperShow(column) ? (openBlock(), createBlock(_component_Poptip, {
                    key: 3,
                    modelValue: $options.getColumn(rowIndex, index)._filterVisible,
                    "onUpdate:modelValue": ($event) => $options.getColumn(rowIndex, index)._filterVisible = $event,
                    placement: "bottom",
                    "popper-class": "ivu-table-popper",
                    transfer: "",
                    capture: false,
                    onOnPopperHide: ($event) => $options.handleFilterHide($options.getColumn(rowIndex, index)._index)
                  }, createSlots({
                    default: withCtx(() => [
                      createElementVNode("span", {
                        class: normalizeClass([$props.prefixCls + "-filter"])
                      }, [
                        createElementVNode("i", {
                          class: normalizeClass(["ivu-icon ivu-icon-ios-funnel", { on: $options.getColumn(rowIndex, index)._isFiltered }])
                        }, null, 2)
                      ], 2)
                    ]),
                    _: 2
                  }, [
                    $options.getColumn(rowIndex, index)._filterMultiple ? {
                      name: "content",
                      fn: withCtx(() => [
                        createElementVNode("div", {
                          class: normalizeClass([$props.prefixCls + "-filter-list"])
                        }, [
                          createElementVNode("div", {
                            class: normalizeClass([$props.prefixCls + "-filter-list-item"])
                          }, [
                            createVNode(_component_checkbox_group, {
                              modelValue: $options.getColumn(rowIndex, index)._filterChecked,
                              "onUpdate:modelValue": ($event) => $options.getColumn(rowIndex, index)._filterChecked = $event
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createElementBlock(Fragment, null, renderList(column.filters, (item, index2) => {
                                  return openBlock(), createBlock(_component_checkbox, {
                                    key: index2,
                                    label: item.value
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(item.label), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["label"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1032, ["modelValue", "onUpdate:modelValue"])
                          ], 2),
                          createElementVNode("div", {
                            class: normalizeClass([$props.prefixCls + "-filter-footer"])
                          }, [
                            createVNode(_component_i_button, {
                              type: "text",
                              size: "small",
                              disabled: !$options.getColumn(rowIndex, index)._filterChecked.length,
                              onClick: ($event) => $options.handleFilter($options.getColumn(rowIndex, index)._index)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(_ctx.t("i.table.confirmFilter")), 1)
                              ]),
                              _: 2
                            }, 1032, ["disabled", "onClick"]),
                            createVNode(_component_i_button, {
                              type: "text",
                              size: "small",
                              onClick: ($event) => $options.handleReset($options.getColumn(rowIndex, index)._index)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(_ctx.t("i.table.resetFilter")), 1)
                              ]),
                              _: 2
                            }, 1032, ["onClick"])
                          ], 2)
                        ], 2)
                      ]),
                      key: "0"
                    } : {
                      name: "content",
                      fn: withCtx(() => [
                        createElementVNode("div", {
                          class: normalizeClass([$props.prefixCls + "-filter-list"])
                        }, [
                          createElementVNode("ul", {
                            class: normalizeClass([$props.prefixCls + "-filter-list-single"])
                          }, [
                            createElementVNode("li", {
                              class: normalizeClass($options.itemAllClasses($options.getColumn(rowIndex, index))),
                              onClick: ($event) => $options.handleReset($options.getColumn(rowIndex, index)._index)
                            }, toDisplayString(_ctx.t("i.table.clearFilter")), 11, ["onClick"]),
                            (openBlock(true), createElementBlock(Fragment, null, renderList(column.filters, (item) => {
                              return openBlock(), createElementBlock("li", {
                                class: normalizeClass($options.itemClasses($options.getColumn(rowIndex, index), item)),
                                key: item.value,
                                onClick: ($event) => $options.handleSelect($options.getColumn(rowIndex, index)._index, item.value)
                              }, toDisplayString(item.label), 11, ["onClick"]);
                            }), 128))
                          ], 2)
                        ], 2)
                      ]),
                      key: "1"
                    }
                  ]), 1032, ["modelValue", "onUpdate:modelValue", "onOnPopperHide"])) : createCommentVNode("", true)
                ], 64))
              ], 2),
              column.resizable ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "ivu-table-header-resizable",
                onMousedown: ($event) => $options.handleMouseDown(column, $event),
                onMousemove: ($event) => $options.handleMouseMove(column, $event),
                onMouseout: _cache[0] || (_cache[0] = (...args) => $options.handleMouseOut && $options.handleMouseOut(...args))
              }, null, 40, _hoisted_8)) : createCommentVNode("", true)
            ], 10, _hoisted_3);
          }), 128)),
          _ctx.$parent.showVerticalScrollBar && rowIndex === 0 ? (openBlock(), createElementBlock("th", {
            key: 0,
            class: normalizeClass($options.scrollBarCellClass()),
            rowspan: $options.headRows.length
          }, null, 10, _hoisted_9)) : createCommentVNode("", true)
        ]);
      }), 128))
    ])
  ], 4);
}
var tableHead = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { tableHead as default };
