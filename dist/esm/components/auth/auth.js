import { h } from "vue";
import mixinsLink from "../../mixins/link.js";
function includeArray(list1, list2) {
  let status = false;
  list2.forEach((item) => {
    if (list1.includes(item))
      status = true;
  });
  return status;
}
const _sfc_main = {
  name: "Auth",
  mixins: [mixinsLink],
  emits: ["click"],
  props: {
    authority: {
      type: [String, Array, Function, Boolean],
      default: true
    },
    access: {
      type: [String, Array]
    },
    prevent: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: "\u60A8\u6CA1\u6709\u6743\u9650\u8FDB\u884C\u6B64\u64CD\u4F5C"
    },
    customTip: {
      type: Boolean,
      default: false
    },
    display: {
      type: String
    }
  },
  computed: {
    isPermission() {
      let state;
      if (typeof this.authority === "boolean") {
        state = this.authority;
      } else if (this.authority instanceof Function) {
        state = this.authority();
      } else {
        const authority = typeof this.authority === "string" ? [this.authority] : this.authority;
        const access = typeof this.access === "string" ? [this.access] : this.access;
        state = includeArray(authority, access);
      }
      return state;
    },
    options() {
      let style = {};
      if (this.display)
        style.display = this.display;
      return {
        class: {
          "ivu-auth": true,
          "ivu-auth-permission": this.isPermission,
          "ivu-auth-no-math": !this.isPermission,
          "ivu-auth-redirect": !this.isPermission && this.to,
          "ivu-auth-prevent": this.prevent
        },
        style
      };
    }
  },
  render() {
    if (this.isPermission) {
      return h("div", this.options, this.$slots.default());
    } else {
      if (this.to) {
        return h("div", this.options);
      } else {
        if (this.prevent) {
          return h("div", Object.assign({}, this.options, {
            onClick: this.handlePreventClick
          }), [
            h("div", {
              class: "ivu-auth-prevent-no-match"
            }, this.$slots.default())
          ]);
        } else {
          return h("div", this.options, this.$slots.noMatch());
        }
      }
    }
  },
  methods: {
    handlePreventClick(event) {
      if (!this.isPermission) {
        if (!this.customTip) {
          this.$Message.info({
            content: this.message,
            duration: 3
          });
        }
        this.$emit("click", event);
      }
    }
  },
  created() {
    if (!this.isPermission && this.to) {
      this.handleClick(false);
    }
  }
};
export { _sfc_main as default };
