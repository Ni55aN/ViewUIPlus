import tinycolor from "tinycolor2";
import { oneOf } from "../../utils/assist.js";
function setAlpha(data, alpha) {
  const color = tinycolor(data);
  const { _a } = color;
  if (_a === void 0 || _a === null) {
    color.setAlpha(alpha || 1);
  }
  return color;
}
function getColor(data, colorData) {
  const alpha = colorData && colorData.a;
  if (colorData) {
    if (colorData.hsl) {
      return setAlpha(colorData.hsl, alpha);
    }
    if (colorData.hex && colorData.hex.length > 0) {
      return setAlpha(colorData.hex, alpha);
    }
  }
  return setAlpha(colorData, alpha);
}
function changeColor(data, oldHue) {
  const colorData = data === "" ? "#2d8cf0" : data;
  const color = getColor(data, colorData);
  const hsl = color.toHsl();
  const hsv = color.toHsv();
  if (hsl.s === 0) {
    hsl.h = colorData.h || colorData.hsl && colorData.hsl.h || oldHue || 0;
    hsv.h = hsl.h;
  }
  if (hsv.v < 0.0164) {
    hsv.h = colorData.h || colorData.hsv && colorData.hsv.h || 0;
    hsv.s = colorData.s || colorData.hsv && colorData.hsv.s || 0;
  }
  if (hsl.l < 0.01) {
    hsl.h = colorData.h || colorData.hsl && colorData.hsl.h || 0;
    hsl.s = colorData.s || colorData.hsl && colorData.hsl.s || 0;
  }
  return {
    hsl,
    hex: color.toHexString().toUpperCase(),
    rgba: color.toRgb(),
    hsv,
    oldHue: colorData.h || oldHue || hsl.h,
    source: colorData.source,
    a: colorData.a || color.getAlpha()
  };
}
function clamp(value, min, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}
function getIncrement(key, keys, increment) {
  return oneOf(key, keys) ? increment : 0;
}
function getTouches(e, prop) {
  return e.touches ? e.touches[0][prop] : 0;
}
function toRGBAString(rgba) {
  const { r, g, b, a } = rgba;
  return `rgba(${[r, g, b, a].join(",")})`;
}
export { changeColor, clamp, getIncrement, getTouches, toRGBAString };
