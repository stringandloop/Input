var database = firebase.database();
var data = {}


function read(uid) {
  //Read data
  var path = database.ref('backers/' + str(uid));
  path.once('value', gotData, errData);

  function gotData(data) {
    console.log('Read Successful:');
    console.log(data.val());
    return (data.val());
  }

  function errData(err) {
    console.log('Read Error!');
    console.log(err);
  }
}


function write(uid) {
  compressedPixels = compress(pixels);

  data = {
    pixels: compressedPixels,
    height: colLen,
    width: rowLen,
    timestamp: new Date().toGMTString(),
  }

  var path = database.ref('backers/' + str(uid));

  path.update(data, finished);

  function finished(err) {
    if (err) {
      alert('Write Error!');
      console.log(err);
    } else {
      alert('Write Successful:');
      console.log('Wrote to server: ', data);
      save(gridImg, 'stringandloop-input.png');
    }
  }
}
