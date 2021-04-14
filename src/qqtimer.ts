import { $, setStyle } from "./dom";
import {
  getLen,
  getScrambleType,
  setLen,
  setScrambleType,
  scrambleIt,
  getScramble,
  getLastScramble,
  clearScramble,
  initializeScramblers,
  scrdata,
} from "./scramble";

type AvgOrMeanWithoutSD =
  | [number, (null | number)[], (null | number)[]]
  | [-1, -1, -1]; // TODO
type AvgOrMeanWithSD = [mean: number, variance: number] | [-1, -1, -1]; // TODO
type AllStatsWithSD = [
  numdnf: number,
  sessionavg: AvgOrMeanWithSD,
  sessionmean: number
];

const setInterval = window.setInterval; // TODO

var startTime: Date | undefined;
var curTime: Date | undefined;
var inspectionTime: Date | undefined;
var timerStatus: 0 | 1 | 2 | 3 | 4; // 0 = stopped, 1 = running, 2 = inspecting, 3 = waiting, 4 = memo
var times: number[] = [];
var notes: (0 | 1 | 2)[] = [];
var comments: string[] = [];
var scrambleArr: string[] = [];
// var importScrambles = []; // TODO: Remove
var timerID: number;
var inspectionID: number;
var memoID: number;
var timerupdate = 1;
var highlightStart: number;
var highlightStop: number;
var highlightID: number;
// var sessionID = 0; // TODO: Remove
var nightMode = false;

// Missing values
let memoTime: Date; // TODO: why was this missing from the original?
let useMoN: number;
let useMono: number;

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
    times = [];
    notes = [];
    comments = [];
    scrambleArr = [];
    window.focus();
  }
  showOptions = 0;
  //toggleOptions(); // options are shown by default
  avgSizes = [50, 5, 12, 100, 1000];
  moSize = 3;
  bestAvg = [
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
  ];
  lastAvg = [
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
  ];
  bestMo = [-1, 0];
  lastMo = [-1, 0];
  bestAvgIndex = [0, 0, 0, 0, 0];
  bestMoIndex = 0;
  bestTime = -1;
  bestTimeIndex = 0;
  worstTime = -1;
  worstTimeIndex = 0;
  clearHighlight();
  if (timerStatus != 0) {
    clearInterval(timerID);
    clearInterval(inspectionID);
  }
  timerStatus = 3;

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
  var oldManualEnter = manualEnter;
  manualEnter = getCookieNumber("manualEnter", 1);
  if (manualEnter != oldManualEnter) {
    toggleInput();
    manualEnter = 1 - manualEnter;
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
  $("inputTimes").innerHTML = manualEnter == 1 ? "typing" : "timer";
  $<HTMLSpanElement>("theTime").innerHTML =
    manualEnter == 1
      ? "<input id='timeEntry' size=12 style='font-size:100%'>" +
        " <span onclick='stopTimer(13);' class='a' style='color:" +
        parseColor($<HTMLInputElement>("lcol").value) +
        "'>enter</span>"
      : "ready";
  timerSize = getCookieNumber("timerSize", 2);
  $<HTMLSpanElement>("theTime").style.fontSize = timerSize + "em";
  scrambleSize = getCookieNumber("scrSize", 16);
  $("scramble").style.fontSize = scrambleSize + "px";
  $("getlast").style.fontSize = scrambleSize + "px";
  $("theList").style.height = Math.max(16, timerSize * 1.5) + "em";
  $("stats").style.height = Math.max(16, timerSize * 1.5) + "em";
  inspection = getCookieNumber("inspection", 0);
  $("inspec").innerHTML = inspection == 1 ? "WCA" : "no";
  if (inspection == 0) {
    useBld = getCookieNumber("useBld", 0);
  } else {
    useBld = 0;
    setCookie("useBld", 0);
  }
  $("bldmode").innerHTML = useBld == 1 ? "on" : "off";
  useAvgN = getCookieNumber("useAvgN", 0);
  $("avgn").innerHTML = useAvgN == 1 ? "using" : "not using";
  useMoN = getCookieNumber("useMoN", 0);
  $("mon").innerHTML = useMoN == 1 ? "using" : "not using";
  useMono = getCookieNumber("useMono", 0);
  $("monospace").innerHTML = useMono == 1 ? "on" : "off";
  $("scramble").style.fontFamily = useMono == 1 ? "monospace" : "serif";
  $("getlast").style.color = parseColor($<HTMLInputElement>("lcol").value);
  setScrambleType(getCookieWithDefault("scrType", "333"));
  if (query.length > 0) setScrambleType(query);

  loadList();
  getStats(true);

  initializeScramblers();

  curTime = new Date(0);
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
    timerStatus == 0 &&
    manualEnter == 0 &&
    keyCode == 32 &&
    importFocus == 0
  ) {
    timerStatus = 3;
  } else if (
    timerStatus == 3 &&
    manualEnter == 0 &&
    keyCode == 32 &&
    new Date().getTime() - curTime.getTime() >= 300 &&
    importFocus == 0
  ) {
    if (getScrambleType() == "sqrs") {
      $("scramble").innerHTML = "scramble: loading... ";
    }
    if (inspection == 1) {
      timerStatus = 2;
      inspectionTime = new Date();
      $<HTMLSpanElement>("theTime").style.color = "red";
      if (timerupdate != 0) {
        inspectionID = setInterval(updateInspec, timerupdate == 1 ? 10 : 100);
      } else {
        $<HTMLSpanElement>("theTime").innerHTML = "inspecting";
      }
    } else if (useBld == 1) {
      timerStatus = 4;
      memoTime = new Date();
      $<HTMLSpanElement>("theTime").style.color = $<HTMLInputElement>(
        "memcol"
      ).value;
      if (timerupdate == 1 || timerupdate == 2) {
        memoID = setInterval(updateMemo, timerupdate == 1 ? 10 : 100);
      } else {
        $<HTMLSpanElement>("theTime").innerHTML = "memorizing";
      }
    } else {
      timerStatus = 1;
      startTime = new Date();
      penalty = 0;
      $<HTMLSpanElement>("theTime").style.color = nightMode
        ? "#fff"
        : $<HTMLInputElement>("fcol").value;
      if (timerupdate == 1 || timerupdate == 2) {
        timerID = setInterval(updateTimer, timerupdate == 1 ? 10 : 100);
      } else {
        $<HTMLSpanElement>("theTime").innerHTML = "running";
      }
    }
  } else if (timerStatus == 4 && keyCode == 32) {
    timerStatus = 1;
    startTime = new Date();
    $<HTMLSpanElement>("theTime").style.color = nightMode
      ? "#fff"
      : $<HTMLInputElement>("fcol").value;
    var memoLength = startTime.getTime() - memoTime.getTime();
    if (timerupdate == 1 || timerupdate == 2) {
      clearInterval(memoID);
      timerID = setInterval(updateMemo, timerupdate == 1 ? 10 : 100);
    } else {
      $<HTMLSpanElement>("theTime").innerHTML = "running";
    }
  } else if (timerStatus == 2 && keyCode == 32) {
    timerStatus = 1;
    startTime = new Date();
    $<HTMLSpanElement>("theTime").style.color = nightMode
      ? "#fff"
      : $<HTMLInputElement>("fcol").value;
    var inspecLength = startTime.getTime() - inspectionTime.getTime();
    penalty = inspecLength < 15000 ? 0 : inspecLength < 17000 ? 2 : 1;
    clearInterval(inspectionID);
    if (timerupdate == 1 || timerupdate == 2) {
      timerID = setInterval(updateTimer, timerupdate == 1 ? 10 : 100);
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
  if (manualEnter == 1) {
    if (keyCode == 13) {
      var timeStr = $<HTMLInputElement>("timeEntry").value;
      var nonzero = false;
      var dnfRegex = new RegExp(".*(DNF|dnf)\\((.*)\\).*");
      if (timeStr.match(/.* .*/)) {
        nonzero = parseTime(timeStr.replace(/(.*) .*/, "$1"), true);
        if (nonzero) {
          // if time breaks, ignore comments/notes
          comments[times.length - 1] = timeStr.replace(/.*? (.*)$/, "$1");
        }
      } else if (timeStr.match(dnfRegex)) {
        nonzero = parseTime(dnfRegex.exec(timeStr)[2]);
      } else {
        nonzero = parseTime(timeStr, false);
      }
      if (nonzero) {
        if (timeStr.match(/.*(DNF|dnf).*/)) {
          notes[times.length - 1] = 1;
        } else if (timeStr.match(/.*\+.*/)) {
          notes[times.length - 1] = 2;
        } else {
          notes[times.length - 1] = 0;
        }
        loadList(); // unfortunately have to do this twice ;|
        getStats(false);
      }
      $<HTMLInputElement>("timeEntry").value = "";
      if (nonzero) scrambleArr[scrambleArr.length] = getScramble();
      rescramble3();
    }
  } else if (timerStatus == 1) {
    timerStatus = keyCode == 32 ? 0 : 3;
    if (timerupdate == 1 || timerupdate == 2) {
      clearInterval(timerID);
    }
    getTime(penalty);
    scrambleArr[scrambleArr.length] = getScramble();
    rescramble3();
  }
}

function checkKey(keyCode, shiftKey) {
  if (
    keyCode == 13 ||
    (manualEnter == 0 && timerStatus != 0 && timerStatus != 3)
  ) {
    // normally, any key enters a time; with manual enter, only Enter does
    stopTimer(keyCode);
  } else if (keyCode == 8 && manualEnter == 0) {
    // backspace applies DNF
    if (notes[notes.length - 1] == 1) {
      changeNotes(0);
    } else {
      changeNotes(1);
    }
  } else if ((keyCode == 61 || keyCode == 187) && manualEnter == 0) {
    // +/= applies +2 penalty
    if (notes[notes.length - 1] == 2) {
      changeNotes(0);
    } else {
      changeNotes(2);
    }
  } else if (keyCode == 173 || keyCode == 189) {
    // -/_ applies no penalty
    changeNotes(0);
  } else if (keyCode == 46 && !shiftKey && times.length > 0) {
    // delete removes last solve
    del(times.length - 1);
  } else if (keyCode == 46 && shiftKey) {
    // shift+delete clears session
    resetTimes();
  }
}

function updateTimer() {
  curTime = new Date();
  var time = curTime.getTime() - startTime.getTime();
  if (timerupdate == 1) {
    $<HTMLSpanElement>("theTime").innerHTML = pretty(time);
  } else {
    $<HTMLSpanElement>("theTime").innerHTML = pretty(time).split(".")[0];
  }
}

function updateMemo() {
  curTime = new Date();
  var time = curTime.getTime() - memoTime.getTime();
  if (timerupdate == 1) {
    $<HTMLSpanElement>("theTime").innerHTML = pretty(time);
  } else {
    $<HTMLSpanElement>("theTime").innerHTML = pretty(time).split(".")[0];
  }
}

function updateInspec() {
  curTime = new Date();
  var time = curTime.getTime() - inspectionTime.getTime();
  $<HTMLSpanElement>("theTime").textContent =
    time > 17000
      ? "DNF"
      : time > 15000
      ? "+2"
      : (15 - Math.floor(time / 1000)).toString();
}

function getTime(note) {
  curTime = new Date();

  if (useBld == 1) {
    var time = curTime.getTime() - memoTime.getTime();
    var mtime = startTime.getTime() - memoTime.getTime();
  } else {
    var time = curTime.getTime() - startTime.getTime();
  }
  times[times.length] = time;
  notes[notes.length] = note;
  if (useBld == 1) {
    comments[comments.length] = pretty(mtime);
  } else {
    comments[comments.length] = "";
  }
  $<HTMLSpanElement>("theTime").innerHTML = pretty(time);
  clearHighlight();
  loadList();
  getStats(true); // should be false, but it doesn't hurt
}

function parseTime(s: string, importing: boolean = false) {
  var time = 0;
  var arr = s.split(":");
  if (arr.length == 3) {
    time =
      3600000 * parseInt(arr[0]) +
      60000 * parseInt(arr[1]) +
      1000 * parseFloat(arr[2]);
  } else if (arr.length == 2) {
    time = 60000 * parseInt(arr[0]) + 1000 * parseFloat(arr[1]);
  } else if (arr.length == 1) {
    time = 1000 * parseFloat(arr[0]);
  }
  time = Math.round(time);
  if (isNaN(time)) time = 0;
  if (time != 0) {
    // don't insert zero-times
    if (!importing) {
      notes[notes.length] = 0;
      comments[comments.length] = "";
    } else if (notes[times.length] == 2) {
      time -= 2000;
    }
    times[times.length] = time;
    if (!importing) {
      clearHighlight();
      loadList();
      getStats(false);
    }
    return true;
  } else {
    return false;
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
  if (highlightStop != -1 && highlightStop - highlightStart > 1) {
    var mean = 0;
    if (highlightID > 10 && highlightID % 10 > 1) mean = 1; // check to see if this is a mean-of-N or not
    if (mean) {
      data = getMeanSD(
        highlightStart,
        highlightStop - highlightStart + 1,
        false
      );
    } else {
      data = getAvgSD(
        highlightStart,
        highlightStop - highlightStart + 1,
        false
      );
    }
  }
  for (var i = 0; i < times.length; i++) {
    if (i == highlightStart) {
      s += "<span style='background-color: " + highlightColor + "'>";
    }
    if (
      data[1].indexOf(i - highlightStart) > -1 ||
      data[2].indexOf(i - highlightStart) > -1
    )
      s += "(";
    var time = times[i];
    if (notes[i] == 0) {
      s += "<span onclick='del(" + i + ");' class='b'>" + pretty(time);
    } else if (notes[i] == 2) {
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
    s += (comments[i] ? "[" + comments[i] + "]" : "") + "</span>";
    if (
      data[1].indexOf(i - highlightStart) > -1 ||
      data[2].indexOf(i - highlightStart) > -1
    )
      s += ")";
    if (i == highlightStop) {
      s += "</span>";
    }
    s += i == times.length - 1 ? " " : ", ";
  }
  $("theList").innerHTML = s;
  saveSession();
  // move scrollbar to bottom:
  var window = $("theList");
  window.scrollTop = window.scrollHeight;
  changeColor();
}

function del(index) {
  var prettyTime = pretty(times[index]);
  if (notes[index] == 1) prettyTime = "DNF(" + prettyTime + ")";
  if (notes[index] == 2) prettyTime = pretty(times[index] + 2000) + "+";
  if (confirm("Are you sure you want to delete the " + prettyTime + "?")) {
    for (var i = index; i < times.length - 1; i++) {
      times[i] = times[i + 1];
      notes[i] = notes[i + 1];
      comments[i] = comments[i + 1];
      scrambleArr[i] = scrambleArr[i + 1];
    }
    times.pop();
    notes.pop();
    comments.pop();
    scrambleArr.pop();
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
    comments[comments.length - 1]
  );
  if (newComment != null) {
    comments[comments.length - 1] = newComment;
  } else {
    comments[comments.length - 1] = "";
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

var useMilli = 0;
var manualEnter = 0;
var showOptions = 0;
var timerSize = 2;
var scrambleSize = 16;
var inspection = 0;
var useBld = 0;
var penalty = 0;
var useAvgN = 0;
var viewstats = 1;
var importFocus = 0;
var typingFocus = false;
var validColors = [
  "black",
  "brown",
  "white",
  "purple",
  "violet",
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "gray",
  "grey",
  "pink",
];
var highlightColor;

function toggleImport() {
  if ($("import").style.display == "block") {
    $("import").style.display = "none";
    importFocus = 0;
  } else {
    $("import").style.display = "block";
    importFocus = 1;
  }
}

function toggleTimer() {
  stopTimer();
  timerupdate = (timerupdate + 1) % 4;
  setCookie("timerupdate", timerupdate);
  $("toggler").innerHTML =
    timerupdate == 0
      ? "off"
      : timerupdate == 1
      ? "on"
      : timerupdate == 2
      ? "seconds only"
      : "inspection only";
}

function toggleMilli() {
  useMilli = 1 - useMilli;
  setCookie("useMilli", useMilli);
  $("millisec").innerHTML = useMilli == 1 ? "1/1000 sec" : "1/100 sec";
  loadList();
  getStats(true);
}

function toggleBld() {
  if (inspection == 0) {
    useBld = 1 - useBld;
  }
  setCookie("useBld", useBld);
  $("bldmode").innerHTML = useBld == 1 ? "on" : "off";
}

function toggleMono() {
  useMono = 1 - useMono;
  setCookie("useMono", useMono);
  $("monospace").innerHTML = useMono == 1 ? "on" : "off";
  $("scramble").style.fontFamily = useMono == 1 ? "monospace" : "serif";
  $("getlast").style.color = parseColor($<HTMLInputElement>("lcol").value);
}

function toggleInput() {
  if (manualEnter == 0) stopTimer();
  manualEnter = 1 - manualEnter;
  typingFocus = false;
  setCookie("manualEnter", manualEnter);
  $("inputTimes").innerHTML = manualEnter == 1 ? "typing" : "timer";
  $<HTMLSpanElement>("theTime").innerHTML =
    manualEnter == 1
      ? "<input id='timeEntry' size=12 style='font-size:100%'>" +
        " <span onclick='stopTimer(13);' class='a' style='color:" +
        parseColor($<HTMLInputElement>("lcol").value) +
        "'>enter</span>"
      : "ready";
  if ($<HTMLInputElement>("timeEntry") != null) {
    $<HTMLInputElement>("timeEntry").onfocus = function () {
      typingFocus = true;
    };
    $<HTMLInputElement>("timeEntry").onblur = function () {
      typingFocus = false;
    };
  }
}

function toggleOptions() {
  showOptions = 1 - showOptions;
  $("showOpt").innerHTML = showOptions == 1 ? "hide" : "show";
  $("options").style.display = showOptions == 1 ? "" : "none";
}

function increaseSize() {
  timerSize++;
  setCookie("timerSize", timerSize);
  $<HTMLSpanElement>("theTime").style.fontSize = timerSize + "em";
  $("theList").style.height = Math.max(16, timerSize * 1.5) + "em";
  $("stats").style.height = Math.max(16, timerSize * 1.5) + "em";
}

function decreaseSize() {
  if (timerSize >= 2) timerSize--;
  setCookie("timerSize", timerSize);
  $<HTMLSpanElement>("theTime").style.fontSize = timerSize + "em";
  $("theList").style.height = Math.max(16, timerSize * 1.5) + "em";
  $("stats").style.height = Math.max(16, timerSize * 1.5) + "em";
}

function increaseScrambleSize() {
  scrambleSize += 4;
  setCookie("scrSize", scrambleSize);
  $("scramble").style.fontSize = scrambleSize + "px";
  $("getlast").style.fontSize = scrambleSize + "px";
}

function decreaseScrambleSize() {
  if (scrambleSize > 8) scrambleSize -= 4;
  setCookie("scrSize", scrambleSize);
  $("scramble").style.fontSize = scrambleSize + "px";
  $("getlast").style.fontSize = scrambleSize + "px";
}

function toggleInspection() {
  inspection = 1 - inspection;
  if (inspection == 1) {
    useBld = 0;
  }
  setCookie("useBld", useBld);
  setCookie("inspection", inspection);
  $("inspec").innerHTML = inspection == 1 ? "WCA" : "no";
  $("bldmode").innerHTML = useBld == 1 ? "on" : "off";
}

function toggleAvgN() {
  useAvgN = 1 - useAvgN;
  setCookie("useAvgN", useAvgN);
  $("avgn").innerHTML = useAvgN == 1 ? "using" : "not using";
  getStats(true);
}

function toggleMoN() {
  useMoN = 1 - useMoN;
  setCookie("useMoN", useMoN);
  $("mon").innerHTML = useMoN == 1 ? "using" : "not using";
  getStats(true);
}

function toggleStatView() {
  viewstats = 1 - viewstats;
  getStats(viewstats);
}

function changeColor() {
  ($("menu") as HTMLTableCellElement).bgColor = parseColor(
    $<HTMLInputElement>("tcol").value
  );
  if (nightMode) {
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

  highlightColor = parseColor($<HTMLInputElement>("hcol").value);
  $("getlast").style.color = parseColor($<HTMLInputElement>("lcol").value);
  setCookie("tColor", $<HTMLInputElement>("tcol").value);
  setCookie("bColor", $<HTMLInputElement>("bcol").value);
  setCookie("fColor", $<HTMLInputElement>("fcol").value);
  setCookie("lColor", $<HTMLInputElement>("lcol").value);
  setCookie("hColor", $<HTMLInputElement>("hcol").value);
  setCookie("memColor", $<HTMLInputElement>("memcol").value);
}

function parseColor(str) {
  for (var i = 0; i < validColors.length; i++) {
    if (str == validColors[i]) {
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
  nightMode = !nightMode;
  if (nightMode) {
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
    for (var i = 0; i < times.length; i++) {
      value += times[i];
      if (comments[i] != "" && comments[i] !== null) {
        value += "|" + comments[i];
      }
      if (notes[i] == 1) value += "-";
      if (notes[i] == 2) value += "+";
      if (i < times.length - 1) value += ",";
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
  for (var i = 0; i < times.length; i++) {
    if (s.length < 3950) {
      // just in case!
      s += times[i];
      if (comments[i] != "" && comments[i] !== null) {
        s += "|" + comments[i];
      }
      if (notes[i] == 1) s += "-";
      if (notes[i] == 2) s += "+";
      if (i < times.length - 1) s += ",";
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
  times = [];
  notes = [];
  comments = [];
  scrambleArr = [];
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
        notes[j] = 1;
        t[j] = t[j].slice(0, t[j].length - 1);
      } else if (t[j].slice(-1) == "+") {
        notes[j] = 2;
        t[j] = t[j].slice(0, t[j].length - 1);
      } else {
        notes[j] = 0;
      }
      var q = t[j].split("|");
      times[j] = parseInt(q[0]);
      comments[j] = q[1] != null && q[1] != "" ? q[1] : "";
      scrambleArr[j] = "";
    }
  }
  clearHighlight();
}

// #################### STATISTICS ####################

var avgSizes, bestAvg, lastAvg, bestAvgIndex;
var bestTime, bestTimeIndex, worstTime, worstTimeIndex;
var moSize, bestMo, lastMo, bestMoIndex;

function getStats(recalc) {
  var avgSizes2 = avgSizes.slice(1 - useAvgN).sort(numsort);
  var numdnf: number = 0,
    sessionavg,
    sessionmean;
  if (recalc) {
    var theStats = getAllStats();
    numdnf = theStats[0];
    sessionavg = theStats[1];
    sessionmean = theStats[2];
  } else {
    // update averages and best time / worst time.
    var index = times.length - 1;
    var thisTime = notes[index] == 1 ? -1 : times[index] + notes[index] * 1000;
    if (bestTime < 0 || (thisTime != -1 && thisTime < bestTime)) {
      bestTime = thisTime;
      bestTimeIndex = index;
    }
    if (thisTime > worstTime) {
      worstTime = thisTime;
      worstTimeIndex = index;
    }
    for (var j = 0; j < avgSizes2.length; j++) {
      if (times.length < avgSizes2[j]) {
        break;
      } else {
        lastAvg[j] = getAvgSD(times.length - avgSizes2[j], avgSizes2[j], true);
        if (
          bestAvg[j][0] < 0 ||
          (lastAvg[j][0] != -1 && lastAvg[j][0] < bestAvg[j][0])
        ) {
          bestAvg[j] = lastAvg[j];
          bestAvgIndex[j] = times.length - avgSizes2[j];
        }
      }
    }
    if (times.length >= moSize) {
      lastMo = getMeanSD(times.length - moSize, moSize, true);
      if (bestMo[0] < 0 || (lastMo[0] != -1 && lastMo[0] < bestMo[0])) {
        bestMo = lastMo;
        bestMoIndex = times.length - moSize;
      }
    }
    var sessionsum = 0;
    for (var i = 0; i < times.length; i++) {
      var thisTime = notes[i] == 1 ? -1 : times[i] + notes[i] * 1000;
      if (thisTime == -1) {
        numdnf++;
      } else {
        sessionsum += thisTime;
      }
    }
    sessionavg = getAvgSD(0, times.length, true);
    sessionmean =
      numdnf == times.length ? -1 : sessionsum / (times.length - numdnf);
  }

  var s =
    "stats: (<span id='hidestats' onclick='toggleStatView()' class='a'>" +
    (viewstats ? "hide" : "show") +
    "</span>)<br>";
  s += "number of times: " + (times.length - numdnf) + "/" + times.length;
  if (viewstats) {
    s +=
      "<br>best time: <span onclick='setHighlight(" +
      bestTimeIndex +
      ",1,0);loadList();' class='a'>";
    s +=
      pretty(bestTime) +
      "</span><br>worst time: <span onclick='setHighlight(" +
      worstTimeIndex;
    s += ",1,1);loadList();' class='a'>" + pretty(worstTime) + "</span><br>";
    if (useMoN == 1) {
      if (times.length >= moSize) {
        s +=
          "<br>current mo" +
          moSize +
          ": <span onclick='setHighlight(" +
          (times.length - moSize);
        s +=
          "," +
          moSize +
          "," +
          moSize +
          "2);loadList();' class='a'>" +
          pretty(lastMo[0]);
        s += "</span> (&sigma; = " + trim(lastMo[1], 2) + ")<br>";
        s +=
          "best mo" + moSize + ": <span onclick='setHighlight(" + bestMoIndex;
        s +=
          "," +
          moSize +
          "," +
          moSize +
          "3);loadList();' class='a'>" +
          pretty(bestMo[0]);
        s += "</span> (&sigma; = " + trim(bestMo[1], 2) + ")<br>";
      }
    }
    for (var j = 0; j < avgSizes2.length; j++) {
      if (times.length >= avgSizes2[j]) {
        s +=
          "<br>current avg" +
          avgSizes2[j] +
          ": <span onclick='setHighlight(" +
          (times.length - avgSizes2[j]);
        s +=
          "," +
          avgSizes2[j] +
          "," +
          avgSizes2[j] +
          "1);loadList();' class='a'>" +
          pretty(lastAvg[j][0]);
        s += "</span> (&sigma; = " + trim(lastAvg[j][1], 2) + ")<br>";
        s +=
          "best avg" +
          avgSizes2[j] +
          ": <span onclick='setHighlight(" +
          bestAvgIndex[j];
        s +=
          "," +
          avgSizes2[j] +
          "," +
          avgSizes2[j] +
          "0);loadList();' class='a'>" +
          pretty(bestAvg[j][0]);
        s += "</span> (&sigma; = " + trim(bestAvg[j][1], 2) + ")<br>";
      }
    }

    s +=
      "<br>session avg: <span onclick='setHighlight(0," +
      times.length +
      ",2);loadList();' class='a'>";
    s +=
      pretty(sessionavg[0]) +
      "</span> (&sigma; = " +
      trim(sessionavg[1], 2) +
      ")<br>session mean: " +
      pretty(sessionmean);
  }
  $("stats").innerHTML = s;
  var window = $("stats");
  window.scrollTop = 0; // IE workaround (lol)
  changeColor();
}

function getAllStats(): AllStatsWithSD {
  var avgSizes2 = avgSizes.slice(1 - useAvgN).sort(numsort);
  bestAvg = [
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
  ];
  lastAvg = [
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
    [-1, 0],
  ];
  bestAvgIndex = [0, 0, 0, 0, 0];
  bestTime = -1;
  bestTimeIndex = 0;
  worstTime = -1;
  worstTimeIndex = 0;
  var numdnf = 0;
  var sessionsum = 0;
  bestMo = [-1, 0];
  lastMo = [-1, 0];
  bestMoIndex = 0;
  for (var i = 0; i < times.length; i++) {
    var thisTime = notes[i] == 1 ? -1 : times[i] + notes[i] * 1000;
    if (bestTime < 0 || (thisTime != -1 && thisTime < bestTime)) {
      bestTime = thisTime;
      bestTimeIndex = i;
    }
    if (thisTime > worstTime) {
      worstTime = thisTime;
      worstTimeIndex = i;
    }
    if (thisTime == -1) {
      numdnf++;
    } else {
      sessionsum += thisTime;
    }

    // calculate averages
    for (var j = 0; j < avgSizes2.length; j++) {
      if (times.length - i < avgSizes2[j]) {
        break;
      } else {
        lastAvg[j] = getAvgSD(i, avgSizes2[j], true);
        if (
          bestAvg[j][0] < 0 ||
          (lastAvg[j][0] != -1 && lastAvg[j][0] < bestAvg[j][0])
        ) {
          bestAvg[j] = lastAvg[j];
          bestAvgIndex[j] = i;
        }
      }
    }

    // calculate mean
    if (times.length - i >= moSize) {
      lastMo = getMeanSD(i, moSize, true);
      if (bestMo[0] < 0 || (lastMo[0] != -1 && lastMo[0] < bestMo[0])) {
        bestMo = lastMo;
        bestMoIndex = i;
      }
    }
  }

  var sessionavg = getAvgWithSD(0, times.length);
  var sessionmean =
    numdnf == times.length ? -1 : sessionsum / (times.length - numdnf);

  return [numdnf, sessionavg, sessionmean];
}

function numsort(a, b) {
  return a - b;
}

function setHighlight(start, nsolves, id) {
  // if we're trying to set a highlight that has same ID as the current one, clear it.
  if (id == highlightID) {
    clearHighlight();
  } else {
    var mean: number = 0;
    if (id > 10 && id % 10 > 1) mean = 1; // check to see if this is a mean-of-N or not
    highlightStart = start;
    highlightStop = start + nsolves - 1;
    highlightID = id;

    if (times.length == 0) return;
    var data: AvgOrMeanWithoutSD = [0, [null], [null]];
    if (highlightStop != -1 && highlightStop - highlightStart > 1) {
      if (mean) {
        data = getMeanWithoutSD(
          highlightStart,
          highlightStop - highlightStart + 1
        );
      } else {
        data = getAvgWithoutSD(
          highlightStart,
          highlightStop - highlightStart + 1
        );
      }
    }
    var s = "";
    if (id > 1) {
      if (id == 2) {
        s += "Session average";
      } else if (mean) {
        s += "Mean of " + Math.floor(id / 10);
      } else {
        s += "Average of " + Math.floor(id / 10);
      }
      s += ": " + pretty(data[0]) + "<br>";
    }
    for (var i = 0; i < nsolves; i++) {
      const typedData = data as [number, (null | number)[], (null | number)[]];

      s += i + 1 + ". ";
      if (typedData[1].indexOf(i) > -1 || typedData[2].indexOf(i) > -1)
        s += "(";
      s +=
        (notes[start + i] == 1 ? "DNF(" : "") +
        pretty(times[start + i] + (notes[start + i] == 2 ? 2000 : 0)) +
        (notes[start + i] == 1 ? ")" : "");
      s +=
        (notes[start + i] == 2 ? "+" : "") +
        (comments[start + i] ? "[" + comments[start + i] + "]" : "");
      if (typedData[1].indexOf(i) > -1 || typedData[2].indexOf(i) > -1)
        s += ")";
      s += " &nbsp; " + scrambleArr[start + i] + "<br>";
    }
    $("avgdata").innerHTML = "<td colspan='3'>" + s + "</td>";
    $("avgdata").style.display = "";
  }
}

function clearHighlight() {
  highlightStart = -1;
  highlightStop = -1;
  highlightID = -1;
  $("avgdata").style.display = "none";
}

function timesort(a, b) {
  // deal with DNFs; if they are both DNF it doesn't matter what we return
  var a2 = a[0],
    b2 = b[0];
  if (a2 < 0) a2 = b2 + 1;
  if (b2 < 0) b2 = a2 + 1;
  return a2 - b2;
}

function getAvgWithoutSD(start, nsolves): AvgOrMeanWithoutSD {
  return getAvgSD(start, nsolves, false) as AvgOrMeanWithoutSD;
}

function getAvgWithSD(start, nsolves): AvgOrMeanWithSD {
  return getAvgSD(start, nsolves, true) as AvgOrMeanWithSD;
}

// gets average and SD
function getAvgSD(start, nsolves, SD): AvgOrMeanWithoutSD | AvgOrMeanWithSD {
  if (nsolves < 3) {
    return [-1, -1, -1]; // TODO
  }

  // get list of times
  var timeArr: [number, number][] = [],
    t: number,
    j: number;
  for (j = 0; j < nsolves; j++) {
    t =
      notes[start + j] == 1
        ? -1
        : times[start + j] / 10 + notes[start + j] * 100;
    t = useMilli == 0 ? 10 * Math.round(t) : 10 * t;
    timeArr[timeArr.length] = [t, j];
  }

  // sort and take the average
  timeArr.sort(timesort);
  var trim = Math.ceil(nsolves / 20); // trimmed amount per side
  var sum = 0;
  for (j = trim; j < nsolves - trim; j++) {
    sum += timeArr[j][0];
  }
  sum = timeArr[nsolves - trim - 1][0] < 0 ? -1 : sum / (nsolves - 2 * trim);

  // get SD
  if (SD) {
    var variance = 0;
    for (j = trim; j < nsolves - trim; j++) {
      variance += Math.pow((timeArr[j][0] - sum) / 1000, 2);
    }
    variance = Math.sqrt(variance / (nsolves - trim * 2 - 1));
    return [sum, variance];
  } else {
    return [
      sum,
      dropTime(timeArr).slice(0, trim),
      dropTime(timeArr).slice(-trim),
    ];
  }
}

function dropTime(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    newArr[newArr.length] = arr[i][1];
  }
  return newArr;
}

function getMeanWithoutSD(start, nsolves): AvgOrMeanWithoutSD {
  return getMeanSD(start, nsolves, false) as AvgOrMeanWithoutSD;
}

function getMeanWithSD(start, nsolves): AvgOrMeanWithSD {
  return getMeanSD(start, nsolves, true) as AvgOrMeanWithSD;
}

function getMeanSD(start, nsolves, SD): AvgOrMeanWithSD | AvgOrMeanWithoutSD {
  // get list of times
  var timeArr = [],
    t,
    j;
  for (j = 0; j < nsolves; j++) {
    t =
      notes[start + j] == 1
        ? -1
        : times[start + j] / 10 + notes[start + j] * 100;
    t = useMilli == 0 ? 10 * Math.round(t) : 10 * t;
    timeArr[timeArr.length] = [t, j];
  }

  // sort and take the average
  timeArr.sort(timesort);
  var sum = 0;
  for (j = 0; j < nsolves; j++) {
    sum += timeArr[j][0];
  }
  var mean = timeArr[nsolves - 1][0] < 0 ? -1 : sum / nsolves;

  // get SD
  if (SD) {
    var variance = 0;
    for (j = 0; j < nsolves; j++) {
      variance += Math.pow((timeArr[j][0] - mean) / 1000, 2);
    }
    variance = Math.sqrt(variance / (nsolves - 1));
    return [mean, variance];
  } else {
    return [mean, [], []];
  }
}

function trim(number, nDigits) {
  if (
    !number ||
    number == Number.POSITIVE_INFINITY ||
    number == Number.NEGATIVE_INFINITY
  )
    number = 0;
  var power = Math.pow(10, nDigits);
  var trimmed = "" + Math.round(number * power);
  while (trimmed.length < nDigits + 1) {
    trimmed = "0" + trimmed;
  }
  var len = trimmed.length;
  return (
    trimmed.substr(0, len - nDigits) +
    "." +
    trimmed.substr(len - nDigits, nDigits)
  );
}

function pretty(time) {
  if (time < 0) {
    return "DNF";
  }
  time = Math.round(time / (useMilli == 1 ? 1 : 10));
  var bits = time % (useMilli == 1 ? 1000 : 100);
  time = (time - bits) / (useMilli == 1 ? 1000 : 100);
  var secs = time % 60;
  var mins = ((time - secs) / 60) % 60;
  var hours = (time - secs - 60 * mins) / 3600;
  var s = "" + bits;
  if (bits < 10) {
    s = "0" + s;
  }
  if (bits < 100 && useMilli == 1) {
    s = "0" + s;
  }
  s = secs + "." + s;
  if (secs < 10 && (mins > 0 || hours > 0)) {
    s = "0" + s;
  }
  if (mins > 0 || hours > 0) {
    s = mins + ":" + s;
  }
  if (mins < 10 && hours > 0) {
    s = "0" + s;
  }
  if (hours > 0) {
    s = hours + ":" + s;
  }
  return s;
}

function changeNotes(i) {
  // 0 is normal solve, 1 is DNF, 2 is +2
  notes[notes.length - 1] = i;
  clearHighlight();
  loadList();
  getStats(true);
}

function changeAvgN() {
  var n = parseInt($<HTMLInputElement>("avglen").value);
  if (isNaN(n) || n < 3 || n > 10000) n = 50;
  avgSizes[0] = n;
  clearHighlight();
  loadList();
  getStats(true);
}

function changeMoN() {
  var n = parseInt($<HTMLInputElement>("molen").value);
  if (isNaN(n) || n < 2 || n > 10000) n = 3;
  moSize = n;
  clearHighlight();
  loadList();
  getStats(true);
}

function importTimes() {
  // split
  var imported = $<HTMLTextAreaElement>("importedTimes").value;
  var itimes = imported.split("\n");
  if (itimes.length == 1) {
    itimes = imported.split(",");
  }

  // each element is either of the form (a) time, or (b) number. time scramble
  var index = times.length;
  for (var i = 0; i < itimes.length; i++) {
    var t = itimes[i];
    while (t.match(/^ /)) {
      t = t.slice(1);
    } // dump spaces on start
    while (t.match(/ $/)) {
      t = t.slice(0, t.length - 1);
    } // dump spaces on end
    var dot = t.split(" ")[0].slice(-1);

    // get to the time-only form
    if (dot != ".") {
      // concise
      scrambleArr[index] = "";
    } else {
      // verbose
      t = t.slice(t.indexOf(". ") + 2); // get rid of time number
      var scr = "";
      if (t.match(/.*\[.*\].*/)) {
        // comment, might contain spaces
        scr = t.slice(t.indexOf("] ") + 2);
        t = t.slice(0, t.indexOf("] ") + 1);
      } else {
        if (t.indexOf(" ") > -1) {
          scr = t.slice(t.indexOf(" ") + 1);
          t = t.slice(0, t.indexOf(" "));
        } else {
          scr = "";
        }
      }
      scrambleArr[index] = scr;
    }

    // parse
    if (t.match(/^\(.*\)$/)) {
      t = t.slice(1, t.length - 1);
    } // dump parens
    if (t.match(/.*\[.*\]/)) {
      // look for comments
      comments[index] = t.replace(/.*\[(.*)\]/, "$1");
      t = t.split("[")[0];
    } else {
      comments[index] = "";
    }
    if (t.match(/DNF\(.*\)/)) {
      // DNF
      t = t.replace(/DNF\((.*)\)/, "$1");
      notes[index] = 1;
    } else if (t.match(/.*\+/)) {
      // +2
      t = t.slice(0, t.length - 1);
      notes[index] = 2;
    } else {
      notes[index] = 0;
    }
    parseTime(t, true);
    index++;
  }

  toggleImport();
  importFocus = 0;
  clearHighlight();
  loadList();
  getStats(true);
}

export const globals = {
  changeAvgN,
  changeColor,
  changeMoN,
  changeNotes,
  comment,
  decreaseScrambleSize,
  decreaseSize,
  getlastscramble,
  getSession,
  importTimes,
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
