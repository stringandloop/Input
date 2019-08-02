var database = firebase.database();

var path = database.ref('backers/');

var data = {
  pixels: pixels
}

//Read data
path.on('value', gotData, errData);

function gotData(data){
  console.log('Read Successful:');
  console.log(data.val());
}

function errData(err){
 console.log('Read Error!');
 console.log(err);
}

//Write data
path.update(data, finished);

function finished(err) {
  if (err) {
    console.log('Write Error!');
    console.log(err);
  } else {
   console.log('Write Successful:');
   console.log(data);
  }
}
