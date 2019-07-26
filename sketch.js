let sketch;
let pixels = [];

let cellW, cellH;

let swatch1, swatch2, swatch3, swatch4, swatch5, swatch6, bg;

let undoState = 0;
let maxUndo = 100;
let savedGrids = [];

let dither = true;

let rowLen = 24; // cells
let colLen = 34; // cells

let brush = 2;
let activeColor;

let filename;
let menu = false;

let cursor = true;


function setup() {

  color1 = color(201, 33, 33); // red
  color2 = color(33, 33, 201); // blue
  color3 = color(255); // white
  color4 = color(120, 120, 120); // grey
  color5 = color(251, 190, 44); // gold
  color6 = color(0); // black
  bg = color(0);

  swatches = [color1, color2, color3, color4, color5, color6];
  activeColor = color1;


  noStroke();
  background(bg);


  sketch = document.getElementById('sketch-holder');

  cellW = sketch.offsetWidth / (rowLen);
  cellH = cellW * 0.7;

  let canvas = createCanvas(sketch.offsetWidth, cellH * colLen);

  loadSavedPixels();

  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  gridImg = createGraphics(rowLen, colLen);


  sketchListeners();
  select('#sketch-holder').style('padding-top: 0%;')

  createPalette();
  brushButtons();
  controlButtons();
  noLoop();
}

function draw() {
  noStroke();

  let pushCursorX = 0;
  let pushCursorY = 0;

  if (brush == 2) {
    pushCursorX = .5 * cellW;
    pushCursorY = 1 * cellH;
  } else if (brush == 3) {
    pushCursorY = -.5 * cellH;
  }



  let cellX = floor(map(mouseX + pushCursorX, 0, cellW * rowLen, 0, rowLen));
  let cellY = floor(map(mouseY + pushCursorY, 0, cellH * colLen, 0, colLen));

  if (mouseIsPressed && mouseX > 0 && mouseX < width && mouseY > 0 && mouseX) {
    let pcellX = floor(map(pmouseX + pushCursorX, 0, cellW * rowLen, 0, rowLen));
    let pcellY = floor(map(pmouseY + pushCursorY, 0, cellH * colLen, 0, colLen));

    let maxLerp = 1;
    maxLerp = dist(pmouseX, pmouseY, mouseX, mouseY) + 1;
    maxLerp = constrain(maxLerp, 0, 200);

    for (let i = 0; i < maxLerp; i++) {

      // interpolate to from pcellCoord to the ycellCoord
      pcellX = lerp(pcellX, cellX, 0.04);
      pcellY = lerp(pcellY, cellY, 0.04);

      // do not round the lerp values since. Only the final coordinates used for painting while interpoloation continues to happen
      let x = round(pcellX);
      let y = round(pcellY);

      if (brush == 1) {
        checkPixel(x, y);
      } else if (brush == 2) {
        checkPixel(x, y);
        checkPixel(x, y - 1);
        checkPixel(x, y - 2);
        checkPixel(x - 1, y);
        checkPixel(x - 1, y - 1);
        checkPixel(x - 1, y - 2);
      } else if (brush == 3) {
        checkPixel(x, y - 1);
        checkPixel(x, y);
        checkPixel(x, y + 1);
        checkPixel(x, y + 2);
        //
        checkPixel(x + 1, y - 1);
        checkPixel(x + 1, y);
        checkPixel(x + 1, y + 1);
        checkPixel(x + 1, y + 2);
        //
        checkPixel(x - 1, y - 1);
        checkPixel(x - 1, y);
        checkPixel(x - 1, y + 1);
        checkPixel(x - 1, y + 2);
      }
    }
  }

  drawPixels();

  fill(255, 100);
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height && cursor == true) {

    //take new cell values without CursorPushY that can take rgb values from
    //within the pixel color values from within the array bounds
    let colorCellX = floor(map(mouseX, 0, cellW * rowLen, 0, rowLen));
    let colorCellY = floor(map(mouseY, 0, cellH * colLen, 0, colLen));

    let r = red(pixels[(rowLen * colorCellY) + colorCellX]);
    let g = green(pixels[(rowLen * colorCellY) + colorCellX]);
    let b = blue(pixels[(rowLen * colorCellY) + colorCellX]);


    if ((r + g + b) / 3 > 200) {
      fill(55, 100);
    } else {
      fill(200, 100);
    }
    if (brush == 1) {
      //fill(red(activeColor), green(activeColor), blue(activeColor), 150);
      // rect(mouseX - cellW * .5, mouseY - cellH * .5, cellW, cellH);
      rect(cellX * cellW, cellY * cellH, cellW, cellH);
    } else if (brush == 2) {
      // rect(mouseX - cellW * 1.5, mouseY - cellH * 1.5, cellW * 2, cellH * 2);
      rect((cellX - 1) * cellW, (cellY - 2) * cellH, cellW * 2, cellH * 3);
    } else if (brush == 3) {
      //rect(mouseX - cellW * 1.5, mouseY - cellH * 1.5, cellW * 3, cellH * 4);
      rect((cellX - 1) * cellW, (cellY - 1) * cellH, cellW * 3, cellH * 4);
    }
  }

  noStroke();
  let fps = frameRate();

  drawGrid();

  pmouseX = mouseX;
  pmouseY = mouseY;
}


function windowResized() {
  sketch = document.getElementById('sketch-holder')
  cellW = sketch.offsetWidth / (rowLen);
  cellH = cellW * 0.7;
  resizeCanvas(sketch.offsetWidth, cellW * .7 * colLen);
}

function canvasPressed() {
  saveGrid();
  pmouseX = mouseX;
  pmouseY = mouseY;
  loop();
}


function canvasReleased() {
  sendImage();
  localStorage.setItem("pixels", JSON.stringify(pixels));
  noLoop();
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

function checkPixel(x, y) {
  if (x >= 0 && x < rowLen && y >= 0 && y < colLen) {
    if (dither == false) {
      pixels[(rowLen * y) + x] = activeColor;
    } else if (dither == true) {
      if (x % 2 == 0 && (y % 4 == 0 || y % 4 == 1)) {
        pixels[(rowLen * y) + x] = activeColor;
      }
      if (x % 2 == 1 && (y % 4 == 2 || y % 4 == 3)) {
        pixels[(rowLen * y) + x] = activeColor;
      }
    }
  }
}

function loadSavedPixels() {
  for (let i = 0; i < rowLen * colLen; i++) {
    pixels[i] = bg;
  }

  if (localStorage.getItem("pixels")) {
    let storedPixels = JSON.parse(localStorage.getItem("pixels"));
    if (storedPixels.length == pixels.length) {
      for (let i = 0; i < rowLen * colLen; i++) {
        let r = storedPixels[i].levels[0]
        let g = storedPixels[i].levels[1]
        let b = storedPixels[i].levels[2]
        pixels[i] = color(r, g, b);
      }
    }
    sendImage();
  }
}

function cursorOn() {
  cursor = true;
}

function cursorOff() {
  cursor = false;
  redraw(); // redraw the canvas one time to remove the cursor
}

function sketchListeners() {
  // Prevent scrolling on touch screens when over the Canvas
  sketch.addEventListener('touchstart', function(event) {
    event.preventDefault()
    cursor = false;
  });

  /*mouseDragged is not an equivilent method for p5js, so use touchMoved
  to achiveve the same effect.
  */
  select('#sketch-holder').touchMoved(redraw); // Support touch devices
  select('#sketch-holder').mouseMoved(redraw);

  // Hides cursor when mouse is not on the canvas
  select('#sketch-holder').mouseOver(cursorOn);
  select('#sketch-holder').mouseOut(cursorOff);

  select('#sketch-holder').touchStarted(canvasPressed); // Support touch devices
  select('#sketch-holder').mousePressed(canvasPressed);

  select('#sketch-holder').touchEnded(canvasReleased); // Support touch devices
  select('#sketch-holder').mouseReleased(canvasReleased);
}
