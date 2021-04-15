class MainGlobalVars {
  startTime: Date | undefined;
  curTime: Date | undefined;
  inspectionTime: Date | undefined;
  timerStatus: 0 | 1 | 2 | 3 | 4; // 0 = stopped, 1 = running, 2 = inspecting, 3 = waiting, 4 = memo
  times: number[] = [];
  notes: (0 | 1 | 2)[] = [];
  comments: string[] = [];
  scrambleArr: string[] = [];
  // importScrambles = []; // TODO: Remove
  timerID: number;
  inspectionID: number;
  memoID: number;
  timerupdate = 1;
  highlightStart: number;
  highlightStop: number;
  highlightID: number;
  // sessionID = 0; // TODO: Remove
  nightMode = false;

  // Missing values
  memoTime: Date; // TODO: why was this missing from the original?
  useMoN: number;
  useMono: number;
}

class StatsGlobalVars {
  avgSizes;
  bestAvg;
  lastAvg;
  bestAvgIndex;
  bestTime;
  bestTimeIndex;
  worstTime;
  worstTimeIndex;
  moSize;
  bestMo;
  lastMo;
  bestMoIndex;
}

class OptionsGlobalVars {
  useMilli = 0;
  manualEnter = 0;
  showOptions = 0;
  timerSize = 2;
  scrambleSize = 16;
  inspection = 0;
  useBld = 0;
  penalty = 0;
  useAvgN = 0;
  viewstats = 1;
  importFocus = 0;
  typingFocus = false;
  validColors = [
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
  highlightColor;
}

export const globals = {
  main: new MainGlobalVars(),
  stats: new StatsGlobalVars(),
  options: new OptionsGlobalVars(),
};
