import { qqtimerWindowGlobals, initialize } from "./qqtimer";
import { statsWindowGlobals } from "./stats";

for (const [name, fn] of Object.entries(qqtimerWindowGlobals)) {
  globalThis[name] = fn;
}

for (const [name, fn] of Object.entries(statsWindowGlobals)) {
  globalThis[name] = fn;
}

document.addEventListener("DOMContentLoaded", () => {
  initialize(true, true);
});
