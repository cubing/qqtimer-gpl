import { scramblerGlobals } from "./scramblerGlobals";

export function sq1_scramble(type) {
  scramblerGlobals.seq = [];
  var i, k, n;
  sq1_getseq(scramblerGlobals.num, type);
  for (n = 0; n < scramblerGlobals.num; n++) {
    var s = "";
    for (i = 0; i < scramblerGlobals.seq[n].length; i++) {
      k = scramblerGlobals.seq[n][i];
      if (k[0] == 7) {
        s += "/";
      } else {
        s += " (" + k[0] + "," + k[1] + ") ";
      }
    }
    scramblerGlobals.ss[n] += s;
  }
}

export function ssq1t_scramble() {
  scramblerGlobals.seq = [];
  var i, n;
  sq1_getseq(scramblerGlobals.num * 2, 0);
  for (n = 0; n < scramblerGlobals.num; n++) {
    var s = scramblerGlobals.seq[2 * n],
      t = scramblerGlobals.seq[2 * n + 1],
      u = "",
      k;
    if (s[0][0] == 7) s = [[0, 0]].concat(s);
    if (t[0][0] == 7) t = [[0, 0]].concat(t);
    for (i = 0; i < scramblerGlobals.len; i++) {
      u +=
        "(" +
        s[2 * i][0] +
        "," +
        t[2 * i][0] +
        "," +
        t[2 * i][1] +
        "," +
        s[2 * i][1] +
        ") / ";
    }
    scramblerGlobals.ss[n] += u;
  }
}

function sq1_getseq(num, type) {
  for (var n = 0; n < num; n++) {
    scramblerGlobals.p = [
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
    ];
    scramblerGlobals.seq[n] = [];
    var cnt = 0;
    while (cnt < scramblerGlobals.len) {
      var x = Math.floor(Math.random() * 12) - 5;
      var y = type == 2 ? 0 : Math.floor(Math.random() * 12) - 5;
      var size = (x == 0 ? 0 : 1) + (y == 0 ? 0 : 1);
      if (
        (cnt + size <= scramblerGlobals.len || type != 1) &&
        (size > 0 || cnt == 0)
      ) {
        if (sq1_domove(x, y)) {
          if (type == 1) cnt += size;
          if (size > 0)
            scramblerGlobals.seq[n][scramblerGlobals.seq[n].length] = [x, y];
          if (cnt < scramblerGlobals.len || type != 1) {
            cnt++;
            scramblerGlobals.seq[n][scramblerGlobals.seq[n].length] = [7, 0];
            sq1_domove(7, 0);
          }
        }
      }
    }
  }
}

function sq1_domove(x, y) {
  var i, temp, px, py;
  if (x == 7) {
    for (i = 0; i < 6; i++) {
      temp = scramblerGlobals.p[i + 6];
      scramblerGlobals.p[i + 6] = scramblerGlobals.p[i + 12];
      scramblerGlobals.p[i + 12] = temp;
    }
    return true;
  } else {
    if (
      scramblerGlobals.p[(17 - x) % 12] ||
      scramblerGlobals.p[(11 - x) % 12] ||
      scramblerGlobals.p[12 + ((17 - y) % 12)] ||
      scramblerGlobals.p[12 + ((11 - y) % 12)]
    ) {
      return false;
    } else {
      // do the move itself
      px = scramblerGlobals.p.slice(0, 12);
      py = scramblerGlobals.p.slice(12, 24);
      for (i = 0; i < 12; i++) {
        scramblerGlobals.p[i] = px[(12 + i - x) % 12];
        scramblerGlobals.p[i + 12] = py[(12 + i - y) % 12];
      }
      return true;
    }
  }
}
