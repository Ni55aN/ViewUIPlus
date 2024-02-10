import { openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  props: {
    row: Object,
    prefixCls: String,
    draggable: Boolean,
    isChildren: Boolean
  },
  computed: {
    objData() {
      return this.$parent.objData;
    }
  },
  methods: {
    onDrag(e, index) {
      e.dataTransfer.setData("index", index);
    },
    onDrop(e, index) {
      const dragIndex = e.dataTransfer.getData("index");
      this.$parent.$parent.dragAndDrop(dragIndex, index);
      e.preventDefault();
    },
    allowDrop(e) {
      e.preventDefault();
    },
    rowClasses(_index) {
      const objData = this.isChildren ? this.$parent.$parent.getDataByRowKey(this.row._rowKey) : this.objData[_index];
      return [
        `${this.prefixCls}-row`,
        this.rowClsName(_index),
        {
          [`${this.prefixCls}-row-highlight`]: objData && objData._isHighlight,
          [`${this.prefixCls}-row-hover`]: objData && objData._isHover
        }
      ];
    },
    rowClsName(_index) {
      return this.$parent.$parent.rowClassName(this.objData[_index], _index);
    }
  }
};
const _hoisted_1 = ["draggable"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return $props.draggable ? (openBlock(), createElementBlock("tr", {
    key: 0,
    class: normalizeClass($options.rowClasses($props.row._index)),
    draggable: $props.draggable,
    onDragstart: _cache[0] || (_cache[0] = ($event) => $options.onDrag($event, $props.row._index)),
    onDrop: _cache[1] || (_cache[1] = ($event) => $options.onDrop($event, $props.row._index)),
    onDragover: _cache[2] || (_cache[2] = ($event) => $options.allowDrop($event))
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 42, _hoisted_1)) : (openBlock(), createElementBlock("tr", {
    key: 1,
    class: normalizeClass($options.rowClasses($props.row._index)),
    draggable: false
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2));
}
var TableTr = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TableTr as default };
