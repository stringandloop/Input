let rowLen = 24; // cells
let colLen = 34; // cells

let p0, p1, p2, p3, p4, p5, p6, p7, p8, p9;
let p10, p11, p12, p13, p14, p15, p16, p17, p18, p19;
let p20, p21, p22, p23, p24, p25, p26, p27, p28, p29;
let p30, p31, p32, p33, p34, p35, p36, p37, p38, p39;
let p40, p41, p42, p43, p44, p45, p46, p47, p48, p49;
let p50, p51, p52, p53, p54, p55, p56, p57, p58, p59;

let previewArray = [];
let plotsTaken = [];

let color1, color2, color3, color4, color5, color6, bg;

function setup() {

  color1 = [201, 33, 33]; // red
  color2 = [33, 33, 201]; // blue
  color3 = [255, 255, 255]; // white
  color4 = [120, 120, 120]; // grey
  color5 = [251, 190, 44]; // gold
  color6 = [0, 0, 0]; // black
  bg = [0, 0, 0];

  var database = firebase.database();
  var path = database.ref('backers');
  imageMode(CENTER);
  makeImages();


  path.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        let pixels = childSnapshot.val().pixels;
        let plot = childSnapshot.val().plot;
        if (pixels && plot > -1 && plot < 56) {
          drawImage(pixels, plot);
        } else {

        }
      });
    },

    function(error) {
      alert(error);
    });

  let canvas = createCanvas(300, 600);
  canvas.parent('preview');
  background(0);
}

function draw() {
  background(0);
  for (let i = 0; i < previewArray.length; i++) {
    let padding = (width / 168 * 3)
    let x = (i % 6) * (width / 6);
    let y = floor(i / 6) * (height / 10);
    let w = width / 6;
    image(previewArray[i], x + w / 2, y + w / 2, w - padding, w - padding);
  }
  noLoop();
}


function drawImage(pixels, plot) {
  for (let i = 0; i < rowLen; i++) {
    for (let j = 0; j < colLen; j++) {
      let pixel = pixels.charAt(index(i, j));
      let fill = decode(pixel);
      previewArray[plot].fill(fill);
      previewArray[plot].rect(i * 7, j * 5, 7, 5);
    }
    redraw();
  }
}

function errData(err) {
  console.log('Read Error!');
  console.log(err);
}


function index(x, y) {
  return (rowLen * y + x);
}


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


function windowResized() {
  sketch = document.getElementById('preview')
  //resizeCanvas(200, 400);
}


function makeImages() {
  p0 = createGraphics(rowLen * 7, colLen * 5);
  p1 = createGraphics(rowLen * 7, colLen * 5);
  p2 = createGraphics(rowLen * 7, colLen * 5);
  p3 = createGraphics(rowLen * 7, colLen * 5);
  p4 = createGraphics(rowLen * 7, colLen * 5);
  p5 = createGraphics(rowLen * 7, colLen * 5);
  p6 = createGraphics(rowLen * 7, colLen * 5);
  p7 = createGraphics(rowLen * 7, colLen * 5);
  p8 = createGraphics(rowLen * 7, colLen * 5);
  p9 = createGraphics(rowLen * 7, colLen * 5);

  p10 = createGraphics(rowLen * 7, colLen * 5);
  p11 = createGraphics(rowLen * 7, colLen * 5);
  p12 = createGraphics(rowLen * 7, colLen * 5);
  p13 = createGraphics(rowLen * 7, colLen * 5);
  p14 = createGraphics(rowLen * 7, colLen * 5);
  p15 = createGraphics(rowLen * 7, colLen * 5);
  p16 = createGraphics(rowLen * 7, colLen * 5);
  p17 = createGraphics(rowLen * 7, colLen * 5);
  p18 = createGraphics(rowLen * 7, colLen * 5);
  p19 = createGraphics(rowLen * 7, colLen * 5);

  p20 = createGraphics(rowLen * 7, colLen * 5);
  p21 = createGraphics(rowLen * 7, colLen * 5);
  p22 = createGraphics(rowLen * 7, colLen * 5);
  p23 = createGraphics(rowLen * 7, colLen * 5);
  p24 = createGraphics(rowLen * 7, colLen * 5);
  p25 = createGraphics(rowLen * 7, colLen * 5);
  p26 = createGraphics(rowLen * 7, colLen * 5);
  p27 = createGraphics(rowLen * 7, colLen * 5);
  p28 = createGraphics(rowLen * 7, colLen * 5);
  p29 = createGraphics(rowLen * 7, colLen * 5);

  p30 = createGraphics(rowLen * 7, colLen * 5);
  p31 = createGraphics(rowLen * 7, colLen * 5);
  p32 = createGraphics(rowLen * 7, colLen * 5);
  p33 = createGraphics(rowLen * 7, colLen * 5);
  p34 = createGraphics(rowLen * 7, colLen * 5);
  p35 = createGraphics(rowLen * 7, colLen * 5);
  p36 = createGraphics(rowLen * 7, colLen * 5);
  p37 = createGraphics(rowLen * 7, colLen * 5);
  p38 = createGraphics(rowLen * 7, colLen * 5);
  p39 = createGraphics(rowLen * 7, colLen * 5);

  p40 = createGraphics(rowLen * 7, colLen * 5);
  p41 = createGraphics(rowLen * 7, colLen * 5);
  p42 = createGraphics(rowLen * 7, colLen * 5);
  p43 = createGraphics(rowLen * 7, colLen * 5);
  p44 = createGraphics(rowLen * 7, colLen * 5);
  p45 = createGraphics(rowLen * 7, colLen * 5);
  p46 = createGraphics(rowLen * 7, colLen * 5);
  p47 = createGraphics(rowLen * 7, colLen * 5);
  p48 = createGraphics(rowLen * 7, colLen * 5);
  p49 = createGraphics(rowLen * 7, colLen * 5);

  p50 = createGraphics(rowLen * 7, colLen * 5);
  p51 = createGraphics(rowLen * 7, colLen * 5);
  p52 = createGraphics(rowLen * 7, colLen * 5);
  p53 = createGraphics(rowLen * 7, colLen * 5);
  p54 = createGraphics(rowLen * 7, colLen * 5);
  p55 = createGraphics(rowLen * 7, colLen * 5);
  p56 = createGraphics(rowLen * 7, colLen * 5);
  p57 = createGraphics(rowLen * 7, colLen * 5);
  p58 = createGraphics(rowLen * 7, colLen * 5);
  p59 = createGraphics(rowLen * 7, colLen * 5);

  previewArray = [p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32, p33, p34, p35, p36, p37, p38, p39, p40, p41, p42, p43, p44, p45, p46, p47, p48, p49, p50, p51, p52, p53, p54, p55, p56, p57, p58, p59];

  for (let i = 0; i < previewArray.length; i++) {
    previewArray[i].noStroke();
    previewArray[i].textAlign(CENTER);
    previewArray[i].fill(255);
    previewArray[i].textSize(32);

    if (i == 30 || i == 31 || i == 34 || i == 35) {
      previewArray[i].fill(255, 0, 0);
      previewArray[i].text('Heel', previewArray[i].width / 2, previewArray[i].height / 2 + 16);
      previewArray[i].fill(255);
    } else {
      previewArray[i].text('Plot ' + i, previewArray[i].width / 2, previewArray[i].height / 2 + 16);
    }
  }
}
