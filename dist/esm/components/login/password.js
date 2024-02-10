import LoginItem from "./login-item.js";
const _sfc_main = {
  name: "Password",
  mixins: [LoginItem],
  data() {
    return {
      className: "ivu-login-password",
      prefix: "ios-lock-outline",
      placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
      type: "password"
    };
  }
};
export { _sfc_main as default };
