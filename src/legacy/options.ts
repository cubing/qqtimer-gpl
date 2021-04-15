import { $ } from "../dom";
import { setCookie } from "./cookies";
import { getBrowser } from "./compat";
import { globals } from "./globals";
import { getStats } from "./stats";
import { stopTimer } from "./timing";

let loadList;

export function setOptionsCallbacks(newLoadList) {
  loadList = newLoadList;
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

export function toggleInput() {
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

export function changeColor() {
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

export function parseColor(str) {
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

export const optionsWindowGLobals = {
  changeColor,
  decreaseScrambleSize,
  decreaseSize,
  increaseScrambleSize,
  increaseSize,
  resetColors,
  toggleAvgN,
  toggleBld,
  toggleInput,
  toggleInspection,
  toggleMilli,
  toggleMoN,
  toggleMono,
  toggleNightMode,
  toggleOptions,
  toggleStatView,
  toggleTimer,
};
