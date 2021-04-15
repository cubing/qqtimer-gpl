import { windowGlobals, initialize } from "./qqtimer";

for (const [name, fn] of Object.entries(windowGlobals)) {
  globalThis[name] = fn;
}

document.addEventListener("DOMContentLoaded", () => {
  initialize(true, true);
});
