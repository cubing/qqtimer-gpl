import { $ } from "../dom";
import { globals } from "./globals";
import { clearHighlight } from "./stats";

export function saveSession() {
  var id =
    $<HTMLSelectElement>("sessbox").selectedIndex == null
      ? 0
      : $<HTMLSelectElement>("sessbox").selectedIndex;
  var name = "session" + id;

  if (window.localStorage !== undefined) {
    var value = "";
    for (var i = 0; i < globals.main.times.length; i++) {
      value += globals.main.times[i];
      if (globals.main.comments[i] != "" && globals.main.comments[i] !== null) {
        value += "|" + globals.main.comments[i];
      }
      if (globals.main.notes[i] == 1) value += "-";
      if (globals.main.notes[i] == 2) value += "+";
      if (i < globals.main.times.length - 1) value += ",";
    }
    value += ">";

    window.localStorage.setItem(name, value);
    return;
  }

  // format: cookie name "sessionY|X", comma separated, ">" at end
  // X is a number and we use another one if we run out of space
  // Y is the session number
  // time (in ms) with + for +2 or - for DNF
  var expires = "; expires=" + new Date(3000, 0, 1).toUTCString() + "; path=/";
  var cnt = 1;
  var s = name + "|" + cnt + "=";
  for (var i = 0; i < globals.main.times.length; i++) {
    if (s.length < 3950) {
      // just in case!
      s += globals.main.times[i];
      if (globals.main.comments[i] != "" && globals.main.comments[i] !== null) {
        s += "|" + globals.main.comments[i];
      }
      if (globals.main.notes[i] == 1) s += "-";
      if (globals.main.notes[i] == 2) s += "+";
      if (i < globals.main.times.length - 1) s += ",";
    } else {
      document.cookie = s + expires;
      cnt++;
      s = name + "|" + cnt + "=";
      i--;
    }
  }
  document.cookie = s + ">" + expires;
}

export function getSession() {
  var id =
    $<HTMLSelectElement>("sessbox").selectedIndex == null
      ? 0
      : $<HTMLSelectElement>("sessbox").selectedIndex;
  globals.main.times = [];
  globals.main.notes = [];
  globals.main.comments = [];
  globals.main.scrambleArr = [];
  $("sessbox").blur();

  var s = null;
  if (window.localStorage !== undefined) {
    // try to load text from localStorage
    s = window.localStorage.getItem("session" + id);
  }

  if (s == null) {
    // not in localStorage, load from cookie
    s = "";
    var cookies = document.cookie.split(";");
    var cnt = 1;
    var x = "session" + id + "|" + cnt + "=";
    var found = true;
    while (found) {
      found = false;
      for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(x) == 0) {
          // the right cookie
          s += c.substring(x.length, c.length);
          if (s.indexOf(">") == -1) {
            found = true;
            cnt++;
            x = "session" + id + "|" + cnt + "=";
            break;
          }
        }
      }
    }
  }

  if (s == null) {
    return;
  } else if (s.length == 0) {
    return;
  }

  var t = s.split(",");
  if (t[0] != ">") {
    for (var j = 0; j < t.length; j++) {
      if (t[j].slice(-1) == ">") {
        t[j] = t[j].slice(0, t[j].length - 1);
      }
      if (t[j].slice(-1) == "-") {
        globals.main.notes[j] = 1;
        t[j] = t[j].slice(0, t[j].length - 1);
      } else if (t[j].slice(-1) == "+") {
        globals.main.notes[j] = 2;
        t[j] = t[j].slice(0, t[j].length - 1);
      } else {
        globals.main.notes[j] = 0;
      }
      var q = t[j].split("|");
      globals.main.times[j] = parseInt(q[0]);
      globals.main.comments[j] = q[1] != null && q[1] != "" ? q[1] : "";
      globals.main.scrambleArr[j] = "";
    }
  }
  clearHighlight();
}
