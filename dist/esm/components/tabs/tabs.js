import { nextTick, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createCommentVNode, withKeys, withModifiers, createVNode, normalizeStyle, Fragment, renderList, createBlock, createTextVNode, toDisplayString, withCtx } from "vue";
import Icon from "../icon/icon.js";
import Render from "../base/render.js";
import Dropdown from "../dropdown/dropdown.js";
import DropdownMenu from "../dropdown/dropdown-menu.js";
import { oneOf, MutationObserver } from "../../utils/assist.js";
import globalConfig from "../../mixins/globalConfig.js";
import elementResizeDetectorMaker from "element-resize-detector";
import { isClient } from "../../utils/index.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-tabs";
const transitionTime = 300;
const getNextTab = (list, activeKey, direction, countDisabledAlso) => {
  const currentIndex = list.findIndex((tab) => tab.name === activeKey);
  const nextIndex = (currentIndex + direction + list.length) % list.length;
  const nextTab = list[nextIndex];
  if (nextTab.disabled)
    return getNextTab(list, nextTab.name, direction);
  else
    return nextTab;
};
const focusFirst = (element, root) => {
  try {
    element.focus();
  } catch (err) {
  }
  if (isClient && document.activeElement == element && element !== root)
    return true;
  const candidates = element.children;
  for (let candidate of candidates) {
    if (focusFirst(candidate, root))
      return true;
  }
  return false;
};
const _sfc_main = {
  name: "Tabs",
  mixins: [globalConfig],
  emits: ["on-click", "on-dblclick", "on-contextmenu", "on-tab-remove", "on-drag-drop", "update:modelValue"],
  components: { Icon, Render, Dropdown, DropdownMenu },
  provide() {
    return {
      TabsInstance: this
    };
  },
  props: {
    modelValue: {
      type: [String, Number]
    },
    type: {
      validator(value) {
        return oneOf(value, ["line", "card"]);
      },
      default: "line"
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "default"]);
      },
      default: "default"
    },
    animated: {
      type: Boolean,
      default: true
    },
    captureFocus: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: false
    },
    beforeRemove: Function,
    name: {
      type: String
    },
    draggable: {
      type: Boolean,
      default: false
    },
    autoCloseContextmenu: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      prefixCls,
      navList: [],
      barWidth: 0,
      barOffset: 0,
      activeKey: this.modelValue,
      focusedKey: this.modelValue,
      showSlot: false,
      navStyle: {
        transform: ""
      },
      scrollable: false,
      transitioning: false,
      contextMenuVisible: false,
      contextMenuStyles: {
        top: 0,
        left: 0
      },
      paneList: [],
      tableList: []
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-card`]: this.type === "card",
          [`${prefixCls}-mini`]: this.size === "small" && this.type === "line",
          [`${prefixCls}-no-animation`]: !this.animated
        }
      ];
    },
    contentClasses() {
      return [
        `${prefixCls}-content`,
        {
          [`${prefixCls}-content-animated`]: this.animated
        }
      ];
    },
    barClasses() {
      return [
        `${prefixCls}-ink-bar`,
        {
          [`${prefixCls}-ink-bar-animated`]: this.animated
        }
      ];
    },
    contentStyle() {
      const x = this.getTabIndex(this.activeKey);
      const p = x === 0 ? "0%" : `-${x}00%`;
      let style = {};
      if (x > -1) {
        style = {
          transform: `translateX(${p}) translateZ(0px)`
        };
      }
      return style;
    },
    barStyle() {
      let style = {
        visibility: "hidden",
        width: `${this.barWidth}px`
      };
      if (this.type === "line")
        style.visibility = "visible";
      if (this.animated) {
        style.transform = `translate3d(${this.barOffset}px, 0px, 0px)`;
      } else {
        style.left = `${this.barOffset}px`;
      }
      return style;
    },
    arrowType() {
      const config = this.globalConfig;
      let type = "ios-close";
      if (config) {
        if (config.tabs.customCloseIcon) {
          type = "";
        } else if (config.tabs.closeIcon) {
          type = config.tabs.closeIcon;
        }
      }
      return type;
    },
    customArrowType() {
      const config = this.globalConfig;
      let type = "";
      if (config) {
        if (config.tabs.customCloseIcon) {
          type = config.tabs.customCloseIcon;
        }
      }
      return type;
    },
    arrowSize() {
      const config = this.globalConfig;
      let size = "";
      if (config) {
        if (config.tabs.closeIconSize) {
          size = config.tabs.closeIconSize;
        }
      }
      return size;
    }
  },
  methods: {
    getTabs() {
      const AllTabPanes = this.paneList.map((item) => item.pane);
      const TabPanes = [];
      AllTabPanes.forEach((item) => {
        if (item.tab && this.name) {
          if (item.tab === this.name) {
            TabPanes.push(item);
          }
        } else {
          TabPanes.push(item);
        }
      });
      TabPanes.sort((a, b) => {
        if (a.index && b.index) {
          return a.index > b.index ? 1 : -1;
        }
      });
      return TabPanes;
    },
    updateNav() {
      this.navList = [];
      this.getTabs().forEach((pane, index) => {
        this.navList.push({
          labelType: typeof pane.label,
          label: pane.label,
          icon: pane.icon || "",
          name: pane.currentName || index,
          disabled: pane.disabled,
          closable: pane.closable,
          contextMenu: pane.contextMenu
        });
        if (!pane.currentName)
          pane.currentName = index;
        if (index === 0) {
          if (!this.activeKey)
            this.activeKey = pane.currentName || index;
        }
      });
      this.updateStatus();
      this.updateBar();
    },
    updateBar() {
      nextTick(() => {
        const index = this.getTabIndex(this.activeKey);
        if (!this.$refs.nav)
          return;
        const prevTabs = this.$refs.nav.querySelectorAll(`.${prefixCls}-tab`);
        const tab = prevTabs[index];
        this.barWidth = tab ? parseFloat(tab.offsetWidth) : 0;
        if (index > 0) {
          let offset = 0;
          const gutter = this.size === "small" ? 0 : 16;
          for (let i = 0; i < index; i++) {
            offset += parseFloat(prevTabs[i].offsetWidth) + gutter;
          }
          this.barOffset = offset;
        } else {
          this.barOffset = 0;
        }
        this.updateNavScroll();
      });
    },
    updateStatus() {
      const tabs = this.getTabs();
      tabs.forEach((tab) => tab.show = tab.currentName === this.activeKey || this.animated);
    },
    tabCls(item) {
      return [
        `${prefixCls}-tab`,
        {
          [`${prefixCls}-tab-disabled`]: item.disabled,
          [`${prefixCls}-tab-active`]: item.name === this.activeKey,
          [`${prefixCls}-tab-focused`]: item.name === this.focusedKey
        }
      ];
    },
    handleChange(index) {
      if (this.transitioning)
        return;
      this.transitioning = true;
      setTimeout(() => this.transitioning = false, transitionTime);
      const nav = this.navList[index];
      if (!nav || nav.disabled)
        return;
      this.activeKey = nav.name;
      this.$emit("update:modelValue", nav.name);
      this.$emit("on-click", nav.name);
    },
    handleDblclick(index) {
      const nav = this.navList[index];
      if (!nav || nav.disabled)
        return;
      this.$emit("on-dblclick", nav.name);
    },
    handleContextmenu(index, event) {
      if (this.contextMenuVisible)
        this.handleClickContextMenuOutside();
      nextTick(() => {
        const nav = this.navList[index];
        if (!nav || nav.disabled || !nav.contextMenu)
          return;
        event.preventDefault();
        const $TabsWrap = this.$refs.tabsWrap;
        const TabsBounding = $TabsWrap.getBoundingClientRect();
        const position = {
          left: `${event.clientX - TabsBounding.left}px`,
          top: `${event.clientY - TabsBounding.top}px`
        };
        this.contextMenuStyles = position;
        this.contextMenuVisible = true;
        this.$emit("on-contextmenu", nav, event, position);
      });
    },
    handleClickContextMenuOutside() {
      this.contextMenuVisible = false;
    },
    handlePreventSelect(index, event) {
      const nav = this.navList[index];
      if (!nav || nav.disabled || !nav.contextMenu)
        return;
      event.preventDefault();
    },
    handleTabKeyNavigation(e) {
      if (e.keyCode !== 37 && e.keyCode !== 39)
        return;
      const direction = e.keyCode === 39 ? 1 : -1;
      const nextTab = getNextTab(this.navList, this.focusedKey, direction);
      this.focusedKey = nextTab.name;
    },
    handleTabKeyboardSelect(init = false) {
      if (init)
        return;
      const focused = this.focusedKey || 0;
      const index = this.getTabIndex(focused);
      this.handleChange(index);
    },
    handleRemove(index) {
      if (!this.beforeRemove) {
        return this.handleRemoveTab(index);
      }
      const before = this.beforeRemove(index);
      if (before && before.then) {
        before.then(() => {
          this.handleRemoveTab(index);
        });
      } else {
        this.handleRemoveTab(index);
      }
    },
    handleRemoveTab(index) {
      const tabs = this.getTabs();
      const tab = tabs[index];
      if (tab.currentName === this.activeKey) {
        const newTabs = this.getTabs();
        let activeKey = -1;
        if (newTabs.length) {
          const leftNoDisabledTabs = tabs.filter((item, itemIndex) => !item.disabled && itemIndex < index);
          const rightNoDisabledTabs = tabs.filter((item, itemIndex) => !item.disabled && itemIndex > index);
          if (rightNoDisabledTabs.length) {
            activeKey = rightNoDisabledTabs[0].currentName;
          } else if (leftNoDisabledTabs.length) {
            activeKey = leftNoDisabledTabs[leftNoDisabledTabs.length - 1].currentName;
          } else {
            activeKey = newTabs[0].currentName;
          }
        }
        this.activeKey = activeKey;
        this.$emit("update:modelValue", activeKey);
      }
      this.$emit("on-tab-remove", tab.currentName);
      this.updateNav();
    },
    showClose(item) {
      if (this.type === "card") {
        if (item.closable !== null) {
          return item.closable;
        } else {
          return this.closable;
        }
      } else {
        return false;
      }
    },
    scrollPrev() {
      const containerWidth = this.$refs.navScroll.offsetWidth;
      const currentOffset = this.getCurrentScrollOffset();
      if (!currentOffset)
        return;
      let newOffset = currentOffset > containerWidth ? currentOffset - containerWidth : 0;
      this.setOffset(newOffset);
    },
    scrollNext() {
      const navWidth = this.$refs.nav.offsetWidth;
      const containerWidth = this.$refs.navScroll.offsetWidth;
      const currentOffset = this.getCurrentScrollOffset();
      if (navWidth - currentOffset <= containerWidth)
        return;
      let newOffset = navWidth - currentOffset > containerWidth * 2 ? currentOffset + containerWidth : navWidth - containerWidth;
      this.setOffset(newOffset);
    },
    getCurrentScrollOffset() {
      const { navStyle } = this;
      return navStyle.transform ? Number(navStyle.transform.match(/translateX\(-(\d+(\.\d+)*)px\)/)[1]) : 0;
    },
    getTabIndex(name) {
      return this.navList.findIndex((nav) => nav.name === name);
    },
    setOffset(value) {
      this.navStyle.transform = `translateX(-${value}px)`;
    },
    scrollToActiveTab() {
      if (!this.scrollable)
        return;
      const nav = this.$refs.nav;
      const activeTab = this.$el.querySelector(`.${prefixCls}-tab-active`);
      if (!activeTab)
        return;
      const navScroll = this.$refs.navScroll;
      const activeTabBounding = activeTab.getBoundingClientRect();
      const navScrollBounding = navScroll.getBoundingClientRect();
      const navBounding = nav.getBoundingClientRect();
      const currentOffset = this.getCurrentScrollOffset();
      let newOffset = currentOffset;
      if (navBounding.right < navScrollBounding.right) {
        newOffset = nav.offsetWidth - navScrollBounding.width;
      }
      if (activeTabBounding.left < navScrollBounding.left) {
        newOffset = currentOffset - (navScrollBounding.left - activeTabBounding.left);
      } else if (activeTabBounding.right > navScrollBounding.right) {
        newOffset = currentOffset + activeTabBounding.right - navScrollBounding.right;
      }
      if (currentOffset !== newOffset) {
        this.setOffset(Math.max(newOffset, 0));
      }
    },
    updateNavScroll() {
      const navWidth = this.$refs.nav.offsetWidth;
      const containerWidth = this.$refs.navScroll.offsetWidth;
      const currentOffset = this.getCurrentScrollOffset();
      if (containerWidth < navWidth) {
        this.scrollable = true;
        if (navWidth - currentOffset < containerWidth) {
          this.setOffset(navWidth - containerWidth);
        }
      } else {
        this.scrollable = false;
        if (currentOffset > 0) {
          this.setOffset(0);
        }
      }
    },
    handleScroll(e) {
      e.preventDefault();
      e.stopPropagation();
      const type = e.type;
      let delta = 0;
      if (type === "DOMMouseScroll" || type === "mousewheel") {
        delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
      }
      if (delta > 0) {
        this.scrollPrev();
      } else {
        this.scrollNext();
      }
    },
    handleResize() {
      this.updateNavScroll();
    },
    isInsideHiddenElement() {
      if (!isClient)
        return;
      let parentNode = this.$el.parentNode;
      while (parentNode && parentNode !== document.body) {
        if (parentNode.style && parentNode.style.display === "none") {
          return parentNode;
        }
        parentNode = parentNode.parentNode;
      }
      return false;
    },
    updateVisibility(index) {
      [...this.$refs.panes.querySelectorAll(`.${prefixCls}-tabpane`)].forEach((el, i) => {
        if (index === i) {
          [...el.children].filter((child) => child.classList.contains(`${prefixCls}-tabpane`)).forEach((child) => child.style.visibility = "visible");
          if (this.captureFocus)
            setTimeout(() => focusFirst(el, el), transitionTime);
        } else {
          setTimeout(() => {
            [...el.children].filter((child) => child.classList.contains(`${prefixCls}-tabpane`)).forEach((child) => child.style.visibility = "hidden");
          }, transitionTime);
        }
      });
    },
    handleDrag(index, event) {
      const nav = this.navList[index];
      if (nav) {
        event.dataTransfer.setData("tab-name", nav.name);
      }
    },
    handleDrop(index, event) {
      const nav = this.navList[index];
      if (nav) {
        const dragName = event.dataTransfer.getData("tab-name");
        event.preventDefault();
        let navNames = this.navList.map((item) => item.name);
        const a = parseInt(navNames.findIndex((item) => item === dragName));
        const b = parseInt(navNames.findIndex((item) => item === nav.name));
        navNames.splice(b, 1, ...navNames.splice(a, 1, navNames[b]));
        this.$emit("on-drag-drop", dragName, nav.name, a, b, navNames);
      }
    },
    closeContextMenu() {
      this.handleClickContextMenuOutside();
    },
    handleClickDropdownItem() {
      if (this.autoCloseContextmenu)
        this.closeContextMenu();
    }
  },
  watch: {
    modelValue(val) {
      this.activeKey = val;
      this.focusedKey = val;
    },
    activeKey(val) {
      this.focusedKey = val;
      this.updateBar();
      this.updateStatus();
      this.tableList.forEach((item) => {
        item.table.handleOnVisibleChange(true);
      });
      nextTick(() => {
        this.scrollToActiveTab();
      });
      const nextIndex = Math.max(this.getTabIndex(this.focusedKey), 0);
      this.updateVisibility(nextIndex);
    }
  },
  mounted() {
    this.showSlot = this.$slots.extra !== void 0;
    this.observer = elementResizeDetectorMaker();
    this.observer.listenTo(this.$refs.navWrap, this.handleResize);
    const hiddenParentNode = this.isInsideHiddenElement();
    if (hiddenParentNode) {
      this.mutationObserver = new MutationObserver(() => {
        if (hiddenParentNode.style.display !== "none") {
          this.updateBar();
          this.mutationObserver.disconnect();
        }
      });
      this.mutationObserver.observe(hiddenParentNode, { attributes: true, childList: true, characterData: true, attributeFilter: ["style"] });
    }
    this.handleTabKeyboardSelect(true);
    this.updateVisibility(this.getTabIndex(this.activeKey));
  },
  beforeUnmount() {
    this.observer.removeListener(this.$refs.navWrap, this.handleResize);
    if (this.mutationObserver)
      this.mutationObserver.disconnect();
  }
};
const _hoisted_1 = ["onClick", "onDblclick", "onContextmenu", "onSelectstart", "draggable", "onDragstart", "onDrop"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_Render = resolveComponent("Render");
  const _component_DropdownMenu = resolveComponent("DropdownMenu");
  const _component_Dropdown = resolveComponent("Dropdown");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass($options.classes),
    ref: "tabsWrap"
  }, [
    createElementVNode("div", {
      class: normalizeClass([$data.prefixCls + "-bar"])
    }, [
      $data.showSlot ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass([$data.prefixCls + "-nav-right"])
      }, [
        renderSlot(_ctx.$slots, "extra")
      ], 2)) : createCommentVNode("", true),
      createElementVNode("div", {
        class: normalizeClass([$data.prefixCls + "-nav-container"]),
        tabindex: "0",
        ref: "navContainer",
        onKeydown: [
          _cache[5] || (_cache[5] = (...args) => $options.handleTabKeyNavigation && $options.handleTabKeyNavigation(...args)),
          _cache[6] || (_cache[6] = withKeys(withModifiers(($event) => $options.handleTabKeyboardSelect(false), ["prevent"]), ["space"]))
        ]
      }, [
        createElementVNode("div", {
          ref: "navWrap",
          class: normalizeClass([$data.prefixCls + "-nav-wrap", $data.scrollable ? $data.prefixCls + "-nav-scrollable" : ""])
        }, [
          createElementVNode("span", {
            class: normalizeClass([$data.prefixCls + "-nav-prev", $data.scrollable ? "" : $data.prefixCls + "-nav-scroll-disabled"]),
            onClick: _cache[0] || (_cache[0] = (...args) => $options.scrollPrev && $options.scrollPrev(...args))
          }, [
            createVNode(_component_Icon, { type: "ios-arrow-back" })
          ], 2),
          createElementVNode("span", {
            class: normalizeClass([$data.prefixCls + "-nav-next", $data.scrollable ? "" : $data.prefixCls + "-nav-scroll-disabled"]),
            onClick: _cache[1] || (_cache[1] = (...args) => $options.scrollNext && $options.scrollNext(...args))
          }, [
            createVNode(_component_Icon, { type: "ios-arrow-forward" })
          ], 2),
          createElementVNode("div", {
            ref: "navScroll",
            class: normalizeClass([$data.prefixCls + "-nav-scroll"]),
            "on:DOMMouseScroll": _cache[3] || (_cache[3] = (...args) => $options.handleScroll && $options.handleScroll(...args)),
            onMousewheel: _cache[4] || (_cache[4] = (...args) => $options.handleScroll && $options.handleScroll(...args))
          }, [
            createElementVNode("div", {
              ref: "nav",
              class: normalizeClass([$data.prefixCls + "-nav"]),
              style: normalizeStyle($data.navStyle)
            }, [
              createElementVNode("div", {
                class: normalizeClass($options.barClasses),
                style: normalizeStyle($options.barStyle)
              }, null, 6),
              (openBlock(true), createElementBlock(Fragment, null, renderList($data.navList, (item, index) => {
                return openBlock(), createElementBlock("div", {
                  class: normalizeClass($options.tabCls(item)),
                  key: index,
                  onClick: ($event) => $options.handleChange(index),
                  onDblclick: ($event) => $options.handleDblclick(index),
                  onContextmenu: withModifiers(($event) => $options.handleContextmenu(index, $event), ["stop"]),
                  onSelectstart: withModifiers(($event) => $options.handlePreventSelect(index, $event), ["stop"]),
                  draggable: $props.draggable,
                  onDragstart: ($event) => $options.handleDrag(index, $event),
                  onDrop: ($event) => $options.handleDrop(index, $event),
                  onDragover: _cache[2] || (_cache[2] = withModifiers(() => {
                  }, ["prevent"]))
                }, [
                  item.icon !== "" ? (openBlock(), createBlock(_component_Icon, {
                    key: 0,
                    type: item.icon
                  }, null, 8, ["type"])) : createCommentVNode("", true),
                  item.labelType === "function" ? (openBlock(), createBlock(_component_Render, {
                    key: 1,
                    render: item.label
                  }, null, 8, ["render"])) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
                    createTextVNode(toDisplayString(item.label), 1)
                  ], 64)),
                  $options.showClose(item) ? (openBlock(), createBlock(_component_Icon, {
                    key: 3,
                    class: normalizeClass([$data.prefixCls + "-close"]),
                    type: $options.arrowType,
                    custom: $options.customArrowType,
                    size: $options.arrowSize,
                    onClick: withModifiers(($event) => $options.handleRemove(index), ["stop"])
                  }, null, 8, ["class", "type", "custom", "size", "onClick"])) : createCommentVNode("", true)
                ], 42, _hoisted_1);
              }), 128))
            ], 6)
          ], 34)
        ], 2)
      ], 34)
    ], 2),
    createElementVNode("div", {
      class: normalizeClass($options.contentClasses),
      style: normalizeStyle($options.contentStyle),
      ref: "panes"
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 6),
    createElementVNode("div", {
      class: "ivu-tabs-context-menu",
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
    ], 4)
  ], 2);
}
var Tabs = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Tabs as default };
