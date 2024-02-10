import Icon from "../icon/icon.js";
import iProgress from "../progress/progress.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, Fragment, renderList, createElementVNode, createVNode, createTextVNode, toDisplayString, withDirectives, vShow, Transition, withCtx, createBlock, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-upload";
const _sfc_main = {
  name: "UploadList",
  components: { Icon, iProgress },
  emits: ["on-file-click", "on-file-preview", "on-file-remove"],
  props: {
    files: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      prefixCls
    };
  },
  methods: {
    fileCls(file) {
      return [
        `${prefixCls}-list-file`,
        {
          [`${prefixCls}-list-file-finish`]: file.status === "finished"
        }
      ];
    },
    handleClick(file) {
      this.$emit("on-file-click", file);
    },
    handlePreview(file) {
      this.$emit("on-file-preview", file);
    },
    handleRemove(file) {
      this.$emit("on-file-remove", file);
    },
    format(file) {
      const format = file.name.split(".").pop().toLocaleLowerCase() || "";
      let type = "ios-document-outline";
      if (["gif", "jpg", "jpeg", "png", "bmp", "webp"].indexOf(format) > -1) {
        type = "ios-image";
      }
      if (["mp4", "m3u8", "rmvb", "avi", "swf", "3gp", "mkv", "flv"].indexOf(format) > -1) {
        type = "ios-film";
      }
      if (["mp3", "wav", "wma", "ogg", "aac", "flac"].indexOf(format) > -1) {
        type = "ios-musical-notes";
      }
      if (["doc", "txt", "docx", "pages", "epub", "pdf"].indexOf(format) > -1) {
        type = "md-document";
      }
      if (["numbers", "csv", "xls", "xlsx"].indexOf(format) > -1) {
        type = "ios-stats";
      }
      if (["keynote", "ppt", "pptx"].indexOf(format) > -1) {
        type = "ios-videocam";
      }
      return type;
    },
    parsePercentage(val) {
      return parseInt(val, 10);
    }
  }
};
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["onClick"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Icon = resolveComponent("Icon");
  const _component_i_progress = resolveComponent("i-progress");
  return openBlock(), createElementBlock("ul", {
    class: normalizeClass([$data.prefixCls + "-list"])
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($props.files, (file, index) => {
      return openBlock(), createElementBlock("li", {
        key: index,
        class: normalizeClass($options.fileCls(file)),
        onClick: ($event) => $options.handleClick(file)
      }, [
        createElementVNode("span", {
          onClick: ($event) => $options.handlePreview(file)
        }, [
          createVNode(_component_Icon, {
            type: $options.format(file)
          }, null, 8, ["type"]),
          createTextVNode(" " + toDisplayString(file.name), 1)
        ], 8, _hoisted_2),
        withDirectives(createVNode(_component_Icon, {
          type: "ios-close",
          class: normalizeClass([$data.prefixCls + "-list-remove"]),
          onClick: ($event) => $options.handleRemove(file)
        }, null, 8, ["class", "onClick"]), [
          [vShow, file.status === "finished"]
        ]),
        createVNode(Transition, { name: "fade" }, {
          default: withCtx(() => [
            file.showProgress ? (openBlock(), createBlock(_component_i_progress, {
              key: 0,
              "stroke-width": 2,
              percent: $options.parsePercentage(file.percentage),
              status: file.status === "finished" && file.showProgress ? "success" : "normal"
            }, null, 8, ["percent", "status"])) : createCommentVNode("", true)
          ]),
          _: 2
        }, 1024)
      ], 10, _hoisted_1);
    }), 128))
  ], 2);
}
var UploadList = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { UploadList as default };
