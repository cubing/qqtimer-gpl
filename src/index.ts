import { optionsWindowGlobals } from "./controller-ish/options";
import { rescramble, rescramble2 } from "./controller-ish/rescramble";
import { stopTimer } from "./controller-ish/timing";
import { initialize, qqtimerWindowGlobals } from "./legacy/qqtimer";
import { statsWindowGlobals } from "./legacy/stats";

for (const [name, fn] of Object.entries(qqtimerWindowGlobals)) {
  globalThis[name] = fn;
}

for (const [name, fn] of Object.entries(statsWindowGlobals)) {
  globalThis[name] = fn;
}

for (const [name, fn] of Object.entries(optionsWindowGlobals)) {
  globalThis[name] = fn;
}

globalThis["stopTimer"] = stopTimer;
globalThis["rescramble"] = rescramble;
globalThis["rescramble2"] = rescramble2;

document.addEventListener("DOMContentLoaded", () => {
  initialize(true, true);
});
