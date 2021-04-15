import { rndEl } from "./random";
import { scramblerGlobals } from "./scramblerGlobals";

export function megascramble(turns, suffixes) {
  var donemoves = [];
  var lastaxis;
  var i, j, k;
  for (i = 0; i < scramblerGlobals.num; i++) {
    var s = "";
    lastaxis = -1;
    for (j = 0; j < scramblerGlobals.len; j++) {
      var done = 0;
      do {
        var first = Math.floor(Math.random() * turns.length);
        var second = Math.floor(Math.random() * turns[first].length);
        if (first != lastaxis) {
          for (k = 0; k < turns[first].length; k++) {
            donemoves[k] = 0;
          }
          lastaxis = first;
        }
        if (donemoves[second] == 0) {
          donemoves[second] = 1;
          if (isArray(turns[first][second])) {
            s += rndEl(turns[first][second]) + rndEl(suffixes) + " ";
          } else {
            s += turns[first][second] + rndEl(suffixes) + " ";
          }
          done = 1;
        }
      } while (done == 0);
    }
    scramblerGlobals.ss[i] += s;
  }
}

/* Function by Kas Thomas, http://www.planetpdf.com/developer/article.asp?ContentID=testing_for_object_types_in_ja */
function isArray(obj) {
  if (typeof obj == "object") {
    var test = obj.constructor.toString().match(/array/i);
    return test != null;
  }
  return false;
}
