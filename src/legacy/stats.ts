import { $, toggleImport } from "../dom";
import { globals } from "../model/globals";

let loadList;
let changeColor;

export function setStatsCallbacks(newLoadList, newChangeColor) {
  loadList = newLoadList;
  changeColor = newChangeColor;
}

export function parseTime(s: string, importing: boolean = false) {
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
      globals.main.notes[globals.main.notes.length] = 0;
      globals.main.comments[globals.main.comments.length] = "";
    } else if (globals.main.notes[globals.main.times.length] == 2) {
      time -= 2000;
    }
    globals.main.times[globals.main.times.length] = time;
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

// #################### STATISTICS ####################

type AvgOrMeanWithoutSD =
  | [number, (null | number)[], (null | number)[]]
  | [-1, -1, -1]; // TODO
type AvgOrMeanWithSD = [mean: number, variance: number] | [-1, -1, -1]; // TODO
type AllStatsWithSD = [
  numdnf: number,
  sessionavg: AvgOrMeanWithSD,
  sessionmean: number
];

export function getStats(recalc) {
  var avgSizes2 = globals.stats.avgSizes
    .slice(1 - globals.options.useAvgN)
    .sort(numsort);
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
    var index = globals.main.times.length - 1;
    var thisTime =
      globals.main.notes[index] == 1
        ? -1
        : globals.main.times[index] + globals.main.notes[index] * 1000;
    if (
      globals.stats.bestTime < 0 ||
      (thisTime != -1 && thisTime < globals.stats.bestTime)
    ) {
      globals.stats.bestTime = thisTime;
      globals.stats.bestTimeIndex = index;
    }
    if (thisTime > globals.stats.worstTime) {
      globals.stats.worstTime = thisTime;
      globals.stats.worstTimeIndex = index;
    }
    for (var j = 0; j < avgSizes2.length; j++) {
      if (globals.main.times.length < avgSizes2[j]) {
        break;
      } else {
        globals.stats.lastAvg[j] = getAvgSD(
          globals.main.times.length - avgSizes2[j],
          avgSizes2[j],
          true
        );
        if (
          globals.stats.bestAvg[j][0] < 0 ||
          (globals.stats.lastAvg[j][0] != -1 &&
            globals.stats.lastAvg[j][0] < globals.stats.bestAvg[j][0])
        ) {
          globals.stats.bestAvg[j] = globals.stats.lastAvg[j];
          globals.stats.bestAvgIndex[j] =
            globals.main.times.length - avgSizes2[j];
        }
      }
    }
    if (globals.main.times.length >= globals.stats.moSize) {
      globals.stats.lastMo = getMeanSD(
        globals.main.times.length - globals.stats.moSize,
        globals.stats.moSize,
        true
      );
      if (
        globals.stats.bestMo[0] < 0 ||
        (globals.stats.lastMo[0] != -1 &&
          globals.stats.lastMo[0] < globals.stats.bestMo[0])
      ) {
        globals.stats.bestMo = globals.stats.lastMo;
        globals.stats.bestMoIndex =
          globals.main.times.length - globals.stats.moSize;
      }
    }
    var sessionsum = 0;
    for (var i = 0; i < globals.main.times.length; i++) {
      var thisTime =
        globals.main.notes[i] == 1
          ? -1
          : globals.main.times[i] + globals.main.notes[i] * 1000;
      if (thisTime == -1) {
        numdnf++;
      } else {
        sessionsum += thisTime;
      }
    }
    sessionavg = getAvgSD(0, globals.main.times.length, true);
    sessionmean =
      numdnf == globals.main.times.length
        ? -1
        : sessionsum / (globals.main.times.length - numdnf);
  }

  var s =
    "stats: (<span id='hidestats' onclick='toggleStatView()' class='a'>" +
    (globals.options.viewstats ? "hide" : "show") +
    "</span>)<br>";
  s +=
    "number of times: " +
    (globals.main.times.length - numdnf) +
    "/" +
    globals.main.times.length;
  if (globals.options.viewstats) {
    s +=
      "<br>best time: <span onclick='setHighlight(" +
      globals.stats.bestTimeIndex +
      ",1,0);loadList();' class='a'>";
    s +=
      pretty(globals.stats.bestTime) +
      "</span><br>worst time: <span onclick='setHighlight(" +
      globals.stats.worstTimeIndex;
    s +=
      ",1,1);loadList();' class='a'>" +
      pretty(globals.stats.worstTime) +
      "</span><br>";
    if (globals.main.useMoN == 1) {
      if (globals.main.times.length >= globals.stats.moSize) {
        s +=
          "<br>current mo" +
          globals.stats.moSize +
          ": <span onclick='setHighlight(" +
          (globals.main.times.length - globals.stats.moSize);
        s +=
          "," +
          globals.stats.moSize +
          "," +
          globals.stats.moSize +
          "2);loadList();' class='a'>" +
          pretty(globals.stats.lastMo[0]);
        s += "</span> (&sigma; = " + trim(globals.stats.lastMo[1], 2) + ")<br>";
        s +=
          "best mo" +
          globals.stats.moSize +
          ": <span onclick='setHighlight(" +
          globals.stats.bestMoIndex;
        s +=
          "," +
          globals.stats.moSize +
          "," +
          globals.stats.moSize +
          "3);loadList();' class='a'>" +
          pretty(globals.stats.bestMo[0]);
        s += "</span> (&sigma; = " + trim(globals.stats.bestMo[1], 2) + ")<br>";
      }
    }
    for (var j = 0; j < avgSizes2.length; j++) {
      if (globals.main.times.length >= avgSizes2[j]) {
        s +=
          "<br>current avg" +
          avgSizes2[j] +
          ": <span onclick='setHighlight(" +
          (globals.main.times.length - avgSizes2[j]);
        s +=
          "," +
          avgSizes2[j] +
          "," +
          avgSizes2[j] +
          "1);loadList();' class='a'>" +
          pretty(globals.stats.lastAvg[j][0]);
        s +=
          "</span> (&sigma; = " +
          trim(globals.stats.lastAvg[j][1], 2) +
          ")<br>";
        s +=
          "best avg" +
          avgSizes2[j] +
          ": <span onclick='setHighlight(" +
          globals.stats.bestAvgIndex[j];
        s +=
          "," +
          avgSizes2[j] +
          "," +
          avgSizes2[j] +
          "0);loadList();' class='a'>" +
          pretty(globals.stats.bestAvg[j][0]);
        s +=
          "</span> (&sigma; = " +
          trim(globals.stats.bestAvg[j][1], 2) +
          ")<br>";
      }
    }

    s +=
      "<br>session avg: <span onclick='setHighlight(0," +
      globals.main.times.length +
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
  var avgSizes2 = globals.stats.avgSizes
    .slice(1 - globals.options.useAvgN)
    .sort(numsort);
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
  globals.stats.bestAvgIndex = [0, 0, 0, 0, 0];
  globals.stats.bestTime = -1;
  globals.stats.bestTimeIndex = 0;
  globals.stats.worstTime = -1;
  globals.stats.worstTimeIndex = 0;
  var numdnf = 0;
  var sessionsum = 0;
  globals.stats.bestMo = [-1, 0];
  globals.stats.lastMo = [-1, 0];
  globals.stats.bestMoIndex = 0;
  for (var i = 0; i < globals.main.times.length; i++) {
    var thisTime =
      globals.main.notes[i] == 1
        ? -1
        : globals.main.times[i] + globals.main.notes[i] * 1000;
    if (
      globals.stats.bestTime < 0 ||
      (thisTime != -1 && thisTime < globals.stats.bestTime)
    ) {
      globals.stats.bestTime = thisTime;
      globals.stats.bestTimeIndex = i;
    }
    if (thisTime > globals.stats.worstTime) {
      globals.stats.worstTime = thisTime;
      globals.stats.worstTimeIndex = i;
    }
    if (thisTime == -1) {
      numdnf++;
    } else {
      sessionsum += thisTime;
    }

    // calculate averages
    for (var j = 0; j < avgSizes2.length; j++) {
      if (globals.main.times.length - i < avgSizes2[j]) {
        break;
      } else {
        globals.stats.lastAvg[j] = getAvgSD(i, avgSizes2[j], true);
        if (
          globals.stats.bestAvg[j][0] < 0 ||
          (globals.stats.lastAvg[j][0] != -1 &&
            globals.stats.lastAvg[j][0] < globals.stats.bestAvg[j][0])
        ) {
          globals.stats.bestAvg[j] = globals.stats.lastAvg[j];
          globals.stats.bestAvgIndex[j] = i;
        }
      }
    }

    // calculate mean
    if (globals.main.times.length - i >= globals.stats.moSize) {
      globals.stats.lastMo = getMeanSD(i, globals.stats.moSize, true);
      if (
        globals.stats.bestMo[0] < 0 ||
        (globals.stats.lastMo[0] != -1 &&
          globals.stats.lastMo[0] < globals.stats.bestMo[0])
      ) {
        globals.stats.bestMo = globals.stats.lastMo;
        globals.stats.bestMoIndex = i;
      }
    }
  }

  var sessionavg = getAvgWithSD(0, globals.main.times.length);
  var sessionmean =
    numdnf == globals.main.times.length
      ? -1
      : sessionsum / (globals.main.times.length - numdnf);

  return [numdnf, sessionavg, sessionmean];
}

function numsort(a, b) {
  return a - b;
}

export function setHighlight(start, nsolves, id) {
  // if we're trying to set a highlight that has same ID as the current one, clear it.
  if (id == globals.main.highlightID) {
    clearHighlight();
  } else {
    var mean: number = 0;
    if (id > 10 && id % 10 > 1) mean = 1; // check to see if this is a mean-of-N or not
    globals.main.highlightStart = start;
    globals.main.highlightStop = start + nsolves - 1;
    globals.main.highlightID = id;

    if (globals.main.times.length == 0) return;
    var data: AvgOrMeanWithoutSD = [0, [null], [null]];
    if (
      globals.main.highlightStop != -1 &&
      globals.main.highlightStop - globals.main.highlightStart > 1
    ) {
      if (mean) {
        data = getMeanWithoutSD(
          globals.main.highlightStart,
          globals.main.highlightStop - globals.main.highlightStart + 1
        );
      } else {
        data = getAvgWithoutSD(
          globals.main.highlightStart,
          globals.main.highlightStop - globals.main.highlightStart + 1
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
        (globals.main.notes[start + i] == 1 ? "DNF(" : "") +
        pretty(
          globals.main.times[start + i] +
            (globals.main.notes[start + i] == 2 ? 2000 : 0)
        ) +
        (globals.main.notes[start + i] == 1 ? ")" : "");
      s +=
        (globals.main.notes[start + i] == 2 ? "+" : "") +
        (globals.main.comments[start + i]
          ? "[" + globals.main.comments[start + i] + "]"
          : "");
      if (typedData[1].indexOf(i) > -1 || typedData[2].indexOf(i) > -1)
        s += ")";
      s += " &nbsp; " + globals.main.scrambleArr[start + i] + "<br>";
    }
    $("avgdata").innerHTML = "<td colspan='3'>" + s + "</td>";
    $("avgdata").style.display = "";
  }
}

export function clearHighlight() {
  globals.main.highlightStart = -1;
  globals.main.highlightStop = -1;
  globals.main.highlightID = -1;
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
export function getAvgSD(
  start,
  nsolves,
  SD
): AvgOrMeanWithoutSD | AvgOrMeanWithSD {
  if (nsolves < 3) {
    return [-1, -1, -1]; // TODO
  }

  // get list of times
  var timeArr: [number, number][] = [],
    t: number,
    j: number;
  for (j = 0; j < nsolves; j++) {
    t =
      globals.main.notes[start + j] == 1
        ? -1
        : globals.main.times[start + j] / 10 +
          globals.main.notes[start + j] * 100;
    t = globals.options.useMilli == 0 ? 10 * Math.round(t) : 10 * t;
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

export function getMeanSD(
  start,
  nsolves,
  SD
): AvgOrMeanWithSD | AvgOrMeanWithoutSD {
  // get list of times
  var timeArr = [],
    t,
    j;
  for (j = 0; j < nsolves; j++) {
    t =
      globals.main.notes[start + j] == 1
        ? -1
        : globals.main.times[start + j] / 10 +
          globals.main.notes[start + j] * 100;
    t = globals.options.useMilli == 0 ? 10 * Math.round(t) : 10 * t;
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

export function pretty(time) {
  if (time < 0) {
    return "DNF";
  }
  time = Math.round(time / (globals.options.useMilli == 1 ? 1 : 10));
  var bits = time % (globals.options.useMilli == 1 ? 1000 : 100);
  time = (time - bits) / (globals.options.useMilli == 1 ? 1000 : 100);
  var secs = time % 60;
  var mins = ((time - secs) / 60) % 60;
  var hours = (time - secs - 60 * mins) / 3600;
  var s = "" + bits;
  if (bits < 10) {
    s = "0" + s;
  }
  if (bits < 100 && globals.options.useMilli == 1) {
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

export function changeNotes(i) {
  // 0 is normal solve, 1 is DNF, 2 is +2
  globals.main.notes[globals.main.notes.length - 1] = i;
  clearHighlight();
  loadList();
  getStats(true);
}

function changeAvgN() {
  var n = parseInt($<HTMLInputElement>("avglen").value);
  if (isNaN(n) || n < 3 || n > 10000) n = 50;
  globals.stats.avgSizes[0] = n;
  clearHighlight();
  loadList();
  getStats(true);
}

function changeMoN() {
  var n = parseInt($<HTMLInputElement>("molen").value);
  if (isNaN(n) || n < 2 || n > 10000) n = 3;
  globals.stats.moSize = n;
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
  var index = globals.main.times.length;
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
      globals.main.scrambleArr[index] = "";
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
      globals.main.scrambleArr[index] = scr;
    }

    // parse
    if (t.match(/^\(.*\)$/)) {
      t = t.slice(1, t.length - 1);
    } // dump parens
    if (t.match(/.*\[.*\]/)) {
      // look for comments
      globals.main.comments[index] = t.replace(/.*\[(.*)\]/, "$1");
      t = t.split("[")[0];
    } else {
      globals.main.comments[index] = "";
    }
    if (t.match(/DNF\(.*\)/)) {
      // DNF
      t = t.replace(/DNF\((.*)\)/, "$1");
      globals.main.notes[index] = 1;
    } else if (t.match(/.*\+/)) {
      // +2
      t = t.slice(0, t.length - 1);
      globals.main.notes[index] = 2;
    } else {
      globals.main.notes[index] = 0;
    }
    parseTime(t, true);
    index++;
  }

  toggleImport();
  globals.options.importFocus = 0;
  clearHighlight();
  loadList();
  getStats(true);
}

export const statsWindowGlobals = {
  changeAvgN,
  changeMoN,
  changeNotes,
  importTimes,
  setHighlight,
};
