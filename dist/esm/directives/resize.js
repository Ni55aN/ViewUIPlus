import elementResizeDetectorMaker from "element-resize-detector";
var resize = {
  mounted(el, binding) {
    function resizeHandler(e) {
      binding.value(e);
    }
    el.__resizeHandler__ = resizeHandler;
    el.__observer__ = elementResizeDetectorMaker();
    el.__observer__.listenTo(el, resizeHandler);
  },
  updated() {
  },
  unmounted(el, binding) {
    el.__observer__.removeListener(el, el.__resizeHandler__);
    delete el.__resizeHandler__;
    delete el.__observer__;
  }
};
export { resize as default };
