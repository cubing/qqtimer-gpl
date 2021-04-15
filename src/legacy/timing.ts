import { $ } from "../dom";
import { getScramble, getScrambleType } from "../scramble";
import { globals } from "../model/globals";
import { rescramble3 } from "./rescramble";
import { getStats, parseTime, pretty } from "./stats";

const setInterval = window.setInterval; // TODO

let loadList;
let clearHighlight;

export function setTimingCallbacks(newLoadList, newClearHighlight) {
  loadList = newLoadList;
  clearHighlight = newClearHighlight;
}

export function startTimer(keyCode) {
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

export function stopTimer(keyCode?: number) {
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
