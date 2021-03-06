import { $ } from "../dom";
import { megascramble } from "./megascramble";
import { rndEl } from "./random";
import { scramblerGlobals } from "./scramblerGlobals";
import {
  getpyraoptscramble,
  getskewboptscramble,
  scramblers,
  SlidySolver,
} from "./scramblers";
import { sq1_scramble, ssq1t_scramble } from "./sq1";

export { scrdata } from "./scrdata";

// #################### SCRAMBLING ####################

export function setScrambleType(newType: string): void {
  scramblerGlobals.type = newType;
}

export function getScrambleType(): string {
  return scramblerGlobals.type;
}

export function getLen(): number {
  return scramblerGlobals.len;
}

export function setLen(newLen: number): void {
  scramblerGlobals.len = newLen;
}

export function getScramble(): string {
  return scramblerGlobals.scramble;
}

export function clearScramble(): void {
  scramblerGlobals.scramble = "";
}

export function getLastScramble(): string {
  return scramblerGlobals.lastscramble;
}

export function initializeScramblers(): void {
  scramblers["333"].initialize(null, Math); // hopefully this'll let IE load scramblers
  scramblers["slidy"] = ["", null];
}

export function scrambleIt() {
  $<HTMLSelectElement>("optbox").blur();
  $<HTMLSelectElement>("optbox2").blur();
  scramblerGlobals.lastscramble = scramblerGlobals.scramble;
  for (var i = 0; i < scramblerGlobals.num; i++) scramblerGlobals.ss[i] = "";
  if (scramblerGlobals.type == "111") {
    // 1x1x1
    megascramble([["x"], ["y"], ["z"]], scramblerGlobals.cubesuff);
  } else if (scramblerGlobals.type == "2223") {
    // 2x2x2 (3-gen)
    megascramble([["U"], ["R"], ["F"]], scramblerGlobals.cubesuff);
  } else if (scramblerGlobals.type == "2226") {
    // 2x2x2 (6-gen)
    megascramble(
      [[["U", "D"]], [["R", "L"]], [["F", "B"]]],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "222o") {
    // 2x2x2 (optimal random state)
    get2x2optscramble(0);
  } else if (scramblerGlobals.type == "222so") {
    // 2x2x2 (random state)
    get2x2optscramble(9);
  } else if (scramblerGlobals.type == "333o") {
    // 3x3x3 (old style)
    megascramble(
      [
        ["U", "D"],
        ["R", "L"],
        ["F", "B"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "333") {
    // 3x3x3 (random state)
    scramblerGlobals.ss[0] = scramblers["333"].getRandomScramble();
  } else if (scramblerGlobals.type == "333ori") {
    // 3x3x3 (random state + orientation)
    scramblerGlobals.ss[0] = scramblers["333"].getRandomScramble();
    scramblerGlobals.ss[0] += randomCubeOrientation();
  } else if (scramblerGlobals.type == "sqrs") {
    // square-1 (random state)
    if (scramblerGlobals.initoncesq1 == 1) {
      scramblers["sq1"].initialize(null, Math);
      scramblerGlobals.initoncesq1 = 0;
    }
    scramblerGlobals.ss[0] = scramblers[
      "sq1"
    ].getRandomScramble().scramble_string;
  } else if (scramblerGlobals.type == "334") {
    // 3x3x4
    megascramble(
      [
        [
          [
            "U",
            "U'",
            "U2",
            "u",
            "u'",
            "u2",
            "U u",
            "U u'",
            "U u2",
            "U' u",
            "U' u'",
            "U' u2",
            "U2 u",
            "U2 u'",
            "U2 u2",
          ],
        ],
        [["R2", "L2", "M2"]],
        [["F2", "B2", "S2"]],
      ],
      [""]
    );
  } else if (scramblerGlobals.type == "335") {
    // 3x3x5
    var n: number;
    megascramble(
      [
        [
          ["U", "U'", "U2"],
          ["D", "D'", "D2"],
        ],
        ["R2", "L2"],
        ["F2", "B2"],
      ],
      [""]
    );
    for (n = 0; n < scramblerGlobals.num; n++) {
      scramblerGlobals.ss[n] += " / ";
    }
    scramblerGlobals.ss[0] += scramblers["333"].getRandomScramble();
  } else if (scramblerGlobals.type == "336") {
    // 3x3x6
    megascramble(
      [
        [
          [
            "U",
            "U'",
            "U2",
            "u",
            "u'",
            "u2",
            "U u",
            "U u'",
            "U u2",
            "U' u",
            "U' u'",
            "U' u2",
            "U2 u",
            "U2 u'",
            "U2 u2",
            "3u",
            "3u'",
            "3u2",
            "U 3u",
            "U' 3u",
            "U2 3u",
            "u 3u",
            "u' 3u",
            "u2 3u",
            "U u 3u",
            "U u' 3u",
            "U u2 3u",
            "U' u 3u",
            "U' u' 3u",
            "U' u2 3u",
            "U2 u 3u",
            "U2 u' 3u",
            "U2 u2 3u",
            "U 3u'",
            "U' 3u'",
            "U2 3u'",
            "u 3u'",
            "u' 3u'",
            "u2 3u'",
            "U u 3u'",
            "U u' 3u'",
            "U u2 3u'",
            "U' u 3u'",
            "U' u' 3u'",
            "U' u2 3u'",
            "U2 u 3u'",
            "U2 u' 3u'",
            "U2 u2 3u'",
            "U 3u2",
            "U' 3u2",
            "U2 3u2",
            "u 3u2",
            "u' 3u2",
            "u2 3u2",
            "U u 3u2",
            "U u' 3u2",
            "U u2 3u2",
            "U' u 3u2",
            "U' u' 3u2",
            "U' u2 3u2",
            "U2 u 3u2",
            "U2 u' 3u2",
            "U2 u2 3u2",
          ],
        ],
        [["R2", "L2", "M2"]],
        [["F2", "B2", "S2"]],
      ],
      [""]
    );
  } else if (scramblerGlobals.type == "337") {
    // 3x3x7
    var n: number;
    megascramble(
      [
        [
          [
            "U",
            "U'",
            "U2",
            "u",
            "u'",
            "u2",
            "U u",
            "U u'",
            "U u2",
            "U' u",
            "U' u'",
            "U' u2",
            "U2 u",
            "U2 u'",
            "U2 u2",
          ],
          [
            "D",
            "D'",
            "D2",
            "d",
            "d'",
            "d2",
            "D d",
            "D d'",
            "D d2",
            "D' d",
            "D' d'",
            "D' d2",
            "D2 d",
            "D2 d'",
            "D2 d2",
          ],
        ],
        ["R2", "L2"],
        ["F2", "B2"],
      ],
      [""]
    );
    for (n = 0; n < scramblerGlobals.num; n++) {
      scramblerGlobals.ss[n] += " / ";
    }
    scramblerGlobals.ss[0] += scramblers["333"].getRandomScramble();
  } else if (scramblerGlobals.type == "446") {
    // 4x4x6
    var n: number;
    megascramble(
      [
        [
          ["U", "U'", "U2"],
          ["D", "D'", "D2"],
        ],
        ["R2", "r2", "L2"],
        ["F2", "f2", "B2"],
      ],
      [""]
    );
    for (n = 0; n < scramblerGlobals.num; n++) {
      scramblerGlobals.ss[n] += " / ";
    }
    megascramble(
      [
        ["U", "D", "u"],
        ["R", "L", "r"],
        ["F", "B", "f"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "888") {
    // 8x8x8 (SiGN)
    megascramble(
      [
        ["U", "D", "u", "d", "3u", "3d", "4u"],
        ["R", "L", "r", "l", "3r", "3l", "4r"],
        ["F", "B", "f", "b", "3f", "3b", "4f"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "999") {
    // 9x9x9 (SiGN)
    megascramble(
      [
        ["U", "D", "u", "d", "3u", "3d", "4u", "4d"],
        ["R", "L", "r", "l", "3r", "3l", "4r", "4l"],
        ["F", "B", "f", "b", "3f", "3b", "4f", "4b"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "101010") {
    // 10x10x10 (SiGN)
    megascramble(
      [
        ["U", "D", "u", "d", "3u", "3d", "4u", "4d", "5u"],
        ["R", "L", "r", "l", "3r", "3l", "4r", "4l", "5r"],
        ["F", "B", "f", "b", "3f", "3b", "4f", "4b", "5f"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "111111") {
    // 11x11x11 (SiGN)
    megascramble(
      [
        ["U", "D", "u", "d", "3u", "3d", "4u", "4d", "5u", "5d"],
        ["R", "L", "r", "l", "3r", "3l", "4r", "4l", "5r", "5l"],
        ["F", "B", "f", "b", "3f", "3b", "4f", "4b", "5f", "5b"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "444") {
    // 4x4x4 (SiGN)
    megascramble(
      [
        ["U", "D", "u"],
        ["R", "L", "r"],
        ["F", "B", "f"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "444wca") {
    // 4x4x4 (WCA)
    megascramble(
      [
        ["U", "D", "Uw"],
        ["R", "L", "Rw"],
        ["F", "B", "Fw"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "444yj") {
    // 4x4x4 (YJ style)
    yj4x4();
  } else if (scramblerGlobals.type == "555") {
    // 5x5x5 (SiGN)
    megascramble(
      [
        ["U", "D", "u", "d"],
        ["R", "L", "r", "l"],
        ["F", "B", "f", "b"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "555wca") {
    // 5x5x5 (WCA)
    megascramble(
      [
        ["U", "D", "Uw", "Dw"],
        ["R", "L", "Rw", "Lw"],
        ["F", "B", "Fw", "Bw"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "666p") {
    // 6x6x6 (prefix)
    megascramble(
      [
        ["U", "D", "2U", "2D", "3U"],
        ["R", "L", "2R", "2L", "3R"],
        ["F", "B", "2F", "2B", "3F"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "666s") {
    // 6x6x6 (suffix)
    megascramble(
      [
        ["U", "D", "U&sup2;", "D&sup2;", "U&sup3;"],
        ["R", "L", "R&sup2;", "L&sup2;", "R&sup3;"],
        ["F", "B", "F&sup2;", "B&sup2;", "F&sup3;"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "666si") {
    // 6x6x6 (SiGN)
    megascramble(
      [
        ["U", "D", "u", "d", "3u"],
        ["R", "L", "r", "l", "3r"],
        ["F", "B", "f", "b", "3f"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "666wca") {
    // 6x6x6 (WCA)
    megascramble(
      [
        ["U", "D", "Uw", "Dw", "3Uw"],
        ["R", "L", "Rw", "Lw", "3Rw"],
        ["F", "B", "Fw", "Bw", "3Fw"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "777p") {
    // 7x7x7 (prefix)
    megascramble(
      [
        ["U", "D", "2U", "2D", "3U", "3D"],
        ["R", "L", "2R", "2L", "3R", "3L"],
        ["F", "B", "2F", "2B", "3F", "3B"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "777s") {
    // 7x7x7 (suffix)
    megascramble(
      [
        ["U", "D", "U&sup2;", "D&sup2;", "U&sup3;", "D&sup3;"],
        ["R", "L", "R&sup2;", "L&sup2;", "R&sup3;", "L&sup3;"],
        ["F", "B", "F&sup2;", "B&sup2;", "F&sup3;", "B&sup3;"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "777si") {
    // 7x7x7 (SiGN)
    megascramble(
      [
        ["U", "D", "u", "d", "3u", "3d"],
        ["R", "L", "r", "l", "3r", "3l"],
        ["F", "B", "f", "b", "3f", "3b"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "777wca") {
    // 7x7x7 (WCA)
    megascramble(
      [
        ["U", "D", "Uw", "Dw", "3Uw", "3Dw"],
        ["R", "L", "Rw", "Lw", "3Rw", "3Lw"],
        ["F", "B", "Fw", "Bw", "3Fw", "3Bw"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "8puzso") {
    // 8 puzzle random state
    if (scramblers["slidy"][0] != scramblerGlobals.type) {
      scramblers["slidy"] = [
        scramblerGlobals.type,
        new SlidySolver(3, 3, [
          [1, 2, 3],
          [4, 5, 6, 7, 8],
        ]),
      ];
    }
    scramblerGlobals.ss[0] = scramblers["slidy"][1].getscramble();
  } else if (scramblerGlobals.type == "8puzo") {
    // 8 puzzle optimal random state
    if (scramblers["slidy"][0] != scramblerGlobals.type) {
      scramblers["slidy"] = [
        scramblerGlobals.type,
        new SlidySolver(3, 3, [[1, 2, 3, 4, 5, 6, 7, 8]]),
      ];
    }
    scramblerGlobals.ss[0] = scramblers["slidy"][1].getscramble();
  } else if (scramblerGlobals.type == "15puzso") {
    // 15 puzzle random state (fast)
    if (scramblers["slidy"][0] != scramblerGlobals.type) {
      scramblers["slidy"] = [
        scramblerGlobals.type,
        new SlidySolver(4, 4, [
          [1, 2],
          [3, 4],
          [5, 9, 13],
          [6, 7, 8],
          [10, 11, 12, 14, 15],
        ]),
      ];
    }
    scramblerGlobals.ss[0] = scramblers["slidy"][1].getscramble();
  } else if (scramblerGlobals.type == "15puzsoe") {
    // 15 puzzle random state (efficient)
    if (scramblers["slidy"][0] != scramblerGlobals.type) {
      scramblers["slidy"] = [
        scramblerGlobals.type,
        new SlidySolver(4, 4, [
          [1, 2, 3, 4],
          [5, 9, 13],
          [6, 7, 8, 10, 11, 12, 14, 15],
        ]),
      ];
    }
    scramblerGlobals.ss[0] = scramblers["slidy"][1].getscramble();
  } else if (scramblerGlobals.type == "24puzso") {
    // 24 puzzle random state (fast)
    if (scramblers["slidy"][0] != scramblerGlobals.type) {
      scramblers["slidy"] = [
        scramblerGlobals.type,
        new SlidySolver(5, 5, [
          [1, 2],
          [6, 7],
          [3, 4, 5],
          [8, 9, 10],
          [11, 16, 21],
          [12, 17, 22],
          [13, 14, 15],
          [18, 19, 20, 23, 24],
        ]),
      ];
    }
    scramblerGlobals.ss[0] = scramblers["slidy"][1].getscramble();
  } else if (scramblerGlobals.type == "15p") {
    // 15 puzzle random moves
    do15puzzle(false);
  } else if (scramblerGlobals.type == "clk") {
    // Clock (Jaap order)
    for (var n = 0; n < scramblerGlobals.num; n++) {
      scramblerGlobals.ss[n] =
        "<tt><b><br>&nbsp;UU" +
        c("u") +
        "dU" +
        c("u") +
        "dd" +
        c("u") +
        "Ud" +
        c("u") +
        "dU" +
        c("u") +
        "Ud" +
        c("u") +
        "UU" +
        c("u") +
        "UU";
      scramblerGlobals.ss[n] +=
        c("u") +
        "UU" +
        c("u") +
        "dd" +
        c3() +
        c2() +
        "<br>&nbsp;dd" +
        c("d") +
        "dU" +
        c("d") +
        "UU" +
        c("d") +
        "Ud" +
        c("d");
      scramblerGlobals.ss[n] +=
        "UU" +
        c3() +
        "UU" +
        c3() +
        "Ud" +
        c3() +
        "dU" +
        c3() +
        "UU" +
        c3() +
        "dd" +
        c("d") +
        c2() +
        "</b></tt><br>";
    }
  } else if (scramblerGlobals.type == "clkc") {
    // Clock (concise)
    for (var n = 0; n < scramblerGlobals.num; n++) {
      scramblerGlobals.ss[n] = "";
      for (var i = 0; i < 4; i++)
        scramblerGlobals.ss[n] +=
          "(" +
          (Math.floor(Math.random() * 12) - 5) +
          ", " +
          (Math.floor(Math.random() * 12) - 5) +
          ") / ";
      for (var i = 0; i < 6; i++)
        scramblerGlobals.ss[n] +=
          "(" + (Math.floor(Math.random() * 12) - 5) + ") / ";
      for (var i = 0; i < 4; i++) scramblerGlobals.ss[n] += rndEl(["d", "U"]);
    }
  } else if (scramblerGlobals.type == "clke") {
    // Clock (efficient order)
    for (var n = 0; n < scramblerGlobals.num; n++) {
      scramblerGlobals.ss[n] =
        "<tt><b><br>&nbsp;UU" +
        c("u") +
        "dU" +
        c("u") +
        "dU" +
        c("u") +
        "UU" +
        c("u") +
        "UU" +
        c("u") +
        "UU" +
        c("u") +
        "Ud" +
        c("u") +
        "Ud";
      scramblerGlobals.ss[n] +=
        c("u") +
        "dd" +
        c("u") +
        "dd" +
        c3() +
        c2() +
        "<br>&nbsp;UU" +
        c3() +
        "UU" +
        c3() +
        "dU" +
        c("d") +
        "dU" +
        c3() +
        "dd";
      scramblerGlobals.ss[n] +=
        c("d") +
        "Ud" +
        c3() +
        "Ud" +
        c("d") +
        "UU" +
        c3() +
        "UU" +
        c("d") +
        "dd" +
        c("d") +
        c2() +
        "</b></tt><br>";
    }
  } else if (scramblerGlobals.type == "clkwca") {
    // Clock (WCA) - scrambler by DrKorbin
    for (var n = 0; n < scramblerGlobals.num; n++) {
      var clock_rotations = [
        "0+",
        "1+",
        "2+",
        "3+",
        "4+",
        "5+",
        "6+",
        "5-",
        "4-",
        "3-",
        "2-",
        "1-",
      ];
      var pins = [
        "UR",
        "DR",
        "DL",
        "UL",
        "U",
        "R",
        "D",
        "L",
        "ALL",
        "U",
        "R",
        "D",
        "L",
        "ALL",
      ];
      var final_pins = ["UR", "DR", "DL", "UL"];
      scramblerGlobals.ss[n] = "";
      for (var i = 0; i < 14; i++) {
        scramblerGlobals.ss[n] += pins[i] + rndEl(clock_rotations) + "&nbsp;";
        if (i == 8) scramblerGlobals.ss[n] += "y2&nbsp;";
      }
      for (var i = 0; i < 4; i++) {
        scramblerGlobals.ss[n] += rndEl([final_pins[i] + "&nbsp;", ""]);
      }
      scramblerGlobals.ss[n] += "";
    }
  } else if (scramblerGlobals.type == "cm3") {
    // Cmetrick
    megascramble(
      [
        [
          ["U<", "U>", "U2"],
          ["E<", "E>", "E2"],
          ["D<", "D>", "D2"],
        ],
        [
          ["R^", "Rv", "R2"],
          ["M^", "Mv", "M2"],
          ["L^", "Lv", "L2"],
        ],
      ],
      [""]
    );
  } else if (scramblerGlobals.type == "cm2") {
    // Cmetrick Mini
    megascramble(
      [
        [
          ["U<", "U>", "U2"],
          ["D<", "D>", "D2"],
        ],
        [
          ["R^", "Rv", "R2"],
          ["L^", "Lv", "L2"],
        ],
      ],
      [""]
    );
  } else if (scramblerGlobals.type == "223") {
    // Domino/2x3x3
    megascramble(
      [[["U", "U'", "U2"]], [["R2", "L2", "R2 L2"]], [["F2", "B2", "F2 B2"]]],
      [""]
    );
  } else if (scramblerGlobals.type == "flp") {
    // Floppy Cube
    megascramble(
      [
        ["R", "L"],
        ["U", "D"],
      ],
      ["2"]
    );
  } else if (scramblerGlobals.type == "fto") {
    // FTO/Face-Turning Octa
    megascramble(
      [
        ["U", "D"],
        ["F", "B"],
        ["L", "BR"],
        ["R", "BL"],
      ],
      ["", "'"]
    );
  } else if (scramblerGlobals.type == "giga") {
    // Gigaminx
    gigascramble();
  } else if (scramblerGlobals.type == "heli") {
    // Helicopter Cube
    helicubescramble();
  } else if (scramblerGlobals.type == "mgmo") {
    // Megaminx (old style)
    oldminxscramble();
  } else if (scramblerGlobals.type == "mgmp") {
    // Megaminx (Pochmann)
    pochscramble(10, Math.ceil(scramblerGlobals.len / 10));
  } else if (scramblerGlobals.type == "mgmwca") {
    // Megaminx (WCA)
    pochscramble(10, Math.ceil(scramblerGlobals.len / 10), true);
  } else if (scramblerGlobals.type == "mgmc") {
    // Megaminx (Carrot)
    carrotminx(10, Math.ceil(scramblerGlobals.len / 10));
  } else if (scramblerGlobals.type == "pyrm") {
    // Pyraminx (random moves)
    megascramble([["U"], ["L"], ["R"], ["B"]], ["!", "'"]);
    for (var n = 0; n < scramblerGlobals.num; n++) {
      var cnt = 0;
      var rnd = [];
      for (var i = 0; i < 4; i++) {
        rnd[i] = Math.floor(Math.random() * 3);
        if (rnd[i] > 0) cnt++;
      }
      scramblerGlobals.ss[n] = scramblerGlobals.ss[n].substr(
        0,
        scramblerGlobals.ss[n].length - 3 * cnt
      );
      scramblerGlobals.ss[n] =
        ["", "b ", "b' "][rnd[0]] +
        ["", "l ", "l' "][rnd[1]] +
        ["", "u ", "u' "][rnd[2]] +
        ["", "r ", "r' "][rnd[3]] +
        scramblerGlobals.ss[n];
      scramblerGlobals.ss[n] = scramblerGlobals.ss[n].replace(/!/g, "");
    }
  } else if (scramblerGlobals.type == "pyro") {
    // Pyraminx (optimal random state)
    scramblerGlobals.ss[0] += getpyraoptscramble(0);
  } else if (scramblerGlobals.type == "pyrso") {
    // Pyraminx (random state)
    scramblerGlobals.ss[0] += getpyraoptscramble(8);
  } else if (scramblerGlobals.type == "prco") {
    // Pyraminx Crystal (old style)
    megascramble(
      [
        ["F", "B"],
        ["U", "D"],
        ["L", "DBR"],
        ["R", "DBL"],
        ["BL", "DR"],
        ["BR", "DL"],
      ],
      scramblerGlobals.minxsuff
    );
  } else if (scramblerGlobals.type == "prcp") {
    // Pyraminx Crystal (Pochmann)
    pochscramble(10, Math.ceil(scramblerGlobals.len / 10));
  } else if (scramblerGlobals.type == "r234") {
    // 2x2x2 3x3x3 4x4x4 relay
    scramblerGlobals.ss[0] = "<br> 2) ";
    get2x2optscramble(9);
    scramblerGlobals.ss[0] += "<br> 3) ";
    scramblerGlobals.ss[0] += scramblers["333"].getRandomScramble();
    scramblerGlobals.ss[0] += "<br> 4) ";
    scramblerGlobals.len = 40;
    megascramble(
      [
        ["U", "D", "u"],
        ["R", "L", "r"],
        ["F", "B", "f"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "r2345") {
    // 2x2x2 3x3x3 4x4x4 5x5x5 relay
    scramblerGlobals.ss[0] = "<br> 2) ";
    get2x2optscramble(9);
    scramblerGlobals.ss[0] += "<br> 3) ";
    scramblerGlobals.ss[0] += scramblers["333"].getRandomScramble();
    scramblerGlobals.ss[0] += "<br> 4) ";
    scramblerGlobals.len = 40;
    megascramble(
      [
        ["U", "D", "u"],
        ["R", "L", "r"],
        ["F", "B", "f"],
      ],
      scramblerGlobals.cubesuff
    );
    scramblerGlobals.ss[0] += "<br> 5) ";
    scramblerGlobals.len = 60;
    megascramble(
      [
        ["U", "D", "u", "d"],
        ["R", "L", "r", "l"],
        ["F", "B", "f", "b"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "r23456") {
    // 2x2x2 3x3x3 4x4x4 5x5x5 relay
    scramblerGlobals.ss[0] = "<br> 2) ";
    get2x2optscramble(9);
    scramblerGlobals.ss[0] += "<br> 3) ";
    scramblerGlobals.ss[0] += scramblers["333"].getRandomScramble();
    scramblerGlobals.ss[0] += "<br> 4) ";
    scramblerGlobals.len = 40;
    megascramble(
      [
        ["U", "D", "u"],
        ["R", "L", "r"],
        ["F", "B", "f"],
      ],
      scramblerGlobals.cubesuff
    );
    scramblerGlobals.ss[0] += "<br> 5) ";
    scramblerGlobals.len = 60;
    megascramble(
      [
        ["U", "D", "u", "d"],
        ["R", "L", "r", "l"],
        ["F", "B", "f", "b"],
      ],
      scramblerGlobals.cubesuff
    );
    scramblerGlobals.ss[0] += "<br> 6) ";
    scramblerGlobals.len = 80;
    megascramble(
      [
        ["U", "D", "2U", "2D", "3U"],
        ["R", "L", "2R", "2L", "3R"],
        ["F", "B", "2F", "2B", "3F"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "r234567") {
    // 2x2x2 3x3x3 4x4x4 5x5x5 relay
    scramblerGlobals.ss[0] = "<br> 2) ";
    get2x2optscramble(9);
    scramblerGlobals.ss[0] += "<br> 3) ";
    scramblerGlobals.ss[0] += scramblers["333"].getRandomScramble();
    scramblerGlobals.ss[0] += "<br> 4) ";
    scramblerGlobals.len = 40;
    megascramble(
      [
        ["U", "D", "u"],
        ["R", "L", "r"],
        ["F", "B", "f"],
      ],
      scramblerGlobals.cubesuff
    );
    scramblerGlobals.ss[0] += "<br> 5) ";
    scramblerGlobals.len = 60;
    megascramble(
      [
        ["U", "D", "u", "d"],
        ["R", "L", "r", "l"],
        ["F", "B", "f", "b"],
      ],
      scramblerGlobals.cubesuff
    );
    scramblerGlobals.ss[0] += "<br> 6) ";
    scramblerGlobals.len = 80;
    megascramble(
      [
        ["U", "D", "2U", "2D", "3U"],
        ["R", "L", "2R", "2L", "3R"],
        ["F", "B", "2F", "2B", "3F"],
      ],
      scramblerGlobals.cubesuff
    );
    scramblerGlobals.ss[0] += "<br> 7) ";
    scramblerGlobals.len = 100;
    megascramble(
      [
        ["U", "D", "2U", "2D", "3U", "3D"],
        ["R", "L", "2R", "2L", "3R", "3L"],
        ["F", "B", "2F", "2B", "3F", "3B"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "guildford") {
    // Guildford Challenge
    scramblerGlobals.ss[0] += "<br> 2x2x2) ";
    get2x2optscramble(9);
    scramblerGlobals.ss[0] += "<br> 3x3x3) ";
    scramblerGlobals.ss[0] += scramblers["333"].getRandomScramble();
    scramblerGlobals.ss[0] += "<br> 4x4x4) ";
    scramblerGlobals.len = 40;
    megascramble(
      [
        ["U", "D", "u"],
        ["R", "L", "r"],
        ["F", "B", "f"],
      ],
      scramblerGlobals.cubesuff
    );
    scramblerGlobals.ss[0] += "<br> 5x5x5) ";
    scramblerGlobals.len = 60;
    megascramble(
      [
        ["U", "D", "u", "d"],
        ["R", "L", "r", "l"],
        ["F", "B", "f", "b"],
      ],
      scramblerGlobals.cubesuff
    );
    scramblerGlobals.ss[0] += "<br> 6x6x6) ";
    scramblerGlobals.len = 80;
    megascramble(
      [
        ["U", "D", "2U", "2D", "3U"],
        ["R", "L", "2R", "2L", "3R"],
        ["F", "B", "2F", "2B", "3F"],
      ],
      scramblerGlobals.cubesuff
    );
    scramblerGlobals.ss[0] += "<br> 7x7x7) ";
    scramblerGlobals.len = 100;
    megascramble(
      [
        ["U", "D", "2U", "2D", "3U", "3D"],
        ["R", "L", "2R", "2L", "3R", "3L"],
        ["F", "B", "2F", "2B", "3F", "3B"],
      ],
      scramblerGlobals.cubesuff
    );
    scramblerGlobals.ss[0] += "<br> 3OH) ";
    scramblerGlobals.ss[0] += scramblers["333"].getRandomScramble();
    scramblerGlobals.ss[0] += "<br> 3FT) ";
    scramblerGlobals.ss[0] += scramblers["333"].getRandomScramble();
    scramblerGlobals.ss[0] += "<br> Pyra) ";
    scramblerGlobals.ss[0] += getpyraoptscramble(8);
    scramblerGlobals.ss[0] += "<br> Square-1) ";
    sq1_scramble(1);
    scramblerGlobals.ss[0] += "<br> Skewb) ";
    scramblerGlobals.ss[0] += getskewboptscramble(8);
    scramblerGlobals.ss[0] += "<br> Clock) ";
    for (var i = 0; i < 4; i++)
      scramblerGlobals.ss[0] +=
        "(" +
        (Math.floor(Math.random() * 12) - 5) +
        ", " +
        (Math.floor(Math.random() * 12) - 5) +
        ") / ";
    for (var i = 0; i < 6; i++)
      scramblerGlobals.ss[0] +=
        "(" + (Math.floor(Math.random() * 12) - 5) + ") / ";
    for (var i = 0; i < 4; i++) scramblerGlobals.ss[0] += rndEl(["d", "U"]);
    scramblerGlobals.ss[0] += "<br> Mega) ";
    pochscramble(10, Math.ceil(scramblerGlobals.len / 10));
  } else if (scramblerGlobals.type == "miniguild") {
    // Mini Guildford Challenge
    scramblerGlobals.ss[0] += "<br> 2x2x2) ";
    get2x2optscramble(9);
    scramblerGlobals.ss[0] += "<br> 3x3x3) ";
    scramblerGlobals.ss[0] += scramblers["333"].getRandomScramble();
    scramblerGlobals.ss[0] += "<br> 4x4x4) ";
    scramblerGlobals.len = 40;
    megascramble(
      [
        ["U", "D", "u"],
        ["R", "L", "r"],
        ["F", "B", "f"],
      ],
      scramblerGlobals.cubesuff
    );
    scramblerGlobals.ss[0] += "<br> 5x5x5) ";
    scramblerGlobals.len = 60;
    megascramble(
      [
        ["U", "D", "u", "d"],
        ["R", "L", "r", "l"],
        ["F", "B", "f", "b"],
      ],
      scramblerGlobals.cubesuff
    );
    scramblerGlobals.ss[0] += "<br> 3OH) ";
    scramblerGlobals.ss[0] += scramblers["333"].getRandomScramble();
    scramblerGlobals.ss[0] += "<br> Pyra) ";
    scramblerGlobals.ss[0] += getpyraoptscramble(8);
    scramblerGlobals.ss[0] += "<br> Square-1) ";
    sq1_scramble(1);
    scramblerGlobals.ss[0] += "<br> Skewb) ";
    scramblerGlobals.ss[0] += getskewboptscramble(8);
    scramblerGlobals.ss[0] += "<br> Clock) ";
    for (var i = 0; i < 4; i++)
      scramblerGlobals.ss[0] +=
        "(" +
        (Math.floor(Math.random() * 12) - 5) +
        ", " +
        (Math.floor(Math.random() * 12) - 5) +
        ") / ";
    for (var i = 0; i < 6; i++)
      scramblerGlobals.ss[0] +=
        "(" + (Math.floor(Math.random() * 12) - 5) + ") / ";
    for (var i = 0; i < 4; i++) scramblerGlobals.ss[0] += rndEl(["d", "U"]);
    scramblerGlobals.ss[0] += "<br> Mega) ";
    pochscramble(10, Math.ceil(scramblerGlobals.len / 10));
  } else if (scramblerGlobals.type == "r3") {
    // multiple 3x3x3 relay
    var ncubes = scramblerGlobals.len;
    scramblerGlobals.len = 25;
    for (var i = 0; i < ncubes; i++) {
      scramblerGlobals.ss[0] += "<br>" + (i + 1) + ") ";
      scramblerGlobals.ss[0] += scramblers["333"].getRandomScramble();
    }
    scramblerGlobals.len = ncubes;
  } else if (scramblerGlobals.type == "sia113") {
    // Siamese Cube (1x1x3 block)
    var n: number,
      s = [];
    megascramble(
      [
        ["U", "u"],
        ["R", "r"],
      ],
      scramblerGlobals.cubesuff
    );
    for (n = 0; n < scramblerGlobals.num; n++) {
      scramblerGlobals.ss[n] += " z2 ";
    }
    megascramble(
      [
        ["U", "u"],
        ["R", "r"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "sia123") {
    // Siamese Cube (1x2x3 block)
    var n: number,
      s = [];
    megascramble([["U"], ["R", "r"]], scramblerGlobals.cubesuff);
    for (n = 0; n < scramblerGlobals.num; n++) {
      scramblerGlobals.ss[n] += " z2 ";
    }
    megascramble([["U"], ["R", "r"]], scramblerGlobals.cubesuff);
  } else if (scramblerGlobals.type == "sia222") {
    // Siamese Cube (2x2x2 block)
    var n: number,
      s = [];
    megascramble([["U"], ["R"], ["F"]], scramblerGlobals.cubesuff);
    for (n = 0; n < scramblerGlobals.num; n++) {
      scramblerGlobals.ss[n] += " z2 y ";
    }
    megascramble([["U"], ["R"], ["F"]], scramblerGlobals.cubesuff);
  } else if (scramblerGlobals.type == "skb") {
    // Skewb
    megascramble([["R"], ["L"], ["B"], ["U"]], ["", "'"]);
  } else if (scramblerGlobals.type == "skbo") {
    // Skewb (optimal random state)
    scramblerGlobals.ss[0] += getskewboptscramble(0);
  } else if (scramblerGlobals.type == "skbso") {
    // Skewb (suboptimal random state)
    scramblerGlobals.ss[0] += getskewboptscramble(8);
  } else if (scramblerGlobals.type == "sq1h") {
    // Square-1 (turn metric)
    sq1_scramble(1);
  } else if (scramblerGlobals.type == "sq1t") {
    // Square-1 (twist metric)
    sq1_scramble(0);
  } else if (scramblerGlobals.type == "sq2") {
    // Square-2
    var i: number;
    for (var n = 0; n < scramblerGlobals.num; n++) {
      i = 0;
      while (i < scramblerGlobals.len) {
        var rndu = Math.floor(Math.random() * 12) - 5;
        var rndd = Math.floor(Math.random() * 12) - 5;
        if (rndu != 0 || rndd != 0) {
          i++;
          scramblerGlobals.ss[n] += "(" + rndu + "," + rndd + ") / ";
        }
      }
    }
  } else if (scramblerGlobals.type == "sfl") {
    // Super Floppy Cube
    megascramble(
      [
        ["R", "L"],
        ["U", "D"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "ssq1t") {
    // Super Square-1 (twist metric)
    ssq1t_scramble();
  } else if (scramblerGlobals.type == "ufo") {
    // UFO
    megascramble([["A"], ["B"], ["C"], [["U", "U'", "U2'", "U2", "U3"]]], [""]);
  } else if (scramblerGlobals.type == "2gen") {
    // 2-generator <R,U>
    megascramble([["U"], ["R"]], scramblerGlobals.cubesuff);
  } else if (scramblerGlobals.type == "2genl") {
    // 2-generator <L,U>
    megascramble([["U"], ["L"]], scramblerGlobals.cubesuff);
  } else if (scramblerGlobals.type == "roux") {
    // Roux-generator <M,U>
    megascramble([["U"], ["M"]], scramblerGlobals.cubesuff);
  } else if (scramblerGlobals.type == "3gen_F") {
    // 3-generator <F,R,U>
    megascramble([["U"], ["R"], ["F"]], scramblerGlobals.cubesuff);
  } else if (scramblerGlobals.type == "3gen_L") {
    // 3-generator <R,U,L>
    megascramble([["U"], ["R", "L"]], scramblerGlobals.cubesuff);
  } else if (scramblerGlobals.type == "RrU") {
    // 3-generator <R,r,U>
    megascramble([["U"], ["R", "r"]], scramblerGlobals.cubesuff);
  } else if (scramblerGlobals.type == "RrUu") {
    // <R,r,U,u>
    megascramble(
      [
        ["U", "u"],
        ["R", "r"],
      ],
      scramblerGlobals.cubesuff
    );
  } else if (scramblerGlobals.type == "minx2g") {
    // megaminx 2-gen
    megascramble([["U"], ["R"]], scramblerGlobals.minxsuff);
  } else if (scramblerGlobals.type == "mlsll") {
    // megaminx LSLL
    megascramble(
      [
        [["R U R'", "R U2 R'", "R U' R'", "R U2' R'"]],
        [["F' U F", "F' U2 F", "F' U' F", "F' U2' F"]],
        [["U", "U2", "U'", "U2'"]],
      ],
      [""]
    );
  } else if (scramblerGlobals.type == "bic") {
    // Bandaged Cube
    bicube();
  } else if (scramblerGlobals.type == "bsq") {
    // Bandaged Square-1 </,(1,0)>
    sq1_scramble(2);
  } else if (scramblerGlobals.type == "half") {
    // 3x3x3 half turns
    megascramble(
      [
        ["U", "D"],
        ["R", "L"],
        ["F", "B"],
      ],
      ["2"]
    );
  } else if (scramblerGlobals.type == "edges") {
    // 3x3x3 edges only
    scramblerGlobals.ss[0] = scramblers["333"].getEdgeScramble();
  } else if (scramblerGlobals.type == "corners") {
    // 3x3x3 corners only
    scramblerGlobals.ss[0] = scramblers["333"].getCornerScramble();
  } else if (scramblerGlobals.type == "ll") {
    // 3x3x3 last layer
    scramblerGlobals.ss[0] = scramblers["333"].getLLScramble();
  } else if (scramblerGlobals.type == "cmll") {
    // 3x3x3 cmll
    scramblerGlobals.ss[0] =
      rndEl(["", "M ", "M2 ", "M' "]) + scramblers["333"].getCMLLScramble();
  } else if (scramblerGlobals.type == "zbll") {
    // 3x3x3 zbll
    scramblerGlobals.ss[0] = scramblers["333"].getZBLLScramble();
  } else if (scramblerGlobals.type == "2gll") {
    // 3x3x3 2gll
    scramblerGlobals.ss[0] = scramblers["333"].get2GLLScramble();
  } else if (scramblerGlobals.type == "pll") {
    // 3x3x3 pll
    scramblerGlobals.ss[0] = scramblers["333"].getPLLScramble();
  } else if (scramblerGlobals.type == "lsll2") {
    // 3x3x3 last slot + last layer
    scramblerGlobals.ss[0] = scramblers["333"].getLSLLScramble();
  } else if (scramblerGlobals.type == "zzls") {
    // 3x3x3 ZZ last slot + last layer
    scramblerGlobals.ss[0] = scramblers["333"].getZZLSScramble();
  } else if (scramblerGlobals.type == "f2l") {
    // 3x3x3 f2l
    scramblerGlobals.ss[0] = scramblers["333"].getF2LScramble();
  } else if (scramblerGlobals.type == "lsll") {
    // 3x3x3 last slot + last layer (old)
    megascramble(
      [
        [["R U R'", "R U2 R'", "R U' R'"]],
        [["F' U F", "F' U2 F", "F' U' F"]],
        [["U", "U2", "U'"]],
      ],
      [""]
    );
  } else if (scramblerGlobals.type == "4edge") {
    // 4x4x4 edges
    edgescramble("r b2", ["b2 r'", "b2 U2 r U2 r U2 r U2 r"], ["u"]);
  } else if (scramblerGlobals.type == "5edge") {
    // 5x5x5 edges
    edgescramble(
      "r R b B",
      ["B' b' R' r'", "B' b' R' U2 r U2 r U2 r U2 r"],
      ["u", "d"]
    );
  } else if (scramblerGlobals.type == "6edge") {
    // 6x6x6 edges
    edgescramble(
      "3r r 3b b",
      [
        "3b' b' 3r' r'",
        "3b' b' 3r' U2 r U2 r U2 r U2 r",
        "3b' b' r' U2 3r U2 3r U2 3r U2 3r",
        "3b' b' r2 U2 3R U2 3R U2 3R U2 3R",
      ],
      ["u", "3u", "d"]
    );
  } else if (scramblerGlobals.type == "7edge") {
    // 7x7x7 edges
    edgescramble(
      "3r r 3b b",
      [
        "3b' b' 3r' r'",
        "3b' b' 3r' U2 r U2 r U2 r U2 r",
        "3b' b' r' U2 3r U2 3r U2 3r U2 3r",
        "3b' b' r2 U2 3R U2 3R U2 3R U2 3R",
      ],
      ["u", "3u", "3d", "d"]
    );
  } else if (scramblerGlobals.type == "-1") {
    // -1x-1x-1 (micro style)
    for (var n = 0; n < scramblerGlobals.num; n++) {
      for (var i = 0; i < scramblerGlobals.len; i++) {
        scramblerGlobals.ss[n] += String.fromCharCode(
          32 + Math.floor(Math.random() * 224)
        );
      }
      scramblerGlobals.ss[n] += "Error: subscript out of range";
    }
  } else if (scramblerGlobals.type == "112") {
    // 1x1x2
    megascramble([["R"], ["R"]], scramblerGlobals.cubesuff);
  } else if (scramblerGlobals.type == "2222") {
    // 2x2x2x2
    scramble2222(
      [
        ["R", "L"],
        ["I", "O"],
      ],
      ["", "y", "z"],
      ["", "y", "y'", "z", "z'", "z2"],
      ["", "x", "x'", "x2"]
    );
  } else if (scramblerGlobals.type == "333noob") {
    // 3x3x3 for noobs
    megascramble(
      [
        ["turn the top face", "turn the bottom face"],
        ["turn the right face", "turn the left face"],
        ["turn the front face", "turn the back face"],
      ],
      [
        " clockwise by 90 degrees,",
        " counterclockwise by 90 degrees,",
        " by 180 degrees,",
      ]
    );
    for (var n = 0; n < scramblerGlobals.num; n++) {
      scramblerGlobals.ss[n] = scramblerGlobals.ss[n].replace(/t/, "T");
      scramblerGlobals.ss[n] =
        scramblerGlobals.ss[n].substr(0, scramblerGlobals.ss[n].length - 2) +
        ".";
    }
  } else if (scramblerGlobals.type == "lol") {
    // LOL
    megascramble([["L"], ["O"]], [""]);
    for (var n = 0; n < scramblerGlobals.num; n++) {
      scramblerGlobals.ss[n] = scramblerGlobals.ss[n].replace(/ /g, "");
    }
  } else if (scramblerGlobals.type == "eide") {
    // Derrick Eide
    megascramble(
      [
        ["OMG"],
        ["WOW"],
        ["WTF"],
        [
          [
            "WOO-HOO",
            "WOO-HOO",
            "MATYAS",
            "YES",
            "YES",
            "YAY",
            "YEEEEEEEEEEEES",
          ],
        ],
        ["HAHA"],
        ["XD"],
        [":D"],
        ["LOL"],
      ],
      ["", "", "", "!!!"]
    );
  }
  scramblerGlobals.scramble = scramblerGlobals.ss[0];
  $("scramble").innerHTML = "scramble: " + scramblerGlobals.scramble + "&nbsp;";
}

// Clock functions.
function c(s) {
  var array = [
    s + "&nbsp;&nbsp;",
    s + "'&nbsp;",
    s + "2'",
    s + "3'",
    s + "4'",
    s + "5'",
    s + "6&nbsp;",
    s + "5&nbsp;",
    s + "4&nbsp;",
    s + "3&nbsp;",
    s + "2&nbsp;",
    "&nbsp;&nbsp;&nbsp;",
  ];
  return " </b>" + rndEl(array) + "<b>&nbsp;&nbsp; ";
}
function c2() {
  return rndEl(["U", "d"]) + rndEl(["U", "d"]);
}
function c3() {
  return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
}

function randomCubeOrientation() {
  const s =
    rndEl(["", "z", "z'", "x", "x'", "x2"]) + rndEl(["", " y", " y'", " y2"]);
  return s;
}

function edgescramble(start, end, moves) {
  var u = 0,
    d = 0,
    movemis = [];
  var triggers = [
    ["R", "R'"],
    ["R'", "R"],
    ["L", "L'"],
    ["L'", "L"],
    ["F'", "F"],
    ["F", "F'"],
    ["B", "B'"],
    ["B'", "B"],
  ];
  var ud = ["U", "D"];
  scramblerGlobals.ss[0] = start;
  // initialize move misalignments
  for (var i = 0; i < moves.length; i++) {
    movemis[i] = 0;
  }

  for (var i = 0; i < scramblerGlobals.len; i++) {
    // apply random moves
    var done = false;
    while (!done) {
      var v = "";
      for (var j = 0; j < moves.length; j++) {
        var x = Math.floor(Math.random() * 4);
        movemis[j] += x;
        if (x != 0) {
          done = true;
          v += " " + moves[j] + scramblerGlobals.cubesuff[x - 1];
        }
      }
    }
    scramblerGlobals.ss[0] += v;

    // apply random trigger, update U/D
    var trigger = Math.floor(Math.random() * 8);
    var layer = Math.floor(Math.random() * 2);
    var turn = Math.floor(Math.random() * 3);
    scramblerGlobals.ss[0] +=
      " " +
      triggers[trigger][0] +
      " " +
      ud[layer] +
      scramblerGlobals.cubesuff[turn] +
      " " +
      triggers[trigger][1];
    if (layer == 0) {
      u += turn + 1;
    }
    if (layer == 1) {
      d += turn + 1;
    }
  }

  // fix everything
  for (var i = 0; i < moves.length; i++) {
    var x = 4 - (movemis[i] % 4);
    if (x < 4) {
      scramblerGlobals.ss[0] +=
        " " + moves[i] + scramblerGlobals.cubesuff[x - 1];
    }
  }
  u = 4 - (u % 4);
  d = 4 - (d % 4);
  if (u < 4) {
    scramblerGlobals.ss[0] += " U" + scramblerGlobals.cubesuff[u - 1];
  }
  if (d < 4) {
    scramblerGlobals.ss[0] += " D" + scramblerGlobals.cubesuff[d - 1];
  }
  scramblerGlobals.ss[0] += " " + rndEl(end);
}

function do15puzzle(mirrored) {
  var moves = mirrored ? ["U", "L", "R", "D"] : ["D", "R", "L", "U"];
  var effect = [
    [0, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
  ];
  var x = 0,
    y = 3,
    k,
    done,
    r,
    lastr = 5;
  scramblerGlobals.ss[0] = "";
  for (k = 0; k < scramblerGlobals.len; k++) {
    done = false;
    while (!done) {
      r = Math.floor(Math.random() * 4);
      if (
        x + effect[r][0] >= 0 &&
        x + effect[r][0] <= 3 &&
        y + effect[r][1] >= 0 &&
        y + effect[r][1] <= 3 &&
        r + lastr != 3
      ) {
        done = true;
        x += effect[r][0];
        y += effect[r][1];
        scramblerGlobals.ss[0] += moves[r] + " ";
        lastr = r;
      }
    }
  }
}

function pochscramble(x, y, wca: boolean = false) {
  var i, j, n;
  for (n = 0; n < scramblerGlobals.num; n++) {
    for (i = 0; i < y; i++) {
      scramblerGlobals.ss[n] += "<br>&nbsp;&nbsp;";
      for (j = 0; j < x - (wca ? 1 : 0); j++) {
        scramblerGlobals.ss[n] +=
          (j % 2 == 0 ? "R" : "D") + rndEl(["++", "--"]) + " ";
      }
      if (wca) {
        scramblerGlobals.ss[n] += rndEl(["D++ U", "D-- U'"]);
      } else {
        scramblerGlobals.ss[n] += "U" + rndEl(["'", " "]);
      }
    }
  }
}

function carrotminx(x, y) {
  var i, j, n;
  for (n = 0; n < scramblerGlobals.num; n++) {
    for (i = 0; i < y; i++) {
      scramblerGlobals.ss[n] += "<br>&nbsp;&nbsp;";
      for (j = 0; j < x / 2; j++) {
        scramblerGlobals.ss[n] += rndEl(["+", "-"]) + rndEl(["+", "-"]) + " ";
      }
      scramblerGlobals.ss[n] += "U" + rndEl(["'", " "]);
    }
  }
}

function gigascramble() {
  var i, j, n;
  for (n = 0; n < scramblerGlobals.num; n++) {
    for (i = 0; i < Math.ceil(scramblerGlobals.len / 10); i++) {
      scramblerGlobals.ss[n] += "<br>&nbsp;&nbsp;";
      for (j = 0; j < 10; j++) {
        scramblerGlobals.ss[n] +=
          (j % 2 == 0
            ? Math.random() > 0.5
              ? "R"
              : "r"
            : Math.random() > 0.5
            ? "D"
            : "d") +
          rndEl(["+", "++", "-", "--"]) +
          " ";
      }
      scramblerGlobals.ss[n] += "y" + rndEl(scramblerGlobals.minxsuff);
    }
  }
}

function oldminxscramble() {
  var i, j, k;
  var faces = [
    "F",
    "B",
    "U",
    "D",
    "L",
    "DBR",
    "DL",
    "BR",
    "DR",
    "BL",
    "R",
    "DBL",
  ];
  var used = [];
  // adjacency table
  var adj = [
    "001010101010",
    "000101010101",
    "100010010110",
    "010001101001",
    "101000100101",
    "010100011010",
    "100110001001",
    "011001000110",
    "100101100010",
    "011010010001",
    "101001011000",
    "010110100100",
  ];
  // now generate the scramble(s)
  for (i = 0; i < scramblerGlobals.num; i++) {
    var s = "";
    for (j = 0; j < 12; j++) {
      used[j] = 0;
    }
    for (j = 0; j < scramblerGlobals.len; j++) {
      var done = false;
      do {
        var face = Math.floor(Math.random() * 12);
        if (used[face] == 0) {
          s += faces[face] + rndEl(scramblerGlobals.minxsuff) + " ";
          for (k = 0; k < 12; k++) {
            if (adj[face].charAt(k) == "1") {
              used[k] = 0;
            }
          }
          used[face] = 1;
          done = true;
        }
      } while (!done);
    }
    scramblerGlobals.ss[i] += s;
  }
}

function bicube() {
  function canMove(face) {
    var u = [],
      i,
      j,
      done,
      z = 0;
    for (i = 0; i < 9; i++) {
      done = 0;
      for (j = 0; j < u.length; j++) {
        if (u[j] == start[d[face][i]]) done = 1;
      }
      if (done == 0) {
        u[u.length] = start[d[face][i]];
        if (start[d[face][i]] == 0) z = 1;
      }
    }
    return u.length == 5 && z == 1;
  }

  function doMove(face, amount) {
    for (var i = 0; i < amount; i++) {
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

  var d = [
    [0, 1, 2, 5, 8, 7, 6, 3, 4],
    [6, 7, 8, 13, 20, 19, 18, 11, 12],
    [0, 3, 6, 11, 18, 17, 16, 9, 10],
    [8, 5, 2, 15, 22, 21, 20, 13, 14],
  ];
  var start = [
      1,
      1,
      2,
      3,
      3,
      2,
      4,
      4,
      0,
      5,
      6,
      7,
      8,
      9,
      10,
      10,
      5,
      6,
      7,
      8,
      9,
      11,
      11,
    ],
    move = "UFLR",
    s = "",
    arr = [],
    poss,
    done,
    i,
    j,
    x,
    y;
  while (arr.length < scramblerGlobals.len) {
    poss = [1, 1, 1, 1];
    for (j = 0; j < 4; j++) {
      if (poss[j] == 1 && !canMove(j)) poss[j] = 0;
    }
    done = 0;
    while (done == 0) {
      x = 0 | (Math.random() * 4);
      if (poss[x] == 1) {
        y = (0 | (Math.random() * 3)) + 1;
        doMove(x, y);
        done = 1;
      }
    }
    arr[arr.length] = [x, y];
    if (arr.length >= 2) {
      if (arr[arr.length - 1][0] == arr[arr.length - 2][0]) {
        arr[arr.length - 2][1] =
          (arr[arr.length - 2][1] + arr[arr.length - 1][1]) % 4;
        arr = arr.slice(0, arr.length - 1);
      }
    }
    if (arr.length >= 1) {
      if (arr[arr.length - 1][1] == 0) {
        arr = arr.slice(0, arr.length - 1);
      }
    }
  }
  for (i = 0; i < scramblerGlobals.len; i++) {
    s += move[arr[i][0]] + scramblerGlobals.cubesuff[arr[i][1] - 1] + " ";
  }
  scramblerGlobals.ss[0] += s;
}

function yj4x4() {
  // the idea is to keep the fixed center on U and do Rw or Lw, Fw or Bw, to not disturb it
  const turns = [
    ["U", "D"],
    ["R", "L", "r"],
    ["F", "B", "f"],
  ];
  var donemoves = [];
  var lastaxis;
  var fpos = 0; // 0 = Ufr, 1 = Ufl, 2 = Ubl, 3 = Ubr
  var i = 0,
    j,
    k;
  var s = "";
  lastaxis = -1;
  for (j = 0; j < scramblerGlobals.len; j++) {
    var done = 0;
    do {
      var first = Math.floor(Math.random() * turns.length);
      var second = Math.floor(Math.random() * turns[first].length);
      if (first != lastaxis || donemoves[second] == 0) {
        if (first == lastaxis) {
          donemoves[second] = 1;
          var rs = Math.floor(Math.random() * scramblerGlobals.cubesuff.length);
          if (first == 0 && second == 0) {
            fpos = (fpos + 4 + rs) % 4;
          }
          if (first == 1 && second == 2) {
            // r or l
            if (fpos == 0 || fpos == 3)
              s += "l" + scramblerGlobals.cubesuff[rs] + " ";
            else s += "r" + scramblerGlobals.cubesuff[rs] + " ";
          } else if (first == 2 && second == 2) {
            // f or b
            if (fpos == 0 || fpos == 1)
              s += "b" + scramblerGlobals.cubesuff[rs] + " ";
            else s += "f" + scramblerGlobals.cubesuff[rs] + " ";
          } else {
            s += turns[first][second] + scramblerGlobals.cubesuff[rs] + " ";
          }
        } else {
          for (k = 0; k < turns[first].length; k++) {
            donemoves[k] = 0;
          }
          lastaxis = first;
          donemoves[second] = 1;
          var rs = Math.floor(Math.random() * scramblerGlobals.cubesuff.length);
          if (first == 0 && second == 0) {
            fpos = (fpos + 4 + rs) % 4;
          }
          if (first == 1 && second == 2) {
            // r or l
            if (fpos == 0 || fpos == 3)
              s += "l" + scramblerGlobals.cubesuff[rs] + " ";
            else s += "r" + scramblerGlobals.cubesuff[rs] + " ";
          } else if (first == 2 && second == 2) {
            // f or b
            if (fpos == 0 || fpos == 1)
              s += "b" + scramblerGlobals.cubesuff[rs] + " ";
            else s += "f" + scramblerGlobals.cubesuff[rs] + " ";
          } else {
            s += turns[first][second] + scramblerGlobals.cubesuff[rs] + " ";
          }
        }
        done = 1;
      }
    } while (done == 0);
  }
  scramblerGlobals.ss[i] += s;
}

function helicubescramble() {
  var i, j, k;
  var faces = [
    "UF",
    "UR",
    "UB",
    "UL",
    "FR",
    "BR",
    "BL",
    "FL",
    "DF",
    "DR",
    "DB",
    "DL",
  ];
  var used = [];
  // adjacency table
  var adj = [
    "010110010000",
    "101011000000",
    "010101100000",
    "101000110000",
    "110000001100",
    "011000000110",
    "001100000011",
    "100100001001",
    "000010010101",
    "000011001010",
    "000001100101",
    "000000111010",
  ];
  // now generate the scramble(s)
  for (i = 0; i < scramblerGlobals.num; i++) {
    var s = "";
    for (j = 0; j < 12; j++) {
      used[j] = 0;
    }
    for (j = 0; j < scramblerGlobals.len; j++) {
      var done = false;
      do {
        var face = Math.floor(Math.random() * 12);
        if (used[face] == 0) {
          s += faces[face] + " ";
          for (k = 0; k < 12; k++) {
            if (adj[face].charAt(k) == "1") {
              used[k] = 0;
            }
          }
          used[face] = 1;
          done = true;
        }
      } while (!done);
    }
    scramblerGlobals.ss[i] += s;
  }
}

// Function written by Tom van der Zanden/Jaap Scherphuis and optimized/obfuscated/condensed by me
function get2x2optscramble(mn) {
  var e = [
      15,
      16,
      16,
      21,
      21,
      15,
      13,
      9,
      9,
      17,
      17,
      13,
      14,
      20,
      20,
      4,
      4,
      14,
      12,
      5,
      5,
      8,
      8,
      12,
      3,
      23,
      23,
      18,
      18,
      3,
      1,
      19,
      19,
      11,
      11,
      1,
      2,
      6,
      6,
      22,
      22,
      2,
      0,
      10,
      10,
      7,
      7,
      0,
    ],
    d = [[], [], [], [], [], []],
    v = [
      [0, 2, 3, 1, 23, 19, 10, 6, 22, 18, 11, 7],
      [4, 6, 7, 5, 12, 20, 2, 10, 14, 22, 0, 8],
      [8, 10, 11, 9, 12, 7, 1, 17, 13, 5, 0, 19],
      [12, 13, 15, 14, 8, 17, 21, 4, 9, 16, 20, 5],
      [16, 17, 19, 18, 15, 9, 1, 23, 13, 11, 3, 21],
      [20, 21, 23, 22, 14, 16, 3, 6, 15, 18, 2, 4],
    ],
    r = [],
    a = [],
    b = [],
    c = [],
    f = [],
    s = [];
  function t() {
    s = [
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      5,
      5,
      5,
      5,
      4,
      4,
      4,
      4,
      3,
      3,
      3,
      3,
      0,
      0,
      0,
      0,
    ];
  }
  t();
  function mx() {
    t();
    for (var i = 0; i < 500; i++)
      dm(
        Math.floor(Math.random() * 3 + 3) + 16 * Math.floor(Math.random() * 3)
      );
  }
  function cj() {
    var i, j;
    for (i = 0; i < 6; i++) for (j = 0; j < 6; j++) d[i][j] = 0;
    for (i = 0; i < 48; i += 2)
      if (s[e[i]] <= 5 && s[e[i + 1]] <= 5) d[s[e[i]]][s[e[i + 1]]]++;
  }
  function dm(m) {
    var j = 1 + (m >> 4),
      k = m & 15,
      i;
    while (j) {
      for (i = 0; i < v[k].length; i += 4)
        y(s, v[k][i], v[k][i + 3], v[k][i + 2], v[k][i + 1]);
      j--;
    }
  }
  function sv() {
    cj();
    var h = [],
      w = [],
      i = 0,
      j,
      k,
      m;
    for (j = 0; j < 7; j++) {
      m = 0;
      for (k = i; k < i + 6; k += 2) {
        if (s[e[k]] == s[e[42]]) m += 4;
        if (s[e[k]] == s[e[44]]) m += 1;
        if (s[e[k]] == s[e[46]]) m += 2;
      }
      h[j] = m;
      if (s[e[i]] == s[e[42]] || s[e[i]] == 5 - s[e[42]]) w[j] = 0;
      else if (s[e[i + 2]] == s[e[42]] || s[e[i + 2]] == 5 - s[e[42]]) w[j] = 1;
      else w[j] = 2;
      i += 6;
    }
    m = 0;
    for (i = 0; i < 7; i++) {
      j = 0;
      for (k = 0; k < 7; k++) {
        if (h[k] == i) break;
        if (h[k] > i) j++;
      }
      m = m * (7 - i) + j;
    }
    j = 0;
    for (i = 5; i >= 0; i--) j = j * 3 + w[i] - 3 * Math.floor(w[i] / 3);
    if (m != 0 || j != 0) {
      r.length = 0;
      for (k = mn; k < 99; k++) if (se(0, m, j, k, -1)) break;
      j = "";
      for (m = 0; m < r.length; m++)
        j = "URF".charAt(r[m] / 10) + "'2 ".charAt(r[m] % 10) + " " + j;
      return j;
    }
  }
  function se(i, j, k, l, m) {
    if (l != 0) {
      if (a[j] > l || b[k] > l) return false;
      var o, p, q, n;
      for (n = 0; n < 3; n++)
        if (n != m) {
          o = j;
          p = k;
          for (q = 0; q < 3; q++) {
            o = c[o][n];
            p = f[p][n];
            r[i] = 10 * n + q;
            if (se(i + 1, o, p, l - 1, n)) return true;
          }
        }
    } else if (j == 0 && k == 0) return true;
    return false;
  }
  function z() {
    var i, j, k, m, n;
    for (i = 0; i < 5040; i++) {
      a[i] = -1;
      c[i] = [];
      for (j = 0; j < 3; j++) c[i][j] = g(i, j);
    }
    a[0] = 0;
    for (i = 0; i <= 6; i++)
      for (j = 0; j < 5040; j++)
        if (a[j] == i)
          for (k = 0; k < 3; k++) {
            m = j;
            for (n = 0; n < 3; n++) {
              var m = c[m][k];
              if (a[m] == -1) a[m] = i + 1;
            }
          }
    for (i = 0; i < 729; i++) {
      b[i] = -1;
      f[i] = [];
      for (j = 0; j < 3; j++) f[i][j] = w(i, j);
    }
    b[0] = 0;
    for (i = 0; i <= 5; i++)
      for (j = 0; j < 729; j++)
        if (b[j] == i)
          for (k = 0; k < 3; k++) {
            m = j;
            for (n = 0; n < 3; n++) {
              var m = f[m][k];
              if (b[m] == -1) b[m] = i + 1;
            }
          }
  }
  function g(i, j) {
    var k,
      m,
      n,
      o = i,
      h = [];
    for (k = 1; k <= 7; k++) {
      m = o % k;
      o = (o - m) / k;
      for (n = k - 1; n >= m; n--) h[n + 1] = h[n];
      h[m] = 7 - k;
    }
    if (j == 0) y(h, 0, 1, 3, 2);
    else if (j == 1) y(h, 0, 4, 5, 1);
    else if (j == 2) y(h, 0, 2, 6, 4);
    o = 0;
    for (k = 0; k < 7; k++) {
      m = 0;
      for (n = 0; n < 7; n++) {
        if (h[n] == k) break;
        if (h[n] > k) m++;
      }
      o = o * (7 - k) + m;
    }
    return o;
  }
  function w(i, j) {
    var k,
      m,
      n,
      o = 0,
      p = i,
      h = [];
    for (k = 0; k <= 5; k++) {
      n = Math.floor(p / 3);
      m = p - 3 * n;
      p = n;
      h[k] = m;
      o -= m;
      if (o < 0) o += 3;
    }
    h[6] = o;
    if (j == 0) y(h, 0, 1, 3, 2);
    else if (j == 1) {
      y(h, 0, 4, 5, 1);
      h[0] += 2;
      h[1]++;
      h[5] += 2;
      h[4]++;
    } else if (j == 2) {
      y(h, 0, 2, 6, 4);
      h[2] += 2;
      h[0]++;
      h[4] += 2;
      h[6]++;
    }
    p = 0;
    for (k = 5; k >= 0; k--) p = p * 3 + (h[k] % 3);
    return p;
  }
  function y(i, j, k, m, n) {
    var o = i[j];
    i[j] = i[k];
    i[k] = i[m];
    i[m] = i[n];
    i[n] = o;
  }
  z();
  for (var i = 0; i < scramblerGlobals.num; i++) {
    mx();
    scramblerGlobals.ss[i] += sv();
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
function scramble2222(turnpairs, suffix_a, suffix_b, suffix_x) {
  var j;
  var s = "";
  for (j = 0; j < scramblerGlobals.len; j++) {
    var whichpair = j % 2;
    var whichorder = Math.random() < 0.5;
    do {
      var i_a = Math.floor(Math.random() * suffix_a.length);
      var i_b = Math.floor(Math.random() * suffix_b.length);
      var i_x = Math.floor(Math.random() * suffix_x.length);
    } while (i_a == 0 && i_b == 0 && i_x == 0); // dividend is 71 not 72
    var a = suffix_a[i_a];
    var b = suffix_b[i_b];
    var x = suffix_x[i_x];

    // optional:  streamline many combinations containing either z2 or x2
    // s += "("+a+" "+b+" "+x+")"; // uncomment to see what is shortened to what
    function inv(mv) {
      if (mv == "x") return "x'";
      else if (mv == "x'") return "x";
      else if (mv == "y") return "y'";
      else if (mv == "y'") return "y";
      else if (mv == "z") return "z'";
      else if (mv == "z'") return "z";
      else return "<oops>";
    }
    if (a == "z" && b == "z2") {
      a = inv(a);
      b = "";
    }
    if (x == "x2") {
      if (b == "z2") {
        b = "y2";
        x = "";
        if (a == "y") {
          a = inv(a);
          b = "";
        }
      }
    }

    if (x == "x2" && a != "" && b != "") {
      // x2 is in combination with a z and a y
      if (
        ((a == "z" || a == "z'") && (b == "y" || b == "y'")) ||
        ((a == "y" || a == "y'") && (b == "z" || b == "z'"))
      ) {
        a = inv(a);
        b = inv(b);
        x = "";
      }
    }
    if (b == "z2" && a != "" && x != "") {
      // z2 is in combination with an x and a y
      if (a == "y" || a == "y'") {
        a = inv(a);
        b = "";
        x = inv(x);
      }
    }
    // End of optional streamlining (saves another 10% of moves)

    // mix the x twists in with a (or b, if it's the only empty one)
    if (a == "" || b != "") a += x;
    else b += x;

    if (a == "") a = "."; // let's use a dot to indicate no twist, to keep the RLIO lockstep visually clear
    if (b == "") b = ".";

    s += turnpairs[whichpair][0];
    if (whichorder) s += a;
    else s += b;
    s += " ";
    s += turnpairs[whichpair][1];
    if (whichorder) s += b;
    else s += a;
    s += " ";
  }
  scramblerGlobals.ss[0] += s;
}
