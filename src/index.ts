import { optionsWindowGlobals } from "./legacy/options";
import { qqtimerWindowGlobals, initialize } from "./legacy/qqtimer";
import { statsWindowGlobals } from "./legacy/stats";
import { stopTimer } from "./legacy/timing";
import { toggleImport } from "./dom";

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
globalThis["toggleImport"] = toggleImport;

document.addEventListener("DOMContentLoaded", () => {
  initialize(true, true);
});
