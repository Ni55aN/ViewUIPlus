import LoginItem from "./login-item.js";
import defaultValidateMessage from "./default_validate_message.js";
const _sfc_main = {
  name: "Email",
  mixins: [LoginItem],
  data() {
    return {
      className: "ivu-login-mail",
      prefix: "ios-mail-outline",
      placeholder: "\u8BF7\u8F93\u5165\u90AE\u7BB1",
      type: "email"
    };
  },
  props: {
    rules: {
      type: [Object, Array],
      default() {
        return [
          {
            required: true,
            message: defaultValidateMessage["Email"],
            trigger: "change"
          },
          {
            type: "email",
            message: "\u8F93\u5165\u7684\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E\uFF01",
            trigger: "change"
          }
        ];
      }
    }
  }
};
export { _sfc_main as default };
