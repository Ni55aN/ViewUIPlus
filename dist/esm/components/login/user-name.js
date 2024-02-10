import LoginItem from "./login-item.js";
const _sfc_main = {
  name: "UserName",
  mixins: [LoginItem],
  data() {
    return {
      className: "ivu-login-username",
      prefix: "ios-contact-outline",
      placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D",
      type: "text",
      validateMessage: "\u8BF7\u8F93\u5165\u7528\u6237\u540D\uFF01"
    };
  }
};
export { _sfc_main as default };
