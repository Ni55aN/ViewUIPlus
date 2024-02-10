import "./confirm.js";
import Modal from "./modal.js";
export { default } from "./modal.js";
let modalInstance;
function getModalInstance(render = void 0, lockScroll = true) {
  modalInstance = modalInstance || Modal.newInstance({
    closable: false,
    maskClosable: false,
    footerHide: true,
    render,
    lockScroll
  });
  return modalInstance;
}
function confirm(options) {
  const render = "render" in options ? options.render : void 0;
  const lockScroll = "lockScroll" in options ? options.lockScroll : true;
  let instance = getModalInstance(render, lockScroll);
  options.onRemove = function() {
    modalInstance = null;
  };
  instance.show(options);
}
Modal.info = function(props = {}) {
  props.icon = "info";
  props.showCancel = false;
  return confirm(props);
};
Modal.success = function(props = {}) {
  props.icon = "success";
  props.showCancel = false;
  return confirm(props);
};
Modal.warning = function(props = {}) {
  props.icon = "warning";
  props.showCancel = false;
  return confirm(props);
};
Modal.error = function(props = {}) {
  props.icon = "error";
  props.showCancel = false;
  return confirm(props);
};
Modal.confirm = function(props = {}) {
  props.icon = "confirm";
  props.showCancel = true;
  return confirm(props);
};
Modal.remove = function() {
  if (!modalInstance) {
    return false;
  }
  const instance = getModalInstance();
  instance.remove();
};
