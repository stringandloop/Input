let swatch1, swatch2, swatch3, swatch4, swatch5, swatch6;
let cellW;
let cellH;

let bg = 0;
let undoState = 0;
let maxUndo = 50;
let savedGrids = [];

let rowLen = 20; // cells
let colLen = 28; // cells

let brush = 2;
let activeColor;

let pixels = [];
let sketch;
let gridImg;

function setup() {
  background(0);



  color1 = color(201, 33, 33); // red
  color2 = color(33, 33, 201); // blue
  color3 = color(255); // white
  color4 = color(120, 120, 120); // grey
  color5 = color(251, 190, 44); // gold
  color6 = color(0); // black
  swatches = [color1, color2, color3, color4, color5, color6];
  activeColor = color1;

  sketch = document.getElementById('sketch-holder');
  cellW = sketch.offsetWidth / (rowLen);
  let canvas = createCanvas(sketch.offsetWidth, cellW * .7 * colLen);
  pg = createGraphics(100, 100);
  cellW = sketch.offsetWidth / rowLen;
  cellH = cellW * 0.7;
  gridImg = createGraphics(rowLen, colLen);
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  background(0, 0, 200);
  noCursor();

  for (let i = 0; i < rowLen * colLen; i++) {
    pixels[i] = color6;
  }

  //gridX = cellW;
  //gridY = (sketch.offsetHeight - cellH * colLen) /2

  //createSwatches(sketch.offsetWidth*.66);
  createSwatch(swatch1, 'swatch1', color1);
  createSwatch(swatch2, 'swatch2', color2);
  createSwatch(swatch3, 'swatch3', color3);
  createSwatch(swatch4, 'swatch4', color4);
  createSwatch(swatch5, 'swatch5', color5);
  createSwatch(swatch6, 'swatch6', color6);

  brushSize();
  topButtons();
}

function draw() {
  noStroke();

  if (mouseIsPressed) {

    //Labels where the mouse is relative to the grid being 0
    let coordX = mouseX;
    let coordY = mouseY;

    //Labels where the mouse was relative to the grid being 0
    let pcoordX = pmouseX;
    let pcoordY = pmouseY;


    //Labels which cell the mouse was in relative to the grid being 0

    let pcellCoordX = floor(map(pcoordX, 0, cellW * rowLen, 0, rowLen));
    let pcellCoordY = floor(map(pcoordY, 0, cellH * colLen, 0, colLen));
    let cellCoordX = floor(map(mouseX, 0, cellW * rowLen, 0, rowLen));
    let cellCoordY = floor(map(mouseY, 0, cellH * colLen, 0, colLen));

    let maxLerp = 1;
    maxLerp = dist(pcoordX, pcoordY, coordX, coordY) + 1;
    maxLerp = constrain(maxLerp, 0, 200);

    for (let i = 0; i < maxLerp; i++) {

      // interpolate to from pcellCoord to the ycellCoord
      pcellCoordX = lerp(pcellCoordX, cellCoordX, 0.04);
      pcellCoordY = lerp(pcellCoordY, cellCoordY, 0.04);

      // do not round the lerp values since. Only the final coordinates used for painting while interpoloation continues to happen
      let x = round(pcellCoordX);
      let y = round(pcellCoordY);

      if (brush == 1) {
        paintPixel(x, y);
      } else if (brush == 2) {
        paintPixel(x, y);
        paintPixel(x, y - 1);
        paintPixel(x - 1, y);
        paintPixel(x - 1, y - 1);
      } else if (brush == 3) {
        paintPixel(x, y);
        paintPixel(x, y - 1);
        paintPixel(x, y + 1);
        paintPixel(x, y + 2);
        //
        paintPixel(x + 1, y - 1);
        paintPixel(x + 1, y);
        paintPixel(x + 1, y + 1);
        paintPixel(x + 1, y + 2);
        //
        paintPixel(x - 1, y - 1);
        paintPixel(x - 1, y);
        paintPixel(x - 1, y + 1);
        paintPixel(x - 1, y + 2);
        //
      }
    }
  }
  drawPixels();

  drawGrid();
  noFill();


  strokeWeight(1);
  stroke(255, 100);

  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (brush == 1) {
      fill(red(activeColor), green(activeColor), blue(activeColor), 150);
      rect(mouseX - cellW * .5, mouseY - cellH * .5, cellW, cellH);
    }
    if (brush == 2) {
      fill(red(activeColor), green(activeColor), blue(activeColor), 150);
      rect(mouseX - cellW * 1.5, mouseY - cellH * 1.5, cellW * 2, cellH * 2);
    }
    if (brush == 3) {
      fill(red(activeColor), green(activeColor), blue(activeColor), 150);
      rect(mouseX - cellW * 1.5, mouseY - cellH * 1.5, cellW * 3, cellH * 4);
    }
  }
  noStroke();
  strokeWeight(1);
}


function windowResized() {
  sketch = document.getElementById('sketch-holder')
  cellW = sketch.offsetWidth / (rowLen);
  cellH = cellW * 0.7;
  resizeCanvas(sketch.offsetWidth, cellW * .7 * colLen);
}

function createSwatch(element, name, color) {
  element = select('#' + str(name))
  element.style('backgroundColor', str(color));
  element.mousePressed(pressed(color, name));
  element.style('outline', 'solid 1px lightgrey');
}

function brushSize() {
  select('#plus-button').mousePressed(plus);
  select('#minus-button').mousePressed(minus);
}

function topButtons() {
  select('canvas').touchStarted(saveGrid);
  select('#undo-button').mousePressed(undo);
  select('#undo-button').style('opacity: .15;')
  select('#save-button').mousePressed(saveButton);
}

function saveButton() {
  for (let i = 0; i < rowLen; i++) {
    for (let j = 0; j < colLen; j++) {
      gridImg.noStroke();
      gridImg.fill(pixels[(rowLen * j) + i]);
      gridImg.rect(i, j, 1, 1);
    }
  }
  save(gridImg, 'stringandloop-input.png');
}


function undo() {
  if (undoState > 0) {
    for (let i = 0; i < rowLen * colLen; i++) {
      pixels[i] = savedGrids[undoState][i];
    }
    undoState = undoState - 1;
  }
  if (undoState == 0) {
    select('#undo-button').style('opacity: .15;')
  }
  print(undoState);
}

function saveGrid() {

  // If capped off at the max undo, set undoState to the limit and shift array
  if (undoState > maxUndo - 1) {
    undoState = maxUndo - 1;
    for (let i = 0; i < maxUndo; i++) {
      savedGrids[i] = savedGrids[i + 1];
    }
  }
  select('#undo-button').style('opacity: 1;')
  undoState += 1;
  savedGrids[undoState] = [];
  for (let i = 0; i < rowLen * colLen; i++) {
    savedGrids[undoState][i] = pixels[i];
  }
}

function minus() {
  print('triggerd');
  if (brush == 3) {
    brush = 2;
    select('#minus-button').style('opacity: 1;')
  } else if (brush == 2) {
    brush = 1;
    select('#minus-button').style('opacity: .15;')
  }
}

function plus() {
  if (brush == 1) {
    brush = 2;
    select('#plus-button').style('opacity: 1;')
  } else if (brush == 2) {
    brush = 3;
    select('#plus-button').style('opacity: .15;')
  }
}

function pressed(color, name) {
  return function() {
    bg = 0;
    activeColor = color;
    select('#swatch1').style('outline', 'solid 1px lightgrey');
    select('#swatch2').style('outline', 'solid 1px lightgrey');
    select('#swatch3').style('outline', 'solid 1px lightgrey');
    select('#swatch4').style('outline', 'solid 1px lightgrey');
    select('#swatch5').style('outline', 'solid 1px lightgrey');
    select('#swatch6').style('outline', 'solid 1px lightgrey');

    select('#' + str(name)).style('outline', 'solid 4px black');
    //urlTest();
  }
}

function paintPixel(x, y) {
  if (x >= 0 && x < rowLen && y >= 0 && y < colLen) {
    pixels[(rowLen * y) + x] = activeColor;
  }
}


function mousePressed() {
  if (mouseX > 0  && mouseX < width && mouseY > 0 && mouseY < height) {
    return false;
  }
}

function touchStarted() {
  if (mouseX > 0  && mouseX < width && mouseY > 0 && mouseY < height) {
    return false;
  }
}



function urlPass() {

  //print(a);
}

function mouseReleased() {
  background(0);
  drawPixels();
  let a = canvas.toDataURL("image/png");
  select('#preview-image').style('background-image', 'url("' + str(a) + '")');
}


function drawPixels() {
  for (let i = 0; i < rowLen; i++) {
    for (let j = 0; j < colLen; j++) {
      let pixel = pixels[(rowLen * j) + i];
      fill(pixel);
      rect(cellW * i, cellH * j, cellW, cellH);
    }
  }
}

function drawGrid() {
  stroke(255, 100);
  for (let i = 0; i <= rowLen; i++) {
    line(i * cellW, 0, i * cellW, height);
  }

  for (let i = 0; i <= colLen; i++) {
    line(0, i * cellH, width, i * cellH);
  }
  line(0, height - 1, width, height - 1);
  noStroke();
}
