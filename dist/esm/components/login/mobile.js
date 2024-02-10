import LoginItem from "./login-item.js";
import defaultValidateMessage from "./default_validate_message.js";
const _sfc_main = {
  name: "Mobile",
  mixins: [LoginItem],
  data() {
    return {
      className: "ivu-login-mobile",
      prefix: "ios-phone-portrait",
      placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7\u7801",
      type: "text"
    };
  },
  props: {
    rules: {
      type: [Object, Array],
      default() {
        return [
          {
            required: true,
            message: defaultValidateMessage["Mobile"],
            trigger: "change"
          },
          {
            pattern: /^1\d{10}$/,
            message: "\u8F93\u5165\u7684\u624B\u673A\u53F7\u7801\u683C\u5F0F\u4E0D\u6B63\u786E\uFF01",
            trigger: "change"
          }
        ];
      }
    }
  }
};
export { _sfc_main as default };
