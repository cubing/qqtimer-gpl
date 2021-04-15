import { qqtimerWindowGlobals, initialize } from "./legacy/qqtimer";
import { statsWindowGlobals } from "./legacy/stats";

for (const [name, fn] of Object.entries(qqtimerWindowGlobals)) {
  globalThis[name] = fn;
}

for (const [name, fn] of Object.entries(statsWindowGlobals)) {
  globalThis[name] = fn;
}

document.addEventListener("DOMContentLoaded", () => {
  initialize(true, true);
});
