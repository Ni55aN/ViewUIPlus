import UploadList from "./upload-list.js";
import upload from "./ajax.js";
import { oneOf } from "../../utils/assist.js";
import mixinsForm from "../../mixins/form.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, withModifiers, renderSlot, createBlock, createCommentVNode } from "vue";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const prefixCls = "ivu-upload";
const _sfc_main = {
  name: "Upload",
  mixins: [mixinsForm],
  components: { UploadList },
  props: {
    action: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default() {
        return {};
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    name: {
      type: String,
      default: "file"
    },
    withCredentials: {
      type: Boolean,
      default: false
    },
    showUploadList: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      validator(value) {
        return oneOf(value, ["select", "drag"]);
      },
      default: "select"
    },
    format: {
      type: Array,
      default() {
        return [];
      }
    },
    accept: {
      type: String
    },
    maxSize: {
      type: Number
    },
    beforeUpload: Function,
    onProgress: {
      type: Function,
      default() {
        return {};
      }
    },
    onSuccess: {
      type: Function,
      default() {
        return {};
      }
    },
    onError: {
      type: Function,
      default() {
        return {};
      }
    },
    onRemove: {
      type: Function,
      default() {
        return {};
      }
    },
    onPreview: {
      type: Function,
      default() {
        return {};
      }
    },
    onExceededSize: {
      type: Function,
      default() {
        return {};
      }
    },
    onFormatError: {
      type: Function,
      default() {
        return {};
      }
    },
    defaultFileList: {
      type: Array,
      default() {
        return [];
      }
    },
    paste: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    webkitdirectory: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls,
      dragOver: false,
      fileList: [],
      tempIndex: 1
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-select`]: this.type === "select",
          [`${prefixCls}-drag`]: this.type === "drag",
          [`${prefixCls}-dragOver`]: this.type === "drag" && this.dragOver
        }
      ];
    }
  },
  methods: {
    handleClick() {
      if (this.itemDisabled)
        return;
      this.$refs.input.click();
    },
    handleChange(e) {
      const files = e.target.files;
      if (!files) {
        return;
      }
      this.uploadFiles(files);
      this.$refs.input.value = null;
    },
    onDrop(e) {
      this.dragOver = false;
      if (this.itemDisabled)
        return;
      this.uploadFiles(e.dataTransfer.files);
    },
    handlePaste(e) {
      if (this.itemDisabled)
        return;
      if (this.paste) {
        this.uploadFiles(e.clipboardData.files);
      }
    },
    uploadFiles(files) {
      let postFiles = Array.prototype.slice.call(files);
      if (!this.multiple)
        postFiles = postFiles.slice(0, 1);
      if (postFiles.length === 0)
        return;
      postFiles.forEach((file) => {
        this.upload(file);
      });
    },
    upload(file) {
      if (!this.beforeUpload) {
        return this.post(file);
      }
      const before = this.beforeUpload(file);
      if (before && before.then) {
        before.then((processedFile) => {
          if (Object.prototype.toString.call(processedFile) === "[object File]") {
            this.post(processedFile);
          } else {
            this.post(file);
          }
        }, () => {
        });
      } else if (before !== false) {
        this.post(file);
      } else
        ;
    },
    post(file) {
      if (this.format.length) {
        const _file_format = file.name.split(".").pop().toLocaleLowerCase();
        const checked = this.format.some((item) => item.toLocaleLowerCase() === _file_format);
        if (!checked) {
          this.onFormatError(file, this.fileList);
          return false;
        }
      }
      if (this.maxSize) {
        if (file.size > this.maxSize * 1024) {
          this.onExceededSize(file, this.fileList);
          return false;
        }
      }
      this.handleStart(file);
      let formData = new FormData();
      formData.append(this.name, file);
      upload({
        headers: this.headers,
        withCredentials: this.withCredentials,
        file,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: (e) => {
          this.handleProgress(e, file);
        },
        onSuccess: (res) => {
          this.handleSuccess(res, file);
        },
        onError: (err, response) => {
          this.handleError(err, response, file);
        }
      });
    },
    handleStart(file) {
      file.uid = Date.now() + this.tempIndex++;
      const _file = {
        status: "uploading",
        name: file.name,
        size: file.size,
        percentage: 0,
        uid: file.uid,
        showProgress: true
      };
      this.fileList.push(_file);
    },
    getFile(file) {
      const fileList = this.fileList;
      let target;
      fileList.every((item) => {
        target = file.uid === item.uid ? item : null;
        return !target;
      });
      return target;
    },
    handleProgress(e, file) {
      const _file = this.getFile(file);
      this.onProgress(e, _file, this.fileList);
      _file.percentage = e.percent || 0;
    },
    handleSuccess(res, file) {
      const _file = this.getFile(file);
      if (_file) {
        _file.status = "finished";
        _file.response = res;
        this.onSuccess(res, _file, this.fileList);
        this.handleFormItemChange("change", _file);
        setTimeout(() => {
          _file.showProgress = false;
        }, 1e3);
      }
    },
    handleError(err, response, file) {
      const _file = this.getFile(file);
      const fileList = this.fileList;
      _file.status = "fail";
      fileList.splice(fileList.indexOf(_file), 1);
      this.onError(err, response, file);
    },
    handleRemove(file) {
      const fileList = this.fileList;
      fileList.splice(fileList.indexOf(file), 1);
      this.onRemove(file, fileList);
    },
    handlePreview(file) {
      if (file.status === "finished") {
        this.onPreview(file);
      }
    },
    clearFiles() {
      this.fileList = [];
    }
  },
  watch: {
    defaultFileList: {
      immediate: true,
      handler(fileList) {
        this.fileList = fileList.map((item) => {
          item.status = "finished";
          item.percentage = 100;
          item.uid = Date.now() + this.tempIndex++;
          return item;
        });
      }
    }
  }
};
const _hoisted_1 = ["multiple", "webkitdirectory", "accept"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_upload_list = resolveComponent("upload-list");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass([$data.prefixCls])
  }, [
    createElementVNode("div", {
      class: normalizeClass($options.classes),
      onClick: _cache[1] || (_cache[1] = (...args) => $options.handleClick && $options.handleClick(...args)),
      onDrop: _cache[2] || (_cache[2] = withModifiers((...args) => $options.onDrop && $options.onDrop(...args), ["prevent"])),
      onPaste: _cache[3] || (_cache[3] = (...args) => $options.handlePaste && $options.handlePaste(...args)),
      onDragover: _cache[4] || (_cache[4] = withModifiers(($event) => $data.dragOver = true, ["prevent"])),
      onDragleave: _cache[5] || (_cache[5] = withModifiers(($event) => $data.dragOver = false, ["prevent"]))
    }, [
      createElementVNode("input", {
        ref: "input",
        type: "file",
        class: normalizeClass([$data.prefixCls + "-input"]),
        onChange: _cache[0] || (_cache[0] = (...args) => $options.handleChange && $options.handleChange(...args)),
        multiple: $props.multiple,
        webkitdirectory: $props.webkitdirectory,
        accept: $props.accept
      }, null, 42, _hoisted_1),
      renderSlot(_ctx.$slots, "default")
    ], 34),
    renderSlot(_ctx.$slots, "tip"),
    $props.showUploadList ? (openBlock(), createBlock(_component_upload_list, {
      key: 0,
      files: $data.fileList,
      onOnFileRemove: $options.handleRemove,
      onOnFilePreview: $options.handlePreview
    }, null, 8, ["files", "onOnFileRemove", "onOnFilePreview"])) : createCommentVNode("", true)
  ], 2);
}
var Upload = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Upload as default };
