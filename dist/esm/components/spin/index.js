import "./spin.js";
import Spin from "./spin2.js";
export { default } from "./spin2.js";
let spinInstance;
function getSpinInstance(render = void 0) {
  spinInstance = spinInstance || Spin.newInstance({
    render
  });
  return spinInstance;
}
function loading(options) {
  const render = "render" in options ? options.render : void 0;
  let instance = getSpinInstance(render);
  instance.show(options);
}
Spin.show = function(props = {}) {
  return loading(props);
};
Spin.hide = function() {
  if (!spinInstance)
    return false;
  const instance = getSpinInstance();
  instance.remove(() => {
    spinInstance = null;
  });
};
