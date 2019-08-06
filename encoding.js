function decode(p) {
  if (p == 'a') {
    return color1;
  } else if (p == 'b') {
    return color2;
  } else if (p == 'c') {
    return color3;
  } else if (p == 'd') {
    return color4;
  } else if (p == 'e') {
    return color5;
  } else if (p == 'f') {
    return color6;
  } else {
    return bg;
  }
}

function encode(p) {
  if (p == '201, 33, 33') { //red
    return 'a';
  } else if (p == '33, 33, 201') { // blue
    return 'b';
  } else if (p == '255, 255, 255') { // white
    return 'c';
  } else if (p == '120, 120, 120') { // grey
    return 'd';
  } else if (p == '251, 190, 44') { // gold
    return 'e';
  } else if (p == '0, 0, 0') { // black
    return 'f';
  } else {
    return 'f';
  }
}

function compress(data) {
  //initialize strings
  let firstPass = '';
  let result = '';

  //First pass encoding: From pixel arrays to individual characters
  for (let i = 0; i < data.length; i++) {
    firstPass += encode(str(data[i][0]) + ', ' + str(data[i][1]) + ', ' + str(data[i][2]));
  }

  //Second pass encoding: collapsing repeat pixels
  let count = 0;
  for (let i = 0; i < firstPass.length; i++) {
    count++;
    if (firstPass.charAt(i) != firstPass.charAt(i + 1)) {
      result += firstPass.charAt(i) + str(count);
      count = 0;
    }
  }
  decompress(result);
  return result;
}




function decompress(data) {
  //initialize string
  let result = '';
  let count = 0;

  //check if character string is a number
  function isNumeric(s) {
    return !isNaN(s - parseFloat(s));
  }

  for (let i = 0; i < data.length; i++) {
    //make sure current character is a number before doing anything
    if (isNumeric(data.charAt(i)) == false) {
      let count = 0;
      // check how many characters ahead remains a number
      while (isNumeric(data.charAt(i + 1 + count))) {
        count++;
      }
      // get a slice of the number ahead, from one digit ahead to as many
      // characters as that number is
      let num = int(data.slice(i + 1, i + 1 + count));
      for (let j = 0; j < num; j++) {
        // for the quantity of that number, add the chacater to the result array
        result += data.charAt(i);
      }
    }
  }
  return result;
}
