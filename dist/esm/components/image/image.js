import { getCurrentInstance, resolveComponent, openBlock, createElementBlock, normalizeStyle, renderSlot, createElementVNode, toDisplayString, createCommentVNode, normalizeClass, createBlock } from "vue";
import { isClient } from "../../utils/index.js";
import ImagePreview from "./image-preview2.js";
import Locale from "../../mixins/locale.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const isElement = (el) => {
  return typeof HTMLElement === "object" && el instanceof HTMLElement;
};
const _sfc_main = {
  name: "Image",
  mixins: [Locale],
  components: { ImagePreview },
  emits: ["on-load", "on-error", "on-switch", "on-close", "on-click"],
  props: {
    src: {
      type: String,
      default: ""
    },
    alt: {
      type: String,
      default: ""
    },
    preview: {
      type: Boolean,
      default: false
    },
    referrerPolicy: {
      type: String,
      default: ""
    },
    width: {
      type: [String, Number],
      default: ""
    },
    height: {
      type: [String, Number],
      default: ""
    },
    fit: {
      type: String,
      default: ""
    },
    lazy: {
      type: Boolean,
      default: false
    },
    scrollContainer: {
      type: [String],
      default: ""
    },
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || global.$VIEWUI.transfer === "" ? false : global.$VIEWUI.transfer;
      }
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    previewList: {
      type: Array
    },
    infinite: {
      type: Boolean,
      default: true
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    previewTip: {
      type: Boolean,
      default: true
    },
    toolbar: {
      type: Array,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;
        return !global.$VIEWUI || !global.$VIEWUI.image || global.$VIEWUI.image.toolbar === "" ? ["zoomIn", "zoomOut", "original", "rotateLeft", "rotateRight", "download"] : global.$VIEWUI.image.toolbar;
      }
    }
  },
  data() {
    return {
      loadingImage: false,
      loading: false,
      imageError: false,
      scrollElement: null,
      observer: null,
      imagePreviewModal: false
    };
  },
  watch: {
    src() {
      this.loadImage();
    }
  },
  computed: {
    innerClasses() {
      return [
        "ivu-image-inner",
        {
          ["ivu-image-cursor"]: this.preview
        }
      ];
    },
    imgClasses() {
      return [
        "ivu-image-img",
        {
          ["ivu-image-img-hidden"]: this.loading || this.imageError
        }
      ];
    },
    fitStyle() {
      const fitContains = ["fill", "contain", "cover", "none", "scale-down"];
      const { fit } = this;
      return fitContains.includes(fit) ? `object-fit:${fit};` : "";
    },
    imageStyles() {
      return {
        width: typeof this.width === "number" ? `${this.width}px` : this.width,
        height: typeof this.height === "number" ? `${this.height}px` : this.height
      };
    },
    loadingLang() {
      return this.t("i.select.loading");
    },
    failLang() {
      return this.t("i.image.fail");
    },
    previewLang() {
      return this.t("i.image.preview");
    },
    loadingType() {
      return this.lazy ? "lazy" : "eager";
    }
  },
  mounted() {
    isClient && this.handleImageEvent();
  },
  methods: {
    handleLazy() {
      const $el = this.$refs.image;
      const observer = this.observer = new IntersectionObserver(this.handlerObserveImage, {
        root: this.scrollElement,
        rootMargin: "0px",
        threshold: 0
      });
      observer.observe($el);
    },
    handlerObserveImage(entries) {
      for (let entry of entries) {
        if (entry.isIntersecting) {
          this.offObserver();
          this.loadImage();
        }
      }
    },
    addLazyImageListener() {
      const { scrollContainer } = this;
      this.scrollElement = null;
      if (isElement(scrollContainer)) {
        this.scrollElement = scrollContainer;
      } else if (scrollContainer && typeof scrollContainer === "string") {
        this.scrollElement = document.querySelector(scrollContainer);
      }
      this.handleLazy();
    },
    handleImageLoad() {
      this.loading = false;
      this.imageError = false;
      this.$emit("on-load");
    },
    handleImageError() {
      this.loading = false;
      this.imageError = true;
      this.loadingImage = false;
      this.$emit("on-error");
    },
    loadImage() {
      this.loading = true;
      this.imageError = false;
      this.loadingImage = true;
    },
    handleImageEvent() {
      const { lazy } = this;
      lazy ? this.addLazyImageListener() : this.loadImage();
    },
    offObserver() {
      const { observer } = this;
      observer && observer.disconnect();
    },
    handlePreview() {
      const { preview, initialIndex } = this;
      if (preview) {
        this.imagePreviewModal = true;
        this.$emit("on-click", { initialIndex });
      }
    },
    handleClose() {
      this.$emit("on-close");
    },
    handleSwitch(params) {
      this.$emit("on-switch", params);
    }
  },
  beforeUnmount() {
    this.offObserver();
  }
};
const _hoisted_1 = {
  key: 0,
  class: "ivu-image-placeholder"
};
const _hoisted_2 = {
  key: 1,
  class: "ivu-image-error"
};
const _hoisted_3 = ["alt", "src", "loading", "referrerPolicy"];
const _hoisted_4 = { class: "ivu-image-mark" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ImagePreview = resolveComponent("ImagePreview");
  return openBlock(), createElementBlock("div", {
    class: "ivu-image",
    ref: "image",
    style: normalizeStyle($options.imageStyles)
  }, [
    $data.loading ? (openBlock(), createElementBlock("div", _hoisted_1, [
      renderSlot(_ctx.$slots, "placeholder", {}, () => [
        createElementVNode("span", null, toDisplayString($options.loadingLang), 1)
      ])
    ])) : $data.imageError ? (openBlock(), createElementBlock("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "error", {}, () => [
        createElementVNode("span", null, toDisplayString($options.failLang), 1)
      ])
    ])) : createCommentVNode("", true),
    $data.loadingImage ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass($options.innerClasses),
      onClick: _cache[2] || (_cache[2] = (...args) => $options.handlePreview && $options.handlePreview(...args))
    }, [
      createElementVNode("img", {
        class: normalizeClass($options.imgClasses),
        style: normalizeStyle([$options.fitStyle]),
        alt: $props.alt,
        src: $props.src,
        loading: $options.loadingType,
        referrerPolicy: $props.referrerPolicy,
        onLoad: _cache[0] || (_cache[0] = (...args) => $options.handleImageLoad && $options.handleImageLoad(...args)),
        onError: _cache[1] || (_cache[1] = (...args) => $options.handleImageError && $options.handleImageError(...args))
      }, null, 46, _hoisted_3),
      $props.preview && $props.previewTip ? renderSlot(_ctx.$slots, "preview", { key: 0 }, () => [
        createElementVNode("div", _hoisted_4, [
          createElementVNode("span", null, toDisplayString($options.previewLang), 1)
        ])
      ]) : createCommentVNode("", true)
    ], 2)) : createCommentVNode("", true),
    $props.preview ? (openBlock(), createBlock(_component_ImagePreview, {
      key: 3,
      modelValue: $data.imagePreviewModal,
      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.imagePreviewModal = $event),
      "preview-list": $props.previewList,
      "initial-index": $props.initialIndex,
      infinite: $props.infinite,
      "mask-closable": $props.maskClosable,
      transfer: $props.transfer,
      toolbar: $props.toolbar,
      onOnClose: $options.handleClose,
      onOnSwitch: $options.handleSwitch
    }, null, 8, ["modelValue", "preview-list", "initial-index", "infinite", "mask-closable", "transfer", "toolbar", "onOnClose", "onOnSwitch"])) : createCommentVNode("", true)
  ], 4);
}
var Image = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Image as default };
