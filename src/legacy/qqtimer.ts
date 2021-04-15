import { $, setStyle } from "../dom";
import {
  clearScramble,
  getLastScramble,
  getScramble,
  getScrambleType,
  initializeScramblers,
  scrdata,
  setScrambleType,
} from "../scramble";
import {
  getCookie,
  getCookieNumber,
  getCookieWithDefault,
  setCookie,
} from "./cookies";
import { globals } from "./globals";
import {
  changeColor,
  parseColor,
  setOptionsCallbacks,
  toggleInput,
} from "./options";
import { rescramble, rescramble2 } from "./rescramble";
import { getSession, saveSession } from "./session";
import {
  changeNotes,
  clearHighlight,
  getAvgSD,
  getMeanSD,
  getStats,
  pretty,
  setStatsCallbacks,
} from "./stats";
import { setTimingCallbacks, startTimer, stopTimer } from "./timing";

// #################### TIMER STUFF ####################

// deal with styles
setStyle(getCookie("style") as "0" | "1");

// firefox 9.0.1 bugfix
window.onkeydown = function (event) {
  checkKey(event.keyCode, event.shiftKey);
};
window.onkeyup = function (event) {
  startTimer(event.keyCode);
};

export function initialize(lookForTimes, checkQueryString) {
  loadOptBoxes();
  var query = ""; // query string for scrambles
  if (checkQueryString) {
    var query = window.location.search.substring(1);
  }
  if (lookForTimes) {
    getSession(); // see if there is a session saved
  } else {
    globals.main.times = [];
    globals.main.notes = [];
    globals.main.comments = [];
    globals.main.scrambleArr = [];
    window.focus();
  }
  globals.options.showOptions = 0;
  //toggleOptions(); // options are shown by default
  globals.stats.avgSizes = [50, 5, 12, 100, 1000];
  globals.stats.moSize = 3;
  globals.stats.bestAvg = [
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
  ];
  globals.stats.lastAvg = [
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
  ];
  globals.stats.bestMo = [-1, 0];
  globals.stats.lastMo = [-1, 0];
  globals.stats.bestAvgIndex = [0, 0, 0, 0, 0];
  globals.stats.bestMoIndex = 0;
  globals.stats.bestTime = -1;
  globals.stats.bestTimeIndex = 0;
  globals.stats.worstTime = -1;
  globals.stats.worstTimeIndex = 0;
  clearHighlight();
  if (globals.main.timerStatus != 0) {
    clearInterval(globals.main.timerID);
    clearInterval(globals.main.inspectionID);
  }
  globals.main.timerStatus = 3;

  let timerupdate = getCookieNumber("timerupdate", 1);
  $("toggler").innerHTML =
    timerupdate == 0
      ? "off"
      : timerupdate == 1
      ? "on"
      : timerupdate == 2
      ? "seconds only"
      : "inspection only";
  let useMilli = getCookieNumber("useMilli", 1);
  $("millisec").innerHTML = useMilli == 1 ? "1/1000 sec" : "1/100 sec";
  var oldManualEnter = globals.options.manualEnter;
  globals.options.manualEnter = getCookieNumber("manualEnter", 1);
  if (globals.options.manualEnter != oldManualEnter) {
    toggleInput();
    globals.options.manualEnter = 1 - globals.options.manualEnter;
  }
  $<HTMLInputElement>("tcol").value = getCookieWithDefault("tColor", "00ff00");
  $<HTMLInputElement>("bcol").value = getCookieWithDefault("bColor", "white");
  $<HTMLInputElement>("fcol").value = getCookieWithDefault("fColor", "black");
  $<HTMLInputElement>("lcol").value = getCookieWithDefault("lColor", "blue");
  $<HTMLInputElement>("hcol").value = getCookieWithDefault("hColor", "yellow");
  $<HTMLInputElement>("memcol").value = getCookieWithDefault(
    "memColor",
    "green"
  );
  $("inputTimes").innerHTML =
    globals.options.manualEnter == 1 ? "typing" : "timer";
  $<HTMLSpanElement>("theTime").innerHTML =
    globals.options.manualEnter == 1
      ? "<input id='timeEntry' size=12 style='font-size:100%'>" +
        " <span onclick='stopTimer(13);' class='a' style='color:" +
        parseColor($<HTMLInputElement>("lcol").value) +
        "'>enter</span>"
      : "ready";
  globals.options.timerSize = getCookieNumber("timerSize", 2);
  $<HTMLSpanElement>("theTime").style.fontSize =
    globals.options.timerSize + "em";
  globals.options.scrambleSize = getCookieNumber("scrSize", 16);
  $("scramble").style.fontSize = globals.options.scrambleSize + "px";
  $("getlast").style.fontSize = globals.options.scrambleSize + "px";
  $("theList").style.height =
    Math.max(16, globals.options.timerSize * 1.5) + "em";
  $("stats").style.height =
    Math.max(16, globals.options.timerSize * 1.5) + "em";
  globals.options.inspection = getCookieNumber("inspection", 0);
  $("inspec").innerHTML = globals.options.inspection == 1 ? "WCA" : "no";
  if (globals.options.inspection == 0) {
    globals.options.useBld = getCookieNumber("useBld", 0);
  } else {
    globals.options.useBld = 0;
    setCookie("useBld", 0);
  }
  $("bldmode").innerHTML = globals.options.useBld == 1 ? "on" : "off";
  globals.options.useAvgN = getCookieNumber("useAvgN", 0);
  $("avgn").innerHTML = globals.options.useAvgN == 1 ? "using" : "not using";
  globals.main.useMoN = getCookieNumber("useMoN", 0);
  $("mon").innerHTML = globals.main.useMoN == 1 ? "using" : "not using";
  globals.main.useMono = getCookieNumber("useMono", 0);
  $("monospace").innerHTML = globals.main.useMono == 1 ? "on" : "off";
  $("scramble").style.fontFamily =
    globals.main.useMono == 1 ? "monospace" : "serif";
  $("getlast").style.color = parseColor($<HTMLInputElement>("lcol").value);
  setScrambleType(getCookieWithDefault("scrType", "333"));
  if (query.length > 0) setScrambleType(query);

  loadList();
  getStats(true);

  initializeScramblers();

  globals.main.curTime = new Date(0);
  $<HTMLInputElement>("leng").value = getSelection().toString();
  var obj = $<HTMLSelectElement>("optbox");
  for (var i = 0; i < scrdata.length; i++) {
    for (var j = 0; j < scrdata[i][1].length; j++) {
      if (scrdata[i][1][j][1] == getScrambleType()) {
        obj.selectedIndex = i;
        rescramble(false);
        $<HTMLSelectElement>("optbox2").selectedIndex = j;
      }
    }
  }
  changeColor();
  clearScramble();
  rescramble2();
}

function loadOptBoxes() {
  for (var i = 0; i < scrdata.length; i++) {
    $<HTMLSelectElement>("optbox").options[i] = new Option(scrdata[i][0], "");
  }
}

function checkKey(keyCode, shiftKey) {
  if (
    keyCode == 13 ||
    (globals.options.manualEnter == 0 &&
      globals.main.timerStatus != 0 &&
      globals.main.timerStatus != 3)
  ) {
    // normally, any key enters a time; with manual enter, only Enter does
    stopTimer(keyCode);
  } else if (keyCode == 8 && globals.options.manualEnter == 0) {
    // backspace applies DNF
    if (globals.main.notes[globals.main.notes.length - 1] == 1) {
      changeNotes(0);
    } else {
      changeNotes(1);
    }
  } else if (
    (keyCode == 61 || keyCode == 187) &&
    globals.options.manualEnter == 0
  ) {
    // +/= applies +2 penalty
    if (globals.main.notes[globals.main.notes.length - 1] == 2) {
      changeNotes(0);
    } else {
      changeNotes(2);
    }
  } else if (keyCode == 173 || keyCode == 189) {
    // -/_ applies no penalty
    changeNotes(0);
  } else if (keyCode == 46 && !shiftKey && globals.main.times.length > 0) {
    // delete removes last solve
    del(globals.main.times.length - 1);
  } else if (keyCode == 46 && shiftKey) {
    // shift+delete clears session
    resetTimes();
  }
}

function resetTimes() {
  if (confirm("Are you sure you want to delete ALL of your times?")) {
    initialize(false, false);
  }
}

function loadList() {
  var data: any[] = [-1, [null], [null]]; // TODO:type
  var s =
    "times (<span onclick='resetTimes();' class='a'>reset</span>, <span onclick='toggleImport();' class='a'>import</span>):<br>";
  // get the best and worst time for the highlighted average
  if (
    globals.main.highlightStop != -1 &&
    globals.main.highlightStop - globals.main.highlightStart > 1
  ) {
    var mean = 0;
    if (globals.main.highlightID > 10 && globals.main.highlightID % 10 > 1)
      mean = 1; // check to see if this is a mean-of-N or not
    if (mean) {
      data = getMeanSD(
        globals.main.highlightStart,
        globals.main.highlightStop - globals.main.highlightStart + 1,
        false
      );
    } else {
      data = getAvgSD(
        globals.main.highlightStart,
        globals.main.highlightStop - globals.main.highlightStart + 1,
        false
      );
    }
  }
  for (var i = 0; i < globals.main.times.length; i++) {
    if (i == globals.main.highlightStart) {
      s +=
        "<span style='background-color: " +
        globals.options.highlightColor +
        "'>";
    }
    if (
      data[1].indexOf(i - globals.main.highlightStart) > -1 ||
      data[2].indexOf(i - globals.main.highlightStart) > -1
    )
      s += "(";
    var time = globals.main.times[i];
    if (globals.main.notes[i] == 0) {
      s += "<span onclick='del(" + i + ");' class='b'>" + pretty(time);
    } else if (globals.main.notes[i] == 2) {
      s +=
        "<span onclick='del(" +
        i +
        ");' class='b'>" +
        pretty(time + 2000) +
        "+";
    } else {
      s +=
        "<span onclick='del(" + i + ");' class='b'>DNF(" + pretty(time) + ")";
    }
    s +=
      (globals.main.comments[i] ? "[" + globals.main.comments[i] + "]" : "") +
      "</span>";
    if (
      data[1].indexOf(i - globals.main.highlightStart) > -1 ||
      data[2].indexOf(i - globals.main.highlightStart) > -1
    )
      s += ")";
    if (i == globals.main.highlightStop) {
      s += "</span>";
    }
    s += i == globals.main.times.length - 1 ? " " : ", ";
  }
  $("theList").innerHTML = s;
  saveSession();
  // move scrollbar to bottom:
  var window = $("theList");
  window.scrollTop = window.scrollHeight;
  changeColor();
}

function del(index) {
  var prettyTime = pretty(globals.main.times[index]);
  if (globals.main.notes[index] == 1) prettyTime = "DNF(" + prettyTime + ")";
  if (globals.main.notes[index] == 2)
    prettyTime = pretty(globals.main.times[index] + 2000) + "+";
  if (confirm("Are you sure you want to delete the " + prettyTime + "?")) {
    for (var i = index; i < globals.main.times.length - 1; i++) {
      globals.main.times[i] = globals.main.times[i + 1];
      globals.main.notes[i] = globals.main.notes[i + 1];
      globals.main.comments[i] = globals.main.comments[i + 1];
      globals.main.scrambleArr[i] = globals.main.scrambleArr[i + 1];
    }
    globals.main.times.pop();
    globals.main.notes.pop();
    globals.main.comments.pop();
    globals.main.scrambleArr.pop();
    clearHighlight();
    loadList();
    getStats(true);
  }
}

function getlastscramble() {
  $("scramble").innerHTML =
    "scramble: " + getScramble() + "<br> last scramble: " + getLastScramble();
  $("getlast").innerHTML = "";
}

function comment() {
  var newComment = prompt(
    "Enter your comment for the most recent solve:",
    globals.main.comments[globals.main.comments.length - 1]
  );
  if (newComment != null) {
    globals.main.comments[globals.main.comments.length - 1] = newComment;
  } else {
    globals.main.comments[globals.main.comments.length - 1] = "";
  }
  loadList();
}

setStatsCallbacks(loadList, changeColor);
setTimingCallbacks(loadList, clearHighlight);
setOptionsCallbacks(loadList);

export const qqtimerWindowGlobals = {
  comment,
  getlastscramble,
  setCookie,
};
