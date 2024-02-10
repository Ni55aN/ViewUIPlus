const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g;
function Format() {
  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  function template(string, ...args) {
    if (args.length === 1 && typeof args[0] === "object") {
      args = args[0];
    }
    if (!args || !args.hasOwnProperty) {
      args = {};
    }
    if (string === void 0) {
      return "";
    }
    return string.replace(RE_NARGS, (match, prefix, i, index) => {
      let result;
      if (string[index - 1] === "{" && string[index + match.length] === "}") {
        return i;
      } else {
        result = hasOwn(args, i) ? args[i] : null;
        if (result === null || result === void 0) {
          return "";
        }
        return result;
      }
    });
  }
  return template;
}
export { Format as default };
