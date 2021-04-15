// @ts-ignore (`url:` is a Parcel-ism)
import style0 from "url:./style0.css";
// @ts-ignore (`url:` is a Parcel-ism)
import style1 from "url:./style1.css";
import { globals } from "../globals";

export function setStyle(style: "0" | "1"): void {
  const styleSource = style === "0" ? style0 : style1;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = styleSource;
  document.body.appendChild(link);
}

export function $<T extends HTMLElement>(str: string): T {
  return document.getElementById(str) as T;
}

export function toggleImport() {
  if ($("import").style.display == "block") {
    $("import").style.display = "none";
    globals.options.importFocus = 0;
  } else {
    $("import").style.display = "block";
    globals.options.importFocus = 1;
  }
}
