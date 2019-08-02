let rowLen = 24; // cells
let colLen = 34; // cells

let p0, p1, p2, p3, p4, p5, p6, p7, p8, p9;
let p10, p11, p12, p13, p14, p15, p16, p17, p18, p19;
let p20, p21, p22, p23, p24, p25, p26, p27, p28, p29;
let p30, p31, p32, p33, p34, p35, p36, p37, p38, p39;
let p40, p41, p42, p43, p44, p45, p46, p47, p48, p49;
let p50, p51, p52, p53, p54, p55;

let previewArray = [];

function setup() {

  var database = firebase.database();
  var path = database.ref('backers');

  makeImages();


  //Read data
  path.orderByChild('plot').on('child_added', gotData, errData);

  function gotData(data) {
    console.log('Read Successful:');
    //console.log(data.val());

    //    console.log(data.val().pixels);
    let plot = (data.val().plot - 1);

    for (let i = 0; i < rowLen; i++) {
      for (let j = 0; j < colLen; j++) {
        let pix = data.val().pixels[index(i, j)];
        previewArray[plot].fill(pix);
        previewArray[plot].rect(i * 2, j * 2, 2, 2);
      }
    }
    redraw();
  }

  function errData(err) {
    console.log('Read Error!');
    console.log(err);
  }

  let canvas = createCanvas(400, 800);
  canvas.parent('preview');
  background(0);
}


function index(x, y) {
  return (rowLen * y + x);
}


function makeImages() {
  p0 = createGraphics(rowLen * 2, colLen * 2);
  p1 = createGraphics(rowLen * 2, colLen * 2);
  p2 = createGraphics(rowLen * 2, colLen * 2);
  p3 = createGraphics(rowLen * 2, colLen * 2);
  p4 = createGraphics(rowLen * 2, colLen * 2);
  p5 = createGraphics(rowLen * 2, colLen * 2);
  p6 = createGraphics(rowLen * 2, colLen * 2);
  p7 = createGraphics(rowLen * 2, colLen * 2);
  p8 = createGraphics(rowLen * 2, colLen * 2);
  p9 = createGraphics(rowLen * 2, colLen * 2);

  p10 = createGraphics(rowLen * 2, colLen * 2);
  p11 = createGraphics(rowLen * 2, colLen * 2);
  p12 = createGraphics(rowLen * 2, colLen * 2);
  p13 = createGraphics(rowLen * 2, colLen * 2);
  p14 = createGraphics(rowLen * 2, colLen * 2);
  p15 = createGraphics(rowLen * 2, colLen * 2);
  p16 = createGraphics(rowLen * 2, colLen * 2);
  p17 = createGraphics(rowLen * 2, colLen * 2);
  p18 = createGraphics(rowLen * 2, colLen * 2);
  p19 = createGraphics(rowLen * 2, colLen * 2);

  p20 = createGraphics(rowLen * 2, colLen * 2);
  p21 = createGraphics(rowLen * 2, colLen * 2);
  p22 = createGraphics(rowLen * 2, colLen * 2);
  p23 = createGraphics(rowLen * 2, colLen * 2);
  p24 = createGraphics(rowLen * 2, colLen * 2);
  p25 = createGraphics(rowLen * 2, colLen * 2);
  p26 = createGraphics(rowLen * 2, colLen * 2);
  p27 = createGraphics(rowLen * 2, colLen * 2);
  p28 = createGraphics(rowLen * 2, colLen * 2);
  p29 = createGraphics(rowLen * 2, colLen * 2);

  p30 = createGraphics(rowLen * 2, colLen * 2);
  p31 = createGraphics(rowLen * 2, colLen * 2);
  p32 = createGraphics(rowLen * 2, colLen * 2);
  p33 = createGraphics(rowLen * 2, colLen * 2);
  p34 = createGraphics(rowLen * 2, colLen * 2);
  p35 = createGraphics(rowLen * 2, colLen * 2);
  p36 = createGraphics(rowLen * 2, colLen * 2);
  p37 = createGraphics(rowLen * 2, colLen * 2);
  p38 = createGraphics(rowLen * 2, colLen * 2);
  p39 = createGraphics(rowLen * 2, colLen * 2);

  p40 = createGraphics(rowLen * 2, colLen * 2);
  p41 = createGraphics(rowLen * 2, colLen * 2);
  p42 = createGraphics(rowLen * 2, colLen * 2);
  p43 = createGraphics(rowLen * 2, colLen * 2);
  p44 = createGraphics(rowLen * 2, colLen * 2);
  p45 = createGraphics(rowLen * 2, colLen * 2);
  p46 = createGraphics(rowLen * 2, colLen * 2);
  p47 = createGraphics(rowLen * 2, colLen * 2);
  p48 = createGraphics(rowLen * 2, colLen * 2);
  p49 = createGraphics(rowLen * 2, colLen * 2);

  p50 = createGraphics(rowLen * 2, colLen * 2);
  p51 = createGraphics(rowLen * 2, colLen * 2);
  p52 = createGraphics(rowLen * 2, colLen * 2);
  p53 = createGraphics(rowLen * 2, colLen * 2);
  p54 = createGraphics(rowLen * 2, colLen * 2);
  p55 = createGraphics(rowLen * 2, colLen * 2);

  previewArray = [p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32, p33, p34, p35, p36, p37, p38, p39, p40, p41, p42, p43, p44, p45, p46, p47, p48, p49, p50, p51, p52, p53, p54, p55];

  for (let i = 0; i < previewArray.length; i++) {
    previewArray[i].noStroke();
    previewArray[i].textAlign(CENTER);
    previewArray[i].fill(255);
    previewArray[i].textSize(6);
    previewArray[i].text('Loading...', previewArray[i].width / 2, previewArray[i].height / 2);
  }
}


function draw() {

  for (let i = 0; i < previewArray.length; i++) {
    image(previewArray[i], width / 6 * i, 0, width / 6, width / 6);
  }
  noLoop();
}
