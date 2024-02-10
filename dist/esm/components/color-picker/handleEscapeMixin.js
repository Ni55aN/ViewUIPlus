var handleEscapeMixin = {
  inject: ["ColorPickerInstance"],
  methods: {
    handleEscape(e) {
      this.ColorPickerInstance.handleOnEscapeKeydown(e);
    }
  }
};
export { handleEscapeMixin as default };
