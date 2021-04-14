import { globals, initialize } from "./qqtimer";

for (const [name, fn] of Object.entries(globals)) {
  globalThis[name] = fn;
}

document.addEventListener("DOMContentLoaded", () => {
  initialize(true, true);
})

