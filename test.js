const roundDownTo = roundTo => x => Math.floor(x / roundTo) * roundTo;
  const roundDownTo5Minutes = roundDownTo(1000 * 60 * 5);
  const now = new Date();
  const msDown = roundDownTo5Minutes(now);
  let string = msDown.toString() + "/adila/password";
  var encoded = btoa(string);
  console.log(encoded);
var decodedString = atob(encoded);
console.log("clear: " + decodedString);