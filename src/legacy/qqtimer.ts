import { $, setStyle } from "../dom";
import { globals } from "./globals";
import {
  clearScramble,
  getLastScramble,
  getLen,
  getScramble,
  getScrambleType,
  initializeScramblers,
  scrambleIt,
  scrdata,
  setLen,
  setScrambleType,
} from "../scramble";
import {
  changeNotes,
  clearHighlight,
  getAvgSD,
  getMeanSD,
  getStats,
  parseTime,
  pretty,
  setDelegates,
} from "./stats";

const setInterval = window.setInterval; // TODO

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

function rescramble(scramble) {
  var obj = $<HTMLSelectElement>("optbox");
  var obj2 = $<HTMLSelectElement>("optbox2");

  var box2 = scrdata[obj.selectedIndex][1];
  for (var i = obj2.options.length - 1; i > 0; i--) obj2.remove(i);
  for (var i = 0; i < box2.length; i++)
    obj2.options[i] = new Option(box2[i][0], box2[i][1]);
  setLen(box2[0][2]);
  $<HTMLInputElement>("leng").value = getLen().toString();
  setScrambleType(box2[0][1]);
  if (scramble) {
    setCookie("scrType", getScrambleType());
    scrambleIt();
    $("getlast").innerHTML = "get last scramble";
  }
}

function rescramble2() {
  var obj = $<HTMLSelectElement>("optbox");
  var obj2 = $<HTMLSelectElement>("optbox2");
  var newType = obj2.options[obj2.selectedIndex].value;

  var box2 = scrdata[obj.selectedIndex][1];
  setLen(box2[obj2.selectedIndex][2]);
  $<HTMLInputElement>("leng").value = getLen().toString();
  setScrambleType(newType);
  setCookie("scrType", getScrambleType());

  scrambleIt();
  $("getlast").innerHTML = "get last scramble";
}

function rescramble3() {
  setLen(parseInt($<HTMLInputElement>("leng").value));
  scrambleIt();
  $("getlast").innerHTML = "get last scramble";
}

function loadOptBoxes() {
  for (var i = 0; i < scrdata.length; i++) {
    $<HTMLSelectElement>("optbox").options[i] = new Option(scrdata[i][0], "");
  }
}

function startTimer(keyCode) {
  if (
    globals.main.timerStatus == 0 &&
    globals.options.manualEnter == 0 &&
    keyCode == 32 &&
    globals.options.importFocus == 0
  ) {
    globals.main.timerStatus = 3;
  } else if (
    globals.main.timerStatus == 3 &&
    globals.options.manualEnter == 0 &&
    keyCode == 32 &&
    new Date().getTime() - globals.main.curTime.getTime() >= 300 &&
    globals.options.importFocus == 0
  ) {
    if (getScrambleType() == "sqrs") {
      $("scramble").innerHTML = "scramble: loading... ";
    }
    if (globals.options.inspection == 1) {
      globals.main.timerStatus = 2;
      globals.main.inspectionTime = new Date();
      $<HTMLSpanElement>("theTime").style.color = "red";
      if (globals.main.timerupdate != 0) {
        globals.main.inspectionID = setInterval(
          updateInspec,
          globals.main.timerupdate == 1 ? 10 : 100
        );
      } else {
        $<HTMLSpanElement>("theTime").innerHTML = "inspecting";
      }
    } else if (globals.options.useBld == 1) {
      globals.main.timerStatus = 4;
      globals.main.memoTime = new Date();
      $<HTMLSpanElement>("theTime").style.color = $<HTMLInputElement>(
        "memcol"
      ).value;
      if (globals.main.timerupdate == 1 || globals.main.timerupdate == 2) {
        globals.main.memoID = setInterval(
          updateMemo,
          globals.main.timerupdate == 1 ? 10 : 100
        );
      } else {
        $<HTMLSpanElement>("theTime").innerHTML = "memorizing";
      }
    } else {
      globals.main.timerStatus = 1;
      globals.main.startTime = new Date();
      globals.options.penalty = 0;
      $<HTMLSpanElement>("theTime").style.color = globals.main.nightMode
        ? "#fff"
        : $<HTMLInputElement>("fcol").value;
      if (globals.main.timerupdate == 1 || globals.main.timerupdate == 2) {
        globals.main.timerID = setInterval(
          updateTimer,
          globals.main.timerupdate == 1 ? 10 : 100
        );
      } else {
        $<HTMLSpanElement>("theTime").innerHTML = "running";
      }
    }
  } else if (globals.main.timerStatus == 4 && keyCode == 32) {
    globals.main.timerStatus = 1;
    globals.main.startTime = new Date();
    $<HTMLSpanElement>("theTime").style.color = globals.main.nightMode
      ? "#fff"
      : $<HTMLInputElement>("fcol").value;
    var memoLength =
      globals.main.startTime.getTime() - globals.main.memoTime.getTime();
    if (globals.main.timerupdate == 1 || globals.main.timerupdate == 2) {
      clearInterval(globals.main.memoID);
      globals.main.timerID = setInterval(
        updateMemo,
        globals.main.timerupdate == 1 ? 10 : 100
      );
    } else {
      $<HTMLSpanElement>("theTime").innerHTML = "running";
    }
  } else if (globals.main.timerStatus == 2 && keyCode == 32) {
    globals.main.timerStatus = 1;
    globals.main.startTime = new Date();
    $<HTMLSpanElement>("theTime").style.color = globals.main.nightMode
      ? "#fff"
      : $<HTMLInputElement>("fcol").value;
    var inspecLength =
      globals.main.startTime.getTime() - globals.main.inspectionTime.getTime();
    globals.options.penalty =
      inspecLength < 15000 ? 0 : inspecLength < 17000 ? 2 : 1;
    clearInterval(globals.main.inspectionID);
    if (globals.main.timerupdate == 1 || globals.main.timerupdate == 2) {
      globals.main.timerID = setInterval(
        updateTimer,
        globals.main.timerupdate == 1 ? 10 : 100
      );
    } else {
      $<HTMLSpanElement>("theTime").innerHTML = "running";
    }
  }
}

function stopTimer(keyCode?: number) {
  if (keyCode == 32) {
    $<HTMLSelectElement>("optbox").blur();
    $<HTMLInputElement>("leng").blur();
  }
  if (globals.options.manualEnter == 1) {
    if (keyCode == 13) {
      var timeStr = $<HTMLInputElement>("timeEntry").value;
      var nonzero = false;
      var dnfRegex = new RegExp(".*(DNF|dnf)\\((.*)\\).*");
      if (timeStr.match(/.* .*/)) {
        nonzero = parseTime(timeStr.replace(/(.*) .*/, "$1"), true);
        if (nonzero) {
          // if time breaks, ignore comments/notes
          globals.main.comments[
            globals.main.times.length - 1
          ] = timeStr.replace(/.*? (.*)$/, "$1");
        }
      } else if (timeStr.match(dnfRegex)) {
        nonzero = parseTime(dnfRegex.exec(timeStr)[2]);
      } else {
        nonzero = parseTime(timeStr, false);
      }
      if (nonzero) {
        if (timeStr.match(/.*(DNF|dnf).*/)) {
          globals.main.notes[globals.main.times.length - 1] = 1;
        } else if (timeStr.match(/.*\+.*/)) {
          globals.main.notes[globals.main.times.length - 1] = 2;
        } else {
          globals.main.notes[globals.main.times.length - 1] = 0;
        }
        loadList(); // unfortunately have to do this twice ;|
        getStats(false);
      }
      $<HTMLInputElement>("timeEntry").value = "";
      if (nonzero)
        globals.main.scrambleArr[
          globals.main.scrambleArr.length
        ] = getScramble();
      rescramble3();
    }
  } else if (globals.main.timerStatus == 1) {
    globals.main.timerStatus = keyCode == 32 ? 0 : 3;
    if (globals.main.timerupdate == 1 || globals.main.timerupdate == 2) {
      clearInterval(globals.main.timerID);
    }
    getTime(globals.options.penalty);
    globals.main.scrambleArr[globals.main.scrambleArr.length] = getScramble();
    rescramble3();
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

function updateTimer() {
  globals.main.curTime = new Date();
  var time = globals.main.curTime.getTime() - globals.main.startTime.getTime();
  if (globals.main.timerupdate == 1) {
    $<HTMLSpanElement>("theTime").innerHTML = pretty(time);
  } else {
    $<HTMLSpanElement>("theTime").innerHTML = pretty(time).split(".")[0];
  }
}

function updateMemo() {
  globals.main.curTime = new Date();
  var time = globals.main.curTime.getTime() - globals.main.memoTime.getTime();
  if (globals.main.timerupdate == 1) {
    $<HTMLSpanElement>("theTime").innerHTML = pretty(time);
  } else {
    $<HTMLSpanElement>("theTime").innerHTML = pretty(time).split(".")[0];
  }
}

function updateInspec() {
  globals.main.curTime = new Date();
  var time =
    globals.main.curTime.getTime() - globals.main.inspectionTime.getTime();
  $<HTMLSpanElement>("theTime").textContent =
    time > 17000
      ? "DNF"
      : time > 15000
      ? "+2"
      : (15 - Math.floor(time / 1000)).toString();
}

function getTime(note) {
  globals.main.curTime = new Date();

  if (globals.options.useBld == 1) {
    var time = globals.main.curTime.getTime() - globals.main.memoTime.getTime();
    var mtime =
      globals.main.startTime.getTime() - globals.main.memoTime.getTime();
  } else {
    var time =
      globals.main.curTime.getTime() - globals.main.startTime.getTime();
  }
  globals.main.times[globals.main.times.length] = time;
  globals.main.notes[globals.main.notes.length] = note;
  if (globals.options.useBld == 1) {
    globals.main.comments[globals.main.comments.length] = pretty(mtime);
  } else {
    globals.main.comments[globals.main.comments.length] = "";
  }
  $<HTMLSpanElement>("theTime").innerHTML = pretty(time);
  clearHighlight();
  loadList();
  getStats(true); // should be false, but it doesn't hurt
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

function getBrowser() {
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

// #################### OPTIONS ####################

function toggleTimer() {
  stopTimer();
  globals.main.timerupdate = (globals.main.timerupdate + 1) % 4;
  setCookie("timerupdate", globals.main.timerupdate);
  $("toggler").innerHTML =
    globals.main.timerupdate == 0
      ? "off"
      : globals.main.timerupdate == 1
      ? "on"
      : globals.main.timerupdate == 2
      ? "seconds only"
      : "inspection only";
}

function toggleMilli() {
  globals.options.useMilli = 1 - globals.options.useMilli;
  setCookie("useMilli", globals.options.useMilli);
  $("millisec").innerHTML =
    globals.options.useMilli == 1 ? "1/1000 sec" : "1/100 sec";
  loadList();
  getStats(true);
}

function toggleBld() {
  if (globals.options.inspection == 0) {
    globals.options.useBld = 1 - globals.options.useBld;
  }
  setCookie("useBld", globals.options.useBld);
  $("bldmode").innerHTML = globals.options.useBld == 1 ? "on" : "off";
}

function toggleMono() {
  globals.main.useMono = 1 - globals.main.useMono;
  setCookie("useMono", globals.main.useMono);
  $("monospace").innerHTML = globals.main.useMono == 1 ? "on" : "off";
  $("scramble").style.fontFamily =
    globals.main.useMono == 1 ? "monospace" : "serif";
  $("getlast").style.color = parseColor($<HTMLInputElement>("lcol").value);
}

function toggleInput() {
  if (globals.options.manualEnter == 0) stopTimer();
  globals.options.manualEnter = 1 - globals.options.manualEnter;
  globals.options.typingFocus = false;
  setCookie("manualEnter", globals.options.manualEnter);
  $("inputTimes").innerHTML =
    globals.options.manualEnter == 1 ? "typing" : "timer";
  $<HTMLSpanElement>("theTime").innerHTML =
    globals.options.manualEnter == 1
      ? "<input id='timeEntry' size=12 style='font-size:100%'>" +
        " <span onclick='stopTimer(13);' class='a' style='color:" +
        parseColor($<HTMLInputElement>("lcol").value) +
        "'>enter</span>"
      : "ready";
  if ($<HTMLInputElement>("timeEntry") != null) {
    $<HTMLInputElement>("timeEntry").onfocus = function () {
      globals.options.typingFocus = true;
    };
    $<HTMLInputElement>("timeEntry").onblur = function () {
      globals.options.typingFocus = false;
    };
  }
}

function toggleOptions() {
  globals.options.showOptions = 1 - globals.options.showOptions;
  $("showOpt").innerHTML = globals.options.showOptions == 1 ? "hide" : "show";
  $("options").style.display = globals.options.showOptions == 1 ? "" : "none";
}

function increaseSize() {
  globals.options.timerSize++;
  setCookie("timerSize", globals.options.timerSize);
  $<HTMLSpanElement>("theTime").style.fontSize =
    globals.options.timerSize + "em";
  $("theList").style.height =
    Math.max(16, globals.options.timerSize * 1.5) + "em";
  $("stats").style.height =
    Math.max(16, globals.options.timerSize * 1.5) + "em";
}

function decreaseSize() {
  if (globals.options.timerSize >= 2) globals.options.timerSize--;
  setCookie("timerSize", globals.options.timerSize);
  $<HTMLSpanElement>("theTime").style.fontSize =
    globals.options.timerSize + "em";
  $("theList").style.height =
    Math.max(16, globals.options.timerSize * 1.5) + "em";
  $("stats").style.height =
    Math.max(16, globals.options.timerSize * 1.5) + "em";
}

function increaseScrambleSize() {
  globals.options.scrambleSize += 4;
  setCookie("scrSize", globals.options.scrambleSize);
  $("scramble").style.fontSize = globals.options.scrambleSize + "px";
  $("getlast").style.fontSize = globals.options.scrambleSize + "px";
}

function decreaseScrambleSize() {
  if (globals.options.scrambleSize > 8) globals.options.scrambleSize -= 4;
  setCookie("scrSize", globals.options.scrambleSize);
  $("scramble").style.fontSize = globals.options.scrambleSize + "px";
  $("getlast").style.fontSize = globals.options.scrambleSize + "px";
}

function toggleInspection() {
  globals.options.inspection = 1 - globals.options.inspection;
  if (globals.options.inspection == 1) {
    globals.options.useBld = 0;
  }
  setCookie("useBld", globals.options.useBld);
  setCookie("inspection", globals.options.inspection);
  $("inspec").innerHTML = globals.options.inspection == 1 ? "WCA" : "no";
  $("bldmode").innerHTML = globals.options.useBld == 1 ? "on" : "off";
}

function toggleAvgN() {
  globals.options.useAvgN = 1 - globals.options.useAvgN;
  setCookie("useAvgN", globals.options.useAvgN);
  $("avgn").innerHTML = globals.options.useAvgN == 1 ? "using" : "not using";
  getStats(true);
}

function toggleMoN() {
  globals.main.useMoN = 1 - globals.main.useMoN;
  setCookie("useMoN", globals.main.useMoN);
  $("mon").innerHTML = globals.main.useMoN == 1 ? "using" : "not using";
  getStats(true);
}

function toggleStatView() {
  globals.options.viewstats = 1 - globals.options.viewstats;
  getStats(globals.options.viewstats);
}

function changeColor() {
  ($("menu") as HTMLTableCellElement).bgColor = parseColor(
    $<HTMLInputElement>("tcol").value
  );
  if (globals.main.nightMode) {
    document.bgColor = "#000";
    document.body.style.color = "#fff";
  } else {
    document.bgColor = parseColor($<HTMLInputElement>("bcol").value);
    document.body.style.color = parseColor($<HTMLInputElement>("fcol").value);
  }

  if (getBrowser() != "IE") {
    var links = document.getElementsByClassName(
      "a"
    ) as HTMLCollectionOf<HTMLAnchorElement>;
    for (var i = 0; i < links.length; i++) {
      links[i].style.color = parseColor($<HTMLInputElement>("lcol").value);
    }
  } else {
    var spans = document.getElementsByTagName(
      "span"
    ) as HTMLCollectionOf<HTMLSpanElement>;
    for (var i = 0; i < spans.length; i++) {
      if (spans[i].className == "a") {
        spans[i].style.color = parseColor($<HTMLInputElement>("lcol").value);
      }
    }
  }

  globals.options.highlightColor = parseColor(
    $<HTMLInputElement>("hcol").value
  );
  $("getlast").style.color = parseColor($<HTMLInputElement>("lcol").value);
  setCookie("tColor", $<HTMLInputElement>("tcol").value);
  setCookie("bColor", $<HTMLInputElement>("bcol").value);
  setCookie("fColor", $<HTMLInputElement>("fcol").value);
  setCookie("lColor", $<HTMLInputElement>("lcol").value);
  setCookie("hColor", $<HTMLInputElement>("hcol").value);
  setCookie("memColor", $<HTMLInputElement>("memcol").value);
}

function parseColor(str) {
  for (var i = 0; i < globals.options.validColors.length; i++) {
    if (str == globals.options.validColors[i]) {
      return str;
    }
  }
  while (str.length < 6) str += "0";
  return "#" + str;
}

function resetColors() {
  $<HTMLInputElement>("tcol").value = "00ff00";
  $<HTMLInputElement>("bcol").value = "white";
  $<HTMLInputElement>("fcol").value = "black";
  $<HTMLInputElement>("lcol").value = "blue";
  $<HTMLInputElement>("hcol").value = "yellow";
  $<HTMLInputElement>("memcol").value = "green";
  changeColor();
}

function toggleNightMode() {
  globals.main.nightMode = !globals.main.nightMode;
  if (globals.main.nightMode) {
    document.bgColor = "#000";
    document.body.style.color = "#fff";
    $<HTMLSpanElement>("theTime").style.color = "#fff";
  } else {
    document.bgColor = parseColor($<HTMLInputElement>("bcol").value);
    document.body.style.color = parseColor($<HTMLInputElement>("fcol").value);
    $<HTMLSpanElement>("theTime").style.color = parseColor(
      $<HTMLInputElement>("fcol").value
    );
  }
}

/* setCookie and getCookie functions originally from http://www.quirksmode.org/js/cookies.html */
function setCookie(name, value) {
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

function getCookieNumber(
  name: string,
  defaultValue: number = null
): number | null {
  const value: string | null = getCookie(name);
  if (value === null) {
    return defaultValue;
  }
  return parseInt(value);
}

function getCookieWithDefault(
  name: string,
  defaultValue: string
): string | null {
  const value: string | null = getCookie(name);
  if (value === null) {
    return defaultValue;
  }
  return value;
}

function getCookie(name: string): string | null {
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

function saveSession() {
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

function getSession() {
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

setDelegates(loadList, changeColor);

export const qqtimerWindowGlobals = {
  changeColor,
  comment,
  decreaseScrambleSize,
  decreaseSize,
  getlastscramble,
  getSession,
  increaseScrambleSize,
  increaseSize,
  rescramble,
  rescramble2,
  rescramble3,
  resetColors,
  setCookie,
  toggleAvgN,
  toggleBld,
  toggleInput,
  toggleInspection,
  toggleMilli,
  toggleMoN,
  toggleMono,
  toggleNightMode,
  toggleOptions,
  toggleTimer,
};
