import { isClient } from "../utils/index.js";
function setLang(lang) {
  if (isClient && typeof window.viewuiplus !== "undefined") {
    if (!("langs" in viewuiplus)) {
      viewuiplus.langs = {};
    }
    viewuiplus.langs[lang.i.locale] = lang;
  }
}
export { setLang as default };
