const isEarly = (timeStamp, currentTime) => {
  return timeStamp <= currentTime;
};
const getHandledValue = (num) => {
  return num < 10 ? "0" + num : num;
};
const getDate = (timeStamp, startType) => {
  const d = new Date(timeStamp);
  const year = d.getFullYear();
  const month = getHandledValue(d.getMonth() + 1);
  const date = getHandledValue(d.getDate());
  const hours = getHandledValue(d.getHours());
  const minutes = getHandledValue(d.getMinutes());
  const second = getHandledValue(d.getSeconds());
  let resStr = "";
  if (startType === "year")
    resStr = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + second;
  else
    resStr = month + "-" + date + " " + hours + ":" + minutes;
  return resStr;
};
const getRelativeTime = (timeStamp, locale) => {
  const currentTime = new Date().getTime();
  const IS_EARLY = isEarly(timeStamp, currentTime);
  let diff = currentTime - timeStamp;
  if (!IS_EARLY)
    diff = -diff;
  let resStr = "";
  let dirStr = IS_EARLY ? locale("i.time.before") || "\u524D" : locale("i.time.after") || "\u540E";
  if (diff < 1e3)
    resStr = locale("i.time.just") || "\u521A\u521A";
  else if (diff < 6e4)
    resStr = parseInt(diff / 1e3) + (locale("i.time.seconds") || "\u79D2") + dirStr;
  else if (diff >= 6e4 && diff < 36e5)
    resStr = Math.floor(diff / 6e4) + (locale("i.time.minutes") || "\u5206\u949F") + dirStr;
  else if (diff >= 36e5 && diff < 864e5)
    resStr = Math.floor(diff / 36e5) + (locale("i.time.hours") || "\u5C0F\u65F6") + dirStr;
  else if (diff >= 864e5 && diff < 262386e4)
    resStr = Math.floor(diff / 864e5) + (locale("i.time.days") || "\u5929") + dirStr;
  else if (diff >= 262386e4 && diff <= 3156786e4 && IS_EARLY)
    resStr = getDate(timeStamp);
  else
    resStr = getDate(timeStamp, "year");
  return resStr;
};
function Time(timestamp, locale) {
  return getRelativeTime(timestamp, locale);
}
export { Time as default, getRelativeTime };
