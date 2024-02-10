import select from "select";
import $Message from "../message/index.js";
import { isClient } from "../../utils/index.js";
const defaultSuccessTip = "\u590D\u5236\u6210\u529F";
const defaultErrorTip = "\u590D\u5236\u5931\u8D25";
function Copy({ text = "", successTip = defaultSuccessTip, errorTip = defaultErrorTip, success, error, showTip = true }) {
  if (!isClient)
    return;
  const isRTL = document.documentElement.getAttribute("dir") === "rtl";
  const $textarea = document.createElement("textarea");
  $textarea.style.fontSize = "12pt";
  $textarea.style.border = "0";
  $textarea.style.padding = "0";
  $textarea.style.margin = "0";
  $textarea.style.position = "absolute";
  $textarea.style[isRTL ? "right" : "left"] = "-9999px";
  let yPosition = window.pageYOffset || document.documentElement.scrollTop;
  $textarea.style.top = `${yPosition}px`;
  $textarea.setAttribute("readonly", "");
  $textarea.value = text;
  document.body.appendChild($textarea);
  select($textarea);
  let succeeded;
  try {
    succeeded = document.execCommand("copy");
    if (showTip) {
      $Message.success({
        content: successTip
      });
    }
    document.body.removeChild($textarea);
    if (success)
      success.call();
  } catch (err) {
    succeeded = false;
    if (showTip) {
      $Message.error({
        content: errorTip
      });
    }
    document.body.removeChild($textarea);
    if (error)
      error.call();
  }
}
export { Copy as default };
