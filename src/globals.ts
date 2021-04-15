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

const globalVars = {
  main: new MainGlobalVars(),
};
