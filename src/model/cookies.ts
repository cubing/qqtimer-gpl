/* setCookie and getCookie functions originally from http://www.quirksmode.org/js/cookies.html */
export function setCookie(name, value) {
  if (window.localStorage !== undefined) {
    window.localStorage.setItem(name, value);
    return;
  }
  var expires = "; expires=" + new Date(3000, 0, 1).toUTCString() + "; path=/";
  var cookies = document.cookie.split(";");
  var x = "qqTimer=";
  var found = false;
  for (var i = 0; i < cookies.length; i++) {
    var c = cookies[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(x) == 0) {
      // this is the qqtimer cookie
      found = true;
      var str = c.substring(x.length, c.length);
      var options = str.split(".");
      var good = false;
      for (var j = 0; j < options.length; j++) {
        if (options[j].split(",")[0] == name) {
          good = true;
          options[j] = name + "," + value;
        }
      }
      if (!good) {
        options[options.length] = name + "," + value;
      }
      var s = x;
      for (var j = 0; j < options.length; j++) {
        if (j > 0) s += ".";
        s += options[j];
      }
      document.cookie = s + expires;
    }
  }
  if (!found) {
    document.cookie = x + name + "," + value + expires;
  }
}

export function getCookieNumber(
  name: string,
  defaultValue: number = null
): number | null {
  const value: string | null = getCookie(name);
  if (value === null) {
    return defaultValue;
  }
  return parseInt(value);
}

export function getCookieWithDefault(
  name: string,
  defaultValue: string
): string | null {
  const value: string | null = getCookie(name);
  if (value === null) {
    return defaultValue;
  }
  return value;
}

export function getCookie(name: string): string | null {
  if (window.localStorage !== undefined) {
    var value = window.localStorage.getItem(name);
    if (value != null) return value;
  }

  var cookies = document.cookie.split(";");
  var x = "qqTimer=";
  for (var i = 0; i < cookies.length; i++) {
    var c = cookies[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(x) == 0) {
      // this is the qqtimer cookie
      var str = c.substring(x.length, c.length);
      var options = str.split(".");
      for (var j = 0; j < options.length; j++) {
        if (options[j].split(",")[0] == name) {
          return options[j].split(",")[1];
        }
      }
    }
  }
  return null;
}
