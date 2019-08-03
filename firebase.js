var database = firebase.database();

var data = {}

function read(uid) {
  //Read data
  var path = database.ref('backers/' + str(uid));
  path.orderByChild('plot').once('child_added', gotData, errData);
}

function gotData(data) {

  console.log('Read Successful:');
  console.log(data.val());
}

function errData(err) {
  console.log('Read Error!');
  console.log(err);
}

function write(uid) {
  data = {
    pixels: compressedPixels,
    h: colLen,
    w: rowLen,
    t: new Date().toGMTString()
  }
//Write data

var path = database.ref('backers/' + str(uid));

path.update(data, finished);
}

function finished(err) {
  if (err) {
    alert('Write Error!');
    console.log(err);
  } else {
    alert('Write Successful:');
    console.log(data);
  }
}
