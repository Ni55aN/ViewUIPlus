import { nextTick, resolveComponent, openBlock, createElementBlock, normalizeClass, Fragment, renderList, createBlock, withModifiers, createCommentVNode } from "vue";
import Casitem from "./casitem.js";
import { findComponentUpward } from "../../utils/assist.js";
import random from "../../utils/random_str.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
let key = 1;
const _sfc_main = {
  name: "Caspanel",
  components: { Casitem },
  inject: ["CascaderInstance"],
  provide() {
    return {
      CaspanelInstance: this
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: Boolean,
    changeOnSelect: Boolean,
    trigger: String,
    prefixCls: String
  },
  data() {
    return {
      tmpItem: {},
      result: [],
      sublist: [],
      id: random(6),
      childCaspanelList: []
    };
  },
  watch: {
    data() {
      this.sublist = [];
    }
  },
  methods: {
    handleClickItem(item) {
      if (this.trigger !== "click" && item.children && item.children.length)
        return;
      this.handleTriggerItem(item, false, true);
    },
    handleHoverItem(item) {
      if (this.trigger !== "hover" || !item.children || !item.children.length)
        return;
      this.handleTriggerItem(item, false, true);
    },
    handleTriggerItem(item, fromInit = false, fromUser = false) {
      if (item.disabled)
        return;
      const cascader = findComponentUpward(this, "Cascader");
      if (item.loading !== void 0 && !item.children.length) {
        if (cascader && cascader.loadData) {
          cascader.loadData(item, () => {
            if (fromUser) {
              cascader.isLoadedChildren = true;
            }
            if (item.children.length) {
              this.handleTriggerItem(item);
            }
          });
          return;
        }
      }
      const backItem = this.getBaseItem(item);
      if (this.changeOnSelect || (backItem.label !== this.tmpItem.label || backItem.value !== this.tmpItem.value) || backItem.label === this.tmpItem.label && backItem.value === this.tmpItem.value) {
        this.tmpItem = backItem;
        this.emitUpdate([backItem]);
      }
      if (item.children && item.children.length) {
        this.sublist = item.children;
        this.CascaderInstance.handleOnResultChange({
          lastValue: false,
          changeOnSelect: this.changeOnSelect,
          fromInit
        });
        if (this.changeOnSelect) {
          if (this.childCaspanelList.length) {
            const Caspanel2 = this.childCaspanelList[0].caspanel;
            Caspanel2.handleOnClear(true);
          }
        }
      } else {
        this.sublist = [];
        this.CascaderInstance.handleOnResultChange({
          lastValue: true,
          changeOnSelect: this.changeOnSelect,
          fromInit
        });
      }
      if (cascader) {
        cascader.$refs.drop.update();
      }
    },
    updateResult(item) {
      this.result = [this.tmpItem].concat(item);
      this.emitUpdate(this.result);
    },
    getBaseItem(item) {
      let backItem = Object.assign({}, item);
      if (backItem.children) {
        delete backItem.children;
      }
      return backItem;
    },
    emitUpdate(result) {
      if (this.$parent.$options.name === "Caspanel") {
        this.$parent.updateResult(result);
      } else {
        this.CascaderInstance.updateResult(result);
      }
    },
    getKey() {
      return key++;
    },
    handleOnFindSelected(params) {
      const val = params.value;
      let value = [...val];
      for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < this.data.length; j++) {
          if (value[i] === this.data[j].value) {
            this.handleTriggerItem(this.data[j], true);
            value.splice(0, 1);
            nextTick(() => {
              if (this.childCaspanelList.length) {
                const Caspanel2 = this.childCaspanelList[0].caspanel;
                Caspanel2.handleOnFindSelected({
                  value
                });
              }
            });
            return false;
          }
        }
      }
    },
    handleOnClear(deep = false) {
      this.sublist = [];
      this.tmpItem = {};
      if (deep) {
        if (this.childCaspanelList.length) {
          const Caspanel2 = this.childCaspanelList[0].caspanel;
          Caspanel2.handleOnClear(true);
        }
      }
    },
    addCaspanel() {
      const root = this.CascaderInstance;
      if (!root.caspanelList)
        root.caspanelList = [];
      root.caspanelList.push({
        id: this.id,
        caspanel: this
      });
      const parentCaspanel = findComponentUpward(this, "Caspanel");
      if (parentCaspanel) {
        if (!parentCaspanel.childCaspanelList)
          parentCaspanel.childCaspanelList = [];
        parentCaspanel.childCaspanelList.push({
          id: this.id,
          caspanel: this
        });
      }
    },
    removeCaspanel() {
      const root = this.CascaderInstance;
      if (root.caspanelList && root.caspanelList.length) {
        const index = root.caspanelList.findIndex((item) => item.id === this.id);
        root.caspanelList.splice(index, 1);
      }
      const parentCaspanel = findComponentUpward(this, "Caspanel");
      if (parentCaspanel) {
        if (parentCaspanel.childCaspanelList && parentCaspanel.childCaspanelList.length) {
          const index = parentCaspanel.childCaspanelList.findIndex((item) => item.id === this.id);
          parentCaspanel.childCaspanelList.splice(index, 1);
        }
      }
    }
  },
  mounted() {
    this.addCaspanel();
  },
  beforeUnmount() {
    this.removeCaspanel();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Casitem = resolveComponent("Casitem");
  const _component_Caspanel = resolveComponent("Caspanel", true);
  return openBlock(), createElementBlock("span", null, [
    $props.data && $props.data.length ? (openBlock(), createElementBlock("ul", {
      key: 0,
      class: normalizeClass([$props.prefixCls + "-menu"])
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($props.data, (item, index) => {
        return openBlock(), createBlock(_component_Casitem, {
          key: index,
          "prefix-cls": $props.prefixCls,
          data: item,
          "tmp-item": $data.tmpItem,
          onClick: withModifiers(($event) => $options.handleClickItem(item), ["stop"]),
          onMouseenter: withModifiers(($event) => $options.handleHoverItem(item), ["stop"])
        }, null, 8, ["prefix-cls", "data", "tmp-item", "onClick", "onMouseenter"]);
      }), 128))
    ], 2)) : createCommentVNode("", true),
    $data.sublist && $data.sublist.length ? (openBlock(), createBlock(_component_Caspanel, {
      key: 1,
      "prefix-cls": $props.prefixCls,
      data: $data.sublist,
      disabled: $props.disabled,
      trigger: $props.trigger,
      "change-on-select": $props.changeOnSelect
    }, null, 8, ["prefix-cls", "data", "disabled", "trigger", "change-on-select"])) : createCommentVNode("", true)
  ]);
}
var Caspanel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Caspanel as default };
