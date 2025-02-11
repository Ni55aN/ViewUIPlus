import setLang from "../lang.js";
const lang = {
  i: {
    locale: "zh-CN",
    select: {
      placeholder: "\u8BF7\u9009\u62E9",
      noMatch: "\u65E0\u5339\u914D\u6570\u636E",
      loading: "\u52A0\u8F7D\u4E2D"
    },
    table: {
      noDataText: "\u6682\u65E0\u6570\u636E",
      noFilteredDataText: "\u6682\u65E0\u7B5B\u9009\u7ED3\u679C",
      confirmFilter: "\u7B5B\u9009",
      resetFilter: "\u91CD\u7F6E",
      clearFilter: "\u5168\u90E8",
      sumText: "\u5408\u8BA1"
    },
    datepicker: {
      selectDate: "\u9009\u62E9\u65E5\u671F",
      selectTime: "\u9009\u62E9\u65F6\u95F4",
      startTime: "\u5F00\u59CB\u65F6\u95F4",
      endTime: "\u7ED3\u675F\u65F6\u95F4",
      clear: "\u6E05\u7A7A",
      ok: "\u786E\u5B9A",
      datePanelLabel: "[yyyy\u5E74] [m\u6708]",
      month: "\u6708",
      month1: "1 \u6708",
      month2: "2 \u6708",
      month3: "3 \u6708",
      month4: "4 \u6708",
      month5: "5 \u6708",
      month6: "6 \u6708",
      month7: "7 \u6708",
      month8: "8 \u6708",
      month9: "9 \u6708",
      month10: "10 \u6708",
      month11: "11 \u6708",
      month12: "12 \u6708",
      year: "\u5E74",
      weekStartDay: "0",
      weeks: {
        sun: "\u65E5",
        mon: "\u4E00",
        tue: "\u4E8C",
        wed: "\u4E09",
        thu: "\u56DB",
        fri: "\u4E94",
        sat: "\u516D"
      },
      months: {
        m1: "1\u6708",
        m2: "2\u6708",
        m3: "3\u6708",
        m4: "4\u6708",
        m5: "5\u6708",
        m6: "6\u6708",
        m7: "7\u6708",
        m8: "8\u6708",
        m9: "9\u6708",
        m10: "10\u6708",
        m11: "11\u6708",
        m12: "12\u6708"
      }
    },
    transfer: {
      titles: {
        source: "\u6E90\u5217\u8868",
        target: "\u76EE\u7684\u5217\u8868"
      },
      filterPlaceholder: "\u8BF7\u8F93\u5165\u641C\u7D22\u5185\u5BB9",
      notFoundText: "\u5217\u8868\u4E3A\u7A7A"
    },
    modal: {
      okText: "\u786E\u5B9A",
      cancelText: "\u53D6\u6D88"
    },
    poptip: {
      okText: "\u786E\u5B9A",
      cancelText: "\u53D6\u6D88"
    },
    page: {
      prev: "\u4E0A\u4E00\u9875",
      next: "\u4E0B\u4E00\u9875",
      total: "\u5171",
      item: "\u6761",
      items: "\u6761",
      prev5: "\u5411\u524D 5 \u9875",
      next5: "\u5411\u540E 5 \u9875",
      page: "\u6761/\u9875",
      goto: "\u8DF3\u81F3",
      p: "\u9875"
    },
    rate: {
      star: "\u661F",
      stars: "\u661F"
    },
    time: {
      before: "\u524D",
      after: "\u540E",
      just: "\u521A\u521A",
      seconds: "\u79D2",
      minutes: "\u5206\u949F",
      hours: "\u5C0F\u65F6",
      days: "\u5929"
    },
    tree: {
      emptyText: "\u6682\u65E0\u6570\u636E"
    },
    image: {
      zoomIn: "\u653E\u5927",
      zoomOut: "\u7F29\u5C0F",
      rotateLeft: "\u5DE6\u65CB\u8F6C",
      rotateRight: "\u53F3\u65CB\u8F6C",
      fail: "\u5931\u8D25",
      preview: "\u9884\u89C8"
    }
  }
};
setLang(lang);
export { lang as default };
