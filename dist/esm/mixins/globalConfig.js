import { getCurrentInstance } from "vue";
var globalConfig = {
  data() {
    return {
      globalConfig: {}
    };
  },
  created() {
    const instance = getCurrentInstance();
    this.globalConfig = instance.appContext.config.globalProperties.$VIEWUI;
  }
};
export { globalConfig as default };
