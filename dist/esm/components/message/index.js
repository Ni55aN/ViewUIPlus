import "../base/notification/index.js";
import Notification from "../base/notification/notification.js";
const prefixCls = "ivu-message";
const iconPrefixCls = "ivu-icon";
const prefixKey = "ivu_message_key_";
const defaults = {
  top: 24,
  duration: 1.5,
  background: false
};
let messageInstance;
let name = 1;
const iconTypes = {
  "info": "ios-information-circle",
  "success": "ios-checkmark-circle",
  "warning": "ios-alert",
  "error": "ios-close-circle",
  "loading": "ios-loading"
};
const transitionName = "move-up";
function getMessageInstance() {
  messageInstance = messageInstance || Notification.newInstance({
    prefixCls,
    styles: {
      top: `${defaults.top}px`
    },
    transitionName
  });
  return messageInstance;
}
function notice(content = "", duration = defaults.duration, type, onClose = function() {
}, closable = false, render = function() {
}, background = defaults.background) {
  const iconType = iconTypes[type];
  const loadCls = type === "loading" ? " ivu-load-loop" : "";
  let instance = getMessageInstance();
  instance.notice({
    name: `${prefixKey}${name}`,
    duration,
    styles: {},
    transitionName,
    content: `
            <div class="${prefixCls}-custom-content ${prefixCls}-${type}">
                <i class="${iconPrefixCls} ${iconPrefixCls}-${iconType} ${loadCls}"></i>
                <span>${content}</span>
            </div>
        `,
    render,
    onClose,
    closable,
    type: "message",
    msgType: type,
    background
  });
  return function() {
    let target = name++;
    return function() {
      instance.remove(`${prefixKey}${target}`);
    };
  }();
}
var $Message = {
  name: "Message",
  info(options) {
    return this.message("info", options);
  },
  success(options) {
    return this.message("success", options);
  },
  warning(options) {
    return this.message("warning", options);
  },
  error(options) {
    return this.message("error", options);
  },
  loading(options) {
    return this.message("loading", options);
  },
  message(type, options) {
    if (typeof options === "string") {
      options = {
        content: options
      };
    }
    return notice(options.content, options.duration, type, options.onClose, options.closable, options.render, options.background);
  },
  config(options) {
    if (options.top || options.top === 0) {
      defaults.top = options.top;
    }
    if (options.duration || options.duration === 0) {
      defaults.duration = options.duration;
    }
    if (options.background)
      defaults.background = options.background;
  },
  destroy() {
    let instance = getMessageInstance();
    messageInstance = null;
    instance.destroy("ivu-message");
  }
};
export { $Message as default };
