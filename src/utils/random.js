export function createRandomCharacters(length, lowercase) {
  let str = "";
  for (let i = 0; i < length; i++) {
    if (parseInt((Math.random() * 2).toString(), 10)) {
      let num = Math.random() * 26 + 65;
      str += String.fromCharCode(num);
    } else {
      let num = Math.random() * 26 + 97;
      str += String.fromCharCode(num);
    }
  }
  if (lowercase) {
    return str.toLowerCase();
  } else {
    return str;
  }
}

export function createRandomNumbers(length) {
  let number= "";
  for(let i=0; i<length; i++){
    number += Math.floor(Math.random() * 10);
  }
  return number;
}
