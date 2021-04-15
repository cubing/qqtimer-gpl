export function getBrowser() {
  // http://www.quirksmode.org/js/detect.html
  var versionSearchString;
  var dataBrowser = [
    { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
    { string: navigator.userAgent, subString: "Safari", identity: "Chrome" },
    { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "IE",
      versionSearch: "MSIE",
    },
  ];

  function searchString(data) {
    for (var i = 0; i < data.length; i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      } else if (dataProp) return data[i].identity;
    }
  }

  return searchString(dataBrowser) || "An unknown browser";
}
