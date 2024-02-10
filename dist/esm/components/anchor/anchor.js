import { nextTick, openBlock, createBlock, resolveDynamicComponent, withCtx, createElementVNode, normalizeClass, normalizeStyle, withDirectives, vShow, renderSlot } from "vue";
import { sharpMatcherRegx, scrollTop } from "../../utils/assist.js";
import { off, on } from "../../utils/dom.js";
import { isClient } from "../../utils/index.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = {
  name: "Anchor",
  provide() {
    return {
      AnchorInstance: this
    };
  },
  emits: ["on-change", "on-select"],
  props: {
    affix: {
      type: Boolean,
      default: true
    },
    offsetTop: {
      type: Number,
      default: 0
    },
    offsetBottom: Number,
    bounds: {
      type: Number,
      default: 5
    },
    container: null,
    showInk: {
      type: Boolean,
      default: false
    },
    scrollOffset: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      prefix: "ivu-anchor",
      isAffixed: false,
      inkTop: 0,
      animating: false,
      currentLink: "",
      currentId: "",
      scrollContainer: null,
      scrollElement: null,
      wrapperTop: 0,
      upperFirstTitle: true,
      links: []
    };
  },
  computed: {
    wrapperComponent() {
      return this.affix ? "Affix" : "div";
    },
    wrapperStyle() {
      return {
        maxHeight: this.offsetTop ? `calc(100vh - ${this.offsetTop}px)` : "100vh"
      };
    },
    containerIsWindow() {
      return this.scrollContainer === window;
    },
    titlesOffsetArr() {
      const links = this.links.map((item) => {
        return item.link.href;
      });
      const idArr = links.map((link) => {
        return link.split("#")[1];
      });
      let offsetArr = [];
      isClient && idArr.forEach((id) => {
        const titleEle = document.getElementById(id);
        if (titleEle)
          offsetArr.push({
            link: `#${id}`,
            offset: titleEle.offsetTop - this.scrollElement.offsetTop
          });
      });
      return offsetArr;
    }
  },
  methods: {
    handleAffixStateChange(state) {
      this.isAffixed = this.affix && state;
    },
    handleScroll(e) {
      this.upperFirstTitle = !!this.titlesOffsetArr[0] && e.target.scrollTop < this.titlesOffsetArr[0].offset;
      if (this.animating)
        return;
      const scrollTop2 = isClient ? document.documentElement.scrollTop || document.body.scrollTop || e.target.scrollTop : 0;
      this.getCurrentScrollAtTitleId(scrollTop2);
    },
    handleHashChange() {
      if (!isClient)
        return;
      const url = window.location.href;
      const sharpLinkMatch = sharpMatcherRegx.exec(url);
      if (!sharpLinkMatch)
        return;
      this.currentLink = sharpLinkMatch[0];
      this.currentId = sharpLinkMatch[1];
    },
    handleScrollTo() {
      if (!isClient)
        return;
      const anchor = document.getElementById(this.currentId);
      const currentLinkElementA = document.querySelector(`a[data-href="${this.currentLink}"]`);
      let offset = this.scrollOffset;
      if (currentLinkElementA) {
        offset = parseFloat(currentLinkElementA.getAttribute("data-scroll-offset"));
      }
      if (!anchor)
        return;
      const offsetTop = anchor.offsetTop - this.wrapperTop - offset;
      this.animating = true;
      scrollTop(this.scrollContainer, this.scrollElement.scrollTop, offsetTop, 600, () => {
        this.animating = false;
      });
      this.handleSetInkTop();
    },
    handleSetInkTop() {
      if (!isClient)
        return;
      const currentLinkElementA = document.querySelector(`a[data-href="${this.currentLink}"]`);
      if (!currentLinkElementA)
        return;
      const elementATop = currentLinkElementA.offsetTop;
      const top = elementATop < 0 ? this.offsetTop : elementATop;
      this.inkTop = top;
    },
    getCurrentScrollAtTitleId(scrollTop2) {
      let i = -1;
      let len = this.titlesOffsetArr.length;
      let titleItem = {
        link: "#",
        offset: 0
      };
      scrollTop2 += this.bounds;
      while (++i < len) {
        let currentEle = this.titlesOffsetArr[i];
        let nextEle = this.titlesOffsetArr[i + 1];
        if (scrollTop2 >= currentEle.offset && scrollTop2 < (nextEle && nextEle.offset || Infinity)) {
          titleItem = this.titlesOffsetArr[i];
          break;
        }
      }
      this.currentLink = titleItem.link;
      this.handleSetInkTop();
    },
    getContainer() {
      if (!isClient)
        return;
      this.scrollContainer = this.container ? typeof this.container === "string" ? document.querySelector(this.container) : this.container : window;
      this.scrollElement = this.container ? this.scrollContainer : document.documentElement || document.body;
    },
    removeListener() {
      off(this.scrollContainer, "scroll", this.handleScroll);
      off(window, "hashchange", this.handleHashChange);
    },
    init() {
      this.handleHashChange();
      nextTick(() => {
        this.removeListener();
        this.getContainer();
        this.wrapperTop = this.containerIsWindow ? 0 : this.scrollElement.offsetTop;
        this.handleScrollTo();
        this.handleSetInkTop();
        if (this.titlesOffsetArr[0]) {
          this.upperFirstTitle = this.scrollElement.scrollTop < this.titlesOffsetArr[0].offset;
        }
        on(this.scrollContainer, "scroll", this.handleScroll);
        on(window, "hashchange", this.handleHashChange);
      });
    },
    addLink(id, link) {
      this.links.push({ id, link });
    },
    removeLink(id) {
      const linkIndex = this.links.findIndex((item) => item.id === id);
      this.links.splice(linkIndex, 1);
    }
  },
  watch: {
    "$route"() {
      this.currentLink = "";
      this.currentId = "";
      this.handleHashChange();
      nextTick(() => {
        this.handleScrollTo();
      });
    },
    container() {
      this.init();
    },
    currentLink(newHref, oldHref) {
      this.$emit("on-change", newHref, oldHref);
    }
  },
  mounted() {
    this.init();
  },
  beforeUnmount() {
    this.removeListener();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(resolveDynamicComponent($options.wrapperComponent), {
    "offset-top": $props.offsetTop,
    "offset-bottom": $props.offsetBottom,
    onOnChange: $options.handleAffixStateChange
  }, {
    default: withCtx(() => [
      createElementVNode("div", {
        class: normalizeClass(`${$data.prefix}-wrapper`),
        style: normalizeStyle($options.wrapperStyle)
      }, [
        createElementVNode("div", {
          class: normalizeClass(`${$data.prefix}`)
        }, [
          createElementVNode("div", {
            class: normalizeClass(`${$data.prefix}-ink`)
          }, [
            withDirectives(createElementVNode("span", {
              class: normalizeClass(`${$data.prefix}-ink-ball`),
              style: normalizeStyle({ top: `${$data.inkTop}px` })
            }, null, 6), [
              [vShow, $props.showInk]
            ])
          ], 2),
          renderSlot(_ctx.$slots, "default")
        ], 2)
      ], 6)
    ]),
    _: 3
  }, 40, ["offset-top", "offset-bottom", "onOnChange"]);
}
var Anchor = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Anchor as default };
