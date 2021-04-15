import { $ } from "../dom";
import {
  getLen,
  getScrambleType,
  scrambleIt,
  scrdata,
  setLen,
  setScrambleType,
} from "../scramble";
import { setCookie } from "./cookies";

export function rescramble(scramble) {
  var obj = $<HTMLSelectElement>("optbox");
  var obj2 = $<HTMLSelectElement>("optbox2");

  var box2 = scrdata[obj.selectedIndex][1];
  for (var i = obj2.options.length - 1; i > 0; i--) obj2.remove(i);
  for (var i = 0; i < box2.length; i++)
    obj2.options[i] = new Option(box2[i][0], box2[i][1]);
  setLen(box2[0][2]);
  $<HTMLInputElement>("leng").value = getLen().toString();
  setScrambleType(box2[0][1]);
  if (scramble) {
    setCookie("scrType", getScrambleType());
    scrambleIt();
    $("getlast").innerHTML = "get last scramble";
  }
}

export function rescramble2() {
  var obj = $<HTMLSelectElement>("optbox");
  var obj2 = $<HTMLSelectElement>("optbox2");
  var newType = obj2.options[obj2.selectedIndex].value;

  var box2 = scrdata[obj.selectedIndex][1];
  setLen(box2[obj2.selectedIndex][2]);
  $<HTMLInputElement>("leng").value = getLen().toString();
  setScrambleType(newType);
  setCookie("scrType", getScrambleType());

  scrambleIt();
  $("getlast").innerHTML = "get last scramble";
}

export function rescramble3() {
  setLen(parseInt($<HTMLInputElement>("leng").value));
  scrambleIt();
  $("getlast").innerHTML = "get last scramble";
}
