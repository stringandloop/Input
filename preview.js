let rowLen = 28; // cells
let colLen = 40; // cells

let p0, p1, p2, p3, p4, p5, p6, p7, p8, p9;
let p10, p11, p12, p13, p14, p15, p16, p17, p18, p19;
let p20, p21, p22, p23, p24, p25, p26, p27, p28, p29;
let p30, p31, p32, p33, p34, p35, p36, p37, p38, p39;
let p40, p41, p42, p43, p44, p45, p46, p47, p48, p49;
let p50, p51, p52, p53, p54, p55, p56, p57, p58, p59;

let previewArray = [];
let plotsDrawn = [];

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

  path.on('child_added', function(data) {
    // get the value of the current plot and updated pixels
    let pixels = data.val().pixels;
    pixels = decompress(pixels);
    let plot = data.val().plot;
    // validate pixels and plot location
    if (pixels && plot > -1 && heelCheck(plot) == true && plot < 60) {
      // store the value of the plot and pixels that have been drawn in a dictionary
      plotsDrawn[data.key] = plot;
      //draw the new image
      drawImage(plot, pixels);
      redraw();
    }
  });

  path.on('child_changed', function(data) {
    // get the value of the current plot and updated pixels
    let pixels = data.val().pixels;
    pixels = decompress(pixels);
    let plot = data.val().plot;
    // validate pixels and plot location
    if (pixels && plot > -1 && heelCheck(plot) == true && plot < 60) {
      // reset the plot that was drawn previously
      clearImage(plotsDrawn[data.key]);
      // update the record with the plot that the user now owns
      plotsDrawn[data.key] = plot;
      //draw the new image

      drawImage(plot, pixels);
      redraw();
    }
  });


  let canvas = createCanvas(300, 600);
  canvas.parent('preview');
  background(0);
}


function draw() {
  background(0);
  for (let i = 0; i < previewArray.length; i++) {
    let x = (i % 6) * (width / 6);
    let y = floor(i / 6) * (height / 10);
    let w = width / 6;
    image(previewArray[i], x + w / 2, y + w / 2, w, w);
  }
  noLoop();
}


function drawImage(plot, pixels) {
  for (let i = 0; i < rowLen; i++) {
    for (let j = 0; j < colLen; j++) {
      let pixel = pixels.charAt(index(i, j));
      let fill = decode(pixel);
      previewArray[plot].fill(fill);
      previewArray[plot].rect(i * 7, j * 5, 7, 5);
    }
  }
}


function clearImage(plot) {
  previewArray[plot].background(bg);
  previewArray[plot].noStroke();
  previewArray[plot].textAlign(CENTER);
  previewArray[plot].fill(255);
  previewArray[plot].textSize(32);

  if (plot == 30 || plot == 31 || plot == 34 || plot == 35) {
    previewArray[plot].fill(255, 0, 0);
    previewArray[plot].text('Heel', previewArray[plot].width / 2, previewArray[plot].height / 2 + 16);
    previewArray[plot].fill(255);
  } else {
    previewArray[plot].text('Plot ' + plot, previewArray[plot].width / 2, previewArray[plot].height / 2 + 16);
  }
}


function errData(err) {
  console.log('Read Error!');
  console.log(err);
}


function index(x, y) {
  return (rowLen * y + x);
}


function windowResized() {
  sketch = document.getElementById('preview')
  //resizeCanvas(200, 400);
}

function heelCheck(plot) {
  if (plot == 30 || plot == 31 || plot == 34 || plot == 35) {
    return false;
  }
  return true;
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
    clearImage(i);
  }
}
