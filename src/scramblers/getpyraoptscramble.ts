// Function written by Lucas Garron/Jaap Scherphuis and optimized/obfuscated/condensed by me
export function getpyraoptscramble(mn): string {
  var j = 1,
    b = [],
    g = [],
    f = [],
    d = [],
    e = [],
    k = [],
    h = [],
    i = [];
  function u() {
    var c, p, q, l, m;
    for (p = 0; p < 720; p++) {
      g[p] = -1;
      d[p] = [];
      for (m = 0; m < 4; m++) d[p][m] = w(p, m);
    }
    g[0] = 0;
    for (l = 0; l <= 6; l++)
      for (p = 0; p < 720; p++)
        if (g[p] == l)
          for (m = 0; m < 4; m++) {
            q = p;
            for (c = 0; c < 2; c++) {
              q = d[q][m];
              if (g[q] == -1) g[q] = l + 1;
            }
          }
    for (p = 0; p < 2592; p++) {
      f[p] = -1;
      e[p] = [];
      for (m = 0; m < 4; m++) e[p][m] = x(p, m);
    }
    f[0] = 0;
    for (l = 0; l <= 5; l++)
      for (p = 0; p < 2592; p++)
        if (f[p] == l)
          for (m = 0; m < 4; m++) {
            q = p;
            for (c = 0; c < 2; c++) {
              q = e[q][m];
              if (f[q] == -1) f[q] = l + 1;
            }
          }
    for (c = 0; c < j; c++) {
      k = [];
      var t = 0,
        s = 0;
      q = 0;
      h = [0, 1, 2, 3, 4, 5];
      for (m = 0; m < 4; m++) {
        p = m + n(6 - m);
        l = h[m];
        h[m] = h[p];
        h[p] = l;
        if (m != p) s++;
      }
      if (s % 2 == 1) {
        l = h[4];
        h[4] = h[5];
        h[5] = l;
      }
      s = 0;
      i = [];
      for (m = 0; m < 5; m++) {
        i[m] = n(2);
        s += i[m];
      }
      i[5] = s % 2;
      for (m = 6; m < 10; m++) {
        i[m] = n(3);
      }
      for (m = 0; m < 6; m++) {
        l = 0;
        for (p = 0; p < 6; p++) {
          if (h[p] == m) break;
          if (h[p] > m) l++;
        }
        q = q * (6 - m) + l;
      }
      for (m = 9; m >= 6; m--) t = t * 3 + i[m];
      for (m = 4; m >= 0; m--) t = t * 2 + i[m];
      if (q != 0 || t != 0) for (m = mn; m < 99; m++) if (v(q, t, m, -1)) break;
      b[c] = "";
      for (p = 0; p < k.length; p++)
        b[c] +=
          ["U", "L", "R", "B"][k[p] & 7] + ["", "'"][(k[p] & 8) / 8] + " ";
      var a = ["l", "r", "b", "u"];
      for (p = 0; p < 4; p++) {
        q = n(3);
        if (q < 2) b[c] += a[p] + ["", "'"][q] + " ";
      }
    }
  }
  function v(q, t, l, c) {
    if (l == 0) {
      if (q == 0 && t == 0) return true;
    } else {
      if (g[q] > l || f[t] > l) return false;
      var p, s, a, m;
      for (m = 0; m < 4; m++)
        if (m != c) {
          p = q;
          s = t;
          for (a = 0; a < 2; a++) {
            p = d[p][m];
            s = e[s][m];
            k[k.length] = m + 8 * a;
            if (v(p, s, l - 1, m)) return true;
            k.length--;
          }
        }
    }
    return false;
  }
  function w(p, m) {
    var a,
      l,
      c,
      s = [],
      q = p;
    for (a = 1; a <= 6; a++) {
      c = Math.floor(q / a);
      l = q - a * c;
      q = c;
      for (c = a - 1; c >= l; c--) s[c + 1] = s[c];
      s[l] = 6 - a;
    }
    if (m == 0) y(s, 0, 3, 1);
    if (m == 1) y(s, 1, 5, 2);
    if (m == 2) y(s, 0, 2, 4);
    if (m == 3) y(s, 3, 4, 5);
    q = 0;
    for (a = 0; a < 6; a++) {
      l = 0;
      for (c = 0; c < 6; c++) {
        if (s[c] == a) break;
        if (s[c] > a) l++;
      }
      q = q * (6 - a) + l;
    }
    return q;
  }
  function x(p, m) {
    var a,
      l,
      c,
      t = 0,
      s = [],
      q = p;
    for (a = 0; a <= 4; a++) {
      s[a] = q & 1;
      q >>= 1;
      t ^= s[a];
    }
    s[5] = t;
    for (a = 6; a <= 9; a++) {
      c = Math.floor(q / 3);
      l = q - 3 * c;
      q = c;
      s[a] = l;
    }
    if (m == 0) {
      s[6]++;
      if (s[6] == 3) s[6] = 0;
      y(s, 0, 3, 1);
      s[1] ^= 1;
      s[3] ^= 1;
    }
    if (m == 1) {
      s[7]++;
      if (s[7] == 3) s[7] = 0;
      y(s, 1, 5, 2);
      s[2] ^= 1;
      s[5] ^= 1;
    }
    if (m == 2) {
      s[8]++;
      if (s[8] == 3) s[8] = 0;
      y(s, 0, 2, 4);
      s[0] ^= 1;
      s[2] ^= 1;
    }
    if (m == 3) {
      s[9]++;
      if (s[9] == 3) s[9] = 0;
      y(s, 3, 4, 5);
      s[3] ^= 1;
      s[4] ^= 1;
    }
    q = 0;
    for (a = 9; a >= 6; a--) q = q * 3 + s[a];
    for (a = 4; a >= 0; a--) q = q * 2 + s[a];
    return q;
  }
  function y(p, a, c, t) {
    var s = p[a];
    p[a] = p[c];
    p[c] = p[t];
    p[t] = s;
  }
  function n(c) {
    return Math.floor(Math.random() * c);
  }
  u();
  return b[0];
}
