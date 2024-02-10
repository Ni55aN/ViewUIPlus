import { getCurrentInstance, nextTick, resolveComponent, openBlock, createElementBlock, normalizeClass, createVNode, withCtx, withModifiers, createElementVNode, Fragment, renderList, toDisplayString, createCommentVNode, createTextVNode, createBlock, renderSlot, withDirectives, vShow } from "vue";
import Dropdown from "../dropdown/dropdown.js";
import DropdownMenu from "../dropdown/dropdown-menu.js";
import Select from "../select/select.js";
import iOption from "../select/option.js";
import Tag from "../tag/tag.js";
import Icon from "../icon/icon.js";
import RadioGroup from "../radio/radio-group.js";
import Radio from "../radio/radio.js";
import provinceData from "./province.js";
import cityData from "./city2.js";
import { oneOf, deepCopy } from "../../utils/assist.js";
import mixinsForm from "../../mixins/form.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
function getCityName(name) {
  return name.replace("\u5E02", "").replace("\u5730\u533A", "").replace("\u7279\u522B\u884C\u653F\u533A", "");
}
function handleGetCities() {
  const cData = deepCopy(cityData);
  const cities = [];
  for (let cid in cData) {
    const city = cData[cid];
    city.n = getCityName(city.n);
    cities.push(city);
  }
  return cities;
}
function handleGetCodeByName(cities, name) {
  if (!name)
    return "";
  const info = cities.find((item) => item.n === name);
  if (info) {
    return info.c;
  } else {
    console.error(`[View UI warn]: City name error.`);
    return "";
  }
}
function handleGetNameByCode(cities, code) {
  const info = cities.find((item) => item.c === code);
  return info.n;
}
const _sfc_main = {
  name: "City",
  mixins: [mixinsForm],
  components: { Dropdown, DropdownMenu, Select, Option: iOption, Tag, Icon, RadioGroup, Radio },
  emits: ["on-change", "update:modelValue"],
  props: {
    modelValue: {
      type: String
    },
    useName: {
      type: Boolean,
      default: false
    },
    cities: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    showSuffix: {
      type: Boolean,
      default: false
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
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? false : global.$VIEWUI.transfer;
      }
    },
    name: {
      type: String
    },
    elementId: {
      type: String
    },
    placeholder: {
      type: String,
      default: "\u8BF7\u9009\u62E9"
    },
    searchPlaceholder: {
      type: String,
      default: "\u8F93\u5165\u57CE\u5E02\u540D\u79F0\u641C\u7D22"
    },
    transferClassName: {
      type: String
    }
  },
  data() {
    const allCities = handleGetCities();
    const value = this.useName ? handleGetCodeByName(allCities, this.modelValue) : this.modelValue;
    return {
      currentValue: value,
      visible: false,
      provinceList: [],
      cityListByProvince: [],
      cityListByLetter: {},
      allCities,
      listType: "province",
      queryCity: ""
    };
  },
  watch: {
    modelValue(val) {
      const value = this.useName ? handleGetCodeByName(this.allCities, val) : val;
      this.currentValue = value;
    }
  },
  computed: {
    showCloseIcon() {
      return this.currentValue && this.clearable && !this.itemDisabled;
    },
    classes() {
      return [
        {
          ["ivu-city-show-clear"]: this.showCloseIcon,
          [`ivu-city-size-${this.size}`]: !!this.size,
          ["ivu-city-visible"]: this.visible,
          ["ivu-city-disabled"]: this.itemDisabled
        }
      ];
    },
    transferClasses() {
      let classes = "ivu-city-transfer";
      if (this.transferClassName)
        classes += ` ${this.transferClassName}`;
      return classes;
    },
    relCities() {
      const cities = [];
      if (this.cities.length) {
        this.cities.forEach((item) => {
          const newItem = cityData[item];
          newItem.n = getCityName(newItem.n);
          cities.push(newItem);
        });
      }
      return cities;
    },
    codeToName() {
      if (!this.currentValue)
        return this.placeholder;
      const n = cityData[this.currentValue].n;
      return this.showSuffix ? n : getCityName(n);
    }
  },
  methods: {
    handleSelect(val) {
      if (val) {
        this.handleChangeValue(val);
        nextTick(() => {
          this.queryCity = "";
        });
      }
    },
    handleChangeValue(val) {
      this.currentValue = val;
      this.visible = false;
      const value = this.useName ? handleGetNameByCode(this.allCities, val) : val;
      this.$emit("update:modelValue", value);
      this.$emit("on-change", cityData[val]);
      this.handleFormItemChange("change", val);
    },
    handleClickLetter(l) {
      let letter = l;
      if (letter === "\u76F4\u8F96\u5E02")
        letter = "Z1";
      else if (letter === "\u6E2F\u6FB3")
        letter = "Z2";
      const className = `.ivu-city-${letter}`;
      const $list = this.$refs.list;
      const $letter = $list.querySelectorAll(className)[0];
      const offsetTop = $letter.offsetTop;
      const listTop = $list.offsetTop;
      $list.scrollTop = offsetTop - listTop;
    },
    clearSelect() {
      if (this.itemDisabled)
        return false;
    },
    handleToggleOpen() {
      if (this.itemDisabled)
        return false;
      this.visible = !this.visible;
    },
    handleVisibleChange(visible) {
      this.visible = visible;
    },
    handleClickOutside(e) {
      if (this.$refs.city.contains(e.target))
        return;
      this.visible = false;
    },
    handleGetProvinceByLetter() {
      const provinces = {
        A: {
          n: "A",
          p: [],
          c: []
        },
        F: {
          n: "F",
          p: [],
          c: []
        },
        G: {
          n: "G",
          p: [],
          c: []
        },
        H: {
          n: "H",
          p: [],
          c: []
        },
        J: {
          n: "J",
          p: [],
          c: []
        },
        L: {
          n: "L",
          p: [],
          c: []
        },
        N: {
          n: "N",
          p: [],
          c: []
        },
        Q: {
          n: "Q",
          p: [],
          c: []
        },
        S: {
          n: "S",
          p: [],
          c: []
        },
        T: {
          n: "T",
          p: [],
          c: []
        },
        X: {
          n: "X",
          p: [],
          c: []
        },
        Y: {
          n: "Y",
          p: [],
          c: []
        },
        Z: {
          n: "Z",
          p: [],
          c: []
        },
        Z1: {
          n: "\u76F4\u8F96\u5E02",
          p: [],
          c: []
        },
        Z2: {
          n: "\u6E2F\u6FB3",
          p: [],
          c: []
        }
      };
      for (let c in provinceData) {
        const item = provinceData[c];
        provinces[item.l].p.push(item);
      }
      this.provinceList = provinces;
    },
    handleGetCityByProvince() {
      const provinceList = deepCopy(this.provinceList);
      const cityListByProvince = [];
      const cData = deepCopy(cityData);
      const otherCities = [
        {
          p: {
            n: "\u76F4\u8F96\u5E02",
            p: "86",
            l: "Z1"
          },
          c: []
        },
        {
          p: {
            n: "\u6E2F\u6FB3",
            p: "86",
            l: "Z2"
          },
          c: []
        }
      ];
      for (let letter in provinceList) {
        const letterProvince = provinceList[letter];
        for (let i = 0; i < letterProvince.p.length; i++) {
          const province = letterProvince.p[i];
          const pid = province.c;
          const provinceCities = {
            p: province,
            c: []
          };
          for (let cid in cData) {
            const city = cData[cid];
            city.n = getCityName(city.n);
            if (pid === city.p) {
              provinceCities.c.push(city);
            }
          }
          if (letter === "Z1") {
            otherCities[0].c.push(cData[pid]);
          } else if (letter === "Z2") {
            otherCities[1].c.push(cData[pid]);
          } else {
            cityListByProvince.push(provinceCities);
          }
        }
      }
      this.cityListByProvince = cityListByProvince.concat(otherCities);
    },
    handleGetCityByLetter() {
      const cData = deepCopy(cityData);
      const cityListByLetter = {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        G: [],
        H: [],
        J: [],
        K: [],
        L: [],
        M: [],
        N: [],
        P: [],
        Q: [],
        R: [],
        S: [],
        T: [],
        W: [],
        X: [],
        Y: [],
        Z: []
      };
      for (let cid in cData) {
        const city = cData[cid];
        city.n = getCityName(city.n);
        cityListByLetter[city.l].push(city);
      }
      this.cityListByLetter = cityListByLetter;
    }
  },
  created() {
    this.handleGetProvinceByLetter();
    this.handleGetCityByProvince();
    this.handleGetCityByLetter();
  }
};
const _hoisted_1 = ["name", "value"];
const _hoisted_2 = { class: "ivu-city-drop" };
const _hoisted_3 = {
  key: 0,
  class: "ivu-city-drop-cities"
};
const _hoisted_4 = ["onClick"];
const _hoisted_5 = { class: "ivu-city-drop-menu" };
const _hoisted_6 = { class: "ivu-city-drop-type" };
const _hoisted_7 = { class: "ivu-city-drop-search" };
const _hoisted_8 = {
  key: 1,
  class: "ivu-city-drop-list"
};
const _hoisted_9 = { class: "ivu-city-drop-list-letter" };
const _hoisted_10 = {
  class: "ivu-city-drop-list-main",
  ref: "list"
};
const _hoisted_11 = ["onClick"];
const _hoisted_12 = {
  key: 2,
  class: "ivu-city-drop-list"
};
const _hoisted_13 = { class: "ivu-city-drop-list-letter" };
const _hoisted_14 = {
  class: "ivu-city-drop-list-main ivu-city-drop-list-main-city",
  ref: "list"
};
const _hoisted_15 = ["onClick"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_Radio = resolveComponent("Radio");
  const _component_RadioGroup = resolveComponent("RadioGroup");
  const _component_Option = resolveComponent("Option");
  const _component_Select = resolveComponent("Select");
  const _component_Tag = resolveComponent("Tag");
  const _component_DropdownMenu = resolveComponent("DropdownMenu");
  const _component_Dropdown = resolveComponent("Dropdown");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["ivu-city", $options.classes]),
    ref: "city"
  }, [
    createVNode(_component_Dropdown, {
      trigger: "custom",
      visible: $data.visible,
      transfer: $props.transfer,
      placement: "bottom-start",
      "transfer-class-name": $options.transferClasses,
      onOnVisibleChange: $options.handleVisibleChange,
      onOnClickoutside: $options.handleClickOutside
    }, {
      list: withCtx(() => [
        createVNode(_component_DropdownMenu, {
          onClick: _cache[3] || (_cache[3] = withModifiers(() => {
          }, ["stop"]))
        }, {
          default: withCtx(() => [
            createElementVNode("div", _hoisted_2, [
              $props.cities.length ? (openBlock(), createElementBlock("div", _hoisted_3, [
                (openBlock(true), createElementBlock(Fragment, null, renderList($options.relCities, (item) => {
                  return openBlock(), createElementBlock("span", {
                    key: item.n,
                    onClick: ($event) => $options.handleChangeValue(item.c)
                  }, toDisplayString(item.n), 9, _hoisted_4);
                }), 128))
              ])) : createCommentVNode("", true),
              createElementVNode("div", _hoisted_5, [
                createElementVNode("div", _hoisted_6, [
                  createVNode(_component_RadioGroup, {
                    modelValue: $data.listType,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.listType = $event),
                    type: "button",
                    size: "small"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_Radio, { label: "province" }, {
                        default: withCtx(() => [
                          createTextVNode("\u6309\u7701\u4EFD")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Radio, { label: "city" }, {
                        default: withCtx(() => [
                          createTextVNode("\u6309\u57CE\u5E02")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                createElementVNode("div", _hoisted_7, [
                  createVNode(_component_Select, {
                    modelValue: $data.queryCity,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.queryCity = $event),
                    filterable: "",
                    size: "small",
                    transfer: "",
                    placeholder: $props.searchPlaceholder,
                    onOnChange: $options.handleSelect
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createElementBlock(Fragment, null, renderList($data.allCities, (item) => {
                        return openBlock(), createBlock(_component_Option, {
                          value: item.c,
                          key: item.c
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(item.n), 1)
                          ]),
                          _: 2
                        }, 1032, ["value"]);
                      }), 128))
                    ]),
                    _: 1
                  }, 8, ["modelValue", "placeholder", "onOnChange"])
                ])
              ]),
              $data.listType === "province" ? (openBlock(), createElementBlock("div", _hoisted_8, [
                createElementVNode("div", _hoisted_9, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList($data.provinceList, (item) => {
                    return openBlock(), createBlock(_component_Tag, {
                      onClick: ($event) => $options.handleClickLetter(item.n),
                      type: "border",
                      fade: false,
                      key: item.n
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(item.n), 1)
                      ]),
                      _: 2
                    }, 1032, ["onClick"]);
                  }), 128))
                ]),
                createElementVNode("div", _hoisted_10, [
                  createElementVNode("dl", null, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList($data.cityListByProvince, (item) => {
                      return openBlock(), createElementBlock(Fragment, {
                        key: item.p.n
                      }, [
                        createElementVNode("dt", {
                          class: normalizeClass("ivu-city-" + item.p.l)
                        }, toDisplayString(item.p.n) + "\uFF1A", 3),
                        createElementVNode("dd", null, [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(item.c, (city) => {
                            return openBlock(), createElementBlock("li", {
                              key: city.n,
                              onClick: ($event) => $options.handleChangeValue(city.c)
                            }, toDisplayString(city.n), 9, _hoisted_11);
                          }), 128))
                        ])
                      ], 64);
                    }), 128))
                  ])
                ], 512)
              ])) : createCommentVNode("", true),
              $data.listType === "city" ? (openBlock(), createElementBlock("div", _hoisted_12, [
                createElementVNode("div", _hoisted_13, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList($data.cityListByLetter, (item, key) => {
                    return openBlock(), createBlock(_component_Tag, {
                      onClick: ($event) => $options.handleClickLetter(key),
                      type: "border",
                      fade: false,
                      key
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(key), 1)
                      ]),
                      _: 2
                    }, 1032, ["onClick"]);
                  }), 128))
                ]),
                createElementVNode("div", _hoisted_14, [
                  createElementVNode("dl", null, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList($data.cityListByLetter, (item, key) => {
                      return openBlock(), createElementBlock(Fragment, { key }, [
                        createElementVNode("dt", {
                          class: normalizeClass("ivu-city-" + key)
                        }, toDisplayString(key) + "\uFF1A", 3),
                        createElementVNode("dd", null, [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(item, (city) => {
                            return openBlock(), createElementBlock("li", {
                              key: city.n,
                              onClick: ($event) => $options.handleChangeValue(city.c)
                            }, toDisplayString(city.n), 9, _hoisted_15);
                          }), 128))
                        ])
                      ], 64);
                    }), 128))
                  ])
                ], 512)
              ])) : createCommentVNode("", true)
            ])
          ]),
          _: 1
        })
      ]),
      default: withCtx(() => [
        createElementVNode("div", {
          class: "ivu-city-rel",
          onClick: _cache[0] || (_cache[0] = withModifiers((...args) => $options.handleToggleOpen && $options.handleToggleOpen(...args), ["prevent", "stop"]))
        }, [
          createElementVNode("input", {
            type: "hidden",
            name: $props.name,
            value: $data.currentValue
          }, null, 8, _hoisted_1),
          renderSlot(_ctx.$slots, "default", {}, () => [
            createElementVNode("span", null, toDisplayString($options.codeToName), 1),
            withDirectives(createVNode(_component_Icon, {
              type: "ios-close-circle",
              class: "ivu-city-arrow",
              onClick: withModifiers($options.clearSelect, ["stop"])
            }, null, 8, ["onClick"]), [
              [vShow, $options.showCloseIcon]
            ]),
            createVNode(_component_Icon, {
              type: "ios-arrow-down",
              class: "ivu-city-arrow"
            })
          ])
        ])
      ]),
      _: 3
    }, 8, ["visible", "transfer", "transfer-class-name", "onOnVisibleChange", "onOnClickoutside"])
  ], 2);
}
var City = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { City as default };
