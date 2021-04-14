import { scramblers } from "./scramblers"
import { setStyle } from "./style"

var startTime;
var curTime;
var inspectionTime;
var timerStatus; // 0 = stopped, 1 = running, 2 = inspecting, 3 = waiting, 4 = memo
var times = [];
var notes = [];
var comments = [];
var scrambleArr = [];
var scramble;
var lastscramble;
var importScrambles=[];
var timerID;
var inspectionID;
var memoID;
var timerupdate = 1;
var highlightStart;
var highlightStop;
var highlightID;
var sessionID=0;
var initoncesq1 = 1;
var nightMode = false;

function $(str){return document.getElementById(str);}


// #################### TIMER STUFF ####################

// deal with styles
setStyle(getCookie("style"));

// firefox 9.0.1 bugfix
window.onkeydown = function(event) {checkKey(event.keyCode, event.shiftKey); };
window.onkeyup = function(event) {startTimer(event.keyCode); };

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
 avgSizes = [50,5,12,100,1000];
 moSize = 3
 bestAvg = [[-1,0],[-1,0],[-1,0],[-1,0],[-1,0]];
 lastAvg = [[-1,0],[-1,0],[-1,0],[-1,0],[-1,0]];
 bestMo = [-1,0];
 lastMo = [-1,0];
 bestAvgIndex = [0,0,0,0,0];
 bestMoIndex = 0;
 bestTime = -1;
 bestTimeIndex = 0;
 worstTime = -1;
 worstTimeIndex = 0;
 clearHighlight();
 if (timerStatus != 0) {clearInterval(timerID); clearInterval(inspectionID);}
 timerStatus = 3;

 timerupdate = (a=getCookie("timerupdate"))===null ? 1 : a;
 $('toggler').innerHTML =
	(timerupdate==0) ? "off" :
	(timerupdate==1) ? "on" :
	(timerupdate==2) ? "seconds only" :
	"inspection only";
 useMilli = (a=getCookie("useMilli"))===null ? 0 : a;
 $('millisec').innerHTML = (useMilli==1) ? "1\/1000 sec" : "1\/100 sec";
 var oldManualEnter = manualEnter;
 manualEnter = (a=getCookie("manualEnter"))===null ? 0 : a;
 if (manualEnter!=oldManualEnter) {
  toggleInput();
  manualEnter = 1-manualEnter;
 }
 $('tcol').value = (a=getCookie("tColor"))===null ? "00ff00" : a;
 $('bcol').value = (a=getCookie("bColor"))===null ? "white" : a;
 $('fcol').value = (a=getCookie("fColor"))===null ? "black" : a;
 $('lcol').value = (a=getCookie("lColor"))===null ? "blue" : a;
 $('hcol').value = (a=getCookie("hColor"))===null ? "yellow" : a;
 $('memcol').value = (a=getCookie("memColor"))===null ? "green" : a;
 $('inputTimes').innerHTML = (manualEnter==1) ? "typing" : "timer";
 $('theTime').innerHTML = (manualEnter==1) ?
  "<input id='timeEntry' size=12 style='font-size:100%'>"+
  " <span onclick='stopTimer(13);' class='a' style='color:"+
  parseColor($('lcol').value)+"'>enter</span>" : "ready";
 timerSize = (a=getCookie("timerSize"))===null ? 2 : a;
 $('theTime').style.fontSize = timerSize + "em";
 scrambleSize = (a=getCookie("scrSize"))===null ? 16 : parseInt(a,10);
 $('scramble').style.fontSize = scrambleSize + "px";
 $('getlast').style.fontSize = scrambleSize + "px";
 $('theList').style.height = Math.max(16, (timerSize * 1.5)) + "em";
 $('stats').style.height = Math.max(16, (timerSize * 1.5)) + "em";
 inspection = (a=getCookie("inspection"))===null ? 0 : a;
 $('inspec').innerHTML = (inspection==1) ? "WCA" : "no";
 if (inspection==0) { useBld = (a=getCookie("useBld"))===null ? 0 : a; }
 else { useBld = 0; setCookie("useBld", 0); }
 $('bldmode').innerHTML = (useBld==1) ? "on" : "off";
 useAvgN = (a=getCookie("useAvgN"))===null ? 0 : a;
 $('avgn').innerHTML = (useAvgN==1) ? "using" : "not using";
 useMoN = (a=getCookie("useMoN"))===null ? 0 : a;
 $('mon').innerHTML = (useMoN==1) ? "using" : "not using";
 useMono = (a=getCookie("useMono"))===null ? 0 : a;
 $('monospace').innerHTML = (useMono==1) ? "on" : "off";
 $('scramble').style.fontFamily = (useMono==1) ? "monospace" : "serif";
 $('getlast').style.color = parseColor($('lcol').value);
 type = (a=getCookie("scrType"))===null ? "333" : a;
 if (query.length > 0) type = query;
 
 loadList();
 getStats(true);

 scramblers['333'].initialize(null, Math); // hopefully this'll let IE load scramblers
 scramblers['slidy'] = ["", null];

 curTime = new Date(0);
 $('leng').value = len;
 var obj = $('optbox');
 for(var i = 0; i < scrdata.length; i++) {
  for (var j = 0; j < scrdata[i][1].length; j++) {
   if(scrdata[i][1][j][1] == type) {
    obj.selectedIndex = i;
    rescramble(false);
    $('optbox2').selectedIndex = j;
   }
  }
 }
 changeColor();
 scramble = "";
 rescramble2();
}

function rescramble(scramble) {
 var obj = $('optbox');
 var obj2 = $('optbox2');

 var box2 = scrdata[obj.selectedIndex][1];
 for (var i=obj2.options.length-1; i>0; i--)
  obj2.remove(i);
 for (var i=0; i<box2.length; i++)
  obj2.options[i] = new Option(box2[i][0],box2[i][1]);
 len = box2[0][2];
 $('leng').value = len;
 type = box2[0][1];
 if (scramble) {
  setCookie("scrType", type);
  scrambleIt();
  $('getlast').innerHTML = "get last scramble";
 }
}

function rescramble2() {
 var obj = $('optbox');
 var obj2 = $('optbox2');
 var newType = obj2.options[obj2.selectedIndex].value;

 var box2 = scrdata[obj.selectedIndex][1];
 len = box2[obj2.selectedIndex][2];
 $('leng').value = len;
 type = newType;
 setCookie("scrType", type);

 scrambleIt();
 $('getlast').innerHTML = "get last scramble";
}

function rescramble3() {
 len = $('leng').value;
 scrambleIt();
 $('getlast').innerHTML = "get last scramble";
}

function loadOptBoxes() {
 for (var i=0; i<scrdata.length; i++) {
  $('optbox').options[i] = new Option(scrdata[i][0],"");
 }
}

function startTimer(keyCode) {
 if (timerStatus == 0 && manualEnter == 0 && keyCode == 32 && importFocus == 0) {
  timerStatus = 3;
 } else if (timerStatus == 3 && manualEnter == 0 && keyCode == 32 && (new Date()).getTime() - curTime.getTime() >= 300 && importFocus == 0) {
  if (type=="sqrs") { $('scramble').innerHTML = "scramble: loading... "; }
  if (inspection == 1) {
   timerStatus = 2;
   inspectionTime = new Date();
   $('theTime').style.color = "red";
   if (timerupdate != 0) {inspectionID = setInterval(updateInspec, (timerupdate==1)?10:100);}
   else {$('theTime').innerHTML = "inspecting";}
  } else if (useBld == 1) {
   timerStatus = 4;
   memoTime = new Date();
   $('theTime').style.color = $('memcol').value;
   if (timerupdate==1 || timerupdate==2) {memoID = setInterval(updateMemo, (timerupdate==1)?10:100);}
   else {$('theTime').innerHTML = "memorizing";}
  } else {
   timerStatus = 1;
   startTime = new Date();
   penalty = 0;
   $('theTime').style.color = (nightMode ? "#fff" : $('fcol').value);
   if (timerupdate==1 || timerupdate==2) {timerID = setInterval(updateTimer, (timerupdate==1)?10:100);}
   else {$('theTime').innerHTML = "running";}
  }
 } else if (timerStatus == 4 && keyCode == 32) {
  timerStatus = 1;
  startTime = new Date();
  $('theTime').style.color = (nightMode ? "#fff" : $('fcol').value);
  var memoLength = startTime.getTime() - memoTime.getTime();
  if (timerupdate==1 || timerupdate==2) {
   clearInterval(memoID);
   timerID = setInterval(updateMemo, (timerupdate==1)?10:100);
  }
  else {$('theTime').innerHTML = "running";}
 } else if (timerStatus == 2 && keyCode == 32) {
  timerStatus = 1;
  startTime = new Date();
  $('theTime').style.color = (nightMode ? "#fff" : $('fcol').value);
  var inspecLength = startTime.getTime() - inspectionTime.getTime();
  penalty = (inspecLength < 15000) ? 0 : (inspecLength < 17000) ? 2 : 1;
  clearInterval(inspectionID);
  if (timerupdate==1 || timerupdate==2) {
   timerID = setInterval(updateTimer, (timerupdate==1)?10:100);
  }
  else {$('theTime').innerHTML = "running";}
 }
}

function stopTimer(keyCode) {
 if (keyCode == 32) {
  $('optbox').blur();
  $('leng').blur();
 }
 if (manualEnter == 1) {
  if (keyCode == 13) {
   var timeStr = $('timeEntry').value;
   var nonzero = false;
   var dnfRegex = new RegExp(".*(DNF|dnf)\\((.*)\\).*");
   if (timeStr.match(/.* .*/)) {
    nonzero = parseTime(timeStr.replace(/(.*) .*/, "$1"), true);
    if (nonzero) { // if time breaks, ignore comments/notes
     comments[times.length-1] = timeStr.replace(/.*? (.*)$/, "$1");
    }
   } else if (timeStr.match(dnfRegex)) {
    nonzero = parseTime(dnfRegex.exec(timeStr)[2]);
   } else {
    nonzero = parseTime(timeStr, false);
   }
   if (nonzero) {
    if (timeStr.match(/.*(DNF|dnf).*/)) {
 	 notes[times.length-1] = 1;
    } else if (timeStr.match(/.*\+.*/)) {
	 notes[times.length-1] = 2;
    } else {
	 notes[times.length-1] = 0;
	}
	loadList(); // unfortunately have to do this twice ;|
    getStats(false);
   }
   $('timeEntry').value = "";
   if (nonzero) scrambleArr[scrambleArr.length] = scramble;
   rescramble3();
  }
 } else if(timerStatus == 1) {
  timerStatus = (keyCode == 32) ? 0 : 3;
  if (timerupdate==1 || timerupdate==2) {clearInterval(timerID);}
  getTime(penalty);
  scrambleArr[scrambleArr.length] = scramble;
  rescramble3();
 }
}

function checkKey(keyCode, shiftKey) {
 
 if (keyCode == 13 || (manualEnter == 0 && timerStatus != 0 && timerStatus != 3)) { // normally, any key enters a time; with manual enter, only Enter does
  stopTimer(keyCode);
 } else if (keyCode == 8 && manualEnter == 0) { // backspace applies DNF
  if (notes[notes.length - 1] == 1) {
   changeNotes(0);
  } else {
   changeNotes(1);
  }
 } else if ((keyCode == 61 || keyCode == 187) && manualEnter == 0) { // +/= applies +2 penalty
  if (notes[notes.length - 1] == 2) {
   changeNotes(0);
  } else {
   changeNotes(2);
  }
 } else if (keyCode == 173 || keyCode == 189) { // -/_ applies no penalty
  changeNotes(0);
 } else if (keyCode == 46 && !shiftKey && times.length > 0) { // delete removes last solve
  del(times.length - 1);
 } else if (keyCode == 46 && shiftKey) { // shift+delete clears session
  resetTimes();
 }
}


function updateTimer() {
 curTime = new Date();
 var time = curTime.getTime() - startTime.getTime();
 if (timerupdate == 1) {
  $('theTime').innerHTML = pretty(time);
 } else {
  $('theTime').innerHTML = pretty(time).split(".")[0];
 }
}

function updateMemo() {
 curTime = new Date();
 var time = curTime.getTime() - memoTime.getTime();
 if (timerupdate == 1) {
  $('theTime').innerHTML = pretty(time);
 } else {
  $('theTime').innerHTML = pretty(time).split(".")[0];
 }
}

function updateInspec() {
 curTime = new Date();
 var time = curTime.getTime() - inspectionTime.getTime();
 $('theTime').innerHTML = (time > 17000) ? "DNF" : (time > 15000) ? "+2" : 15-Math.floor(time/1000);
}

function getTime(note) {
 curTime = new Date();
 
 if (useBld==1) { 
  var time = curTime.getTime() - memoTime.getTime(); 
  var mtime = startTime.getTime() - memoTime.getTime();	
 } 
 else {
  var time = curTime.getTime() - startTime.getTime();
 }
 times[times.length] = time;
 notes[notes.length] = note;
 if (useBld==1) { 
  comments[comments.length] = pretty(mtime) 
 }
 else { 
  comments[comments.length] = ""; 
 }
 $('theTime').innerHTML = pretty(time);
 clearHighlight();
 loadList();
 getStats(true); // should be false, but it doesn't hurt
}

function parseTime(s, importing) {
 var time = 0;
 var arr = s.split(":");
 if (arr.length == 3) {
  time = 3600000 * parseInt(arr[0]) + 60000 * parseInt(arr[1]) + 1000 * parseFloat(arr[2]);
 } else if (arr.length == 2) {
  time = 60000 * parseInt(arr[0]) + 1000 * parseFloat(arr[1]);
 } else if (arr.length == 1) {
  time = 1000 * parseFloat(arr[0]);
 }
 time = Math.round(time);
 if (isNaN(time)) time = 0;
 if (time != 0) {	// don't insert zero-times
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
 var data = [-1,[null],[null]];
 var s = "times (<span onclick='resetTimes();' class='a'>reset</span>, <span onclick='toggleImport();' class='a'>import</span>):<br>"
 // get the best and worst time for the highlighted average
 if (highlightStop != -1 && (highlightStop - highlightStart) > 1) {
  var mean = 0;
  if (highlightID > 10 && (highlightID%10)>1) mean = 1; // check to see if this is a mean-of-N or not
  if (mean) {
   data = getMeanSD(highlightStart, highlightStop - highlightStart + 1, false);
  } else {
   data = getAvgSD(highlightStart, highlightStop - highlightStart + 1, false);
  }
 }
 for (var i = 0; i < times.length; i++) {
  if (i == highlightStart) {s += "<span style='background-color: " + highlightColor + "'>";}
  if (data[1].indexOf(i-highlightStart)>-1 || data[2].indexOf(i-highlightStart)>-1) s += "(";
  var time = times[i];
  if (notes[i] == 0) {s += "<span onclick='del(" + i + ");' class='b'>" + pretty(time);}
  else if (notes[i] == 2) {s += "<span onclick='del(" + i + ");' class='b'>" + pretty(time + 2000) + "+";}
  else {s += "<span onclick='del(" + i + ");' class='b'>DNF(" + pretty(time) + ")";}
  s += (comments[i] ? "[" + comments[i] + "]" : "") + "<\/span>";
  if (data[1].indexOf(i-highlightStart)>-1 || data[2].indexOf(i-highlightStart)>-1) s += ")";
  if (i == highlightStop) {s += "<\/span>";}
  s += (i == times.length - 1) ? " " : ", ";
 }
 $('theList').innerHTML = s;
 saveSession();
 // move scrollbar to bottom:
 var window = $('theList');
 window.scrollTop = window.scrollHeight;
 changeColor();
}

function del(index) {
 var prettyTime = pretty(times[index]);
 if (notes[index]==1) prettyTime = "DNF(" + prettyTime + ")";
 if (notes[index]==2) prettyTime = pretty(times[index]+2000) + "+";
 if (confirm("Are you sure you want to delete the " + prettyTime + "?")) {
  for (var i = index; i < times.length - 1; i++) {
   times[i] = times[i+1];
   notes[i] = notes[i+1];
   comments[i] = comments[i+1];
   scrambleArr[i] = scrambleArr[i+1];
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
 $('scramble').innerHTML = "scramble: " + scramble + "<br> last scramble: " + lastscramble;
 $('getlast').innerHTML = "";
}

function comment() {
 var newComment = prompt("Enter your comment for the most recent solve:",comments[comments.length-1]);
 if (newComment != null) { comments[comments.length-1] = newComment } else { comments[comments.length-1] = ""; }
 loadList();
}

function getBrowser() {
 // http://www.quirksmode.org/js/detect.html
 var versionSearchString;
 var dataBrowser = [
  {string:navigator.userAgent, subString:"Chrome", identity:"Chrome"},
  {string:navigator.userAgent, subString:"Safari", identity:"Chrome"},
  {string:navigator.userAgent, subString:"Firefox", identity:"Firefox"},
  {string:navigator.userAgent, subString:"MSIE", identity:"IE", versionSearch:"MSIE"}];

 function searchString(data) {
  for (var i=0;i<data.length;i++) {
   var dataString = data[i].string;
   var dataProp = data[i].prop;
   if (dataString) {
    if (dataString.indexOf(data[i].subString) != -1)
     return data[i].identity;
   } else if (dataProp)
    return data[i].identity;
  }
 };
 
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
var validColors = ["black","brown","white","purple","violet","red","orange","yellow","green","cyan","blue","gray","grey","pink"];
var highlightColor;

function toggleImport() {
 if ($('import').style.display == 'block') {
  $('import').style.display = 'none';
  importFocus = 0;
 } else {
  $('import').style.display = 'block';
  importFocus = 1;
 }
}

function toggleTimer() {
 stopTimer();
 timerupdate = (timerupdate + 1)%4;
 setCookie("timerupdate", timerupdate);
 $('toggler').innerHTML =
	(timerupdate==0) ? "off" :
	(timerupdate==1) ? "on" :
	(timerupdate==2) ? "seconds only" :
	"inspection only";
}

function toggleMilli() {
 useMilli = 1 - useMilli;
 setCookie("useMilli", useMilli);
 $('millisec').innerHTML = (useMilli==1) ? "1\/1000 sec" : "1\/100 sec";
 loadList();
 getStats(true);
}

function toggleBld() {
 if (inspection==0) { useBld = 1 - useBld; }
 setCookie("useBld", useBld);
 $('bldmode').innerHTML = (useBld==1) ? "on" : "off";
}

function toggleMono() {
 useMono = 1 - useMono;
 setCookie("useMono", useMono);
 $('monospace').innerHTML = (useMono==1) ? "on" : "off";
 $('scramble').style.fontFamily = (useMono==1) ? "monospace" : "serif";
 $('getlast').style.color = parseColor($('lcol').value);
}

function toggleInput() {
 if (manualEnter == 0) stopTimer();
 manualEnter = 1 - manualEnter;
 typingFocus = false;
 setCookie("manualEnter", manualEnter);
 $('inputTimes').innerHTML = (manualEnter==1) ? "typing" : "timer";
 $('theTime').innerHTML = (manualEnter==1) ?
  "<input id='timeEntry' size=12 style='font-size:100%'>"+
  " <span onclick='stopTimer(13);' class='a' style='color:"+
  parseColor($('lcol').value)+"'>enter</span>" : "ready";
 if ($('timeEntry') != null) {
  $('timeEntry').onfocus = function() {typingFocus = true;}
  $('timeEntry').onblur = function() {typingFocus = false;}
 }
}

function toggleOptions() {
 showOptions = 1 - showOptions;
 $('showOpt').innerHTML = (showOptions==1) ? "hide" : "show";
 $('options').style.display = (showOptions==1) ? "" : "none"; 
}

function increaseSize() {
 timerSize++;
 setCookie("timerSize", timerSize);
 $('theTime').style.fontSize = timerSize + "em"; $('theList').style.height = Math.max(16, (timerSize * 1.5)) + "em";
 $('stats').style.height = Math.max(16, (timerSize * 1.5)) + "em";
}

function decreaseSize() {
 if (timerSize >= 2) timerSize--;
 setCookie("timerSize", timerSize);
 $('theTime').style.fontSize = timerSize + "em";
 $('theList').style.height = Math.max(16, (timerSize * 1.5)) + "em";
 $('stats').style.height = Math.max(16, (timerSize * 1.5)) + "em";
}

function increaseScrambleSize() {
 scrambleSize+=4;
 setCookie("scrSize", scrambleSize);
 $('scramble').style.fontSize = scrambleSize + "px";
 $('getlast').style.fontSize = scrambleSize + "px";
}

function decreaseScrambleSize() {
 if (scrambleSize > 8) scrambleSize-=4;
 setCookie("scrSize", scrambleSize);
 $('scramble').style.fontSize = scrambleSize + "px";
 $('getlast').style.fontSize = scrambleSize + "px";
}

function toggleInspection() {
 inspection = 1 - inspection;
 if (inspection==1) { useBld = 0; }
 setCookie("useBld", useBld);
 setCookie("inspection", inspection);
 $('inspec').innerHTML = (inspection==1) ? "WCA" : "no";
 $('bldmode').innerHTML = (useBld==1) ? "on" : "off";
}

function toggleAvgN() {
 useAvgN = 1 - useAvgN;
 setCookie("useAvgN", useAvgN);
 $('avgn').innerHTML = (useAvgN==1) ? "using" : "not using";
 getStats(true);
}

function toggleMoN() {
 useMoN = 1 - useMoN;
 setCookie("useMoN", useMoN);
 $('mon').innerHTML = (useMoN==1) ? "using" : "not using";
 getStats(true);
}

function toggleStatView() {
 viewstats = 1 - viewstats;
 getStats(viewstats);
}

function changeColor() {
 $('menu').bgColor = parseColor($('tcol').value);
 if (nightMode) {
  document.bgColor = "#000";
  document.body.style.color = "#fff";
 } else {
  document.bgColor = parseColor($('bcol').value);
  document.body.style.color = parseColor($('fcol').value);
 }

 if (getBrowser() != "IE") {
  var links = document.getElementsByClassName('a');
  for (var i = 0; i < links.length; i++) {
   links[i].style.color = parseColor($('lcol').value);
  }
 } else {
  var links = document.getElementsByTagName('span');
  for (var i = 0; i < links.length; i++) {
   if (links[i].className == "a") {
    links[i].style.color = parseColor($('lcol').value);
   }
  }
 }

 highlightColor = parseColor($('hcol').value);
 $('getlast').style.color = parseColor($('lcol').value);
 setCookie("tColor", $('tcol').value);
 setCookie("bColor", $('bcol').value);
 setCookie("fColor", $('fcol').value);
 setCookie("lColor", $('lcol').value);
 setCookie("hColor", $('hcol').value);
 setCookie("memColor", $('memcol').value);
}

function parseColor(str) {
 for (var i=0; i<validColors.length; i++) {
  if (str == validColors[i]) {
   return str;
  }
 }
 while (str.length < 6) str += "0";
 return "#"+str;
}

function resetColors() {
 $('tcol').value = "00ff00";
 $('bcol').value = "white";
 $('fcol').value = "black";
 $('lcol').value = "blue";
 $('hcol').value = "yellow";
 $('memcol').value = "green";
 changeColor();
}

function toggleNightMode() {
 nightMode = !nightMode;
 if (nightMode) {
  document.bgColor = "#000";
  document.body.style.color = "#fff";
  $('theTime').style.color = "#fff";
 } else {
  document.bgColor = parseColor($('bcol').value);
  document.body.style.color = parseColor($('fcol').value);
  $('theTime').style.color = parseColor($('fcol').value);
 }
}

/* setCookie and getCookie functions originally from http://www.quirksmode.org/js/cookies.html */
function setCookie(name,value) {
 if (window.localStorage !== undefined) {
  window.localStorage.setItem(name,value);
  return;
 }
 var expires = "; expires=" + new Date(3000, 00, 01).toGMTString() + "; path=/";
 var cookies = document.cookie.split(';');
 var x = "qqTimer=";
 var found = false;
 for (var i=0; i<cookies.length; i++) {
  var c = cookies[i];
  while (c.charAt(0)==' ') c = c.substring(1,c.length);
  if (c.indexOf(x) == 0) { // this is the qqtimer cookie
   found = true;
   var str = c.substring(x.length,c.length);
   var options = str.split('.');
   var good = false;
   for (var j=0; j<options.length; j++) {
    if (options[j].split(',')[0] == name) {
     good = true;
     options[j] = name + "," + value;
    }
   }
   if (!good) {
    options[options.length] = name + "," + value;
   }
   var s = x;
   for (var j=0; j<options.length; j++) {
    if (j>0) s+=".";
    s+=options[j];
   }
   document.cookie = s + expires;
  }
 }
 if (!found) {
  document.cookie = x + name + "," + value + expires;
 }
}

function getCookie(name) {
 if (window.localStorage !== undefined) {
  var value = window.localStorage.getItem(name);
  if (value != null) return value;
 }
 
 var cookies = document.cookie.split(';');
 var x = "qqTimer=";
 for (var i=0; i<cookies.length; i++) {
  var c = cookies[i];
  while (c.charAt(0)==' ') c = c.substring(1,c.length);
  if (c.indexOf(x) == 0) { // this is the qqtimer cookie
   var str = c.substring(x.length,c.length);
   var options = str.split('.');
   for (var j=0; j<options.length; j++) {
    if (options[j].split(',')[0] == name) {
     return options[j].split(',')[1];
    }
   } 
  }
 }
 return null;
}

function saveSession() {
 var id = (document.getElementById("sessbox").selectedIndex==null) ? 0 : document.getElementById("sessbox").selectedIndex;
 var name = "session"+id;

 if (window.localStorage !== undefined) {
  var value = "";
  for (var i=0; i<times.length; i++) {
   value+=times[i];
   if(comments[i]!="" && comments[i]!==null) { value+="|" + comments[i]; } 
   if(notes[i]==1) value+="-";
   if(notes[i]==2) value+="+";
   if (i<times.length-1) value+=",";
  }
  value += ">";
 
  window.localStorage.setItem(name,value);
  return;
 }
 
 // format: cookie name "sessionY|X", comma separated, ">" at end
 // X is a number and we use another one if we run out of space
 // Y is the session number
 // time (in ms) with + for +2 or - for DNF
 var expires = "; expires=" + new Date(3000, 00, 01).toGMTString() + "; path=/";
 var cnt = 1;
 var s = name+"|"+cnt+"=";
 for (var i=0; i<times.length; i++) {
  if (s.length < 3950) { // just in case!
   s+=times[i];
   if(comments[i]!="" && comments[i]!==null) { s+="|" + comments[i]; } 
   if(notes[i]==1) s+="-";
   if(notes[i]==2) s+="+";
   if (i<times.length-1) s+=",";
  } else {
   document.cookie = s + expires;
   cnt++;
   s = name+"|"+cnt+"=";
   i--;
  }
 }
 document.cookie = s + ">" + expires;
}

function getSession() {
 var id = (document.getElementById("sessbox").selectedIndex==null) ? 0: document.getElementById("sessbox").selectedIndex;
 times = [];
 notes = [];
 comments = [];
 scrambleArr = [];
 $("sessbox").blur();
 
 var s = null;
 if (window.localStorage !== undefined) { // try to load text from localStorage
  s = window.localStorage.getItem("session"+id);
 }
 
 if (s == null) { // not in localStorage, load from cookie
  s = "";
  var cookies = document.cookie.split(';');
  var cnt = 1;
  var x = "session"+id+"|"+cnt+"=";
  var found = true;
  while (found) {
   found = false;
   for (var i=0; i<cookies.length; i++) {
    var c = cookies[i];
    while (c.charAt(0)==' ') c = c.substring(1, c.length);
    if (c.indexOf(x) == 0) { // the right cookie
     s += c.substring(x.length, c.length);
     if (s.indexOf(">") == -1) {
      found = true; cnt++; x = "session"+id+"|"+cnt+"="; break;
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
   for (var j=0; j<t.length; j++) {
    
    if (t[j].slice(-1) == ">") { t[j] = t[j].slice(0,t[j].length-1); }
    if (t[j].slice(-1) == "-") {
     notes[j] = 1;
     t[j] = t[j].slice(0,t[j].length-1);
    } else if (t[j].slice(-1) == "+") {
     notes[j] = 2;
     t[j] = t[j].slice(0,t[j].length-1);
    } else { notes[j] = 0; }
    var q = t[j].split("|");
    times[j] = parseInt(q[0]);
    comments[j] = (q[1]!=null && q[1]!="") ? q[1] : "";
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
 var avgSizes2 = (avgSizes.slice(1 - useAvgN)).sort(numsort);
 var numdnf=0, sessionavg, sessionmean;
 if (recalc) {
  var theStats = getAllStats();
  numdnf = theStats[0];
  sessionavg = theStats[1];
  sessionmean = theStats[2];
 } else {
  // update averages and best time / worst time.
  var index = times.length - 1;
  var thisTime = (notes[index] == 1) ? -1 : times[index] + notes[index] * 1000;
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
    if (bestAvg[j][0] < 0 || (lastAvg[j][0] != -1 && lastAvg[j][0] < bestAvg[j][0])) {
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
   var thisTime = (notes[i] == 1) ? -1 : times[i] + notes[i] * 1000;
   if (thisTime == -1) {numdnf++;}
   else {sessionsum += thisTime;}
  }
  sessionavg = getAvgSD(0, times.length, true);
  sessionmean = (numdnf == times.length) ? -1 : (sessionsum / (times.length - numdnf));
 }

 var s = "stats: (<span id='hidestats' onclick='toggleStatView()' class='a'>" + (viewstats?"hide":"show") + "</span>)<br>";
 s += "number of times: " + (times.length - numdnf) + "/" + times.length;
 if (viewstats) {
  s += "<br>best time: <span onclick='setHighlight(" + bestTimeIndex + ",1,0);loadList();' class='a'>";
  s += pretty(bestTime) + "<\/span><br>worst time: <span onclick='setHighlight(" + worstTimeIndex;
  s += ",1,1);loadList();' class='a'>" + pretty(worstTime) + "<\/span><br>";
  if (useMoN==1) {
   if (times.length >= moSize) {
    s += "<br>current mo" + moSize + ": <span onclick='setHighlight(" + (times.length - moSize);
    s += "," + moSize + "," + moSize + "2);loadList();' class='a'>" + pretty(lastMo[0]);
    s += "<\/span> (&sigma; = " + trim(lastMo[1], 2) + ")<br>";
    s += "best mo" + moSize + ": <span onclick='setHighlight(" + bestMoIndex;
    s += "," + moSize + "," + moSize + "3);loadList();' class='a'>" + pretty(bestMo[0]);
    s += "<\/span> (&sigma; = " + trim(bestMo[1], 2) + ")<br>";
   }
  }
  for (var j = 0; j < avgSizes2.length; j++) {
   if (times.length >= avgSizes2[j]) {
    s += "<br>current avg" + avgSizes2[j] + ": <span onclick='setHighlight(" + (times.length - avgSizes2[j]);
    s += "," + avgSizes2[j] + "," + avgSizes2[j] + "1);loadList();' class='a'>" + pretty(lastAvg[j][0]);
    s += "<\/span> (&sigma; = " + trim(lastAvg[j][1], 2) + ")<br>";
    s += "best avg" + avgSizes2[j] + ": <span onclick='setHighlight(" + bestAvgIndex[j];
    s += "," + avgSizes2[j] + "," + avgSizes2[j] + "0);loadList();' class='a'>" + pretty(bestAvg[j][0]);
    s += "<\/span> (&sigma; = " + trim(bestAvg[j][1], 2) + ")<br>";
   }
  }
  
  s += "<br>session avg: <span onclick='setHighlight(0," + times.length + ",2);loadList();' class='a'>";
  s += pretty(sessionavg[0]) + "<\/span> (&sigma; = " + trim(sessionavg[1], 2) + ")<br>session mean: " + pretty(sessionmean);
 }
 $('stats').innerHTML = s;
 var window = $('stats');
 window.scrollTop = 0; // IE workaround (lol)
 changeColor();
}

function getAllStats() {
 var avgSizes2 = (avgSizes.slice(1 - useAvgN)).sort(numsort);
 bestAvg = [[-1,0],[-1,0],[-1,0],[-1,0],[-1,0]];
 lastAvg = [[-1,0],[-1,0],[-1,0],[-1,0],[-1,0]];
 bestAvgIndex = [0,0,0,0,0];
 bestTime = -1;
 bestTimeIndex = 0;
 worstTime = -1;
 worstTimeIndex = 0;
 var numdnf = 0;
 var sessionsum = 0;
 bestMo = [-1,0];
 lastMo = [-1,0];
 bestMoIndex = 0;
 for (var i = 0; i < times.length; i++) {
  var thisTime = (notes[i] == 1) ? -1 : times[i] + notes[i] * 1000;
  if (bestTime < 0 || (thisTime != -1 && thisTime < bestTime)) {
   bestTime = thisTime;
   bestTimeIndex = i;
  }
  if (thisTime > worstTime) {
   worstTime = thisTime;
   worstTimeIndex = i;
  }
  if (thisTime == -1) {numdnf++;}
  else {sessionsum += thisTime;}

  // calculate averages
  for (var j = 0; j < avgSizes2.length; j++) {
   if (times.length - i < avgSizes2[j]) {
    break;
   } else {
    lastAvg[j] = getAvgSD(i, avgSizes2[j], true);
    if (bestAvg[j][0] < 0 || (lastAvg[j][0] != -1 && lastAvg[j][0] < bestAvg[j][0])) {
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

 var sessionavg = getAvgSD(0, times.length, true);
 var sessionmean = (numdnf == times.length) ? -1 : (sessionsum / (times.length - numdnf));

 return [numdnf, sessionavg, sessionmean];
}

function numsort(a,b) {
 return a - b;
}

function setHighlight(start, nsolves, id) {
 // if we're trying to set a highlight that has same ID as the current one, clear it.
 if (id == highlightID) {
  clearHighlight();
 } else {
  var mean = 0;
  if (id > 10 && (id%10)>1) mean = 1; // check to see if this is a mean-of-N or not
  highlightStart = start;
  highlightStop = start + nsolves - 1;
  highlightID = id;

  if (times.length == 0) return;
  var data = [0,[null],[null]];
  if (highlightStop != -1 && (highlightStop - highlightStart) > 1) {
   if (mean) {
    data = getMeanSD(highlightStart, highlightStop - highlightStart + 1, false);
   } else {
    data = getAvgSD(highlightStart, highlightStop - highlightStart + 1, false);
   }
  }
  var s="";
  if (id > 1) {
   if (id==2) {
    s += "Session average";
   } else if (mean) {
    s += "Mean of "+Math.floor(id/10);
   } else {
    s += "Average of "+Math.floor(id/10);
   }
   s += ": " + pretty(data[0]) + "<br>";
  }
  for (var i=0; i<nsolves; i++) {
   s += (i+1) + ". ";
   if (data[1].indexOf(i)>-1 || data[2].indexOf(i)>-1) s += "(";
   s += (notes[start+i]==1?"DNF(":"") + pretty(times[start+i]+(notes[start+i]==2?2000:0)) + (notes[start+i]==1?")":"");
   s += ((notes[start+i]==2)?"+":"") + (comments[start+i] ? "[" + comments[start+i] + "]" : "");
   if (data[1].indexOf(i)>-1 || data[2].indexOf(i)>-1) s += ")";
   s += " &nbsp; " + scrambleArr[start+i] + "<br>";
  }
  $('avgdata').innerHTML = "<td colspan='3'>" + s + "<\/td>";
  $('avgdata').style.display = "";
 }
}

function clearHighlight() {
 highlightStart = -1;
 highlightStop = -1;
 highlightID = -1;
 $('avgdata').style.display = "none";
}

function timesort(a,b) {
 // deal with DNFs; if they are both DNF it doesn't matter what we return
 var a2 = a[0], b2 = b[0];
 if (a2<0) a2=b2+1;
 if (b2<0) b2=a2+1;
 return a2 - b2;
}

// gets average and SD
function getAvgSD(start, nsolves, SD) {
 if (nsolves < 3) {return [-1,-1,-1];}

 // get list of times
 var timeArr = [], t, j;
 for (j=0; j<nsolves; j++) {
  t = (notes[start+j]==1 ? -1 : times[start+j]/10 + notes[start+j]*100);
  t = (useMilli==0 ? 10*Math.round(t) : 10*t);
  timeArr[timeArr.length] = [t, j];
 }

 // sort and take the average
 timeArr.sort(timesort);
 var trim = Math.ceil(nsolves/20); // trimmed amount per side
 var sum = 0;
 for (j=trim; j<nsolves-trim; j++) {
  sum += timeArr[j][0];
 }
 sum = (timeArr[nsolves-trim-1][0]<0 ? -1 : sum/(nsolves-2*trim));

 // get SD
 if (SD) {
  var variance = 0;
  for (j=trim; j<nsolves-trim; j++) {
   variance += Math.pow((timeArr[j][0] - sum)/1000, 2);
  }
  variance = Math.sqrt(variance / (nsolves - trim*2. - 1));
  return [sum, variance];
 } else {
  return [sum, dropTime(timeArr).slice(0,trim), dropTime(timeArr).slice(-trim)];
 }
}

function dropTime(arr) {
 var newArr = [];
 for (var i=0; i<arr.length; i++) {
  newArr[newArr.length] = arr[i][1];
 }
 return newArr;
}

function getMeanSD(start, nsolves, SD) {
 // get list of times
 var timeArr = [], t, j;
 for (j=0; j<nsolves; j++) {
  t = (notes[start+j]==1 ? -1 : times[start+j]/10 + notes[start+j]*100);
  t = (useMilli==0 ? 10*Math.round(t) : 10*t);
  timeArr[timeArr.length] = [t, j];
 }

 // sort and take the average
 timeArr.sort(timesort);
 var sum = 0;
 for (j=0; j<nsolves; j++) {
  sum += timeArr[j][0];
 }
 var mean = (timeArr[nsolves-1][0]<0 ? -1 : sum/nsolves);

 // get SD
 if (SD) {
  var variance = 0; 
  for (j=0; j<nsolves; j++) {
   variance += Math.pow((timeArr[j][0] - mean)/1000, 2);
  }
  variance = Math.sqrt(variance / (nsolves - 1));
  return [mean, variance];
 } else {
  return [mean, [], []];
 }
}

function trim(number, nDigits) {
 if (!number || number == Number.POSITIVE_INFINITY || number == Number.NEGATIVE_INFINITY) number = 0;
 var power = Math.pow(10, nDigits);
 var trimmed = "" + Math.round(number * power);
 while (trimmed.length < nDigits + 1) {
  trimmed = "0" + trimmed;
 }
 var len = trimmed.length;
 return trimmed.substr(0,len - nDigits) + "." + trimmed.substr(len - nDigits, nDigits);
}

function pretty(time) {
 if (time < 0) {return "DNF";}
 time = Math.round(time / (useMilli==1 ? 1 : 10));
 var bits = time % (useMilli==1 ? 1000 : 100);
 time = (time - bits) / (useMilli==1 ? 1000 : 100);
 var secs = time % 60;
 var mins = ((time - secs) / 60) % 60;
 var hours = (time - secs - 60 * mins) / 3600;
 var s = "" + bits;
 if (bits < 10) {s = "0" + s;}
 if (bits < 100 && useMilli==1) {s = "0" + s;}
 s = secs + "." + s;
 if (secs < 10 && (mins > 0 || hours > 0)) {s = "0" + s;}
 if (mins > 0 || hours > 0) {s = mins + ":" + s;}
 if (mins < 10 && hours > 0) {s = "0" + s;}
 if (hours > 0) {s = hours + ":" + s;}
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
 var n = parseInt($("avglen").value);
 if (isNaN(n) || n < 3 || n > 10000) n = 50;
 avgSizes[0] = n;
 clearHighlight();
 loadList();
 getStats(true);
}

function changeMoN() {
 var n = parseInt($("molen").value);
 if (isNaN(n) || n < 2 || n > 10000) n = 3;
 moSize = n;
 clearHighlight();
 loadList();
 getStats(true);
}


function importTimes() {
 // split
 var imported = $('importedTimes').value;
 var itimes = imported.split("\n");
 if (itimes.length == 1) {
  itimes = imported.split(",");
 }

 // each element is either of the form (a) time, or (b) number. time scramble
 var index = times.length;
 for (var i=0; i<itimes.length; i++) {
  var t = itimes[i];
  while(t.match(/^ /)) {t = t.slice(1);} // dump spaces on start
  while(t.match(/ $/)) {t = t.slice(0,t.length-1);} // dump spaces on end
  var dot = (t.split(" ")[0]).slice(-1);

  // get to the time-only form
  if (dot != ".") { // concise
   scrambleArr[index] = "";
  } else { // verbose
   t = t.slice(t.indexOf(". ")+2); // get rid of time number
   var scr = "";
   if(t.match(/.*\[.*\].*/)) { // comment, might contain spaces
    scr = t.slice(t.indexOf("] ")+2);
    t = t.slice(0, t.indexOf("] ")+1);
   } else {
    if(t.indexOf(" ")>-1) {
     scr = t.slice(t.indexOf(" ")+1);
     t = t.slice(0, t.indexOf(" "));
    } else {
     scr = "";
    }
   }
   scrambleArr[index] = scr;
  }

  // parse
  if(t.match(/^\(.*\)$/)) {t = t.slice(1,t.length-1);} // dump parens
  if(t.match(/.*\[.*\]/)) { // look for comments
   comments[index] = t.replace(/.*\[(.*)\]/, "$1");
   t = t.split("[")[0];
  } else {comments[index] = "";}
  if(t.match(/DNF\(.*\)/)) { // DNF
   t = t.replace(/DNF\((.*)\)/, "$1");
   notes[index] = 1;
  } else if(t.match(/.*\+/)) { // +2
   t = t.slice(0,t.length-1);
   notes[index] = 2;
  } else {
   notes[index] = 0;
  }
  parseTime(t, true);
  index++;
 }

 toggleImport();
 importFocus = false;
 clearHighlight();
 loadList();
 getStats(true);
}


// #################### SCRAMBLING ####################


var seq=[];
var p=[];
var ss=[];
var type="333";
var len=0;
var num=1;
var cubesuff=["","2","'"];
var minxsuff=["","2","'","2'"];

// data for all scramblers
var scrdata = [["===WCA PUZZLES===",[["--","blank",0]]],
 ["2x2x2",[["random state","222so",11],["optimal random state","222o",0],["3-gen","2223",25],["6-gen",2226,25]]],
 ["3x3x3",[["random state","333",0],["random state + orientation","333ori",0],["old style","333o",25]]],
 ["4x4x4",[["WCA","444wca",40],["SiGN","444",40],["YJ (place fixed center on Urf)","444yj",40]]],
 ["5x5x5",[["WCA","555wca",60],["SiGN","555",60]]],
 ["6x6x6",[["WCA","666wca",80],["SiGN","666si",80],["prefix","666p",80],["suffix","666s",80]]],
 ["7x7x7",[["WCA","777wca",100],["SiGN","777si",100],["prefix","777p",100],["suffix","777s",100]]],
 ["Clock",[["WCA","clkwca",0],["Jaap order","clk",0],["concise","clkc",0],["efficient pin order","clke",0]]],
 ["Megaminx",[["WCA", "mgmwca",70],["Carrot", "mgmc",70],["Pochmann+","mgmp",70],["old style","mgmo",70]]],
 ["Pyraminx",[["random state","pyrso",11],["optimal random state","pyro",0],["random moves","pyrm",25]]],
 ["Skewb",[["random state","skbso",11],["optimal random state","skbo",0],["U L R B","skb",25]]],
 ["Square-1",[["random state","sqrs",0],["face turn metric","sq1h",40],["twist metric","sq1t",20]]],
 ["===OTHER PUZZLES===",[["--","blank",0]]],
 ["8 puzzle",[["random state (fast)","8puzso",0],["optimal random state","8puzo",0]]],
 ["15 puzzle",[["random state (fast)","15puzso",0],["random state (efficient)","15puzsoe",0],["random moves","15p",80]]],
 ["24 puzzle",[["random state (fast)","24puzso",0]]],
 ["1x3x3 (Floppy Cube)",[["U D L R","flp",25]]],
 ["2x3x3 (Domino)",[[" ","223",25]]],
 ["3x3x4",[[" ","334",40]]],
 ["3x3x5",[["shapeshifting","335",25]]],
 ["3x3x6",[[" ","336",40]]],
 ["3x3x7",[["shapeshifting","337",40]]],
 ["4x4x6",[[" ","446",40]]],
 ["8x8x8",[["SiGN","888",120]]],
 ["9x9x9",[["SiGN","999",120]]],
 ["10x10x10",[["SiGN","101010",120]]],
 ["11x11x11",[["SiGN","111111",120]]],
 ["Cmetrick",[[" ","cm3",25]]],
 ["Cmetrick Mini",[[" ","cm2",25]]],
 ["Domino (2x3x3)",[[" ","223",25]]],
 ["Floppy Cube (1x3x3)",[["U D L R","flp",25]]],
 ["FTO (Face-Turning Octahedron)",[[" ","fto",25]]],
 ["Gigaminx",[["Pochmann","giga",300]]],
 ["Helicopter Cube",[[" ","heli",40]]],
 ["Pyraminx Crystal",[["Pochmann","prcp",70],["old style","prco",70]]],
 ["Siamese Cube (1x1x3 block)",[[" ","sia113",25]]],
 ["Siamese Cube (1x2x3 block)",[[" ","sia123",25]]],
 ["Siamese Cube (2x2x2 block)",[[" ","sia222",25]]],
 ["Square-2",[[" ","sq2",20]]],
 ["Super Floppy Cube",[[" ","sfl",25]]],
 ["Super Square-1",[["twist metric","ssq1t",20]]],
 ["UFO",[["Jaap style","ufo",25]]],
 ["===SPECIALTY SCRAMBLES===",[["--","blank",0]]],
 ["2x2x2x2",[["real cube","2222",20]]],
 ["3x3x3 subsets",[["2-generator <R,U>","2gen",25],["2-generator <L,U>","2genl",25],
  ["Roux-generator <M,U>","roux",25],["3-generator <F,R,U>","3gen_F",25],["3-generator <R,U,L>","3gen_L",25],
  ["3-generator <R,r,U>","RrU",25],["half turns only","half",25],["edges only","edges",0],
  ["corners only","corners",0],["last layer","ll",0],["CMLL+LSE","cmll",0],
  ["last slot + last layer","lsll2",0],["ZBLL","zbll",0],["2GLL","2gll",0],["PLL","pll",0],["ZZ last slot + last layer","zzls",0],["F2L","f2l",0]
  ,["last slot + last layer (old)","lsll",15]]],
 ["Bandaged Cube (Bicube)",[["","bic",30]]],
 ["Bandaged Square-1 </,(1,0)>",[["twist metric","bsq",25]]],
 ["Bigcube subsets",[["<R,r,U,u>","RrUu",40],["4x4x4 edges","4edge",8],["5x5x5 edges","5edge",8],
  ["6x6x6 edges","6edge",8],["7x7x7 edges","7edge",8]]],
 ["Megaminx subsets",[["2-generator <R,U>","minx2g",30],["last slot + last layer","mlsll",20]]],
 ["Relays",[["lots of 3x3x3s","r3",5],["234 relay","r234",0],["2345 relay","r2345",0],["23456 relay","r23456",0],["234567 relay","r234567",0],["Guildford Challenge","guildford",0],["Mini Guildford Challenge","miniguild",0]]],
 ["===JOKE SCRAMBLES===",[["--","blank",0]]],
 ["1x1x1",[["x y z","111",25]]],
 ["-1x-1x-1 (micro style)",[[" ","-1",25]]],
 ["1x1x2",[[" ","112",25]]],
 ["3x3x3 for noobs",[[" ","333noob",25]]],
 ["LOL",[[" ","lol",25]]],
 ["Derrick Eide",[[" ","eide",25]]]];

// Takes a random element of the array x.
function rndEl(x){return x[Math.floor(Math.random()*x.length)];}

function scrambleIt(){
 $("optbox").blur();
 $("optbox2").blur();
 lastscramble = scramble;
 for (var i=0; i<num; i++) ss[i] = "";
 if(type=="111"){			// 1x1x1
  megascramble([["x"],["y"],["z"]],cubesuff);
 }
 else if(type=="2223"){			// 2x2x2 (3-gen)
  megascramble([["U"],["R"],["F"]],cubesuff);
 }
 else if(type=="2226"){			// 2x2x2 (6-gen)
  megascramble([[["U","D"]],[["R","L"]],[["F","B"]]],cubesuff);
 }
 else if(type=="222o"){			// 2x2x2 (optimal random state)
  get2x2optscramble(0);
 }
 else if(type=="222so"){		// 2x2x2 (random state)
  get2x2optscramble(9);
 }
 else if(type=="333o"){			// 3x3x3 (old style)
  megascramble([["U","D"],["R","L"],["F","B"]],cubesuff);
 }
 else if(type=="333"){		        // 3x3x3 (random state)
  ss[0]=scramblers["333"].getRandomScramble();
 }
 else if(type=="333ori"){		        // 3x3x3 (random state + orientation)
  ss[0]=scramblers["333"].getRandomScramble();
  ss[0] += randomCubeOrientation();
 }
 else if(type=="sqrs"){	          	// square-1 (random state)
  if (initoncesq1==1) { scramblers['sq1'].initialize(null, Math); initoncesq1=0; }
  ss[0]=scramblers["sq1"].getRandomScramble().scramble_string;
 }
 else if(type=="334"){			// 3x3x4
  megascramble([[["U","U'","U2", "u", "u'", "u2", "U u", "U u'", "U u2", "U' u", "U' u'", "U' u2", "U2 u", "U2 u'", "U2 u2"]],[["R2","L2","M2"]],[["F2","B2","S2"]]],[""]);
 }
 else if(type=="335"){			// 3x3x5
  var n;
  megascramble([[["U","U'","U2"], ["D", "D'", "D2"]],["R2","L2"],["F2","B2"]],[""]);
  for(n=0;n<num;n++){ss[n]+=" / ";}
  ss[0] += scramblers["333"].getRandomScramble();
 }
 else if(type=="336"){			// 3x3x6
  megascramble([[["U","U'","U2","u","u'","u2","U u","U u'","U u2","U' u","U' u'","U' u2","U2 u","U2 u'","U2 u2","3u","3u'","3u2","U 3u","U' 3u","U2 3u","u 3u","u' 3u","u2 3u","U u 3u","U u' 3u","U u2 3u","U' u 3u","U' u' 3u","U' u2 3u","U2 u 3u","U2 u' 3u","U2 u2 3u","U 3u'","U' 3u'","U2 3u'","u 3u'","u' 3u'","u2 3u'","U u 3u'","U u' 3u'","U u2 3u'","U' u 3u'","U' u' 3u'","U' u2 3u'","U2 u 3u'","U2 u' 3u'","U2 u2 3u'","U 3u2","U' 3u2","U2 3u2","u 3u2","u' 3u2","u2 3u2","U u 3u2","U u' 3u2","U u2 3u2","U' u 3u2","U' u' 3u2","U' u2 3u2","U2 u 3u2","U2 u' 3u2","U2 u2 3u2"]],[["R2","L2","M2"]],[["F2","B2","S2"]]],[""]);
 }
 else if(type=="337"){			// 3x3x7
  var n;
  megascramble([[["U","U'","U2","u","u'","u2","U u","U u'","U u2","U' u","U' u'","U' u2","U2 u","U2 u'","U2 u2"], ["D","D'","D2","d","d'","d2","D d","D d'","D d2","D' d","D' d'","D' d2","D2 d","D2 d'","D2 d2"]],["R2","L2"],["F2","B2"]],[""]);
  for(n=0;n<num;n++){ss[n]+=" / ";}
  ss[0] += scramblers["333"].getRandomScramble();
 }
 else if(type=="446"){			// 4x4x6
  var n;
  megascramble([[["U","U'","U2"], ["D", "D'", "D2"]],["R2","r2","L2"],["F2","f2","B2"]],[""]);
  for(n=0;n<num;n++){ss[n]+=" / ";}
  megascramble([["U","D","u"],["R","L","r"],["F","B","f"]],cubesuff);
 }
 else if(type=="888"){			// 8x8x8 (SiGN)
  megascramble([["U","D","u","d","3u","3d","4u"],["R","L","r","l","3r","3l","4r"],["F","B","f","b","3f","3b","4f"]],cubesuff);
 }
 else if(type=="999"){			// 9x9x9 (SiGN)
  megascramble([["U","D","u","d","3u","3d","4u","4d"],["R","L","r","l","3r","3l","4r","4l"],["F","B","f","b","3f","3b","4f","4b"]],cubesuff);
 }
 else if(type=="101010"){		// 10x10x10 (SiGN)
  megascramble([["U","D","u","d","3u","3d","4u","4d","5u"],["R","L","r","l","3r","3l","4r","4l","5r"],["F","B","f","b","3f","3b","4f","4b","5f"]],cubesuff);
 }
 else if(type=="111111"){		// 11x11x11 (SiGN)
  megascramble([["U","D","u","d","3u","3d","4u","4d","5u","5d"],["R","L","r","l","3r","3l","4r","4l","5r","5l"],["F","B","f","b","3f","3b","4f","4b","5f","5b"]],cubesuff);
 }
 else if(type=="444"){			// 4x4x4 (SiGN)
  megascramble([["U","D","u"],["R","L","r"],["F","B","f"]],cubesuff);
 }
 else if(type=="444wca"){		// 4x4x4 (WCA)
  megascramble([["U","D","Uw"],["R","L","Rw"],["F","B","Fw"]],cubesuff);
 }
 else if(type=="444yj"){		// 4x4x4 (YJ style)
  yj4x4();
 }
 else if(type=="555"){			// 5x5x5 (SiGN)
  megascramble([["U","D","u","d"],["R","L","r","l"],["F","B","f","b"]],cubesuff);
 }
 else if(type=="555wca"){		// 5x5x5 (WCA)
  megascramble([["U","D","Uw","Dw"],["R","L","Rw","Lw"],["F","B","Fw","Bw"]],cubesuff);
 }
 else if(type=="666p"){			// 6x6x6 (prefix)
  megascramble([["U","D","2U","2D","3U"],["R","L","2R","2L","3R"],["F","B","2F","2B","3F"]],cubesuff);
 }
 else if(type=="666s"){			// 6x6x6 (suffix)
  megascramble([["U","D","U&sup2;","D&sup2;","U&sup3;"],["R","L","R&sup2;","L&sup2;","R&sup3;"],["F","B","F&sup2;","B&sup2;","F&sup3;"]],cubesuff);
 }
 else if(type=="666si"){		// 6x6x6 (SiGN)
  megascramble([["U","D","u","d","3u"],["R","L","r","l","3r"],["F","B","f","b","3f"]],cubesuff);
 }
 else if(type=="666wca"){		// 6x6x6 (WCA)
  megascramble([["U","D","Uw","Dw","3Uw"],["R","L","Rw","Lw","3Rw"],["F","B","Fw","Bw","3Fw"]],cubesuff);
 }
 else if(type=="777p"){			// 7x7x7 (prefix)
  megascramble([["U","D","2U","2D","3U","3D"],["R","L","2R","2L","3R","3L"],["F","B","2F","2B","3F","3B"]],cubesuff);
 }
 else if(type=="777s"){			// 7x7x7 (suffix)
  megascramble([["U","D","U&sup2;","D&sup2;","U&sup3;","D&sup3;"],["R","L","R&sup2;","L&sup2;","R&sup3;","L&sup3;"],["F","B","F&sup2;","B&sup2;","F&sup3;","B&sup3;"]],cubesuff);
 }
 else if(type=="777si"){		// 7x7x7 (SiGN)
  megascramble([["U","D","u","d","3u","3d"],["R","L","r","l","3r","3l"],["F","B","f","b","3f","3b"]],cubesuff);
 }
 else if(type=="777wca"){		// 7x7x7 (WCA)
  megascramble([["U","D","Uw","Dw","3Uw","3Dw"],["R","L","Rw","Lw","3Rw","3Lw"],["F","B","Fw","Bw","3Fw","3Bw"]],cubesuff);
 }
 else if(type=="8puzso"){		// 8 puzzle random state
  if (scramblers['slidy'][0] != type) {
   scramblers['slidy'] = [type, new SlidySolver(3, 3, [[1,2,3],[4,5,6,7,8]])];
  }
  ss[0] = scramblers['slidy'][1].getscramble();
 }
 else if(type=="8puzo"){		// 8 puzzle optimal random state
  if (scramblers['slidy'][0] != type) {
   scramblers['slidy'] = [type, new SlidySolver(3, 3, [[1,2,3,4,5,6,7,8]])];
  }
  ss[0] = scramblers['slidy'][1].getscramble();
 }
 else if(type=="15puzso"){		// 15 puzzle random state (fast)
  if (scramblers['slidy'][0] != type) {
   scramblers['slidy'] = [type, new SlidySolver(4, 4, [[1,2],[3,4],[5,9,13],[6,7,8],[10,11,12,14,15]])];
  }
  ss[0] = scramblers['slidy'][1].getscramble();
 }
 else if(type=="15puzsoe"){		// 15 puzzle random state (efficient)
  if (scramblers['slidy'][0] != type) {
   scramblers['slidy'] = [type, new SlidySolver(4, 4, [[1,2,3,4],[5,9,13],[6,7,8,10,11,12,14,15]])];
  }
  ss[0] = scramblers['slidy'][1].getscramble();
 }
 else if(type=="24puzso"){		// 24 puzzle random state (fast)
  if (scramblers['slidy'][0] != type) {
   scramblers['slidy'] = [type, new SlidySolver(5, 5, [[1,2],[6,7],[3,4,5],[8,9,10],[11,16,21],[12,17,22],[13,14,15],[18,19,20,23,24]])];
  }
  ss[0] = scramblers['slidy'][1].getscramble();
 }
 else if(type=="15p"){			// 15 puzzle random moves
  do15puzzle(false);
 }
 else if(type=="clk"){			// Clock (Jaap order)
  for(var n=0;n<num;n++){
   ss[n]="<tt><b><br>&nbsp;UU"+c("u")+"dU"+c("u")+"dd"+c("u")+"Ud"+c("u")+"dU"+c("u")+"Ud"+c("u")+"UU"+c("u")+"UU";
   ss[n]+=c("u")+"UU"+c("u")+"dd"+c3()+c2()+"<br>&nbsp;dd"+c("d")+"dU"+c("d")+"UU"+c("d")+"Ud"+c("d");
   ss[n]+="UU"+c3()+"UU"+c3()+"Ud"+c3()+"dU"+c3()+"UU"+c3()+"dd"+c("d")+c2()+"</b></tt><br>";
  }
 }
 else if(type=="clkc"){			// Clock (concise)
  for(var n=0;n<num;n++){
   ss[n]="";
   for (var i=0;i<4;i++) ss[n]+="(" + (Math.floor(Math.random()*12)-5) + ", " + (Math.floor(Math.random()*12)-5) + ") / ";
   for (var i=0;i<6;i++) ss[n]+="(" + (Math.floor(Math.random()*12)-5) + ") / ";
   for (var i=0;i<4;i++) ss[n]+=rndEl(["d","U"]);
  }
 }
 else if(type=="clke"){			// Clock (efficient order)
  for(var n=0;n<num;n++){
   ss[n]="<tt><b><br>&nbsp;UU"+c("u")+"dU"+c("u")+"dU"+c("u")+"UU"+c("u")+"UU"+c("u")+"UU"+c("u")+"Ud"+c("u")+"Ud";
   ss[n]+=c("u")+"dd"+c("u")+"dd"+c3()+c2()+"<br>&nbsp;UU"+c3()+"UU"+c3()+"dU"+c("d")+"dU"+c3()+"dd";
   ss[n]+=c("d")+"Ud"+c3()+"Ud"+c("d")+"UU"+c3()+"UU"+c("d")+"dd"+c("d")+c2()+"</b></tt><br>";
  }
 }
 else if(type=="clkwca"){		// Clock (WCA) - scrambler by DrKorbin
  for(var n=0;n<num;n++){
   var clock_rotations=["0+", "1+", "2+", "3+", "4+", "5+", "6+", "5-", "4-", "3-", "2-", "1-"];
   var pins=["UR", "DR", "DL", "UL", "U", "R", "D", "L", "ALL", "U", "R", "D", "L", "ALL"];
   var final_pins=["UR", "DR", "DL", "UL"];
   ss[n]="";
   for(var i=0;i<14;i++){
    ss[n]+=pins[i]+rndEl(clock_rotations)+"&nbsp;";
    if(i==8) ss[n]+="y2&nbsp;";
   }
   for(var i=0;i<4;i++){
    ss[n]+=rndEl([final_pins[i]+"&nbsp;", ""])
   }
   ss[n]+="";
  }
 }
 else if(type=="cm3"){			// Cmetrick
  megascramble([[["U<","U>","U2"],["E<","E>","E2"],["D<","D>","D2"]],[["R^","Rv","R2"],["M^","Mv","M2"],["L^","Lv","L2"]]],[""]);
 }
 else if(type=="cm2"){			// Cmetrick Mini
  megascramble([[["U<","U>","U2"],["D<","D>","D2"]],[["R^","Rv","R2"],["L^","Lv","L2"]]],[""]);
 }
 else if(type=="223"){			// Domino/2x3x3
  megascramble([[["U","U'","U2"]],[["R2","L2","R2 L2"]],[["F2","B2","F2 B2"]]],[""]);
 }
 else if(type=="flp"){			// Floppy Cube
  megascramble([["R","L"],["U","D"]],["2"]);
 }
 else if(type=="fto"){			// FTO/Face-Turning Octa
  megascramble([["U","D"],["F","B"],["L","BR"],["R","BL"]],["","'"]);
 }
 else if(type=="giga"){			// Gigaminx
  gigascramble();
 }
 else if(type=="heli"){			// Helicopter Cube
  helicubescramble();
 }
 else if(type=="mgmo"){			// Megaminx (old style)
  oldminxscramble();
 }
 else if(type=="mgmp"){			// Megaminx (Pochmann)
  pochscramble(10,Math.ceil(len/10));
 }
 else if(type=="mgmwca"){		// Megaminx (WCA)
  pochscramble(10,Math.ceil(len/10),true);
 }
 else if(type=="mgmc"){		// Megaminx (Carrot)
  carrotminx(10,Math.ceil(len/10));
 }
 else if(type=="pyrm"){			// Pyraminx (random moves)
  megascramble([["U"],["L"],["R"],["B"]],["!","'"]);
  for(var n=0;n<num;n++){
   var cnt=0;
   var rnd=[];
   for(var i=0;i<4;i++){
    rnd[i]=Math.floor(Math.random()*3);
    if(rnd[i]>0) cnt++;
   }
   ss[n]=ss[n].substr(0,ss[n].length-3*cnt);
   ss[n]=["","b ","b' "][rnd[0]]+["","l ","l' "][rnd[1]]+["","u ","u' "][rnd[2]]+["","r ","r' "][rnd[3]]+ss[n];
   ss[n]=ss[n].replace(/!/g,"");
  }
 }
 else if(type=="pyro"){			// Pyraminx (optimal random state)
  getpyraoptscramble(0);
 }
 else if(type=="pyrso"){		// Pyraminx (random state)
  getpyraoptscramble(8);
 }
 else if(type=="prco"){			// Pyraminx Crystal (old style)
  megascramble([["F","B"],["U","D"],["L","DBR"],["R","DBL"],["BL","DR"],["BR","DL"]],minxsuff);
 }
 else if(type=="prcp"){			// Pyraminx Crystal (Pochmann)
  pochscramble(10,Math.ceil(len/10));
 }
 else if(type=="r234"){			// 2x2x2 3x3x3 4x4x4 relay
  ss[0] = "<br> 2) ";
  get2x2optscramble(9);
  ss[0] += "<br> 3) ";
  ss[0] += scramblers["333"].getRandomScramble();
  ss[0] += "<br> 4) ";
  len = 40;
  megascramble([["U","D","u"],["R","L","r"],["F","B","f"]],cubesuff);;
 }
 else if(type=="r2345"){		// 2x2x2 3x3x3 4x4x4 5x5x5 relay
  ss[0] = "<br> 2) ";
  get2x2optscramble(9);
  ss[0] += "<br> 3) ";
  ss[0] += scramblers["333"].getRandomScramble();
  ss[0] += "<br> 4) ";
  len = 40;
  megascramble([["U","D","u"],["R","L","r"],["F","B","f"]],cubesuff);
  ss[0] += "<br> 5) ";
  len = 60;
  megascramble([["U","D","u","d"],["R","L","r","l"],["F","B","f","b"]],cubesuff);
 }
 else if(type=="r23456"){		// 2x2x2 3x3x3 4x4x4 5x5x5 relay
  ss[0] = "<br> 2) ";
  get2x2optscramble(9);
  ss[0] += "<br> 3) ";
  ss[0] += scramblers["333"].getRandomScramble();
  ss[0] += "<br> 4) ";
  len = 40;
  megascramble([["U","D","u"],["R","L","r"],["F","B","f"]],cubesuff);
  ss[0] += "<br> 5) ";
  len = 60;
  megascramble([["U","D","u","d"],["R","L","r","l"],["F","B","f","b"]],cubesuff);
  ss[0] += "<br> 6) ";
  len = 80;
  megascramble([["U","D","2U","2D","3U"],["R","L","2R","2L","3R"],["F","B","2F","2B","3F"]],cubesuff);
 }
 else if(type=="r234567"){		// 2x2x2 3x3x3 4x4x4 5x5x5 relay
  ss[0] = "<br> 2) ";
  get2x2optscramble(9);
  ss[0] += "<br> 3) ";
  ss[0] += scramblers["333"].getRandomScramble();
  ss[0] += "<br> 4) ";
  len = 40;
  megascramble([["U","D","u"],["R","L","r"],["F","B","f"]],cubesuff);
  ss[0] += "<br> 5) ";
  len = 60;
  megascramble([["U","D","u","d"],["R","L","r","l"],["F","B","f","b"]],cubesuff);
  ss[0] += "<br> 6) ";
  len = 80;
  megascramble([["U","D","2U","2D","3U"],["R","L","2R","2L","3R"],["F","B","2F","2B","3F"]],cubesuff);
  ss[0] += "<br> 7) ";
  len = 100;
  megascramble([["U","D","2U","2D","3U","3D"],["R","L","2R","2L","3R","3L"],["F","B","2F","2B","3F","3B"]],cubesuff);
 }
 else if(type=="guildford"){		// Guildford Challenge
  ss[0] += "<br> 2x2x2) ";
  get2x2optscramble(9);
  ss[0] += "<br> 3x3x3) ";
  ss[0] += scramblers["333"].getRandomScramble();
  ss[0] += "<br> 4x4x4) ";
  len = 40;
  megascramble([["U","D","u"],["R","L","r"],["F","B","f"]],cubesuff);
  ss[0] += "<br> 5x5x5) ";
  len = 60;
  megascramble([["U","D","u","d"],["R","L","r","l"],["F","B","f","b"]],cubesuff);
  ss[0] += "<br> 6x6x6) ";
  len = 80;
  megascramble([["U","D","2U","2D","3U"],["R","L","2R","2L","3R"],["F","B","2F","2B","3F"]],cubesuff);
  ss[0] += "<br> 7x7x7) ";
  len = 100;
  megascramble([["U","D","2U","2D","3U","3D"],["R","L","2R","2L","3R","3L"],["F","B","2F","2B","3F","3B"]],cubesuff);
  ss[0] += "<br> 3OH) ";
  ss[0] += scramblers["333"].getRandomScramble();
  ss[0] += "<br> 3FT) ";
  ss[0] += scramblers["333"].getRandomScramble();
  ss[0] += "<br> Pyra) ";
  getpyraoptscramble(8);
  ss[0] += "<br> Square-1) ";
  sq1_scramble(1);
  ss[0] += "<br> Skewb) ";
  getskewboptscramble(8);
  ss[0] += "<br> Clock) ";
  for (var i=0;i<4;i++) ss[0]+="(" + (Math.floor(Math.random()*12)-5) + ", " + (Math.floor(Math.random()*12)-5) + ") / ";
  for (var i=0;i<6;i++) ss[0]+="(" + (Math.floor(Math.random()*12)-5) + ") / ";
  for (var i=0;i<4;i++) ss[0]+=rndEl(["d","U"]);
  ss[0] += "<br> Mega) ";
  pochscramble(10,Math.ceil(len/10));
 }
 else if (type=="miniguild") {		// Mini Guildford Challenge
  ss[0] += "<br> 2x2x2) ";
  get2x2optscramble(9);
  ss[0] += "<br> 3x3x3) ";
  ss[0] += scramblers["333"].getRandomScramble();
  ss[0] += "<br> 4x4x4) ";
  len = 40;
  megascramble([["U","D","u"],["R","L","r"],["F","B","f"]],cubesuff);
  ss[0] += "<br> 5x5x5) ";
  len = 60;
  megascramble([["U","D","u","d"],["R","L","r","l"],["F","B","f","b"]],cubesuff);
  ss[0] += "<br> 3OH) ";
  ss[0] += scramblers["333"].getRandomScramble();
  ss[0] += "<br> Pyra) ";
  getpyraoptscramble(8);
  ss[0] += "<br> Square-1) ";
  sq1_scramble(1);
  ss[0] += "<br> Skewb) ";
  getskewboptscramble(8);
  ss[0] += "<br> Clock) ";
  for (var i=0;i<4;i++) ss[0]+="(" + (Math.floor(Math.random()*12)-5) + ", " + (Math.floor(Math.random()*12)-5) + ") / ";
  for (var i=0;i<6;i++) ss[0]+="(" + (Math.floor(Math.random()*12)-5) + ") / ";
  for (var i=0;i<4;i++) ss[0]+=rndEl(["d","U"]);
  ss[0] += "<br> Mega) ";
  pochscramble(10,Math.ceil(len/10));
 }
 else if(type=="r3"){			// multiple 3x3x3 relay
  var ncubes = len;
  len = 25;
  for (var i=0; i<ncubes; i++) {
   ss[0] += "<br>" + (i+1) + ") ";
   ss[0] += scramblers["333"].getRandomScramble();
  }
  len = ncubes;
 }
 else if(type=="sia113"){		// Siamese Cube (1x1x3 block)
  var n,s=[];
  megascramble([["U","u"],["R","r"]],cubesuff);
  for(n=0;n<num;n++){ss[n]+=" z2 ";}
  megascramble([["U","u"],["R","r"]],cubesuff);
 }
 else if(type=="sia123"){		// Siamese Cube (1x2x3 block)
  var n,s=[];
  megascramble([["U"],["R","r"]],cubesuff);
  for(n=0;n<num;n++){ss[n]+=" z2 ";}
  megascramble([["U"],["R","r"]],cubesuff);
 }
 else if(type=="sia222"){		// Siamese Cube (2x2x2 block)
  var n,s=[];
  megascramble([["U"],["R"],["F"]],cubesuff);
  for(n=0;n<num;n++){ss[n]+=" z2 y ";}
  megascramble([["U"],["R"],["F"]],cubesuff);
 }
 else if(type=="skb"){			// Skewb
  megascramble([["R"],["L"],["B"],["U"]],["","'"]);
 }
 else if(type=="skbo"){			// Skewb (optimal random state)
  getskewboptscramble(0);
 }
 else if(type=="skbso"){		// Skewb (suboptimal random state)
  getskewboptscramble(8);
 }
 else if(type=="sq1h"){			// Square-1 (turn metric)
  sq1_scramble(1);
 }
 else if(type=="sq1t"){			// Square-1 (twist metric)
  sq1_scramble(0);
 }
 else if(type=="sq2"){			// Square-2
  var i;
  for(var n=0;n<num;n++){
   i=0;
   while (i<len) {
    var rndu = Math.floor(Math.random()*12)-5;
    var rndd = Math.floor(Math.random()*12)-5;
    if (rndu != 0 || rndd != 0) {
     i++;
     ss[n] += "(" + rndu + "," + rndd + ") / ";
    }
   }
  }
 }
 else if(type=="sfl"){			// Super Floppy Cube
  megascramble([["R","L"],["U","D"]],cubesuff);
 }
 else if(type=="ssq1t"){		// Super Square-1 (twist metric)
  ssq1t_scramble();
 }
 else if(type=="ufo"){			// UFO
  megascramble([["A"],["B"],["C"],[["U","U'","U2'","U2","U3"]]],[""]);
 }
 else if(type=="2gen"){			// 2-generator <R,U>
  megascramble([["U"],["R"]],cubesuff);
 }
 else if(type=="2genl"){		// 2-generator <L,U>
  megascramble([["U"],["L"]],cubesuff);
 }
 else if(type=="roux"){			// Roux-generator <M,U>
  megascramble([["U"],["M"]],cubesuff);
 }
 else if(type=="3gen_F"){		// 3-generator <F,R,U>
  megascramble([["U"],["R"],["F"]],cubesuff);
 }
 else if(type=="3gen_L"){		// 3-generator <R,U,L>
  megascramble([["U"],["R","L"]],cubesuff);
 }
 else if(type=="RrU"){			// 3-generator <R,r,U>
  megascramble([["U"],["R","r"]],cubesuff);
 }
 else if(type=="RrUu"){			// <R,r,U,u>
  megascramble([["U","u"],["R","r"]],cubesuff);
 }
 else if(type=="minx2g"){		// megaminx 2-gen
  megascramble([["U"],["R"]],minxsuff);
 }
 else if(type=="mlsll"){		// megaminx LSLL
  megascramble([[["R U R'","R U2 R'","R U' R'","R U2' R'"]],[["F' U F","F' U2 F","F' U' F","F' U2' F"]],[["U","U2","U'","U2'"]]],[""]);
 }
 else if(type=="bic"){			// Bandaged Cube
  bicube();
 }
 else if(type=="bsq"){			// Bandaged Square-1 </,(1,0)>
  sq1_scramble(2);
 }
 else if(type=="half"){			// 3x3x3 half turns
  megascramble([["U","D"],["R","L"],["F","B"]],["2"]);
 }
 else if(type=="edges"){		// 3x3x3 edges only
  ss[0] = scramblers["333"].getEdgeScramble();
 }
 else if(type=="corners"){		// 3x3x3 corners only
  ss[0] = scramblers["333"].getCornerScramble();
 }
 else if(type=="ll"){			// 3x3x3 last layer
  ss[0] = scramblers["333"].getLLScramble();
 }
 else if(type=="cmll"){			// 3x3x3 cmll
  ss[0] = rndEl(["","M ","M2 ","M' "]) + scramblers["333"].getCMLLScramble();
 }
 else if(type=="zbll"){			// 3x3x3 zbll
  ss[0] = scramblers["333"].getZBLLScramble();
 }
 else if(type=="2gll"){			// 3x3x3 2gll
  ss[0] = scramblers["333"].get2GLLScramble();
 }
 else if(type=="pll"){			// 3x3x3 pll
  ss[0] = scramblers["333"].getPLLScramble();
 }
 else if(type=="lsll2"){		// 3x3x3 last slot + last layer
  ss[0] = scramblers["333"].getLSLLScramble();
 }
 else if(type=="zzls"){			// 3x3x3 ZZ last slot + last layer
  ss[0] = scramblers["333"].getZZLSScramble();
 }
 else if(type=="f2l"){			// 3x3x3 f2l
  ss[0] = scramblers["333"].getF2LScramble();
 }
 else if(type=="lsll"){			// 3x3x3 last slot + last layer (old)
  megascramble([[["R U R'","R U2 R'","R U' R'"]],[["F' U F","F' U2 F","F' U' F"]],[["U","U2","U'"]]],[""]);
 }
 else if(type=="4edge"){		// 4x4x4 edges
  edgescramble("r b2",["b2 r'", "b2 U2 r U2 r U2 r U2 r"],["u"]);
 }
 else if(type=="5edge"){		// 5x5x5 edges
  edgescramble("r R b B",["B' b' R' r'", "B' b' R' U2 r U2 r U2 r U2 r"],["u","d"]);
 }
 else if(type=="6edge"){		// 6x6x6 edges
  edgescramble("3r r 3b b",["3b' b' 3r' r'","3b' b' 3r' U2 r U2 r U2 r U2 r","3b' b' r' U2 3r U2 3r U2 3r U2 3r","3b' b' r2 U2 3R U2 3R U2 3R U2 3R"],["u","3u","d"]);
 }
 else if(type=="7edge"){		// 7x7x7 edges
  edgescramble("3r r 3b b",["3b' b' 3r' r'","3b' b' 3r' U2 r U2 r U2 r U2 r","3b' b' r' U2 3r U2 3r U2 3r U2 3r","3b' b' r2 U2 3R U2 3R U2 3R U2 3R"],["u","3u","3d","d"]);
 }
 else if(type=="-1"){			// -1x-1x-1 (micro style)
  for(var n=0;n<num;n++){
   for(var i=0;i<len;i++){ss[n]+=String.fromCharCode(32+Math.floor(Math.random()*224));}
   ss[n]+="Error: subscript out of range";
  }
 }
 else if(type=="112"){			// 1x1x2
  megascramble([["R"],["R"]],cubesuff);
 }
 else if(type=="2222"){			// 2x2x2x2
  scramble2222([["R","L"],["I","O"]],["", "y", "z"], ["", "y", "y'", "z", "z'", "z2"], ["", "x", "x'", "x2"]);
 }
 else if(type=="333noob"){		// 3x3x3 for noobs
  megascramble([["turn the top face","turn the bottom face"],["turn the right face","turn the left face"],["turn the front face","turn the back face"]],[" clockwise by 90 degrees,", " counterclockwise by 90 degrees,"," by 180 degrees,"]);
  for(var n=0;n<num;n++){
   ss[n]=ss[n].replace(/t/,"T");
   ss[n]=ss[n].substr(0,ss[n].length-2)+".";
  }
 }
 else if(type=="lol"){			// LOL
  megascramble([["L"],["O"]],[""]);
  for(var n=0;n<num;n++){ss[n]=ss[n].replace(/ /g,"");}
 }
 else if(type=="eide"){			// Derrick Eide
  megascramble([["OMG"],["WOW"],["WTF"],[["WOO-HOO","WOO-HOO","MATYAS","YES","YES","YAY","YEEEEEEEEEEEES"]],["HAHA"],["XD"],[":D"],["LOL"]],["","","","!!!"]);
 }
 scramble = ss[0];
 $('scramble').innerHTML = "scramble: " + scramble + "&nbsp;";
}

// Clock functions.
function c(s){
 var array=[s+"&nbsp;&nbsp;",s+"'&nbsp;",s+"2'",s+"3'",s+"4'",s+"5'",s+"6&nbsp;",s+"5&nbsp;",s+"4&nbsp;",s+"3&nbsp;",s+"2&nbsp;","&nbsp;&nbsp;&nbsp;"];
 return " </b>"+rndEl(array)+"<b>&nbsp;&nbsp; ";
}
function c2(){return rndEl(["U","d"])+rndEl(["U","d"]);}
function c3(){return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"}

function randomCubeOrientation() {
 s = rndEl(["","z","z'","x","x'","x2"]) + rndEl([""," y"," y'"," y2"]);
 return s;
}

function edgescramble(start, end, moves) {
 var u=0,d=0,movemis=[];
 var triggers=[["R","R'"],["R'","R"],["L","L'"],["L'","L"],["F'","F"],["F","F'"],["B","B'"],["B'","B"]];
 var ud=["U","D"];
 ss[0] = start;
 // initialize move misalignments
 for (var i=0; i<moves.length; i++) {
  movemis[i] = 0;
 }

 for (var i=0; i<len; i++) {
  // apply random moves
  var done = false;
  while (!done) {
   var v = "";
   for (var j=0; j<moves.length; j++) {
    var x = Math.floor(Math.random()*4);
    movemis[j] += x;
    if (x!=0) {
     done = true;
     v += " " + moves[j] + cubesuff[x-1];
    }
   }
  }
  ss[0] += v;
   
  // apply random trigger, update U/D
  var trigger = Math.floor(Math.random()*8);
  var layer = Math.floor(Math.random()*2);
  var turn = Math.floor(Math.random()*3);
  ss[0] += " " + triggers[trigger][0] + " " + ud[layer] + cubesuff[turn] + " " + triggers[trigger][1];
  if (layer==0) {u += turn+1;}
  if (layer==1) {d += turn+1;}
 }

 // fix everything
 for (var i=0; i<moves.length; i++) {
  var x = 4-(movemis[i]%4);
  if (x<4) {
   ss[0] += " " + moves[i] + cubesuff[x-1];
  }
 }
 u = 4-(u%4); d = 4-(d%4);
 if (u<4) {
  ss[0] += " U" + cubesuff[u-1];
 }
 if (d<4) {
  ss[0] += " D" + cubesuff[d-1];
 }
 ss[0] += " " + rndEl(end);
}

function do15puzzle(mirrored){
 var moves = (mirrored?["U","L","R","D"]:["D","R","L","U"]);
 var effect = [[0,-1],[1,0],[-1,0],[0,1]];
 var x=0,y=3,k,done,r,lastr=5;
 ss[0]="";
 for(k=0;k<len;k++){
  done=false;
  while(!done){
   r=Math.floor(Math.random()*4);
   if (x+effect[r][0]>=0 && x+effect[r][0]<=3 && y+effect[r][1]>=0 && y+effect[r][1]<=3 && r+lastr != 3) {
    done=true;
    x+=effect[r][0];
    y+=effect[r][1];
    ss[0]+=moves[r]+" ";
    lastr=r;
   }
  }
 }
}

function pochscramble(x,y,wca){
 var i,j,n;
 for(n=0;n<num;n++){
  for(i=0;i<y;i++){
   ss[n]+="<br>&nbsp;&nbsp;";
   for(j=0;j<x-(wca?1:0);j++){
    ss[n]+=(j%2==0?"R":"D")+rndEl(["++","--"])+" ";
   }
   if (wca) {
    ss[n]+=rndEl(["D++ U","D-- U'"]);
   } else {
    ss[n]+="U"+rndEl(["'"," "]);
   }
  }
 }
}

function carrotminx(x,y){
 var i,j,n;
 for(n=0;n<num;n++){
  for(i=0;i<y;i++){
   ss[n]+="<br>&nbsp;&nbsp;";
   for(j=0;j<x/2;j++){
    ss[n]+=rndEl(["+","-"])+rndEl(["+","-"])+" ";
   }
   ss[n]+="U"+rndEl(["'"," "]);
  }
 }
}

function gigascramble(){
 var i,j,n;
 for(n=0;n<num;n++){
  for(i=0;i<Math.ceil(len/10);i++){
   ss[n]+="<br>&nbsp;&nbsp;";
   for(j=0;j<10;j++){
    ss[n]+=(j%2==0?(Math.random()>0.5?"R":"r"):(Math.random()>0.5?"D":"d"))+rndEl(["+","++","-","--"])+" ";
   }
   ss[n]+="y"+rndEl(minxsuff);
  }
 }
}

function sq1_scramble(type){
 seq=[];
 var i,k,n;
 sq1_getseq(num, type);
 for(n=0;n<num;n++){
  var s="";
  for(i=0; i<seq[n].length; i++){
   k=seq[n][i];
   if(k[0] == 7) {
    s +="/";
   } else {
    s += " (" + k[0] + "," + k[1] + ") ";
   }
  }
  ss[n]+=s;
 }
}

function ssq1t_scramble(){
 seq=[];
 var i,n;
 sq1_getseq(num*2, 0);
 for(n=0;n<num;n++){
  var s=seq[2*n],t=seq[2*n+1],u="",k;
  if (s[0][0]==7) s=[[0,0]].concat(s);
  if (t[0][0]==7) t=[[0,0]].concat(t);
  for(i=0;i<len;i++){
   u+="(" + s[2*i][0] + "," + t[2*i][0] + "," + t[2*i][1] + "," + s[2*i][1] + ") / ";
  }
  ss[n]+=u;
 }
}

function sq1_getseq(num, type){
 for(var n=0; n<num; n++){
  p = [1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0];
  seq[n] = [];
  var cnt = 0;
  while (cnt < len) {
   var x = Math.floor(Math.random() * 12) - 5;
   var y = (type==2) ? 0 : Math.floor(Math.random() * 12) - 5;
   var size = (x==0?0:1) + (y==0?0:1);
   if ((cnt + size <= len || type != 1) && (size > 0 || cnt == 0)) {
    if (sq1_domove(x, y)) {
     if (type == 1) cnt += size;
     if (size > 0) seq[n][seq[n].length] = [x,y];
     if (cnt < len || type != 1) {
      cnt++;
      seq[n][seq[n].length] = [7,0];
      sq1_domove(7,0);
     }
    }
   }
  }
 }
}

function sq1_domove(x, y){
 var i, temp, px, py;
 if (x == 7) {
  for (i=0; i<6; i++) {
   temp = p[i+6];
   p[i+6] = p[i+12];
   p[i+12] = temp;
  }
  return true;
 } else {
  if (p[(17-x)%12] || p[(11-x)%12] || p[12+(17-y)%12] || p[12+(11-y)%12]) {
   return false;
  } else {
   // do the move itself
   px = p.slice(0, 12);
   py = p.slice(12, 24);
   for (i=0; i<12; i++) {
    p[i] = px[(12+i-x)%12];
    p[i+12] = py[(12+i-y)%12];
   }
   return true;
  }
 }
}

function oldminxscramble(){
 var i,j,k;
 var faces = ["F","B","U","D","L","DBR","DL","BR","DR","BL","R","DBL"];
 var used = [];
 // adjacency table
 var adj = ["001010101010","000101010101","100010010110","010001101001","101000100101","010100011010","100110001001","011001000110","100101100010","011010010001","101001011000","010110100100"];
 // now generate the scramble(s)
 for(i=0;i<num;i++){
  var s="";
  for(j=0;j<12;j++){
   used[j] = 0;
  }
  for(j=0;j<len;j++){
   var done = false;
   do {
    var face = Math.floor(Math.random()*12);
    if (used[face] == 0) {
     s += faces[face] + rndEl(minxsuff) + " ";
     for(k=0;k<12;k++){
      if (adj[face].charAt(k)=="1") {used[k] = 0;}
     }
     used[face] = 1;
     done = true;
    }
   } while (!done);
  }
  ss[i] += s;
 }
}

function bicube(){
 function canMove(face) {
  var u=[], i, j, done, z=0;
  for (i=0; i<9; i++) {
   done = 0;
   for (j=0; j<u.length; j++) {
    if (u[j]==start[d[face][i]]) done = 1;
   }
   if (done==0) {
    u[u.length] = start[d[face][i]];
    if (start[d[face][i]] == 0) z = 1;
   }
  }
  return (u.length==5 && z==1);
 }

 function doMove(face, amount) {
  for (var i=0; i<amount; i++) {
   var t = start[d[face][0]];
   start[d[face][0]] = start[d[face][6]];
   start[d[face][6]] = start[d[face][4]];
   start[d[face][4]] = start[d[face][2]];
   start[d[face][2]] = t;
   t = start[d[face][7]];
   start[d[face][7]] = start[d[face][5]];
   start[d[face][5]] = start[d[face][3]];
   start[d[face][3]] = start[d[face][1]];
   start[d[face][1]] = t;
  }
 }

 var d = [[0,1,2,5,8,7,6,3,4],[6,7,8,13,20,19,18,11,12],[0,3,6,11,18,17,16,9,10],[8,5,2,15,22,21,20,13,14]];
 var start=[1,1,2,3,3,2,4,4,0,5,6,7,8,9,10,10,5,6,7,8,9,11,11], move="UFLR", s="", arr=[], poss, done, i, j, x, y;
 while (arr.length < len) {
  poss = [1,1,1,1];
  for (j=0; j<4; j++) {
   if (poss[j]==1 && !canMove(j))
    poss[j]=0;
  }
  done = 0;
  while (done==0) {
   x = 0|Math.random()*4;
   if (poss[x]==1) {
    y = (0|Math.random()*3)+1;
    doMove(x, y);
    done = 1;
   }
  }
  arr[arr.length] = [x,y];
  if (arr.length >= 2) {
   if (arr[arr.length-1][0] == arr[arr.length-2][0]) {
    arr[arr.length-2][1] = (arr[arr.length-2][1] + arr[arr.length-1][1])%4;
    arr = arr.slice(0,arr.length - 1);
   }
  }
  if (arr.length >= 1) {
   if (arr[arr.length-1][1] == 0) {
    arr = arr.slice(0,arr.length - 1);
   }
  }
 }
 for (i=0; i<len; i++) {
  s += move[arr[i][0]] + cubesuff[arr[i][1]-1] + " ";
 }
 ss[0] += s;
}

function yj4x4(){
 // the idea is to keep the fixed center on U and do Rw or Lw, Fw or Bw, to not disturb it
 turns = [["U","D"],["R","L","r"],["F","B","f"]];
 var donemoves=[];
 var lastaxis;
 var fpos = 0; // 0 = Ufr, 1 = Ufl, 2 = Ubl, 3 = Ubr
 var i=0,j,k;
 var s="";
 lastaxis=-1;
 for(j=0;j<len;j++){
  var done=0;
  do{
   var first=Math.floor(Math.random()*turns.length);
   var second=Math.floor(Math.random()*turns[first].length);
   if(first!=lastaxis||donemoves[second]==0){
    if(first==lastaxis){
     donemoves[second]=1;
     var rs = Math.floor(Math.random()*cubesuff.length);
     if(first==0&&second==0){fpos = (fpos + 4 + rs)%4;}
     if(first==1&&second==2){ // r or l
      if(fpos==0||fpos==3) s+="l"+cubesuff[rs]+" ";
      else s+="r"+cubesuff[rs]+" ";
     } else if(first==2&&second==2){ // f or b
      if(fpos==0||fpos==1) s+="b"+cubesuff[rs]+" ";
      else s+="f"+cubesuff[rs]+" ";
     } else {
      s+=turns[first][second]+cubesuff[rs]+" ";
     }
    }else{
     for(k=0;k<turns[first].length;k++){donemoves[k]=0;}
     lastaxis=first;
     donemoves[second]=1;
     var rs = Math.floor(Math.random()*cubesuff.length);
     if(first==0&&second==0){fpos = (fpos + 4 + rs)%4;}
     if(first==1&&second==2){ // r or l
      if(fpos==0||fpos==3) s+="l"+cubesuff[rs]+" ";
      else s+="r"+cubesuff[rs]+" ";
     } else if(first==2&&second==2){ // f or b
      if(fpos==0||fpos==1) s+="b"+cubesuff[rs]+" ";
      else s+="f"+cubesuff[rs]+" ";
     } else {
      s+=turns[first][second]+cubesuff[rs]+" ";
     }
    }
    done=1;
   }
  }while(done==0);
 }
 ss[i]+=s;
}

function helicubescramble(){
 var i,j,k;
 var faces = ["UF", "UR", "UB", "UL", "FR", "BR", "BL", "FL", "DF", "DR", "DB", "DL"];
 var used = [];
 // adjacency table
 var adj = ["010110010000","101011000000","010101100000","101000110000","110000001100","011000000110","001100000011","100100001001","000010010101","000011001010","000001100101","000000111010"];
 // now generate the scramble(s)
 for(i=0;i<num;i++){
  var s="";
  for(j=0;j<12;j++){
   used[j] = 0;
  }
  for(j=0;j<len;j++){
   var done = false;
   do {
    var face = Math.floor(Math.random()*12);
    if (used[face] == 0) {
     s += faces[face] + " ";
     for(k=0;k<12;k++){
      if (adj[face].charAt(k)=="1") {used[k] = 0;}
     }
     used[face] = 1;
     done = true;
    }
   } while (!done);
  }
  ss[i] += s;
 }
}

// Function written by Tom van der Zanden/Jaap Scherphuis and optimized/obfuscated/condensed by me
function get2x2optscramble(mn) {
 var e=[15,16,16,21,21,15,13,9,9,17,17,13,14,20,20,4,4,14,12,5,5,8,8,12,3,23,23,18,18,3,1,19,19,11,11,1,2,6,6,22,22,2,0,10,10,7,7,0],d=[[],[],[],[],[],[]],v=[[0,2,3,1,23,19,10,6,22,18,11,7],[4,6,7,5,12,20,2,10,14,22,0,8],[8,10,11,9,12,7,1,17,13,5,0,19],[12,13,15,14,8,17,21,4,9,16,20,5],[16,17,19,18,15,9,1,23,13,11,3,21],[20,21,23,22,14,16,3,6,15,18,2,4]],r=[],a=[],b=[],c=[],f=[],s=[];function t(){s=[1,1,1,1,2,2,2,2,5,5,5,5,4,4,4,4,3,3,3,3,0,0,0,0]}t();function mx(){t();for(var i=0;i<500;i++)dm(Math.floor(Math.random()*3+3)+16*Math.floor(Math.random()*3))}function cj(){var i,j;for(i=0;i<6;i++)for(j=0;j<6;j++)d[i][j]=0;for(i=0;i<48;i+=2)if(s[e[i]]<=5&&s[e[i+1]]<=5)d[s[e[i]]][s[e[i+1]]]++}function dm(m){var j=1+(m>>4),k=m&15,i;while(j){for(i=0;i<v[k].length;i+=4)y(s,v[k][i],v[k][i+3],v[k][i+2],v[k][i+1]);j--}}function sv(){cj();var h=[],w=[],i=0,j,k,m;for(j=0;j<7;j++){m=0;for(k=i;k<i+6;k+=2){if(s[e[k]]==s[e[42]])m+=4;if(s[e[k]]==s[e[44]])m+=1;if(s[e[k]]==s[e[46]])m+=2}h[j]=m;if(s[e[i]]==s[e[42]]||s[e[i]]==5-s[e[42]])w[j]=0;else if(s[e[i+2]]==s[e[42]]||s[e[i+2]]==5-s[e[42]])w[j]=1;else w[j]=2;i+=6}m=0;for(i=0;i<7;i++){j=0;for(k=0;k<7;k++){if(h[k]==i)break;if(h[k]>i)j++}m=m*(7-i)+j}j=0;for(i=5;i>=0;i--)j=j*3+w[i]-3*Math.floor(w[i]/3);if(m!=0||j!=0){r.length=0;for(k=mn;k<99;k++)if(se(0,m,j,k,-1))break;j="";for(m=0;m<r.length;m++)j="URF".charAt(r[m]/10)+"\'2 ".charAt(r[m]%10)+" "+j;return j}}function se(i,j,k,l,m){if(l!=0){if(a[j]>l||b[k]>l)return false;var o,p,q,n;for(n=0;n<3;n++)if(n!=m){o=j;p=k;for(q=0;q<3;q++){o=c[o][n];p=f[p][n];r[i]=10*n+q;if(se(i+1,o,p,l-1,n))return true}}}else if(j==0&&k==0)return true;return false}function z(){var i,j,k,m,n;for(i=0;i<5040;i++){a[i]=-1;c[i]=[];for(j=0;j<3;j++)c[i][j]=g(i,j)}a[0]=0;for(i=0;i<=6;i++)for(j=0;j<5040;j++)if(a[j]==i)for(k=0;k<3;k++){m=j;for(n=0;n<3;n++){var m=c[m][k];if(a[m]==-1)a[m]=i+1}}for(i=0;i<729;i++){b[i]=-1;f[i]=[];for(j=0;j<3;j++)f[i][j]=w(i,j)}b[0]=0;for(i=0;i<=5;i++)for(j=0;j<729;j++)if(b[j]==i)for(k=0;k<3;k++){m=j;for(n=0;n<3;n++){var m=f[m][k];if(b[m]==-1)b[m]=i+1}}}function g(i,j){var k,m,n,o=i,h=[];for(k=1;k<=7;k++){m=o%k;o=(o-m)/k;for(n=k-1;n>=m;n--)h[n+1]=h[n];h[m]=7-k}if(j==0)y(h,0,1,3,2);else if(j==1)y(h,0,4,5,1);else if(j==2)y(h,0,2,6,4);o=0;for(k=0;k<7;k++){m=0;for(n=0;n<7;n++){if(h[n]==k)break;if(h[n]>k)m++}o=o*(7-k)+m}return o}function w(i,j){var k,m,n,o=0,p=i,h=[];for(k=0;k<=5;k++){n=Math.floor(p/3);m=p-3*n;p=n;h[k]=m;o-=m;if(o<0)o+=3}h[6]=o;if(j==0)y(h,0,1,3,2);else if(j==1){y(h,0,4,5,1);h[0]+=2;h[1]++;h[5]+=2;h[4]++}else if(j==2){y(h,0,2,6,4);h[2]+=2;h[0]++;h[4]+=2;h[6]++}p=0;for(k=5;k>=0;k--)p=p*3+(h[k]%3);return p}function y(i,j,k,m,n){var o=i[j];i[j]=i[k];i[k]=i[m];i[m]=i[n];i[n]=o}z();
 for (var i=0;i<num;i++) {
  mx();
  ss[i]+=sv();
 }
}

// Function written by Lucas Garron/Jaap Scherphuis and optimized/obfuscated/condensed by me
function getpyraoptscramble(mn) {
 var j=1,b=[],g=[],f=[],d=[],e=[],k=[],h=[],i=[];function u(){var c,p,q,l,m;for(p=0;p<720;p++){g[p]=-1;d[p]=[];for(m=0;m<4;m++)d[p][m]=w(p,m)}g[0]=0;for(l=0;l<=6;l++)for(p=0;p<720;p++)if(g[p]==l)for(m=0;m<4;m++){q=p;for(c=0;c<2;c++){q=d[q][m];if(g[q]==-1)g[q]=l+1}}for(p=0;p<2592;p++){f[p]=-1;e[p]=[];for(m=0;m<4;m++)e[p][m]=x(p,m)}f[0]=0;for(l=0;l<=5;l++)for(p=0;p<2592;p++)if(f[p]==l)for(m=0;m<4;m++){q=p;for(c=0;c<2;c++){q=e[q][m];if(f[q]==-1)f[q]=l+1}}for(c=0;c<j;c++){k=[];var t=0,s=0;q=0;h=[0,1,2,3,4,5];for(m=0;m<4;m++){p=m+n(6-m);l=h[m];h[m]=h[p];h[p]=l;if(m!=p)s++}if(s%2==1){l=h[4];h[4]=h[5];h[5]=l}s=0;i=[];for(m=0;m<5;m++){i[m]=n(2);s+=i[m]}i[5]=s%2;for(m=6;m<10;m++){i[m]=n(3)}for(m=0;m<6;m++){l=0;for(p=0;p<6;p++){if(h[p]==m)break;if(h[p]>m)l++}q=q*(6-m)+l}for(m=9;m>=6;m--)t=t*3+i[m];for(m=4;m>=0;m--)t=t*2+i[m];if(q!=0||t!=0)for(m=mn;m<99;m++)if(v(q,t,m,-1))break;b[c]="";for(p=0;p<k.length;p++)b[c]+=["U","L","R","B"][k[p]&7]+["","'"][(k[p]&8)/8]+" ";var a=["l","r","b","u"];for(p=0;p<4;p++){q=n(3);if(q<2)b[c]+=a[p]+["","'"][q]+" "}}}function v(q,t,l,c){if(l==0){if(q==0&&t==0)return true}else{if(g[q]>l||f[t]>l)return false;var p,s,a,m;for(m=0;m<4;m++)if(m!=c){p=q;s=t;for(a=0;a<2;a++){p=d[p][m];s=e[s][m];k[k.length]=m+8*a;if(v(p,s,l-1,m))return true;k.length--}}}return false}function w(p,m){var a,l,c,s=[],q=p;for(a=1;a<=6;a++){c=Math.floor(q/a);l=q-a*c;q=c;for(c=a-1;c>=l;c--)s[c+1]=s[c];s[l]=6-a}if(m==0)y(s,0,3,1);if(m==1)y(s,1,5,2);if(m==2)y(s,0,2,4);if(m==3)y(s,3,4,5);q=0;for(a=0;a<6;a++){l=0;for(c=0;c<6;c++){if(s[c]==a)break;if(s[c]>a)l++}q=q*(6-a)+l}return q}function x(p,m){var a,l,c,t=0,s=[],q=p;for(a=0;a<=4;a++){s[a]=q&1;q>>=1;t^=s[a]}s[5]=t;for(a=6;a<=9;a++){c=Math.floor(q/3);l=q-3*c;q=c;s[a]=l}if(m==0){s[6]++;if(s[6]==3)s[6]=0;y(s,0,3,1);s[1]^=1;s[3]^=1}if(m==1){s[7]++;if(s[7]==3)s[7]=0;y(s,1,5,2);s[2]^=1;s[5]^=1}if(m==2){s[8]++;if(s[8]==3)s[8]=0;y(s,0,2,4);s[0]^=1;s[2]^=1}if(m==3){s[9]++;if(s[9]==3)s[9]=0;y(s,3,4,5);s[3]^=1;s[4]^=1}q=0;for(a=9;a>=6;a--)q=q*3+s[a];for(a=4;a>=0;a--)q=q*2+s[a];return q}function y(p,a,c,t){var s=p[a];p[a]=p[c];p[c]=p[t];p[t]=s}function n(c){return Math.floor(Math.random()*c)}
 u();
 ss[0]+=b[0];
}

// function written by Shuang Chen
function getskewboptscramble(e){
 function t(e){var t=arguments.length-1,n=e[arguments[t]];for(var r=t;r>1;r--){e[arguments[r]]=e[arguments[r-1]]}e[arguments[1]]=n}function n(e,t){return e[t>>3]>>((t&7)<<2)&15}function r(e,t,n,r){for(var i=0;i<r;i++){e[i]=[];for(var s=0;s<t;s++){e[i][s]=n(s,i)}}}function i(e,t,r,i,s,o,u){var a=Array.isArray(s);for(var f=0,l=r+7>>>3;f<l;f++){e[f]=-1}e[t>>3]^=15<<((t&7)<<2);for(var c=0;c<=i;c++){var h=c+1^15;for(var p=0;p<r;p++){if(n(e,p)==c){for(var d=0;d<o;d++){var v=p;for(var m=0;m<u;m++){v=a?s[d][v]:s(v,d);if(n(e,v)==15){e[v>>3]^=h<<((v&7)<<2)}}}}}}}function s(e,t,r,i,o){if(0==r)return 0==e&&0==t;if(n(a,e)>r||n(f,t)>r)return!1;for(var u=0;4>u;u++)if(u!=i)for(var h=e,p=t,d=0;2>d;d++)if(h=l[u][h],p=c[u][p],s(h,p,r-1,u,o))return o.push(u*2+(1-d)),!0;return!1}function o(e,n){var r=e%12;e=~~(e/12);for(var i=[],s=5517840,o=0,u=0;5>u;u++){var a=h[5-u],f=~~(e/a),e=e-f*a,o=o^f,f=f<<2;i[u]=s>>f&15;a=(1<<f)-1;s=(s&a)+(s>>4&~a)}0==(o&1)?i[5]=s:(i[5]=i[4],i[4]=s);0==n&&t(i,0,3,1);2==n&&t(i,1,5,2);1==n&&t(i,0,2,4);3==n&&t(i,3,4,5);e=0;s=5517840;for(u=0;4>u;u++)f=i[u]<<2,e*=6-u,e+=s>>f&15,s-=1118480<<f;return e*12+p[r][n]}function u(e,t){var n=[];var r=[];for(var i=0;i<4;i++){n[i]=e%3;e=~~(e/3)}for(var i=0;i<3;i++){r[i]=e%3;e=~~(e/3)}r[3]=(6-r[0]-r[1]-r[2])%3;n[t]=(n[t]+1)%3;var s;if(t==0){var s=r[0];r[0]=r[2]+2;r[2]=r[1]+2;r[1]=s+2}else if(t==1){var s=r[0];r[0]=r[1]+2;r[1]=r[3]+2;r[3]=s+2}else if(t==2){var s=r[0];r[0]=r[3]+2;r[3]=r[2]+2;r[2]=s+2}else if(t==3){var s=r[1];r[1]=r[2]+2;r[2]=r[3]+2;r[3]=s+2}for(var i=2;i>=0;i--){e=e*3+r[i]%3}for(var i=3;i>=0;i--){e=e*3+n[i]}return e}var a=[],f=[],l=[],c=[];var h=[1,1,1,3,12,60,360];var p=[[6,5,10,1],[9,7,4,2],[3,11,8,0],[10,1,6,5],[0,8,11,3],[7,9,2,4],[4,2,9,7],[11,3,0,8],[1,10,5,6],[8,0,3,11],[2,4,7,9],[5,6,1,10]];var d=[0,1,2,0,2,1,1,2,0,2,1,0];var v,m,y=[];r(l,4320,o,4);i(a,0,4320,7,l,4,2);r(c,2187,u,4);i(f,0,2187,6,c,4,2);do{v=0|Math.random()*4320;m=0|Math.random()*2187}while(v==0&&m==0||d[v%12]!=(m+~~(m/3)+~~(m/9)+~~(m/27))%3);for(;99>e&&!s(v,m,e,-1,y);e++){}var b=[];var w=["L","R","B","U"];for(var u=0;u<y.length;u++){var E=y[u]>>1;var S=y[u]&1;if(E==2){for(var l=0;l<=S;l++){var x=w[0];w[0]=w[1];w[1]=w[3];w[3]=x}}b.push(w[E]+(S==1?"'":""))}
 ss[0]+=b.join(" ")
}

/* Function by Kas Thomas, http://www.planetpdf.com/developer/article.asp?ContentID=testing_for_object_types_in_ja */
function isArray(obj){
 if(typeof obj=='object'){
  var test = obj.constructor.toString().match(/array/i); 
  return (test != null);
  }
 return false;
}

function megascramble(turns, suffixes){
 var donemoves=[];
 var lastaxis;
 var i,j,k;
 for(i=0;i<num;i++){
  var s="";
  lastaxis=-1;
  for(j=0;j<len;j++){
   var done=0;
   do{
    var first=Math.floor(Math.random()*turns.length);
    var second=Math.floor(Math.random()*turns[first].length);
    if (first!=lastaxis) {
     for(k=0;k<turns[first].length;k++){donemoves[k]=0;}
     lastaxis=first;
    }
    if (donemoves[second]==0) {
     donemoves[second]=1;
     if(isArray(turns[first][second])){
      s+=rndEl(turns[first][second])+rndEl(suffixes)+" ";
     }else{
      s+=turns[first][second]+rndEl(suffixes)+" ";
     }
     done=1;
    }
   }while(done==0);
  }
  ss[i]+=s;
 }
}

/* 2x2x2x2: tested only for params [["R","L"], ["I","O"]], 
   ["", "y", "z"], ["", "y", "y'", "z", "z'", "z2"], ["", "x", "x'", "x2"] .  
   'len' is the number of _pairs_ now, so 20 paired "tosses" instead of 40 twists is a normal length.
   (By the way, 15 tosses is a lower bound on how many tosses are needed to generate enough states.)
   Produces scrambles that look like  ( Ry'x Lz Iy' Oyx2 ) *    -- note that x goes last now, not y.
   Uses strict alternation of R L I O R L I O (using a dot for a null move).
   I've streamlined combinations containing x2 and z2 where I can, for an extra 10% savings.
   -- Marc Ringuette 8/24/2018 */
function scramble2222(turnpairs, suffix_a, suffix_b, suffix_x){
  var j;
  var s="";
  for(j=0;j<len;j++){
    var whichpair = j%2;
    var whichorder = Math.random() < 0.5;
    do {
      var i_a = Math.floor(Math.random()*suffix_a.length);
      var i_b = Math.floor(Math.random()*suffix_b.length);
      var i_x = Math.floor(Math.random()*suffix_x.length);
    } while (i_a==0 && i_b==0 && i_x==0);  // dividend is 71 not 72
    var a = suffix_a[i_a];
    var b = suffix_b[i_b];
    var x = suffix_x[i_x];

    // optional:  streamline many combinations containing either z2 or x2
    // s += "("+a+" "+b+" "+x+")"; // uncomment to see what is shortened to what
    function inv(mv) {
      if (mv=="x") return "x'";
      else if (mv=="x'") return "x";
      else if (mv=="y") return "y'";
      else if (mv=="y'") return "y";
      else if (mv=="z") return "z'";
      else if (mv=="z'") return "z";
      else return "<oops>";
    }
    if (a=="z" && b=="z2") {
      a=inv(a);
      b="";
    }
    if (x=="x2") {
      if (b=="z2") {
        b="y2";
        x="";
        if (a=="y") {
          a=inv(a);
          b="";
        }
      }
    }
 
    if (x=="x2" && a!="" && b!="") { // x2 is in combination with a z and a y
      if (((a=="z" || a=="z'") && (b=="y" || b=="y'")) || ((a=="y" || a=="y'") && (b=="z" || b=="z'"))) {
        a=inv(a);
        b=inv(b);
        x="";
      }
    }
    if (b=="z2" && a!="" && x!="") { // z2 is in combination with an x and a y
      if (a=="y" || a=="y'") {
        a=inv(a);
        b="";
        x=inv(x);
      }
    }
    // End of optional streamlining (saves another 10% of moves)

    // mix the x twists in with a (or b, if it's the only empty one)
    if (a=="" || b!="") a+=x;
    else b+=x;


    if (a=="") a=".";  // let's use a dot to indicate no twist, to keep the RLIO lockstep visually clear
    if (b=="") b=".";

    s+=turnpairs[whichpair][0];
    if (whichorder) s+=a; else s+=b;
    s+=" ";
    s+=turnpairs[whichpair][1];
    if (whichorder) s+=b; else s+=a;
    s+=" ";
   }
   ss[0]+=s;
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
}
