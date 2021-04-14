// data for all scramblers
export const scrdata: [string, [string, string, number][]][] = [
  ["===WCA PUZZLES===", [["--", "blank", 0]]],
  [
    "2x2x2",
    [
      ["random state", "222so", 11],
      ["optimal random state", "222o", 0],
      ["3-gen", "2223", 25],
      ["6-gen", "2226", 25],
    ],
  ],
  [
    "3x3x3",
    [
      ["random state", "333", 0],
      ["random state + orientation", "333ori", 0],
      ["old style", "333o", 25],
    ],
  ],
  [
    "4x4x4",
    [
      ["WCA", "444wca", 40],
      ["SiGN", "444", 40],
      ["YJ (place fixed center on Urf)", "444yj", 40],
    ],
  ],
  [
    "5x5x5",
    [
      ["WCA", "555wca", 60],
      ["SiGN", "555", 60],
    ],
  ],
  [
    "6x6x6",
    [
      ["WCA", "666wca", 80],
      ["SiGN", "666si", 80],
      ["prefix", "666p", 80],
      ["suffix", "666s", 80],
    ],
  ],
  [
    "7x7x7",
    [
      ["WCA", "777wca", 100],
      ["SiGN", "777si", 100],
      ["prefix", "777p", 100],
      ["suffix", "777s", 100],
    ],
  ],
  [
    "Clock",
    [
      ["WCA", "clkwca", 0],
      ["Jaap order", "clk", 0],
      ["concise", "clkc", 0],
      ["efficient pin order", "clke", 0],
    ],
  ],
  [
    "Megaminx",
    [
      ["WCA", "mgmwca", 70],
      ["Carrot", "mgmc", 70],
      ["Pochmann+", "mgmp", 70],
      ["old style", "mgmo", 70],
    ],
  ],
  [
    "Pyraminx",
    [
      ["random state", "pyrso", 11],
      ["optimal random state", "pyro", 0],
      ["random moves", "pyrm", 25],
    ],
  ],
  [
    "Skewb",
    [
      ["random state", "skbso", 11],
      ["optimal random state", "skbo", 0],
      ["U L R B", "skb", 25],
    ],
  ],
  [
    "Square-1",
    [
      ["random state", "sqrs", 0],
      ["face turn metric", "sq1h", 40],
      ["twist metric", "sq1t", 20],
    ],
  ],
  ["===OTHER PUZZLES===", [["--", "blank", 0]]],
  [
    "8 puzzle",
    [
      ["random state (fast)", "8puzso", 0],
      ["optimal random state", "8puzo", 0],
    ],
  ],
  [
    "15 puzzle",
    [
      ["random state (fast)", "15puzso", 0],
      ["random state (efficient)", "15puzsoe", 0],
      ["random moves", "15p", 80],
    ],
  ],
  ["24 puzzle", [["random state (fast)", "24puzso", 0]]],
  ["1x3x3 (Floppy Cube)", [["U D L R", "flp", 25]]],
  ["2x3x3 (Domino)", [[" ", "223", 25]]],
  ["3x3x4", [[" ", "334", 40]]],
  ["3x3x5", [["shapeshifting", "335", 25]]],
  ["3x3x6", [[" ", "336", 40]]],
  ["3x3x7", [["shapeshifting", "337", 40]]],
  ["4x4x6", [[" ", "446", 40]]],
  ["8x8x8", [["SiGN", "888", 120]]],
  ["9x9x9", [["SiGN", "999", 120]]],
  ["10x10x10", [["SiGN", "101010", 120]]],
  ["11x11x11", [["SiGN", "111111", 120]]],
  ["Cmetrick", [[" ", "cm3", 25]]],
  ["Cmetrick Mini", [[" ", "cm2", 25]]],
  ["Domino (2x3x3)", [[" ", "223", 25]]],
  ["Floppy Cube (1x3x3)", [["U D L R", "flp", 25]]],
  ["FTO (Face-Turning Octahedron)", [[" ", "fto", 25]]],
  ["Gigaminx", [["Pochmann", "giga", 300]]],
  ["Helicopter Cube", [[" ", "heli", 40]]],
  [
    "Pyraminx Crystal",
    [
      ["Pochmann", "prcp", 70],
      ["old style", "prco", 70],
    ],
  ],
  ["Siamese Cube (1x1x3 block)", [[" ", "sia113", 25]]],
  ["Siamese Cube (1x2x3 block)", [[" ", "sia123", 25]]],
  ["Siamese Cube (2x2x2 block)", [[" ", "sia222", 25]]],
  ["Square-2", [[" ", "sq2", 20]]],
  ["Super Floppy Cube", [[" ", "sfl", 25]]],
  ["Super Square-1", [["twist metric", "ssq1t", 20]]],
  ["UFO", [["Jaap style", "ufo", 25]]],
  ["===SPECIALTY SCRAMBLES===", [["--", "blank", 0]]],
  ["2x2x2x2", [["real cube", "2222", 20]]],
  [
    "3x3x3 subsets",
    [
      ["2-generator <R,U>", "2gen", 25],
      ["2-generator <L,U>", "2genl", 25],
      ["Roux-generator <M,U>", "roux", 25],
      ["3-generator <F,R,U>", "3gen_F", 25],
      ["3-generator <R,U,L>", "3gen_L", 25],
      ["3-generator <R,r,U>", "RrU", 25],
      ["half turns only", "half", 25],
      ["edges only", "edges", 0],
      ["corners only", "corners", 0],
      ["last layer", "ll", 0],
      ["CMLL+LSE", "cmll", 0],
      ["last slot + last layer", "lsll2", 0],
      ["ZBLL", "zbll", 0],
      ["2GLL", "2gll", 0],
      ["PLL", "pll", 0],
      ["ZZ last slot + last layer", "zzls", 0],
      ["F2L", "f2l", 0],
      ["last slot + last layer (old)", "lsll", 15],
    ],
  ],
  ["Bandaged Cube (Bicube)", [["", "bic", 30]]],
  ["Bandaged Square-1 </,(1,0)>", [["twist metric", "bsq", 25]]],
  [
    "Bigcube subsets",
    [
      ["<R,r,U,u>", "RrUu", 40],
      ["4x4x4 edges", "4edge", 8],
      ["5x5x5 edges", "5edge", 8],
      ["6x6x6 edges", "6edge", 8],
      ["7x7x7 edges", "7edge", 8],
    ],
  ],
  [
    "Megaminx subsets",
    [
      ["2-generator <R,U>", "minx2g", 30],
      ["last slot + last layer", "mlsll", 20],
    ],
  ],
  [
    "Relays",
    [
      ["lots of 3x3x3s", "r3", 5],
      ["234 relay", "r234", 0],
      ["2345 relay", "r2345", 0],
      ["23456 relay", "r23456", 0],
      ["234567 relay", "r234567", 0],
      ["Guildford Challenge", "guildford", 0],
      ["Mini Guildford Challenge", "miniguild", 0],
    ],
  ],
  ["===JOKE SCRAMBLES===", [["--", "blank", 0]]],
  ["1x1x1", [["x y z", "111", 25]]],
  ["-1x-1x-1 (micro style)", [[" ", "-1", 25]]],
  ["1x1x2", [[" ", "112", 25]]],
  ["3x3x3 for noobs", [[" ", "333noob", 25]]],
  ["LOL", [[" ", "lol", 25]]],
  ["Derrick Eide", [[" ", "eide", 25]]],
];
