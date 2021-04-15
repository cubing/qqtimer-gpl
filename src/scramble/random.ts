// Takes a random element of the array x.
export function rndEl(x) {
  // TODO: replace with `random-uint-below`
  return x[Math.floor(Math.random() * x.length)];
}
