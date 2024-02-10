var mixinsForm = {
  inject: {
    FormInstance: {
      default: ""
    },
    FormItemInstance: {
      default: null
    }
  },
  computed: {
    itemDisabled() {
      let state = this.disabled;
      if (!state && this.FormInstance)
        state = this.FormInstance.disabled;
      return state ? true : null;
    }
  },
  methods: {
    handleFormItemChange(type, data) {
      if (this.FormItemInstance) {
        if (type === "blur")
          this.FormItemInstance.formBlur(data);
        else if (type === "change")
          this.FormItemInstance.formChange(data);
      }
    }
  }
};
export { mixinsForm as default };
