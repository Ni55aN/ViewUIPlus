import lang$1 from "./lang/zh-CN.js";
import deepmerge from "deepmerge";
import Format from "./format.js";
const format = Format();
let lang = lang$1;
const langs = {
  zh: lang$1
};
let nowLang = null;
let merged = {};
let vuei18n = null;
let i18nHandler = function() {
  if (Reflect.has(this, "$t")) {
    return this.$t(...arguments);
  }
  if (vuei18n && vuei18n.global) {
    return vuei18n.global.t(...arguments);
  }
  if (vuei18n && vuei18n.locale) {
    if (!merged[vuei18n.locale] || nowLang != vuei18n.locale) {
      merged[vuei18n.locale] = true;
      let localMessage = vuei18n.getLocaleMessage(vuei18n.locale) || {};
      let newLocalMessage = {};
      deepmerge(newLocalMessage, langs[vuei18n.locale], localMessage, { clone: true });
      lang = newLocalMessage;
      vuei18n.setLocaleMessage(vuei18n.locale, newLocalMessage);
      nowLang = vuei18n.locale;
    }
    return vuei18n.hlang(...arguments);
  }
};
const t = function(path, options) {
  let value = i18nHandler.apply(this, arguments);
  if (value !== null && value !== void 0)
    return value;
  const array = path.split(".");
  let current = lang;
  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i];
    value = current[property];
    if (i === j - 1)
      return format(value, options);
    if (!value)
      return "";
    current = value;
  }
  return "";
};
const use = function(l) {
  lang = l || lang;
};
const i18n = function(initI18n) {
  vuei18n = initI18n;
};
var localeFile = {
  use,
  t,
  i18n
};
export { localeFile as default, i18n, t, use };
